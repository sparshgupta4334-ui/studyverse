import 'package:flutter/material.dart';
import '../models/user.dart';
import '../services/auth_service.dart';

enum AuthStatus { initial, loading, authenticated, unauthenticated, error }

class AuthProvider extends ChangeNotifier {
  AuthStatus _status = AuthStatus.initial;
  UserModel? _user;
  String? _errorMessage;
  bool _isOtpSent = false;
  bool _isOtpLoading = false;

  AuthStatus get status => _status;
  UserModel? get user => _user;
  String? get errorMessage => _errorMessage;
  bool get isOtpSent => _isOtpSent;
  bool get isOtpLoading => _isOtpLoading;
  bool get isAuthenticated => _status == AuthStatus.authenticated;
  bool get isLoading => _status == AuthStatus.loading;

  AuthProvider() {
    _checkAuthStatus();
  }

  Future<void> _checkAuthStatus() async {
    _status = AuthStatus.loading;
    notifyListeners();

    try {
      final user = await AuthService.instance.loadSavedUser();
      if (user != null) {
        _user = user;
        _status = AuthStatus.authenticated;
      } else {
        _status = AuthStatus.unauthenticated;
      }
    } catch (_) {
      _status = AuthStatus.unauthenticated;
    }

    notifyListeners();
  }

  Future<void> sendOtp(String phone) async {
    _isOtpLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      await AuthService.instance.sendOtp(
        phone: phone,
        onCodeSent: (verificationId) {
          _isOtpSent = true;
          _isOtpLoading = false;
          notifyListeners();
        },
        onError: (error) {
          _errorMessage = error;
          _isOtpLoading = false;
          notifyListeners();
        },
      );
    } catch (e) {
      _errorMessage = e.toString();
      _isOtpLoading = false;
      notifyListeners();
    }
  }

  Future<bool> verifyOtp(String otp, String phone) async {
    _status = AuthStatus.loading;
    _errorMessage = null;
    notifyListeners();

    try {
      _user = await AuthService.instance.verifyOtp(otp: otp, phone: phone);
      _status = AuthStatus.authenticated;
      _isOtpSent = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      _status = AuthStatus.unauthenticated;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    await AuthService.instance.logout();
    _user = null;
    _status = AuthStatus.unauthenticated;
    _isOtpSent = false;
    notifyListeners();
  }

  Future<bool> updateProfile({String? name, String? email}) async {
    try {
      _user = await AuthService.instance.updateProfile(name: name, email: email);
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
      return false;
    }
  }

  void resetOtpState() {
    _isOtpSent = false;
    _errorMessage = null;
    notifyListeners();
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
