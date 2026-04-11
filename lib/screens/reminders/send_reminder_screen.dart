import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/customer_provider.dart';
import '../../models/customer.dart';
import '../../services/reminder_service.dart';
import '../../services/database_service.dart';
import '../../config/app_config.dart';
import '../../utils/helpers.dart';
import '../../utils/formatters.dart';
import '../../widgets/custom/custom_button.dart';
import '../../widgets/custom/custom_text_field.dart';

class SendReminderScreen extends StatefulWidget {
  final Customer? customer;

  const SendReminderScreen({super.key, this.customer});

  @override
  State<SendReminderScreen> createState() => _SendReminderScreenState();
}

class _SendReminderScreenState extends State<SendReminderScreen> {
  final _messageController = TextEditingController();
  final _reminderService = ReminderService();
  final _dbService = DatabaseService();
  Customer? _selectedCustomer;
  String _reminderType = AppConfig.reminderTypeWhatsApp;
  bool _isSending = false;

  @override
  void initState() {
    super.initState();
    _selectedCustomer = widget.customer;
    _updateMessage();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CustomerProvider>().loadCustomers();
    });
  }

  void _updateMessage() {
    if (_selectedCustomer != null) {
      _messageController.text = _reminderService.buildReminderMessage(
        customerName: _selectedCustomer!.name,
        amount: _selectedCustomer!.balance,
      );
    }
  }

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }

  Future<void> _send() async {
    if (_selectedCustomer == null) {
      AppHelpers.showSnackBar(context, 'Please select a customer', isError: true);
      return;
    }
    if (_messageController.text.trim().isEmpty) {
      AppHelpers.showSnackBar(context, 'Please enter a message', isError: true);
      return;
    }

    setState(() => _isSending = true);
    bool success = false;

    try {
      switch (_reminderType) {
        case AppConfig.reminderTypeWhatsApp:
          success = await _reminderService.sendWhatsAppReminder(
            phone: _selectedCustomer!.phone,
            customerName: _selectedCustomer!.name,
            amount: _selectedCustomer!.balance,
            customMessage: _messageController.text.trim(),
          );
          break;
        case AppConfig.reminderTypeSms:
          success = await _reminderService.sendSmsReminder(
            phone: _selectedCustomer!.phone,
            customerName: _selectedCustomer!.name,
            amount: _selectedCustomer!.balance,
            customMessage: _messageController.text.trim(),
          );
          break;
      }

      if (success) {
        final reminder = await _dbService.addReminder(
          customerId: _selectedCustomer!.id,
          message: _messageController.text.trim(),
          type: _reminderType,
        );
        await _dbService.markReminderSent(reminder.id);
        if (mounted) {
          AppHelpers.showSnackBar(context, 'Reminder sent successfully',
              isSuccess: true);
          Navigator.pop(context);
        }
      } else {
        if (mounted) {
          AppHelpers.showSnackBar(context, 'Failed to send reminder',
              isError: true);
        }
      }
    } catch (e) {
      if (mounted) {
        AppHelpers.showSnackBar(context, 'Error sending reminder', isError: true);
      }
    }

    if (mounted) setState(() => _isSending = false);
  }

  @override
  Widget build(BuildContext context) {
    final customerProv = context.watch<CustomerProvider>();

    return Scaffold(
      appBar: AppBar(title: const Text('Send Reminder')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          if (widget.customer == null) ...[
            _buildCustomerPicker(customerProv),
            const SizedBox(height: 16),
          ],
          if (_selectedCustomer != null) _buildCustomerCard(),
          const SizedBox(height: 16),
          _buildTypeSelector(),
          const SizedBox(height: 16),
          CustomTextField(
            label: 'Message *',
            controller: _messageController,
            maxLines: 5,
            maxLength: 500,
            prefixIcon: const Icon(Icons.message_outlined),
          ),
          const SizedBox(height: 24),
          CustomButton(
            label: 'Send Reminder',
            onPressed: _send,
            isLoading: _isSending,
            icon: Icons.send,
          ),
        ],
      ),
    );
  }

  Widget _buildCustomerCard() {
    final c = _selectedCustomer!;
    return Card(
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: AppHelpers.getAvatarColor(c.name),
          child: Text(AppFormatters.initials(c.name),
              style: const TextStyle(color: Colors.white)),
        ),
        title: Text(c.name),
        subtitle: Text(c.phone),
        trailing: c.balance > 0
            ? Text(AppFormatters.formatAmount(c.balance),
                style: const TextStyle(
                    color: AppConfig.debitColor, fontWeight: FontWeight.bold))
            : null,
      ),
    );
  }

  Widget _buildCustomerPicker(CustomerProvider provider) {
    return GestureDetector(
      onTap: () => _showCustomerPicker(provider),
      child: InputDecorator(
        decoration: InputDecoration(
          labelText: 'Customer *',
          prefixIcon: const Icon(Icons.person_outline),
          suffixIcon: const Icon(Icons.arrow_drop_down),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
        ),
        child: Text(
          _selectedCustomer?.name ?? 'Select Customer',
          style: TextStyle(
              color: _selectedCustomer == null ? Colors.grey : null,
              fontSize: 16),
        ),
      ),
    );
  }

  void _showCustomerPicker(CustomerProvider provider) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(16))),
      builder: (ctx) => DraggableScrollableSheet(
        initialChildSize: 0.7,
        maxChildSize: 0.9,
        minChildSize: 0.4,
        expand: false,
        builder: (_, c) => ListView.builder(
          controller: c,
          itemCount: provider.customers.length,
          itemBuilder: (_, i) {
            final cust = provider.customers[i];
            return ListTile(
              title: Text(cust.name),
              subtitle: Text(cust.phone),
              onTap: () {
                setState(() {
                  _selectedCustomer = cust;
                  _updateMessage();
                });
                Navigator.pop(ctx);
              },
            );
          },
        ),
      ),
    );
  }

  Widget _buildTypeSelector() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Send via', style: Theme.of(context).textTheme.titleSmall),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _TypeOption(
                    label: 'WhatsApp',
                    icon: Icons.chat,
                    color: const Color(0xFF25D366),
                    selected: _reminderType == AppConfig.reminderTypeWhatsApp,
                    onTap: () => setState(
                        () => _reminderType = AppConfig.reminderTypeWhatsApp),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _TypeOption(
                    label: 'SMS',
                    icon: Icons.sms,
                    color: Colors.blue,
                    selected: _reminderType == AppConfig.reminderTypeSms,
                    onTap: () => setState(
                        () => _reminderType = AppConfig.reminderTypeSms),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _TypeOption extends StatelessWidget {
  final String label;
  final IconData icon;
  final Color color;
  final bool selected;
  final VoidCallback onTap;

  const _TypeOption({
    required this.label,
    required this.icon,
    required this.color,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: selected ? color.withOpacity(0.12) : Colors.grey.shade50,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
              color: selected ? color : Colors.grey.shade200,
              width: selected ? 2 : 1),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: selected ? color : Colors.grey, size: 20),
            const SizedBox(width: 8),
            Text(label,
                style: TextStyle(
                    color: selected ? color : Colors.grey,
                    fontWeight: selected ? FontWeight.bold : FontWeight.normal)),
          ],
        ),
      ),
    );
  }
}
