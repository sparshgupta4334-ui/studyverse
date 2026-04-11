const CustomerModel = require('../models/Customer');
const logger = require('../utils/logger');

const getAll = async (req, res) => {
  const { q: search, page, limit, sortBy, sortOrder } = req.query;

  const result = await CustomerModel.findAll(req.user.userId, { search, page, limit, sortBy, sortOrder });

  res.status(200).json({
    success: true,
    data: result.customers,
    pagination: result.pagination,
  });
};

const getById = async (req, res) => {
  const customer = await CustomerModel.findById(req.params.id, req.user.userId);

  if (!customer) {
    return res.status(404).json({
      success: false,
      message: 'Customer not found',
    });
  }

  res.status(200).json({
    success: true,
    data: customer,
  });
};

const create = async (req, res) => {
  const { name, phone, email, notes } = req.body;

  const customer = await CustomerModel.create({
    userId: req.user.userId,
    name,
    phone,
    email,
    notes,
  });

  logger.info('Customer created', { customerId: customer.customer_id, userId: req.user.userId });

  res.status(201).json({
    success: true,
    message: 'Customer created successfully',
    data: customer,
  });
};

const update = async (req, res) => {
  const { name, phone, email, notes } = req.body;

  const customer = await CustomerModel.update(req.params.id, req.user.userId, { name, phone, email, notes });

  if (!customer) {
    return res.status(404).json({
      success: false,
      message: 'Customer not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Customer updated successfully',
    data: customer,
  });
};

const remove = async (req, res) => {
  const customer = await CustomerModel.findById(req.params.id, req.user.userId);

  if (!customer) {
    return res.status(404).json({
      success: false,
      message: 'Customer not found',
    });
  }

  await CustomerModel.delete(req.params.id, req.user.userId);

  logger.info('Customer deleted', { customerId: req.params.id, userId: req.user.userId });

  res.status(200).json({
    success: true,
    message: 'Customer deleted successfully',
  });
};

const getDashboardStats = async (req, res) => {
  const stats = await CustomerModel.getDashboardStats(req.user.userId);

  res.status(200).json({
    success: true,
    data: {
      totalCustomers: parseInt(stats.total_customers),
      totalReceivable: parseFloat(stats.total_receivable || 0),
      totalPayable: parseFloat(stats.total_payable || 0),
      customersToReceive: parseInt(stats.customers_to_receive),
      customersToPay: parseInt(stats.customers_to_pay),
    },
  });
};

module.exports = { getAll, getById, create, update, remove, getDashboardStats };
