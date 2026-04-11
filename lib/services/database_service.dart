import 'package:uuid/uuid.dart';
import '../database/database_helper.dart';
import '../models/customer.dart';
import '../models/transaction.dart';
import '../models/payment.dart';
import '../models/reminder.dart';

class DatabaseService {
  static final DatabaseService _instance = DatabaseService._internal();
  factory DatabaseService() => _instance;
  DatabaseService._internal();

  final _db = DatabaseHelper();
  final _uuid = const Uuid();

  // ─── Customers ──────────────────────────────────────────────────────────────

  Future<Customer> addCustomer({
    required String name,
    required String phone,
    String? email,
    String? address,
    String category = 'Regular',
    String? notes,
  }) async {
    final customer = Customer(
      id: _uuid.v4(),
      name: name,
      phone: phone,
      email: email,
      address: address,
      balance: 0.0,
      category: category,
      notes: notes,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );
    await _db.insertCustomer(customer);
    return customer;
  }

  Future<Customer?> getCustomer(String id) => _db.getCustomer(id);

  Future<List<Customer>> getCustomers({
    String? search,
    String? category,
    String? sortBy,
    bool ascending = true,
  }) => _db.getAllCustomers(
        search: search,
        category: category,
        sortBy: sortBy,
        ascending: ascending,
      );

  Future<Customer> updateCustomer(Customer customer) async {
    final updated = customer.copyWith(updatedAt: DateTime.now());
    await _db.updateCustomer(updated);
    return updated;
  }

  Future<void> deleteCustomer(String id) async {
    await _db.deleteCustomer(id);
  }

  // ─── Transactions ────────────────────────────────────────────────────────────

  Future<Transaction> addTransaction({
    required String customerId,
    required double amount,
    required String type,
    String? notes,
    String category = 'Sale',
    DateTime? date,
  }) async {
    final tx = Transaction(
      id: _uuid.v4(),
      customerId: customerId,
      amount: amount,
      type: type,
      notes: notes,
      category: category,
      date: date ?? DateTime.now(),
      createdAt: DateTime.now(),
    );
    await _db.insertTransaction(tx);
    return tx;
  }

  Future<Transaction?> getTransaction(String id) => _db.getTransaction(id);

  Future<List<Transaction>> getCustomerTransactions(
    String customerId, {
    DateTime? startDate,
    DateTime? endDate,
    String? type,
  }) =>
      _db.getTransactionsByCustomer(
        customerId,
        startDate: startDate,
        endDate: endDate,
        type: type,
      );

  Future<List<Transaction>> getAllTransactions({
    DateTime? startDate,
    DateTime? endDate,
    String? type,
    String? category,
    int? limit,
    int? offset,
  }) =>
      _db.getAllTransactions(
        startDate: startDate,
        endDate: endDate,
        type: type,
        category: category,
        limit: limit,
        offset: offset,
      );

  Future<void> deleteTransaction(String id) async {
    await _db.deleteTransaction(id);
  }

  // ─── Payments ────────────────────────────────────────────────────────────────

  Future<Payment> addPayment({
    required String customerId,
    required double amount,
    String? transactionId,
    String? upiRef,
    String? notes,
  }) async {
    final payment = Payment(
      id: _uuid.v4(),
      customerId: customerId,
      transactionId: transactionId,
      amount: amount,
      upiRef: upiRef,
      status: 'pending',
      notes: notes,
      date: DateTime.now(),
      createdAt: DateTime.now(),
    );
    await _db.insertPayment(payment);
    return payment;
  }

  Future<List<Payment>> getCustomerPayments(String customerId) =>
      _db.getPaymentsByCustomer(customerId);

  Future<List<Payment>> getAllPayments({int? limit}) =>
      _db.getAllPayments(limit: limit);

  Future<void> updatePaymentStatus(String id, String status) async {
    await _db.updatePaymentStatus(id, status);
  }

  // ─── Reminders ───────────────────────────────────────────────────────────────

  Future<Reminder> addReminder({
    required String customerId,
    required String message,
    required String type,
    DateTime? scheduledAt,
  }) async {
    final reminder = Reminder(
      id: _uuid.v4(),
      customerId: customerId,
      message: message,
      type: type,
      scheduledAt: scheduledAt ?? DateTime.now(),
      status: 'pending',
    );
    await _db.insertReminder(reminder);
    return reminder;
  }

  Future<List<Reminder>> getAllReminders() => _db.getAllReminders();

  Future<List<Reminder>> getPendingReminders() => _db.getPendingReminders();

  Future<void> markReminderSent(String id) async {
    await _db.updateReminderStatus(id, 'sent', sentAt: DateTime.now());
  }

  Future<void> markReminderFailed(String id) async {
    await _db.updateReminderStatus(id, 'failed');
  }

  Future<void> deleteReminder(String id) async {
    await _db.deleteReminder(id);
  }

  // ─── Dashboard ───────────────────────────────────────────────────────────────

  Future<Map<String, dynamic>> getDashboardSummary() =>
      _db.getDashboardSummary();

  Future<List<Map<String, dynamic>>> getTopDebtors({int limit = 5}) =>
      _db.getTopDebtors(limit: limit);
}
