-- =============================================================================
-- Seed Data: seed_data.sql
-- Description: Realistic sample data for development and testing.
--              Runs inside a single transaction so it can be rolled back cleanly.
-- WARNING: Do NOT run against production databases.
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- Disable triggers during bulk insert to avoid redundant balance recalcs;
-- we'll set final balances explicitly and re-enable triggers after.
-- ---------------------------------------------------------------------------
SET session_replication_role = 'replica';   -- disables FK checks & triggers for this session

-- ===========================================================================
-- USERS  (5 sample users)
-- ===========================================================================
INSERT INTO users (user_id, phone, email, name, device_tokens, is_active)
VALUES
    ('00000000-0000-0000-0000-000000000001',
     '+919876543210', 'rajesh.kumar@example.com', 'Rajesh Kumar',
     '[{"token":"fcm_token_rajesh_01","platform":"android"}]', TRUE),

    ('00000000-0000-0000-0000-000000000002',
     '+919876543211', 'priya.sharma@example.com', 'Priya Sharma',
     '[{"token":"apns_token_priya_01","platform":"ios"}]',    TRUE),

    ('00000000-0000-0000-0000-000000000003',
     '+919876543212', NULL, 'Mohammed Ali',
     '[]', TRUE),

    ('00000000-0000-0000-0000-000000000004',
     '+919876543213', 'sunita.devi@example.com', 'Sunita Devi',
     '[{"token":"fcm_token_sunita_01","platform":"android"}]', TRUE),

    ('00000000-0000-0000-0000-000000000005',
     '+919876543214', NULL, 'Arun Patel',
     '[]', FALSE)   -- inactive / churned user
ON CONFLICT (user_id) DO NOTHING;

-- ===========================================================================
-- CUSTOMERS  (10 sample customers spread across users)
-- ===========================================================================
INSERT INTO customers (
    customer_id, user_id, name, phone, email, address,
    balance, tags, notes, last_transaction_date, is_active
)
VALUES
    -- Rajesh's customers
    ('10000000-0000-0000-0000-000000000001',
     '00000000-0000-0000-0000-000000000001',
     'Amit Soni', '+919000000001', 'amit.soni@example.com',
     '12 MG Road, Jaipur, RJ 302001',
     15000, '{"regular","wholesale"}', 'Bulk buyer, net-30 terms',
     NOW() - INTERVAL '2 days', TRUE),

    ('10000000-0000-0000-0000-000000000002',
     '00000000-0000-0000-0000-000000000001',
     'Deepa Nair', '+919000000002', NULL,
     '45 Anna Salai, Chennai, TN 600002',
     -5000, '{"retail"}', 'Advance payment pending adjustment',
     NOW() - INTERVAL '5 days', TRUE),

    ('10000000-0000-0000-0000-000000000003',
     '00000000-0000-0000-0000-000000000001',
     'Suresh Babu', '+919000000003', 'suresh.babu@example.com',
     NULL,
     0, '{}', NULL,
     NULL, TRUE),

    -- Priya's customers
    ('10000000-0000-0000-0000-000000000004',
     '00000000-0000-0000-0000-000000000002',
     'Kavita Rao', '+919000000004', NULL,
     '7 Brigade Road, Bengaluru, KA 560001',
     32000, '{"vip","supplier"}', 'Preferred supplier for electronics',
     NOW() - INTERVAL '1 day', TRUE),

    ('10000000-0000-0000-0000-000000000005',
     '00000000-0000-0000-0000-000000000002',
     'Farhan Sheikh', '+919000000005', 'farhan@example.com',
     NULL,
     -12000, '{"credit-risk"}', 'Delayed payments — follow up weekly',
     NOW() - INTERVAL '10 days', TRUE),

    -- Mohammed's customers
    ('10000000-0000-0000-0000-000000000006',
     '00000000-0000-0000-0000-000000000003',
     'Ritu Agarwal', '+919000000006', NULL,
     '33 Civil Lines, Allahabad, UP 211001',
     8500, '{"regular"}', NULL,
     NOW() - INTERVAL '3 days', TRUE),

    ('10000000-0000-0000-0000-000000000007',
     '00000000-0000-0000-0000-000000000003',
     'Ganesh Iyer', '+919000000007', 'ganesh.iyer@example.com',
     '88 T Nagar, Chennai, TN 600017',
     0, '{}', 'Account settled',
     NOW() - INTERVAL '30 days', TRUE),

    -- Sunita's customers
    ('10000000-0000-0000-0000-000000000008',
     '00000000-0000-0000-0000-000000000004',
     'Manish Gupta', '+919000000008', NULL,
     NULL,
     25000, '{"wholesale","priority"}', 'Monthly credit limit ₹50,000',
     NOW() - INTERVAL '1 day', TRUE),

    ('10000000-0000-0000-0000-000000000009',
     '00000000-0000-0000-0000-000000000004',
     'Lata Mishra', '+919000000009', NULL,
     '22 Hazratganj, Lucknow, UP 226001',
     -2000, '{"retail"}', NULL,
     NOW() - INTERVAL '7 days', TRUE),

    -- Inactive customer
    ('10000000-0000-0000-0000-000000000010',
     '00000000-0000-0000-0000-000000000001',
     'Vijay Tiwari', '+919000000010', NULL,
     NULL,
     0, '{}', 'Account closed',
     NOW() - INTERVAL '90 days', FALSE)
