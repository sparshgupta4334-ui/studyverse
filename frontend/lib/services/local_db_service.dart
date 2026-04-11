import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

import '../config/app_config.dart';
import '../models/customer_model.dart';
import '../models/transaction_model.dart';

class LocalDbService {
  LocalDbService._();
  static final LocalDbService instance = LocalDbService._();

  Database? _db;

  Database get _database {
    if (_db == null) throw StateError('Database not initialized');
    return _db!;
  }

  Future<void> initialize() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, AppConfig.dbName);

    _db = await openDatabase(
      path,
      version: AppConfig.dbVersion,
      onCreate: _onCreate,
      onUpgrade: _onUpgrade,
    );
  }

  Future<void> _onCreate(Database db, int version) async {
    await db.execute('''
      CREATE TABLE ${AppConfig.customersTable} (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        address TEXT,
        balance REAL DEFAULT 0.0,
        last_transaction_date TEXT,
        created_at TEXT NOT NULL,
        is_synced INTEGER DEFAULT 0
      )
    ''');

    await db.execute('''
      CREATE TABLE ${AppConfig.transactionsTable} (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        notes TEXT,
        date TEXT NOT NULL,
        is_synced INTEGER DEFAULT 0,
        receipt_url TEXT,
        FOREIGN KEY (customer_id) REFERENCES ${AppConfig.customersTable}(id) ON DELETE CASCADE
      )
    ''');

    await db.execute('''
      CREATE TABLE ${AppConfig.syncQueueTable} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        operation TEXT NOT NULL,
        payload TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    ''');

    // Index for faster queries
    await db.execute(
        'CREATE INDEX idx_transactions_customer ON ${AppConfig.transactionsTable}(customer_id)');
    await db.execute(
        'CREATE INDEX idx_customers_phone ON ${AppConfig.customersTable}(phone)');
  }

  Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
    // Handle future migrations here
  }

  // ── Customers ──────────────────────────────────────────────────────────────

  Future<void> upsertCustomer(CustomerModel customer) async {
    await _database.insert(
      AppConfig.customersTable,
      customer.toJson(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<void> upsertCustomers(List<CustomerModel> customers) async {
    final batch = _database.batch();
    for (final c in customers) {
      batch.insert(
        AppConfig.customersTable,
        c.toJson(),
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
    }
    await batch.commit(noResult: true);
  }

  Future<List<CustomerModel>> getCustomers({
    String? searchQuery,
    int? limit,
    int? offset,
  }) async {
    String whereClause = '';
    List<dynamic> whereArgs = [];

    if (searchQuery != null && searchQuery.isNotEmpty) {
      whereClause = 'WHERE name LIKE ? OR phone LIKE ?';
      whereArgs = ['%$searchQuery%', '%$searchQuery%'];
    }

    final limitClause = limit != null ? 'LIMIT $limit' : '';
    final offsetClause = offset != null ? 'OFFSET $offset' : '';

    final maps = await _database.rawQuery(
      'SELECT * FROM ${AppConfig.customersTable} $whereClause ORDER BY name ASC $limitClause $offsetClause',
      whereArgs.isEmpty ? null : whereArgs,
    );

    return maps.map(CustomerModel.fromJson).toList();
  }

  Future<CustomerModel?> getCustomerById(String id) async {
    final maps = await _database.query(
      AppConfig.customersTable,
      where: 'id = ?',
      whereArgs: [id],
      limit: 1,
    );
    if (maps.isEmpty) return null;
    return CustomerModel.fromJson(maps.first);
  }

  Future<void> updateCustomerBalance(String customerId, double newBalance) async {
    await _database.update(
      AppConfig.customersTable,
      {
        'balance': newBalance,
        'last_transaction_date': DateTime.now().toIso8601String(),
      },
      where: 'id = ?',
      whereArgs: [customerId],
    );
  }

  Future<void> deleteCustomer(String id) async {
    await _database.delete(
      AppConfig.customersTable,
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<int> getCustomerCount() async {
    final result = await _database
        .rawQuery('SELECT COUNT(*) as count FROM ${AppConfig.customersTable}');
    return (result.first['count'] as int?) ?? 0;
  }

  // ── Transactions ───────────────────────────────────────────────────────────

  Future<void> upsertTransaction(TransactionModel transaction) async {
    await _database.insert(
      AppConfig.transactionsTable,
      transaction.toJson(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<void> upsertTransactions(List<TransactionModel> transactions) async {
    final batch = _database.batch();
    for (final t in transactions) {
      batch.insert(
        AppConfig.transactionsTable,
        t.toJson(),
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
    }
    await batch.commit(noResult: true);
  }

  Future<List<TransactionModel>> getTransactionsForCustomer(
    String customerId, {
    int? limit,
    int? offset,
  }) async {
    final limitClause = limit != null ? 'LIMIT $limit' : '';
    final offsetClause = offset != null ? 'OFFSET $offset' : '';

    final maps = await _database.rawQuery(
      'SELECT * FROM ${AppConfig.transactionsTable} WHERE customer_id = ? ORDER BY date DESC $limitClause $offsetClause',
      [customerId],
    );
    return maps.map(TransactionModel.fromJson).toList();
  }

  Future<void> deleteTransaction(String id) async {
    await _database.delete(
      AppConfig.transactionsTable,
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  // ── Sync Queue ─────────────────────────────────────────────────────────────

  Future<void> addToSyncQueue({
    required String entityType,
    required String entityId,
    required String operation,
    required String payload,
  }) async {
    await _database.insert(AppConfig.syncQueueTable, {
      'entity_type': entityType,
      'entity_id': entityId,
      'operation': operation,
      'payload': payload,
      'created_at': DateTime.now().toIso8601String(),
    });
  }

  Future<List<Map<String, dynamic>>> getPendingSyncItems() async {
    return _database.query(
      AppConfig.syncQueueTable,
      orderBy: 'created_at ASC',
    );
  }

  Future<void> removeSyncQueueItem(int id) async {
    await _database.delete(
      AppConfig.syncQueueTable,
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<void> clearSyncQueue() async {
    await _database.delete(AppConfig.syncQueueTable);
  }

  // ── Summary ────────────────────────────────────────────────────────────────

  Future<Map<String, double>> getBalanceSummary() async {
    final result = await _database.rawQuery('''
      SELECT 
        SUM(CASE WHEN balance > 0 THEN balance ELSE 0 END) as total_receivable,
        SUM(CASE WHEN balance < 0 THEN ABS(balance) ELSE 0 END) as total_payable
      FROM ${AppConfig.customersTable}
    ''');

    final row = result.first;
    return {
      'receivable': (row['total_receivable'] as double?) ?? 0.0,
      'payable': (row['total_payable'] as double?) ?? 0.0,
    };
  }

  Future<void> close() async {
    await _db?.close();
    _db = null;
  }
}
