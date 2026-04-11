import 'package:url_launcher/url_launcher.dart';
import '../config/app_config.dart';
import '../config/constants.dart';
import '../utils/logger.dart';

class ReminderService {
  static final ReminderService _instance = ReminderService._internal();
  factory ReminderService() => _instance;
  ReminderService._internal();

  /// Sends a WhatsApp reminder to the customer
  Future<bool> sendWhatsAppReminder({
    required String phone,
    required String customerName,
    required double amount,
    String? customMessage,
  }) async {
    final message = customMessage ??
        AppConstants.whatsappReminderTemplate
            .replaceAll('{name}', customerName)
            .replaceAll('{amount}', amount.toStringAsFixed(0))
            .replaceAll('{phone}', AppConfig.supportPhone);

    final encodedMsg = Uri.encodeComponent(message);
    final cleanPhone = phone.replaceAll(RegExp(r'[^0-9]'), '');
    final waPhone = cleanPhone.startsWith('91') ? cleanPhone : '91$cleanPhone';

    final uri = Uri.parse('https://wa.me/$waPhone?text=$encodedMsg');

    try {
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
        return true;
      }
      AppLogger.w('WhatsApp not installed');
      return false;
    } catch (e) {
      AppLogger.e('WhatsApp reminder error', e);
      return false;
    }
  }

  /// Opens SMS app with a pre-filled reminder message
  Future<bool> sendSmsReminder({
    required String phone,
    required String customerName,
    required double amount,
    String? customMessage,
  }) async {
    final message = customMessage ??
        AppConstants.whatsappReminderTemplate
            .replaceAll('{name}', customerName)
            .replaceAll('{amount}', amount.toStringAsFixed(0))
            .replaceAll('{phone}', AppConfig.supportPhone);

    final encodedMsg = Uri.encodeComponent(message);
    final uri = Uri.parse('sms:$phone?body=$encodedMsg');

    try {
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
        return true;
      }
      AppLogger.w('SMS not available');
      return false;
    } catch (e) {
      AppLogger.e('SMS reminder error', e);
      return false;
    }
  }

  /// Opens phone dialer
  Future<bool> callCustomer(String phone) async {
    final uri = Uri.parse('tel:$phone');
    try {
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
        return true;
      }
      return false;
    } catch (e) {
      AppLogger.e('Call error', e);
      return false;
    }
  }

  String buildReminderMessage({
    required String customerName,
    required double amount,
    String? customNote,
  }) {
    if (customNote != null && customNote.isNotEmpty) return customNote;
    return AppConstants.whatsappReminderTemplate
        .replaceAll('{name}', customerName)
        .replaceAll('{amount}', amount.toStringAsFixed(0))
        .replaceAll('{phone}', AppConfig.supportPhone);
  }
}