ON CONFLICT (customer_id) DO NOTHING;

-- ===========================================================================
-- PAYMENTS  (sample payments; inserted before transactions due to FK)
-- ===========================================================================
INSERT INTO payments (
    payment_id, transaction_id, user_id, customer_id,
    amount, upi_id, razorpay_order_id, razorpay_payment_id,
    status, gateway_response
)
VALUES
    ('20000000-0000-0000-0000-000000000001',
     NULL,   -- will be linked below
     '00000000-0000-0000-0000-000000000001',
     '10000000-0000-0000-0000-000000000001',
     5000, 'amit@okaxis', NULL, NULL,
     'success',
     '{"method":"upi","bank":"Axis","vpa":"amit@okaxis","utr":"UTR123456789"}'::JSONB),

    ('20000000-0000-0000-0000-000000000002',
     NULL,
     '00000000-0000-0000-0000-000000000002',
     '10000000-0000-0000-0000-000000000004',
     10000, NULL, 'order_RZP001', 'pay_RZP001',
     'success',
     '{"method":"card","bank":"HDFC","card_network":"Visa","international":false}'::JSONB),

    ('20000000-0000-0000-0000-000000000003',
     NULL,
     '00000000-0000-0000-0000-000000000001',
     '10000000-0000-0000-0000-000000000002',
     3000, 'deepa@paytm', NULL, NULL,
     'pending',
     '{}'::JSONB)
ON CONFLICT (payment_id) DO NOTHING;

