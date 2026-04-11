import '../models/customer.dart';
import '../models/transaction.dart';
import 'api_service.dart';
import 'database_service.dart';

class CustomerService {
  CustomerService._();
  static final CustomerService instance = CustomerService._();

  Future<Map<String, dynamic>> getAll({
    String? search,
    int page = 1,
    int limit = 20,
    String? sortBy,
    String? sortOrder,
  }) async {
    final queryParams = <String, String>{
      'page': page.toString(),
      'limit': limit.toString(),
      if (search != null && search.isNotEmpty) 'q': search,
      if (sortBy != null) 'sortBy': sortBy,
      if (sortOrder != null) 'sortOrder': sortOrder,
    };

    final queryString = queryParams.entries
        .map((e) => '${e.key}=${Uri.encodeComponent(e.value)}')
        .join('&');

    final response = await ApiService.instance.get('/customers?$queryString');

    final customers = (response['data'] as List)
        .map((e) => CustomerModel.fromJson(e as Map<String, dynamic>))
        .toList();

    return {
      'customers': customers,
      'pagination': response['pagination'],
    };
  }

  Future<CustomerModel> getById(String customerId) async {
    final response = await ApiService.instance.get('/customers/$customerId');
    return CustomerModel.fromJson(response['data'] as Map<String, dynamic>);
  }

  Future<CustomerModel> create({
    required String name,
    required String phone,
    String? email,
    String? notes,
  }) async {
    final response = await ApiService.instance.post('/customers', {
      'name': name,
      'phone': phone,
      if (email != null && email.isNotEmpty) 'email': email,
      if (notes != null && notes.isNotEmpty) 'notes': notes,
    });
    return CustomerModel.fromJson(response['data'] as Map<String, dynamic>);
  }

  Future<CustomerModel> update({
    required String customerId,
    String? name,
    String? phone,
    String? email,
    String? notes,
  }) async {
    final response = await ApiService.instance.put('/customers/$customerId', {
      if (name != null) 'name': name,
      if (phone != null) 'phone': phone,
      if (email != null) 'email': email,
      if (notes != null) 'notes': notes,
    });
    return CustomerModel.fromJson(response['data'] as Map<String, dynamic>);
  }

  Future<void> delete(String customerId) async {
    await ApiService.instance.delete('/customers/$customerId');
  }

  Future<Map<String, dynamic>> getDashboardStats() async {
    final response = await ApiService.instance.get('/customers/stats');
    return response['data'] as Map<String, dynamic>;
  }
}

class TransactionService {
  TransactionService._();
  static final TransactionService instance = TransactionService._();

  Future<Map<String, dynamic>> getByCustomer(
    String customerId, {
    int page = 1,
    int limit = 20,
    String? startDate,
    String? endDate,
    String? type,
  }) async {
    final queryParams = <String, String>{
      'page': page.toString(),
      'limit': limit.toString(),
      if (startDate != null) 'startDate': startDate,
      if (endDate != null) 'endDate': endDate,
      if (type != null) 'type': type,
    };

    final queryString = queryParams.entries
        .map((e) => '${e.key}=${Uri.encodeComponent(e.value)}')
        .join('&');

    final response = await ApiService.instance
        .get('/transactions/customer/$customerId?$queryString');

    final transactions = (response['data'] as List)
        .map((e) => TransactionModel.fromJson(e as Map<String, dynamic>))
        .toList();

    return {
      'transactions': transactions,
      'pagination': response['pagination'],
      'customerBalance': response['customerBalance'],
    };
  }

  Future<TransactionModel> create({
    required String customerId,
    required double amount,
    required String type,
    String? notes,
  }) async {
    final response = await ApiService.instance.post('/transactions', {
      'customerId': customerId,
      'amount': amount,
      'type': type,
      if (notes != null && notes.isNotEmpty) 'notes': notes,
    });
    return TransactionModel.fromJson(response['data'] as Map<String, dynamic>);
  }

  Future<void> delete(String transactionId) async {
    await ApiService.instance.delete('/transactions/$transactionId');
  }

  Future<Map<String, dynamic>> getReport({
    String? period,
    String? startDate,
    String? endDate,
  }) async {
    final queryParams = <String, String>{
      if (period != null) 'period': period,
      if (startDate != null) 'startDate': startDate,
      if (endDate != null) 'endDate': endDate,
    };

    final queryString = queryParams.entries
        .map((e) => '${e.key}=${Uri.encodeComponent(e.value)}')
        .join('&');

    final response = await ApiService.instance.get('/transactions/report?$queryString');
    return response['data'] as Map<String, dynamic>;
  }
}
