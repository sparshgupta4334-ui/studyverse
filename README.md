<div align="center">

# 📒 KhataBook Pro

**Free digital ledger app for small businesses — manage customers, track credit/debit, and never miss a payment.**

[![Flutter](https://img.shields.io/badge/Flutter-3.x-02569B?logo=flutter)](https://flutter.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://postgresql.org)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase)](https://firebase.google.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#-features) · [Quick Start](#-quick-start) · [Tech Stack](#-tech-stack) · [API](#-api-overview) · [Deploy](#-production-deployment) · [Contributing](#-contributing)

</div>

---

## 📖 Project Overview

KhataBook Pro is a **100% free** digital ledger application designed for small business owners, shopkeepers, and freelancers. It replaces the traditional paper khata (account book) with a smart, cloud-synced solution that works offline and notifies customers automatically.

**Why KhataBook Pro?**
- No subscription fees, no hidden charges — forever free
- Works offline with automatic cloud sync when connectivity is restored
- Supports multiple languages (Hindi, English, and regional locales)
- End-to-end encrypted customer data
- One-tap payment collection via Razorpay UPI/cards

---

## ✨ Features

| Category | Feature | Status |
|---|---|---|
| **Customers** | Unlimited customer accounts | ✅ Free |
| **Customers** | Customer profile with photo & notes | ✅ Free |
| **Transactions** | Unlimited credit/debit entries | ✅ Free |
| **Transactions** | Bulk transaction import (CSV) | ✅ Free |
| **Payments** | Razorpay UPI / card collection | ✅ Free |
| **Reminders** | SMS & WhatsApp payment reminders | ✅ Free |
| **Reports** | Daily/weekly/monthly summaries | ✅ Free |
| **Reports** | PDF & Excel export | ✅ Free |
| **Sync** | Offline-first with cloud sync | ✅ Free |
| **Auth** | OTP-based phone authentication | ✅ Free |
| **Multi-device** | Login from multiple devices | ✅ Free |

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Mobile App** | Flutter | 3.x (Dart ≥ 3.0) |
| **State Management** | Provider | 6.x |
| **Backend API** | Node.js + Express | 18 LTS |
| **Database** | PostgreSQL | 16 |
| **Cache / Queue** | Redis | 7 |
| **Authentication** | Firebase Auth (Phone OTP) | v4 |
| **Push Notifications** | Firebase Cloud Messaging | v4 |
| **Payments** | Razorpay | v2 |
| **SMS Reminders** | Twilio | v5 |
| **PDF Generation** | PDFKit | v0.15 |
| **Process Manager** | PM2 | v5 |
| **Reverse Proxy** | Nginx | 1.24+ |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18 ([nvm](https://github.com/nvm-sh/nvm) recommended)
- **Flutter** ≥ 3.0 ([flutter.dev/docs/get-started](https://flutter.dev/docs/get-started/install))
- **Docker & Docker Compose** ≥ v2 ([docs.docker.com](https://docs.docker.com/get-docker/))
- **Git**

### 1 — Clone the repository

```bash
git clone https://github.com/your-org/khatabook-pro.git
cd khatabook-pro
```

### 2 — Start infrastructure (PostgreSQL + Redis)

```bash
docker compose up -d db redis
# Wait ~10 s for Postgres to be healthy
docker compose ps          # verify Status = healthy
```

### 3 — Configure backend environment

```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your Firebase, Razorpay & Twilio credentials
```

### 4 — Run the backend

```bash
cd backend
npm install
npm run dev          # starts with nodemon hot-reload on :3000
```

### 5 — Run the Flutter app

```bash
cd frontend
flutter pub get
flutter run          # pick your device / emulator
```

The API will be available at `http://localhost:3000` and the Swagger UI at `http://localhost:3000/api-docs`.

---

## 📁 Folder Structure

```
khatabook-pro/
├── backend/                    # Node.js + Express REST API
│   ├── src/
│   │   ├── config/             # DB, Redis, Firebase initialisation
│   │   │   ├── database.js
│   │   │   ├── redis.js
│   │   │   └── firebase.js
│   │   ├── controllers/        # Request handlers (thin layer)
│   │   ├── middleware/         # Auth, rate-limit, validation, error
│   │   ├── routes/             # Express router definitions
│   │   ├── services/           # Business logic (payment, SMS, report)
│   │   └── utils/              # Logger, helpers
│   ├── swagger.yaml            # OpenAPI 3.0 spec (auto-served)
│   ├── server.js               # Entry point
│   └── package.json
│
├── frontend/                   # Flutter mobile application
│   ├── lib/
│   │   ├── models/             # Data models
│   │   ├── providers/          # Provider state management
│   │   ├── screens/            # UI screens
│   │   ├── services/           # API & local DB services
│   │   └── widgets/            # Reusable widgets
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   └── pubspec.yaml
│
├── database/                   # Database schema & seeds
│   ├── migrations/             # Numbered SQL migration files
│   └── seeds/                  # Development seed data
│
├── docs/                       # Extended documentation
│   └── DEPLOYMENT.md           # Production deployment guide
│
├── docker-compose.yml          # Local dev environment
├── .gitignore
└── README.md
```

---

## 💻 Development Setup (Local)

### Backend environment variables

Create `backend/.env` (copy from `backend/.env.example`):

```dotenv
# App
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# PostgreSQL (matches docker-compose defaults)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=khatabook
DB_USER=khata_user
DB_PASSWORD=khata_password

# Redis (matches docker-compose defaults)
REDIS_URL=redis://localhost:6379

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
```

### Running database migrations

```bash
# With Docker Compose running
docker compose exec db psql -U khata_user -d khatabook \
  -f /docker-entrypoint-initdb.d/001_create_users.sql

# Or run all migrations in order
for f in database/migrations/*.sql; do
  docker compose exec -T db psql -U khata_user -d khatabook < "$f"
done
```

### Useful development commands

```bash
# Backend
npm run dev          # hot-reload dev server
npm run lint         # ESLint
npm test             # Jest test suite

# Flutter
flutter pub get      # install dependencies
flutter analyze      # static analysis
flutter test         # unit & widget tests
flutter build apk    # Android release build
flutter build ios    # iOS release build (macOS only)

# Docker
docker compose up -d              # start all services
docker compose logs -f backend    # follow backend logs
docker compose down -v            # stop and remove volumes
```

---

## 🚢 Production Deployment

See the full guide in **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** for:

- AWS EC2 + RDS + ElastiCache setup
- Nginx reverse proxy with SSL (Let's Encrypt)
- PM2 process management & auto-restart
- Database backup strategy
- Auto-scaling considerations

### TL;DR — Docker production stack

```bash
# On your production server
git clone https://github.com/your-org/khatabook-pro.git
cd khatabook-pro

# Set production env vars
cp backend/.env.example backend/.env.production
# ... fill in real credentials ...

NODE_ENV=production docker compose -f docker-compose.yml up -d
```

---

## 🔌 API Overview

Base URL: `https://api.yourdomain.com/api/v1`

Full OpenAPI 3.0 specification: [`backend/swagger.yaml`](backend/swagger.yaml)
Interactive Swagger UI (dev): `http://localhost:3000/api-docs`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/send-otp` | Send OTP to phone number |
| `POST` | `/auth/verify-otp` | Verify OTP → issue JWT |
| `POST` | `/auth/refresh` | Refresh access token |
| `GET` | `/customers` | List all customers (paginated) |
| `POST` | `/customers` | Create new customer |
| `GET` | `/customers/:id` | Get customer by ID |
| `PUT` | `/customers/:id` | Update customer |
| `DELETE` | `/customers/:id` | Delete customer |
| `GET` | `/transactions` | List transactions (filterable) |
| `POST` | `/transactions` | Record new transaction |
| `GET` | `/transactions/:id` | Get transaction by ID |
| `PUT` | `/transactions/:id` | Update transaction |
| `DELETE` | `/transactions/:id` | Delete transaction |
| `POST` | `/payments/create-order` | Create Razorpay order |
| `POST` | `/payments/verify` | Verify payment signature |
| `GET` | `/payments` | List payment history |
| `POST` | `/reminders/send` | Send payment reminder |
| `GET` | `/reminders` | List sent reminders |
| `GET` | `/reports/summary` | Business summary report |
| `GET` | `/reports/export` | Export report (PDF/Excel) |
| `POST` | `/sync/push` | Push offline changes to cloud |
| `GET` | `/sync/pull` | Pull latest changes to device |

Authentication: `Authorization: Bearer <access_token>` header required on all endpoints except `/auth/*`.

---

## 🤝 Contributing

We welcome contributions of all kinds — bug fixes, features, translations, and documentation.

### How to contribute

1. **Fork** the repository and create your branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Set up** your local environment following the [Development Setup](#-development-setup-local) guide.

3. **Make your changes**, following these conventions:
   - Backend: [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
   - Flutter: [Effective Dart](https://dart.dev/guides/language/effective-dart)
   - Commit messages: [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, etc.)

4. **Test** your changes:
   ```bash
   # Backend tests
   cd backend && npm test

   # Flutter tests
   cd frontend && flutter test
   ```

5. **Open a Pull Request** against `main` with a clear description of what changed and why.

### Reporting bugs

Please [open an issue](https://github.com/your-org/khatabook-pro/issues/new) with:
- Steps to reproduce
- Expected vs actual behaviour
- Device / OS / app version

### Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/). By participating you agree to abide by its terms.

---

## 📄 License

[MIT](LICENSE) © 2024 KhataBook Pro Contributors 
