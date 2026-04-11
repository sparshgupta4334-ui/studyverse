import 'dart:convert';
import 'dart:io';

import '../config/app_config.dart';
import '../models/customer_model.dart';
import '../models/transaction_model.dart';
import 'api_service.dart';
import 'local_db_service.dart';

enum SyncStatus { idle, syncing, success, failed }

class SyncService {
  SyncService._();
  static final SyncService instance = SyncService._();

  SyncStatus _status = SyncStatus.idle;
  SyncStatus get status => _status;

  final List<void Function(SyncStatus)> _listeners = [];

  void addListener(void Function(SyncStatus) listener) {
    _listeners.add(listener);
  }

  void removeListener(void Function(SyncStatus) listener) {
    _listeners.remove(listener);
  }

  void _notifyListeners(SyncStatus status) {
    _status = status;
    for (final listener in _listeners) {
      listener(status);
    }
  }

  Future<bool> _hasConnection() async {
    try {
      final result = await InternetAddress.lookup('google.com')
          .timeout(const Duration(seconds: 5));
      return result.isNotEmpty && result[0].rawAddress.isNotEmpty;
    } catch (_) {
      return false;
    }
  }

  // ── Full sync ──────────────────────────────────────────────────────────────

  Future<void> syncAll() async {
    if (_status == SyncStatus.syncing) return;
    if (!await _hasConnection()) return;

    _notifyListeners(SyncStatus.syncing);

    try {
      await _processSyncQueue();
      await _pullCustomers();
      _notifyListeners(SyncStatus.success);
    } catch (e) {
      _notifyListeners(SyncStatus.failed);
    }
  }

  // ── Push: process queued operations ───────────────────────────────────────

  Future<void> _processSyncQueue() async {
    final items = await LocalDbService.instance.getPendingSyncItems();

    for (final item in items) {
      final id = item['id'] as int;
      final entityType = item['entity_type'] as String;
      final entityId = item['entity_id'] as String;
      final operation = item['operation'] as String;
      final payload =
          jsonDecode(item['payload'] as String) as Map<String, dynamic>;

      try {
        await _dispatchSyncOperation(
          entityType: entityType,
          entityId: entityId,
          operation: operation,
          payload: payload,
        );
        await LocalDbService.instance.removeSyncQueueItem(id);
      } catch (e) {
        // Leave in queue to retry later
      }
    }
  }

  Future<void> _dispatchSyncOperation({
    required String entityType,
    required String entityId,
    required String operation,
    required Map<String, dynamic> payload,
  }) async {
    if (entityType == 'customer') {
      switch (operation) {
        case 'create':
          await ApiService.instance
              .post(AppConfig.customersEndpoint, payload);
          break;
        case 'update':
          await ApiService.instance
              .put('${AppConfig.customersEndpoint}/$entityId', payload);
          break;
        case 'delete':
          await ApiService.instance
              .delete('${AppConfig.customersEndpoint}/$entityId');
          break;
      }
    } else if (entityType == 'transaction') {
      switch (operation) {
        case 'create':
          await ApiService.instance
              .post(AppConfig.transactionsEndpoint, payload);
          break;
        case 'delete':
          await ApiService.instance
              .delete('${AppConfig.transactionsEndpoint}/$entityId');
          break;
      }
    }
  }

  // ── Pull: fetch latest data from server ───────────────────────────────────

  Future<List<CustomerModel>> _pullCustomers() async {
    final response = await ApiService.instance.get(
      AppConfig.customersEndpoint,
      queryParams: {'per_page': '100'},
    );

    final customersList = response['data'] as List<dynamic>? ?? [];
    final customers = customersList
        .map((c) => CustomerModel.fromJson(c as Map<String, dynamic>))
        .toList();

    await LocalDbService.instance.upsertCustomers(customers);
    return customers;
  }

  Future<List<TransactionModel>> pullTransactionsForCustomer(
      String customerId) async {
    final response = await ApiService.instance.get(
      '${AppConfig.customersEndpoint}/$customerId/transactions',
      queryParams: {'per_page': '50'},
    );

    final list = response['data'] as List<dynamic>? ?? [];
    final transactions = list
        .map((t) => TransactionModel.fromJson(t as Map<String, dynamic>))
        .toList();

    await LocalDbService.instance.upsertTransactions(transactions);
    return transactions;
  }

  // ── Queue helpers ──────────────────────────────────────────────────────────

  Future<void> queueCustomerCreate(CustomerModel customer) async {
    await LocalDbService.instance.addToSyncQueue(
      entityType: 'customer',
      entityId: customer.id,
      operation: 'create',
      payload: jsonEncode(customer.toJson()),
    );
  }

  Future<void> queueTransactionCreate(TransactionModel transaction) async {
    await LocalDbService.instance.addToSyncQueue(
      entityType: 'transaction',
      entityId: transaction.id,
      operation: 'create',
      payload: jsonEncode(transaction.toJson()),
    );
  }
}
