'use strict';

const { query } = require('../config/database');

const STATUSES = Object.freeze({
  CREATED: 'created',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
});

const createTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS payments (
      payment_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id             UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      customer_id         UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
      razorpay_order_id   VARCHAR(100) UNIQUE,
      razorpay_payment_id VARCHAR(100),
      razorpay_signature  VARCHAR(256),
      amount              BIGINT NOT NULL,  -- paise
      currency            VARCHAR(10) NOT NULL DEFAULT 'INR',
      status              VARCHAR(20) NOT NULL DEFAULT 'created',
      receipt             VARCHAR(100),
      description         TEXT,
      method              VARCHAR(50),
      upi_transaction_id  VARCHAR(100),
      webhook_event       JSONB,
      created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_payments_user_id           ON payments(user_id);
    CREATE INDEX IF NOT EXISTS idx_payments_customer_id       ON payments(customer_id);
    CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON payments(razorpay_order_id);

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'set_payments_updated_at'
      ) THEN
        CREATE TRIGGER set_payments_updated_at
        BEFORE UPDATE ON payments
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      END IF;
    END$$;
  `);
};

const create = async ({ userId, customerId, razorpayOrderId, amount, currency, receipt, description }) => {
  const res = await query(
    `INSERT INTO payments (user_id, customer_id, razorpay_order_id, amount, currency, receipt, description)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [userId, customerId, razorpayOrderId, amount, currency || 'INR', receipt, description || null],
  );
  return res.rows[0];
};

const findById = async (id, userId) => {
  const res = await query(
    'SELECT * FROM payments WHERE payment_id = $1 AND user_id = $2',
    [id, userId],
  );
  return res.rows[0] || null;
};

const findByOrderId = async (razorpayOrderId) => {
  const res = await query(
    'SELECT * FROM payments WHERE razorpay_order_id = $1',
    [razorpayOrderId],
  );
  return res.rows[0] || null;
};

const findByCustomer = async ({ customerId, userId, limit, cursor }) => {
  const params = [customerId, userId];
  const conditions = ['p.customer_id = $1', 'p.user_id = $2'];
  let idx = 3;

  if (cursor) {
    const [ts, lastId] = cursor.split(':');
    if (ts && lastId) {
      conditions.push(`(p.created_at, p.payment_id) < ($${idx++}, $${idx++})`);
      params.push(ts, lastId);
    }
  }

  const limitVal = Math.min(parseInt(limit, 10) || 20, 100);
  params.push(limitVal + 1);

  const res = await query(
    `SELECT p.* FROM payments p
     WHERE ${conditions.join(' AND ')}
     ORDER BY p.created_at DESC, p.payment_id DESC
     LIMIT $${idx}`,
    params,
  );

  const rows = res.rows;
  const hasMore = rows.length > limitVal;
  const data = hasMore ? rows.slice(0, limitVal) : rows;
  const last = data[data.length - 1];
  const nextCursor = hasMore && last
    ? `${last.created_at.toISOString()}:${last.payment_id}`
    : null;

  return { data, hasMore, nextCursor };
};

const updateStatus = async (razorpayOrderId, { status, razorpayPaymentId, razorpaySignature, method, upiTransactionId, webhookEvent }) => {
  const res = await query(
    `UPDATE payments SET
       status              = $1,
       razorpay_payment_id = COALESCE($2, razorpay_payment_id),
       razorpay_signature  = COALESCE($3, razorpay_signature),
       method              = COALESCE($4, method),
       upi_transaction_id  = COALESCE($5, upi_transaction_id),
       webhook_event       = COALESCE($6, webhook_event)
     WHERE razorpay_order_id = $7
     RETURNING *`,
    [status, razorpayPaymentId || null, razorpaySignature || null, method || null, upiTransactionId || null, webhookEvent || null, razorpayOrderId],
  );
  return res.rows[0] || null;
};

module.exports = { STATUSES, createTable, create, findById, findByOrderId, findByCustomer, updateStatus };
