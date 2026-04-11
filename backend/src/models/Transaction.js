'use strict';

const { query } = require('../config/database');

const TYPES = Object.freeze({ CREDIT: 'credit', DEBIT: 'debit' });

const createTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      customer_id     UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      type            VARCHAR(10) NOT NULL CHECK (type IN ('credit', 'debit')),
      amount          BIGINT NOT NULL CHECK (amount > 0),  -- paise
      running_balance BIGINT NOT NULL DEFAULT 0,           -- paise
      description     TEXT,
      reference_no    VARCHAR(100),
      payment_id      UUID,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_transactions_user_id     ON transactions(user_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_customer_id ON transactions(customer_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_created_at  ON transactions(created_at DESC);

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'set_transactions_updated_at'
      ) THEN
        CREATE TRIGGER set_transactions_updated_at
        BEFORE UPDATE ON transactions
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      END IF;
    END$$;
  `);
};

/**
 * Fetch transactions for a customer with cursor-based pagination.
 * Cursor is the created_at + id of the last seen row.
 */
const findByCustomer = async ({ customerId, userId, limit, cursor, type }) => {
  const params = [customerId, userId];
  const conditions = ['t.customer_id = $1', 't.user_id = $2'];
  let idx = 3;

  if (type && TYPES[type.toUpperCase()]) {
    conditions.push(`t.type = $${idx++}`);
    params.push(type);
  }

  // Cursor-based: encode as "ISO_TIMESTAMP:UUID"
  if (cursor) {
    const [ts, lastId] = cursor.split(':');
    if (ts && lastId) {
      conditions.push(`(t.created_at, t.id) < ($${idx++}, $${idx++})`);
      params.push(ts, lastId);
    }
  }

  const limitVal = Math.min(parseInt(limit, 10) || 20, 100);
  params.push(limitVal + 1);

  const res = await query(
    `SELECT t.*, c.name AS customer_name
     FROM transactions t
     JOIN customers c ON c.id = t.customer_id
     WHERE ${conditions.join(' AND ')}
     ORDER BY t.created_at DESC, t.id DESC
     LIMIT $${idx}`,
    params,
  );

  const rows = res.rows;
  const hasMore = rows.length > limitVal;
  const data = hasMore ? rows.slice(0, limitVal) : rows;
  const last = data[data.length - 1];
  const nextCursor = hasMore && last
    ? `${last.created_at.toISOString()}:${last.id}`
    : null;

  return { data, hasMore, nextCursor };
};

const findAllByUser = async ({ userId, limit, cursor }) => {
  const params = [userId];
  const conditions = ['t.user_id = $1'];
  let idx = 2;

  if (cursor) {
    const [ts, lastId] = cursor.split(':');
    if (ts && lastId) {
      conditions.push(`(t.created_at, t.id) < ($${idx++}, $${idx++})`);
      params.push(ts, lastId);
    }
  }

  const limitVal = Math.min(parseInt(limit, 10) || 20, 100);
  params.push(limitVal + 1);

  const res = await query(
    `SELECT t.*, c.name AS customer_name
     FROM transactions t
     JOIN customers c ON c.id = t.customer_id
     WHERE ${conditions.join(' AND ')}
     ORDER BY t.created_at DESC, t.id DESC
     LIMIT $${idx}`,
    params,
  );

  const rows = res.rows;
  const hasMore = rows.length > limitVal;
  const data = hasMore ? rows.slice(0, limitVal) : rows;
  const last = data[data.length - 1];
  const nextCursor = hasMore && last
    ? `${last.created_at.toISOString()}:${last.id}`
    : null;

  return { data, hasMore, nextCursor };
};

const findById = async (id, userId) => {
  const res = await query(
    'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
    [id, userId],
  );
  return res.rows[0] || null;
};

/**
 * Insert a transaction and return it.  Balance update must be handled by the
 * controller inside a DB transaction to keep atomicity.
 */
const create = async (client, { userId, customerId, type, amount, runningBalance, description, referenceNo, paymentId }) => {
  const res = await client.query(
    `INSERT INTO transactions
       (user_id, customer_id, type, amount, running_balance, description, reference_no, payment_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [userId, customerId, type, amount, runningBalance, description || null, referenceNo || null, paymentId || null],
  );
  return res.rows[0];
};

const summary = async (userId, { startDate, endDate }) => {
  const res = await query(
    `SELECT
       type,
       COUNT(*) AS count,
       SUM(amount) AS total
     FROM transactions
     WHERE user_id = $1
       AND created_at >= $2
       AND created_at <  $3
     GROUP BY type`,
    [userId, startDate, endDate],
  );
  return res.rows;
};

const dailySummary = async (userId, { startDate, endDate }) => {
  const res = await query(
    `SELECT
       DATE(created_at AT TIME ZONE 'Asia/Kolkata') AS date,
       type,
       COUNT(*) AS count,
       SUM(amount) AS total
     FROM transactions
     WHERE user_id = $1
       AND created_at >= $2
       AND created_at <  $3
     GROUP BY date, type
     ORDER BY date ASC`,
    [userId, startDate, endDate],
  );
  return res.rows;
};

module.exports = {
  TYPES,
  createTable,
  findByCustomer,
  findAllByUser,
  findById,
  create,
  summary,
  dailySummary,
};
