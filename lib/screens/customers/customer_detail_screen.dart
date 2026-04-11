import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/customer_provider.dart';
import '../../providers/transaction_provider.dart';
import '../../models/customer.dart';
import '../../config/app_config.dart';
import '../../config/constants.dart';
import '../../utils/formatters.dart';
import '../../utils/helpers.dart';
import '../../widgets/common/loading_widget.dart';
import '../../widgets/transaction_widgets/transaction_list_item.dart';
import '../../services/reminder_service.dart';

class CustomerDetailScreen extends StatefulWidget {
  final String customerId;
  const CustomerDetailScreen({super.key, required this.customerId});

  @override
  State<CustomerDetailScreen> createState() => _CustomerDetailScreenState();
}

class _CustomerDetailScreenState extends State<CustomerDetailScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  Customer? _customer;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) => _loadData());
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    final customer =
        await context.read<CustomerProvider>().getCustomer(widget.customerId);
    await context
        .read<TransactionProvider>()
        .loadCustomerTransactions(widget.customerId);
    if (mounted) setState(() {
      _customer = customer;
      _isLoading = false;
    });
  }

  Future<void> _deleteCustomer() async {
    final confirm = await AppHelpers.showConfirmDialog(
      context,
      title: 'Delete Customer',
      message:
          'Are you sure you want to delete ${_customer?.name}? This will also delete all their transactions.',
      confirmText: 'Delete',
      isDestructive: true,
    );
    if (confirm == true && mounted) {
      await context.read<CustomerProvider>().deleteCustomer(widget.customerId);
      Navigator.pop(context);
      AppHelpers.showSnackBar(context, 'Customer deleted', isSuccess: true);
    }
  }

  @override
  Widget build(BuildContext context) {
    final txProv = context.watch<TransactionProvider>();

    if (_isLoading) return const Scaffold(body: LoadingWidget());
    if (_customer == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Customer')),
        body: const Center(child: Text('Customer not found')),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(_customer!.name),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () => Navigator.pushNamed(
                context, AppConstants.routeAddCustomer,
                arguments: _customer).then((_) => _loadData()),
          ),
          PopupMenuButton(
            itemBuilder: (_) => [
              const PopupMenuItem(value: 'delete', child: Text('Delete')),
            ],
            onSelected: (v) {
              if (v == 'delete') _deleteCustomer();
            },
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          indicatorColor: Colors.white,
          tabs: const [
            Tab(text: 'Overview'),
            Tab(text: 'Transactions'),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => Navigator.pushNamed(
            context, AppConstants.routeAddTransaction,
            arguments: {'customerId': _customer!.id}).then((_) => _loadData()),
        icon: const Icon(Icons.add),
        label: const Text('Add Transaction'),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildOverview(txProv),
          _buildTransactions(txProv),
        ],
      ),
    );
  }

  Widget _buildOverview(TransactionProvider txProv) {
    final c = _customer!;
    final txList = txProv.customerTransactions;
    final totalDebit =
        txList.where((t) => t.isDebit).fold(0.0, (s, t) => s + t.amount);
    final totalCredit =
        txList.where((t) => t.isCredit).fold(0.0, (s, t) => s + t.amount);

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _buildProfileCard(c),
        const SizedBox(height: 16),
        _buildBalanceCard(c),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: _StatCard(
                label: 'Total Debit',
                value: AppFormatters.formatAmount(totalDebit),
                color: AppConfig.debitColor,
                icon: Icons.arrow_upward,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _StatCard(
                label: 'Total Credit',
                value: AppFormatters.formatAmount(totalCredit),
                color: AppConfig.creditColor,
                icon: Icons.arrow_downward,
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        _buildActions(c),
      ],
    );
  }

  Widget _buildProfileCard(Customer c) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            CircleAvatar(
              radius: 32,
              backgroundColor: AppHelpers.getAvatarColor(c.name),
              child: Text(
                AppFormatters.initials(c.name),
                style: const TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(c.name,
                      style: Theme.of(context).textTheme.titleLarge),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.phone, size: 14, color: Colors.grey),
                      const SizedBox(width: 4),
                      Text(c.phone,
                          style: Theme.of(context).textTheme.bodyMedium),
                    ],
                  ),
                  if (c.email != null) ...[
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        const Icon(Icons.email, size: 14, color: Colors.grey),
                        const SizedBox(width: 4),
                        Text(c.email!,
                            style: Theme.of(context).textTheme.bodySmall),
                      ],
                    ),
                  ],
                  if (c.address != null) ...[
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        const Icon(Icons.location_on,
                            size: 14, color: Colors.grey),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(c.address!,
                              style: Theme.of(context).textTheme.bodySmall,
                              overflow: TextOverflow.ellipsis),
                        ),
                      ],
                    ),
                  ],
                  const SizedBox(height: 4),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: AppConfig.primaryColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(c.category,
                        style: const TextStyle(
                            color: AppConfig.primaryColor, fontSize: 11)),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBalanceCard(Customer c) {
    final balance = c.balance;
    final isOwed = balance > 0;
    final color = isOwed ? AppConfig.debitColor : AppConfig.creditColor;

    return Card(
      color: color.withOpacity(0.08),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Text(
              isOwed ? 'Outstanding Amount' : balance < 0 ? 'Advance Paid' : 'Balance Cleared',
              style: TextStyle(color: color, fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 8),
            Text(
              AppFormatters.formatAmount(balance.abs()),
              style: TextStyle(
                  fontSize: 32, fontWeight: FontWeight.bold, color: color),
            ),
            const SizedBox(height: 4),
            Text(
              'Last updated: ${AppFormatters.formatDate(c.updatedAt)}',
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActions(Customer c) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Actions', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                OutlinedButton.icon(
                  icon: const Icon(Icons.payment, size: 16),
                  label: const Text('Collect Payment'),
                  onPressed: () => Navigator.pushNamed(
                      context, AppConstants.routePayment,
                      arguments: c),
                ),
                OutlinedButton.icon(
                  icon: const Icon(Icons.message, size: 16),
                  label: const Text('WhatsApp'),
                  onPressed: () => ReminderService().sendWhatsAppReminder(
                    phone: c.phone,
                    customerName: c.name,
                    amount: c.balance,
                  ),
                ),
                OutlinedButton.icon(
                  icon: const Icon(Icons.sms, size: 16),
                  label: const Text('Send SMS'),
                  onPressed: () => ReminderService().sendSmsReminder(
                    phone: c.phone,
                    customerName: c.name,
                    amount: c.balance,
                  ),
                ),
                OutlinedButton.icon(
                  icon: const Icon(Icons.call, size: 16),
                  label: const Text('Call'),
                  onPressed: () => ReminderService().callCustomer(c.phone),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTransactions(TransactionProvider txProv) {
    if (txProv.isLoading) return const LoadingWidget();
    final txList = txProv.customerTransactions;

    if (txList.isEmpty) {
      return const EmptyStateWidget(
        message: 'No transactions yet',
        subMessage: 'Add a transaction to get started',
        icon: Icons.receipt_long_outlined,
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.symmetric(vertical: 8),
      itemCount: txList.length,
      itemBuilder: (ctx, i) => TransactionListItem(
        transaction: txList[i],
        onTap: () => Navigator.pushNamed(
            context, AppConstants.routeTransactionDetail,
            arguments: txList[i]),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final Color color;
  final IconData icon;

  const _StatCard({
    required this.label,
    required this.value,
    required this.color,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Icon(icon, color: color, size: 20),
            const SizedBox(width: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label,
                    style: Theme.of(context)
                        .textTheme
                        .bodySmall
                        ?.copyWith(color: Colors.grey)),
                Text(value,
                    style: TextStyle(
                        color: color,
                        fontWeight: FontWeight.bold,
                        fontSize: 14)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
