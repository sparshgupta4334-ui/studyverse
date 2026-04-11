import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/app_config.dart';
import '../utils/logger.dart';

enum SyncStatus { idle, syncing, success, failed, offline }

class SyncService {
  static final SyncService _instance = SyncService._internal();
  factory SyncService() => _instance;
  SyncService._internal();

  SyncStatus _status = SyncStatus.idle;
  SyncStatus get status => _status;

  Future<bool> isOnline() async {
    final result = await Connectivity().checkConnectivity();
    return result != ConnectivityResult.none;
  }

  Future<DateTime?> getLastSyncTime() async {
    final prefs = await SharedPreferences.getInstance();
    final lastSync = prefs.getString(AppConfig.prefKeyLastSync);
    if (lastSync == null) return null;
    return DateTime.tryParse(lastSync);
  }

  Future<void> _setLastSyncTime() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
        AppConfig.prefKeyLastSync, DateTime.now().toIso8601String());
  }

  /// Sync data with remote server (offline-first: local DB is source of truth)
  Future<SyncStatus> sync() async {
    if (_status == SyncStatus.syncing) return _status;
    if (!(await isOnline())) {
      _status = SyncStatus.offline;
      return _status;
    }

    _status = SyncStatus.syncing;
    AppLogger.i('Starting data sync...');

    try {
      // In a production app, sync local SQLite changes to a remote API.
      // For now, we simulate a successful sync.
      await Future.delayed(const Duration(seconds: 1));
      await _setLastSyncTime();
      _status = SyncStatus.success;
      AppLogger.i('Sync completed successfully');
    } catch (e) {
      AppLogger.e('Sync failed', e);
      _status = SyncStatus.failed;
    }

    return _status;
  }

  Stream<ConnectivityResult> get connectivityStream =>
      Connectivity().onConnectivityChanged;
}
