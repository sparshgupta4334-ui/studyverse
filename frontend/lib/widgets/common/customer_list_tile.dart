import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../models/customer.dart';
import '../../utils/formatters.dart';
import '../../screens/customers/customer_detail_screen.dart';

class CustomerListTile extends StatelessWidget {
  final CustomerModel customer;

  const CustomerListTile({super.key, required this.customer});

  @override
  Widget build(BuildContext context) {
    final isReceivable = customer.isReceivable;
    final isPayable = customer.isPayable;

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () => Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => CustomerDetailScreen(customer: customer),
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              // Avatar
              CircleAvatar(
                radius: 24,
                backgroundColor: AppColors.primaryContainer,
                child: Text(
                  customer.initials,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                    fontSize: 16,
                  ),
                ),
              ),
              const SizedBox(width: 12),

              // Name & Phone
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      customer.name,
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 16,
                        color: AppColors.neutral900,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '+91 ${customer.phone}',
                      style: const TextStyle(
                        fontSize: 13,
                        color: AppColors.neutral500,
                      ),
                    ),
                    if (customer.lastTransactionDate != null)
                      Text(
                        AppFormatters.formatRelativeDate(customer.lastTransactionDate!),
                        style: const TextStyle(
                          fontSize: 11,
                          color: AppColors.neutral400,
                        ),
                      ),
                  ],
                ),
              ),

              // Balance
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    AppFormatters.formatCurrency(customer.balance.abs()),
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: isReceivable
                          ? AppColors.credit
                          : isPayable
                              ? AppColors.debit
                              : AppColors.neutral500,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: isReceivable
                          ? AppColors.creditLight
                          : isPayable
                              ? AppColors.debitLight
                              : AppColors.neutral100,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      isReceivable
                          ? 'Receive'
                          : isPayable
                              ? 'Pay'
                              : 'Settled',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: isReceivable
                            ? AppColors.credit
                            : isPayable
                                ? AppColors.debit
                                : AppColors.neutral500,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(width: 4),
              const Icon(
                Icons.chevron_right_rounded,
                color: AppColors.neutral300,
                size: 20,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
