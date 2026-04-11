import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';
import 'dart:io';
import '../../database/database_helper.dart';
import '../../config/app_config.dart';
import '../../utils/formatters.dart';
import '../../utils/helpers.dart';
import '../../utils/logger.dart';
import '../../widgets/custom/custom_button.dart';

class BackupScreen extends StatefulWidget {
  const BackupScreen({super.key});

  @override
  State<BackupScreen> createState() => _BackupScreenState();
}

class _BackupScreenState extends State<BackupScreen> {
  bool _isExporting = false;
  String? _lastBackupPath;

  Future<void> _exportData() async {
    setState(() => _isExporting = true);
    try {
      final dbHelper = DatabaseHelper();
      final db = await dbHelper.database;
      final customers = await db.query('customers');
      final transactions = await db.query('transactions');

      final buffer = StringBuffer();
      buffer.writeln('GUPTA PAPER STORES - DATA EXPORT');
      buffer.writeln(
          'Generated: ${AppFormatters.formatDateFull(DateTime.now())}');
      buffer.writeln('=' * 50);
      buffer.writeln();

      buffer.writeln('CUSTOMERS (${customers.length})');
      buffer.writeln('-' * 30);
      for (final c in customers) {
        buffer.writeln(
            '${c['name']} | ${c['phone']} | Balance: ₹${c['balance']}');
      }

      buffer.writeln();
      buffer.writeln('TRANSACTIONS (${transactions.length})');
      buffer.writeln('-' * 30);
      for (final t in transactions) {
        buffer.writeln(
            '${t['date']} | ${t['type']} | ₹${t['amount']} | ${t['category']}');
      }

      final dir = await getApplicationDocumentsDirectory();
      final fileName =
          'gps_backup_${DateTime.now().millisecondsSinceEpoch}.txt';
      final file = File('${dir.path}/$fileName');
      await file.writeAsString(buffer.toString());

      setState(() => _lastBackupPath = file.path);

      if (mounted) {
        await Share.shareXFiles(
          [XFile(file.path)],
          subject: 'Gupta Paper Stores - Data Backup',
          text: 'Backup generated on ${AppFormatters.formatDate(DateTime.now())}',
        );
      }
    } catch (e) {
      AppLogger.e('Export failed', e);
      if (mounted) {
        AppHelpers.showSnackBar(context, 'Export failed: $e', isError: true);
      }
    }
    if (mounted) setState(() => _isExporting = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Backup & Restore')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: AppConfig.primaryColor.withOpacity(0.12),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.cloud_upload_outlined,
                            color: AppConfig.primaryColor, size: 24),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Export Data',
                                style:
                                    Theme.of(context).textTheme.titleMedium),
                            const SizedBox(height: 2),
                            const Text(
                              'Export customers and transactions as a text file',
                              style: TextStyle(
                                  color: Colors.grey, fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  if (_lastBackupPath != null)
                    Text(
                      'Last backup saved successfully',
                      style: TextStyle(
                          color: AppConfig.successColor, fontSize: 12),
                    ),
                  const SizedBox(height: 8),
                  CustomButton(
                    label: 'Export & Share',
                    onPressed: _exportData,
                    isLoading: _isExporting,
                    icon: Icons.share,
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: AppConfig.accentColor.withOpacity(0.12),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.info_outline,
                            color: AppConfig.accentColor, size: 24),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Storage Info',
                                style:
                                    Theme.of(context).textTheme.titleMedium),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    '• All data is stored locally on your device\n'
                    '• Regular backups are recommended\n'
                    '• Export data before uninstalling the app\n'
                    '• Data is not synced to cloud automatically',
                    style: TextStyle(color: Colors.grey, fontSize: 13, height: 1.8),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
