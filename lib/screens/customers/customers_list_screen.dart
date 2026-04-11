import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/customer_provider.dart';
import '../../config/app_config.dart';
import '../../config/constants.dart';
import '../../widgets/common/loading_widget.dart';
import '../../widgets/common/error_widget.dart';
import '../../widgets/customer_widgets/customer_card.dart';
import '../../utils/formatters.dart';

class CustomersListScreen extends StatefulWidget {
  const CustomersListScreen({super.key});

  @override
  State<CustomersListScreen> createState() => _CustomersListScreenState();
}

class _CustomersListScreenState extends State<CustomersListScreen> {
  final _searchController = TextEditingController();
  String? _selectedCategory;
  String _sortBy = 'name';
  bool _sortAsc = true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CustomerProvider>().loadCustomers();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<CustomerProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Customers'),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.sort),
            onPressed: _showSortOptions,
          ),
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: _showFilterOptions,
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => Navigator.pushNamed(context, AppConstants.routeAddCustomer)
            .then((_) => provider.loadCustomers()),
        child: const Icon(Icons.person_add),
        tooltip: 'Add Customer',
      ),
      body: Column(
        children: [
          _buildSearchBar(provider),
          _buildSummaryBar(provider),
          Expanded(child: _buildList(provider)),
        ],
      ),
    );
  }

  Widget _buildSearchBar(CustomerProvider provider) {
    return Container(
      color: AppConfig.primaryColor,
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
      child: TextField(
        controller: _searchController,
        style: const TextStyle(color: Colors.white),
        decoration: InputDecoration(
          hintText: 'Search by name or phone...',
          hintStyle: const TextStyle(color: Colors.white70),
          prefixIcon: const Icon(Icons.search, color: Colors.white70),
          suffixIcon: _searchController.text.isNotEmpty
              ? IconButton(
                  icon: const Icon(Icons.clear, color: Colors.white70),
                  onPressed: () {
                    _searchController.clear();
                    provider.search('');
                  },
                )
              : null,
          filled: true,
          fillColor: Colors.white.withOpacity(0.15),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: BorderSide.none,
          ),
          contentPadding: const EdgeInsets.symmetric(horizontal: 16),
        ),
        onChanged: (v) {
          provider.search(v);
          setState(() {});
        },
      ),
    );
  }

  Widget _buildSummaryBar(CustomerProvider provider) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      color: Colors.white,
      child: Row(
        children: [
          Text(
            '${provider.filteredCustomers.length} customers',
            style: Theme.of(context).textTheme.bodySmall,
          ),
          const Spacer(),
          Text(
            'Outstanding: ${AppFormatters.formatAmount(provider.totalOutstanding)}',
            style: const TextStyle(
              color: AppConfig.debitColor,
              fontWeight: FontWeight.w600,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildList(CustomerProvider provider) {
    if (provider.isLoading) {
      return const LoadingWidget(message: 'Loading customers...');
    }
    if (provider.errorMessage != null) {
      return AppErrorWidget(
        message: provider.errorMessage,
        onRetry: provider.loadCustomers,
      );
    }
    final customers = provider.filteredCustomers;
    if (customers.isEmpty) {
      return EmptyStateWidget(
        message: 'No customers found',
        subMessage: provider.searchQuery.isNotEmpty
            ? 'Try a different search term'
            : 'Add your first customer to get started',
        icon: Icons.people_outline,
        action: provider.searchQuery.isEmpty
            ? ElevatedButton.icon(
                onPressed: () =>
                    Navigator.pushNamed(context, AppConstants.routeAddCustomer)
                        .then((_) => provider.loadCustomers()),
                icon: const Icon(Icons.person_add),
                label: const Text('Add Customer'),
              )
            : null,
      );
    }

    return RefreshIndicator(
      onRefresh: provider.loadCustomers,
      child: ListView.builder(
        padding: const EdgeInsets.only(top: 8, bottom: 80),
        itemCount: customers.length,
        itemBuilder: (ctx, i) => CustomerCard(
          customer: customers[i],
          onTap: () => Navigator.pushNamed(
            context,
            AppConstants.routeCustomerDetail,
            arguments: customers[i].id,
          ).then((_) => provider.loadCustomers()),
        ),
      ),
    );
  }

  void _showSortOptions() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(16))),
      builder: (ctx) => Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ListTile(
            title: const Text('Sort by Name'),
            trailing: _sortBy == 'name' ? const Icon(Icons.check) : null,
            onTap: () {
              Navigator.pop(ctx);
              _setSortBy('name');
            },
          ),
          ListTile(
            title: const Text('Sort by Balance'),
            trailing: _sortBy == 'balance' ? const Icon(Icons.check) : null,
            onTap: () {
              Navigator.pop(ctx);
              _setSortBy('balance');
            },
          ),
          ListTile(
            title: const Text('Sort by Date Added'),
            trailing: _sortBy == 'date' ? const Icon(Icons.check) : null,
            onTap: () {
              Navigator.pop(ctx);
              _setSortBy('date');
            },
          ),
        ],
      ),
    );
  }

  void _showFilterOptions() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(16))),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Filter by Category',
                style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              children: [
                FilterChip(
                  label: const Text('All'),
                  selected: _selectedCategory == null,
                  onSelected: (_) {
                    Navigator.pop(ctx);
                    setState(() => _selectedCategory = null);
                    context.read<CustomerProvider>().setFilterCategory(null);
                  },
                ),
                ...AppConfig.customerCategories.map((cat) => FilterChip(
                      label: Text(cat),
                      selected: _selectedCategory == cat,
                      onSelected: (_) {
                        Navigator.pop(ctx);
                        setState(() => _selectedCategory = cat);
                        context.read<CustomerProvider>().setFilterCategory(cat);
                      },
                    )),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _setSortBy(String sortBy) {
    setState(() => _sortBy = sortBy);
    context.read<CustomerProvider>().setSortBy(sortBy, ascending: _sortAsc);
  }
}
