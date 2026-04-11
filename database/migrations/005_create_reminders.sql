-- =============================================================================
-- Migration: 005_create_reminders.sql
-- Description: Creates the reminders table, ENUMs, and audit trail
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- ENUM types
-- ---------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE reminder_status_type AS ENUM ('pending', 'sent', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE delivery_status_type AS ENUM ('delivered', 'undelivered', 'unknown');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- reminders table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reminders (
    reminder_id         UUID                    NOT NULL DEFAULT gen_random_uuid(),
    customer_id         UUID                    NOT NULL,
    user_id             UUID                    NOT NULL,
    message             TEXT                    NOT NULL,
    sent_at             TIMESTAMPTZ,
    status              reminder_status_type    NOT NULL DEFAULT 'pending',
    delivery_status     delivery_status_type,           -- NULL until delivery receipt arrives
    phone               VARCHAR(20)             NOT NULL,
    created_at          TIMESTAMPTZ             NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_reminders             PRIMARY KEY (reminder_id),
    CONSTRAINT chk_reminder_phone_fmt   CHECK (phone ~ '^\+?[0-9]{7,15}$'),
    CONSTRAINT fk_reminders_customer    FOREIGN KEY (customer_id)
                                            REFERENCES customers (customer_id)
                                            ON DELETE CASCADE
                                            ON UPDATE CASCADE,
    CONSTRAINT fk_reminders_user        FOREIGN KEY (user_id)
                                            REFERENCES users (user_id)
                                            ON DELETE CASCADE
                                            ON UPDATE CASCADE,
    CONSTRAINT chk_sent_at_when_sent    CHECK (
        status <> 'sent' OR sent_at IS NOT NULL
    )
);

COMMENT ON TABLE  reminders                  IS 'WhatsApp / SMS payment-reminder messages dispatched to customers';
COMMENT ON COLUMN reminders.phone            IS 'Snapshot of the phone number used at send time';
COMMENT ON COLUMN reminders.delivery_status  IS 'Populated by webhook from messaging provider; NULL while unknown';
COMMENT ON COLUMN reminders.sent_at          IS 'Timestamp when the message was handed off to the messaging gateway';

-- ---------------------------------------------------------------------------
-- Audit trigger for reminders
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION audit_reminders_fn()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER AS $$
BEGIN
    INSERT INTO audit_logs (table_name, record_id, operation, old_data, new_data, changed_by)
    VALUES (
        TG_TABLE_NAME,
        CASE WHEN TG_OP = 'DELETE' THEN OLD.reminder_id ELSE NEW.reminder_id END,
        TG_OP,
        CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE to_jsonb(OLD) END,
        CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE to_jsonb(NEW) END,
        CASE WHEN TG_OP = 'DELETE' THEN OLD.user_id ELSE NEW.user_id END
    );
    RETURN NULL;
END;
$$;

CREATE TRIGGER trg_reminders_audit
    AFTER INSERT OR UPDATE OR DELETE ON reminders
    FOR EACH ROW EXECUTE FUNCTION audit_reminders_fn();

COMMIT;
