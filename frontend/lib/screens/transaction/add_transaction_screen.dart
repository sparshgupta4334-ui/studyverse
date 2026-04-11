import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import '../../config/app_theme.dart';
import '../../models/transaction_model.dart';
import '../../providers/customer_provider.dart';
import '../../providers/transaction_provider.dart';

class AddTransactionScreen extends StatefulWidget {
  final String customerId;
  final String customerName;

  const AddTransactionScreen({
    super.key,
    required this.customerId,
    required this.customerName,
  });

  @override
  State<AddTransactionScreen> createState() => _AddTransactionScreenState();
}

class _AddTransactionScreenState extends State<AddTransactionScreen> {
  final _formKey = GlobalKey<FormState>();
  final _amountController = TextEditingController();
  final _notesController = TextEditingController();
  TransactionType _type = TransactionType.credit;
  bool _isSaving = false;

  @override
  void dispose() {
    _amountController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  String? _validateAmount(String? value) {
    if (value == null || value.trim().isEmpty) return 'Amount is required';
    final amount = double.tryParse(value.replaceAll(',', ''));
    if (amount == null || amount <= 0) return 'Enter a valid amount';
    if (amount > 10000000) return 'Amount too large';
    return null;
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSaving = true);

    final amount =
        double.parse(_amountController.text.trim().replaceAll(',', ''));

    final success = await context.read<TransactionProvider>().addTransaction(
          customerId: widget.customerId,
          amount: amount,
          type: _type,
          notes: _notesController.text.trim().isEmpty
              ? null
              : _notesController.text.trim(),
        );

    if (!mounted) return;

    if (success) {
      // Update customer balance in provider
      final delta =
          _type == TransactionType.credit ? amount : -amount;
      context
          .read<CustomerProvider>()
          .updateCustomerBalance(widget.customerId, delta);

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            '${_type == TransactionType.credit ? "Credit" : "Debit"} of ₹${amount.toStringAsFixed(2)} added',
          ),
          backgroundColor: _type == TransactionType.credit
              ? AppTheme.receivableGreen
              : AppTheme.payableRed,
          behavior: SnackBarBehavior.floating,
        ),
      );
      Navigator.of(context).pop(true);
    } else {
      setState(() => _isSaving = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            context.read<TransactionProvider>().errorMessage ??
                'Failed to add transaction',
          ),
          backgroundColor: AppTheme.payableRed,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isCredit = _type == TransactionType.credit;
    final activeColor =
        isCredit ? AppTheme.receivableGreen : AppTheme.payableRed;

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.customerName),
        backgroundColor: activeColor,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Type toggle
            Container(
              color: activeColor,
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
              child: Column(
                children: [
                  // Toggle buttons
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    padding: const EdgeInsets.all(4),
                    child: Row(
                      children: [
                        _buildTypeButton(
                          label: 'Credit (Got)',
                          type: TransactionType.credit,
                          icon: Icons.arrow_downward_rounded,
                        ),
                        _buildTypeButton(
                          label: 'Debit (Gave)',
                          type: TransactionType.debit,
                          icon: Icons.arrow_upward_rounded,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    isCredit
                        ? '${widget.customerName} paid you'
                        : 'You gave to ${widget.customerName}',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.9),
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(20),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Amount input
                    TextFormField(
                      controller: _amountController,
                      keyboardType: const TextInputType.numberWithOptions(
                          decimal: true),
                      inputFormatters: [
                        FilteringTextInputFormatter.allow(
                            RegExp(r'[0-9,.]')),
                        LengthLimitingTextInputFormatter(12),
                      ],
                      autofocus: true,
                      style: TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: activeColor,
                      ),
                      decoration: InputDecoration(
                        labelText: 'Amount (₹)',
                        labelStyle: TextStyle(color: activeColor),
                        hintText: '0.00',
                        prefixIcon: Icon(Icons.currency_rupee_rounded,
                            color: activeColor),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10),
                          borderSide:
                              BorderSide(color: activeColor, width: 2),
                        ),
                      ),
                      validator: _validateAmount,
                      textInputAction: TextInputAction.next,
                    ),
                    const SizedBox(height: 20),

                    // Notes
                    TextFormField(
                      controller: _notesController,
                      maxLines: 3,
                      minLines: 1,
                      textCapitalization: TextCapitalization.sentences,
                      decoration: const InputDecoration(
                        labelText: 'Notes (optional)',
                        hintText: 'e.g. Goods sold, Loan, Advance...',
                        prefixIcon: Padding(
                          padding: EdgeInsets.only(bottom: 40),
                          child: Icon(Icons.note_outlined),
                        ),
                      ),
                      textInputAction: TextInputAction.done,
                      onFieldSubmitted: (_) => _save(),
                    ),
                    const SizedBox(height: 12),

                    // Date
                    Row(
                      children: [
                        const Icon(Icons.calendar_today_outlined,
                            size: 18, color: Colors.grey),
                        const SizedBox(width: 8),
                        Text(
                          'Date: Today, ${_todayDate()}',
                          style: theme.textTheme.bodyMedium,
                        ),
                      ],
                    ),
                    const SizedBox(height: 32),

                    // Save button
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton.icon(
                        onPressed: _isSaving ? null : _save,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: activeColor,
                        ),
                        icon: _isSaving
                            ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                    color: Colors.white, strokeWidth: 2),
                              )
                            : Icon(
                                isCredit
                                    ? Icons.arrow_downward_rounded
                                    : Icons.arrow_upward_rounded,
                              ),
                        label: Text(
                          isCredit ? 'Save Credit (Got)' : 'Save Debit (Gave)',
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTypeButton({
    required String label,
    required TransactionType type,
    required IconData icon,
  }) {
    final isSelected = _type == type;
    final isCredit = type == TransactionType.credit;
    final color = isCredit ? AppTheme.receivableGreen : AppTheme.payableRed;

    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _type = type),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: isSelected ? Colors.white : Colors.transparent,
            borderRadius: BorderRadius.circular(9),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 18,
                color: isSelected ? color : Colors.white,
              ),
              const SizedBox(width: 6),
              Text(
                label,
                style: TextStyle(
                  color: isSelected ? color : Colors.white,
                  fontWeight: FontWeight.w600,
                  fontSize: 13,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _todayDate() {
    final now = DateTime.now();
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return '${now.day} ${months[now.month - 1]} ${now.year}';
  }
}
