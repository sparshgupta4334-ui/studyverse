import 'package:flutter/material.dart';
import '../../services/database_service.dart';
import '../../models/payment.dart';
import '../../utils/formatters.dart';
import '../../config/app_config.dart';
import '../../widgets/common/loading_widget.dart';
import '../../widgets/common/error_widget.dart';

class PaymentHistoryScreen extends StatefulWidget {
  const PaymentHistoryScreen({super.key});

  @override
  State<PaymentHistoryScreen> createState() => _PaymentHistoryScreenState();
}

class _PaymentHistoryScreenState extends State<PaymentHistoryScreen> {
  final _dbService = DatabaseService();
  List<Payment> _payments = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadPayments();
  }

  Future<void> _loadPayments() async {
    setState(() => _isLoading = true);
    try {
      _payments = await _dbService.getAllPayments();
      _error = null;
    } catch (e) {
      _error = 'Failed to load payments';
    }
    if (mounted) setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Payment History')),
      body: _isLoading
          ? const LoadingWidget()
          : _error != null
              ? AppErrorWidget(message: _error, onRetry: _loadPayments)
              : _payments.isEmpty
                  ? const EmptyStateWidget(
                      message: 'No payment records',
                      icon: Icons.payment_outlined,
                    )
                  : RefreshIndicator(
                      onRefresh: _loadPayments,
                      child: ListView.builder(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        itemCount: _payments.length,
                        itemBuilder: (ctx, i) => _buildPaymentTile(_payments[i]),
                      ),
                    ),
    );
  }

  Widget _buildPaymentTile(Payment payment) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: payment.isCompleted
              ? AppConfig.successColor.withOpacity(0.15)
              : payment.isFailed
                  ? AppConfig.errorColor.withOpacity(0.15)
                  : AppConfig.warningColor.withOpacity(0.15),
          child: Icon(
            payment.isCompleted
                ? Icons.check_circle
                : payment.isFailed
                    ? Icons.cancel
                    : Icons.pending,
            color: payment.isCompleted
                ? AppConfig.successColor
                : payment.isFailed
                    ? AppConfig.errorColor
                    : AppConfig.warningColor,
            size: 20,
          ),
        ),
        title: Text(payment.customerName ?? 'Customer'),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(AppFormatters.formatDateFull(payment.date),
                style: const TextStyle(fontSize: 11)),
            if (payment.upiRef != null)
              Text('Ref: ${payment.upiRef}',
                  style: const TextStyle(fontSize: 11, color: Colors.grey)),
          ],
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              AppFormatters.formatAmount(payment.amount),
              style: const TextStyle(
                  fontWeight: FontWeight.bold, color: AppConfig.creditColor),
            ),
            Text(
              payment.status.toUpperCase(),
              style: TextStyle(
                fontSize: 10,
                color: payment.isCompleted
                    ? AppConfig.successColor
                    : payment.isFailed
                        ? AppConfig.errorColor
                        : AppConfig.warningColor,
              ),
            ),
          ],
        ),
        isThreeLine: true,
      ),
    );
  }
}
