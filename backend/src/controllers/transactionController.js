'use strict';

const Transaction = require('../models/Transaction');
const Customer = require('../models/Customer');
const { withTransaction } = require('../config/database');
const { paginate } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * GET /transactions
 * All transactions for the authenticated user (latest first).
 */
const listTransactions = async (req, res, next) => {
  try {
    const { limit = 20, cursor } = req.query;
    const { data, hasMore, nextCursor } = await Transaction.findAllByUser({
      userId: req.user.id,
      limit,
      cursor,
    });

    res.json({
      success: true,
      ...paginate({ data, total: data.length, limit: parseInt(limit, 10), offset: 0, nextCursor }),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /customers/:customerId/transactions
 */
const listByCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const { limit = 20, cursor, type } = req.query;

    const customer = await Customer.findById(customerId, req.user.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const { data, hasMore, nextCursor } = await Transaction.findByCustomer({
      customerId,
      userId: req.user.id,
      limit,
      cursor,
      type,
    });

    res.json({
      success: true,
      customer: { id: customer.customer_id, name: customer.name, balance: customer.balance },
      ...paginate({ data, total: data.length, limit: parseInt(limit, 10), offset: 0, nextCursor }),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /customers/:customerId/transactions/:id
 */
const getTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tx = await Transaction.findById(id, req.user.id);
    if (!tx) return res.status(404).json({ success: false, message: 'Transaction not found' });
    res.json({ success: true, data: tx });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /customers/:customerId/transactions
 * Creates a transaction and atomically updates the customer's running balance.
 */
const createTransaction = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const { type, amount, description, referenceNo } = req.body;

    // Validate customer ownership
    const customer = await Customer.findById(customerId, req.user.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const amountPaise = Math.round(parseFloat(amount) * 100);
    if (amountPaise <= 0) {
      return res.status(422).json({ success: false, message: 'Amount must be greater than zero' });
    }

    const delta = type === 'credit' ? amountPaise : -amountPaise;

    const tx = await withTransaction(async (client) => {
      const newBalance = await Customer.updateBalance(client, customerId, delta);
      return Transaction.create(client, {
        userId: req.user.id,
        customerId,
        type,
        amount: amountPaise,
        balanceAfter: newBalance,
        notes: description,
        referenceNo,
      });
    });

    logger.info('Transaction created', { userId: req.user.id, txId: tx.transaction_id, type, amount: amountPaise });
    res.status(201).json({ success: true, message: 'Transaction recorded', data: tx });
  } catch (err) {
    next(err);
  }
};

module.exports = { listTransactions, listByCustomer, getTransaction, createTransaction };
