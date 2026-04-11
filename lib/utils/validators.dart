class AppValidators {
  static String? validatePhone(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Phone number is required';
    }
    final clean = value.replaceAll(RegExp(r'[^0-9]'), '');
    if (clean.length != 10) {
      return 'Enter a valid 10-digit phone number';
    }
    if (!RegExp(r'^[6-9]\d{9}$').hasMatch(clean)) {
      return 'Enter a valid Indian mobile number';
    }
    return null;
  }

  static String? validateOtp(String? value) {
    if (value == null || value.trim().isEmpty) return 'OTP is required';
    if (value.trim().length != 6) return 'Enter a valid 6-digit OTP';
    if (!RegExp(r'^\d{6}$').hasMatch(value.trim())) return 'OTP must be 6 digits';
    return null;
  }

  static String? validateName(String? value) {
    if (value == null || value.trim().isEmpty) return 'Name is required';
    if (value.trim().length < 2) return 'Name must be at least 2 characters';
    if (value.trim().length > 100) return 'Name is too long';
    return null;
  }

  static String? validateEmail(String? value) {
    if (value == null || value.trim().isEmpty) return null; // optional
    if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value.trim())) {
      return 'Enter a valid email address';
    }
    return null;
  }

  static String? validateAmount(String? value) {
    if (value == null || value.trim().isEmpty) return 'Amount is required';
    final amount = double.tryParse(value.replaceAll(',', ''));
    if (amount == null) return 'Enter a valid amount';
    if (amount <= 0) return 'Amount must be greater than 0';
    if (amount > 10000000) return 'Amount cannot exceed ₹1,00,00,000';
    return null;
  }

  static String? validateRequired(String? value, {String? fieldName}) {
    if (value == null || value.trim().isEmpty) {
      return '${fieldName ?? 'This field'} is required';
    }
    return null;
  }

  static String? validateNotes(String? value) {
    if (value != null && value.length > 500) {
      return 'Notes cannot exceed 500 characters';
    }
    return null;
  }

  static String? validateUpiId(String? value) {
    if (value == null || value.trim().isEmpty) return null; // optional
    if (!RegExp(r'^[\w.-]+@[\w]+$').hasMatch(value.trim())) {
      return 'Enter a valid UPI ID (e.g., name@upi)';
    }
    return null;
  }
}
