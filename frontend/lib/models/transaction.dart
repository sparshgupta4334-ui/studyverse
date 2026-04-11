enum TransactionType { credit, debit }

class TransactionModel {
  final String transactionId;
  final String customerId;
  final double amount;
  final TransactionType type;
  final String? notes;
  final String? referenceId;
  final String? customerName;
  final String syncStatus;
  final DateTime createdAt;

  const TransactionModel({
    required this.transactionId,
    required this.customerId,
    required this.amount,
    required this.type,
    this.notes,
    this.referenceId,
    this.customerName,
    this.syncStatus = 'synced',
    required this.createdAt,
  });

  factory TransactionModel.fromJson(Map<String, dynamic> json) {
    return TransactionModel(
      transactionId: json['transaction_id'] as String,
      customerId: json['customer_id'] as String,
      amount: double.parse(json['amount'].toString()),
      type: json['type'] == 'credit'
          ? TransactionType.credit
          : TransactionType.debit,
      notes: json['notes'] as String?,
      referenceId: json['reference_id'] as String?,
      customerName: json['customer_name'] as String?,
      syncStatus: json['sync_status'] as String? ?? 'synced',
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() => {
        'transaction_id': transactionId,
        'customer_id': customerId,
        'amount': amount,
        'type': type.name,
        if (notes != null) 'notes': notes,
        if (referenceId != null) 'reference_id': referenceId,
        'sync_status': syncStatus,
        'created_at': createdAt.toIso8601String(),
      };

  bool get isCredit => type == TransactionType.credit;
  bool get isDebit => type == TransactionType.debit;
}
