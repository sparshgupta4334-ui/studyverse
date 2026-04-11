import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../../providers/customer_provider.dart';
import '../../models/customer.dart';
import '../../services/payment_service.dart';
import '../../services/database_service.dart';
import '../../config/app_config.dart';
import '../../utils/validators.dart';
import '../../utils/helpers.dart';
import '../../utils/formatters.dart';
import '../../widgets/custom/custom_button.dart';
import '../../widgets/custom/custom_text_field.dart';

class PaymentScreen extends StatefulWidget {
  final Customer? customer;

  const PaymentScreen({super.key, this.customer});

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  final _formKey = GlobalKey<FormState>();
  final _amountController = TextEditingController();
  final _upiController = TextEditingController();
  final _notesController = TextEditingController();
  final _paymentService = PaymentService();
  final _dbService = DatabaseService();
  Customer? _selectedCustomer;
  bool _isProcessing = false;

  @override
  void initState() {
    super.initState();
    _selectedCustomer = widget.customer;
    if (widget.customer != null) {
      _amountController.text = widget.customer!.balance > 0
          ? widget.customer!.balance.toStringAsFixed(0)
          : '';
    }
    _upiController.text = AppConfig.defaultUpiId;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CustomerProvider>().loadCustomers();
    });
  }

  @override
  void dispose() {
    _amountController.dispose();
    _upiController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _collectPayment(String method) async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedCustomer == null) {
      AppHelpers.showSnackBar(context, 'Please select a customer', isError: true);
      return;
    }
    setState(() => _isProcessing = true);

    final amount = double.parse(_amountController.text.replaceAll(',', ''));
    bool launched = false;

    try {
      switch (method) {
        case 'upi':
          launched = await _paymentService.initiateUpiPayment(
            amount: amount,
            customerName: _selectedCustomer!.name,
            upiId: _upiController.text.trim().isEmpty
                ? null
                : _upiController.text.trim(),
          );
          break;
        case 'gpay':
          launched = await _paymentService.openGooglePay(amount: amount);
          break;
        case 'phonepe':
          launched = await _paymentService.openPhonePe(amount: amount);
          break;
        case 'paytm':
          launched = await _paymentService.openPaytm(amount: amount);
          break;
      }

      if (launched) {
        await _dbService.addPayment(
          customerId: _selectedCustomer!.id,
          amount: amount,
          notes: _notesController.text.trim().isEmpty
              ? null
              : _notesController.text.trim(),
        );
        if (mounted) {
          AppHelpers.showSnackBar(context, 'Payment initiated. Please complete in your UPI app.',
              isSuccess: true);
        }
      } else {
        if (mounted) {
          AppHelpers.showSnackBar(context, 'Could not open the payment app', isError: true);
        }
      }
    } catch (e) {
      if (mounted) {
        AppHelpers.showSnackBar(context, 'Payment failed', isError: true);
      }
    }

    if (mounted) setState(() => _isProcessing = false);
  }

  @override
  Widget build(BuildContext context) {
    final customerProv = context.watch<CustomerProvider>();

    return Scaffold(
      appBar: AppBar(title: const Text('Collect Payment')),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            if (widget.customer == null) ...[
              _buildCustomerPicker(customerProv),
              const SizedBox(height: 16),
            ],
            if (_selectedCustomer != null) _buildCustomerCard(),
            const SizedBox(height: 16),
            CustomTextField(
              label: 'Amount (₹) *',
              controller: _amountController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              inputFormatters: [
                FilteringTextInputFormatter.allow(RegExp(r'[\d.]')),
              ],
              validator: AppValidators.validateAmount,
              prefixIcon: const Padding(
                padding: EdgeInsets.all(14),
                child: Text('₹',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
              ),
            ),
            const SizedBox(height: 16),
            CustomTextField(
              label: 'UPI ID',
              hint: 'e.g., name@upi',
              controller: _upiController,
              validator: AppValidators.validateUpiId,
              prefixIcon: const Icon(Icons.payment_outlined),
            ),
            const SizedBox(height: 16),
            CustomTextField(
              label: 'Notes (Optional)',
              controller: _notesController,
              maxLines: 2,
              prefixIcon: const Icon(Icons.notes_outlined),
            ),
            const SizedBox(height: 24),
            Text('Pay via', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 12),
            _buildPaymentOptions(),
            const SizedBox(height: 24),
            CustomButton(
              label: 'Collect via Any UPI App',
              onPressed: () => _collectPayment('upi'),
              isLoading: _isProcessing,
              icon: Icons.payment,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCustomerCard() {
    final c = _selectedCustomer!;
    return Card(
      color: AppConfig.primaryColor.withOpacity(0.05),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            CircleAvatar(
              backgroundColor: AppHelpers.getAvatarColor(c.name),
              child: Text(AppFormatters.initials(c.name),
                  style: const TextStyle(
                      color: Colors.white, fontWeight: FontWeight.bold)),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(c.name, style: Theme.of(context).textTheme.titleSmall),
                  Text(c.phone, style: Theme.of(context).textTheme.bodySmall),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(AppFormatters.formatAmount(c.balance.abs()),
                    style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        color: AppConfig.debitColor)),
                const Text('Outstanding',
                    style: TextStyle(fontSize: 10, color: Colors.grey)),
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
              fontSize: 16),
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
      builder: (ctx) => DraggableScrollableSheet(
        initialChildSize: 0.7,
        maxChildSize: 0.9,
        minChildSize: 0.4,
        expand: false,
        builder: (_, c) => ListView.builder(
          controller: c,
          itemCount: customerProv.customers.length,
          itemBuilder: (_, i) {
            final cust = customerProv.customers[i];
            return ListTile(
              title: Text(cust.name),
              subtitle: Text(cust.phone),
              trailing: cust.balance > 0
                  ? Text(AppFormatters.formatAmount(cust.balance),
                      style: const TextStyle(color: AppConfig.debitColor))
                  : null,
              onTap: () {
                setState(() {
                  _selectedCustomer = cust;
                  if (cust.balance > 0) {
                    _amountController.text =
                        cust.balance.toStringAsFixed(0);
                  }
                });
                Navigator.pop(ctx);
              },
            );
          },
        ),
      ),
    );
  }

  Widget _buildPaymentOptions() {
    return Row(
      children: [
        Expanded(
            child: _PaymentOption(
                label: 'GPay',
                icon: Icons.g_mobiledata,
                color: Colors.blue,
                onTap: () => _collectPayment('gpay'))),
        const SizedBox(width: 8),
        Expanded(
            child: _PaymentOption(
                label: 'PhonePe',
                icon: Icons.phone_android,
                color: const Color(0xFF5F259F),
                onTap: () => _collectPayment('phonepe'))),
        const SizedBox(width: 8),
        Expanded(
            child: _PaymentOption(
                label: 'Paytm',
                icon: Icons.account_balance_wallet,
                color: Colors.blue.shade700,
                onTap: () => _collectPayment('paytm'))),
      ],
    );
  }
}

class _PaymentOption extends StatelessWidget {
  final String label;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const _PaymentOption(
      {required this.label,
      required this.icon,
      required this.color,
      required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade200),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 4),
            Text(label, style: const TextStyle(fontSize: 12)),
          ],
        ),
      ),
    );
  }
}
