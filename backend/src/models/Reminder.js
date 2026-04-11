'use strict';

const { query } = require('../config/database');

const STATUSES = Object.freeze({
  PENDING: 'pending',
  SENT: 'sent',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
});

const createTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS reminders (
      reminder_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id       UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      customer_id   UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
      phone         VARCHAR(20) NOT NULL,
      message       TEXT NOT NULL,
      status        VARCHAR(20) NOT NULL DEFAULT 'pending',
      provider      VARCHAR(30),
      provider_sid  VARCHAR(100),
      scheduled_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      sent_at       TIMESTAMPTZ,
      error_message TEXT,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_reminders_user_id     ON reminders(user_id);
    CREATE INDEX IF NOT EXISTS idx_reminders_customer_id ON reminders(customer_id);
    CREATE INDEX IF NOT EXISTS idx_reminders_scheduled_at ON reminders(scheduled_at)
      WHERE status = 'pending';

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'set_reminders_updated_at'
      ) THEN
        CREATE TRIGGER set_reminders_updated_at
        BEFORE UPDATE ON reminders
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      END IF;
    END$$;
  `);
};

const create = async ({ userId, customerId, phone, message, scheduledAt }) => {
  const res = await query(
    `INSERT INTO reminders (user_id, customer_id, phone, message, scheduled_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, customerId, phone, message, scheduledAt || new Date()],
  );
  return res.rows[0];
};

const findById = async (id, userId) => {
  const res = await query(
    'SELECT * FROM reminders WHERE reminder_id = $1 AND user_id = $2',
    [id, userId],
  );
  return res.rows[0] || null;
};

const findByCustomer = async ({ customerId, userId, limit, cursor }) => {
  const params = [customerId, userId];
  const conditions = ['r.customer_id = $1', 'r.user_id = $2'];
  let idx = 3;

  if (cursor) {
    const [ts, lastId] = cursor.split(':');
    if (ts && lastId) {
      conditions.push(`(r.created_at, r.reminder_id) < ($${idx++}, $${idx++})`);
      params.push(ts, lastId);
    }
  }

  const limitVal = Math.min(parseInt(limit, 10) || 20, 100);
  params.push(limitVal + 1);

  const res = await query(
    `SELECT r.*, c.name AS customer_name FROM reminders r
     JOIN customers c ON c.customer_id = r.customer_id
     WHERE ${conditions.join(' AND ')}
     ORDER BY r.created_at DESC, r.reminder_id DESC
     LIMIT $${idx}`,
    params,
  );

  const rows = res.rows;
  const hasMore = rows.length > limitVal;
  const data = hasMore ? rows.slice(0, limitVal) : rows;
  const last = data[data.length - 1];
  const nextCursor = hasMore && last
    ? `${last.created_at.toISOString()}:${last.reminder_id}`
    : null;

  return { data, hasMore, nextCursor };
};

const updateStatus = async (id, { status, providerSid, sentAt, errorMessage, provider }) => {
  const res = await query(
    `UPDATE reminders SET
       status        = $1,
       provider_sid  = COALESCE($2, provider_sid),
       sent_at       = COALESCE($3, sent_at),
       error_message = COALESCE($4, error_message),
       provider      = COALESCE($5, provider)
     WHERE reminder_id = $6
     RETURNING *`,
    [status, providerSid || null, sentAt || null, errorMessage || null, provider || null, id],
  );
  return res.rows[0] || null;
};

const findPendingDue = async () => {
  const res = await query(
    `SELECT r.*, u.phone AS user_phone, c.name AS customer_name
     FROM reminders r
     JOIN users u ON u.user_id = r.user_id
     JOIN customers c ON c.customer_id = r.customer_id
     WHERE r.status = 'pending' AND r.scheduled_at <= NOW()
     ORDER BY r.scheduled_at ASC
     LIMIT 100`,
  );
  return res.rows;
};

module.exports = { STATUSES, createTable, create, findById, findByCustomer, updateStatus, findPendingDue };
