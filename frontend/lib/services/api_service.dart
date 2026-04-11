import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../config/app_config.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;

  ApiException(this.message, {this.statusCode});

  @override
  String toString() => 'ApiException($statusCode): $message';
}

class ApiService {
  ApiService._();
  static final ApiService instance = ApiService._();

  final http.Client _client = http.Client();
  String? _authToken;

  Duration get _timeout =>
      const Duration(seconds: AppConfig.connectTimeout);

  Future<void> _loadToken() async {
    if (_authToken != null) return;
    final prefs = await SharedPreferences.getInstance();
    _authToken = prefs.getString(AppConfig.authTokenKey);
  }

  void setToken(String token) {
    _authToken = token;
  }

  void clearToken() {
    _authToken = null;
  }

  Map<String, String> _headers({bool requireAuth = true}) {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (requireAuth && _authToken != null) {
      headers['Authorization'] = 'Bearer $_authToken';
    }
    return headers;
  }

  Future<Map<String, dynamic>> get(
    String endpoint, {
    Map<String, String>? queryParams,
    bool requireAuth = true,
  }) async {
    await _loadToken();
    final uri = Uri.parse('${AppConfig.apiBaseUrl}$endpoint').replace(
      queryParameters: queryParams,
    );
    try {
      final response = await _client
          .get(uri, headers: _headers(requireAuth: requireAuth))
          .timeout(_timeout);
      return _handleResponse(response);
    } on SocketException {
      throw ApiException('No internet connection');
    } on http.ClientException catch (e) {
      throw ApiException('Network error: ${e.message}');
    }
  }

  Future<Map<String, dynamic>> post(
    String endpoint,
    Map<String, dynamic> body, {
    bool requireAuth = true,
  }) async {
    await _loadToken();
    final uri = Uri.parse('${AppConfig.apiBaseUrl}$endpoint');
    try {
      final response = await _client
          .post(
            uri,
            headers: _headers(requireAuth: requireAuth),
            body: jsonEncode(body),
          )
          .timeout(_timeout);
      return _handleResponse(response);
    } on SocketException {
      throw ApiException('No internet connection');
    } on http.ClientException catch (e) {
      throw ApiException('Network error: ${e.message}');
    }
  }

  Future<Map<String, dynamic>> put(
    String endpoint,
    Map<String, dynamic> body,
  ) async {
    await _loadToken();
    final uri = Uri.parse('${AppConfig.apiBaseUrl}$endpoint');
    try {
      final response = await _client
          .put(
            uri,
            headers: _headers(),
            body: jsonEncode(body),
          )
          .timeout(_timeout);
      return _handleResponse(response);
    } on SocketException {
      throw ApiException('No internet connection');
    } on http.ClientException catch (e) {
      throw ApiException('Network error: ${e.message}');
    }
  }

  Future<Map<String, dynamic>> delete(String endpoint) async {
    await _loadToken();
    final uri = Uri.parse('${AppConfig.apiBaseUrl}$endpoint');
    try {
      final response = await _client
          .delete(uri, headers: _headers())
          .timeout(_timeout);
      return _handleResponse(response);
    } on SocketException {
      throw ApiException('No internet connection');
    } on http.ClientException catch (e) {
      throw ApiException('Network error: ${e.message}');
    }
  }

  Map<String, dynamic> _handleResponse(http.Response response) {
    final body = response.body.isNotEmpty
        ? jsonDecode(response.body) as Map<String, dynamic>
        : <String, dynamic>{};

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return body;
    }

    final message = body['message'] as String? ??
        body['error'] as String? ??
        'Request failed';

    if (response.statusCode == 401) {
      throw ApiException('Session expired. Please log in again.',
          statusCode: 401);
    } else if (response.statusCode == 403) {
      throw ApiException('Access denied.', statusCode: 403);
    } else if (response.statusCode == 404) {
      throw ApiException('Resource not found.', statusCode: 404);
    } else if (response.statusCode >= 500) {
      throw ApiException('Server error. Please try again later.',
          statusCode: response.statusCode);
    }

    throw ApiException(message, statusCode: response.statusCode);
  }

  /// Refresh JWT token using stored refresh token
  Future<bool> refreshToken() async {
    final prefs = await SharedPreferences.getInstance();
    final refreshToken = prefs.getString(AppConfig.refreshTokenKey);
    if (refreshToken == null) return false;

    try {
      final response = await post(
        AppConfig.refreshTokenEndpoint,
        {'refresh_token': refreshToken},
        requireAuth: false,
      );
      final newToken = response['token'] as String?;
      if (newToken != null) {
        _authToken = newToken;
        await prefs.setString(AppConfig.authTokenKey, newToken);
        return true;
      }
      return false;
    } catch (_) {
      return false;
    }
  }
}
