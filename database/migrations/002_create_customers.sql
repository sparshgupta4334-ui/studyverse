-- =============================================================================
-- Migration: 002_create_customers.sql
-- Description: Creates the customers table and related triggers/audit
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- customers table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
    customer_id             UUID            NOT NULL DEFAULT gen_random_uuid(),
    user_id                 UUID            NOT NULL,
    name                    VARCHAR(255)    NOT NULL,
    phone                   VARCHAR(20)     NOT NULL,
    email                   VARCHAR(255),
    address                 TEXT,
    balance                 BIGINT          NOT NULL DEFAULT 0,  -- paise; negative = user owes customer
    tags                    TEXT[]          NOT NULL DEFAULT '{}',
    notes                   TEXT,
    last_transaction_date   TIMESTAMPTZ,
    is_active               BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_customers             PRIMARY KEY (customer_id),
    CONSTRAINT fk_customers_user        FOREIGN KEY (user_id)
                                            REFERENCES users (user_id)
                                            ON DELETE CASCADE
                                            ON UPDATE CASCADE,
    CONSTRAINT chk_customers_phone_fmt  CHECK (phone ~ '^\+?[0-9]{7,15}$'),
    CONSTRAINT chk_customers_email_fmt  CHECK (
        email IS NULL OR email ~* '^[^@]+@[^@]+\.[^@]+$'
    )
);

COMMENT ON TABLE  customers                       IS 'Contacts (khata parties) belonging to a user';
COMMENT ON COLUMN customers.balance               IS 'Running balance in paise. Positive = customer owes user (receivable). Negative = user owes customer (payable).';
COMMENT ON COLUMN customers.tags                  IS 'Free-form labels e.g. {supplier, vip}';
COMMENT ON COLUMN customers.last_transaction_date IS 'Denormalised cache updated by transaction trigger';

-- updated_at auto-maintenance
CREATE TRIGGER trg_customers_set_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- Audit trigger for customers
-- Uses a generic approach: captures old/new as JSONB
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION audit_customers_fn()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER AS $$
BEGIN
    INSERT INTO audit_logs (table_name, record_id, operation, old_data, new_data, changed_by)
    VALUES (
        TG_TABLE_NAME,
        CASE WHEN TG_OP = 'DELETE' THEN OLD.customer_id ELSE NEW.customer_id END,
        TG_OP,
        CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE to_jsonb(OLD) END,
        CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE to_jsonb(NEW) END,
        CASE WHEN TG_OP = 'DELETE' THEN OLD.user_id ELSE NEW.user_id END
    );
    RETURN NULL;
END;
$$;

CREATE TRIGGER trg_customers_audit
    AFTER INSERT OR UPDATE OR DELETE ON customers
    FOR EACH ROW EXECUTE FUNCTION audit_customers_fn();

COMMIT;
