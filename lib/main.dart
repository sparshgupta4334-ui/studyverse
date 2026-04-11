import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import 'config/app_config.dart';
import 'config/theme.dart';
import 'config/constants.dart';
import 'providers/auth_provider.dart';
import 'providers/customer_provider.dart';
import 'providers/transaction_provider.dart';
import 'providers/app_provider.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/otp_screen.dart';
import 'screens/home/home_screen.dart';
import 'screens/customers/customers_list_screen.dart';
import 'screens/customers/customer_detail_screen.dart';
import 'screens/customers/add_customer_screen.dart';
import 'screens/transactions/ledger_screen.dart';
import 'screens/transactions/add_transaction_screen.dart';
import 'screens/transactions/transaction_detail_screen.dart';
import 'screens/payments/payment_screen.dart';
import 'screens/payments/payment_history_screen.dart';
import 'screens/reminders/reminders_screen.dart';
import 'screens/reminders/send_reminder_screen.dart';
import 'screens/reports/reports_screen.dart';
import 'screens/reports/report_detail_screen.dart';
import 'screens/settings/settings_screen.dart';
import 'screens/settings/backup_screen.dart';
import 'screens/settings/about_screen.dart';
import 'models/customer.dart';
import 'models/transaction.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Lock orientation to portrait
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.light,
  ));

  final appProvider = AppProvider();
  await appProvider.initialize();

  final authProvider = AuthProvider();
  await authProvider.checkAuthStatus();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: appProvider),
        ChangeNotifierProvider.value(value: authProvider),
        ChangeNotifierProvider(create: (_) => CustomerProvider()),
        ChangeNotifierProvider(create: (_) => TransactionProvider()),
      ],
      child: const GuptaPaperStoresApp(),
    ),
  );
}

class GuptaPaperStoresApp extends StatelessWidget {
  const GuptaPaperStoresApp({super.key});

  @override
  Widget build(BuildContext context) {
    final appProvider = context.watch<AppProvider>();
    final authProvider = context.watch<AuthProvider>();

    return MaterialApp(
      title: AppConfig.appName,
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: appProvider.themeMode,
      initialRoute: authProvider.isAuthenticated
          ? AppConstants.routeHome
          : AppConstants.routeLogin,
      onGenerateRoute: _generateRoute,
    );
  }

  Route<dynamic>? _generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case AppConstants.routeLogin:
        return _route(const LoginScreen(), settings);

      case AppConstants.routeOtp:
        return _route(const OtpScreen(), settings);

      case AppConstants.routeHome:
        return _route(const HomeScreen(), settings);

      case AppConstants.routeCustomersList:
        return _route(const CustomersListScreen(), settings);

      case AppConstants.routeCustomerDetail:
        final customerId = settings.arguments as String;
        return _route(
            CustomerDetailScreen(customerId: customerId), settings);

      case AppConstants.routeAddCustomer:
        final customer = settings.arguments as Customer?;
        return _route(AddCustomerScreen(customer: customer), settings);

      case AppConstants.routeLedger:
        return _route(const LedgerScreen(), settings);

      case AppConstants.routeAddTransaction:
        final args = settings.arguments as Map<String, dynamic>?;
        return _route(
          AddTransactionScreen(
            preselectedCustomerId: args?['customerId'] as String?,
            preselectedType: args?['type'] as String?,
          ),
          settings,
        );

      case AppConstants.routeTransactionDetail:
        final tx = settings.arguments as Transaction;
        return _route(TransactionDetailScreen(transaction: tx), settings);

      case AppConstants.routePayment:
        final customer = settings.arguments as Customer?;
        return _route(PaymentScreen(customer: customer), settings);

      case AppConstants.routePaymentHistory:
        return _route(const PaymentHistoryScreen(), settings);

      case AppConstants.routeReminders:
        return _route(const RemindersScreen(), settings);

      case AppConstants.routeSendReminder:
        final customer = settings.arguments as Customer?;
        return _route(SendReminderScreen(customer: customer), settings);

      case AppConstants.routeReports:
        return _route(const ReportsScreen(), settings);

      case AppConstants.routeReportDetail:
        final args = settings.arguments as Map<String, dynamic>;
        return _route(
          ReportDetailScreen(
            title: args['title'] as String,
            transactions: (args['transactions'] as List).cast<Transaction>(),
            summary: args['summary'] as Map<String, dynamic>,
          ),
          settings,
        );

      case AppConstants.routeSettings:
        return _route(const SettingsScreen(), settings);

      case AppConstants.routeBackup:
        return _route(const BackupScreen(), settings);

      case AppConstants.routeAbout:
        return _route(const AboutScreen(), settings);

      default:
        return _route(
          Scaffold(
            body: Center(
              child: Text('No route defined for ${settings.name}'),
            ),
          ),
          settings,
        );
    }
  }

  PageRoute _route(Widget page, RouteSettings settings) {
    return MaterialPageRoute(builder: (_) => page, settings: settings);
  }
}
