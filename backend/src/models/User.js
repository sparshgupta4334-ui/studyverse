'use strict';

const { query, withTransaction } = require('../config/database');

/**
 * DDL for the users table.
 * Call User.createTable() once on startup via the migration helper.
 */
const createTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      phone       VARCHAR(20)  UNIQUE NOT NULL,
      name        VARCHAR(100),
      email       VARCHAR(255),
      business_name VARCHAR(150),
      avatar_url  TEXT,
      is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
      last_login  TIMESTAMPTZ,
      created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'set_users_updated_at'
      ) THEN
        CREATE TRIGGER set_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      END IF;
    END$$;

    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash VARCHAR(256) NOT NULL,
      expires_at TIMESTAMPTZ  NOT NULL,
      revoked    BOOLEAN      NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
    CREATE INDEX IF NOT EXISTS idx_refresh_tokens_hash    ON refresh_tokens(token_hash);
  `);
};

const findById = async (id) => {
  const res = await query('SELECT * FROM users WHERE id = $1', [id]);
  return res.rows[0] || null;
};

const findByPhone = async (phone) => {
  const res = await query('SELECT * FROM users WHERE phone = $1', [phone]);
  return res.rows[0] || null;
};

const upsertByPhone = async ({ phone, name, businessName }) => {
  const res = await query(
    `INSERT INTO users (phone, name, business_name)
     VALUES ($1, $2, $3)
     ON CONFLICT (phone) DO UPDATE
       SET name          = COALESCE(EXCLUDED.name, users.name),
           business_name = COALESCE(EXCLUDED.business_name, users.business_name),
           last_login    = NOW()
     RETURNING *`,
    [phone, name || null, businessName || null],
  );
  return res.rows[0];
};

const update = async (id, fields) => {
  const allowed = ['name', 'email', 'business_name', 'avatar_url'];
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
  values.push(id);

  const res = await query(
    `UPDATE users SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
    values,
  );
  return res.rows[0] || null;
};

const storeRefreshToken = async (userId, tokenHash, expiresAt) => {
  await query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt],
  );
};

const findRefreshToken = async (tokenHash) => {
  const res = await query(
    `SELECT * FROM refresh_tokens
     WHERE token_hash = $1 AND revoked = FALSE AND expires_at > NOW()`,
    [tokenHash],
  );
  return res.rows[0] || null;
};

const revokeRefreshToken = async (tokenHash) => {
  await query(
    'UPDATE refresh_tokens SET revoked = TRUE WHERE token_hash = $1',
    [tokenHash],
  );
};

const revokeAllUserRefreshTokens = async (userId) => {
  await query(
    'UPDATE refresh_tokens SET revoked = TRUE WHERE user_id = $1',
    [userId],
  );
};

module.exports = {
  createTable,
  findById,
  findByPhone,
  upsertByPhone,
  update,
  storeRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  revokeAllUserRefreshTokens,
};
