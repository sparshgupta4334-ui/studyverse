class AppConstants {
  AppConstants._();

  // Padding & Spacing
  static const double paddingXS = 4.0;
  static const double paddingSM = 8.0;
  static const double paddingMD = 16.0;
  static const double paddingLG = 24.0;
  static const double paddingXL = 32.0;

  // Border Radius
  static const double radiusSM = 8.0;
  static const double radiusMD = 12.0;
  static const double radiusLG = 16.0;
  static const double radiusXL = 24.0;
  static const double radiusCircle = 100.0;

  // Font Sizes
  static const double fontXS = 11.0;
  static const double fontSM = 13.0;
  static const double fontMD = 15.0;
  static const double fontLG = 17.0;
  static const double fontXL = 20.0;
  static const double fontXXL = 24.0;
  static const double fontTitle = 28.0;

  // Icon Sizes
  static const double iconSM = 18.0;
  static const double iconMD = 24.0;
  static const double iconLG = 32.0;

  // Animation Durations
  static const Duration animFast = Duration(milliseconds: 150);
  static const Duration animNormal = Duration(milliseconds: 300);
  static const Duration animSlow = Duration(milliseconds: 500);

  // Transaction Types
  static const String creditType = 'credit';
  static const String debitType = 'debit';

  // Status
  static const String statusPending = 'pending';
  static const String statusSent = 'sent';
  static const String statusFailed = 'failed';
  static const String statusCompleted = 'completed';

  // Error Messages
  static const String networkError = 'No internet connection. Please check your network.';
  static const String serverError = 'Server error. Please try again later.';
  static const String sessionExpired = 'Session expired. Please login again.';
  static const String unexpectedError = 'An unexpected error occurred. Please try again.';

  // Hive Type IDs
  static const int userTypeId = 0;
  static const int customerTypeId = 1;
  static const int transactionTypeId = 2;
}
