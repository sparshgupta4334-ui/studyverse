import 'package:flutter/material.dart';
import '../../models/transaction.dart';
import '../../utils/formatters.dart';
import '../../config/app_config.dart';

class TransactionListItem extends StatelessWidget {
  final Transaction transaction;
  final VoidCallback? onTap;
  final bool showCustomerName;

  const TransactionListItem({
    super.key,
    required this.transaction,
    this.onTap,
    this.showCustomerName = false,
  });

  @override
  Widget build(BuildContext context) {
    final isCredit = transaction.isCredit;
    return ListTile(
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 2),
      leading: CircleAvatar(
        backgroundColor:
            (isCredit ? AppConfig.creditColor : AppConfig.debitColor)
                .withOpacity(0.12),
        child: Icon(
          isCredit ? Icons.arrow_downward : Icons.arrow_upward,
          color: isCredit ? AppConfig.creditColor : AppConfig.debitColor,
          size: 18,
        ),
      ),
      title: Text(
        showCustomerName
            ? (transaction.customerName ?? transaction.category)
            : transaction.category,
        style: Theme.of(context).textTheme.titleSmall,
      ),
      subtitle: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            AppFormatters.formatDateFull(transaction.date),
            style: Theme.of(context).textTheme.bodySmall,
          ),
          if (transaction.notes != null && transaction.notes!.isNotEmpty)
            Text(
              transaction.notes!,
              style: Theme.of(context)
                  .textTheme
                  .bodySmall
                  ?.copyWith(color: Colors.grey),
              overflow: TextOverflow.ellipsis,
            ),
        ],
      ),
      trailing: Text(
        '${isCredit ? '-' : '+'} ${AppFormatters.formatAmount(transaction.amount)}',
        style: TextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 14,
          color: isCredit ? AppConfig.creditColor : AppConfig.debitColor,
        ),
      ),
    );
  }
}
