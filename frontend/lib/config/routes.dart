import 'package:flutter/material.dart';

import '../screens/splash/splash_screen.dart';
import '../screens/auth/phone_screen.dart';
import '../screens/auth/otp_screen.dart';
import '../screens/dashboard/dashboard_screen.dart';
import '../screens/customer/customer_list_screen.dart';
import '../screens/customer/add_customer_screen.dart';
import '../screens/customer/customer_detail_screen.dart';
import '../screens/transaction/add_transaction_screen.dart';
import '../screens/settings/settings_screen.dart';
import '../models/customer_model.dart';

class AppRoutes {
  AppRoutes._();

  static const String splash = '/';
  static const String phone = '/phone';
  static const String otp = '/otp';
  static const String dashboard = '/dashboard';
  static const String customerList = '/customers';
  static const String addCustomer = '/customers/add';
  static const String customerDetail = '/customers/detail';
  static const String addTransaction = '/transactions/add';
  static const String settings = '/settings';

  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case splash:
        return _buildRoute(const SplashScreen(), settings);

      case phone:
        return _buildRoute(const PhoneScreen(), settings);

      case otp:
        final args = settings.arguments as Map<String, dynamic>?;
        return _buildRoute(
          OtpScreen(
            phoneNumber: args?['phoneNumber'] ?? '',
            verificationId: args?['verificationId'] ?? '',
          ),
          settings,
        );

      case dashboard:
        return _buildRoute(const DashboardScreen(), settings);

      case customerList:
        return _buildRoute(const CustomerListScreen(), settings);

      case addCustomer:
        return _buildRoute(const AddCustomerScreen(), settings);

      case customerDetail:
        final customer = settings.arguments as CustomerModel;
        return _buildRoute(CustomerDetailScreen(customer: customer), settings);

      case addTransaction:
        final args = settings.arguments as Map<String, dynamic>;
        return _buildRoute(
          AddTransactionScreen(
            customerId: args['customerId'] as String,
            customerName: args['customerName'] as String,
          ),
          settings,
        );

      case AppRoutes.settings:
        return _buildRoute(const SettingsScreen(), settings);

      default:
        return _buildRoute(
          Scaffold(
            body: Center(
              child: Text('No route defined for ${settings.name}'),
            ),
          ),
          settings,
        );
    }
  }

  static PageRoute _buildRoute(Widget page, RouteSettings settings) {
    return MaterialPageRoute(
      builder: (_) => page,
      settings: settings,
    );
  }
}
