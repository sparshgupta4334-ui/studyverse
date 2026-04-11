import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../config/app_config.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';

enum AuthStatus { initial, loading, authenticated, unauthenticated, error }

class AuthProvider extends ChangeNotifier {
  AuthStatus _status = AuthStatus.initial;
  UserModel? _user;
  String? _errorMessage;
  bool _isDarkMode = false;

  AuthStatus get status => _status;
  UserModel? get user => _user;
  String? get errorMessage => _errorMessage;
  bool get isDarkMode => _isDarkMode;
  bool get isAuthenticated => _status == AuthStatus.authenticated;

  AuthProvider() {
    _init();
  }

  Future<void> _init() async {
    await _loadDarkMode();
    await checkAuthStatus();
  }

  Future<void> _loadDarkMode() async {
    final prefs = await SharedPreferences.getInstance();
    _isDarkMode = prefs.getBool(AppConfig.darkModeKey) ?? false;
    notifyListeners();
  }

  Future<void> checkAuthStatus() async {
    _status = AuthStatus.loading;
    notifyListeners();

    try {
      final loggedIn = await AuthService.instance.isLoggedIn();
      if (loggedIn) {
        _user = await AuthService.instance.getStoredUser();
        _status = AuthStatus.authenticated;
      } else {
        _status = AuthStatus.unauthenticated;
      }
    } catch (_) {
      _status = AuthStatus.unauthenticated;
    }
    notifyListeners();
  }

  Future<void> sendOtp({
    required String phoneNumber,
    required void Function(String verificationId, int? resendToken) onCodeSent,
    required void Function(String error) onError,
  }) async {
    _status = AuthStatus.loading;
    _errorMessage = null;
    notifyListeners();

    await AuthService.instance.sendOtp(
      phoneNumber: phoneNumber,
      onCodeSent: (verificationId, resendToken) {
        _status = AuthStatus.unauthenticated;
        notifyListeners();
        onCodeSent(verificationId, resendToken);
      },
      onError: (error) {
        _status = AuthStatus.error;
        _errorMessage = error;
        notifyListeners();
        onError(error);
      },
      onAutoVerified: () async {
        _user = await AuthService.instance.getStoredUser();
        _status = AuthStatus.authenticated;
        notifyListeners();
      },
    );
  }

  Future<bool> verifyOtp({
    required String verificationId,
    required String smsCode,
  }) async {
    _status = AuthStatus.loading;
    _errorMessage = null;
    notifyListeners();

    try {
      final user = await AuthService.instance.verifyOtp(
        verificationId: verificationId,
        smsCode: smsCode,
      );

      if (user != null) {
        _user = user;
        _status = AuthStatus.authenticated;
        notifyListeners();
        return true;
      } else {
        _status = AuthStatus.error;
        _errorMessage = 'Verification failed. Please try again.';
        notifyListeners();
        return false;
      }
    } catch (e) {
      _status = AuthStatus.error;
      _errorMessage = e.toString().replaceFirst('Exception: ', '');
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    _status = AuthStatus.loading;
    notifyListeners();

    await AuthService.instance.logout();

    _user = null;
    _status = AuthStatus.unauthenticated;
    notifyListeners();
  }

  Future<void> toggleDarkMode() async {
    _isDarkMode = !_isDarkMode;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(AppConfig.darkModeKey, _isDarkMode);
    notifyListeners();
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
