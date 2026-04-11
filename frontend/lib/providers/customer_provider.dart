import 'package:flutter/foundation.dart';

import '../config/app_config.dart';
import '../models/customer_model.dart';
import '../providers/auth_provider.dart';
import '../services/local_db_service.dart';
import '../services/sync_service.dart';

String _generateId() =>
    '${DateTime.now().millisecondsSinceEpoch}_${Object().hashCode.abs()}';

enum CustomerLoadStatus { initial, loading, loaded, error }

class CustomerProvider extends ChangeNotifier {
  CustomerLoadStatus _status = CustomerLoadStatus.initial;
  List<CustomerModel> _customers = [];
  String? _errorMessage;
  String _searchQuery = '';
  bool _hasMore = true;
  int _page = 0;
  double _totalReceivable = 0;
  double _totalPayable = 0;

  AuthProvider? _authProvider;

  CustomerLoadStatus get status => _status;
  List<CustomerModel> get customers => _filteredCustomers;
  String? get errorMessage => _errorMessage;
  bool get hasMore => _hasMore;
  bool get isLoading => _status == CustomerLoadStatus.loading;
  double get totalReceivable => _totalReceivable;
  double get totalPayable => _totalPayable;
  double get netBalance => _totalReceivable - _totalPayable;

  List<CustomerModel> get _filteredCustomers {
    if (_searchQuery.isEmpty) return _customers;
    final q = _searchQuery.toLowerCase();
    return _customers
        .where((c) =>
            c.name.toLowerCase().contains(q) || c.phone.contains(q))
        .toList();
  }

  void updateAuth(AuthProvider auth) {
    _authProvider = auth;
  }

  void setSearch(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  Future<void> loadCustomers({bool refresh = false}) async {
    if (refresh) {
      _page = 0;
      _hasMore = true;
      _customers = [];
    }

    if (!_hasMore || _status == CustomerLoadStatus.loading) return;

    _status = CustomerLoadStatus.loading;
    notifyListeners();

    try {
      // Load from local DB first
      final localCustomers = await LocalDbService.instance.getCustomers(
        limit: AppConfig.pageSize,
        offset: _page * AppConfig.pageSize,
      );

      if (refresh || _page == 0) {
        _customers = localCustomers;
      } else {
        _customers.addAll(localCustomers);
      }

      _hasMore = localCustomers.length == AppConfig.pageSize;
      _page++;
      _status = CustomerLoadStatus.loaded;

      await _refreshSummary();
      notifyListeners();

      // Sync with server in background
      _syncFromServer();
    } catch (e) {
      _status = CustomerLoadStatus.error;
      _errorMessage = 'Failed to load customers';
      notifyListeners();
    }
  }

  Future<void> _syncFromServer() async {
    try {
      await SyncService.instance.syncAll();
      // Reload from local after sync
      final updated = await LocalDbService.instance.getCustomers(
        limit: _page * AppConfig.pageSize,
      );
      _customers = updated;
      await _refreshSummary();
      notifyListeners();
    } catch (_) {
      // Silent fail — offline support
    }
  }

  Future<void> _refreshSummary() async {
    final summary = await LocalDbService.instance.getBalanceSummary();
    _totalReceivable = summary['receivable'] ?? 0;
    _totalPayable = summary['payable'] ?? 0;
  }

  Future<bool> addCustomer({
    required String name,
    required String phone,
    String? email,
    String? address,
  }) async {
    try {
      final customer = CustomerModel(
        id: _generateId(),
        name: name,
        phone: phone,
        email: email,
        address: address,
        balance: 0,
        createdAt: DateTime.now(),
        isSynced: false,
      );

      await LocalDbService.instance.upsertCustomer(customer);
      _customers.insert(0, customer);
      await _refreshSummary();
      notifyListeners();

      // Queue for server sync
      await SyncService.instance.queueCustomerCreate(customer);
      SyncService.instance.syncAll();

      return true;
    } catch (e) {
      _errorMessage = 'Failed to add customer';
      notifyListeners();
      return false;
    }
  }

  void updateCustomerBalance(String customerId, double delta) {
    final index = _customers.indexWhere((c) => c.id == customerId);
    if (index == -1) return;

    final updated = _customers[index].copyWith(
      balance: _customers[index].balance + delta,
      lastTransactionDate: DateTime.now(),
    );
    _customers[index] = updated;
    LocalDbService.instance.updateCustomerBalance(customerId, updated.balance);
    _refreshSummary();
    notifyListeners();
  }

  Future<void> deleteCustomer(String customerId) async {
    await LocalDbService.instance.deleteCustomer(customerId);
    _customers.removeWhere((c) => c.id == customerId);
    await _refreshSummary();
    notifyListeners();
  }

  CustomerModel? getCustomerById(String id) {
    try {
      return _customers.firstWhere((c) => c.id == id);
    } catch (_) {
      return null;
    }
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
