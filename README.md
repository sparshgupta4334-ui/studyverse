# StudyVerse - Digital Ledger App 📒

A production-ready digital ledger (khata) mobile application for small businesses to manage customer credit/debit transactions, send reminders, and accept UPI payments.

## 🚀 Features

- **OTP Authentication** - Firebase phone OTP login with JWT sessions
- **Customer Management** - Add, edit, delete customers with search & filter
- **Ledger System** - Credit/debit transactions with auto-balance calculation
- **Dashboard** - Color-coded balance overview (green = receivable, red = payable)
- **UPI Payments** - Razorpay integration for collecting payments
- **SMS Reminders** - Twilio/Fast2SMS reminder system with scheduling
- **Offline Support** - Hive local caching for offline access
- **Reports** - Daily/weekly/monthly summaries with charts
- **Dark Mode** - Full dark mode support

## 📁 Project Structure

```
studyverse/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── config/          # Database, Firebase, env config
│   │   ├── middleware/      # Auth, error handling
│   │   ├── routes/          # API route definitions
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── models/          # Database models
│   │   ├── migrations/      # SQL migrations
│   │   └── utils/           # Validators, helpers, logger
│   ├── tests/               # Jest test suite
│   ├── Dockerfile
│   └── package.json
├── frontend/                # Flutter mobile app
│   └── lib/
│       ├── config/          # App config, theme, constants
│       ├── models/          # Data models
│       ├── services/        # API, auth, database services
│       ├── providers/       # State management (Provider)
│       ├── screens/         # UI screens
│       ├── widgets/         # Reusable widgets
│       └── utils/           # Formatters, validators, helpers
├── docs/                    # API documentation
├── docker-compose.yml       # Docker orchestration
└── README.md
```

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Flutter (Dart) |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Auth | Firebase OTP + JWT |
| Payments | Razorpay |
| SMS | Twilio / Fast2SMS |
| Cache | Hive (Flutter) |
| Container | Docker + Docker Compose |
| Logging | Winston |

## 🏃 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Flutter 3.0+
- Docker & Docker Compose (optional)
- Firebase project with Phone Auth enabled
- Razorpay account (for payments)

### 1. Clone & Setup

```bash
git clone <repository-url>
cd studyverse
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
npm install
```

### 3. Database Setup

```bash
# Create database
psql -U postgres -c "CREATE DATABASE studyverse_db;"

# Run migrations
npm run migrate
```

### 4. Start Backend

```bash
npm run dev    # Development with auto-reload
# OR
npm start      # Production
```

### 5. Flutter Frontend Setup

```bash
cd frontend
flutter pub get
flutter run
```

## 🐳 Docker Deployment

```bash
# Copy and configure environment
cp backend/.env.example .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
All protected routes require JWT Bearer token:
```
Authorization: Bearer <access_token>
```

### Endpoints

#### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login with Firebase OTP token |
| POST | `/auth/refresh` | Refresh access token |
| GET | `/auth/profile` | Get user profile |
| PUT | `/auth/profile` | Update user profile |
| POST | `/auth/logout` | Logout |

#### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customers` | List all customers |
| POST | `/customers` | Create customer |
| GET | `/customers/stats` | Dashboard stats |
| GET | `/customers/:id` | Get customer |
| PUT | `/customers/:id` | Update customer |
| DELETE | `/customers/:id` | Delete customer |

#### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/transactions/customer/:customerId` | Get customer transactions |
| POST | `/transactions` | Create transaction |
| GET | `/transactions/report` | Get report summary |
| GET | `/transactions/:id` | Get transaction |
| DELETE | `/transactions/:id` | Delete transaction |

#### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/payments/initiate` | Create Razorpay order |
| POST | `/payments/verify` | Verify payment signature |
| GET | `/payments/customer/:id` | Get payment history |

#### Reminders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reminders` | List reminders |
| POST | `/reminders/send` | Send immediate reminder |
| POST | `/reminders/schedule` | Schedule reminder |
| GET | `/reminders/:id` | Get reminder |

### Example Requests

#### Login
```json
POST /api/auth/login
{
  "phone": "+919876543210",
  "firebaseToken": "eyJ..."
}
```

#### Create Transaction
```json
POST /api/transactions
Authorization: Bearer <token>
{
  "customerId": "uuid-here",
  "amount": 5000,
  "type": "credit",
  "notes": "Payment for goods"
}
```

## 🗄 Database Schema

### Users
```sql
user_id, phone, email, name, fcm_token, is_active, last_login, created_at, updated_at
```

### Customers
```sql
customer_id, user_id, name, phone, email, balance, notes, last_transaction_date, is_active, created_at
```

### Transactions
```sql
transaction_id, customer_id, amount, type, notes, reference_id, sync_status, is_deleted, created_at
```

### Payments
```sql
payment_id, transaction_id, customer_id, user_id, amount, upi_id, order_id, status, gateway_response
```

### Reminders
```sql
reminder_id, customer_id, user_id, message, scheduled_at, sent_at, status, created_at
```

## 🔒 Security Features

- Helmet.js security headers
- JWT token authentication with refresh tokens
- Rate limiting (100 req/15min globally, 20 for auth)
- Input validation with express-validator
- CORS configuration
- PostgreSQL parameterized queries (SQL injection prevention)
- Non-root Docker user
- Secure storage for tokens (flutter_secure_storage)

## 🧪 Testing

```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Watch mode
```

## 📱 Flutter App Setup

### Firebase Configuration

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Phone Authentication
3. Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
4. Place files in appropriate directories

### Environment Configuration

Create `frontend/lib/config/env.dart` with:
```dart
// Use --dart-define for build-time configuration
// flutter run --dart-define=API_BASE_URL=https://your-api.com/api
```

## 🌍 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 3000) | No |
| `DB_HOST` | PostgreSQL host | Yes |
| `DB_NAME` | Database name | Yes |
| `DB_USER` | Database user | Yes |
| `DB_PASSWORD` | Database password | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `FIREBASE_PRIVATE_KEY` | Firebase private key | Yes |
| `FIREBASE_CLIENT_EMAIL` | Firebase client email | Yes |
| `RAZORPAY_KEY_ID` | Razorpay key ID | For payments |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret | For payments |
| `TWILIO_ACCOUNT_SID` | Twilio account SID | For SMS |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | For SMS |
| `TWILIO_PHONE_NUMBER` | Twilio phone number | For SMS |

## 📄 License

MIT License
