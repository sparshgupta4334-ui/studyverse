import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../config/app_theme.dart';
import '../models/transaction_model.dart';

class TransactionTile extends StatelessWidget {
  final TransactionModel transaction;
  final VoidCallback? onDelete;

  const TransactionTile({
    super.key,
    required this.transaction,
    this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isCredit = transaction.isCredit;
    final color = isCredit ? AppTheme.receivableGreen : AppTheme.payableRed;
    final amountStr =
        '${isCredit ? '+' : '-'} ₹${NumberFormat('#,##,###.##').format(transaction.amount)}';

    return Dismissible(
      key: Key(transaction.id),
      direction: DismissDirection.endToStart,
      confirmDismiss: onDelete != null ? (_) async => true : null,
      onDismissed: onDelete != null ? (_) => onDelete!() : null,
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        color: AppTheme.payableRed.withOpacity(0.1),
        child: const Icon(Icons.delete_outline, color: AppTheme.payableRed),
      ),
      child: ListTile(
        leading: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(
            isCredit
                ? Icons.arrow_downward_rounded
                : Icons.arrow_upward_rounded,
            color: color,
            size: 22,
          ),
        ),
        title: Row(
          children: [
            Expanded(
              child: Text(
                transaction.notes?.isNotEmpty == true
                    ? transaction.notes!
                    : (isCredit ? 'Credit (Got)' : 'Debit (Gave)'),
                style: theme.textTheme.titleSmall?.copyWith(
                  fontWeight: FontWeight.w500,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            Text(
              amountStr,
              style: theme.textTheme.titleMedium?.copyWith(
                color: color,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        subtitle: Row(
          children: [
            Text(
              DateFormat('dd MMM yyyy, hh:mm a').format(transaction.date),
              style: theme.textTheme.bodySmall,
            ),
            const Spacer(),
            if (!transaction.isSynced)
              Tooltip(
                message: 'Pending sync',
                child: Icon(
                  Icons.cloud_off_outlined,
                  size: 14,
                  color: theme.colorScheme.onSurface.withOpacity(0.3),
                ),
              ),
          ],
        ),
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      ),
    );
  }
}
