import 'package:flutter/material.dart';
import '../../services/database_service.dart';
import '../../models/reminder.dart';
import '../../config/app_config.dart';
import '../../config/constants.dart';
import '../../utils/formatters.dart';
import '../../utils/helpers.dart';
import '../../widgets/common/loading_widget.dart';
import '../../widgets/common/error_widget.dart';

class RemindersScreen extends StatefulWidget {
  const RemindersScreen({super.key});

  @override
  State<RemindersScreen> createState() => _RemindersScreenState();
}

class _RemindersScreenState extends State<RemindersScreen>
    with SingleTickerProviderStateMixin {
  final _dbService = DatabaseService();
  List<Reminder> _reminders = [];
  bool _isLoading = true;
  String? _error;
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadReminders();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadReminders() async {
    setState(() => _isLoading = true);
    try {
      _reminders = await _dbService.getAllReminders();
      _error = null;
    } catch (e) {
      _error = 'Failed to load reminders';
    }
    if (mounted) setState(() => _isLoading = false);
  }

  Future<void> _deleteReminder(String id) async {
    final confirm = await AppHelpers.showConfirmDialog(
      context,
      title: 'Delete Reminder',
      message: 'Are you sure you want to delete this reminder?',
      confirmText: 'Delete',
      isDestructive: true,
    );
    if (confirm == true) {
      await _dbService.deleteReminder(id);
      _loadReminders();
    }
  }

  @override
  Widget build(BuildContext context) {
    final pending =
        _reminders.where((r) => r.isPending).toList();
    final sent = _reminders.where((r) => r.isSent || r.isFailed).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Reminders'),
        bottom: TabBar(
          controller: _tabController,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          indicatorColor: Colors.white,
          tabs: [
            Tab(text: 'Pending (${pending.length})'),
            Tab(text: 'Sent (${sent.length})'),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () =>
            Navigator.pushNamed(context, AppConstants.routeSendReminder)
                .then((_) => _loadReminders()),
        child: const Icon(Icons.add_alert),
      ),
      body: _isLoading
          ? const LoadingWidget()
          : _error != null
              ? AppErrorWidget(message: _error, onRetry: _loadReminders)
              : TabBarView(
                  controller: _tabController,
                  children: [
                    _buildList(pending),
                    _buildList(sent),
                  ],
                ),
    );
  }

  Widget _buildList(List<Reminder> reminders) {
    if (reminders.isEmpty) {
      return const EmptyStateWidget(
        message: 'No reminders here',
        icon: Icons.notifications_none,
      );
    }

    return RefreshIndicator(
      onRefresh: _loadReminders,
      child: ListView.builder(
        padding: const EdgeInsets.symmetric(vertical: 8),
        itemCount: reminders.length,
        itemBuilder: (ctx, i) => _buildReminderTile(reminders[i]),
      ),
    );
  }

  Widget _buildReminderTile(Reminder reminder) {
    final typeIcon = reminder.type == AppConfig.reminderTypeWhatsApp
        ? Icons.chat
        : reminder.type == AppConfig.reminderTypeSms
            ? Icons.sms
            : Icons.notifications;

    final statusColor = reminder.isSent
        ? AppConfig.successColor
        : reminder.isFailed
            ? AppConfig.errorColor
            : AppConfig.warningColor;

    return Dismissible(
      key: Key(reminder.id),
      direction: DismissDirection.endToStart,
      background: Container(
        color: AppConfig.errorColor,
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 16),
        child: const Icon(Icons.delete, color: Colors.white),
      ),
      onDismissed: (_) => _deleteReminder(reminder.id),
      child: Card(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        child: ListTile(
          leading: CircleAvatar(
            backgroundColor: AppConfig.primaryColor.withOpacity(0.1),
            child: Icon(typeIcon, color: AppConfig.primaryColor, size: 20),
          ),
          title: Text(reminder.customerName ?? 'Customer',
              style: Theme.of(context).textTheme.titleSmall),
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(reminder.message,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontSize: 12)),
              const SizedBox(height: 2),
              Text(
                AppFormatters.formatDateFull(reminder.scheduledAt),
                style: const TextStyle(fontSize: 11, color: Colors.grey),
              ),
            ],
          ),
          trailing: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  reminder.status.toUpperCase(),
                  style: TextStyle(
                      color: statusColor,
                      fontSize: 10,
                      fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          isThreeLine: true,
        ),
      ),
    );
  }
}
