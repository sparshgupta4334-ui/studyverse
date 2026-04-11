class Payment {
  final String id;
  final String customerId;
  final String? transactionId;
  final double amount;
  final String? upiRef;
  final String status; // pending, completed, failed
  final String? notes;
  final DateTime date;
  final DateTime createdAt;
  final String? customerName; // joined field

  Payment({
    required this.id,
    required this.customerId,
    this.transactionId,
    required this.amount,
    this.upiRef,
    this.status = 'pending',
    this.notes,
    required this.date,
    required this.createdAt,
    this.customerName,
  });

  bool get isPending => status == 'pending';
  bool get isCompleted => status == 'completed';
  bool get isFailed => status == 'failed';

  factory Payment.fromJson(Map<String, dynamic> json) {
    return Payment(
      id: json['id'] as String,
      customerId: json['customer_id'] as String,
      transactionId: json['transaction_id'] as String?,
      amount: (json['amount'] as num).toDouble(),
      upiRef: json['upi_ref'] as String?,
      status: (json['status'] as String?) ?? 'pending',
      notes: json['notes'] as String?,
      date: DateTime.parse(json['date'] as String),
      createdAt: DateTime.parse(json['created_at'] as String),
      customerName: json['customer_name'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'customer_id': customerId,
      'transaction_id': transactionId,
      'amount': amount,
      'upi_ref': upiRef,
      'status': status,
      'notes': notes,
      'date': date.toIso8601String(),
      'created_at': createdAt.toIso8601String(),
    };
  }

  factory Payment.fromMap(Map<String, dynamic> map) => Payment.fromJson(map);

  Map<String, dynamic> toMap() => toJson();

  Payment copyWith({
    String? id,
    String? customerId,
    String? transactionId,
    double? amount,
    String? upiRef,
    String? status,
    String? notes,
    DateTime? date,
    DateTime? createdAt,
    String? customerName,
  }) {
    return Payment(
      id: id ?? this.id,
      customerId: customerId ?? this.customerId,
      transactionId: transactionId ?? this.transactionId,
      amount: amount ?? this.amount,
      upiRef: upiRef ?? this.upiRef,
      status: status ?? this.status,
      notes: notes ?? this.notes,
      date: date ?? this.date,
      createdAt: createdAt ?? this.createdAt,
      customerName: customerName ?? this.customerName,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) || (other is Payment && other.id == id);

  @override
  int get hashCode => id.hashCode;
}
