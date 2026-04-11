import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../../providers/customer_provider.dart';
import '../../providers/transaction_provider.dart';
import '../../models/customer.dart';
import '../../config/app_config.dart';
import '../../utils/validators.dart';
import '../../utils/helpers.dart';
import '../../utils/formatters.dart';
import '../../widgets/custom/custom_button.dart';
import '../../widgets/custom/custom_text_field.dart';

class AddTransactionScreen extends StatefulWidget {
  final String? preselectedCustomerId;
  final String? preselectedType;

  const AddTransactionScreen({
    super.key,
    this.preselectedCustomerId,
    this.preselectedType,
  });

  @override
  State<AddTransactionScreen> createState() => _AddTransactionScreenState();
}

class _AddTransactionScreenState extends State<AddTransactionScreen> {
  final _formKey = GlobalKey<FormState>();
  final _amountController = TextEditingController();
  final _notesController = TextEditingController();
  String _type = 'debit';
  String _category = 'Sale';
  DateTime _selectedDate = DateTime.now();
  Customer? _selectedCustomer;
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    _type = widget.preselectedType ?? 'debit';
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      await context.read<CustomerProvider>().loadCustomers();
      if (widget.preselectedCustomerId != null) {
        final customer = await context
            .read<CustomerProvider>()
            .getCustomer(widget.preselectedCustomerId!);
        if (mounted) setState(() => _selectedCustomer = customer);
      }
    });
  }

  @override
  void dispose() {
    _amountController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
    );
    if (picked != null) setState(() => _selectedDate = picked);
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedCustomer == null) {
      AppHelpers.showSnackBar(context, 'Please select a customer', isError: true);
      return;
    }
    setState(() => _isSaving = true);
    try {
      final amount =
          double.parse(_amountController.text.replaceAll(',', ''));
      await context.read<TransactionProvider>().addTransaction(
            customerId: _selectedCustomer!.id,
            amount: amount,
            type: _type,
            notes: _notesController.text.trim().isEmpty
                ? null
                : _notesController.text.trim(),
            category: _category,
            date: _selectedDate,
          );
      if (mounted) {
        context.read<CustomerProvider>().refreshCustomer(_selectedCustomer!.id);
        AppHelpers.showSnackBar(context, 'Transaction added', isSuccess: true);
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        AppHelpers.showSnackBar(context, 'Failed to add transaction', isError: true);
      }
    }
    if (mounted) setState(() => _isSaving = false);
  }

  @override
  Widget build(BuildContext context) {
    final customerProv = context.watch<CustomerProvider>();

    return Scaffold(
      appBar: AppBar(title: const Text('Add Transaction')),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            _buildTypeToggle(),
            const SizedBox(height: 20),
            _buildCustomerPicker(customerProv),
            const SizedBox(height: 16),
            CustomTextField(
              label: 'Amount (₹) *',
              hint: 'Enter amount',
              controller: _amountController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              inputFormatters: [
                FilteringTextInputFormatter.allow(RegExp(r'[\d.]')),
              ],
              validator: AppValidators.validateAmount,
              prefixIcon: const Padding(
                padding: EdgeInsets.all(14),
                child: Text('₹',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
              ),
              textInputAction: TextInputAction.next,
            ),
            const SizedBox(height: 16),
            _buildCategoryPicker(),
            const SizedBox(height: 16),
            _buildDatePicker(),
            const SizedBox(height: 16),
            CustomTextField(
              label: 'Notes (Optional)',
              hint: 'Add notes',
              controller: _notesController,
              maxLines: 2,
              maxLength: 500,
              validator: AppValidators.validateNotes,
              prefixIcon: const Icon(Icons.notes_outlined),
            ),
            const SizedBox(height: 32),
            CustomButton(
              label: 'Save Transaction',
              onPressed: _save,
              isLoading: _isSaving,
              icon: Icons.save,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTypeToggle() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Transaction Type',
                style: Theme.of(context).textTheme.titleSmall),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _TypeButton(
                    label: 'Debit (Sale)',
                    icon: Icons.arrow_upward,
                    color: AppConfig.debitColor,
                    selected: _type == 'debit',
                    onTap: () => setState(() => _type = 'debit'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _TypeButton(
                    label: 'Credit (Payment)',
                    icon: Icons.arrow_downward,
                    color: AppConfig.creditColor,
                    selected: _type == 'credit',
                    onTap: () => setState(() {
                      _type = 'credit';
                      _category = 'Payment';
                    }),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCustomerPicker(CustomerProvider customerProv) {
    return GestureDetector(
      onTap: () => _showCustomerPicker(customerProv),
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
            fontSize: 16,
          ),
        ),
      ),
    );
  }

  void _showCustomerPicker(CustomerProvider customerProv) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(16))),
      builder: (ctx) {
        return DraggableScrollableSheet(
          initialChildSize: 0.7,
          maxChildSize: 0.9,
          minChildSize: 0.4,
          expand: false,
          builder: (_, controller) => Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: Text('Select Customer',
                    style: Theme.of(context).textTheme.titleMedium),
              ),
              Expanded(
                child: ListView.builder(
                  controller: controller,
                  itemCount: customerProv.customers.length,
                  itemBuilder: (_, i) {
                    final c = customerProv.customers[i];
                    return ListTile(
                      leading: CircleAvatar(
                        backgroundColor:
                            AppHelpers.getAvatarColor(c.name),
                        child: Text(
                          AppFormatters.initials(c.name),
                          style: const TextStyle(
                              color: Colors.white, fontWeight: FontWeight.bold),
                        ),
                      ),
                      title: Text(c.name),
                      subtitle: Text(c.phone),
                      trailing: c.balance != 0
                          ? Text(
                              AppFormatters.formatAmount(c.balance.abs()),
                              style: TextStyle(
                                color: c.balance > 0
                                    ? AppConfig.debitColor
                                    : AppConfig.creditColor,
                                fontWeight: FontWeight.w500,
                                fontSize: 12,
                              ),
                            )
                          : null,
                      onTap: () {
                        setState(() => _selectedCustomer = c);
                        Navigator.pop(ctx);
                      },
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildCategoryPicker() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Category', style: Theme.of(context).textTheme.labelLarge),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: AppConfig.transactionCategories
              .map((cat) => ChoiceChip(
                    label: Text(cat),
                    selected: _category == cat,
                    onSelected: (_) => setState(() => _category = cat),
                    selectedColor: _type == 'debit'
                        ? AppConfig.debitColor
                        : AppConfig.creditColor,
                    labelStyle: TextStyle(
                      color: _category == cat ? Colors.white : null,
                      fontSize: 12,
                    ),
                  ))
              .toList(),
        ),
      ],
    );
  }

  Widget _buildDatePicker() {
    return GestureDetector(
      onTap: _pickDate,
      child: InputDecorator(
        decoration: InputDecoration(
          labelText: 'Date',
          prefixIcon: const Icon(Icons.calendar_today_outlined),
          suffixIcon: const Icon(Icons.edit_calendar),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
        ),
        child: Text(
          AppFormatters.formatDate(_selectedDate),
          style: const TextStyle(fontSize: 16),
        ),
      ),
    );
  }
}

class _TypeButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final Color color;
  final bool selected;
  final VoidCallback onTap;

  const _TypeButton({
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
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: selected ? color.withOpacity(0.15) : Colors.grey.shade50,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: selected ? color : Colors.grey.shade300,
            width: selected ? 2 : 1,
          ),
        ),
        child: Column(
          children: [
            Icon(icon, color: selected ? color : Colors.grey, size: 22),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                color: selected ? color : Colors.grey,
                fontWeight:
                    selected ? FontWeight.bold : FontWeight.normal,
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
