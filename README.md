# Gupta Paper Stores - Digital Ledger (Khata) App

A complete Flutter Android application for managing business ledger (khata), customer accounts, transactions, UPI payments, and reminders.

## Features

- 📒 **Digital Khata** — Track all customer credit/debit transactions
- 👥 **Customer Management** — Add, edit, search, and categorize customers
- 💰 **UPI Payment Collection** — Initiate payments via GPay, PhonePe, Paytm, or any UPI app
- 📱 **Reminders** — Send payment reminders via WhatsApp or SMS
- 📊 **Reports & Analytics** — Daily, weekly, monthly, and custom date range reports
- 🔒 **Offline-first** — All data stored locally using SQLite
- 🌙 **Dark Mode** — Full dark mode support
- 📤 **Data Export** — Backup and share data as text files

## Tech Stack

- **Flutter** (Dart) — Cross-platform mobile development
- **Provider** — State management
- **sqflite** — Local SQLite database
- **shared_preferences** — Key-value storage
- **url_launcher** — UPI payments and messaging
- **share_plus** — Data export
- **intl** — Date and currency formatting

## Project Structure

```
lib/
├── config/         # App config, theme, constants
├── models/         # Data models (Customer, Transaction, Payment, Reminder, User)
├── database/       # SQLite database helper with CRUD operations
├── services/       # Business logic (Auth, Payment, Reminder, Sync)
├── providers/      # State management (Auth, Customer, Transaction, App)
├── screens/        # UI screens
│   ├── auth/       # Login, OTP verification
│   ├── home/       # Dashboard, Home navigation
│   ├── customers/  # Customer list, detail, add/edit
│   ├── transactions/ # Ledger, add transaction, detail
│   ├── payments/   # UPI payment, payment history
│   ├── reminders/  # Reminders list, send reminder
│   ├── reports/    # Reports, report detail
│   └── settings/   # Settings, backup, about
├── widgets/        # Reusable UI components
└── utils/          # Validators, formatters, helpers, extensions, logger
```

## Getting Started

### Prerequisites

- Flutter SDK 3.1.0+
- Android Studio / VS Code
- Android device or emulator (API 21+)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd studyverse

# Install dependencies
flutter pub get

# Run the app
flutter run
```

### Demo Mode

- Enter **any 10-digit phone number** on the login screen
- Use OTP: **123456** to sign in

## UI/UX

- **Primary color**: Blue `#1E88E5`
- **Accent color**: Orange `#FF6F00`
- **Credit (payments)**: Green `#43A047`
- **Debit (sales)**: Red `#E53935`
- Bottom navigation with 5 tabs: Home, Customers, Ledger, Reports, More

## Database Schema

- `customers` — Customer profiles with running balance
- `transactions` — Credit/debit entries linked to customers
- `payments` — UPI payment records
- `reminders` — Scheduled/sent reminder log
- `users` — Logged-in user session

## License

© 2024 Gupta Paper Stores. All rights reserved.
