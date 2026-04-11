import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../config/app_theme.dart';
import '../../config/routes.dart';
import '../../providers/auth_provider.dart';
import '../../providers/customer_provider.dart';
import '../../widgets/balance_summary_card.dart';
import '../../widgets/customer_card.dart';
import '../../widgets/loading_widget.dart';
import '../../models/customer_model.dart';
import '../customer/customer_list_screen.dart';
import '../settings/settings_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _currentIndex = 0;
  final TextEditingController _searchController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CustomerProvider>().loadCustomers(refresh: true);
    });
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

  Widget _buildBody() {
    switch (_currentIndex) {
      case 0:
        return _buildDashboard();
      case 1:
        return const CustomerListScreen(embedded: true);
      case 2:
        return _buildReportsPlaceholder();
      case 3:
        return const SettingsScreen(embedded: true);
      default:
        return _buildDashboard();
    }
  }

  Widget _buildDashboard() {
    return Consumer<CustomerProvider>(
      builder: (context, provider, _) {
        return RefreshIndicator(
          color: AppTheme.primaryGreen,
          onRefresh: () => provider.loadCustomers(refresh: true),
          child: CustomScrollView(
            controller: _scrollController,
            slivers: [
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildHeader(),
                      const SizedBox(height: 16),
                      // Balance summary row
                      Row(
                        children: [
                          Expanded(
                            child: BalanceSummaryCard(
                              label: 'To Receive',
                              amount: provider.totalReceivable,
                              isReceivable: true,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: BalanceSummaryCard(
                              label: 'To Pay',
                              amount: provider.totalPayable,
                              isReceivable: false,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      _buildSearchBar(provider),
                      const SizedBox(height: 8),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 4),
                        child: Text(
                          'Recent Customers',
                          style:
                              Theme.of(context).textTheme.titleMedium?.copyWith(
                                    fontWeight: FontWeight.w600,
                                  ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              _buildCustomerList(provider),
              if (provider.isLoading && provider.customers.isNotEmpty)
                const SliverToBoxAdapter(
                  child: Padding(
                    padding: EdgeInsets.all(16),
                    child: Center(child: LoadingWidget()),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildHeader() {
    final user = context.read<AuthProvider>().user;
    return Row(
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Good ${_greeting()}!',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context)
                        .colorScheme
                        .onSurface
                        .withOpacity(0.6),
                  ),
            ),
            Text(
              user?.displayName ?? 'My Business',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
          ],
        ),
        const Spacer(),
        // Notification + profile
        IconButton(
          icon: const Icon(Icons.notifications_outlined),
          onPressed: () {},
        ),
        CircleAvatar(
          radius: 18,
          backgroundColor: AppTheme.primaryGreen,
          child: Text(
            (user?.displayName ?? 'U').substring(0, 1).toUpperCase(),
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSearchBar(CustomerProvider provider) {
    return TextField(
      controller: _searchController,
      onChanged: provider.setSearch,
      decoration: InputDecoration(
        hintText: 'Search customers...',
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
    );
  }

  Widget _buildCustomerList(CustomerProvider provider) {
    if (provider.status == CustomerLoadStatus.loading &&
        provider.customers.isEmpty) {
      return const SliverFillRemaining(
        child: Center(child: LoadingWidget()),
      );
    }

    if (provider.customers.isEmpty) {
      return SliverFillRemaining(
        child: _buildEmptyState(),
      );
    }

    return SliverList(
      delegate: SliverChildBuilderDelegate(
        (context, index) => CustomerCard(
          customer: provider.customers[index],
          onTap: () => Navigator.of(context).pushNamed(
            AppRoutes.customerDetail,
            arguments: provider.customers[index],
          ),
        ),
        childCount: provider.customers.length,
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.people_outline_rounded,
            size: 80,
            color: Theme.of(context).colorScheme.onSurface.withOpacity(0.2),
          ),
          const SizedBox(height: 16),
          Text(
            'No customers yet',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: Theme.of(context)
                      .colorScheme
                      .onSurface
                      .withOpacity(0.5),
                ),
          ),
          const SizedBox(height: 8),
          Text(
            'Tap + to add your first customer',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
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

  Widget _buildReportsPlaceholder() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.bar_chart_rounded,
            size: 80,
            color: AppTheme.primaryGreen.withOpacity(0.3),
          ),
          const SizedBox(height: 16),
          Text(
            'Reports Coming Soon',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 8),
          Text(
            'Detailed analytics will be available here',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Theme.of(context)
                      .colorScheme
                      .onSurface
                      .withOpacity(0.5),
                ),
          ),
        ],
      ),
    );
  }

  String _greeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: _currentIndex == 0
          ? null
          : AppBar(
              title: Text(_tabTitles[_currentIndex]),
              automaticallyImplyLeading: false,
            ),
      body: _buildBody(),
      floatingActionButton: _currentIndex == 0
          ? FloatingActionButton(
              onPressed: () async {
                final result = await Navigator.of(context)
                    .pushNamed(AppRoutes.addCustomer);
                if (result == true) {
                  context
                      .read<CustomerProvider>()
                      .loadCustomers(refresh: true);
                }
              },
              tooltip: 'Add Customer',
              child: const Icon(Icons.person_add_rounded),
            )
          : null,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard_outlined),
            activeIcon: Icon(Icons.dashboard_rounded),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.people_outline_rounded),
            activeIcon: Icon(Icons.people_rounded),
            label: 'Customers',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.bar_chart_outlined),
            activeIcon: Icon(Icons.bar_chart_rounded),
            label: 'Reports',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings_outlined),
            activeIcon: Icon(Icons.settings_rounded),
            label: 'Settings',
          ),
        ],
      ),
    );
  }

  static const List<String> _tabTitles = [
    'Dashboard',
    'Customers',
    'Reports',
    'Settings',
  ];
}
