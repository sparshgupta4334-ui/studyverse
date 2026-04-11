enum PaymentStatus { pending, completed, failed, refunded }

class PaymentModel {
  final String paymentId;
  final String? transactionId;
  final String customerId;
  final double amount;
  final String? upiId;
  final String? orderId;
  final PaymentStatus status;
  final DateTime createdAt;

  const PaymentModel({
    required this.paymentId,
    this.transactionId,
    required this.customerId,
    required this.amount,
    this.upiId,
    this.orderId,
    required this.status,
    required this.createdAt,
  });

  factory PaymentModel.fromJson(Map<String, dynamic> json) {
    return PaymentModel(
      paymentId: json['payment_id'] as String,
      transactionId: json['transaction_id'] as String?,
      customerId: json['customer_id'] as String,
      amount: double.parse(json['amount'].toString()),
      upiId: json['upi_id'] as String?,
      orderId: json['order_id'] as String?,
      status: _parseStatus(json['status'] as String),
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  static PaymentStatus _parseStatus(String status) {
    switch (status) {
      case 'completed': return PaymentStatus.completed;
      case 'failed': return PaymentStatus.failed;
      case 'refunded': return PaymentStatus.refunded;
      default: return PaymentStatus.pending;
    }
  }

  bool get isCompleted => status == PaymentStatus.completed;
  bool get isPending => status == PaymentStatus.pending;
}
