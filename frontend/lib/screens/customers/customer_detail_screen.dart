import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../models/customer.dart';
import '../../providers/customer_provider.dart';
import '../../providers/transaction_provider.dart';
import '../../utils/formatters.dart';
import '../../widgets/common/transaction_list_tile.dart';
import 'add_transaction_screen.dart';
import '../customers/add_customer_screen.dart';

class CustomerDetailScreen extends StatefulWidget {
  final CustomerModel customer;

  const CustomerDetailScreen({super.key, required this.customer});

  @override
  State<CustomerDetailScreen> createState() => _CustomerDetailScreenState();
}

class _CustomerDetailScreenState extends State<CustomerDetailScreen> {
  late CustomerModel _customer;

  @override
  void initState() {
    super.initState();
    _customer = widget.customer;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<TransactionProvider>().loadTransactions(
        _customer.customerId,
        refresh: true,
      );
    });
  }

  Future<void> _deleteCustomer() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Customer'),
        content: Text(
          'Are you sure you want to delete ${_customer.name}? This action cannot be undone.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            style: TextButton.styleFrom(foregroundColor: AppColors.error),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirm == true && mounted) {
      final success = await context.read<CustomerProvider>().deleteCustomer(_customer.customerId);
      if (success && mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Customer deleted'), backgroundColor: AppColors.error),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final txnProvider = context.watch<TransactionProvider>();
    final transactions = txnProvider.getTransactionsForCustomer(_customer.customerId);

    return Scaffold(
      backgroundColor: AppColors.neutral100,
      body: CustomScrollView(
        slivers: [
          // Customer Header
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            backgroundColor: _customer.isReceivable ? AppColors.credit : AppColors.debit,
            actions: [
              IconButton(
                icon: const Icon(Icons.edit_rounded, color: Colors.white),
                onPressed: () async {
                  final updated = await Navigator.push<CustomerModel>(
                    context,
                    MaterialPageRoute(
                      builder: (_) => AddCustomerScreen(customer: _customer),
                    ),
                  );
                  if (updated != null) setState(() => _customer = updated);
                },
              ),
              PopupMenuButton<String>(
                icon: const Icon(Icons.more_vert_rounded, color: Colors.white),
                onSelected: (value) {
                  if (value == 'delete') _deleteCustomer();
                },
                itemBuilder: (ctx) => [
                  const PopupMenuItem(
                    value: 'delete',
                    child: Row(
                      children: [
                        Icon(Icons.delete_outline_rounded, color: AppColors.error),
                        SizedBox(width: 8),
                        Text('Delete Customer', style: TextStyle(color: AppColors.error)),
                      ],
                    ),
                  ),
                ],
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                color: _customer.isReceivable ? AppColors.credit : AppColors.debit,
                padding: const EdgeInsets.fromLTRB(20, 100, 20, 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Row(
                      children: [
                        CircleAvatar(
                          radius: 28,
                          backgroundColor: Colors.white.withAlpha(51),
                          child: Text(
                            _customer.initials,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _customer.name,
                                style: const TextStyle(
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                              Text(
                                '+91 ${_customer.phone}',
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.white.withAlpha(204),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      decoration: BoxDecoration(
                        color: Colors.white.withAlpha(26),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          Text(
                            _customer.isReceivable ? 'You will receive' : 
                            _customer.isPayable ? 'You will pay' : 'Settled up',
                            style: TextStyle(
                              fontSize: 13,
                              color: Colors.white.withAlpha(204),
                            ),
                          ),
                          const Spacer(),
                          Text(
                            AppFormatters.formatCurrency(_customer.balance.abs()),
                            style: const TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Action Buttons
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Expanded(
                    child: _ActionButton(
                      icon: Icons.arrow_downward_rounded,
                      label: 'Credit',
                      color: AppColors.credit,
                      onTap: () => _addTransaction('credit'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _ActionButton(
                      icon: Icons.arrow_upward_rounded,
                      label: 'Debit',
                      color: AppColors.debit,
                      onTap: () => _addTransaction('debit'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _ActionButton(
                      icon: Icons.payment_rounded,
                      label: 'Payment',
                      color: AppColors.primary,
                      onTap: () {
                        // Navigate to payment screen
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Transactions Header
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
              child: Text(
                'Transaction History',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: AppColors.neutral900,
                ),
              ),
            ),
          ),

          // Transactions List
          if (txnProvider.isLoading && transactions.isEmpty)
            const SliverToBoxAdapter(
              child: Center(
                child: Padding(padding: EdgeInsets.all(32), child: CircularProgressIndicator()),
              ),
            )
          else if (transactions.isEmpty)
            SliverToBoxAdapter(
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.all(40),
                  child: Column(
                    children: [
                      Icon(Icons.receipt_long_outlined, size: 60, color: AppColors.neutral300),
                      const SizedBox(height: 16),
                      Text(
                        'No transactions yet',
                        style: TextStyle(fontSize: 16, color: AppColors.neutral500),
                      ),
                    ],
                  ),
                ),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) => TransactionListTile(
                    transaction: transactions[index],
                    customerId: _customer.customerId,
                  ),
                  childCount: transactions.length,
                ),
              ),
            ),

          const SliverPadding(padding: EdgeInsets.only(bottom: 80)),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _addTransaction('credit'),
        icon: const Icon(Icons.add_rounded),
        label: const Text('Add Entry'),
      ),
    );
  }

  void _addTransaction(String type) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => AddTransactionScreen(customer: _customer, initialType: type),
      ),
    );

    if (result == true && mounted) {
      // Reload transactions and update customer balance
      await context.read<TransactionProvider>().loadTransactions(
        _customer.customerId,
        refresh: true,
      );
      // Refresh customer data
      final updatedCustomer = await context.read<CustomerProvider>().getAll().then(
        (result) => null,
      );
    }
  }
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _ActionButton({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: color.withAlpha(26),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withAlpha(77)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                color: color,
                fontSize: 13,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
