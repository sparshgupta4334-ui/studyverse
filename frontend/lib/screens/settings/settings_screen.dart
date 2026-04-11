import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/auth_provider.dart';
import '../auth/login_screen.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final user = authProvider.user;

    return Scaffold(
      backgroundColor: AppColors.neutral100,
      appBar: const AppBar(title: Text('Settings')),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Profile Section
            Container(
              margin: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                children: [
                  ListTile(
                    leading: CircleAvatar(
                      backgroundColor: AppColors.primaryContainer,
                      radius: 28,
                      child: Text(
                        (user?.name?.isNotEmpty == true ? user!.name![0] : 'U').toUpperCase(),
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                    title: Text(
                      user?.name ?? 'Set your name',
                      style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 17),
                    ),
                    subtitle: Text(user?.phone ?? ''),
                    trailing: IconButton(
                      icon: const Icon(Icons.edit_rounded),
                      onPressed: () => _showEditProfileDialog(context, user?.name, user?.email),
                    ),
                  ),
                ],
              ),
            ),

            // App Settings
            _SettingsSection(
              title: 'Preferences',
              tiles: [
                _SettingsTile(
                  icon: Icons.notifications_outlined,
                  iconColor: AppColors.warning,
                  title: 'Notifications',
                  subtitle: 'Manage reminder notifications',
                  onTap: () {},
                ),
                _SettingsTile(
                  icon: Icons.dark_mode_outlined,
                  iconColor: AppColors.neutral700,
                  title: 'Appearance',
                  subtitle: 'Light / Dark mode',
                  onTap: () {},
                ),
                _SettingsTile(
                  icon: Icons.language_outlined,
                  iconColor: AppColors.info,
                  title: 'Language',
                  subtitle: 'English',
                  onTap: () {},
                ),
              ],
            ),

            _SettingsSection(
              title: 'Data & Backup',
              tiles: [
                _SettingsTile(
                  icon: Icons.cloud_sync_outlined,
                  iconColor: AppColors.success,
                  title: 'Sync Data',
                  subtitle: 'Sync with cloud',
                  onTap: () {},
                ),
                _SettingsTile(
                  icon: Icons.file_download_outlined,
                  iconColor: AppColors.primary,
                  title: 'Export Data',
                  subtitle: 'Export to PDF or CSV',
                  onTap: () {},
                ),
              ],
            ),

            _SettingsSection(
              title: 'About',
              tiles: [
                _SettingsTile(
                  icon: Icons.info_outline_rounded,
                  iconColor: AppColors.info,
                  title: 'App Version',
                  subtitle: '1.0.0',
                  onTap: () {},
                ),
                _SettingsTile(
                  icon: Icons.privacy_tip_outlined,
                  iconColor: AppColors.neutral600,
                  title: 'Privacy Policy',
                  onTap: () {},
                ),
                _SettingsTile(
                  icon: Icons.description_outlined,
                  iconColor: AppColors.neutral600,
                  title: 'Terms of Service',
                  onTap: () {},
                ),
              ],
            ),

            // Logout Button
            Padding(
              padding: const EdgeInsets.all(16),
              child: OutlinedButton.icon(
                onPressed: () => _logout(context),
                icon: const Icon(Icons.logout_rounded, color: AppColors.error),
                label: const Text('Logout', style: TextStyle(color: AppColors.error)),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: AppColors.error),
                ),
              ),
            ),

            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  void _showEditProfileDialog(BuildContext context, String? currentName, String? currentEmail) {
    final nameController = TextEditingController(text: currentName);
    final emailController = TextEditingController(text: currentEmail);

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Edit Profile'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nameController,
              decoration: const InputDecoration(labelText: 'Name', prefixIcon: Icon(Icons.person_outline)),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: emailController,
              keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(labelText: 'Email', prefixIcon: Icon(Icons.email_outlined)),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(ctx);
              await context.read<AuthProvider>().updateProfile(
                name: nameController.text.trim().isEmpty ? null : nameController.text.trim(),
                email: emailController.text.trim().isEmpty ? null : emailController.text.trim(),
              );
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  void _logout(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Logout'),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            onPressed: () async {
              Navigator.pop(ctx);
              await context.read<AuthProvider>().logout();
              if (context.mounted) {
                Navigator.of(context).pushAndRemoveUntil(
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                  (route) => false,
                );
              }
            },
            child: const Text('Logout'),
          ),
        ],
      ),
    );
  }
}

class _SettingsSection extends StatelessWidget {
  final String title;
  final List<Widget> tiles;

  const _SettingsSection({required this.title, required this.tiles});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 6),
          child: Text(
            title.toUpperCase(),
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: AppColors.neutral500,
              letterSpacing: 0.8,
            ),
          ),
        ),
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(children: tiles),
        ),
        const SizedBox(height: 12),
      ],
    );
  }
}

class _SettingsTile extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String title;
  final String? subtitle;
  final VoidCallback onTap;

  const _SettingsTile({
    required this.icon,
    this.iconColor = AppColors.primary,
    required this.title,
    this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          color: iconColor.withAlpha(26),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, color: iconColor, size: 20),
      ),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
      subtitle: subtitle != null ? Text(subtitle!, style: const TextStyle(fontSize: 13)) : null,
      trailing: const Icon(Icons.chevron_right_rounded, color: AppColors.neutral400),
      onTap: onTap,
    );
  }
}
