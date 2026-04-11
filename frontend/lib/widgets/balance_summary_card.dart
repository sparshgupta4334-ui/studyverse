import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../config/app_theme.dart';

class BalanceSummaryCard extends StatelessWidget {
  final String label;
  final double amount;
  final bool isReceivable;

  const BalanceSummaryCard({
    super.key,
    required this.label,
    required this.amount,
    required this.isReceivable,
  });

  @override
  Widget build(BuildContext context) {
    final color =
        isReceivable ? AppTheme.receivableGreen : AppTheme.payableRed;
    final bgColor = color.withOpacity(0.08);
    final iconData = isReceivable
        ? Icons.arrow_downward_rounded
        : Icons.arrow_upward_rounded;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(iconData, color: color, size: 16),
              ),
              const SizedBox(width: 8),
              Text(
                label,
                style: TextStyle(
                  color: color,
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            '₹${NumberFormat('#,##,###').format(amount)}',
            style: TextStyle(
              color: color,
              fontSize: 22,
              fontWeight: FontWeight.bold,
              letterSpacing: -0.5,
            ),
          ),
        ],
      ),
    );
  }
}

/// A wider single-line summary card for net balance
class NetBalanceCard extends StatelessWidget {
  final double receivable;
  final double payable;

  const NetBalanceCard({
    super.key,
    required this.receivable,
    required this.payable,
  });

  double get net => receivable - payable;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isPositive = net >= 0;
    final color =
        isPositive ? AppTheme.receivableGreen : AppTheme.payableRed;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppTheme.primaryGreen,
            AppTheme.primaryGreenLight,
          ],
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Net Balance',
            style: TextStyle(color: Colors.white70, fontSize: 14),
          ),
          const SizedBox(height: 4),
          Text(
            '₹${NumberFormat('#,##,###').format(net.abs())}',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 28,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              _MiniStat(
                label: 'Receivable',
                amount: receivable,
                color: Colors.greenAccent,
              ),
              const SizedBox(width: 24),
              _MiniStat(
                label: 'Payable',
                amount: payable,
                color: Colors.redAccent,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _MiniStat extends StatelessWidget {
  final String label;
  final double amount;
  final Color color;

  const _MiniStat({
    required this.label,
    required this.amount,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
              color: Colors.white.withOpacity(0.7), fontSize: 12),
        ),
        const SizedBox(height: 2),
        Text(
          '₹${NumberFormat('#,##,###').format(amount)}',
          style: TextStyle(
            color: color,
            fontSize: 15,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}
