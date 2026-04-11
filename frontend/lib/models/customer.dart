class CustomerModel {
  final String customerId;
  final String userId;
  final String name;
  final String phone;
  final String? email;
  final double balance;
  final String? notes;
  final DateTime? lastTransactionDate;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  const CustomerModel({
    required this.customerId,
    required this.userId,
    required this.name,
    required this.phone,
    this.email,
    required this.balance,
    this.notes,
    this.lastTransactionDate,
    this.createdAt,
    this.updatedAt,
  });

  factory CustomerModel.fromJson(Map<String, dynamic> json) {
    return CustomerModel(
      customerId: json['customer_id'] as String,
      userId: json['user_id'] as String,
      name: json['name'] as String,
      phone: json['phone'] as String,
      email: json['email'] as String?,
      balance: double.parse(json['balance'].toString()),
      notes: json['notes'] as String?,
      lastTransactionDate: json['last_transaction_date'] != null
          ? DateTime.parse(json['last_transaction_date'] as String)
          : null,
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String)
          : null,
      updatedAt: json['updated_at'] != null
          ? DateTime.parse(json['updated_at'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() => {
        'customer_id': customerId,
        'user_id': userId,
        'name': name,
        'phone': phone,
        if (email != null) 'email': email,
        'balance': balance,
        if (notes != null) 'notes': notes,
      };

  CustomerModel copyWith({
    String? customerId,
    String? userId,
    String? name,
    String? phone,
    String? email,
    double? balance,
    String? notes,
    DateTime? lastTransactionDate,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return CustomerModel(
      customerId: customerId ?? this.customerId,
      userId: userId ?? this.userId,
      name: name ?? this.name,
      phone: phone ?? this.phone,
      email: email ?? this.email,
      balance: balance ?? this.balance,
      notes: notes ?? this.notes,
      lastTransactionDate: lastTransactionDate ?? this.lastTransactionDate,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  /// Positive balance = customer owes us (will receive), Negative = we owe customer (need to pay)
  bool get isReceivable => balance > 0;
  bool get isPayable => balance < 0;
  bool get isSettled => balance == 0;

  String get initials {
    final parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return name.substring(0, name.length >= 2 ? 2 : 1).toUpperCase();
  }
}
