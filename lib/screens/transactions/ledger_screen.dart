import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/transaction_provider.dart';
import '../../config/app_config.dart';
import '../../config/constants.dart';
import '../../utils/formatters.dart';
import '../../widgets/common/loading_widget.dart';
import '../../widgets/common/error_widget.dart';
import '../../widgets/transaction_widgets/transaction_card.dart';

class LedgerScreen extends StatefulWidget {
  const LedgerScreen({super.key});

  @override
  State<LedgerScreen> createState() => _LedgerScreenState();
}

class _LedgerScreenState extends State<LedgerScreen> {
  String? _typeFilter;
  DateTime? _startDate;
  DateTime? _endDate;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _loadData());
  }

  Future<void> _loadData() async {
    await context.read<TransactionProvider>().loadAllTransactions(
          startDate: _startDate,
          endDate: _endDate,
          type: _typeFilter,
        );
  }

  Future<void> _pickDateRange() async {
    final range = await showDateRangePicker(
      context: context,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
      initialDateRange: _startDate != null && _endDate != null
          ? DateTimeRange(start: _startDate!, end: _endDate!)
          : null,
    );
    if (range != null) {
      setState(() {
        _startDate = range.start;
        _endDate = range.end;
      });
      _loadData();
    }
  }

  void _clearFilters() {
    setState(() {
      _typeFilter = null;
      _startDate = null;
      _endDate = null;
    });
    _loadData();
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<TransactionProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Ledger'),
        automaticallyImplyLeading: false,
        actions: [
          if (_typeFilter != null || _startDate != null)
            IconButton(
              icon: const Icon(Icons.clear),
              tooltip: 'Clear filters',
              onPressed: _clearFilters,
            ),
          IconButton(
            icon: const Icon(Icons.date_range),
            onPressed: _pickDateRange,
          ),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(50),
          child: _buildFilterBar(),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () =>
            Navigator.pushNamed(context, AppConstants.routeAddTransaction)
                .then((_) => _loadData()),
        child: const Icon(Icons.add),
      ),
      body: Column(
        children: [
          _buildSummaryBar(provider),
          Expanded(child: _buildBody(provider)),
        ],
      ),
    );
  }

  Widget _buildFilterBar() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      child: Row(
        children: [
          _FilterChip(
            label: 'All',
            selected: _typeFilter == null,
            onTap: () {
              setState(() => _typeFilter = null);
              _loadData();
            },
          ),
          const SizedBox(width: 8),
          _FilterChip(
            label: 'Debit (Sales)',
            selected: _typeFilter == AppConfig.txTypeDebit,
            onTap: () {
              setState(() => _typeFilter = AppConfig.txTypeDebit);
              _loadData();
            },
          ),
          const SizedBox(width: 8),
          _FilterChip(
            label: 'Credit (Payments)',
            selected: _typeFilter == AppConfig.txTypeCredit,
            onTap: () {
              setState(() => _typeFilter = AppConfig.txTypeCredit);
              _loadData();
            },
          ),
          if (_startDate != null) ...[
            const SizedBox(width: 8),
            _FilterChip(
              label:
                  '${AppFormatters.formatDateShort(_startDate!)} - ${AppFormatters.formatDateShort(_endDate ?? _startDate!)}',
              selected: true,
              onTap: _pickDateRange,
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildSummaryBar(TransactionProvider provider) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      color: Colors.white,
      child: Row(
        children: [
          Expanded(
            child: _SummaryItem(
              label: 'Debit',
              value: AppFormatters.formatAmount(provider.totalDebit),
              color: AppConfig.debitColor,
            ),
          ),
          Container(width: 1, height: 30, color: Colors.grey.shade200),
          Expanded(
            child: _SummaryItem(
              label: 'Credit',
              value: AppFormatters.formatAmount(provider.totalCredit),
              color: AppConfig.creditColor,
            ),
          ),
          Container(width: 1, height: 30, color: Colors.grey.shade200),
          Expanded(
            child: _SummaryItem(
              label: 'Net',
              value: AppFormatters.formatAmount(provider.netBalance.abs()),
              color: provider.netBalance > 0
                  ? AppConfig.debitColor
                  : AppConfig.creditColor,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBody(TransactionProvider provider) {
    if (provider.isLoading) {
      return const LoadingWidget(message: 'Loading transactions...');
    }
    if (provider.errorMessage != null) {
      return AppErrorWidget(
          message: provider.errorMessage, onRetry: _loadData);
    }
    if (provider.transactions.isEmpty) {
      return EmptyStateWidget(
        message: 'No transactions found',
        subMessage: 'Add your first transaction',
        icon: Icons.receipt_long_outlined,
        action: ElevatedButton.icon(
          onPressed: () =>
              Navigator.pushNamed(context, AppConstants.routeAddTransaction)
                  .then((_) => _loadData()),
          icon: const Icon(Icons.add),
          label: const Text('Add Transaction'),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadData,
      child: ListView.builder(
        padding: const EdgeInsets.only(top: 8, bottom: 80),
        itemCount: provider.transactions.length,
        itemBuilder: (ctx, i) => TransactionCard(
          transaction: provider.transactions[i],
          onTap: () => Navigator.pushNamed(
              context, AppConstants.routeTransactionDetail,
              arguments: provider.transactions[i]),
        ),
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _FilterChip(
      {required this.label, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
        decoration: BoxDecoration(
          color: selected ? Colors.white : Colors.white.withOpacity(0.2),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: selected ? Colors.white : Colors.white54,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: selected ? AppConfig.primaryColor : Colors.white,
            fontWeight:
                selected ? FontWeight.bold : FontWeight.normal,
            fontSize: 13,
          ),
        ),
      ),
    );
  }
}

class _SummaryItem extends StatelessWidget {
  final String label;
  final String value;
  final Color color;

  const _SummaryItem(
      {required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(value,
            style: TextStyle(
                color: color, fontWeight: FontWeight.bold, fontSize: 13)),
        Text(label,
            style: const TextStyle(color: Colors.grey, fontSize: 11)),
      ],
    );
  }
}
