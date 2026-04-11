import 'package:url_launcher/url_launcher.dart';
import '../config/app_config.dart';
import '../utils/logger.dart';

class PaymentService {
  static final PaymentService _instance = PaymentService._internal();
  factory PaymentService() => _instance;
  PaymentService._internal();

  /// Opens a UPI payment app with the given parameters
  Future<bool> initiateUpiPayment({
    required double amount,
    required String customerName,
    String? upiId,
    String? transactionNote,
  }) async {
    final payeeUpi = upiId ?? AppConfig.defaultUpiId;
    final note = transactionNote ?? 'Payment to ${AppConfig.merchantName}';
    final amountStr = amount.toStringAsFixed(2);

    final upiUri = Uri.parse(
      'upi://pay?pa=$payeeUpi&pn=${Uri.encodeComponent(AppConfig.merchantName)}'
      '&am=$amountStr&cu=INR&tn=${Uri.encodeComponent(note)}',
    );

    try {
      if (await canLaunchUrl(upiUri)) {
        await launchUrl(upiUri, mode: LaunchMode.externalApplication);
        return true;
      }
      AppLogger.w('No UPI app found to handle the payment');
      return false;
    } catch (e) {
      AppLogger.e('UPI payment error', e);
      return false;
    }
  }

  /// Opens Google Pay specifically
  Future<bool> openGooglePay({
    required double amount,
    String? upiId,
    String? note,
  }) async {
    final payeeUpi = upiId ?? AppConfig.defaultUpiId;
    final amountStr = amount.toStringAsFixed(2);
    final txNote = note ?? 'Payment';

    final uri = Uri.parse(
      'tez://upi/pay?pa=$payeeUpi&pn=${Uri.encodeComponent(AppConfig.merchantName)}'
      '&am=$amountStr&cu=INR&tn=${Uri.encodeComponent(txNote)}',
    );

    try {
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
        return true;
      }
      return false;
    } catch (e) {
      AppLogger.e('Google Pay error', e);
      return false;
    }
  }

  /// Opens PhonePe specifically
  Future<bool> openPhonePe({
    required double amount,
    String? upiId,
    String? note,
  }) async {
    final payeeUpi = upiId ?? AppConfig.defaultUpiId;
    final amountStr = amount.toStringAsFixed(2);
    final txNote = note ?? 'Payment';

    final uri = Uri.parse(
      'phonepe://pay?pa=$payeeUpi&pn=${Uri.encodeComponent(AppConfig.merchantName)}'
      '&am=$amountStr&cu=INR&tn=${Uri.encodeComponent(txNote)}',
    );

    try {
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
        return true;
      }
      return false;
    } catch (e) {
      AppLogger.e('PhonePe error', e);
      return false;
    }
  }

  /// Opens Paytm specifically
  Future<bool> openPaytm({
    required double amount,
    String? upiId,
    String? note,
  }) async {
    final payeeUpi = upiId ?? AppConfig.defaultUpiId;
    final amountStr = amount.toStringAsFixed(2);
    final txNote = note ?? 'Payment';

    final uri = Uri.parse(
      'paytmmp://pay?pa=$payeeUpi&pn=${Uri.encodeComponent(AppConfig.merchantName)}'
      '&am=$amountStr&cu=INR&tn=${Uri.encodeComponent(txNote)}',
    );

    try {
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
        return true;
      }
      return false;
    } catch (e) {
      AppLogger.e('Paytm error', e);
      return false;
    }
  }

  String generatePaymentLink({
    required double amount,
    String? upiId,
    String? note,
  }) {
    final payeeUpi = upiId ?? AppConfig.defaultUpiId;
    final amountStr = amount.toStringAsFixed(2);
    final txNote = note ?? 'Payment to ${AppConfig.merchantName}';
    return 'upi://pay?pa=$payeeUpi&pn=${Uri.encodeComponent(AppConfig.merchantName)}'
        '&am=$amountStr&cu=INR&tn=${Uri.encodeComponent(txNote)}';
  }
}
