class UserModel {
  final String userId;
  final String phone;
  final String? name;
  final String? email;
  final DateTime? createdAt;

  const UserModel({
    required this.userId,
    required this.phone,
    this.name,
    this.email,
    this.createdAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      userId: json['userId'] as String,
      phone: json['phone'] as String,
      name: json['name'] as String?,
      email: json['email'] as String?,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() => {
        'userId': userId,
        'phone': phone,
        if (name != null) 'name': name,
        if (email != null) 'email': email,
        if (createdAt != null) 'createdAt': createdAt!.toIso8601String(),
      };

  UserModel copyWith({
    String? userId,
    String? phone,
    String? name,
    String? email,
    DateTime? createdAt,
  }) {
    return UserModel(
      userId: userId ?? this.userId,
      phone: phone ?? this.phone,
      name: name ?? this.name,
      email: email ?? this.email,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  String get displayName => name ?? phone;
}
