import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../config/app_theme.dart';
import '../../config/routes.dart';
import '../../providers/auth_provider.dart';

class SettingsScreen extends StatelessWidget {
  final bool embedded;

  const SettingsScreen({super.key, this.embedded = false});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final user = auth.user;

    Widget body = ListView(
      children: [
        // Profile card
        _ProfileCard(
          name: user?.displayName ?? 'User',
          phone: user?.phone ?? '',
          businessName: user?.businessName,
        ),

        const SizedBox(height: 8),

        // Appearance
        _SectionHeader(title: 'Appearance'),
        _SettingsTile(
          icon: Icons.dark_mode_outlined,
          title: 'Dark Mode',
          trailing: Switch(
            value: auth.isDarkMode,
            onChanged: (_) => auth.toggleDarkMode(),
            activeColor: AppTheme.primaryGreen,
          ),
        ),

        const SizedBox(height: 8),

        // Data
        _SectionHeader(title: 'Data & Backup'),
        _SettingsTile(
          icon: Icons.cloud_upload_outlined,
          title: 'Backup to Cloud',
          subtitle: 'Last backup: Never',
          onTap: () => _showSnackBar(context, 'Backup started...'),
        ),
        _SettingsTile(
          icon: Icons.cloud_download_outlined,
          title: 'Restore from Cloud',
          onTap: () => _showSnackBar(context, 'Restore feature coming soon'),
        ),
        _SettingsTile(
          icon: Icons.share_outlined,
          title: 'Export Data',
          subtitle: 'Export as Excel / PDF',
          onTap: () => _showSnackBar(context, 'Export feature coming soon'),
        ),

        const SizedBox(height: 8),

        // Notifications
        _SectionHeader(title: 'Notifications'),
        _SettingsTile(
          icon: Icons.notifications_outlined,
          title: 'Payment Reminders',
          trailing: Switch(
            value: true,
            onChanged: (_) =>
                _showSnackBar(context, 'Notification settings coming soon'),
            activeColor: AppTheme.primaryGreen,
          ),
        ),

        const SizedBox(height: 8),

        // About
        _SectionHeader(title: 'About'),
        _SettingsTile(
          icon: Icons.info_outline_rounded,
          title: 'App Version',
          subtitle: '1.0.0 (Build 1)',
        ),
        _SettingsTile(
          icon: Icons.privacy_tip_outlined,
          title: 'Privacy Policy',
          onTap: () => _showSnackBar(context, 'Opening privacy policy...'),
        ),
        _SettingsTile(
          icon: Icons.description_outlined,
          title: 'Terms of Service',
          onTap: () => _showSnackBar(context, 'Opening terms of service...'),
        ),
        _SettingsTile(
          icon: Icons.help_outline_rounded,
          title: 'Help & Support',
          onTap: () => _showSnackBar(context, 'Opening support...'),
        ),

        const SizedBox(height: 16),

        // Logout
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: OutlinedButton.icon(
            onPressed: () => _confirmLogout(context),
            icon: const Icon(Icons.logout_rounded),
            label: const Text('Logout'),
            style: OutlinedButton.styleFrom(
              foregroundColor: AppTheme.payableRed,
              side: const BorderSide(color: AppTheme.payableRed),
              minimumSize: const Size(double.infinity, 52),
            ),
          ),
        ),
        const SizedBox(height: 32),
      ],
    );

    if (embedded) return body;

    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: body,
    );
  }

  void _showSnackBar(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  Future<void> _confirmLogout(BuildContext context) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Logout'),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: TextButton.styleFrom(foregroundColor: AppTheme.payableRed),
            child: const Text('Logout'),
          ),
        ],
      ),
    );

    if (confirm == true) {
      await context.read<AuthProvider>().logout();
      if (context.mounted) {
        Navigator.of(context).pushNamedAndRemoveUntil(
          AppRoutes.phone,
          (route) => false,
        );
      }
    }
  }
}

// ── Supporting widgets ────────────────────────────────────────────────────────

class _ProfileCard extends StatelessWidget {
  final String name;
  final String phone;
  final String? businessName;

  const _ProfileCard({
    required this.name,
    required this.phone,
    this.businessName,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppTheme.primaryGreen, AppTheme.primaryGreenLight],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppTheme.primaryGreen.withOpacity(0.3),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 32,
            backgroundColor: Colors.white.withOpacity(0.2),
            child: Text(
              name.substring(0, 1).toUpperCase(),
              style: const TextStyle(
                color: Colors.white,
                fontSize: 28,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  businessName ?? name,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                if (businessName != null) ...[
                  const SizedBox(height: 2),
                  Text(
                    name,
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.8),
                      fontSize: 14,
                    ),
                  ),
                ],
                const SizedBox(height: 4),
                Text(
                  phone,
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.8),
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.edit_outlined, color: Colors.white),
            onPressed: () {},
          ),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;

  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 4),
      child: Text(
        title.toUpperCase(),
        style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: AppTheme.primaryGreen,
              fontWeight: FontWeight.w700,
              letterSpacing: 1.2,
            ),
      ),
    );
  }
}

class _SettingsTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String? subtitle;
  final Widget? trailing;
  final VoidCallback? onTap;

  const _SettingsTile({
    required this.icon,
    required this.title,
    this.subtitle,
    this.trailing,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: AppTheme.primaryGreen.withOpacity(0.08),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: AppTheme.primaryGreen, size: 22),
      ),
      title: Text(
        title,
        style: Theme.of(context).textTheme.titleSmall?.copyWith(
              fontWeight: FontWeight.w500,
            ),
      ),
      subtitle:
          subtitle != null ? Text(subtitle!) : null,
      trailing: trailing ??
          (onTap != null
              ? const Icon(Icons.arrow_forward_ios_rounded, size: 16)
              : null),
      onTap: onTap,
    );
  }
}
