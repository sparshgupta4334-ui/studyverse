class AppValidators {
  AppValidators._();

  static String? validatePhone(String? value) {
    if (value == null || value.isEmpty) return 'Phone number is required';
    if (value.length != 10) return 'Enter a valid 10-digit number';
    if (!RegExp(r'^[6-9]\d{9}$').hasMatch(value)) return 'Enter a valid Indian mobile number';
    return null;
  }

  static String? validateName(String? value) {
    if (value == null || value.trim().isEmpty) return 'Name is required';
    if (value.trim().length < 2) return 'Name must be at least 2 characters';
    if (value.trim().length > 100) return 'Name must not exceed 100 characters';
    return null;
  }

  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) return null; // Email is optional
    if (!RegExp(r'^[\w.]+@[\w]+\.[a-z]{2,}$').hasMatch(value)) {
      return 'Enter a valid email address';
    }
    return null;
  }

  static String? validateAmount(String? value) {
    if (value == null || value.isEmpty) return 'Amount is required';
    final amount = double.tryParse(value);
    if (amount == null) return 'Enter a valid amount';
    if (amount <= 0) return 'Amount must be greater than 0';
    if (amount > 10000000) return 'Amount is too large';
    return null;
  }

  static String? validateOtp(String? value) {
    if (value == null || value.isEmpty) return 'OTP is required';
    if (value.length != 6) return 'Enter a 6-digit OTP';
    if (!RegExp(r'^\d{6}$').hasMatch(value)) return 'OTP must contain only digits';
    return null;
  }

  static String? validateNotes(String? value) {
    if (value == null || value.isEmpty) return null; // Notes are optional
    if (value.length > 500) return 'Notes must not exceed 500 characters';
    return null;
  }
}
