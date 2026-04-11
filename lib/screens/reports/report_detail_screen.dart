import 'package:flutter/material.dart';
import '../../utils/formatters.dart';
import '../../config/app_config.dart';
import '../../models/transaction.dart';
import '../../widgets/transaction_widgets/transaction_list_item.dart';

class ReportDetailScreen extends StatelessWidget {
  final String title;
  final List<Transaction> transactions;
  final Map<String, dynamic> summary;

  const ReportDetailScreen({
    super.key,
    required this.title,
    required this.transactions,
    required this.summary,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildSummary(context),
          const SizedBox(height: 16),
          Text('Transactions (${transactions.length})',
              style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          Card(
            child: transactions.isEmpty
                ? const Padding(
                    padding: EdgeInsets.all(32),
                    child: Center(child: Text('No transactions')),
                  )
                : ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: transactions.length,
                    separatorBuilder: (_, __) =>
                        const Divider(height: 1),
                    itemBuilder: (ctx, i) => TransactionListItem(
                      transaction: transactions[i],
                      showCustomerName: true,
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildSummary(BuildContext context) {
    final totalDebit = (summary['total_debit'] as num?)?.toDouble() ?? 0.0;
    final totalCredit = (summary['total_credit'] as num?)?.toDouble() ?? 0.0;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Expanded(
              child: _Item(
                label: 'Total Sales',
                value: AppFormatters.formatAmount(totalDebit),
                color: AppConfig.debitColor,
              ),
            ),
            const VerticalDivider(),
            Expanded(
              child: _Item(
                label: 'Total Payments',
                value: AppFormatters.formatAmount(totalCredit),
                color: AppConfig.creditColor,
              ),
            ),
            const VerticalDivider(),
            Expanded(
              child: _Item(
                label: 'Net',
                value: AppFormatters.formatAmount(
                    (totalDebit - totalCredit).abs()),
                color: AppConfig.primaryColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Item extends StatelessWidget {
  final String label;
  final String value;
  final Color color;

  const _Item(
      {required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(value,
            style: TextStyle(
                fontWeight: FontWeight.bold, color: color, fontSize: 14)),
        const SizedBox(height: 4),
        Text(label,
            style: const TextStyle(color: Colors.grey, fontSize: 11),
            textAlign: TextAlign.center),
      ],
    );
  }
}
