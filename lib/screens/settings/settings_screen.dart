import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/app_provider.dart';
import '../../config/app_config.dart';
import '../../config/constants.dart';
import '../../utils/helpers.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final appProvider = context.watch<AppProvider>();
    final authProvider = context.watch<AuthProvider>();

    return Scaffold(
      appBar: AppBar(title: const Text('Settings'), automaticallyImplyLeading: false),
      body: ListView(
        children: [
          _buildProfileSection(context, authProvider),
          const Divider(height: 1),
          _buildSectionHeader(context, 'Appearance'),
          _buildThemeSelector(context, appProvider),
          const Divider(height: 1),
          _buildSectionHeader(context, 'Notifications'),
          SwitchListTile(
            title: const Text('Enable Notifications'),
            subtitle: const Text('Receive payment reminders'),
            value: appProvider.notificationsEnabled,
            onChanged: (v) => appProvider.setNotificationsEnabled(v),
            activeColor: AppConfig.primaryColor,
          ),
          const Divider(height: 1),
          _buildSectionHeader(context, 'Data'),
          ListTile(
            leading: const Icon(Icons.backup_outlined),
            title: const Text('Backup & Restore'),
            trailing: const Icon(Icons.arrow_forward_ios, size: 14),
            onTap: () => Navigator.pushNamed(context, AppConstants.routeBackup),
          ),
          ListTile(
            leading: const Icon(Icons.payment_outlined),
            title: const Text('Payment History'),
            trailing: const Icon(Icons.arrow_forward_ios, size: 14),
            onTap: () =>
                Navigator.pushNamed(context, AppConstants.routePaymentHistory),
          ),
          ListTile(
            leading: const Icon(Icons.notifications_outlined),
            title: const Text('Reminders'),
            trailing: const Icon(Icons.arrow_forward_ios, size: 14),
            onTap: () => Navigator.pushNamed(context, AppConstants.routeReminders),
          ),
          const Divider(height: 1),
          _buildSectionHeader(context, 'About'),
          ListTile(
            leading: const Icon(Icons.info_outline),
            title: const Text('About App'),
            trailing: const Icon(Icons.arrow_forward_ios, size: 14),
            onTap: () => Navigator.pushNamed(context, AppConstants.routeAbout),
          ),
          ListTile(
            leading: const Icon(Icons.star_outline),
            title: const Text('Rate App'),
            trailing: const Icon(Icons.arrow_forward_ios, size: 14),
            onTap: () {},
          ),
          const Divider(height: 1),
          _buildSectionHeader(context, 'Account'),
          ListTile(
            leading: const Icon(Icons.logout, color: AppConfig.errorColor),
            title: const Text('Logout',
                style: TextStyle(color: AppConfig.errorColor)),
            onTap: () => _logout(context, authProvider),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileSection(
      BuildContext context, AuthProvider authProvider) {
    final user = authProvider.currentUser;
    return Container(
      padding: const EdgeInsets.all(20),
      color: AppConfig.primaryColor,
      child: Row(
        children: [
          CircleAvatar(
            radius: 32,
            backgroundColor: Colors.white.withOpacity(0.2),
            child: Text(
              user?.name.isNotEmpty == true ? user!.name[0].toUpperCase() : 'U',
              style: const TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  user?.name ?? 'Store Owner',
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                Text(
                  user?.phone != null ? '+91 ${user!.phone}' : '',
                  style: TextStyle(
                      color: Colors.white.withOpacity(0.8), fontSize: 14),
                ),
                const SizedBox(height: 2),
                Text(
                  AppConfig.appName,
                  style: TextStyle(
                      color: Colors.white.withOpacity(0.7), fontSize: 12),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(BuildContext context, String title) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
      child: Text(
        title,
        style: TextStyle(
          color: AppConfig.primaryColor,
          fontWeight: FontWeight.w600,
          fontSize: 13,
        ),
      ),
    );
  }

  Widget _buildThemeSelector(BuildContext context, AppProvider provider) {
    return Column(
      children: [
        RadioListTile<ThemeMode>(
          title: const Text('System Default'),
          value: ThemeMode.system,
          groupValue: provider.themeMode,
          onChanged: (v) => provider.setThemeMode(v!),
          activeColor: AppConfig.primaryColor,
        ),
        RadioListTile<ThemeMode>(
          title: const Text('Light Mode'),
          value: ThemeMode.light,
          groupValue: provider.themeMode,
          onChanged: (v) => provider.setThemeMode(v!),
          activeColor: AppConfig.primaryColor,
        ),
        RadioListTile<ThemeMode>(
          title: const Text('Dark Mode'),
          value: ThemeMode.dark,
          groupValue: provider.themeMode,
          onChanged: (v) => provider.setThemeMode(v!),
          activeColor: AppConfig.primaryColor,
        ),
      ],
    );
  }

  Future<void> _logout(BuildContext context, AuthProvider auth) async {
    final confirm = await AppHelpers.showConfirmDialog(
      context,
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      isDestructive: true,
    );
    if (confirm == true && context.mounted) {
      await auth.logout();
      Navigator.pushNamedAndRemoveUntil(
          context, AppConstants.routeLogin, (_) => false);
    }
  }
}
