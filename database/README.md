# Khata App — PostgreSQL Database Schema

A production-ready PostgreSQL schema for the **Khata** digital ledger app.  
All monetary values are stored in **paise** (1 INR = 100 paise) as `BIGINT` to avoid floating-point errors.

---

## Directory Structure

```
database/
├── migrations/
│   ├── 001_create_users.sql          # users table, audit_logs, set_updated_at trigger
│   ├── 002_create_customers.sql      # customers table + balance trigger
│   ├── 003_create_transactions.sql   # transactions (partitioned) + balance-update trigger
│   ├── 004_create_payments.sql       # payments table + deferred FK to transactions
│   ├── 005_create_reminders.sql      # reminders table
│   ├── 006_create_backups.sql        # backups table + dashboard views + materialized view
│   └── 007_create_indexes.sql        # all B-tree, GIN, partial, and composite indexes
├── seeds/
│   └── seed_data.sql                 # 5 users, 10 customers, sample transactions/payments
└── README.md
```

---

## Prerequisites

| Requirement | Version |
|---|---|
| PostgreSQL | ≥ 14 (for `PARTITION BY RANGE` improvements) |
| Extensions | `pgcrypto`, `pg_trgm`, `btree_gin` |

---

## Running Migrations

Apply migrations **in order** using `psql`:

```bash
# Create the database
createdb khata_db

# Apply all migrations sequentially
psql -d khata_db -f database/migrations/001_create_users.sql
psql -d khata_db -f database/migrations/002_create_customers.sql
psql -d khata_db -f database/migrations/003_create_transactions.sql
psql -d khata_db -f database/migrations/004_create_payments.sql
psql -d khata_db -f database/migrations/005_create_reminders.sql
psql -d khata_db -f database/migrations/006_create_backups.sql
psql -d khata_db -f database/migrations/007_create_indexes.sql

# (Optional) Load seed data for development
psql -d khata_db -f database/seeds/seed_data.sql
```

Or apply all at once:

```bash
for f in database/migrations/*.sql; do psql -d khata_db -f "$f"; done
psql -d khata_db -f database/seeds/seed_data.sql
```

---

## Schema Overview

### `users`
Primary entity. Authenticated via phone OTP.  
`device_tokens` is a JSONB array of `{ token, platform }` objects for FCM/APNs push notifications.

### `customers`
Contacts (khata parties) belonging to a user.  
`balance` (paise) is maintained automatically by a trigger on `transactions`:
- **Positive** → customer owes the user (**receivable**)  
- **Negative** → user owes the customer (**payable / advance**)

### `transactions` *(range-partitioned by `created_at`)*
Immutable ledger entries. Each row increments or decrements `customers.balance`.  
`balance_after` is a denormalised snapshot for fast statement rendering without window functions.  

Monthly partitions are pre-created for 2024–2025. Add future partitions via:
```sql
CREATE TABLE transactions_2026_01
    PARTITION OF transactions
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
```
Automate with **pg_cron**:
```sql
-- Run on the 25th of each month to pre-create next month's partition
SELECT cron.schedule('create-txn-partition', '0 0 25 * *', $$
    -- partition creation script
$$);
```

### `payments`
UPI and Razorpay payment attempts. Linked to a `transaction` via `payment_id` (nullable, deferred FK).  
The deferred constraint allows inserting a payment and its transaction in the same transaction block without ordering issues.

### `reminders`
WhatsApp/SMS payment reminders dispatched to customers.  
`delivery_status` is updated asynchronously via messaging provider webhooks.

### `backups`
Metadata for user data exports stored in S3/GCS. The actual file lives at `backup_url`.

### `audit_logs`
Append-only audit trail populated by `AFTER` triggers on all major tables.  
Records `old_data` and `new_data` as JSONB for full change history.

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| `BIGINT` for money | Avoids floating-point rounding; paise precision is sufficient |
| Partitioned `transactions` | Enables partition pruning on date-range queries; old partitions can be archived/detached |
| Deferred FK `payments → transactions` | Allows atomic creation of payment + transaction in any order |
| GIN trigram index on `customers.name` | Supports `ILIKE '%query%'` and fuzzy search efficiently |
| Partial indexes on `is_active = TRUE` | Reduces index size; active records are the hot path |
| `balance_after` denormalisation | O(1) statement balance lookup instead of `SUM()` window function |
| `audit_logs` with JSONB | Schema-agnostic; survives column additions without migration |

---

## Views

| View | Description |
|---|---|
| `user_dashboard_stats` | Per-user total receivable, payable, net balance, customer counts |
| `customer_statement` | Chronological transactions enriched with payment and customer details |
| `monthly_summary` *(materialized)* | Monthly credit/debit aggregates; refresh nightly via `pg_cron` |

Refresh the materialized view:
```sql
REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_summary;
```

---

## Triggers Summary

| Trigger | Table | Event | Action |
|---|---|---|---|
| `trg_*_set_updated_at` | All (except `reminders`, `backups`) | `BEFORE UPDATE` | Sets `updated_at = NOW()` |
| `trg_transactions_balance` | `transactions` | `AFTER INSERT/UPDATE/DELETE` | Updates `customers.balance` and `last_transaction_date` |
| `trg_*_audit` | All major tables | `AFTER INSERT/UPDATE/DELETE` | Appends row to `audit_logs` |

---

## Index Strategy

| Index | Type | Purpose |
|---|---|---|
| `idx_customers_user_created` | B-tree | Customer list per user, date-sorted |
| `idx_customers_user_balance` (partial) | B-tree | Dashboard receivable/payable queries |
| `idx_customers_user_phone` | B-tree | Duplicate phone detection |
| `idx_customers_name_trgm` | GIN | Fuzzy customer name search |
| `idx_transactions_user_created` | B-tree | All transactions per user |
| `idx_transactions_customer_created` | B-tree | Customer statement |
| `idx_transactions_sync_status` (partial) | B-tree | Offline sync queue |
| `idx_payments_status_pending` (partial) | B-tree | Payment retry/polling worker |
| `idx_reminders_pending` (partial) | B-tree | Reminder dispatch worker |

---

## Seed Data

`seeds/seed_data.sql` inserts realistic sample data for local development:

- **5 users** (including 1 inactive)
- **10 customers** (mix of receivable, payable, and zero-balance)
- **8 transactions** (credits and debits across multiple users)
- **3 payments** (UPI and Razorpay, various statuses)
- **3 reminders** (sent, failed, pending)
- **2 backups**

> **Note:** The seed file temporarily sets `session_replication_role = 'replica'` to bypass triggers during bulk insert and then sets pre-computed balances directly on customer rows. Re-enable triggers (`SET session_replication_role = 'origin'`) is called at the end.

---

## Adding Future Monthly Partitions

To avoid rows landing in `transactions_default`, create partitions ahead of time.  
Use this template or automate with **pg_cron**:

```sql
DO $$
DECLARE
    v_start DATE := DATE_TRUNC('month', NOW() + INTERVAL '1 month');
    v_end   DATE := v_start + INTERVAL '1 month';
    v_name  TEXT := 'transactions_' || TO_CHAR(v_start, 'YYYY_MM');
BEGIN
    EXECUTE FORMAT(
        'CREATE TABLE IF NOT EXISTS %I PARTITION OF transactions FOR VALUES FROM (%L) TO (%L)',
        v_name, v_start, v_end
    );
END $$;
```
