class AppConstants {
  // Routes
  static const String routeLogin = '/login';
  static const String routeOtp = '/otp';
  static const String routeHome = '/home';
  static const String routeCustomersList = '/customers';
  static const String routeCustomerDetail = '/customer-detail';
  static const String routeAddCustomer = '/add-customer';
  static const String routeLedger = '/ledger';
  static const String routeAddTransaction = '/add-transaction';
  static const String routeTransactionDetail = '/transaction-detail';
  static const String routePayment = '/payment';
  static const String routePaymentHistory = '/payment-history';
  static const String routeReminders = '/reminders';
  static const String routeSendReminder = '/send-reminder';
  static const String routeReports = '/reports';
  static const String routeReportDetail = '/report-detail';
  static const String routeSettings = '/settings';
  static const String routeBackup = '/backup';
  static const String routeAbout = '/about';

  // Pagination
  static const int pageSize = 20;

  // Timeouts
  static const int otpTimeoutSeconds = 60;
  static const int otpLength = 6;

  // Validation
  static const int phoneLength = 10;
  static const double maxTransactionAmount = 10000000;
  static const int maxNotesLength = 500;

  // Date formats
  static const String dateFormatDisplay = 'dd MMM yyyy';
  static const String dateFormatFull = 'dd MMM yyyy, hh:mm a';
  static const String dateFormatApi = 'yyyy-MM-dd';

  // Currency
  static const String currencySymbol = '₹';
  static const String currencyCode = 'INR';

  // WhatsApp message templates
  static const String whatsappReminderTemplate =
      'Dear {name}, you have a pending payment of ₹{amount} with Gupta Paper Stores. Kindly clear the dues at your earliest. Contact: {phone}';

  // Notification channels
  static const String notifChannelId = 'gupta_paper_reminders';
  static const String notifChannelName = 'Payment Reminders';
  static const String notifChannelDesc = 'Notifications for payment reminders';

  // Report types
  static const String reportDaily = 'daily';
  static const String reportWeekly = 'weekly';
  static const String reportMonthly = 'monthly';
  static const String reportCustom = 'custom';

  // Sort options
  static const String sortByName = 'name';
  static const String sortByBalance = 'balance';
  static const String sortByDate = 'date';
  static const String sortByAmount = 'amount';

  // Error messages
  static const String errorGeneric = 'Something went wrong. Please try again.';
  static const String errorNetwork = 'No internet connection.';
  static const String errorInvalidPhone = 'Please enter a valid 10-digit phone number.';
  static const String errorInvalidOtp = 'Please enter a valid 6-digit OTP.';
  static const String errorInvalidAmount = 'Please enter a valid amount.';
  static const String errorRequiredField = 'This field is required.';
}
