import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/app_config.dart';
import '../config/constants.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final String? code;

  const ApiException(this.message, {this.statusCode, this.code});

  @override
  String toString() => 'ApiException: $message (status: $statusCode, code: $code)';
}

class ApiService {
  ApiService._();
  static final ApiService instance = ApiService._();

  final _storage = const FlutterSecureStorage();
  String? _accessToken;
  String? _refreshToken;

  Future<void> loadTokens() async {
    _accessToken = await _storage.read(key: AppConfig.accessTokenKey);
    _refreshToken = await _storage.read(key: AppConfig.refreshTokenKey);
  }

  Future<void> saveTokens(String accessToken, String refreshToken) async {
    _accessToken = accessToken;
    _refreshToken = refreshToken;
    await _storage.write(key: AppConfig.accessTokenKey, value: accessToken);
    await _storage.write(key: AppConfig.refreshTokenKey, value: refreshToken);
  }

  Future<void> clearTokens() async {
    _accessToken = null;
    _refreshToken = null;
    await _storage.delete(key: AppConfig.accessTokenKey);
    await _storage.delete(key: AppConfig.refreshTokenKey);
  }

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        if (_accessToken != null) 'Authorization': 'Bearer $_accessToken',
      };

  Future<Map<String, dynamic>> _handleResponse(http.Response response) async {
    final body = json.decode(response.body) as Map<String, dynamic>;

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return body;
    }

    if (response.statusCode == 401 && body['code'] == 'TOKEN_EXPIRED') {
      // Try to refresh the token
      try {
        await _refreshAccessToken();
        throw ApiException('Token refreshed, please retry', statusCode: 401, code: 'RETRY');
      } catch (e) {
        await clearTokens();
        throw ApiException(AppConstants.sessionExpired, statusCode: 401, code: 'SESSION_EXPIRED');
      }
    }

    final message = body['message'] as String? ?? AppConstants.unexpectedError;
    final code = body['code'] as String?;
    throw ApiException(message, statusCode: response.statusCode, code: code);
  }

  Future<void> _refreshAccessToken() async {
    if (_refreshToken == null) throw ApiException('No refresh token');

    final response = await http
        .post(
          Uri.parse('${AppConfig.baseUrl}/auth/refresh'),
          headers: {'Content-Type': 'application/json'},
          body: json.encode({'refreshToken': _refreshToken}),
        )
        .timeout(AppConfig.apiTimeout);

    final body = json.decode(response.body) as Map<String, dynamic>;
    if (response.statusCode == 200 && body['data']?['accessToken'] != null) {
      _accessToken = body['data']['accessToken'] as String;
      await _storage.write(key: AppConfig.accessTokenKey, value: _accessToken);
    } else {
      throw ApiException('Failed to refresh token');
    }
  }

  Future<Map<String, dynamic>> get(String endpoint) async {
    final response = await http
        .get(Uri.parse('${AppConfig.baseUrl}$endpoint'), headers: _headers)
        .timeout(AppConfig.apiTimeout);
    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> post(String endpoint, Map<String, dynamic> data) async {
    final response = await http
        .post(
          Uri.parse('${AppConfig.baseUrl}$endpoint'),
          headers: _headers,
          body: json.encode(data),
        )
        .timeout(AppConfig.apiTimeout);
    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> put(String endpoint, Map<String, dynamic> data) async {
    final response = await http
        .put(
          Uri.parse('${AppConfig.baseUrl}$endpoint'),
          headers: _headers,
          body: json.encode(data),
        )
        .timeout(AppConfig.apiTimeout);
    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> delete(String endpoint) async {
    final response = await http
        .delete(Uri.parse('${AppConfig.baseUrl}$endpoint'), headers: _headers)
        .timeout(AppConfig.apiTimeout);
    return _handleResponse(response);
  }
}
