import 'dart:convert';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../config/app_config.dart';
import '../models/user_model.dart';
import 'api_service.dart';

enum AuthState { unauthenticated, authenticating, authenticated, error }

class AuthService {
  AuthService._();
  static final AuthService instance = AuthService._();

  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;

  String? _verificationId;
  int? _resendToken;

  // ── Phone OTP ──────────────────────────────────────────────────────────────

  Future<void> sendOtp({
    required String phoneNumber,
    required void Function(String verificationId, int? resendToken) onCodeSent,
    required void Function(String error) onError,
    required void Function() onAutoVerified,
  }) async {
    await _firebaseAuth.verifyPhoneNumber(
      phoneNumber: phoneNumber,
      resendToken: _resendToken,
      timeout: const Duration(seconds: AppConfig.otpResendSeconds),
      verificationCompleted: (PhoneAuthCredential credential) async {
        // Auto-retrieved on Android
        try {
          await _signInWithCredential(credential);
          onAutoVerified();
        } catch (e) {
          onError(e.toString());
        }
      },
      verificationFailed: (FirebaseAuthException e) {
        final message = _mapFirebaseError(e);
        onError(message);
      },
      codeSent: (String verificationId, int? resendToken) {
        _verificationId = verificationId;
        _resendToken = resendToken;
        onCodeSent(verificationId, resendToken);
      },
      codeAutoRetrievalTimeout: (String verificationId) {
        _verificationId = verificationId;
      },
    );
  }

  Future<UserModel?> verifyOtp({
    required String verificationId,
    required String smsCode,
  }) async {
    final credential = PhoneAuthProvider.credential(
      verificationId: verificationId,
      smsCode: smsCode,
    );
    return _signInWithCredential(credential);
  }

  Future<UserModel?> _signInWithCredential(
      PhoneAuthCredential credential) async {
    final userCredential =
        await _firebaseAuth.signInWithCredential(credential);
    final firebaseUser = userCredential.user;
    if (firebaseUser == null) return null;

    // Exchange Firebase ID token for app JWT
    final idToken = await firebaseUser.getIdToken();
    return _exchangeTokenWithBackend(
      idToken: idToken!,
      phone: firebaseUser.phoneNumber ?? '',
    );
  }

  Future<UserModel?> _exchangeTokenWithBackend({
    required String idToken,
    required String phone,
  }) async {
    try {
      final response = await ApiService.instance.post(
        AppConfig.loginEndpoint,
        {'firebase_token': idToken, 'phone': phone},
        requireAuth: false,
      );

      final token = response['token'] as String?;
      final refreshToken = response['refresh_token'] as String?;
      final userData = response['user'] as Map<String, dynamic>?;

      if (token == null || userData == null) return null;

      final user = UserModel.fromJson(userData);

      // Persist tokens
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(AppConfig.authTokenKey, token);
      if (refreshToken != null) {
        await prefs.setString(AppConfig.refreshTokenKey, refreshToken);
      }
      await prefs.setString(AppConfig.userIdKey, user.id);
      await prefs.setString(AppConfig.userDataKey, jsonEncode(userData));

      ApiService.instance.setToken(token);
      return user;
    } catch (e) {
      rethrow;
    }
  }

  // ── Session management ─────────────────────────────────────────────────────

  Future<UserModel?> getStoredUser() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(AppConfig.authTokenKey);
    final userDataStr = prefs.getString(AppConfig.userDataKey);

    if (token == null || userDataStr == null) return null;

    ApiService.instance.setToken(token);
    final userData = jsonDecode(userDataStr) as Map<String, dynamic>;
    return UserModel.fromJson(userData);
  }

  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(AppConfig.authTokenKey);
    return token != null && _firebaseAuth.currentUser != null;
  }

  Future<void> logout() async {
    await _firebaseAuth.signOut();
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(AppConfig.authTokenKey);
    await prefs.remove(AppConfig.refreshTokenKey);
    await prefs.remove(AppConfig.userIdKey);
    await prefs.remove(AppConfig.userDataKey);
    ApiService.instance.clearToken();
    _verificationId = null;
    _resendToken = null;
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  String _mapFirebaseError(FirebaseAuthException e) {
    switch (e.code) {
      case 'invalid-phone-number':
        return 'Invalid phone number. Please check and try again.';
      case 'too-many-requests':
        return 'Too many attempts. Please try again later.';
      case 'invalid-verification-code':
        return 'Incorrect OTP. Please try again.';
      case 'session-expired':
        return 'OTP session expired. Please request a new OTP.';
      case 'quota-exceeded':
        return 'SMS quota exceeded. Please try again later.';
      case 'network-request-failed':
        return 'Network error. Check your internet connection.';
      default:
        return e.message ?? 'Authentication failed. Please try again.';
    }
  }
}
