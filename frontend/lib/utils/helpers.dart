import 'package:url_launcher/url_launcher.dart';

class AppHelpers {
  AppHelpers._();

  /// Launch UPI payment intent
  static Future<bool> launchUpiPayment({
    required String upiId,
    required String payeeName,
    required double amount,
    String? transactionNote,
    String? transactionRefId,
  }) async {
    final amountStr = amount.toStringAsFixed(2);
    final note = Uri.encodeComponent(transactionNote ?? 'Payment');
    final uriString = 'upi://pay?pa=$upiId&pn=${Uri.encodeComponent(payeeName)}'
        '&am=$amountStr&cu=INR&tn=$note'
        '${transactionRefId != null ? '&tr=$transactionRefId' : ''}';

    final uri = Uri.parse(uriString);
    if (await canLaunchUrl(uri)) {
      return launchUrl(uri);
    }
    return false;
  }

  /// Launch phone dialer
  static Future<bool> callPhone(String phone) async {
    final uri = Uri.parse('tel:$phone');
    if (await canLaunchUrl(uri)) {
      return launchUrl(uri);
    }
    return false;
  }

  /// Launch WhatsApp
  static Future<bool> openWhatsApp(String phone, {String? message}) async {
    final cleanPhone = phone.replaceAll(RegExp(r'\D'), '');
    final formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : '91$cleanPhone';
    final encodedMessage = message != null ? Uri.encodeComponent(message) : '';
    final uri = Uri.parse('https://wa.me/$formattedPhone?text=$encodedMessage');
    if (await canLaunchUrl(uri)) {
      return launchUrl(uri, mode: LaunchMode.externalApplication);
    }
    return false;
  }

  /// Format Indian phone number for display
  static String formatIndianPhone(String phone) {
    final cleaned = phone.replaceAll(RegExp(r'\D'), '');
    if (cleaned.length == 10) return '+91 ${cleaned.substring(0, 5)} ${cleaned.substring(5)}';
    if (cleaned.length == 12 && cleaned.startsWith('91')) {
      return '+91 ${cleaned.substring(2, 7)} ${cleaned.substring(7)}';
    }
    return phone;
  }

  /// Get avatar color based on name
  static int getAvatarColor(String name) {
    final colors = [
      0xFF2563EB, 0xFF7C3AED, 0xFF059669, 0xFFDC2626,
      0xFFD97706, 0xFF0891B2, 0xFF4F46E5, 0xFFDB2777,
    ];
    if (name.isEmpty) return colors[0];
    final index = name.codeUnitAt(0) % colors.length;
    return colors[index];
  }
}
