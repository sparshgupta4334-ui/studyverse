import 'package:flutter/material.dart';
import '../../models/customer.dart';
import '../../utils/formatters.dart';
import '../../utils/helpers.dart';
import '../../config/app_config.dart';

class CustomerCard extends StatelessWidget {
  final Customer customer;
  final VoidCallback? onTap;

  const CustomerCard({super.key, required this.customer, this.onTap});

  @override
  Widget build(BuildContext context) {
    final balance = customer.balance;
    final avatarColor = AppHelpers.getAvatarColor(customer.name);

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              CircleAvatar(
                radius: 26,
                backgroundColor: avatarColor,
                child: Text(
                  AppFormatters.initials(customer.name),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      customer.name,
                      style: Theme.of(context).textTheme.titleMedium,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      AppFormatters.formatPhone(customer.phone),
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                    const SizedBox(height: 4),
                    _buildCategoryChip(context),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    AppFormatters.formatAmount(balance.abs()),
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                      color: balance > 0
                          ? AppConfig.debitColor
                          : balance < 0
                              ? AppConfig.creditColor
                              : Colors.grey,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    balance > 0
                        ? 'Due'
                        : balance < 0
                            ? 'Advance'
                            : 'Clear',
                    style: TextStyle(
                      fontSize: 11,
                      color: balance > 0
                          ? AppConfig.debitColor
                          : balance < 0
                              ? AppConfig.creditColor
                              : Colors.grey,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCategoryChip(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: AppConfig.primaryColor.withOpacity(0.1),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Text(
        customer.category,
        style: const TextStyle(
          fontSize: 11,
          color: AppConfig.primaryColor,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}
