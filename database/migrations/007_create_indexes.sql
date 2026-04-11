-- =============================================================================
-- Migration: 007_create_indexes.sql
-- Description: All performance indexes (B-tree, GIN, partial, composite)
-- =============================================================================

BEGIN;

-- ===========================================================================
-- USERS
-- ===========================================================================

-- Phone lookup (already covered by UNIQUE constraint; adding explicit index
-- comment for clarity — no duplicate index needed)
-- CREATE INDEX idx_users_phone ON users (phone);  -- covered by UNIQUE constraint

-- Active users only (partial index for auth queries)
CREATE INDEX IF NOT EXISTS idx_users_active
    ON users (user_id)
    WHERE is_active = TRUE;

-- ===========================================================================
-- CUSTOMERS
-- ===========================================================================

-- Primary FK join + time-range queries per user
CREATE INDEX IF NOT EXISTS idx_customers_user_created
    ON customers (user_id, created_at DESC);

-- Dashboard query: filter active customers and sort by balance
CREATE INDEX IF NOT EXISTS idx_customers_user_balance
    ON customers (user_id, balance)
    WHERE is_active = TRUE;

-- Duplicate-detection: find customers with same phone under the same user
CREATE INDEX IF NOT EXISTS idx_customers_user_phone
    ON customers (user_id, phone);

-- Customer lookup by phone across all users (e.g. incoming payment matching)
CREATE INDEX IF NOT EXISTS idx_customers_phone
    ON customers (phone)
    WHERE is_active = TRUE;

-- Customer name lookup per user
CREATE INDEX IF NOT EXISTS idx_customers_user_name
    ON customers (user_id, name);

-- Full-text search on customer name using GIN + pg_trgm (trigram similarity)
CREATE INDEX IF NOT EXISTS idx_customers_name_trgm
    ON customers USING GIN (name gin_trgm_ops);

-- Partial: active customers only (covers frequent WHERE is_active = TRUE scans)
CREATE INDEX IF NOT EXISTS idx_customers_active
    ON customers (user_id, last_transaction_date DESC)
    WHERE is_active = TRUE;

-- Customers with outstanding receivable (positive balance)
CREATE INDEX IF NOT EXISTS idx_customers_receivable
    ON customers (user_id, balance DESC)
    WHERE is_active = TRUE AND balance > 0;

-- Customers with outstanding payable (negative balance)
CREATE INDEX IF NOT EXISTS idx_customers_payable
    ON customers (user_id, balance ASC)
    WHERE is_active = TRUE AND balance < 0;

-- ===========================================================================
-- TRANSACTIONS  (indexes are created on parent; PostgreSQL propagates)
-- ===========================================================================

-- Most common query: all transactions for a user ordered by date
CREATE INDEX IF NOT EXISTS idx_transactions_user_created
    ON transactions (user_id, created_at DESC);

-- Per-customer statement query
CREATE INDEX IF NOT EXISTS idx_transactions_customer_created
    ON transactions (customer_id, created_at DESC);

-- Offline sync queue: find rows still pending sync for a user
CREATE INDEX IF NOT EXISTS idx_transactions_sync_status
    ON transactions (user_id, sync_status)
    WHERE sync_status <> 'synced';

-- Payment linkage lookup
CREATE INDEX IF NOT EXISTS idx_transactions_payment_id
    ON transactions (payment_id)
    WHERE payment_id IS NOT NULL;

-- Category analytics
CREATE INDEX IF NOT EXISTS idx_transactions_user_category
    ON transactions (user_id, category)
    WHERE category IS NOT NULL;

-- ===========================================================================
-- PAYMENTS
-- ===========================================================================

-- All payments for a user (dashboard, reconciliation)
CREATE INDEX IF NOT EXISTS idx_payments_user_created
    ON payments (user_id, created_at DESC);

-- All payments linked to a customer
CREATE INDEX IF NOT EXISTS idx_payments_customer_created
    ON payments (customer_id, created_at DESC);

-- Pending payments that need polling / retry
CREATE INDEX IF NOT EXISTS idx_payments_status_pending
    ON payments (user_id, created_at DESC)
    WHERE status = 'pending';

-- Gateway lookup by Razorpay order_id (covered by UNIQUE, no extra index needed)
-- CREATE INDEX idx_payments_razorpay_order ON payments (razorpay_order_id); -- unique constraint

-- ===========================================================================
-- REMINDERS
-- ===========================================================================

-- All reminders for a user (history list)
CREATE INDEX IF NOT EXISTS idx_reminders_user_created
    ON reminders (user_id, created_at DESC);

-- Reminders for a specific customer
CREATE INDEX IF NOT EXISTS idx_reminders_customer_created
    ON reminders (customer_id, created_at DESC);

-- Pending reminders for dispatch worker
CREATE INDEX IF NOT EXISTS idx_reminders_pending
    ON reminders (created_at ASC)
    WHERE status = 'pending';

-- Failed reminders for retry worker
CREATE INDEX IF NOT EXISTS idx_reminders_failed
    ON reminders (created_at ASC)
    WHERE status = 'failed';

-- ===========================================================================
-- BACKUPS
-- ===========================================================================

-- All backups for a user ordered by creation time
CREATE INDEX IF NOT EXISTS idx_backups_user_created
    ON backups (user_id, created_at DESC);

-- ===========================================================================
-- AUDIT LOGS
-- (Already indexed in 001; add covering index for common tail-reads)
-- ===========================================================================

-- Retrieve audit history for a specific record in a table
CREATE INDEX IF NOT EXISTS idx_audit_table_record_time
    ON audit_logs (table_name, record_id, changed_at DESC);

COMMIT;
