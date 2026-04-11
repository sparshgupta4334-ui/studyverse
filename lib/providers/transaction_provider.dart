import 'package:flutter/material.dart';
import '../services/database_service.dart';
import '../models/transaction.dart';

class TransactionProvider extends ChangeNotifier {
  final DatabaseService _dbService = DatabaseService();

  List<Transaction> _transactions = [];
  List<Transaction> get transactions => _transactions;

  List<Transaction> _customerTransactions = [];
  List<Transaction> get customerTransactions => _customerTransactions;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  Map<String, dynamic> _dashboardSummary = {};
  Map<String, dynamic> get dashboardSummary => _dashboardSummary;

  // Filters
  DateTime? _startDate;
  DateTime? _endDate;
  String? _typeFilter;
  String? _categoryFilter;

  double get totalCredit => _transactions
      .where((t) => t.isCredit)
      .fold(0.0, (s, t) => s + t.amount);

  double get totalDebit => _transactions
      .where((t) => t.isDebit)
      .fold(0.0, (s, t) => s + t.amount);

  double get netBalance => totalDebit - totalCredit;

  Future<void> loadAllTransactions({
    DateTime? startDate,
    DateTime? endDate,
    String? type,
    String? category,
    int? limit,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();
    try {
      _startDate = startDate;
      _endDate = endDate;
      _typeFilter = type;
      _categoryFilter = category;
      _transactions = await _dbService.getAllTransactions(
        startDate: startDate,
        endDate: endDate,
        type: type,
        category: category,
        limit: limit,
      );
    } catch (e) {
      _errorMessage = 'Failed to load transactions.';
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> loadCustomerTransactions(
    String customerId, {
    DateTime? startDate,
    DateTime? endDate,
    String? type,
  }) async {
    _isLoading = true;
    notifyListeners();
    try {
      _customerTransactions = await _dbService.getCustomerTransactions(
        customerId,
        startDate: startDate,
        endDate: endDate,
        type: type,
      );
    } catch (e) {
      _errorMessage = 'Failed to load transactions.';
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<Transaction> addTransaction({
    required String customerId,
    required double amount,
    required String type,
    String? notes,
    String category = 'Sale',
    DateTime? date,
  }) async {
    final tx = await _dbService.addTransaction(
      customerId: customerId,
      amount: amount,
      type: type,
      notes: notes,
      category: category,
      date: date,
    );
    // Prepend to lists
    _transactions.insert(0, tx);
    _customerTransactions.insert(0, tx);
    notifyListeners();
    return tx;
  }

  Future<void> deleteTransaction(String id) async {
    await _dbService.deleteTransaction(id);
    _transactions.removeWhere((t) => t.id == id);
    _customerTransactions.removeWhere((t) => t.id == id);
    notifyListeners();
  }

  Future<void> loadDashboardSummary() async {
    try {
      _dashboardSummary = await _dbService.getDashboardSummary();
      notifyListeners();
    } catch (e) {
      _errorMessage = 'Failed to load dashboard.';
    }
  }

  double getCustomerBalance(List<Transaction> txList) {
    double debit = txList
        .where((t) => t.isDebit)
        .fold(0.0, (s, t) => s + t.amount);
    double credit = txList
        .where((t) => t.isCredit)
        .fold(0.0, (s, t) => s + t.amount);
    return debit - credit;
  }

  void clearFilters() {
    _startDate = null;
    _endDate = null;
    _typeFilter = null;
    _categoryFilter = null;
    loadAllTransactions();
  }
}
