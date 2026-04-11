'use strict';

const { query } = require('../config/database');

const createTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS customers (
      customer_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id      UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      name         VARCHAR(150) NOT NULL,
      phone        VARCHAR(20),
      email        VARCHAR(255),
      address      TEXT,
      notes        TEXT,
      balance      BIGINT NOT NULL DEFAULT 0,  -- in paise (1 INR = 100 paise)
      is_active    BOOLEAN NOT NULL DEFAULT TRUE,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
    CREATE INDEX IF NOT EXISTS idx_customers_phone   ON customers(phone);
    CREATE INDEX IF NOT EXISTS idx_customers_name    ON customers USING gin(to_tsvector('simple', name));

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'set_customers_updated_at'
      ) THEN
        CREATE TRIGGER set_customers_updated_at
        BEFORE UPDATE ON customers
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      END IF;
    END$$;
  `);
};

const findAll = async ({ userId, search, limit, cursor, isActive }) => {
  const params = [userId];
  const conditions = ['c.user_id = $1'];
  let idx = 2;

  if (isActive !== undefined) {
    conditions.push(`c.is_active = $${idx++}`);
    params.push(isActive);
  }

  if (search) {
    conditions.push(
      `(c.name ILIKE $${idx} OR c.phone ILIKE $${idx} OR c.email ILIKE $${idx})`,
    );
    params.push(`%${search}%`);
    idx++;
  }

  if (cursor) {
    conditions.push(`c.customer_id > $${idx++}`);
    params.push(cursor);
  }

  const where = conditions.join(' AND ');
  const limitVal = Math.min(parseInt(limit, 10) || 20, 100);
  params.push(limitVal + 1); // fetch one extra to determine hasMore

  const res = await query(
    `SELECT c.*, 
            (SELECT COUNT(*) FROM transactions t WHERE t.customer_id = c.customer_id) AS transaction_count
     FROM customers c
     WHERE ${where}
     ORDER BY c.name ASC, c.customer_id ASC
     LIMIT $${idx}`,
    params,
  );

  const rows = res.rows;
  const hasMore = rows.length > limitVal;
  const data = hasMore ? rows.slice(0, limitVal) : rows;
  const nextCursor = hasMore ? data[data.length - 1].customer_id : null;

  return { data, hasMore, nextCursor };
};

const findById = async (id, userId) => {
  const res = await query(
    'SELECT * FROM customers WHERE customer_id = $1 AND user_id = $2',
    [id, userId],
  );
  return res.rows[0] || null;
};

const create = async ({ userId, name, phone, email, address, notes }) => {
  const res = await query(
    `INSERT INTO customers (user_id, name, phone, email, address, notes)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userId, name, phone || null, email || null, address || null, notes || null],
  );
  return res.rows[0];
};

const update = async (id, userId, fields) => {
  const allowed = ['name', 'phone', 'email', 'address', 'notes', 'is_active'];
  const updates = [];
  const values = [];
  let idx = 1;

  for (const [key, value] of Object.entries(fields)) {
    if (allowed.includes(key)) {
      updates.push(`${key} = $${idx++}`);
      values.push(value);
    }
  }

  if (!updates.length) return null;
  values.push(id, userId);

  const res = await query(
    `UPDATE customers SET ${updates.join(', ')}
     WHERE customer_id = $${idx} AND user_id = $${idx + 1}
     RETURNING *`,
    values,
  );
  return res.rows[0] || null;
};

const remove = async (id, userId) => {
  const res = await query(
    `UPDATE customers SET is_active = FALSE
     WHERE customer_id = $1 AND user_id = $2
     RETURNING customer_id`,
    [id, userId],
  );
  return res.rows[0] || null;
};

const updateBalance = async (client, customerId, delta) => {
  const res = await client.query(
    `UPDATE customers SET balance = balance + $1
     WHERE customer_id = $2
     RETURNING balance`,
    [delta, customerId],
  );
  return res.rows[0]?.balance;
};

const count = async (userId) => {
  const res = await query(
    'SELECT COUNT(*) AS total FROM customers WHERE user_id = $1 AND is_active = TRUE',
    [userId],
  );
  return parseInt(res.rows[0].total, 10);
};

module.exports = {
  createTable,
  findAll,
  findById,
  create,
  update,
  remove,
  updateBalance,
  count,
};
