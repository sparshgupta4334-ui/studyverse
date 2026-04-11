'use strict';

const Customer = require('../models/Customer');
const Transaction = require('../models/Transaction');
const { query, withTransaction } = require('../config/database');
const logger = require('../utils/logger');

/**
 * GET /sync
 * Returns all data modified after a given timestamp (for offline-first sync).
 * Clients send `lastSyncedAt` and receive only changed records.
 */
const pull = async (req, res, next) => {
  try {
    const { lastSyncedAt } = req.query;
    const since = lastSyncedAt ? new Date(lastSyncedAt) : new Date(0);

    if (isNaN(since.getTime())) {
      return res.status(422).json({ success: false, message: 'Invalid lastSyncedAt timestamp' });
    }

    const userId = req.user.id;

    const [customers, transactions] = await Promise.all([
      query(
        `SELECT * FROM customers
         WHERE user_id = $1 AND updated_at > $2
         ORDER BY updated_at ASC`,
        [userId, since],
      ),
      query(
        `SELECT * FROM transactions
         WHERE user_id = $1 AND updated_at > $2
         ORDER BY updated_at ASC`,
        [userId, since],
      ),
    ]);

    const syncedAt = new Date().toISOString();

    logger.debug('Sync pull', {
      userId,
      since,
      customers: customers.rowCount,
      transactions: transactions.rowCount,
    });

    res.json({
      success: true,
      syncedAt,
      data: {
        customers: customers.rows,
        transactions: transactions.rows,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /sync
 * Accept a batch of offline changes from the client.
 * Simple last-write-wins strategy; conflict detection is left to the client.
 */
const push = async (req, res, next) => {
  try {
    const { customers = [], transactions = [] } = req.body;
    const userId = req.user.id;

    const results = { customers: [], transactions: [], errors: [] };

    // Process customer upserts
    for (const c of customers) {
      try {
        const existing = await Customer.findById(c.id, userId);
        let record;
        if (existing) {
          record = await Customer.update(c.id, userId, {
            name: c.name,
            phone: c.phone,
            email: c.email,
            address: c.address,
            notes: c.notes,
            is_active: c.is_active,
          });
        } else {
          record = await Customer.create({
            userId,
            name: c.name,
            phone: c.phone,
            email: c.email,
            address: c.address,
            notes: c.notes,
          });
        }
        results.customers.push({ id: record.id, synced: true });
      } catch (err) {
        results.errors.push({ type: 'customer', id: c.id, error: err.message });
      }
    }

    // Process transaction inserts (transactions are immutable – never updated)
    for (const t of transactions) {
      try {
        const existing = await Transaction.findById(t.id, userId);
        if (!existing) {
          const customer = await Customer.findById(t.customer_id, userId);
          if (!customer) throw new Error('Customer not found');

          const amountPaise = Math.round(parseFloat(t.amount) * 100);
          const delta = t.type === 'credit' ? amountPaise : -amountPaise;

          const tx = await withTransaction(async (client) => {
            const newBalance = await Customer.updateBalance(client, t.customer_id, delta);
            return Transaction.create(client, {
              userId,
              customerId: t.customer_id,
              type: t.type,
              amount: amountPaise,
              balanceAfter: newBalance,
              notes: t.notes,
              referenceNo: t.reference_no,
            });
          });
          results.transactions.push({ id: tx.transaction_id, synced: true });
        } else {
          results.transactions.push({ id: t.id, synced: true, skipped: true });
        }
      } catch (err) {
        results.errors.push({ type: 'transaction', id: t.id, error: err.message });
      }
    }

    logger.info('Sync push processed', { userId, ...Object.fromEntries(
      Object.entries(results).map(([k, v]) => [k, Array.isArray(v) ? v.length : v])
    )});

    res.json({
      success: true,
      syncedAt: new Date().toISOString(),
      results,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { pull, push };
