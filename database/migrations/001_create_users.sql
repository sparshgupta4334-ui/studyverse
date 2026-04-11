-- =============================================================================
-- Migration: 001_create_users.sql
-- Description: Creates the users table, supporting types, and related objects
-- =============================================================================

BEGIN;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- trigram indexes for fuzzy search
CREATE EXTENSION IF NOT EXISTS "btree_gin";  -- multi-column GIN indexes

-- ---------------------------------------------------------------------------
-- Reusable trigger function: keep updated_at in sync
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- Audit log table (created first so later migrations can reference it)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    audit_id        UUID            NOT NULL DEFAULT gen_random_uuid(),
    table_name      VARCHAR(64)     NOT NULL,
    record_id       UUID            NOT NULL,
    operation       VARCHAR(10)     NOT NULL,   -- INSERT | UPDATE | DELETE
    old_data        JSONB,
    new_data        JSONB,
    changed_by      UUID,                       -- user_id when available
    changed_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_audit_logs           PRIMARY KEY (audit_id),
    CONSTRAINT chk_audit_operation     CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE'))
);

CREATE INDEX idx_audit_logs_table_record ON audit_logs (table_name, record_id);
CREATE INDEX idx_audit_logs_changed_at   ON audit_logs (changed_at DESC);
CREATE INDEX idx_audit_logs_changed_by   ON audit_logs (changed_by)
    WHERE changed_by IS NOT NULL;

COMMENT ON TABLE  audit_logs              IS 'Immutable audit trail for critical table changes';
COMMENT ON COLUMN audit_logs.operation    IS 'DML operation: INSERT, UPDATE, or DELETE';
COMMENT ON COLUMN audit_logs.changed_by   IS 'user_id of the actor when determinable';

-- ---------------------------------------------------------------------------
-- Generic audit trigger function
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION audit_trigger_fn()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER AS $$
DECLARE
    v_record_id UUID;
    v_old_data  JSONB;
    v_new_data  JSONB;
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_record_id := OLD.user_id;
        v_old_data  := to_jsonb(OLD);
        v_new_data  := NULL;
    ELSIF TG_OP = 'INSERT' THEN
        v_record_id := NEW.user_id;
        v_old_data  := NULL;
        v_new_data  := to_jsonb(NEW);
    ELSE
        v_record_id := NEW.user_id;
        v_old_data  := to_jsonb(OLD);
        v_new_data  := to_jsonb(NEW);
    END IF;

    INSERT INTO audit_logs (table_name, record_id, operation, old_data, new_data, changed_by)
    VALUES (TG_TABLE_NAME, v_record_id, TG_OP, v_old_data, v_new_data, v_record_id);

    RETURN NULL; -- AFTER trigger; return value is ignored
END;
$$;

-- ---------------------------------------------------------------------------
-- users table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    user_id         UUID            NOT NULL DEFAULT gen_random_uuid(),
    phone           VARCHAR(20)     NOT NULL,
    email           VARCHAR(255),
    name            VARCHAR(255)    NOT NULL,
    device_tokens   JSONB           NOT NULL DEFAULT '[]'::JSONB,
    refresh_token   TEXT,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_users             PRIMARY KEY (user_id),
    CONSTRAINT uq_users_phone       UNIQUE (phone),
    CONSTRAINT chk_users_phone_fmt  CHECK (phone ~ '^\+?[0-9]{7,15}$'),
    CONSTRAINT chk_users_email_fmt  CHECK (email IS NULL OR email ~* '^[^@]+@[^@]+\.[^@]+$'),
    CONSTRAINT chk_device_tokens    CHECK (jsonb_typeof(device_tokens) = 'array')
);

COMMENT ON TABLE  users                  IS 'Registered app users authenticated via phone OTP';
COMMENT ON COLUMN users.phone            IS 'E.164-formatted phone number; primary login identifier';
COMMENT ON COLUMN users.device_tokens    IS 'JSONB array of FCM/APNs push-notification tokens';
COMMENT ON COLUMN users.refresh_token    IS 'Hashed JWT refresh token; NULL after logout';

-- updated_at auto-maintenance
CREATE TRIGGER trg_users_set_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- audit trail
CREATE TRIGGER trg_users_audit
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn();

COMMIT;
