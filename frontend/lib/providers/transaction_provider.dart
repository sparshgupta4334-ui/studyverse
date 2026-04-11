import 'package:flutter/material.dart';
import '../models/transaction.dart';
import '../services/customer_service.dart';

class TransactionProvider extends ChangeNotifier {
  final Map<String, List<TransactionModel>> _transactionsByCustomer = {};
  bool _isLoading = false;
  String? _errorMessage;
  Map<String, dynamic>? _reportData;

  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  Map<String, dynamic>? get reportData => _reportData;

  List<TransactionModel> getTransactionsForCustomer(String customerId) =>
      _transactionsByCustomer[customerId] ?? [];

  Future<Map<String, dynamic>?> loadTransactions(
    String customerId, {
    bool refresh = false,
    int page = 1,
    String? startDate,
    String? endDate,
    String? type,
  }) async {
    if (refresh || !_transactionsByCustomer.containsKey(customerId)) {
      _transactionsByCustomer[customerId] = [];
    }

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final result = await TransactionService.instance.getByCustomer(
        customerId,
        page: page,
        startDate: startDate,
        endDate: endDate,
        type: type,
      );

      final transactions = result['transactions'] as List<TransactionModel>;

      if (page == 1) {
        _transactionsByCustomer[customerId] = transactions;
      } else {
        _transactionsByCustomer[customerId] = [
          ..._transactionsByCustomer[customerId]!,
          ...transactions,
        ];
      }

      _isLoading = false;
      notifyListeners();
      return result;
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return null;
    }
  }

  Future<TransactionModel?> addTransaction({
    required String customerId,
    required double amount,
    required String type,
    String? notes,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final txn = await TransactionService.instance.create(
        customerId: customerId,
        amount: amount,
        type: type,
        notes: notes,
      );

      // Add to beginning of list
      final existing = _transactionsByCustomer[customerId] ?? [];
      _transactionsByCustomer[customerId] = [txn, ...existing];

      _isLoading = false;
      notifyListeners();
      return txn;
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return null;
    }
  }

  Future<bool> deleteTransaction(String transactionId, String customerId) async {
    try {
      await TransactionService.instance.delete(transactionId);

      _transactionsByCustomer[customerId]?.removeWhere(
        (t) => t.transactionId == transactionId,
      );

      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<void> loadReport({String? period, String? startDate, String? endDate}) async {
    _isLoading = true;
    notifyListeners();

    try {
      _reportData = await TransactionService.instance.getReport(
        period: period,
        startDate: startDate,
        endDate: endDate,
      );
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void clearTransactionsForCustomer(String customerId) {
    _transactionsByCustomer.remove(customerId);
    notifyListeners();
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
