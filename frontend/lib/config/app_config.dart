class AppConfig {
  AppConfig._();

  static const String appName = 'KhataBook Pro';
  static const String apiBaseUrl = 'https://api.khatabookpro.com/v1';
  static const String version = '1.0.0';

  // API Endpoints
  static const String loginEndpoint = '/auth/login';
  static const String refreshTokenEndpoint = '/auth/refresh';
  static const String customersEndpoint = '/customers';
  static const String transactionsEndpoint = '/transactions';
  static const String syncEndpoint = '/sync';
  static const String userProfileEndpoint = '/user/profile';

  // SharedPreferences keys
  static const String authTokenKey = 'auth_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String userIdKey = 'user_id';
  static const String darkModeKey = 'dark_mode';
  static const String userDataKey = 'user_data';
  static const String lastSyncKey = 'last_sync';

  // SQLite
  static const String dbName = 'khatabook_pro.db';
  static const int dbVersion = 1;
  static const String customersTable = 'customers';
  static const String transactionsTable = 'transactions';
  static const String syncQueueTable = 'sync_queue';

  // Pagination
  static const int pageSize = 20;

  // OTP
  static const int otpResendSeconds = 30;
  static const int otpLength = 6;

  // Network timeouts (seconds)
  static const int connectTimeout = 30;
  static const int receiveTimeout = 30;
}
