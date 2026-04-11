-- =============================================================================
-- Migration: 003_create_transactions.sql
-- Description: Creates the transactions table (range-partitioned by created_at),
--              ENUMs, balance-update trigger, and audit trail
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- ENUM types
-- ---------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('credit', 'debit');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE sync_status_type AS ENUM ('synced', 'pending', 'conflict');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- Partitioned transactions table (by created_at, RANGE)
-- New partitions should be created monthly via a cron job or migration.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id  UUID                NOT NULL DEFAULT gen_random_uuid(),
    customer_id     UUID                NOT NULL,
    user_id         UUID                NOT NULL,
    amount          BIGINT              NOT NULL,
    type            transaction_type    NOT NULL,
    notes           TEXT,
    category        VARCHAR(100),
    balance_after   BIGINT              NOT NULL,   -- snapshot of customer.balance after this txn
    sync_status     sync_status_type    NOT NULL DEFAULT 'pending',
    payment_id      UUID,                           -- FK to payments; added after payments table exists
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_transactions          PRIMARY KEY (transaction_id, created_at),
    CONSTRAINT chk_txn_amount_positive  CHECK (amount > 0),
    CONSTRAINT fk_txn_customer          FOREIGN KEY (customer_id)
                                            REFERENCES customers (customer_id)
                                            ON DELETE RESTRICT
                                            ON UPDATE CASCADE,
    CONSTRAINT fk_txn_user              FOREIGN KEY (user_id)
                                            REFERENCES users (user_id)
                                            ON DELETE RESTRICT
                                            ON UPDATE CASCADE
) PARTITION BY RANGE (created_at);

COMMENT ON TABLE  transactions              IS 'Double-entry ledger rows, range-partitioned by month';
COMMENT ON COLUMN transactions.amount       IS 'Always positive (paise). Directionality is encoded in `type`.';
COMMENT ON COLUMN transactions.balance_after IS 'Denormalised running balance snapshot for fast statement rendering';
COMMENT ON COLUMN transactions.sync_status  IS 'Offline-sync state: pending (device-only), synced, or conflict';

-- ---------------------------------------------------------------------------
-- Default catch-all partition (rows outside explicit monthly partitions)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transactions_default
    PARTITION OF transactions DEFAULT;

-- ---------------------------------------------------------------------------
-- Monthly partitions — pre-create current year + 2 months ahead.
-- Add a recurring job (pg_cron / external scheduler) to extend these.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transactions_2024_01
    PARTITION OF transactions
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE IF NOT EXISTS transactions_2024_02
    PARTITION OF transactions
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

CREATE TABLE IF NOT EXISTS transactions_2024_03
    PARTITION OF transactions
    FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');

CREATE TABLE IF NOT EXISTS transactions_2024_04
    PARTITION OF transactions
    FOR VALUES FROM ('2024-04-01') TO ('2024-05-01');

CREATE TABLE IF NOT EXISTS transactions_2024_05
    PARTITION OF transactions
    FOR VALUES FROM ('2024-05-01') TO ('2024-06-01');

CREATE TABLE IF NOT EXISTS transactions_2024_06
    PARTITION OF transactions
    FOR VALUES FROM ('2024-06-01') TO ('2024-07-01');

CREATE TABLE IF NOT EXISTS transactions_2024_07
    PARTITION OF transactions
    FOR VALUES FROM ('2024-07-01') TO ('2024-08-01');

CREATE TABLE IF NOT EXISTS transactions_2024_08
    PARTITION OF transactions
    FOR VALUES FROM ('2024-08-01') TO ('2024-09-01');

CREATE TABLE IF NOT EXISTS transactions_2024_09
    PARTITION OF transactions
    FOR VALUES FROM ('2024-09-01') TO ('2024-10-01');

CREATE TABLE IF NOT EXISTS transactions_2024_10
    PARTITION OF transactions
    FOR VALUES FROM ('2024-10-01') TO ('2024-11-01');

CREATE TABLE IF NOT EXISTS transactions_2024_11
    PARTITION OF transactions
    FOR VALUES FROM ('2024-11-01') TO ('2024-12-01');

CREATE TABLE IF NOT EXISTS transactions_2024_12
    PARTITION OF transactions
    FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');

