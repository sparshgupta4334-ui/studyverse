import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../models/transaction.dart';
import '../../providers/transaction_provider.dart';
import '../../utils/formatters.dart';
import 'package:provider/provider.dart';

class TransactionListTile extends StatelessWidget {
  final TransactionModel transaction;
  final String customerId;

  const TransactionListTile({
    super.key,
    required this.transaction,
    required this.customerId,
  });

  @override
  Widget build(BuildContext context) {
    final isCredit = transaction.isCredit;

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            // Type Icon
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: isCredit ? AppColors.creditLight : AppColors.debitLight,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                isCredit ? Icons.arrow_downward_rounded : Icons.arrow_upward_rounded,
                color: isCredit ? AppColors.credit : AppColors.debit,
                size: 22,
              ),
            ),
            const SizedBox(width: 12),

            // Details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    isCredit ? 'Credit' : 'Debit',
                    style: const TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 15,
                      color: AppColors.neutral900,
                    ),
                  ),
                  if (transaction.notes != null && transaction.notes!.isNotEmpty)
                    Text(
                      transaction.notes!,
                      style: const TextStyle(fontSize: 13, color: AppColors.neutral500),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  Text(
                    AppFormatters.formatDateTime(transaction.createdAt),
                    style: const TextStyle(fontSize: 12, color: AppColors.neutral400),
                  ),
                ],
              ),
            ),

            // Amount
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  '${isCredit ? '+' : '-'}${AppFormatters.formatCurrency(transaction.amount)}',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    color: isCredit ? AppColors.credit : AppColors.debit,
                  ),
                ),
              ],
            ),

            // Delete button
            IconButton(
              icon: const Icon(Icons.delete_outline_rounded, size: 18, color: AppColors.neutral300),
              onPressed: () => _confirmDelete(context),
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints(),
            ),
          ],
        ),
      ),
    );
  }

  void _confirmDelete(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Transaction'),
        content: const Text('Are you sure you want to delete this transaction? The balance will be reversed.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(
            style: TextButton.styleFrom(foregroundColor: AppColors.error),
            onPressed: () async {
              Navigator.pop(ctx);
              await context.read<TransactionProvider>().deleteTransaction(
                transaction.transactionId,
                customerId,
              );
            },
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}
