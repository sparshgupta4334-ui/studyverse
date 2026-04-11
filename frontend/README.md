# KhataBook Pro 📒

A complete Flutter digital ledger (khata) app for managing customer credit/debit transactions, built with Material Design 3.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Firebase Phone Auth | OTP-based login with auto-read on Android |
| 📊 Dashboard | Total receivable/payable summary + customer list |
| 👥 Customer Management | Add, view, search customers with balance tracking |
| 💳 Transactions | Credit (Got) / Debit (Gave) entries with history |
| 💰 Collect Payment | UPI payment link & QR code generation |
| 📩 Send Reminder | SMS reminder to customers |
| 🌙 Dark Mode | Full dark theme support |
| 📴 Offline First | SQLite local storage with cloud sync queue |
| ☁️ Cloud Sync | Background sync when online |

---

## 🚀 Getting Started

### Prerequisites
- Flutter SDK `>=3.0.0`
- Dart SDK `>=3.0.0`
- Firebase project with Phone Auth enabled

### 1. Clone & Install

```bash
git clone <repository-url>
cd frontend
flutter pub get
```

### 2. Firebase Setup (Required)

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Phone Authentication** under Authentication > Sign-in methods
3. Add an Android app with package name `com.example.khatabook_pro`
4. Download `google-services.json` and place in `android/app/`
5. For iOS, download `GoogleService-Info.plist` and place in `ios/Runner/`

> **Note:** Without Firebase configuration, the app will crash on OTP screens.
> For testing UI only, you can mock `AuthService` to bypass Firebase.

### 3. Configure Backend

Edit `lib/config/app_config.dart`:

```dart
static const String apiBaseUrl = 'https://your-backend.com/v1';
```

### 4. Run

```bash
flutter run
```

---

## 📁 Project Structure

```
lib/
├── main.dart              # Entry point
├── app.dart               # MaterialApp + theme routing
├── config/
│   ├── app_config.dart    # Constants, API base URL, DB config
│   ├── app_theme.dart     # Light & dark Material Design 3 themes
│   └── routes.dart        # Named route generation
├── models/
│   ├── user_model.dart
│   ├── customer_model.dart
│   └── transaction_model.dart
├── services/
│   ├── api_service.dart   # HTTP client with JWT auth
│   ├── auth_service.dart  # Firebase OTP + backend JWT exchange
│   ├── local_db_service.dart  # SQLite CRUD
│   └── sync_service.dart  # Offline queue + cloud sync
├── providers/
│   ├── auth_provider.dart
│   ├── customer_provider.dart
│   └── transaction_provider.dart
└── screens/
    ├── splash/            # Animated splash screen
    ├── auth/              # Phone & OTP screens
    ├── dashboard/         # Main dashboard with nav
    ├── customer/          # List, add, detail screens
    ├── transaction/       # Add transaction screen
    └── settings/          # Settings & logout
```

---

## 🎨 Theme

| Token | Color |
|---|---|
| Primary | `#2E7D32` (Deep Green) |
| Accent | `#F57C00` (Orange) |
| Receivable | `#1B8E3D` (Green) |
| Payable | `#C62828` (Red) |

---

## 🏗️ Architecture

- **State Management**: Provider with `ChangeNotifier`
- **Storage**: SQLite (sqflite) for local data, SharedPreferences for auth tokens
- **Auth**: Firebase Phone Auth → Backend JWT exchange
- **Offline**: All writes go to SQLite first, then sync queue, then server
- **API**: REST HTTP client with automatic JWT headers and token refresh

---

## 📦 Dependencies

| Package | Version | Purpose |
|---|---|---|
| `firebase_core` | ^2.24.2 | Firebase init |
| `firebase_auth` | ^4.15.3 | Phone OTP auth |
| `provider` | ^6.1.1 | State management |
| `http` | ^1.1.0 | REST API calls |
| `shared_preferences` | ^2.2.2 | Token & settings storage |
| `sqflite` | ^2.3.0 | Local SQLite database |
| `path` | ^1.8.3 | Database file path |
| `intl` | ^0.18.1 | Number & date formatting |
| `flutter_svg` | ^2.0.9 | SVG asset rendering |

---

## 🔌 Backend API Contract

### Auth
| Method | Endpoint | Body | Response |
|---|---|---|---|
| POST | `/auth/login` | `{firebase_token, phone}` | `{token, refresh_token, user}` |
| POST | `/auth/refresh` | `{refresh_token}` | `{token}` |

### Customers
| Method | Endpoint | Description |
|---|---|---|
| GET | `/customers` | List with pagination |
| POST | `/customers` | Create customer |
| PUT | `/customers/:id` | Update customer |
| DELETE | `/customers/:id` | Delete customer |

### Transactions
| Method | Endpoint | Description |
|---|---|---|
| GET | `/customers/:id/transactions` | Get customer transactions |
| POST | `/transactions` | Create transaction |
| DELETE | `/transactions/:id` | Delete transaction |

---

## 📲 Screens

1. **Splash** — Animated logo with auth check
2. **Phone** — Country code + phone input
3. **OTP** — 6-digit OTP with resend timer
4. **Dashboard** — Balance cards + customer list + FAB
5. **Customer List** — Searchable, paginated
6. **Add Customer** — Form with validation
7. **Customer Detail** — Balance header + transaction history + actions
8. **Add Transaction** — Credit/debit toggle + amount input
9. **Settings** — Profile, dark mode, backup, logout

---

## 🔒 Security

- JWT stored in SharedPreferences (use flutter_secure_storage in production)
- Automatic token refresh on 401
- Firebase Phone Auth for verified phone numbers
- All API calls include `Authorization: Bearer <token>` header

---

## 📄 License

MIT License — See LICENSE file for details.
