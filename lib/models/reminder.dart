class Reminder {
  final String id;
  final String customerId;
  final String message;
  final String type; // sms, whatsapp, notification
  final DateTime scheduledAt;
  final DateTime? sentAt;
  final String status; // pending, sent, failed
  final String? customerName; // joined field
  final String? customerPhone; // joined field

  Reminder({
    required this.id,
    required this.customerId,
    required this.message,
    required this.type,
    required this.scheduledAt,
    this.sentAt,
    this.status = 'pending',
    this.customerName,
    this.customerPhone,
  });

  bool get isPending => status == 'pending';
  bool get isSent => status == 'sent';
  bool get isFailed => status == 'failed';

  factory Reminder.fromJson(Map<String, dynamic> json) {
    return Reminder(
      id: json['id'] as String,
      customerId: json['customer_id'] as String,
      message: json['message'] as String,
      type: json['type'] as String,
      scheduledAt: DateTime.parse(json['scheduled_at'] as String),
      sentAt: json['sent_at'] != null
          ? DateTime.parse(json['sent_at'] as String)
          : null,
      status: (json['status'] as String?) ?? 'pending',
      customerName: json['customer_name'] as String?,
      customerPhone: json['customer_phone'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'customer_id': customerId,
      'message': message,
      'type': type,
      'scheduled_at': scheduledAt.toIso8601String(),
      'sent_at': sentAt?.toIso8601String(),
      'status': status,
    };
  }

  factory Reminder.fromMap(Map<String, dynamic> map) => Reminder.fromJson(map);

  Map<String, dynamic> toMap() => toJson();

  Reminder copyWith({
    String? id,
    String? customerId,
    String? message,
    String? type,
    DateTime? scheduledAt,
    DateTime? sentAt,
    String? status,
    String? customerName,
    String? customerPhone,
  }) {
    return Reminder(
      id: id ?? this.id,
      customerId: customerId ?? this.customerId,
      message: message ?? this.message,
      type: type ?? this.type,
      scheduledAt: scheduledAt ?? this.scheduledAt,
      sentAt: sentAt ?? this.sentAt,
      status: status ?? this.status,
      customerName: customerName ?? this.customerName,
      customerPhone: customerPhone ?? this.customerPhone,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) || (other is Reminder && other.id == id);

  @override
  int get hashCode => id.hashCode;
}