CREATE TABLE IF NOT EXISTS transactions_2025_01
    PARTITION OF transactions
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE IF NOT EXISTS transactions_2025_02
    PARTITION OF transactions
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

CREATE TABLE IF NOT EXISTS transactions_2025_03
    PARTITION OF transactions
    FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');

CREATE TABLE IF NOT EXISTS transactions_2025_04
    PARTITION OF transactions
    FOR VALUES FROM ('2025-04-01') TO ('2025-05-01');

CREATE TABLE IF NOT EXISTS transactions_2025_05
    PARTITION OF transactions
    FOR VALUES FROM ('2025-05-01') TO ('2025-06-01');

CREATE TABLE IF NOT EXISTS transactions_2025_06
    PARTITION OF transactions
    FOR VALUES FROM ('2025-06-01') TO ('2025-07-01');

CREATE TABLE IF NOT EXISTS transactions_2025_07
    PARTITION OF transactions
    FOR VALUES FROM ('2025-07-01') TO ('2025-08-01');

CREATE TABLE IF NOT EXISTS transactions_2025_08
    PARTITION OF transactions
    FOR VALUES FROM ('2025-08-01') TO ('2025-09-01');

CREATE TABLE IF NOT EXISTS transactions_2025_09
    PARTITION OF transactions
    FOR VALUES FROM ('2025-09-01') TO ('2025-10-01');

CREATE TABLE IF NOT EXISTS transactions_2025_10
    PARTITION OF transactions
    FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');

CREATE TABLE IF NOT EXISTS transactions_2025_11
    PARTITION OF transactions
    FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');

CREATE TABLE IF NOT EXISTS transactions_2025_12
    PARTITION OF transactions
    FOR VALUES FROM ('2025-12-01') TO ('2026-01-01');

-- ---------------------------------------------------------------------------
-- updated_at trigger (applied on parent; PostgreSQL propagates to partitions)
-- ---------------------------------------------------------------------------
CREATE TRIGGER trg_transactions_set_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- Balance + last_transaction_date maintenance trigger on customers
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_customer_balance()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE customers
        SET
            balance = balance + CASE WHEN NEW.type = 'credit' THEN NEW.amount ELSE -NEW.amount END,
            last_transaction_date = GREATEST(last_transaction_date, NEW.created_at),
            updated_at = NOW()
        WHERE customer_id = NEW.customer_id;

    ELSIF TG_OP = 'DELETE' THEN
        -- Reverse the effect of the deleted transaction
        UPDATE customers
        SET
            balance = balance - CASE WHEN OLD.type = 'credit' THEN OLD.amount ELSE -OLD.amount END,
            updated_at = NOW()
        WHERE customer_id = OLD.customer_id;

    ELSIF TG_OP = 'UPDATE' THEN
        -- Reverse old, apply new
        UPDATE customers
        SET
            balance = balance
                - CASE WHEN OLD.type = 'credit' THEN OLD.amount ELSE -OLD.amount END
                + CASE WHEN NEW.type = 'credit' THEN NEW.amount ELSE -NEW.amount END,
            last_transaction_date = GREATEST(last_transaction_date, NEW.created_at),
            updated_at = NOW()
        WHERE customer_id = NEW.customer_id;
    END IF;

    RETURN NULL;
END;
$$;

CREATE TRIGGER trg_transactions_balance
    AFTER INSERT OR UPDATE OR DELETE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_customer_balance();

-- ---------------------------------------------------------------------------
-- Audit trigger for transactions
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION audit_transactions_fn()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER AS $$
BEGIN
    INSERT INTO audit_logs (table_name, record_id, operation, old_data, new_data, changed_by)
    VALUES (
        TG_TABLE_NAME,
        CASE WHEN TG_OP = 'DELETE' THEN OLD.transaction_id ELSE NEW.transaction_id END,
        TG_OP,
        CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE to_jsonb(OLD) END,
        CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE to_jsonb(NEW) END,
        CASE WHEN TG_OP = 'DELETE' THEN OLD.user_id ELSE NEW.user_id END
    );
    RETURN NULL;
END;
$$;

CREATE TRIGGER trg_transactions_audit
    AFTER INSERT OR UPDATE OR DELETE ON transactions
    FOR EACH ROW EXECUTE FUNCTION audit_transactions_fn();

COMMIT;
