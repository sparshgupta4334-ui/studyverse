class CustomerModel {
  final String id;
  final String name;
  final String phone;
  final String? email;
  final String? address;
  final double balance;
  final DateTime? lastTransactionDate;
  final DateTime createdAt;
  final bool isSynced;

  const CustomerModel({
    required this.id,
    required this.name,
    required this.phone,
    this.email,
    this.address,
    this.balance = 0.0,
    this.lastTransactionDate,
    required this.createdAt,
    this.isSynced = false,
  });

  /// Positive balance = customer owes you (receivable/green)
  /// Negative balance = you owe customer (payable/red)
  bool get isReceivable => balance > 0;
  bool get isPayable => balance < 0;
  double get absoluteBalance => balance.abs();

  factory CustomerModel.fromJson(Map<String, dynamic> json) {
    return CustomerModel(
      id: json['id'] as String,
      name: json['name'] as String,
      phone: json['phone'] as String,
      email: json['email'] as String?,
      address: json['address'] as String?,
      balance: (json['balance'] as num?)?.toDouble() ?? 0.0,
      lastTransactionDate: json['last_transaction_date'] != null
          ? DateTime.parse(json['last_transaction_date'] as String)
          : null,
      createdAt: DateTime.parse(json['created_at'] as String),
      isSynced: (json['is_synced'] as int?) == 1,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'phone': phone,
        'email': email,
        'address': address,
        'balance': balance,
        'last_transaction_date': lastTransactionDate?.toIso8601String(),
        'created_at': createdAt.toIso8601String(),
        'is_synced': isSynced ? 1 : 0,
      };

  CustomerModel copyWith({
    String? id,
    String? name,
    String? phone,
    String? email,
    String? address,
    double? balance,
    DateTime? lastTransactionDate,
    DateTime? createdAt,
    bool? isSynced,
  }) {
    return CustomerModel(
      id: id ?? this.id,
      name: name ?? this.name,
      phone: phone ?? this.phone,
      email: email ?? this.email,
      address: address ?? this.address,
      balance: balance ?? this.balance,
      lastTransactionDate: lastTransactionDate ?? this.lastTransactionDate,
      createdAt: createdAt ?? this.createdAt,
      isSynced: isSynced ?? this.isSynced,
    );
  }

  @override
  String toString() =>
      'CustomerModel(id: $id, name: $name, phone: $phone, balance: $balance)';

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CustomerModel && runtimeType == other.runtimeType && id == other.id;

  @override
  int get hashCode => id.hashCode;
}
