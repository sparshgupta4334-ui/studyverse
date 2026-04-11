class UserModel {
  final String id;
  final String phone;
  final String? name;
  final String? email;
  final String? businessName;
  final String? photoUrl;
  final DateTime createdAt;

  const UserModel({
    required this.id,
    required this.phone,
    this.name,
    this.email,
    this.businessName,
    this.photoUrl,
    required this.createdAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String,
      phone: json['phone'] as String,
      name: json['name'] as String?,
      email: json['email'] as String?,
      businessName: json['business_name'] as String?,
      photoUrl: json['photo_url'] as String?,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'phone': phone,
        'name': name,
        'email': email,
        'business_name': businessName,
        'photo_url': photoUrl,
        'created_at': createdAt.toIso8601String(),
      };

  UserModel copyWith({
    String? id,
    String? phone,
    String? name,
    String? email,
    String? businessName,
    String? photoUrl,
    DateTime? createdAt,
  }) {
    return UserModel(
      id: id ?? this.id,
      phone: phone ?? this.phone,
      name: name ?? this.name,
      email: email ?? this.email,
      businessName: businessName ?? this.businessName,
      photoUrl: photoUrl ?? this.photoUrl,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  String get displayName => name ?? businessName ?? phone;

  @override
  String toString() => 'UserModel(id: $id, phone: $phone, name: $name)';
}
