import 'package:flutter/material.dart';
import '../../config/app_config.dart';
import '../../utils/helpers.dart';
import 'package:url_launcher/url_launcher.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('About')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildAppHeader(context),
            const SizedBox(height: 24),
            _buildInfoCard(context),
            const SizedBox(height: 16),
            _buildFeaturesCard(context),
            const SizedBox(height: 16),
            _buildContactCard(context),
            const SizedBox(height: 24),
            Text(
              'Version ${AppConfig.appVersion}',
              style: const TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 8),
            const Text(
              '© 2024 Gupta Paper Stores. All rights reserved.',
              style: TextStyle(color: Colors.grey, fontSize: 12),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAppHeader(BuildContext context) {
    return Column(
      children: [
        Container(
          width: 80,
          height: 80,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [AppConfig.primaryColor, AppConfig.primaryDark],
            ),
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: AppConfig.primaryColor.withOpacity(0.3),
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: const Icon(Icons.store, color: Colors.white, size: 44),
        ),
        const SizedBox(height: 16),
        const Text(
          AppConfig.appName,
          style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Color(0xFF111827)),
        ),
        const SizedBox(height: 4),
        const Text(
          AppConfig.appTagline,
          style: TextStyle(color: Colors.grey),
        ),
      ],
    );
  }

  Widget _buildInfoCard(BuildContext context) {
    return Card(
      child: Column(
        children: [
          ListTile(
            leading: const Icon(Icons.phone, color: AppConfig.primaryColor),
            title: const Text('Developer Contact'),
            subtitle: Text(AppConfig.supportPhone),
            onTap: () => launchUrl(Uri.parse('tel:${AppConfig.supportPhone}')),
          ),
          const Divider(height: 1),
          ListTile(
            leading: const Icon(Icons.email, color: AppConfig.primaryColor),
            title: const Text('Support Email'),
            subtitle: Text(AppConfig.supportEmail),
            onTap: () => launchUrl(
                Uri.parse('mailto:${AppConfig.supportEmail}')),
          ),
        ],
      ),
    );
  }

  Widget _buildFeaturesCard(BuildContext context) {
    const features = [
      '📒 Digital Khata - Track all customer transactions',
      '💰 UPI Payment Collection - GPay, PhonePe, Paytm',
      '📱 WhatsApp & SMS Reminders',
      '📊 Business Reports & Analytics',
      '🔒 Offline-first - Works without internet',
      '🌙 Dark mode support',
      '📤 Data export & backup',
    ];

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Features', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 12),
            ...features.map((f) => Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Text(f,
                      style: const TextStyle(fontSize: 13, height: 1.4)),
                )),
          ],
        ),
      ),
    );
  }

  Widget _buildContactCard(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Support', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 12),
            const Text(
              'For any issues or feedback, please contact our support team. '
              'We typically respond within 24 hours.',
              style: TextStyle(color: Colors.grey, fontSize: 13, height: 1.5),
            ),
          ],
        ),
      ),
    );
  }
}
