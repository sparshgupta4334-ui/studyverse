const TransactionModel = require('../models/Transaction');
const CustomerModel = require('../models/Customer');
const { getClient } = require('../config/database');
const { formatAmount, generateRefId } = require('../utils/helpers');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

const getByCustomer = async (req, res) => {
  const { customerId } = req.params;
  const { page, limit, startDate, endDate, type } = req.query;

  // Verify customer belongs to user
  const customer = await CustomerModel.findById(customerId, req.user.userId);
  if (!customer) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }

  const result = await TransactionModel.findByCustomer(customerId, req.user.userId, {
    page, limit, startDate, endDate, type,
  });

  res.status(200).json({
    success: true,
    data: result.transactions,
    pagination: result.pagination,
    customerBalance: parseFloat(customer.balance),
  });
};

const create = async (req, res) => {
  const { customerId, amount, type, notes } = req.body;
  const formattedAmount = formatAmount(amount);
  const referenceId = generateRefId('TXN');

  const client = await getClient();
  try {
    await client.query('BEGIN');

    // Verify customer belongs to user
    const customer = await client.query(
      'SELECT * FROM customers WHERE customer_id = $1 AND user_id = $2 AND is_active = true FOR UPDATE',
      [customerId, req.user.userId]
    );

    if (customer.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Create transaction
    const txn = await TransactionModel.create(
      {
        customerId,
        amount: formattedAmount,
        type,
        notes,
        referenceId,
        createdBy: req.user.userId,
      },
      client
    );

    // Update customer balance
    // credit = customer owes us money (positive balance)
    // debit = we owe customer money (negative balance)
    const balanceDelta = type === 'credit' ? formattedAmount : -formattedAmount;
    await CustomerModel.updateBalance(customerId, balanceDelta, client);

    await client.query('COMMIT');

    logger.info('Transaction created', {
      transactionId: txn.transaction_id,
      customerId,
      amount: formattedAmount,
      type,
      userId: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: txn,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getById = async (req, res) => {
  const txn = await TransactionModel.findById(req.params.id, req.user.userId);

  if (!txn) {
    return res.status(404).json({ success: false, message: 'Transaction not found' });
  }

  res.status(200).json({ success: true, data: txn });
};

const remove = async (req, res) => {
  const txn = await TransactionModel.findById(req.params.id, req.user.userId);

  if (!txn) {
    return res.status(404).json({ success: false, message: 'Transaction not found' });
  }

  const client = await getClient();
  try {
    await client.query('BEGIN');

    await TransactionModel.delete(req.params.id, req.user.userId);

    // Reverse the balance change
    const balanceDelta = txn.type === 'credit' ? -parseFloat(txn.amount) : parseFloat(txn.amount);
    await CustomerModel.updateBalance(txn.customer_id, balanceDelta, client);

    await client.query('COMMIT');

    logger.info('Transaction deleted', { transactionId: req.params.id, userId: req.user.userId });

    res.status(200).json({ success: true, message: 'Transaction deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getReport = async (req, res) => {
  const { period, startDate, endDate } = req.query;
  const { getDateRange } = require('../utils/helpers');

  let dateRange;
  if (startDate && endDate) {
    dateRange = { startDate, endDate };
  } else {
    dateRange = getDateRange(period || 'month');
  }

  const [summary, dailyBreakdown] = await Promise.all([
    TransactionModel.getReportSummary(req.user.userId, dateRange.startDate, dateRange.endDate),
    TransactionModel.getDailyBreakdown(req.user.userId, dateRange.startDate, dateRange.endDate),
  ]);

  res.status(200).json({
    success: true,
    data: {
      period: period || 'custom',
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      summary: {
        totalCredit: parseFloat(summary.total_credit || 0),
        totalDebit: parseFloat(summary.total_debit || 0),
        netAmount: parseFloat(summary.total_credit || 0) - parseFloat(summary.total_debit || 0),
        totalTransactions: parseInt(summary.total_transactions),
        customersInvolved: parseInt(summary.customers_involved),
      },
      dailyBreakdown: dailyBreakdown.map((d) => ({
        date: d.date,
        credit: parseFloat(d.credit),
        debit: parseFloat(d.debit),
        count: parseInt(d.count),
      })),
    },
  });
};

module.exports = { getByCustomer, create, getById, remove, getReport };
