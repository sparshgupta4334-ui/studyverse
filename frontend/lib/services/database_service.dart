import 'package:hive_flutter/hive_flutter.dart';
import '../config/app_config.dart';

class DatabaseService {
  DatabaseService._();
  static final DatabaseService instance = DatabaseService._();

  bool _initialized = false;

  Future<void> init() async {
    if (_initialized) return;

    await Hive.initFlutter();

    // Open boxes for local caching
    await Hive.openBox(AppConfig.customersBox);
    await Hive.openBox(AppConfig.transactionsBox);
    await Hive.openBox(AppConfig.settingsBox);

    _initialized = true;
  }

  // Customer Cache Operations
  Box get customersBox => Hive.box(AppConfig.customersBox);
  Box get transactionsBox => Hive.box(AppConfig.transactionsBox);
  Box get settingsBox => Hive.box(AppConfig.settingsBox);

  Future<void> cacheCustomers(String userId, List<Map<String, dynamic>> customers) async {
    await customersBox.put('customers_$userId', customers);
  }

  List<Map<String, dynamic>>? getCachedCustomers(String userId) {
    final data = customersBox.get('customers_$userId');
    if (data == null) return null;
    return List<Map<String, dynamic>>.from(
      (data as List).map((e) => Map<String, dynamic>.from(e as Map)),
    );
  }

  Future<void> cacheTransactions(String customerId, List<Map<String, dynamic>> transactions) async {
    await transactionsBox.put('txns_$customerId', transactions);
  }

  List<Map<String, dynamic>>? getCachedTransactions(String customerId) {
    final data = transactionsBox.get('txns_$customerId');
    if (data == null) return null;
    return List<Map<String, dynamic>>.from(
      (data as List).map((e) => Map<String, dynamic>.from(e as Map)),
    );
  }

  Future<void> setSetting(String key, dynamic value) async {
    await settingsBox.put(key, value);
  }

  T? getSetting<T>(String key) => settingsBox.get(key) as T?;

  Future<void> clearAll() async {
    await customersBox.clear();
    await transactionsBox.clear();
  }
}
