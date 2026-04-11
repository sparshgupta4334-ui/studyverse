import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/customer_provider.dart';
import '../../providers/transaction_provider.dart';
import '../../config/app_config.dart';
import '../../config/constants.dart';
import '../../utils/formatters.dart';
import '../../models/customer.dart';
import '../../models/transaction.dart';
import '../../widgets/common/loading_widget.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _loadData());
  }

  Future<void> _loadData() async {
    await Future.wait([
      context.read<CustomerProvider>().loadCustomers(),
      context.read<TransactionProvider>().loadDashboardSummary(),
      context.read<TransactionProvider>()
          .loadAllTransactions(limit: 5),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    final customerProv = context.watch<CustomerProvider>();
    final txProv = context.watch<TransactionProvider>();
    final summary = txProv.dashboardSummary;

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text(
              AppConfig.appName,
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            Text(
              'Digital Khata',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.normal),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () =>
                Navigator.pushNamed(context, AppConstants.routeReminders),
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadData,
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () =>
            Navigator.pushNamed(context, AppConstants.routeAddTransaction),
        child: const Icon(Icons.add),
        tooltip: 'Add Transaction',
      ),
      body: customerProv.isLoading
          ? const LoadingWidget(message: 'Loading dashboard...')
          : RefreshIndicator(
              onRefresh: _loadData,
              child: ListView(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
                children: [
                  _buildSummaryCards(summary),
                  const SizedBox(height: 20),
                  _buildQuickActions(),
                  const SizedBox(height: 20),
                  _buildTopDebtors(customerProv.customers),
                  const SizedBox(height: 20),
                  _buildRecentTransactions(txProv.transactions),
                ],
              ),
            ),
    );
  }

  Widget _buildSummaryCards(Map<String, dynamic> summary) {
    final totalOutstanding =
        (summary['total_outstanding'] as num?)?.toDouble() ?? 0.0;
    final customerCount = (summary['customer_count'] as num?)?.toInt() ?? 0;
    final todayDebit =
        (summary['today_debit'] as num?)?.toDouble() ?? 0.0;
    final monthDebit =
        (summary['month_debit'] as num?)?.toDouble() ?? 0.0;

    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _SummaryCard(
                title: 'Total Outstanding',
                value: AppFormatters.formatAmount(totalOutstanding),
                icon: Icons.account_balance_wallet,
                color: AppConfig.debitColor,
                subtitle: '$customerCount customers',
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _SummaryCard(
                title: "Today's Sale",
                value: AppFormatters.formatAmount(todayDebit),
                icon: Icons.today,
                color: AppConfig.primaryColor,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _SummaryCard(
                title: 'This Month',
                value: AppFormatters.formatAmount(monthDebit),
                icon: Icons.calendar_month,
                color: AppConfig.accentColor,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _SummaryCard(
                title: 'Customers',
                value: customerCount.toString(),
                icon: Icons.people,
                color: AppConfig.successColor,
                subtitle: 'Total',
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildQuickActions() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Quick Actions',
                style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _QuickAction(
                  icon: Icons.person_add,
                  label: 'Add Customer',
                  color: AppConfig.primaryColor,
                  onTap: () =>
                      Navigator.pushNamed(context, AppConstants.routeAddCustomer)
                          .then((_) => _loadData()),
                ),
                _QuickAction(
                  icon: Icons.add_circle,
                  label: 'Credit',
                  color: AppConfig.creditColor,
                  onTap: () => Navigator.pushNamed(
                      context, AppConstants.routeAddTransaction,
                      arguments: {'type': 'credit'}).then((_) => _loadData()),
                ),
                _QuickAction(
                  icon: Icons.remove_circle,
                  label: 'Debit',
                  color: AppConfig.debitColor,
                  onTap: () => Navigator.pushNamed(
                      context, AppConstants.routeAddTransaction,
                      arguments: {'type': 'debit'}).then((_) => _loadData()),
                ),
                _QuickAction(
                  icon: Icons.payment,
                  label: 'Payment',
                  color: AppConfig.accentColor,
                  onTap: () =>
                      Navigator.pushNamed(context, AppConstants.routePayment),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopDebtors(List<Customer> customers) {
    final debtors = customers
        .where((c) => c.balance > 0)
        .toList()
      ..sort((a, b) => b.balance.compareTo(a.balance));
    final top = debtors.take(5).toList();

    if (top.isEmpty) {
      return const SizedBox.shrink();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Top Outstanding',
                style: Theme.of(context).textTheme.titleMedium),
            TextButton(
              onPressed: () =>
                  Navigator.pushNamed(context, AppConstants.routeCustomersList),
              child: const Text('See All'),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Card(
          child: ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: top.length,
            separatorBuilder: (_, __) => const Divider(height: 1),
            itemBuilder: (ctx, i) {
              final c = top[i];
              return ListTile(
                leading: CircleAvatar(
                  backgroundColor:
                      AppConfig.debitColor.withOpacity(0.15),
                  child: Text(
                    AppFormatters.initials(c.name),
                    style: const TextStyle(
                        color: AppConfig.debitColor,
                        fontWeight: FontWeight.bold),
                  ),
                ),
                title: Text(c.name,
                    style: Theme.of(context).textTheme.titleSmall),
                subtitle: Text(c.phone),
                trailing: Text(
                  AppFormatters.formatAmount(c.balance),
                  style: const TextStyle(
                      color: AppConfig.debitColor,
                      fontWeight: FontWeight.bold),
                ),
                onTap: () => Navigator.pushNamed(
                    context, AppConstants.routeCustomerDetail,
                    arguments: c.id).then((_) => _loadData()),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildRecentTransactions(List<Transaction> transactions) {
    if (transactions.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Recent Transactions',
                style: Theme.of(context).textTheme.titleMedium),
            TextButton(
              onPressed: () =>
                  Navigator.pushNamed(context, AppConstants.routeLedger),
              child: const Text('See All'),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Card(
          child: ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: transactions.take(5).length,
            separatorBuilder: (_, __) => const Divider(height: 1),
            itemBuilder: (ctx, i) {
              final tx = transactions[i];
              final isDebit = tx.isDebit;
              return ListTile(
                leading: CircleAvatar(
                  backgroundColor:
                      (isDebit ? AppConfig.debitColor : AppConfig.creditColor)
                          .withOpacity(0.1),
                  child: Icon(
                    isDebit ? Icons.arrow_upward : Icons.arrow_downward,
                    color: isDebit ? AppConfig.debitColor : AppConfig.creditColor,
                    size: 18,
                  ),
                ),
                title: Text(tx.customerName ?? tx.category,
                    style: Theme.of(context).textTheme.titleSmall),
                subtitle: Text(AppFormatters.formatDate(tx.date)),
                trailing: Text(
                  '${isDebit ? '+' : '-'} ${AppFormatters.formatAmount(tx.amount)}',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: isDebit ? AppConfig.debitColor : AppConfig.creditColor,
                  ),
                ),
                onTap: () => Navigator.pushNamed(
                    context, AppConstants.routeTransactionDetail,
                    arguments: tx),
              );
            },
          ),
        ),
      ],
    );
  }
}

class _SummaryCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;
  final String? subtitle;

  const _SummaryCard({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
    this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.12),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, color: color, size: 18),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(value,
                style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: color)),
            const SizedBox(height: 4),
            Text(title,
                style: Theme.of(context).textTheme.bodySmall,
                overflow: TextOverflow.ellipsis),
            if (subtitle != null)
              Text(subtitle!,
                  style: Theme.of(context)
                      .textTheme
                      .labelSmall
                      ?.copyWith(color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}

class _QuickAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _QuickAction({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: color.withOpacity(0.12),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            style:
                const TextStyle(fontSize: 11, fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }
}
