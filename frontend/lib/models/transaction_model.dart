enum TransactionType { credit, debit }

extension TransactionTypeExtension on TransactionType {
  String get name => this == TransactionType.credit ? 'credit' : 'debit';
  String get label => this == TransactionType.credit ? 'Credit (Got)' : 'Debit (Gave)';

  static TransactionType fromString(String value) {
    return value == 'credit' ? TransactionType.credit : TransactionType.debit;
  }
}

class TransactionModel {
  final String id;
  final String customerId;
  final double amount;
  final TransactionType type;
  final String? notes;
  final DateTime date;
  final bool isSynced;
  final String? receiptUrl;

  const TransactionModel({
    required this.id,
    required this.customerId,
    required this.amount,
    required this.type,
    this.notes,
    required this.date,
    this.isSynced = false,
    this.receiptUrl,
  });

  bool get isCredit => type == TransactionType.credit;
  bool get isDebit => type == TransactionType.debit;

  /// Signed amount: positive for credit (customer owes more), negative for debit (you gave)
  double get signedAmount => isCredit ? amount : -amount;

  factory TransactionModel.fromJson(Map<String, dynamic> json) {
    return TransactionModel(
      id: json['id'] as String,
      customerId: json['customer_id'] as String,
      amount: (json['amount'] as num).toDouble(),
      type: TransactionTypeExtension.fromString(json['type'] as String),
      notes: json['notes'] as String?,
      date: DateTime.parse(json['date'] as String),
      isSynced: (json['is_synced'] as int?) == 1,
      receiptUrl: json['receipt_url'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'customer_id': customerId,
        'amount': amount,
        'type': type.name,
        'notes': notes,
        'date': date.toIso8601String(),
        'is_synced': isSynced ? 1 : 0,
        'receipt_url': receiptUrl,
      };

  TransactionModel copyWith({
    String? id,
    String? customerId,
    double? amount,
    TransactionType? type,
    String? notes,
    DateTime? date,
    bool? isSynced,
    String? receiptUrl,
  }) {
    return TransactionModel(
      id: id ?? this.id,
      customerId: customerId ?? this.customerId,
      amount: amount ?? this.amount,
      type: type ?? this.type,
      notes: notes ?? this.notes,
      date: date ?? this.date,
      isSynced: isSynced ?? this.isSynced,
      receiptUrl: receiptUrl ?? this.receiptUrl,
    );
  }

  @override
  String toString() =>
      'TransactionModel(id: $id, customerId: $customerId, amount: $amount, type: ${type.name})';

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is TransactionModel &&
          runtimeType == other.runtimeType &&
          id == other.id;

  @override
  int get hashCode => id.hashCode;
}
