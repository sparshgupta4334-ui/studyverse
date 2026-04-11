import 'package:flutter/material.dart';

class AppConfig {
  static const String appName = 'Gupta Paper Stores';
  static const String appTagline = 'Digital Khata - Smart Business';
  static const String appVersion = '1.0.0';
  static const String appPackage = 'com.guptapaperstore.ledger';

  // Contact info
  static const String supportPhone = '+91 9876543210';
  static const String supportEmail = 'support@guptapaperstore.com';

  // UPI
  static const String defaultUpiId = 'guptapaperstore@upi';
  static const String merchantName = 'Gupta Paper Stores';

  // Demo mode
  static const String demoOtp = '123456';
  static const String demoPhone = '9999999999';

  // Database
  static const String dbName = 'gupta_paper_store.db';
  static const int dbVersion = 1;

  // Shared Preferences Keys
  static const String prefKeyUserId = 'user_id';
  static const String prefKeyUserPhone = 'user_phone';
  static const String prefKeyUserName = 'user_name';
  static const String prefKeyIsLoggedIn = 'is_logged_in';
  static const String prefKeyThemeMode = 'theme_mode';
  static const String prefKeyBiometric = 'biometric_enabled';
  static const String prefKeyLastSync = 'last_sync';
  static const String prefKeyNotifications = 'notifications_enabled';

  // Colors
  static const Color primaryColor = Color(0xFF1E88E5);
  static const Color primaryDark = Color(0xFF1565C0);
  static const Color primaryLight = Color(0xFF90CAF9);
  static const Color accentColor = Color(0xFFFF6F00);
  static const Color accentLight = Color(0xFFFFB300);
  static const Color successColor = Color(0xFF43A047);
  static const Color errorColor = Color(0xFFE53935);
  static const Color warningColor = Color(0xFFFB8C00);
  static const Color creditColor = Color(0xFF43A047);
  static const Color debitColor = Color(0xFFE53935);

  // Transaction types
  static const String txTypeCredit = 'credit';
  static const String txTypeDebit = 'debit';

  // Customer categories
  static const List<String> customerCategories = [
    'Regular',
    'Wholesale',
    'Retail',
    'VIP',
    'New',
  ];

  // Transaction categories
  static const List<String> transactionCategories = [
    'Sale',
    'Purchase',
    'Payment',
    'Advance',
    'Return',
    'Adjustment',
    'Other',
  ];

  // Reminder types
  static const String reminderTypeSms = 'sms';
  static const String reminderTypeWhatsApp = 'whatsapp';
  static const String reminderTypeNotification = 'notification';

  // Payment status
  static const String paymentStatusPending = 'pending';
  static const String paymentStatusCompleted = 'completed';
  static const String paymentStatusFailed = 'failed';
}
