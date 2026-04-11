import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../../config/app_theme.dart';
import '../../config/routes.dart';
import '../../models/customer_model.dart';
import '../../models/transaction_model.dart';
import '../../providers/customer_provider.dart';
import '../../providers/transaction_provider.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/transaction_tile.dart';

class CustomerDetailScreen extends StatefulWidget {
  final CustomerModel customer;

  const CustomerDetailScreen({super.key, required this.customer});

  @override
  State<CustomerDetailScreen> createState() => _CustomerDetailScreenState();
}

class _CustomerDetailScreenState extends State<CustomerDetailScreen> {
  final ScrollController _scrollController = ScrollController();
  late CustomerModel _customer;

  @override
  void initState() {
    super.initState();
    _customer = widget.customer;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context
          .read<TransactionProvider>()
          .loadTransactions(_customer.id, refresh: true);
    });
    _scrollController.addListener(_onScroll);
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      context.read<TransactionProvider>().loadTransactions(_customer.id);
    }
  }

  void _refreshCustomer() {
    final updated = context.read<CustomerProvider>().getCustomerById(_customer.id);
    if (updated != null && mounted) {
      setState(() => _customer = updated);
    }
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _addTransaction() async {
    final result = await Navigator.of(context).pushNamed(
      AppRoutes.addTransaction,
      arguments: {
        'customerId': _customer.id,
        'customerName': _customer.name,
      },
    );
    if (result == true) {
      context
          .read<TransactionProvider>()
          .loadTransactions(_customer.id, refresh: true);
      _refreshCustomer();
    }
  }

  void _showCollectPayment() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => _CollectPaymentSheet(customer: _customer),
    );
  }

  void _showSendReminder() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => _SendReminderSheet(customer: _customer),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: NestedScrollView(
        controller: _scrollController,
        headerSliverBuilder: (context, innerBoxIsScrolled) => [
          SliverAppBar(
            expandedHeight: 220,
            pinned: true,
            backgroundColor: _customer.isReceivable
                ? AppTheme.receivableGreen
                : _customer.isPayable
                    ? AppTheme.payableRed
                    : AppTheme.primaryGreen,
            foregroundColor: Colors.white,
            title: AnimatedOpacity(
              opacity: innerBoxIsScrolled ? 1 : 0,
              duration: const Duration(milliseconds: 200),
              child: Text(_customer.name),
            ),
            flexibleSpace: FlexibleSpaceBar(
              background: _buildCustomerHeader(theme),
            ),
          ),
        ],
        body: Consumer<TransactionProvider>(
          builder: (context, provider, _) {
            final transactions =
                provider.transactionsForCustomer(_customer.id);

            return Column(
              children: [
                // Action buttons
                _buildActionBar(theme),
                const Divider(height: 1),

                // Transaction list
                Expanded(
                  child: RefreshIndicator(
                    color: AppTheme.primaryGreen,
                    onRefresh: () => provider.loadTransactions(
                      _customer.id,
                      refresh: true,
                    ),
                    child: transactions.isEmpty &&
                            provider.status == TransactionLoadStatus.loading
                        ? const Center(child: LoadingWidget())
                        : transactions.isEmpty
                            ? _buildEmptyTransactions()
                            : ListView.separated(
                                padding: const EdgeInsets.only(bottom: 80),
                                itemCount: transactions.length +
                                    (provider.isLoading ? 1 : 0),
                                separatorBuilder: (_, __) =>
                                    const Divider(height: 1, indent: 72),
                                itemBuilder: (context, index) {
                                  if (index == transactions.length) {
                                    return const Padding(
                                      padding: EdgeInsets.all(16),
                                      child: Center(child: LoadingWidget()),
                                    );
                                  }
                                  return TransactionTile(
                                    transaction: transactions[index],
                                    onDelete: () async {
                                      final confirm = await _confirmDelete();
                                      if (confirm == true) {
                                        await provider.deleteTransaction(
                                          transactions[index].id,
                                          _customer.id,
                                        );
                                        context
                                            .read<CustomerProvider>()
                                            .updateCustomerBalance(
                                              _customer.id,
                                              -transactions[index].signedAmount,
                                            );
                                        _refreshCustomer();
                                      }
                                    },
                                  );
                                },
                              ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _addTransaction,
        icon: const Icon(Icons.add_rounded),
        label: const Text('Add Entry'),
        backgroundColor: AppTheme.accentOrange,
        foregroundColor: Colors.white,
      ),
    );
  }

  Widget _buildCustomerHeader(ThemeData theme) {
    final color = _customer.isReceivable
        ? AppTheme.receivableGreen
        : _customer.isPayable
            ? AppTheme.payableRed
            : AppTheme.primaryGreen;

    return Container(
      color: color,
      padding: const EdgeInsets.fromLTRB(24, 80, 24, 20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 30,
                backgroundColor: Colors.white.withOpacity(0.2),
                child: Text(
                  _customer.name.substring(0, 1).toUpperCase(),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 26,
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
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      _customer.phone,
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.8),
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _customer.isReceivable
                        ? 'Will Give You'
                        : _customer.isPayable
                            ? 'You Will Give'
                            : 'Settled',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.8),
                      fontSize: 13,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '₹${NumberFormat('#,##,###.##').format(_customer.absoluteBalance)}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 26,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              if (_customer.lastTransactionDate != null)
                Text(
                  'Last: ${DateFormat('dd MMM').format(_customer.lastTransactionDate!)}',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.7),
                    fontSize: 13,
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildActionBar(ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          Expanded(
            child: OutlinedButton.icon(
              onPressed: _showCollectPayment,
              icon: const Icon(Icons.payment_rounded, size: 18),
              label: const Text('Collect'),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppTheme.receivableGreen,
                side: const BorderSide(color: AppTheme.receivableGreen),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: OutlinedButton.icon(
              onPressed: _showSendReminder,
              icon: const Icon(Icons.sms_outlined, size: 18),
              label: const Text('Remind'),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppTheme.accentOrange,
                side: const BorderSide(color: AppTheme.accentOrange),
              ),
            ),
          ),
          const SizedBox(width: 8),
          IconButton(
            icon: const Icon(Icons.more_vert_rounded),
            onPressed: _showMoreOptions,
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyTransactions() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.receipt_long_outlined,
            size: 72,
            color: Theme.of(context).colorScheme.onSurface.withOpacity(0.2),
          ),
          const SizedBox(height: 16),
          Text(
            'No transactions yet',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: Theme.of(context)
                      .colorScheme
                      .onSurface
                      .withOpacity(0.4),
                ),
          ),
          const SizedBox(height: 8),
          Text(
            'Add a credit or debit entry to get started',
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Theme.of(context)
                      .colorScheme
                      .onSurface
                      .withOpacity(0.3),
                ),
          ),
        ],
      ),
    );
  }

  void _showMoreOptions() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const SizedBox(height: 8),
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 12),
          ListTile(
            leading: const Icon(Icons.share_outlined),
            title: const Text('Share Statement'),
            onTap: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Statement sharing coming soon'),
                  behavior: SnackBarBehavior.floating,
                ),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.edit_outlined),
            title: const Text('Edit Customer'),
            onTap: () {
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: const Icon(Icons.delete_outline, color: AppTheme.payableRed),
            title: const Text('Delete Customer',
                style: TextStyle(color: AppTheme.payableRed)),
            onTap: () async {
              Navigator.pop(context);
              final confirm = await _confirmDelete(
                  message: 'Delete ${_customer.name} and all their transactions?');
              if (confirm == true) {
                context
                    .read<CustomerProvider>()
                    .deleteCustomer(_customer.id);
                if (mounted) Navigator.of(context).pop();
              }
            },
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  Future<bool?> _confirmDelete({String? message}) {
    return showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Confirm Delete'),
        content:
            Text(message ?? 'Delete this transaction? This cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            style:
                TextButton.styleFrom(foregroundColor: AppTheme.payableRed),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}

// ── Collect Payment Sheet ─────────────────────────────────────────────────────

class _CollectPaymentSheet extends StatelessWidget {
  final CustomerModel customer;

  const _CollectPaymentSheet({required this.customer});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 20),
          Text('Collect Payment',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  )),
          const SizedBox(height: 8),
          Text(
            'Request ₹${NumberFormat('#,##,###').format(customer.absoluteBalance)} from ${customer.name}',
            style: Theme.of(context).textTheme.bodyMedium,
          ),
          const SizedBox(height: 24),
          _PaymentOptionTile(
            icon: Icons.account_balance_wallet_rounded,
            label: 'UPI Payment',
            subtitle: 'Send UPI link to ${customer.phone}',
            color: AppTheme.primaryGreen,
            onTap: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('UPI payment feature coming soon'),
                  behavior: SnackBarBehavior.floating,
                ),
              );
            },
          ),
          _PaymentOptionTile(
            icon: Icons.qr_code_rounded,
            label: 'Show QR Code',
            subtitle: 'Customer can scan to pay',
            color: const Color(0xFF1976D2),
            onTap: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('QR code feature coming soon'),
                  behavior: SnackBarBehavior.floating,
                ),
              );
            },
          ),
          const SizedBox(height: 8),
        ],
      ),
    );
  }
}

class _PaymentOptionTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  const _PaymentOptionTile({
    required this.icon,
    required this.label,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: color.withOpacity(0.1),
          child: Icon(icon, color: color),
        ),
        title: Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16),
        onTap: onTap,
      ),
    );
  }
}

// ── Send Reminder Sheet ───────────────────────────────────────────────────────

class _SendReminderSheet extends StatelessWidget {
  final CustomerModel customer;

  const _SendReminderSheet({required this.customer});

  @override
  Widget build(BuildContext context) {
    final amount = NumberFormat('#,##,###').format(customer.absoluteBalance);

    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 20),
          Text('Send Reminder',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  )),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.accentOrange.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                  color: AppTheme.accentOrange.withOpacity(0.3)),
            ),
            child: Text(
              'Hi ${customer.name}, you have a pending due of ₹$amount. Please settle at your earliest. - KhataBook Pro',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content:
                        Text('SMS reminder sent to ${customer.phone}'),
                    backgroundColor: AppTheme.accentOrange,
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              },
              icon: const Icon(Icons.sms_outlined),
              label: const Text('Send SMS'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.accentOrange,
              ),
            ),
          ),
          const SizedBox(height: 8),
        ],
      ),
    );
  }
}