-- ===========================================================================
-- TRANSACTIONS  (sample ledger entries; balance_after pre-computed to match
--               customer.balance seeds above — triggers are disabled)
-- ===========================================================================
INSERT INTO transactions (
    transaction_id, customer_id, user_id,
    amount, type, notes, category,
    balance_after, sync_status, payment_id,
    created_at, updated_at
)
VALUES
    -- Amit Soni (Rajesh) — net 15000 receivable
    ('30000000-0000-0000-0000-000000000001',
     '10000000-0000-0000-0000-000000000001',
     '00000000-0000-0000-0000-000000000001',
     20000, 'credit', 'Goods sold - Invoice #1001', 'sales',
     20000, 'synced', NULL,
     NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),

    ('30000000-0000-0000-0000-000000000002',
     '10000000-0000-0000-0000-000000000001',
     '00000000-0000-0000-0000-000000000001',
     5000, 'debit', 'Payment received via UPI', 'payment',
     15000, 'synced',
     '20000000-0000-0000-0000-000000000001',
     NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

    -- Deepa Nair (Rajesh) — net -5000 (user owes Deepa)
    ('30000000-0000-0000-0000-000000000003',
     '10000000-0000-0000-0000-000000000002',
     '00000000-0000-0000-0000-000000000001',
     3000, 'debit', 'Advance payment received', 'payment',
     -3000, 'synced', NULL,
     NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),

    ('30000000-0000-0000-0000-000000000004',
     '10000000-0000-0000-0000-000000000002',
     '00000000-0000-0000-0000-000000000001',
     2000, 'debit', 'Additional advance', 'payment',
     -5000, 'pending',
     '20000000-0000-0000-0000-000000000003',
     NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),

    -- Kavita Rao (Priya) — net 32000 receivable
    ('30000000-0000-0000-0000-000000000005',
     '10000000-0000-0000-0000-000000000004',
     '00000000-0000-0000-0000-000000000002',
     42000, 'credit', 'Electronics supply - Invoice #2001', 'sales',
     42000, 'synced', NULL,
     NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),

    ('30000000-0000-0000-0000-000000000006',
     '10000000-0000-0000-0000-000000000004',
     '00000000-0000-0000-0000-000000000002',
     10000, 'debit', 'Partial payment via Razorpay', 'payment',
     32000, 'synced',
     '20000000-0000-0000-0000-000000000002',
     NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

    -- Ritu Agarwal (Mohammed) — net 8500 receivable
    ('30000000-0000-0000-0000-000000000007',
     '10000000-0000-0000-0000-000000000006',
     '00000000-0000-0000-0000-000000000003',
     8500, 'credit', 'Textile goods sold', 'sales',
     8500, 'synced', NULL,
     NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

    -- Manish Gupta (Sunita) — net 25000 receivable
    ('30000000-0000-0000-0000-000000000008',
     '10000000-0000-0000-0000-000000000008',
     '00000000-0000-0000-0000-000000000004',
     25000, 'credit', 'Monthly wholesale order #W-4521', 'sales',
     25000, 'synced', NULL,
     NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day')
ON CONFLICT (transaction_id, created_at) DO NOTHING;

-- Link transaction_id back to payments (now that transactions exist)
UPDATE payments
SET transaction_id = '30000000-0000-0000-0000-000000000002'
WHERE payment_id   = '20000000-0000-0000-0000-000000000001';

UPDATE payments
SET transaction_id = '30000000-0000-0000-0000-000000000006'
WHERE payment_id   = '20000000-0000-0000-0000-000000000002';

UPDATE payments
SET transaction_id = '30000000-0000-0000-0000-000000000004'
WHERE payment_id   = '20000000-0000-0000-0000-000000000003';

-- ===========================================================================
-- REMINDERS
-- ===========================================================================
INSERT INTO reminders (
    reminder_id, customer_id, user_id, message,
    sent_at, status, delivery_status, phone
)
VALUES
    ('40000000-0000-0000-0000-000000000001',
     '10000000-0000-0000-0000-000000000001',
     '00000000-0000-0000-0000-000000000001',
     'Dear Amit, your outstanding balance is ₹150.00. Please settle at your earliest convenience. — Rajesh',
     NOW() - INTERVAL '1 day', 'sent', 'delivered', '+919000000001'),

    ('40000000-0000-0000-0000-000000000002',
     '10000000-0000-0000-0000-000000000005',
     '00000000-0000-0000-0000-000000000002',
     'Dear Farhan, your account shows a balance of ₹120.00 outstanding. Please contact us. — Priya',
     NOW() - INTERVAL '3 days', 'sent', 'undelivered', '+919000000005'),

    ('40000000-0000-0000-0000-000000000003',
     '10000000-0000-0000-0000-000000000008',
     '00000000-0000-0000-0000-000000000004',
     'Dear Manish, Invoice #W-4521 of ₹250.00 is due. Kindly arrange payment. — Sunita',
     NULL, 'pending', NULL, '+919000000008')
ON CONFLICT (reminder_id) DO NOTHING;

-- ===========================================================================
-- BACKUPS
-- ===========================================================================
INSERT INTO backups (backup_id, user_id, backup_url, backup_size)
VALUES
    ('50000000-0000-0000-0000-000000000001',
     '00000000-0000-0000-0000-000000000001',
     'https://khata-backups.s3.ap-south-1.amazonaws.com/users/00000000-0000-0000-0000-000000000001/backup_2025_01_01.zip',
     204800),

    ('50000000-0000-0000-0000-000000000002',
     '00000000-0000-0000-0000-000000000002',
     'https://khata-backups.s3.ap-south-1.amazonaws.com/users/00000000-0000-0000-0000-000000000002/backup_2025_01_01.zip',
     153600)
ON CONFLICT (backup_id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Re-enable triggers
-- ---------------------------------------------------------------------------
SET session_replication_role = 'origin';

-- Refresh materialized view after seeding
REFRESH MATERIALIZED VIEW monthly_summary;

COMMIT;
