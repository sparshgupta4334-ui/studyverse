import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../config/app_theme.dart';
import '../../config/routes.dart';
import '../../providers/customer_provider.dart';
import '../../widgets/customer_card.dart';
import '../../widgets/loading_widget.dart';
import '../../models/customer_model.dart';

class CustomerListScreen extends StatefulWidget {
  final bool embedded;

  const CustomerListScreen({super.key, this.embedded = false});

  @override
  State<CustomerListScreen> createState() => _CustomerListScreenState();
}

class _CustomerListScreenState extends State<CustomerListScreen> {
  final TextEditingController _searchController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    if (!widget.embedded) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        context.read<CustomerProvider>().loadCustomers(refresh: true);
      });
    }
    _scrollController.addListener(_onScroll);
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      context.read<CustomerProvider>().loadCustomers();
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<CustomerProvider>(
      builder: (context, provider, _) {
        Widget body = Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
              child: TextField(
                controller: _searchController,
                onChanged: provider.setSearch,
                decoration: InputDecoration(
                  hintText: 'Search by name or phone',
                  prefixIcon: const Icon(Icons.search),
                  suffixIcon: _searchController.text.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear),
                          onPressed: () {
                            _searchController.clear();
                            provider.setSearch('');
                          },
                        )
                      : null,
                ),
              ),
            ),
            if (provider.customers.isNotEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
                child: Row(
                  children: [
                    Text(
                      '${provider.customers.length} customers',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ),
              ),
            Expanded(
              child: _buildList(provider),
            ),
          ],
        );

        if (widget.embedded) return body;

        return Scaffold(
          appBar: AppBar(title: const Text('All Customers')),
          body: body,
          floatingActionButton: FloatingActionButton(
            onPressed: () async {
              final result =
                  await Navigator.of(context).pushNamed(AppRoutes.addCustomer);
              if (result == true) {
                provider.loadCustomers(refresh: true);
              }
            },
            child: const Icon(Icons.person_add_rounded),
          ),
        );
      },
    );
  }

  Widget _buildList(CustomerProvider provider) {
    if (provider.status == CustomerLoadStatus.loading &&
        provider.customers.isEmpty) {
      return const Center(child: LoadingWidget());
    }

    if (provider.customers.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.search_off_rounded,
              size: 64,
              color: Theme.of(context).colorScheme.onSurface.withOpacity(0.2),
            ),
            const SizedBox(height: 16),
            Text(
              'No customers found',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    color: Theme.of(context)
                        .colorScheme
                        .onSurface
                        .withOpacity(0.4),
                  ),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      color: AppTheme.primaryGreen,
      onRefresh: () => provider.loadCustomers(refresh: true),
      child: ListView.builder(
        controller: _scrollController,
        padding: const EdgeInsets.only(bottom: 80),
        itemCount:
            provider.customers.length + (provider.isLoading ? 1 : 0),
        itemBuilder: (context, index) {
          if (index == provider.customers.length) {
            return const Padding(
              padding: EdgeInsets.all(16),
              child: Center(child: LoadingWidget()),
            );
          }
          return CustomerCard(
            customer: provider.customers[index],
            onTap: () => Navigator.of(context).pushNamed(
              AppRoutes.customerDetail,
              arguments: provider.customers[index],
            ),
          );
        },
      ),
    );
  }
}
