import 'package:shared_preferences/shared_preferences.dart';
import 'package:uuid/uuid.dart';
import '../config/app_config.dart';
import '../models/user.dart';

class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  final _uuid = const Uuid();
  User? _currentUser;
  User? get currentUser => _currentUser;

  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    final isLoggedIn = prefs.getBool(AppConfig.prefKeyIsLoggedIn) ?? false;
    if (isLoggedIn) {
      final id = prefs.getString(AppConfig.prefKeyUserId);
      final name = prefs.getString(AppConfig.prefKeyUserName) ?? '';
      final phone = prefs.getString(AppConfig.prefKeyUserPhone) ?? '';
      if (id != null && phone.isNotEmpty) {
        _currentUser = User(
          id: id,
          name: name,
          phone: phone,
          createdAt: DateTime.now(),
        );
      }
    }
    return isLoggedIn;
  }

  /// Sends OTP to the given phone number.
  /// In demo mode, always returns true. In production, integrate with SMS gateway.
  Future<Map<String, dynamic>> sendOtp(String phone) async {
    await Future.delayed(const Duration(seconds: 1));
    // Demo: OTP is always 123456
    return {'success': true, 'message': 'OTP sent successfully'};
  }

  /// Verifies OTP. Demo OTP is 123456.
  Future<Map<String, dynamic>> verifyOtp(String phone, String otp) async {
    await Future.delayed(const Duration(milliseconds: 800));
    if (otp == AppConfig.demoOtp || otp == '123456') {
      final userId = _uuid.v4();
      final user = User(
        id: userId,
        name: 'Store Owner',
        phone: phone,
        businessName: AppConfig.appName,
        createdAt: DateTime.now(),
      );
      await _saveSession(user);
      _currentUser = user;
      return {'success': true, 'user': user};
    }
    return {'success': false, 'message': 'Invalid OTP. Use 123456 for demo.'};
  }

  Future<void> _saveSession(User user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(AppConfig.prefKeyIsLoggedIn, true);
    await prefs.setString(AppConfig.prefKeyUserId, user.id);
    await prefs.setString(AppConfig.prefKeyUserName, user.name);
    await prefs.setString(AppConfig.prefKeyUserPhone, user.phone);
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(AppConfig.prefKeyIsLoggedIn);
    await prefs.remove(AppConfig.prefKeyUserId);
    await prefs.remove(AppConfig.prefKeyUserName);
    await prefs.remove(AppConfig.prefKeyUserPhone);
    _currentUser = null;
  }

  Future<void> updateProfile(String name, {String? email}) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(AppConfig.prefKeyUserName, name);
    if (_currentUser != null) {
      _currentUser = _currentUser!.copyWith(name: name);
    }
  }
}
