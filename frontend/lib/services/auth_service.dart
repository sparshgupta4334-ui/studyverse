import 'dart:convert';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/app_config.dart';
import '../models/user.dart';
import 'api_service.dart';

class AuthService {
  AuthService._();
  static final AuthService instance = AuthService._();

  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  String? _verificationId;
  UserModel? _currentUser;

  UserModel? get currentUser => _currentUser;

  /// Send OTP to phone number
  Future<void> sendOtp({
    required String phone,
    required Function(String verificationId) onCodeSent,
    required Function(String error) onError,
  }) async {
    final formattedPhone = phone.startsWith('+') ? phone : '+91$phone';

    await _firebaseAuth.verifyPhoneNumber(
      phoneNumber: formattedPhone,
      verificationCompleted: (PhoneAuthCredential credential) async {
        // Auto-verification on Android
        await _signInWithCredential(credential, formattedPhone);
      },
      verificationFailed: (FirebaseAuthException e) {
        onError(e.message ?? 'Verification failed');
      },
      codeSent: (String verificationId, int? resendToken) {
        _verificationId = verificationId;
        onCodeSent(verificationId);
      },
      codeAutoRetrievalTimeout: (String verificationId) {
        _verificationId = verificationId;
      },
      timeout: const Duration(seconds: 60),
    );
  }

  /// Verify OTP and login
  Future<UserModel> verifyOtp({
    required String otp,
    required String phone,
  }) async {
    if (_verificationId == null) {
      throw Exception('No verification ID. Please request OTP first.');
    }

    final credential = PhoneAuthProvider.credential(
      verificationId: _verificationId!,
      smsCode: otp,
    );

    return _signInWithCredential(credential, phone);
  }

  Future<UserModel> _signInWithCredential(
    PhoneAuthCredential credential,
    String phone,
  ) async {
    final userCredential = await _firebaseAuth.signInWithCredential(credential);
    final firebaseToken = await userCredential.user!.getIdToken();

    // Login with backend
    final response = await ApiService.instance.post('/auth/login', {
      'phone': phone,
      'firebaseToken': firebaseToken,
    });

    final data = response['data'] as Map<String, dynamic>;
    await ApiService.instance.saveTokens(
      data['accessToken'] as String,
      data['refreshToken'] as String,
    );

    _currentUser = UserModel.fromJson(data['user'] as Map<String, dynamic>);

    // Save user data locally
    await _storage.write(
      key: AppConfig.userDataKey,
      value: json.encode(_currentUser!.toJson()),
    );

    return _currentUser!;
  }

  /// Load saved user from local storage
  Future<UserModel?> loadSavedUser() async {
    try {
      await ApiService.instance.loadTokens();
      final userData = await _storage.read(key: AppConfig.userDataKey);
      if (userData != null) {
        _currentUser = UserModel.fromJson(json.decode(userData) as Map<String, dynamic>);
        return _currentUser;
      }
    } catch (_) {}
    return null;
  }

  /// Get fresh user profile from API
  Future<UserModel> getProfile() async {
    final response = await ApiService.instance.get('/auth/profile');
    _currentUser = UserModel.fromJson(response['data'] as Map<String, dynamic>);
    return _currentUser!;
  }

  /// Update user profile
  Future<UserModel> updateProfile({String? name, String? email}) async {
    final response = await ApiService.instance.put('/auth/profile', {
      if (name != null) 'name': name,
      if (email != null) 'email': email,
    });
    _currentUser = UserModel.fromJson(response['data'] as Map<String, dynamic>);
    await _storage.write(key: AppConfig.userDataKey, value: json.encode(_currentUser!.toJson()));
    return _currentUser!;
  }

  /// Logout
  Future<void> logout() async {
    await _firebaseAuth.signOut();
    await ApiService.instance.clearTokens();
    await _storage.delete(key: AppConfig.userDataKey);
    _currentUser = null;
    _verificationId = null;
  }

  bool get isLoggedIn => _currentUser != null;
}
