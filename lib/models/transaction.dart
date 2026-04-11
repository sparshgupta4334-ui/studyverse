class Transaction {
  final String id;
  final String customerId;
  final double amount;
  final String type; // 'credit' or 'debit'
  final String? notes;
  final String category;
  final DateTime date;
  final DateTime createdAt;
  final String? customerName; // joined field

  Transaction({
    required this.id,
    required this.customerId,
    required this.amount,
    required this.type,
    this.notes,
    this.category = 'Sale',
    required this.date,
    required this.createdAt,
    this.customerName,
  });

  bool get isCredit => type == 'credit';
  bool get isDebit => type == 'debit';

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'] as String,
      customerId: json['customer_id'] as String,
      amount: (json['amount'] as num).toDouble(),
      type: json['type'] as String,
      notes: json['notes'] as String?,
      category: (json['category'] as String?) ?? 'Sale',
      date: DateTime.parse(json['date'] as String),
      createdAt: DateTime.parse(json['created_at'] as String),
      customerName: json['customer_name'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'customer_id': customerId,
      'amount': amount,
      'type': type,
      'notes': notes,
      'category': category,
      'date': date.toIso8601String(),
      'created_at': createdAt.toIso8601String(),
    };
  }

  factory Transaction.fromMap(Map<String, dynamic> map) =>
      Transaction.fromJson(map);

  Map<String, dynamic> toMap() => toJson();

  Transaction copyWith({
    String? id,
    String? customerId,
    double? amount,
    String? type,
    String? notes,
    String? category,
    DateTime? date,
    DateTime? createdAt,
    String? customerName,
  }) {
    return Transaction(
      id: id ?? this.id,
      customerId: customerId ?? this.customerId,
      amount: amount ?? this.amount,
      type: type ?? this.type,
      notes: notes ?? this.notes,
      category: category ?? this.category,
      date: date ?? this.date,
      createdAt: createdAt ?? this.createdAt,
      customerName: customerName ?? this.customerName,
    );
  }

  @override
  String toString() =>
      'Transaction(id: $id, amount: $amount, type: $type, date: $date)';

  @override
  bool operator ==(Object other) =>
      identical(this, other) || (other is Transaction && other.id == id);

  @override
  int get hashCode => id.hashCode;
}
