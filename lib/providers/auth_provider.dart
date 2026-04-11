import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../models/user.dart';

enum AuthStatus { unknown, authenticated, unauthenticated, loading }

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();

  AuthStatus _status = AuthStatus.unknown;
  AuthStatus get status => _status;

  User? get currentUser => _authService.currentUser;
  bool get isAuthenticated => _status == AuthStatus.authenticated;
  bool get isLoading => _status == AuthStatus.loading;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  String? _pendingPhone;
  String? get pendingPhone => _pendingPhone;

  Future<void> checkAuthStatus() async {
    _status = AuthStatus.loading;
    notifyListeners();
    final loggedIn = await _authService.isLoggedIn();
    _status = loggedIn ? AuthStatus.authenticated : AuthStatus.unauthenticated;
    notifyListeners();
  }

  Future<bool> sendOtp(String phone) async {
    _status = AuthStatus.loading;
    _errorMessage = null;
    notifyListeners();
    try {
      final result = await _authService.sendOtp(phone);
      if (result['success'] == true) {
        _pendingPhone = phone;
        _status = AuthStatus.unauthenticated;
        notifyListeners();
        return true;
      }
      _errorMessage = result['message'] as String?;
    } catch (e) {
      _errorMessage = 'Failed to send OTP. Please try again.';
    }
    _status = AuthStatus.unauthenticated;
    notifyListeners();
    return false;
  }

  Future<bool> verifyOtp(String otp) async {
    if (_pendingPhone == null) return false;
    _status = AuthStatus.loading;
    _errorMessage = null;
    notifyListeners();
    try {
      final result = await _authService.verifyOtp(_pendingPhone!, otp);
      if (result['success'] == true) {
        _status = AuthStatus.authenticated;
        _pendingPhone = null;
        notifyListeners();
        return true;
      }
      _errorMessage = result['message'] as String?;
    } catch (e) {
      _errorMessage = 'OTP verification failed. Please try again.';
    }
    _status = AuthStatus.unauthenticated;
    notifyListeners();
    return false;
  }

  Future<void> logout() async {
    await _authService.logout();
    _status = AuthStatus.unauthenticated;
    _pendingPhone = null;
    _errorMessage = null;
    notifyListeners();
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
