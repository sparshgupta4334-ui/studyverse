import 'package:intl/intl.dart';

class AppFormatters {
  static final _currencyFormatter = NumberFormat.currency(
    locale: 'en_IN',
    symbol: '₹',
    decimalDigits: 2,
  );

  static final _currencyCompact = NumberFormat.compactCurrency(
    locale: 'en_IN',
    symbol: '₹',
    decimalDigits: 1,
  );

  static final _numberFormatter = NumberFormat('#,##,##0.00', 'en_IN');

  static String formatCurrency(double amount) {
    return _currencyFormatter.format(amount);
  }

  static String formatCurrencyCompact(double amount) {
    if (amount.abs() >= 100000) {
      return _currencyCompact.format(amount);
    }
    return formatCurrency(amount);
  }

  static String formatAmount(double amount) {
    return '₹${_numberFormatter.format(amount)}';
  }

  static String formatDate(DateTime date) {
    return DateFormat('dd MMM yyyy').format(date);
  }

  static String formatDateFull(DateTime date) {
    return DateFormat('dd MMM yyyy, hh:mm a').format(date);
  }

  static String formatDateShort(DateTime date) {
    return DateFormat('dd MMM').format(date);
  }

  static String formatTime(DateTime date) {
    return DateFormat('hh:mm a').format(date);
  }

  static String formatMonthYear(DateTime date) {
    return DateFormat('MMMM yyyy').format(date);
  }

  static String formatRelativeDate(DateTime date) {
    final now = DateTime.now();
    final diff = now.difference(date);
    if (diff.inDays == 0) {
      if (diff.inHours == 0) {
        if (diff.inMinutes == 0) return 'Just now';
        return '${diff.inMinutes}m ago';
      }
      return '${diff.inHours}h ago';
    }
    if (diff.inDays == 1) return 'Yesterday';
    if (diff.inDays < 7) return '${diff.inDays} days ago';
    return formatDate(date);
  }

  static String formatPhone(String phone) {
    final clean = phone.replaceAll(RegExp(r'[^0-9]'), '');
    if (clean.length == 10) {
      return '${clean.substring(0, 5)} ${clean.substring(5)}';
    }
    return phone;
  }

  static String formatBalance(double balance) {
    if (balance > 0) return '₹${_numberFormatter.format(balance)} (Due)';
    if (balance < 0) return '₹${_numberFormatter.format(balance.abs())} (Advance)';
    return 'Cleared';
  }

  static String initials(String name) {
    final parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return name.isNotEmpty ? name[0].toUpperCase() : '?';
  }
}
