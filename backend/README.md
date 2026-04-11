# Khata Backend API

Production-ready Node.js/Express backend for the Khata digital ledger app.

## Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js ≥ 18 |
| Framework | Express 4 |
| Database | PostgreSQL (via `pg` connection pool) |
| Auth | Firebase Phone OTP → JWT (access + refresh tokens) |
| Payments | Razorpay UPI |
| SMS | Twilio / Fast2SMS |
| Cache | Redis (optional) |
| PDF | PDFKit |
| Logging | Winston + daily-rotate-file |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill environment variables
cp .env.example .env

# 3. Ensure PostgreSQL is running and the DB exists
createdb khata_db

# 4. Start development server (tables are auto-created on first run)
npm run dev

# 5. Production
npm start
```

---

## API Reference

All routes are prefixed with `/api/v1`.

### Health
```
GET /api/v1/health
```

### Authentication

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/verify-otp` | Exchange Firebase ID token → JWT pair |
| POST | `/auth/refresh` | Rotate refresh token → new access token |
| POST | `/auth/logout` | Revoke refresh token |
| POST | `/auth/logout-all` | Revoke all refresh tokens |
| GET  | `/auth/me` | Get current user profile |
| PATCH | `/auth/me` | Update profile |

### Customers

| Method | Path | Description |
|--------|------|-------------|
| GET | `/customers` | List (search, pagination) |
| POST | `/customers` | Create |
| GET | `/customers/:id` | Get by ID |
| PATCH | `/customers/:id` | Update |
| DELETE | `/customers/:id` | Soft-delete |

### Transactions

| Method | Path | Description |
|--------|------|-------------|
| GET | `/transactions` | All transactions (cursor pagination) |
| GET | `/transactions/:id` | Single transaction |
| GET | `/customers/:id/transactions` | Customer transactions |
| POST | `/customers/:id/transactions` | Add credit/debit entry |

### Payments (Razorpay UPI)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/payments/orders` | Create Razorpay order |
| POST | `/payments/verify` | Verify payment signature |
| POST | `/payments/webhook` | Razorpay webhook handler |
| GET  | `/payments/:id` | Get payment |
| GET  | `/customers/:id/payments` | Customer payments |

### Reminders (SMS)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/customers/:id/reminders` | Send/schedule reminder |
| GET  | `/customers/:id/reminders` | List reminders |
| GET  | `/reminders/:id` | Get reminder |
| DELETE | `/reminders/:id` | Cancel pending reminder |
| POST | `/reminders/process-due` | Process due reminders (cron) |

### Reports

| Method | Path | Description |
|--------|------|-------------|
| GET | `/reports/summary` | Credit/debit summary by period |
| GET | `/reports/daily` | Day-by-day breakdown |
| GET | `/reports/export?format=pdf` | Download PDF ledger report |
| GET | `/reports/top-debtors` | Customers with highest outstanding |

### Sync (offline-first)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/sync?lastSyncedAt=ISO` | Pull changes since timestamp |
| POST | `/sync` | Push offline changes (customers + transactions) |

---

## Authentication Flow

```
Mobile App                         Backend
    │                                  │
    │── Firebase Phone OTP ──────────▶ Firebase
    │◀─ idToken ────────────────────── Firebase
    │                                  │
    │── POST /auth/verify-otp ────────▶│
    │   { idToken }                    │── verifyIdToken(idToken)
    │                                  │── upsertUser(phone)
    │◀─ { accessToken, refreshToken } ─│
    │                                  │
    │── API calls with Bearer token ──▶│ (15-min access token)
    │── POST /auth/refresh ───────────▶│ (rotate refresh token)
```

---

## Pagination

All list endpoints use **cursor-based pagination**:

```json
{
  "data": [...],
  "pagination": {
    "limit": 20,
    "hasMore": true,
    "nextCursor": "2024-01-15T10:30:00.000Z:uuid-here",
    "prevCursor": null
  }
}
```

Pass `cursor` as a query parameter to fetch the next page.

---

## Environment Variables

See [`.env.example`](.env.example) for all required variables.

**Required for core functionality:**
- `DB_*` – PostgreSQL connection
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` – ≥ 32 chars each
- `FIREBASE_*` – Firebase Admin SDK credentials

**Required per feature:**
- `RAZORPAY_*` – for payments
- `TWILIO_*` or `FAST2SMS_API_KEY` – for SMS reminders
- `REDIS_*` + `REDIS_ENABLED=true` – for caching

---

## Database Schema

Tables are auto-created on server start (idempotent `CREATE TABLE IF NOT EXISTS`):

- `users` – accounts linked to phone numbers
- `refresh_tokens` – JWT refresh token store
- `customers` – ledger contacts per user
- `transactions` – immutable credit/debit ledger entries
- `payments` – Razorpay order/payment records
- `reminders` – SMS reminder log

All monetary values are stored as **paise** (integer) to avoid floating-point errors.

---

## Rate Limits

| Endpoint group | Limit |
|----------------|-------|
| API (global) | 1 000 req / 15 min per IP |
| Auth endpoints | 20 req / 15 min per IP |
| Webhook | 500 req / min |

---

## Deployment

### Docker (example)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### PM2
```bash
npm install -g pm2
pm2 start server.js --name khata-api --instances max
pm2 save
```

### Cron for scheduled reminders
```bash
# Process due reminders every minute
* * * * * curl -X POST http://localhost:3000/api/v1/reminders/process-due \
  -H "Authorization: Bearer $CRON_TOKEN"
```
