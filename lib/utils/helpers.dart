import 'package:flutter/material.dart';

class AppHelpers {
  static void showSnackBar(
    BuildContext context,
    String message, {
    bool isError = false,
    bool isSuccess = false,
    Duration duration = const Duration(seconds: 3),
  }) {
    final color = isError
        ? const Color(0xFFE53935)
        : isSuccess
            ? const Color(0xFF43A047)
            : const Color(0xFF323232);

    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message, style: const TextStyle(color: Colors.white)),
        backgroundColor: color,
        duration: duration,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        margin: const EdgeInsets.all(12),
      ),
    );
  }

  static Future<bool?> showConfirmDialog(
    BuildContext context, {
    required String title,
    required String message,
    String confirmText = 'Confirm',
    String cancelText = 'Cancel',
    bool isDestructive = false,
  }) async {
    return showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(title),
        content: Text(message),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: Text(cancelText),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: TextButton.styleFrom(
              foregroundColor: isDestructive ? Colors.red : null,
            ),
            child: Text(confirmText),
          ),
        ],
      ),
    );
  }

  static Future<void> showLoadingDialog(BuildContext context,
      {String message = 'Please wait...'}) async {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        content: Row(
          children: [
            const CircularProgressIndicator(),
            const SizedBox(width: 16),
            Expanded(child: Text(message)),
          ],
        ),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  static void hideLoadingDialog(BuildContext context) {
    Navigator.of(context, rootNavigator: true).pop();
  }

  static Color getBalanceColor(double balance, BuildContext context) {
    if (balance > 0) return const Color(0xFFE53935);
    if (balance < 0) return const Color(0xFF43A047);
    return Theme.of(context).textTheme.bodyMedium?.color ?? Colors.grey;
  }

  static Color getAvatarColor(String name) {
    final colors = [
      const Color(0xFF1E88E5),
      const Color(0xFF43A047),
      const Color(0xFFE53935),
      const Color(0xFFFF6F00),
      const Color(0xFF8E24AA),
      const Color(0xFF00ACC1),
      const Color(0xFFD81B60),
      const Color(0xFF3949AB),
    ];
    int hash = 0;
    for (var char in name.runes) {
      hash = (hash * 31 + char) & 0x7FFFFFFF;
    }
    return colors[hash % colors.length];
  }

  static bool isValidPhoneNumber(String phone) {
    final clean = phone.replaceAll(RegExp(r'[^0-9]'), '');
    return RegExp(r'^[6-9]\d{9}$').hasMatch(clean);
  }
}
