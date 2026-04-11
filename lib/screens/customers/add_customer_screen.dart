import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/customer_provider.dart';
import '../../models/customer.dart';
import '../../utils/validators.dart';
import '../../utils/helpers.dart';
import '../../config/app_config.dart';
import '../../widgets/custom/custom_button.dart';
import '../../widgets/custom/custom_text_field.dart';

class AddCustomerScreen extends StatefulWidget {
  final Customer? customer; // If set, edit mode

  const AddCustomerScreen({super.key, this.customer});

  @override
  State<AddCustomerScreen> createState() => _AddCustomerScreenState();
}

class _AddCustomerScreenState extends State<AddCustomerScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _addressController = TextEditingController();
  final _notesController = TextEditingController();
  String _selectedCategory = 'Regular';
  bool _isSaving = false;

  bool get _isEdit => widget.customer != null;

  @override
  void initState() {
    super.initState();
    if (_isEdit) {
      final c = widget.customer!;
      _nameController.text = c.name;
      _phoneController.text = c.phone;
      _emailController.text = c.email ?? '';
      _addressController.text = c.address ?? '';
      _notesController.text = c.notes ?? '';
      _selectedCategory = c.category;
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _addressController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isSaving = true);

    try {
      final provider = context.read<CustomerProvider>();
      if (_isEdit) {
        final updated = widget.customer!.copyWith(
          name: _nameController.text.trim(),
          phone: _phoneController.text.trim(),
          email: _emailController.text.trim().isEmpty
              ? null
              : _emailController.text.trim(),
          address: _addressController.text.trim().isEmpty
              ? null
              : _addressController.text.trim(),
          notes: _notesController.text.trim().isEmpty
              ? null
              : _notesController.text.trim(),
          category: _selectedCategory,
          updatedAt: DateTime.now(),
        );
        await provider.updateCustomer(updated);
        if (mounted) {
          AppHelpers.showSnackBar(context, 'Customer updated', isSuccess: true);
          Navigator.pop(context);
        }
      } else {
        await provider.addCustomer(
          name: _nameController.text.trim(),
          phone: _phoneController.text.trim(),
          email: _emailController.text.trim().isEmpty
              ? null
              : _emailController.text.trim(),
          address: _addressController.text.trim().isEmpty
              ? null
              : _addressController.text.trim(),
          category: _selectedCategory,
          notes: _notesController.text.trim().isEmpty
              ? null
              : _notesController.text.trim(),
        );
        if (mounted) {
          AppHelpers.showSnackBar(context, 'Customer added successfully',
              isSuccess: true);
          Navigator.pop(context);
        }
      }
    } catch (e) {
      if (mounted) {
        AppHelpers.showSnackBar(context, 'Failed to save customer',
            isError: true);
      }
    }
    if (mounted) setState(() => _isSaving = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_isEdit ? 'Edit Customer' : 'Add Customer'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            CustomTextField(
              label: 'Full Name *',
              hint: 'Enter customer name',
              controller: _nameController,
              validator: AppValidators.validateName,
              textInputAction: TextInputAction.next,
              prefixIcon: const Icon(Icons.person_outline),
            ),
            const SizedBox(height: 16),
            CustomTextField(
              label: 'Mobile Number *',
              hint: '10-digit mobile number',
              controller: _phoneController,
              keyboardType: TextInputType.phone,
              validator: AppValidators.validatePhone,
              textInputAction: TextInputAction.next,
              prefixIcon: const Icon(Icons.phone_outlined),
              maxLength: 10,
            ),
            const SizedBox(height: 16),
            CustomTextField(
              label: 'Email (Optional)',
              hint: 'customer@email.com',
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              validator: AppValidators.validateEmail,
              textInputAction: TextInputAction.next,
              prefixIcon: const Icon(Icons.email_outlined),
            ),
            const SizedBox(height: 16),
            CustomTextField(
              label: 'Address (Optional)',
              hint: 'Full address',
              controller: _addressController,
              maxLines: 2,
              textInputAction: TextInputAction.next,
              prefixIcon: const Icon(Icons.location_on_outlined),
            ),
            const SizedBox(height: 16),
            _buildCategorySelector(),
            const SizedBox(height: 16),
            CustomTextField(
              label: 'Notes (Optional)',
              hint: 'Any additional notes',
              controller: _notesController,
              maxLines: 2,
              maxLength: 500,
              validator: AppValidators.validateNotes,
              prefixIcon: const Icon(Icons.notes_outlined),
            ),
            const SizedBox(height: 32),
            CustomButton(
              label: _isEdit ? 'Update Customer' : 'Add Customer',
              onPressed: _save,
              isLoading: _isSaving,
              icon: _isEdit ? Icons.save : Icons.person_add,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategorySelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Category',
            style: Theme.of(context).textTheme.labelLarge),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          children: AppConfig.customerCategories
              .map((cat) => ChoiceChip(
                    label: Text(cat),
                    selected: _selectedCategory == cat,
                    onSelected: (_) =>
                        setState(() => _selectedCategory = cat),
                    selectedColor: AppConfig.primaryColor,
                    labelStyle: TextStyle(
                      color: _selectedCategory == cat
                          ? Colors.white
                          : Colors.black87,
                    ),
                  ))
              .toList(),
        ),
      ],
    );
  }
}
