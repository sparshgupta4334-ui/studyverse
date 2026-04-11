import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/transaction_provider.dart';
import '../../utils/formatters.dart';
import '../../widgets/common/report_summary_card.dart';

class ReportsScreen extends StatefulWidget {
  const ReportsScreen({super.key});

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  String _selectedPeriod = 'month';

  final List<Map<String, String>> _periods = [
    {'value': 'today', 'label': 'Today'},
    {'value': 'week', 'label': 'This Week'},
    {'value': 'month', 'label': 'This Month'},
    {'value': 'quarter', 'label': 'Quarter'},
    {'value': 'year', 'label': 'This Year'},
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadReport();
    });
  }

  Future<void> _loadReport() async {
    await context.read<TransactionProvider>().loadReport(period: _selectedPeriod);
  }

  @override
  Widget build(BuildContext context) {
    final txnProvider = context.watch<TransactionProvider>();
    final reportData = txnProvider.reportData;

    return Scaffold(
      backgroundColor: AppColors.neutral100,
      appBar: AppBar(
        title: const Text('Reports'),
        actions: [
          IconButton(
            icon: const Icon(Icons.share_rounded),
            onPressed: () {
              // Export/Share functionality
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Export feature coming soon!')),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Period Filter
          Container(
            color: AppColors.surface,
            padding: const EdgeInsets.symmetric(vertical: 12),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: _periods.map((period) {
                  final isSelected = _selectedPeriod == period['value'];
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: FilterChip(
                      label: Text(period['label']!),
                      selected: isSelected,
                      onSelected: (_) {
                        setState(() => _selectedPeriod = period['value']!);
                        _loadReport();
                      },
                      selectedColor: AppColors.primaryContainer,
                      labelStyle: TextStyle(
                        color: isSelected ? AppColors.primary : AppColors.neutral600,
                        fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
          ),

          // Report Content
          Expanded(
            child: txnProvider.isLoading
                ? const Center(child: CircularProgressIndicator())
                : reportData == null
                    ? const Center(child: Text('No report data available'))
                    : RefreshIndicator(
                        onRefresh: _loadReport,
                        child: SingleChildScrollView(
                          physics: const AlwaysScrollableScrollPhysics(),
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            children: [
                              // Summary Cards
                              ReportSummaryCard(
                                totalCredit: (reportData['summary']?['totalCredit'] as num?)?.toDouble() ?? 0,
                                totalDebit: (reportData['summary']?['totalDebit'] as num?)?.toDouble() ?? 0,
                                netAmount: (reportData['summary']?['netAmount'] as num?)?.toDouble() ?? 0,
                                totalTransactions: reportData['summary']?['totalTransactions'] as int? ?? 0,
                              ),
                              const SizedBox(height: 24),

                              // Daily Breakdown
                              if (reportData['dailyBreakdown'] != null &&
                                  (reportData['dailyBreakdown'] as List).isNotEmpty) ...[
                                Card(
                                  child: Padding(
                                    padding: const EdgeInsets.all(16),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        const Text(
                                          'Daily Breakdown',
                                          style: TextStyle(
                                            fontSize: 16,
                                            fontWeight: FontWeight.w600,
                                            color: AppColors.neutral900,
                                          ),
                                        ),
                                        const SizedBox(height: 12),
                                        ...(reportData['dailyBreakdown'] as List).map(
                                          (day) => _DailyRow(day: day as Map<String, dynamic>),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                      ),
          ),
        ],
      ),
    );
  }
}

class _DailyRow extends StatelessWidget {
  final Map<String, dynamic> day;

  const _DailyRow({required this.day});

  @override
  Widget build(BuildContext context) {
    final credit = (day['credit'] as num?)?.toDouble() ?? 0;
    final debit = (day['debit'] as num?)?.toDouble() ?? 0;
    final date = day['date']?.toString() ?? '';

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Text(
            AppFormatters.formatShortDate(date),
            style: const TextStyle(fontSize: 13, color: AppColors.neutral600),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (credit > 0)
                  Row(
                    children: [
                      Container(width: 8, height: 8, decoration: const BoxDecoration(color: AppColors.credit, shape: BoxShape.circle)),
                      const SizedBox(width: 6),
                      Text(AppFormatters.formatCurrency(credit), style: const TextStyle(fontSize: 12, color: AppColors.credit)),
                    ],
                  ),
                if (debit > 0)
                  Row(
                    children: [
                      Container(width: 8, height: 8, decoration: const BoxDecoration(color: AppColors.debit, shape: BoxShape.circle)),
                      const SizedBox(width: 6),
                      Text(AppFormatters.formatCurrency(debit), style: const TextStyle(fontSize: 12, color: AppColors.debit)),
                    ],
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
