import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/customer.dart';
import '../models/transaction.dart';
import '../models/payment.dart';
import '../models/reminder.dart';
import '../config/app_config.dart';

class DatabaseHelper {
  static final DatabaseHelper _instance = DatabaseHelper._internal();
  static Database? _database;

  factory DatabaseHelper() => _instance;
  DatabaseHelper._internal();

  Future<Database> get database async {
    _database ??= await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, AppConfig.dbName);
    return await openDatabase(
      path,
      version: AppConfig.dbVersion,
      onCreate: _onCreate,
      onUpgrade: _onUpgrade,
    );
  }

  Future<void> _onCreate(Database db, int version) async {
    await db.execute('''
      CREATE TABLE users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL UNIQUE,
        email TEXT,
        business_name TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT
      )
    ''');

    await db.execute('''
      CREATE TABLE customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        address TEXT,
        balance REAL NOT NULL DEFAULT 0.0,
        category TEXT NOT NULL DEFAULT 'Regular',
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    ''');

    await db.execute('''
      CREATE TABLE transactions (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        notes TEXT,
        category TEXT NOT NULL DEFAULT 'Sale',
        date TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
      )
    ''');

    await db.execute('''
      CREATE TABLE payments (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        transaction_id TEXT,
        amount REAL NOT NULL,
        upi_ref TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        notes TEXT,
        date TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
      )
    ''');

    await db.execute('''
      CREATE TABLE reminders (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL,
        scheduled_at TEXT NOT NULL,
        sent_at TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
      )
    ''');

    await _createIndexes(db);
  }

  Future<void> _createIndexes(Database db) async {
    await db.execute('CREATE INDEX idx_transactions_customer ON transactions(customer_id)');
    await db.execute('CREATE INDEX idx_transactions_date ON transactions(date)');
    await db.execute('CREATE INDEX idx_payments_customer ON payments(customer_id)');
    await db.execute('CREATE INDEX idx_reminders_customer ON reminders(customer_id)');
    await db.execute('CREATE INDEX idx_reminders_status ON reminders(status)');
  }

  Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
    // Handle future migrations here
  }

  // ─── Customer CRUD ──────────────────────────────────────────────────────────

  Future<String> insertCustomer(Customer customer) async {
    final db = await database;
    await db.insert('customers', customer.toMap(),
        conflictAlgorithm: ConflictAlgorithm.replace);
    return customer.id;
  }

  Future<Customer?> getCustomer(String id) async {
    final db = await database;
    final maps = await db.query('customers', where: 'id = ?', whereArgs: [id]);
    if (maps.isEmpty) return null;
    return Customer.fromMap(maps.first);
  }

  Future<List<Customer>> getAllCustomers({String? search, String? category, String? sortBy, bool ascending = true}) async {
    final db = await database;
    String? whereClause;
    List<dynamic>? whereArgs;

    if (search != null && search.isNotEmpty) {
      whereClause = "(name LIKE ? OR phone LIKE ?)";
      whereArgs = ['%$search%', '%$search%'];
    }

    if (category != null && category.isNotEmpty) {
      whereClause = whereClause != null
          ? "$whereClause AND category = ?"
          : "category = ?";
      whereArgs = [...?whereArgs, category];
    }

    final orderBy = _getCustomerOrderBy(sortBy, ascending);

    final maps = await db.query(
      'customers',
      where: whereClause,
      whereArgs: whereArgs,
      orderBy: orderBy,
    );
    return maps.map((m) => Customer.fromMap(m)).toList();
  }

  String _getCustomerOrderBy(String? sortBy, bool ascending) {
    final dir = ascending ? 'ASC' : 'DESC';
    switch (sortBy) {
      case 'balance':
        return 'balance $dir';
      case 'date':
        return 'created_at $dir';
      default:
        return 'name $dir';
    }
  }

  Future<int> updateCustomer(Customer customer) async {
    final db = await database;
    return await db.update(
      'customers',
      customer.toMap(),
      where: 'id = ?',
      whereArgs: [customer.id],
    );
  }

  Future<int> deleteCustomer(String id) async {
    final db = await database;
    return await db.delete('customers', where: 'id = ?', whereArgs: [id]);
  }

  Future<int> updateCustomerBalance(String customerId, double balance) async {
    final db = await database;
    return await db.update(
      'customers',
      {'balance': balance, 'updated_at': DateTime.now().toIso8601String()},
      where: 'id = ?',
      whereArgs: [customerId],
    );
  }

  Future<double> calculateCustomerBalance(String customerId) async {
    final db = await database;
    final result = await db.rawQuery('''
      SELECT
        COALESCE(SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END), 0) -
        COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END), 0) AS balance
      FROM transactions
      WHERE customer_id = ?
    ''', [customerId]);
    return (result.first['balance'] as num?)?.toDouble() ?? 0.0;
  }

  // ─── Transaction CRUD ───────────────────────────────────────────────────────

  Future<String> insertTransaction(Transaction transaction) async {
    final db = await database;
    await db.insert('transactions', transaction.toMap(),
        conflictAlgorithm: ConflictAlgorithm.replace);
    final newBalance = await calculateCustomerBalance(transaction.customerId);
    await updateCustomerBalance(transaction.customerId, newBalance);
    return transaction.id;
  }

  Future<Transaction?> getTransaction(String id) async {
    final db = await database;
    final maps = await db.rawQuery('''
      SELECT t.*, c.name as customer_name
      FROM transactions t
      LEFT JOIN customers c ON t.customer_id = c.id
      WHERE t.id = ?
    ''', [id]);
    if (maps.isEmpty) return null;
    return Transaction.fromMap(maps.first);
  }

  Future<List<Transaction>> getTransactionsByCustomer(
    String customerId, {
    DateTime? startDate,
    DateTime? endDate,
    String? type,
  }) async {
    final db = await database;
    String where = 'customer_id = ?';
    List<dynamic> args = [customerId];

    if (startDate != null) {
      where += ' AND date >= ?';
      args.add(startDate.toIso8601String());
    }
    if (endDate != null) {
      where += ' AND date <= ?';
      args.add(endDate.toIso8601String());
    }
    if (type != null) {
      where += ' AND type = ?';
      args.add(type);
    }

    final maps = await db.query('transactions',
        where: where, whereArgs: args, orderBy: 'date DESC');
    return maps.map((m) => Transaction.fromMap(m)).toList();
  }

  Future<List<Transaction>> getAllTransactions({
    DateTime? startDate,
    DateTime? endDate,
    String? type,
    String? category,
    int? limit,
    int? offset,
  }) async {
    final db = await database;
    String where = '1=1';
    List<dynamic> args = [];

    if (startDate != null) {
      where += ' AND t.date >= ?';
      args.add(startDate.toIso8601String());
    }
    if (endDate != null) {
      where += ' AND t.date <= ?';
      args.add(endDate.toIso8601String());
    }
    if (type != null) {
      where += ' AND t.type = ?';
      args.add(type);
    }
    if (category != null) {
      where += ' AND t.category = ?';
      args.add(category);
    }

    String query = '''
      SELECT t.*, c.name as customer_name
      FROM transactions t
      LEFT JOIN customers c ON t.customer_id = c.id
      WHERE $where
      ORDER BY t.date DESC
    ''';

    if (limit != null) query += ' LIMIT $limit';
    if (offset != null) query += ' OFFSET $offset';

    final maps = await db.rawQuery(query, args);
    return maps.map((m) => Transaction.fromMap(m)).toList();
  }

  Future<int> updateTransaction(Transaction transaction) async {
    final db = await database;
    final result = await db.update(
      'transactions',
      transaction.toMap(),
      where: 'id = ?',
      whereArgs: [transaction.id],
    );
    final newBalance = await calculateCustomerBalance(transaction.customerId);
    await updateCustomerBalance(transaction.customerId, newBalance);
    return result;
  }

  Future<int> deleteTransaction(String id) async {
    final db = await database;
    final tx = await getTransaction(id);
    final result = await db.delete('transactions', where: 'id = ?', whereArgs: [id]);
    if (tx != null) {
      final newBalance = await calculateCustomerBalance(tx.customerId);
      await updateCustomerBalance(tx.customerId, newBalance);
    }
    return result;
  }

  // ─── Payment CRUD ───────────────────────────────────────────────────────────

  Future<String> insertPayment(Payment payment) async {
    final db = await database;
    await db.insert('payments', payment.toMap(),
        conflictAlgorithm: ConflictAlgorithm.replace);
    return payment.id;
  }

  Future<List<Payment>> getPaymentsByCustomer(String customerId) async {
    final db = await database;
    final maps = await db.rawQuery('''
      SELECT p.*, c.name as customer_name
      FROM payments p
      LEFT JOIN customers c ON p.customer_id = c.id
      WHERE p.customer_id = ?
      ORDER BY p.date DESC
    ''', [customerId]);
    return maps.map((m) => Payment.fromMap(m)).toList();
  }

  Future<List<Payment>> getAllPayments({int? limit}) async {
    final db = await database;
    String query = '''
      SELECT p.*, c.name as customer_name
      FROM payments p
      LEFT JOIN customers c ON p.customer_id = c.id
      ORDER BY p.date DESC
    ''';
    if (limit != null) query += ' LIMIT $limit';
    final maps = await db.rawQuery(query);
    return maps.map((m) => Payment.fromMap(m)).toList();
  }

  Future<int> updatePaymentStatus(String id, String status) async {
    final db = await database;
    return await db.update(
      'payments',
      {'status': status},
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  // ─── Reminder CRUD ──────────────────────────────────────────────────────────

  Future<String> insertReminder(Reminder reminder) async {
    final db = await database;
    await db.insert('reminders', reminder.toMap(),
        conflictAlgorithm: ConflictAlgorithm.replace);
    return reminder.id;
  }

  Future<List<Reminder>> getAllReminders() async {
    final db = await database;
    final maps = await db.rawQuery('''
      SELECT r.*, c.name as customer_name, c.phone as customer_phone
      FROM reminders r
      LEFT JOIN customers c ON r.customer_id = c.id
      ORDER BY r.scheduled_at DESC
    ''');
    return maps.map((m) => Reminder.fromMap(m)).toList();
  }

  Future<List<Reminder>> getPendingReminders() async {
    final db = await database;
    final maps = await db.rawQuery('''
      SELECT r.*, c.name as customer_name, c.phone as customer_phone
      FROM reminders r
      LEFT JOIN customers c ON r.customer_id = c.id
      WHERE r.status = 'pending'
      ORDER BY r.scheduled_at ASC
    ''');
    return maps.map((m) => Reminder.fromMap(m)).toList();
  }

  Future<int> updateReminderStatus(String id, String status, {DateTime? sentAt}) async {
    final db = await database;
    final data = {'status': status};
    if (sentAt != null) data['sent_at'] = sentAt.toIso8601String();
    return await db.update('reminders', data, where: 'id = ?', whereArgs: [id]);
  }

  Future<int> deleteReminder(String id) async {
    final db = await database;
    return await db.delete('reminders', where: 'id = ?', whereArgs: [id]);
  }

  // ─── Summary Queries ────────────────────────────────────────────────────────

  Future<Map<String, dynamic>> getDashboardSummary() async {
    final db = await database;
    final customerCount = Sqflite.firstIntValue(
        await db.rawQuery('SELECT COUNT(*) FROM customers'));
    final totalOutstanding = Sqflite.firstIntValue(
        await db.rawQuery(
            'SELECT COALESCE(SUM(balance), 0) FROM customers WHERE balance > 0'));
    final todayStr = DateTime.now().toIso8601String().substring(0, 10);
    final todayTx = await db.rawQuery('''
      SELECT
        COALESCE(SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END), 0) AS today_debit,
        COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END), 0) AS today_credit
      FROM transactions
      WHERE date LIKE ?
    ''', ['$todayStr%']);
    final monthStr = DateTime.now().toIso8601String().substring(0, 7);
    final monthTx = await db.rawQuery('''
      SELECT
        COALESCE(SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END), 0) AS month_debit,
        COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END), 0) AS month_credit
      FROM transactions
      WHERE date LIKE ?
    ''', ['$monthStr%']);

    return {
      'customer_count': customerCount ?? 0,
      'total_outstanding': totalOutstanding ?? 0,
      'today_debit': (todayTx.first['today_debit'] as num?)?.toDouble() ?? 0.0,
      'today_credit': (todayTx.first['today_credit'] as num?)?.toDouble() ?? 0.0,
      'month_debit': (monthTx.first['month_debit'] as num?)?.toDouble() ?? 0.0,
      'month_credit': (monthTx.first['month_credit'] as num?)?.toDouble() ?? 0.0,
    };
  }

  Future<List<Map<String, dynamic>>> getTopDebtors({int limit = 5}) async {
    final db = await database;
    return await db.query(
      'customers',
      where: 'balance > 0',
      orderBy: 'balance DESC',
      limit: limit,
    );
  }

  Future<void> close() async {
    final db = _database;
    if (db != null) {
      await db.close();
      _database = null;
    }
  }
}
