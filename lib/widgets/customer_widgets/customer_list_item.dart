import 'package:flutter/material.dart';
import '../../models/customer.dart';
import '../../utils/formatters.dart';
import '../../utils/helpers.dart';
import '../../config/app_config.dart';

class CustomerListItem extends StatelessWidget {
  final Customer customer;
  final VoidCallback? onTap;
  final VoidCallback? onLongPress;

  const CustomerListItem({
    super.key,
    required this.customer,
    this.onTap,
    this.onLongPress,
  });

  @override
  Widget build(BuildContext context) {
    final balance = customer.balance;
    final avatarColor = AppHelpers.getAvatarColor(customer.name);

    return ListTile(
      onTap: onTap,
      onLongPress: onLongPress,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      leading: CircleAvatar(
        backgroundColor: avatarColor,
        child: Text(
          AppFormatters.initials(customer.name),
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      title: Text(customer.name, style: Theme.of(context).textTheme.titleSmall),
      subtitle: Text(
        AppFormatters.formatPhone(customer.phone),
        style: Theme.of(context).textTheme.bodySmall,
      ),
      trailing: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Text(
            AppFormatters.formatAmount(balance.abs()),
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 13,
              color: balance > 0
                  ? AppConfig.debitColor
                  : balance < 0
                      ? AppConfig.creditColor
                      : Colors.grey,
            ),
          ),
          Text(
            balance > 0 ? 'Due' : balance < 0 ? 'Advance' : 'Clear',
            style: TextStyle(
              fontSize: 10,
              color: balance > 0
                  ? AppConfig.debitColor
                  : balance < 0
                      ? AppConfig.creditColor
                      : Colors.grey,
            ),
          ),
        ],
      ),
    );
  }
}
