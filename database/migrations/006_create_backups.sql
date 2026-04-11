-- =============================================================================
-- Migration: 006_create_backups.sql
-- Description: Creates the backups table, dashboard views, and materialized view
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- backups table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS backups (
    backup_id       UUID        NOT NULL DEFAULT gen_random_uuid(),
    user_id         UUID        NOT NULL,
    backup_url      TEXT        NOT NULL,
    backup_size     BIGINT      NOT NULL,   -- bytes
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_backups               PRIMARY KEY (backup_id),
    CONSTRAINT fk_backups_user          FOREIGN KEY (user_id)
                                            REFERENCES users (user_id)
                                            ON DELETE CASCADE
                                            ON UPDATE CASCADE,
    CONSTRAINT chk_backup_size_positive CHECK (backup_size > 0),
    CONSTRAINT chk_backup_url_nonempty  CHECK (backup_url <> '')
);

COMMENT ON TABLE  backups            IS 'Metadata for user data exports stored in S3-compatible storage';
COMMENT ON COLUMN backups.backup_url IS 'Pre-signed or permanent S3/GCS object URL';
COMMENT ON COLUMN backups.backup_size IS 'Uncompressed backup size in bytes';

-- ---------------------------------------------------------------------------
-- View: user_dashboard_stats
-- Returns per-user totals for the dashboard (total receivable / payable,
-- active customer counts, transaction counts).
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW user_dashboard_stats AS
SELECT
    u.user_id,
    u.name                                                      AS user_name,
    u.phone,

    -- Receivable: sum of positive balances (customer owes the user)
    COALESCE(SUM(c.balance) FILTER (WHERE c.balance > 0 AND c.is_active), 0)
                                                                AS total_receivable,

    -- Payable: sum of absolute negative balances (user owes customers)
    COALESCE(ABS(SUM(c.balance) FILTER (WHERE c.balance < 0 AND c.is_active)), 0)
                                                                AS total_payable,

    -- Net position (positive = net receivable)
    COALESCE(SUM(c.balance) FILTER (WHERE c.is_active), 0)      AS net_balance,

    COUNT(c.customer_id) FILTER (WHERE c.is_active)             AS active_customers,
    COUNT(c.customer_id) FILTER (WHERE c.balance > 0 AND c.is_active)
                                                                AS customers_with_due,
    COUNT(c.customer_id) FILTER (WHERE c.balance < 0 AND c.is_active)
                                                                AS customers_advance_paid
FROM users u
LEFT JOIN customers c ON c.user_id = u.user_id
GROUP BY u.user_id, u.name, u.phone;

COMMENT ON VIEW user_dashboard_stats IS
    'Live dashboard aggregates per user: total receivable, payable, and customer counts';

-- ---------------------------------------------------------------------------
-- View: customer_statement
-- Returns chronological transaction history enriched with payment status.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW customer_statement AS
SELECT
    t.transaction_id,
    t.customer_id,
    t.user_id,
    c.name              AS customer_name,
    c.phone             AS customer_phone,
    t.type,
    t.amount,
    t.balance_after,
    t.notes,
    t.category,
    t.sync_status,
    p.status            AS payment_status,
    p.upi_id,
    p.razorpay_payment_id,
    t.created_at,
    t.updated_at
FROM transactions t
JOIN customers c ON c.customer_id = t.customer_id
LEFT JOIN payments p ON p.payment_id = t.payment_id
ORDER BY t.created_at DESC;

COMMENT ON VIEW customer_statement IS
    'Enriched transaction log per customer with associated payment details';

-- ---------------------------------------------------------------------------
-- Materialized view: monthly_summary
-- Aggregates per-user, per-month credit / debit totals.
-- Refresh with: REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_summary;
-- (Schedule via pg_cron: 0 1 1 * *)
-- ---------------------------------------------------------------------------
CREATE MATERIALIZED VIEW IF NOT EXISTS monthly_summary AS
SELECT
    user_id,
    DATE_TRUNC('month', created_at)                                 AS month,
    COUNT(*)                                                        AS transaction_count,
    COALESCE(SUM(amount) FILTER (WHERE type = 'credit'), 0)         AS total_credited,
    COALESCE(SUM(amount) FILTER (WHERE type = 'debit'), 0)          AS total_debited,
    COALESCE(SUM(amount) FILTER (WHERE type = 'credit'), 0)
        - COALESCE(SUM(amount) FILTER (WHERE type = 'debit'), 0)    AS net_amount
FROM transactions
GROUP BY user_id, DATE_TRUNC('month', created_at);

CREATE UNIQUE INDEX IF NOT EXISTS uidx_monthly_summary
    ON monthly_summary (user_id, month);

COMMENT ON MATERIALIZED VIEW monthly_summary IS
    'Monthly credit/debit aggregates per user; refresh nightly via pg_cron';

COMMIT;
