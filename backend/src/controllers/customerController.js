'use strict';

const Customer = require('../models/Customer');
const { paginate } = require('../utils/helpers');
const { cacheDel, cacheGet, cacheSet } = require('../config/redis');
const logger = require('../utils/logger');

const CACHE_TTL = 60; // seconds

const cacheKey = (userId, suffix) => `customers:${userId}:${suffix}`;

/**
 * GET /customers
 */
const listCustomers = async (req, res, next) => {
  try {
    const { search, limit = 20, cursor, active } = req.query;
    const isActive = active === undefined ? undefined : active !== 'false';

    const { data, hasMore, nextCursor } = await Customer.findAll({
      userId: req.user.id,
      search,
      limit,
      cursor,
      isActive,
    });

    const total = await Customer.count(req.user.id);

    res.json({
      success: true,
      ...paginate({ data, total, limit: parseInt(limit, 10), offset: 0, nextCursor }),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /customers/:id
 */
const getCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ck = cacheKey(req.user.id, id);
    const cached = await cacheGet(ck);
    if (cached) return res.json({ success: true, data: cached });

    const customer = await Customer.findById(id, req.user.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    await cacheSet(ck, customer, CACHE_TTL);
    res.json({ success: true, data: customer });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /customers
 */
const createCustomer = async (req, res, next) => {
  try {
    const { name, phone, email, address, notes } = req.body;
    const customer = await Customer.create({
      userId: req.user.id,
      name,
      phone,
      email,
      address,
      notes,
    });

    logger.info('Customer created', { userId: req.user.id, customerId: customer.id });
    res.status(201).json({ success: true, message: 'Customer created', data: customer });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /customers/:id
 */
const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone, email, address, notes, is_active } = req.body;

    const updated = await Customer.update(id, req.user.id, {
      name,
      phone,
      email,
      address,
      notes,
      is_active,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    await cacheDel(cacheKey(req.user.id, id));
    res.json({ success: true, message: 'Customer updated', data: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /customers/:id  (soft-delete)
 */
const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Customer.remove(id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    await cacheDel(cacheKey(req.user.id, id));
    res.json({ success: true, message: 'Customer deactivated' });
  } catch (err) {
    next(err);
  }
};

module.exports = { listCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer };
