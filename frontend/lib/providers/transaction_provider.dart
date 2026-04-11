import 'package:flutter/foundation.dart';

import '../config/app_config.dart';
import '../models/transaction_model.dart';
import '../providers/auth_provider.dart';
import '../services/local_db_service.dart';
import '../services/sync_service.dart';

String _generateId() =>
    '${DateTime.now().millisecondsSinceEpoch}_${Object().hashCode.abs()}';

enum TransactionLoadStatus { initial, loading, loaded, error }

class TransactionProvider extends ChangeNotifier {
  TransactionLoadStatus _status = TransactionLoadStatus.initial;
  final Map<String, List<TransactionModel>> _transactionsByCustomer = {};
  String? _errorMessage;
  final Map<String, int> _pageByCustomer = {};
  final Map<String, bool> _hasMoreByCustomer = {};

  AuthProvider? _authProvider;

  TransactionLoadStatus get status => _status;
  String? get errorMessage => _errorMessage;
  bool get isLoading => _status == TransactionLoadStatus.loading;

  void updateAuth(AuthProvider auth) {
    _authProvider = auth;
  }

  List<TransactionModel> transactionsForCustomer(String customerId) {
    return _transactionsByCustomer[customerId] ?? [];
  }

  bool hasMoreForCustomer(String customerId) {
    return _hasMoreByCustomer[customerId] ?? true;
  }

  Future<void> loadTransactions(
    String customerId, {
    bool refresh = false,
  }) async {
    if (refresh) {
      _pageByCustomer[customerId] = 0;
      _hasMoreByCustomer[customerId] = true;
      _transactionsByCustomer[customerId] = [];
    }

    if (_hasMoreByCustomer[customerId] == false) return;
    if (_status == TransactionLoadStatus.loading) return;

    _status = TransactionLoadStatus.loading;
    notifyListeners();

    try {
      final page = _pageByCustomer[customerId] ?? 0;
      final localTxns =
          await LocalDbService.instance.getTransactionsForCustomer(
        customerId,
        limit: AppConfig.pageSize,
        offset: page * AppConfig.pageSize,
      );

      final existing = _transactionsByCustomer[customerId] ?? [];
      _transactionsByCustomer[customerId] =
          refresh ? localTxns : [...existing, ...localTxns];
      _pageByCustomer[customerId] = page + 1;
      _hasMoreByCustomer[customerId] =
          localTxns.length == AppConfig.pageSize;
      _status = TransactionLoadStatus.loaded;
      notifyListeners();

      // Sync from server
      _syncTransactions(customerId);
    } catch (e) {
      _status = TransactionLoadStatus.error;
      _errorMessage = 'Failed to load transactions';
      notifyListeners();
    }
  }

  Future<void> _syncTransactions(String customerId) async {
    try {
      final serverTxns =
          await SyncService.instance.pullTransactionsForCustomer(customerId);
      _transactionsByCustomer[customerId] = serverTxns;
      notifyListeners();
    } catch (_) {
      // Silent fail — offline support
    }
  }

  Future<bool> addTransaction({
    required String customerId,
    required double amount,
    required TransactionType type,
    String? notes,
  }) async {
    try {
      final transaction = TransactionModel(
        id: _generateId(),
        customerId: customerId,
        amount: amount,
        type: type,
        notes: notes,
        date: DateTime.now(),
        isSynced: false,
      );

      await LocalDbService.instance.upsertTransaction(transaction);

      final existing = _transactionsByCustomer[customerId] ?? [];
      _transactionsByCustomer[customerId] = [transaction, ...existing];
      _status = TransactionLoadStatus.loaded;
      notifyListeners();

      // Queue for server sync
      await SyncService.instance.queueTransactionCreate(transaction);
      SyncService.instance.syncAll();

      return true;
    } catch (e) {
      _errorMessage = 'Failed to add transaction';
      notifyListeners();
      return false;
    }
  }

  Future<void> deleteTransaction(
      String transactionId, String customerId) async {
    await LocalDbService.instance.deleteTransaction(transactionId);
    _transactionsByCustomer[customerId]?.removeWhere((t) => t.id == transactionId);
    notifyListeners();
  }

  void clearCustomerTransactions(String customerId) {
    _transactionsByCustomer.remove(customerId);
    _pageByCustomer.remove(customerId);
    _hasMoreByCustomer.remove(customerId);
    notifyListeners();
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
