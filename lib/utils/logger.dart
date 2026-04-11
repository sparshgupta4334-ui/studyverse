import 'package:flutter/foundation.dart';

enum LogLevel { debug, info, warning, error }

class AppLogger {
  static bool _enabled = kDebugMode;
  static const String _tag = 'GPS';

  static void setEnabled(bool enabled) => _enabled = enabled;

  static void d(String message, [Object? error]) =>
      _log(LogLevel.debug, message, error);
  static void i(String message, [Object? error]) =>
      _log(LogLevel.info, message, error);
  static void w(String message, [Object? error]) =>
      _log(LogLevel.warning, message, error);
  static void e(String message, [Object? error, StackTrace? stackTrace]) =>
      _log(LogLevel.error, message, error, stackTrace);

  static void _log(
    LogLevel level,
    String message,
    Object? error, [
    StackTrace? stackTrace,
  ]) {
    if (!_enabled) return;
    final now = DateTime.now();
    final timeStr =
        '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}:${now.second.toString().padLeft(2, '0')}';
    final prefix = _levelPrefix(level);
    debugPrint('[$_tag][$timeStr][$prefix] $message');
    if (error != null) debugPrint('  Error: $error');
    if (stackTrace != null) debugPrint('  StackTrace: $stackTrace');
  }

  static String _levelPrefix(LogLevel level) {
    switch (level) {
      case LogLevel.debug:
        return 'DEBUG';
      case LogLevel.info:
        return 'INFO';
      case LogLevel.warning:
        return 'WARN';
      case LogLevel.error:
        return 'ERROR';
    }
  }
}
