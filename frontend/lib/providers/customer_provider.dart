import 'package:flutter/material.dart';
import '../models/customer.dart';
import '../services/customer_service.dart';

class CustomerProvider extends ChangeNotifier {
  List<CustomerModel> _customers = [];
  bool _isLoading = false;
  String? _errorMessage;
  Map<String, dynamic>? _pagination;
  Map<String, dynamic>? _dashboardStats;
  String _searchQuery = '';

  List<CustomerModel> get customers => _customers;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  Map<String, dynamic>? get pagination => _pagination;
  Map<String, dynamic>? get dashboardStats => _dashboardStats;
  String get searchQuery => _searchQuery;

  double get totalReceivable =>
      _dashboardStats?['totalReceivable'] as double? ?? 0.0;
  double get totalPayable =>
      _dashboardStats?['totalPayable'] as double? ?? 0.0;
  int get totalCustomers =>
      _dashboardStats?['totalCustomers'] as int? ?? 0;

  Future<void> loadCustomers({
    bool refresh = false,
    String? search,
    int page = 1,
  }) async {
    if (refresh) {
      _customers = [];
      _pagination = null;
    }

    _isLoading = true;
    _errorMessage = null;
    if (refresh) notifyListeners();

    try {
      final result = await CustomerService.instance.getAll(
        search: search ?? _searchQuery,
        page: page,
      );

      final newCustomers = result['customers'] as List<CustomerModel>;

      if (page == 1) {
        _customers = newCustomers;
      } else {
        _customers = [..._customers, ...newCustomers];
      }

      _pagination = result['pagination'] as Map<String, dynamic>;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadDashboardStats() async {
    try {
      _dashboardStats = await CustomerService.instance.getDashboardStats();
      notifyListeners();
    } catch (e) {
      // Silently fail for stats
    }
  }

  Future<CustomerModel?> addCustomer({
    required String name,
    required String phone,
    String? email,
    String? notes,
  }) async {
    try {
      final customer = await CustomerService.instance.create(
        name: name,
        phone: phone,
        email: email,
        notes: notes,
      );
      _customers.insert(0, customer);
      await loadDashboardStats();
      notifyListeners();
      return customer;
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
      return null;
    }
  }

  Future<CustomerModel?> updateCustomer({
    required String customerId,
    String? name,
    String? phone,
    String? email,
    String? notes,
  }) async {
    try {
      final updated = await CustomerService.instance.update(
        customerId: customerId,
        name: name,
        phone: phone,
        email: email,
        notes: notes,
      );

      final index = _customers.indexWhere((c) => c.customerId == customerId);
      if (index != -1) {
        _customers[index] = updated;
        notifyListeners();
      }

      return updated;
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
      return null;
    }
  }

  Future<bool> deleteCustomer(String customerId) async {
    try {
      await CustomerService.instance.delete(customerId);
      _customers.removeWhere((c) => c.customerId == customerId);
      await loadDashboardStats();
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
      return false;
    }
  }

  void updateCustomerBalanceLocally(String customerId, double newBalance) {
    final index = _customers.indexWhere((c) => c.customerId == customerId);
    if (index != -1) {
      _customers[index] = _customers[index].copyWith(balance: newBalance);
      notifyListeners();
    }
  }

  void search(String query) {
    _searchQuery = query;
    loadCustomers(refresh: true, search: query);
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
