import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import '../../config/app_theme.dart';
import '../../config/routes.dart';
import '../../providers/auth_provider.dart';

class PhoneScreen extends StatefulWidget {
  const PhoneScreen({super.key});

  @override
  State<PhoneScreen> createState() => _PhoneScreenState();
}

class _PhoneScreenState extends State<PhoneScreen> {
  final _formKey = GlobalKey<FormState>();
  final _phoneController = TextEditingController();
  String _countryCode = '+91';
  bool _isLoading = false;

  final List<Map<String, String>> _countryCodes = [
    {'code': '+91', 'name': 'India'},
    {'code': '+1', 'name': 'USA'},
    {'code': '+44', 'name': 'UK'},
    {'code': '+971', 'name': 'UAE'},
    {'code': '+65', 'name': 'Singapore'},
  ];

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  String? _validatePhone(String? value) {
    if (value == null || value.trim().isEmpty) return 'Phone number is required';
    final digits = value.replaceAll(RegExp(r'\D'), '');
    if (digits.length < 7 || digits.length > 12) {
      return 'Enter a valid phone number';
    }
    return null;
  }

  Future<void> _sendOtp() async {
    if (!_formKey.currentState!.validate()) return;

    final phone = '$_countryCode${_phoneController.text.trim()}';

    setState(() => _isLoading = true);

    await context.read<AuthProvider>().sendOtp(
      phoneNumber: phone,
      onCodeSent: (verificationId, resendToken) {
        if (!mounted) return;
        setState(() => _isLoading = false);
        Navigator.of(context).pushNamed(
          AppRoutes.otp,
          arguments: {
            'phoneNumber': phone,
            'verificationId': verificationId,
          },
        );
      },
      onError: (error) {
        if (!mounted) return;
        setState(() => _isLoading = false);
        _showError(error);
      },
    );
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: AppTheme.payableRed,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final size = MediaQuery.of(context).size;

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: SizedBox(
            height: size.height - MediaQuery.of(context).padding.top,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 28),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(height: size.height * 0.08),
                  // Header icon
                  Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      color: AppTheme.primaryGreen.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(18),
                    ),
                    child: const Icon(
                      Icons.account_balance_wallet_rounded,
                      size: 40,
                      color: AppTheme.primaryGreen,
                    ),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'Welcome to\nKhataBook Pro',
                    style: theme.textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                      height: 1.2,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Enter your phone number to get started',
                    style: theme.textTheme.bodyLarge?.copyWith(
                      color: theme.colorScheme.onSurface.withOpacity(0.6),
                    ),
                  ),
                  SizedBox(height: size.height * 0.06),

                  // Form
                  Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        // Country code + phone
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Country picker
                            Container(
                              decoration: BoxDecoration(
                                border: Border.all(
                                    color: const Color(0xFFE0E0E0)),
                                borderRadius: BorderRadius.circular(10),
                                color: theme.colorScheme.surface,
                              ),
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 12, vertical: 4),
                              child: DropdownButtonHideUnderline(
                                child: DropdownButton<String>(
                                  value: _countryCode,
                                  items: _countryCodes
                                      .map((c) => DropdownMenuItem(
                                            value: c['code'],
                                            child: Text(
                                              '${c['code']} ${c['name']}',
                                              style: const TextStyle(
                                                  fontSize: 14),
                                            ),
                                          ))
                                      .toList(),
                                  onChanged: (val) {
                                    if (val != null) {
                                      setState(() => _countryCode = val);
                                    }
                                  },
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            // Phone field
                            Expanded(
                              child: TextFormField(
                                controller: _phoneController,
                                keyboardType: TextInputType.phone,
                                inputFormatters: [
                                  FilteringTextInputFormatter.digitsOnly,
                                  LengthLimitingTextInputFormatter(12),
                                ],
                                decoration: const InputDecoration(
                                  labelText: 'Phone Number',
                                  hintText: '9876543210',
                                  prefixIcon: Icon(Icons.phone_outlined),
                                ),
                                validator: _validatePhone,
                                onFieldSubmitted: (_) => _sendOtp(),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 32),
                        SizedBox(
                          width: double.infinity,
                          height: 52,
                          child: ElevatedButton(
                            onPressed: _isLoading ? null : _sendOtp,
                            child: _isLoading
                                ? const SizedBox(
                                    width: 22,
                                    height: 22,
                                    child: CircularProgressIndicator(
                                      color: Colors.white,
                                      strokeWidth: 2.5,
                                    ),
                                  )
                                : const Text('Send OTP'),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const Spacer(),
                  // Terms
                  Padding(
                    padding: const EdgeInsets.only(bottom: 24),
                    child: Text(
                      'By continuing, you agree to our Terms of Service and Privacy Policy.',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: theme.colorScheme.onSurface.withOpacity(0.5),
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
