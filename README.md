# Gupta Paper Stores - Digital Ledger Platform

A complete production-ready digital ledger platform for managing business transactions, customers, payments, and SMS reminders.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT
- **Payments**: Razorpay UPI
- **SMS**: Twilio
- **Charts**: Recharts

## 📦 Features

- ✅ User registration with phone + email
- ✅ OTP verification
- ✅ Secure JWT authentication
- ✅ Customer management (add/edit/delete)
- ✅ Transaction tracking (credit/debit)
- ✅ Auto balance calculations (stored in paise)
- ✅ Razorpay UPI payment integration
- ✅ Twilio SMS reminders
- ✅ PDF & CSV report generation
- ✅ Admin dashboard
- ✅ Data backup
- ✅ Docker setup

## 🛠️ Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+

### Option 1: Docker (Recommended)

```bash
# Clone repository
git clone <repo-url>
cd studyverse

# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env with your database credentials

# Set up database (PostgreSQL must be running)
psql -U postgres -c "CREATE DATABASE gupta_paper_stores;"
psql -U postgres -d gupta_paper_stores -f src/migrations/schema.sql

# Start development server
npm run dev
```

#### Frontend Setup

```bash
# From root directory
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env with your API URL

# Start development server
npm run dev
```

## 🔧 Environment Configuration

### Backend (backend/.env)

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/gupta_paper_stores
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Frontend (.env)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with phone/password
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Customers
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create customer
- `GET /api/customers/:id` - Get customer details
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Transactions
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/:id` - Get transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments` - List payments

### Reminders
- `POST /api/reminders/send` - Send SMS reminder
- `GET /api/reminders` - List reminders

### Reports
- `GET /api/reports/stats` - Dashboard statistics
- `POST /api/reports/generate` - Generate report (PDF/CSV)

## 🗄️ Database Schema

The database uses PostgreSQL with the following tables:
- `users` - Business owner accounts
- `customers` - Customer profiles (scoped per user)
- `transactions` - Credit/debit entries (amounts in paise)
- `payments` - Razorpay payment records
- `reminders` - SMS reminder history
- `backups` - Data backups
- `otps` - OTP verification codes

## 🚢 Production Deployment

### Deploy to Vercel (Frontend)

```bash
npm install -g vercel
vercel --prod
```

### Deploy Backend to Railway/Render

1. Set environment variables
2. Connect PostgreSQL database
3. Deploy backend directory

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend lint
npm run lint
```

## 📁 Project Structure

```
studyverse/
├── app/                    # Next.js 14 app directory
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # User dashboard pages
│   ├── (admin)/           # Admin pages
│   ├── layout.tsx
│   └── page.tsx           # Landing page
├── components/            # React components
├── lib/                   # Utilities, API client, types
├── backend/               # Node.js Express API
│   └── src/
│       ├── app.ts
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── migrations/
│       └── routes/
├── docker-compose.yml
└── README.md
```
