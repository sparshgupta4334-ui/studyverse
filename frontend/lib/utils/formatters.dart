import 'package:intl/intl.dart';

class AppFormatters {
  AppFormatters._();

  static final NumberFormat _currencyFormat = NumberFormat.currency(
    locale: 'en_IN',
    symbol: '₹',
    decimalDigits: 2,
  );

  static final NumberFormat _compactCurrencyFormat = NumberFormat.compactCurrency(
    locale: 'en_IN',
    symbol: '₹',
    decimalDigits: 1,
  );

  static final DateFormat _dateTimeFormat = DateFormat('dd MMM yyyy, hh:mm a');
  static final DateFormat _dateFormat = DateFormat('dd MMM yyyy');
  static final DateFormat _shortDateFormat = DateFormat('dd MMM');
  static final DateFormat _timeFormat = DateFormat('hh:mm a');

  /// Format amount as Indian currency (₹1,00,000.00)
  static String formatCurrency(double amount) {
    return _currencyFormat.format(amount.abs());
  }

  /// Format amount compactly (₹1.0L, ₹50K)
  static String formatCompactCurrency(double amount) {
    return _compactCurrencyFormat.format(amount.abs());
  }

  /// Format date and time
  static String formatDateTime(DateTime dateTime) {
    return _dateTimeFormat.format(dateTime.toLocal());
  }

  /// Format date only
  static String formatDate(DateTime dateTime) {
    return _dateFormat.format(dateTime.toLocal());
  }

  /// Format short date (e.g. "15 Jan")
  static String formatShortDate(String isoDateString) {
    try {
      final date = DateTime.parse(isoDateString);
      return _shortDateFormat.format(date);
    } catch (_) {
      return isoDateString;
    }
  }

  /// Format relative date (e.g. "Today", "Yesterday", "2 days ago")
  static String formatRelativeDate(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime.toLocal());

    if (difference.inDays == 0) {
      if (difference.inHours == 0) {
        if (difference.inMinutes == 0) return 'Just now';
        return '${difference.inMinutes}m ago';
      }
      return '${difference.inHours}h ago';
    } else if (difference.inDays == 1) {
      return 'Yesterday';
    } else if (difference.inDays < 7) {
      return '${difference.inDays} days ago';
    } else {
      return formatDate(dateTime);
    }
  }

  /// Format phone number for display
  static String formatPhone(String phone) {
    final cleaned = phone.replaceAll(RegExp(r'\D'), '');
    if (cleaned.length == 10) {
      return '${cleaned.substring(0, 5)} ${cleaned.substring(5)}';
    }
    return phone;
  }
}
