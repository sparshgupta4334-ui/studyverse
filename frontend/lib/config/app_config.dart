import 'package:flutter/material.dart';

class AppConfig {
  AppConfig._();

  static const String appName = 'StudyVerse Ledger';
  static const String appVersion = '1.0.0';

  // API Configuration
  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:3000/api',
  );

  static const Duration apiTimeout = Duration(seconds: 30);
  static const Duration connectTimeout = Duration(seconds: 10);

  // Storage Keys
  static const String accessTokenKey = 'access_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String userDataKey = 'user_data';
  static const String themeKey = 'app_theme';

  // Hive Boxes
  static const String customersBox = 'customers_box';
  static const String transactionsBox = 'transactions_box';
  static const String settingsBox = 'settings_box';

  // Pagination
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;

  // Currency
  static const String currencySymbol = '₹';
  static const String currencyCode = 'INR';

  // Phone
  static const String countryCode = '+91';

  // Navigator Key
  static final GlobalKey<NavigatorState> navigatorKey =
      GlobalKey<NavigatorState>();

  // Route Names
  static const String splashRoute = '/splash';
  static const String loginRoute = '/login';
  static const String otpRoute = '/otp';
  static const String homeRoute = '/home';
  static const String customersRoute = '/customers';
  static const String addCustomerRoute = '/customers/add';
  static const String customerDetailRoute = '/customers/detail';
  static const String transactionsRoute = '/transactions';
  static const String addTransactionRoute = '/transactions/add';
  static const String reportsRoute = '/reports';
  static const String settingsRoute = '/settings';
  static const String paymentRoute = '/payment';
}
