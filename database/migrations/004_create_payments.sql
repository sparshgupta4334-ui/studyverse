-- =============================================================================
-- Migration: 004_create_payments.sql
-- Description: Creates the payments table, ENUM, FK back to transactions,
--              and audit trail
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- ENUM type
-- ---------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE payment_status_type AS ENUM ('pending', 'success', 'failed', 'refunded');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- payments table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
    payment_id          UUID                    NOT NULL DEFAULT gen_random_uuid(),
    transaction_id      UUID,                           -- nullable; linked after transaction is created
    user_id             UUID                    NOT NULL,
    customer_id         UUID                    NOT NULL,
    amount              BIGINT                  NOT NULL,
    upi_id              VARCHAR(100),
    razorpay_order_id   VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    status              payment_status_type     NOT NULL DEFAULT 'pending',
    gateway_response    JSONB                   NOT NULL DEFAULT '{}'::JSONB,
    created_at          TIMESTAMPTZ             NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ             NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_payments              PRIMARY KEY (payment_id),
    CONSTRAINT chk_payment_amount       CHECK (amount > 0),
    CONSTRAINT fk_payments_user         FOREIGN KEY (user_id)
                                            REFERENCES users (user_id)
                                            ON DELETE RESTRICT
                                            ON UPDATE CASCADE,
    CONSTRAINT fk_payments_customer     FOREIGN KEY (customer_id)
                                            REFERENCES customers (customer_id)
                                            ON DELETE RESTRICT
                                            ON UPDATE CASCADE,
    CONSTRAINT uq_razorpay_order        UNIQUE (razorpay_order_id),
    CONSTRAINT uq_razorpay_payment      UNIQUE (razorpay_payment_id)
);

COMMENT ON TABLE  payments                      IS 'UPI / Razorpay payment attempts linked to transactions';
COMMENT ON COLUMN payments.amount               IS 'Amount in paise; always positive';
COMMENT ON COLUMN payments.gateway_response     IS 'Raw JSON blob from payment gateway webhook';
COMMENT ON COLUMN payments.razorpay_order_id    IS 'Razorpay order_id; NULL for UPI deep-links';
COMMENT ON COLUMN payments.razorpay_payment_id  IS 'Razorpay payment_id populated on success webhook';

-- updated_at auto-maintenance
CREATE TRIGGER trg_payments_set_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- Add the deferred FK from transactions.payment_id → payments.payment_id
-- (Payments may be created before or after the transaction row)
-- ---------------------------------------------------------------------------
ALTER TABLE transactions
    ADD CONSTRAINT fk_txn_payment
        FOREIGN KEY (payment_id)
            REFERENCES payments (payment_id)
            ON DELETE SET NULL
            ON UPDATE CASCADE
            DEFERRABLE INITIALLY DEFERRED;

-- ---------------------------------------------------------------------------
-- Audit trigger for payments
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION audit_payments_fn()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER AS $$
BEGIN
    INSERT INTO audit_logs (table_name, record_id, operation, old_data, new_data, changed_by)
    VALUES (
        TG_TABLE_NAME,
        CASE WHEN TG_OP = 'DELETE' THEN OLD.payment_id ELSE NEW.payment_id END,
        TG_OP,
        CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE to_jsonb(OLD) END,
        CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE to_jsonb(NEW) END,
        CASE WHEN TG_OP = 'DELETE' THEN OLD.user_id ELSE NEW.user_id END
    );
    RETURN NULL;
END;
$$;

CREATE TRIGGER trg_payments_audit
    AFTER INSERT OR UPDATE OR DELETE ON payments
    FOR EACH ROW EXECUTE FUNCTION audit_payments_fn();

COMMIT;
