import 'package:flutter/material.dart';
import '../../models/transaction.dart';
import '../../config/app_config.dart';
import '../../utils/formatters.dart';
import '../../utils/helpers.dart';
import '../../config/constants.dart';

class TransactionDetailScreen extends StatelessWidget {
  final Transaction transaction;

  const TransactionDetailScreen({super.key, required this.transaction});

  @override
  Widget build(BuildContext context) {
    final isDebit = transaction.isDebit;
    final color = isDebit ? AppConfig.debitColor : AppConfig.creditColor;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Transaction Details'),
        actions: [
          PopupMenuButton(
            itemBuilder: (_) => [
              const PopupMenuItem(value: 'delete', child: Text('Delete')),
            ],
            onSelected: (v) async {
              if (v == 'delete') {
                final confirm = await AppHelpers.showConfirmDialog(
                  context,
                  title: 'Delete Transaction',
                  message: 'Are you sure you want to delete this transaction?',
                  confirmText: 'Delete',
                  isDestructive: true,
                );
                if (confirm == true && context.mounted) {
                  Navigator.pop(context, 'deleted');
                }
              }
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    Container(
                      width: 64,
                      height: 64,
                      decoration: BoxDecoration(
                        color: color.withOpacity(0.15),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        isDebit ? Icons.arrow_upward : Icons.arrow_downward,
                        color: color,
                        size: 32,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      AppFormatters.formatAmount(transaction.amount),
                      style: TextStyle(
                        fontSize: 36,
                        fontWeight: FontWeight.bold,
                        color: color,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      isDebit ? 'Debit (Sale)' : 'Credit (Payment)',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    _DetailRow(label: 'Customer', value: transaction.customerName ?? 'N/A'),
                    const Divider(),
                    _DetailRow(label: 'Category', value: transaction.category),
                    const Divider(),
                    _DetailRow(
                        label: 'Date',
                        value: AppFormatters.formatDateFull(transaction.date)),
                    const Divider(),
                    _DetailRow(
                        label: 'Created',
                        value: AppFormatters.formatDateFull(transaction.createdAt)),
                    if (transaction.notes != null &&
                        transaction.notes!.isNotEmpty) ...[
                      const Divider(),
                      _DetailRow(label: 'Notes', value: transaction.notes!),
                    ],
                    const Divider(),
                    _DetailRow(
                        label: 'Transaction ID',
                        value: transaction.id.substring(0, 8).toUpperCase(),
                        isCode: true),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            if (transaction.customerName != null)
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  icon: const Icon(Icons.person),
                  label: Text('View ${transaction.customerName}'),
                  onPressed: () => Navigator.pushNamed(
                    context,
                    AppConstants.routeCustomerDetail,
                    arguments: transaction.customerId,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final String label;
  final String value;
  final bool isCode;

  const _DetailRow(
      {required this.label, required this.value, this.isCode = false});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(label,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Colors.grey,
                    )),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              value,
              style: isCode
                  ? const TextStyle(
                      fontFamily: 'monospace',
                      fontSize: 13,
                      color: AppConfig.primaryColor,
                    )
                  : Theme.of(context).textTheme.bodyMedium,
            ),
          ),
        ],
      ),
    );
  }
}
