-- StudyVerse Digital Ledger - Initial Database Schema
-- PostgreSQL Migration Script

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    user_id     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone       VARCHAR(15) UNIQUE NOT NULL,
    email       VARCHAR(255),
    name        VARCHAR(100),
    fcm_token   TEXT,
    is_active   BOOLEAN DEFAULT true,
    last_login  TIMESTAMP WITH TIME ZONE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_is_active ON users(is_active);

-- ============================================================
-- CUSTOMERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
    customer_id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id                 UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    name                    VARCHAR(100) NOT NULL,
    phone                   VARCHAR(15) NOT NULL,
    email                   VARCHAR(255),
    balance                 DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    notes                   TEXT,
    last_transaction_date   TIMESTAMP WITH TIME ZONE,
    is_active               BOOLEAN DEFAULT true,
    created_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT uq_customer_user_phone UNIQUE (user_id, phone)
);

CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_balance ON customers(balance);
CREATE INDEX idx_customers_is_active ON customers(is_active);
CREATE INDEX idx_customers_name ON customers(name);

-- ============================================================
-- TRANSACTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id     UUID NOT NULL REFERENCES customers(customer_id) ON DELETE RESTRICT,
    amount          DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    type            VARCHAR(10) NOT NULL CHECK (type IN ('credit', 'debit')),
    notes           TEXT,
    reference_id    VARCHAR(100),
    sync_status     VARCHAR(20) DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending', 'conflict')),
    is_deleted      BOOLEAN DEFAULT false,
    deleted_at      TIMESTAMP WITH TIME ZONE,
    created_by      UUID REFERENCES users(user_id),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_is_deleted ON transactions(is_deleted);
CREATE INDEX idx_transactions_reference_id ON transactions(reference_id);

-- ============================================================
-- PAYMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
    payment_id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id      UUID REFERENCES transactions(transaction_id),
    customer_id         UUID NOT NULL REFERENCES customers(customer_id),
    user_id             UUID NOT NULL REFERENCES users(user_id),
    amount              DECIMAL(15, 2) NOT NULL,
    upi_id              VARCHAR(100),
    order_id            VARCHAR(100) UNIQUE,
    status              VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    gateway_response    JSONB DEFAULT '{}',
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_customer_id ON payments(customer_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);

-- ============================================================
-- REMINDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS reminders (
    reminder_id     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id     UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(user_id),
    message         TEXT NOT NULL,
    scheduled_at    TIMESTAMP WITH TIME ZONE,
    sent_at         TIMESTAMP WITH TIME ZONE,
    status          VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reminders_customer_id ON reminders(customer_id);
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_status ON reminders(status);
CREATE INDEX idx_reminders_scheduled_at ON reminders(scheduled_at);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reminders_updated_at
    BEFORE UPDATE ON reminders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SAMPLE DATA (Development Only - Remove in Production)
-- ============================================================
-- Uncomment below for development seed data
/*
INSERT INTO users (phone, name, email) VALUES 
    ('+919876543210', 'Raj Kumar', 'raj@example.com'),
    ('+919988776655', 'Priya Sharma', 'priya@example.com');
*/
