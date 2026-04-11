import 'package:flutter/material.dart';
import '../services/database_service.dart';
import '../models/customer.dart';

class CustomerProvider extends ChangeNotifier {
  final DatabaseService _dbService = DatabaseService();

  List<Customer> _customers = [];
  List<Customer> get customers => _customers;

  List<Customer> _filteredCustomers = [];
  List<Customer> get filteredCustomers =>
      _searchQuery.isEmpty && _filterCategory == null
          ? _customers
          : _filteredCustomers;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  String _searchQuery = '';
  String get searchQuery => _searchQuery;

  String? _filterCategory;
  String? get filterCategory => _filterCategory;

  String _sortBy = 'name';
  bool _sortAscending = true;

  int get totalCustomers => _customers.length;
  double get totalOutstanding => _customers
      .where((c) => c.balance > 0)
      .fold(0.0, (sum, c) => sum + c.balance);
  int get customersWithDues => _customers.where((c) => c.balance > 0).length;

  Future<void> loadCustomers() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();
    try {
      _customers = await _dbService.getCustomers(
        sortBy: _sortBy,
        ascending: _sortAscending,
      );
      _applyFilters();
    } catch (e) {
      _errorMessage = 'Failed to load customers.';
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<Customer> addCustomer({
    required String name,
    required String phone,
    String? email,
    String? address,
    String category = 'Regular',
    String? notes,
  }) async {
    final customer = await _dbService.addCustomer(
      name: name,
      phone: phone,
      email: email,
      address: address,
      category: category,
      notes: notes,
    );
    _customers.add(customer);
    _customers.sort((a, b) => a.name.compareTo(b.name));
    _applyFilters();
    notifyListeners();
    return customer;
  }

  Future<Customer> updateCustomer(Customer customer) async {
    final updated = await _dbService.updateCustomer(customer);
    final idx = _customers.indexWhere((c) => c.id == customer.id);
    if (idx != -1) _customers[idx] = updated;
    _applyFilters();
    notifyListeners();
    return updated;
  }

  Future<void> deleteCustomer(String id) async {
    await _dbService.deleteCustomer(id);
    _customers.removeWhere((c) => c.id == id);
    _applyFilters();
    notifyListeners();
  }

  Future<Customer?> getCustomer(String id) async {
    // First check local list
    final local = _customers.where((c) => c.id == id).toList();
    if (local.isNotEmpty) return local.first;
    return _dbService.getCustomer(id);
  }

  void search(String query) {
    _searchQuery = query;
    _applyFilters();
    notifyListeners();
  }

  void setFilterCategory(String? category) {
    _filterCategory = category;
    _applyFilters();
    notifyListeners();
  }

  void setSortBy(String sortBy, {bool ascending = true}) {
    _sortBy = sortBy;
    _sortAscending = ascending;
    loadCustomers();
  }

  void _applyFilters() {
    var result = List<Customer>.from(_customers);
    if (_searchQuery.isNotEmpty) {
      final q = _searchQuery.toLowerCase();
      result = result.where((c) {
        return c.name.toLowerCase().contains(q) ||
            c.phone.contains(q) ||
            (c.email?.toLowerCase().contains(q) ?? false);
      }).toList();
    }
    if (_filterCategory != null && _filterCategory!.isNotEmpty) {
      result = result.where((c) => c.category == _filterCategory).toList();
    }
    _filteredCustomers = result;
  }

  void refreshCustomer(String id) async {
    final customer = await _dbService.getCustomer(id);
    if (customer != null) {
      final idx = _customers.indexWhere((c) => c.id == id);
      if (idx != -1) {
        _customers[idx] = customer;
        _applyFilters();
        notifyListeners();
      }
    }
  }

  void clearFilters() {
    _searchQuery = '';
    _filterCategory = null;
    _filteredCustomers = [];
    notifyListeners();
  }
}
