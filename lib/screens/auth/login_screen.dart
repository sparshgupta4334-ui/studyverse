import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../config/app_config.dart';
import '../../config/constants.dart';
import '../../utils/validators.dart';
import '../../utils/helpers.dart';
import '../../widgets/custom/custom_button.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _phoneController = TextEditingController();
  bool _agreed = false;

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> _sendOtp() async {
    if (!_formKey.currentState!.validate()) return;
    if (!_agreed) {
      AppHelpers.showSnackBar(context, 'Please agree to the Terms & Conditions',
          isError: true);
      return;
    }
    final auth = context.read<AuthProvider>();
    final phone = _phoneController.text.trim();
    final sent = await auth.sendOtp(phone);
    if (sent && mounted) {
      Navigator.pushNamed(context, AppConstants.routeOtp);
    } else if (mounted && auth.errorMessage != null) {
      AppHelpers.showSnackBar(context, auth.errorMessage!, isError: true);
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 40),
                _buildHeader(),
                const SizedBox(height: 48),
                _buildPhoneForm(authProvider),
                const SizedBox(height: 32),
                _buildDemoNote(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 72,
          height: 72,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [AppConfig.primaryColor, AppConfig.primaryDark],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: AppConfig.primaryColor.withOpacity(0.3),
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: const Icon(Icons.store, color: Colors.white, size: 40),
        ),
        const SizedBox(height: 24),
        Text(
          AppConfig.appName,
          style: const TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: Color(0xFF111827),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          AppConfig.appTagline,
          style: const TextStyle(fontSize: 15, color: Color(0xFF6B7280)),
        ),
        const SizedBox(height: 8),
        const Text(
          'Sign in to manage your business ledger',
          style: TextStyle(fontSize: 14, color: Color(0xFF9CA3AF)),
        ),
      ],
    );
  }

  Widget _buildPhoneForm(AuthProvider authProvider) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Enter your mobile number',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: Color(0xFF374151),
          ),
        ),
        const SizedBox(height: 12),
        TextFormField(
          controller: _phoneController,
          keyboardType: TextInputType.phone,
          maxLength: 10,
          autofocus: true,
          inputFormatters: [FilteringTextInputFormatter.digitsOnly],
          validator: AppValidators.validatePhone,
          textInputAction: TextInputAction.done,
          onFieldSubmitted: (_) => _sendOtp(),
          decoration: InputDecoration(
            labelText: 'Mobile Number',
            hintText: '10-digit mobile number',
            counterText: '',
            prefixIcon: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
              child: const Text(
                '+91',
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 16,
                  color: Color(0xFF374151),
                ),
              ),
            ),
          ),
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Checkbox(
              value: _agreed,
              onChanged: (v) => setState(() => _agreed = v ?? false),
              activeColor: AppConfig.primaryColor,
            ),
            Expanded(
              child: GestureDetector(
                onTap: () => setState(() => _agreed = !_agreed),
                child: const Text(
                  'I agree to the Terms of Service and Privacy Policy',
                  style: TextStyle(fontSize: 13, color: Color(0xFF6B7280)),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 24),
        CustomButton(
          label: 'Send OTP',
          onPressed: _sendOtp,
          isLoading: authProvider.isLoading,
          icon: Icons.send,
        ),
      ],
    );
  }

  Widget _buildDemoNote() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppConfig.primaryColor.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppConfig.primaryColor.withOpacity(0.2)),
      ),
      child: Row(
        children: [
          const Icon(Icons.info_outline, color: AppConfig.primaryColor, size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  'Demo Mode',
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: AppConfig.primaryColor,
                    fontSize: 13,
                  ),
                ),
                SizedBox(height: 2),
                Text(
                  'Enter any 10-digit phone number and use OTP: 123456',
                  style: TextStyle(
                    color: Color(0xFF4B5563),
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
