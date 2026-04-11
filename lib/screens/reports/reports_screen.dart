import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/customer_provider.dart';
import '../../providers/transaction_provider.dart';
import '../../config/app_config.dart';
import '../../config/constants.dart';
import '../../utils/formatters.dart';
import '../../services/database_service.dart';
import '../../widgets/common/loading_widget.dart';

class ReportsScreen extends StatefulWidget {
  const ReportsScreen({super.key});

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  String _period = AppConstants.reportMonthly;
  DateTime _startDate = DateTime.now().subtract(const Duration(days: 30));
  DateTime _endDate = DateTime.now();
  bool _isLoading = false;
  Map<String, dynamic> _reportData = {};

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _generateReport());
  }

  Future<void> _generateReport() async {
    setState(() => _isLoading = true);
    try {
      final txProv = context.read<TransactionProvider>();
      final custProv = context.read<CustomerProvider>();

      await Future.wait([
        txProv.loadAllTransactions(startDate: _startDate, endDate: _endDate),
        custProv.loadCustomers(),
      ]);

      final transactions = txProv.transactions;
      final customers = custProv.customers;

      double totalDebit =
          transactions.where((t) => t.isDebit).fold(0.0, (s, t) => s + t.amount);
      double totalCredit =
          transactions.where((t) => t.isCredit).fold(0.0, (s, t) => s + t.amount);
      double totalOutstanding = customers
          .where((c) => c.balance > 0)
          .fold(0.0, (s, c) => s + c.balance);

      final categoryMap = <String, double>{};
      for (final tx in transactions.where((t) => t.isDebit)) {
        categoryMap[tx.category] = (categoryMap[tx.category] ?? 0) + tx.amount;
      }

      setState(() {
        _reportData = {
          'total_debit': totalDebit,
          'total_credit': totalCredit,
          'net': totalDebit - totalCredit,
          'total_outstanding': totalOutstanding,
          'tx_count': transactions.length,
          'customer_count': customers.length,
          'category_breakdown': categoryMap,
          'transactions': transactions,
        };
      });
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _pickCustomRange() async {
    final range = await showDateRangePicker(
      context: context,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
      initialDateRange: DateTimeRange(start: _startDate, end: _endDate),
    );
    if (range != null) {
      setState(() {
        _period = AppConstants.reportCustom;
        _startDate = range.start;
        _endDate = range.end;
      });
      _generateReport();
    }
  }

  void _setPeriod(String period) {
    setState(() {
      _period = period;
      final now = DateTime.now();
      switch (period) {
        case AppConstants.reportDaily:
          _startDate = DateTime(now.year, now.month, now.day);
          _endDate = now;
          break;
        case AppConstants.reportWeekly:
          _startDate = now.subtract(const Duration(days: 7));
          _endDate = now;
          break;
        case AppConstants.reportMonthly:
          _startDate = DateTime(now.year, now.month, 1);
          _endDate = now;
          break;
      }
    });
    _generateReport();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reports'),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.date_range),
            onPressed: _pickCustomRange,
          ),
        ],
      ),
      body: Column(
        children: [
          _buildPeriodSelector(),
          _buildDateRange(),
          Expanded(
            child: _isLoading
                ? const LoadingWidget(message: 'Generating report...')
                : _buildReport(),
          ),
        ],
      ),
    );
  }

  Widget _buildPeriodSelector() {
    return Container(
      color: AppConfig.primaryColor,
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
      child: Row(
        children: [
          AppConstants.reportDaily,
          AppConstants.reportWeekly,
          AppConstants.reportMonthly,
          AppConstants.reportCustom,
        ]
            .map((p) => Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text(_periodLabel(p)),
                    selected: _period == p,
                    onSelected: (_) => p == AppConstants.reportCustom
                        ? _pickCustomRange()
                        : _setPeriod(p),
                    selectedColor: Colors.white,
                    labelStyle: TextStyle(
                      color: _period == p ? AppConfig.primaryColor : Colors.white,
                      fontWeight: FontWeight.w500,
                      fontSize: 12,
                    ),
                  ),
                ))
            .toList(),
      ),
    );
  }

  String _periodLabel(String p) {
    switch (p) {
      case AppConstants.reportDaily:
        return 'Today';
      case AppConstants.reportWeekly:
        return 'This Week';
      case AppConstants.reportMonthly:
        return 'This Month';
      case AppConstants.reportCustom:
        return 'Custom';
      default:
        return p;
    }
  }

  Widget _buildDateRange() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          const Icon(Icons.calendar_today, size: 14, color: Colors.grey),
          const SizedBox(width: 8),
          Text(
            '${AppFormatters.formatDate(_startDate)} - ${AppFormatters.formatDate(_endDate)}',
            style: const TextStyle(color: Colors.grey, fontSize: 13),
          ),
        ],
      ),
    );
  }

  Widget _buildReport() {
    if (_reportData.isEmpty) return const SizedBox();

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _buildSummaryCards(),
        const SizedBox(height: 16),
        _buildCategoryBreakdown(),
        const SizedBox(height: 16),
        _buildOutstandingSection(),
      ],
    );
  }

  Widget _buildSummaryCards() {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _ReportCard(
                title: 'Total Sales',
                value: AppFormatters.formatAmount(
                    _reportData['total_debit'] as double),
                icon: Icons.arrow_upward,
                color: AppConfig.debitColor,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _ReportCard(
                title: 'Total Payments',
                value: AppFormatters.formatAmount(
                    _reportData['total_credit'] as double),
                icon: Icons.arrow_downward,
                color: AppConfig.creditColor,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _ReportCard(
                title: 'Net',
                value: AppFormatters.formatAmount(
                    (_reportData['net'] as double).abs()),
                icon: Icons.account_balance,
                color: AppConfig.primaryColor,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _ReportCard(
                title: 'Transactions',
                value: '${_reportData['tx_count']}',
                icon: Icons.receipt_long,
                color: AppConfig.accentColor,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildCategoryBreakdown() {
    final categories =
        _reportData['category_breakdown'] as Map<String, double>;
    if (categories.isEmpty) return const SizedBox();

    final sorted = categories.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));
    final total =
        sorted.fold<double>(0, (s, e) => s + e.value);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Sales by Category',
                style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 12),
            ...sorted.map((entry) {
              final pct = total > 0 ? (entry.value / total) : 0.0;
              return Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Expanded(
                            child: Text(entry.key,
                                style:
                                    Theme.of(context).textTheme.bodyMedium)),
                        Text(AppFormatters.formatAmount(entry.value),
                            style: const TextStyle(
                                fontWeight: FontWeight.w600,
                                color: AppConfig.debitColor)),
                      ],
                    ),
                    const SizedBox(height: 4),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: LinearProgressIndicator(
                        value: pct,
                        backgroundColor: Colors.grey.shade100,
                        color: AppConfig.primaryColor,
                        minHeight: 6,
                      ),
                    ),
                  ],
                ),
              );
            }),
          ],
        ),
      ),
    );
  }

  Widget _buildOutstandingSection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Total Outstanding',
                      style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 4),
                  Text(
                    AppFormatters.formatAmount(
                        _reportData['total_outstanding'] as double),
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: AppConfig.debitColor,
                    ),
                  ),
                ],
              ),
            ),
            ElevatedButton(
              onPressed: () => Navigator.pushNamed(
                  context, AppConstants.routeCustomersList),
              child: const Text('View'),
            ),
          ],
        ),
      ),
    );
  }
}

class _ReportCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;

  const _ReportCard({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 20),
            const SizedBox(height: 8),
            Text(value,
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: color)),
            const SizedBox(height: 4),
            Text(title,
                style: Theme.of(context)
                    .textTheme
                    .bodySmall
                    ?.copyWith(color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}
