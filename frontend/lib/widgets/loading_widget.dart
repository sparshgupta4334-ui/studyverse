import 'package:flutter/material.dart';
import '../config/app_theme.dart';

/// Default spinner loader
class LoadingWidget extends StatelessWidget {
  final double size;
  final Color? color;

  const LoadingWidget({super.key, this.size = 24, this.color});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: CircularProgressIndicator(
        strokeWidth: 2.5,
        valueColor: AlwaysStoppedAnimation<Color>(
          color ?? AppTheme.primaryGreen,
        ),
      ),
    );
  }
}

/// Full-screen loading overlay
class FullScreenLoader extends StatelessWidget {
  final String? message;

  const FullScreenLoader({super.key, this.message});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black.withOpacity(0.4),
      body: Center(
        child: Container(
          padding: const EdgeInsets.all(32),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const LoadingWidget(size: 48),
              if (message != null) ...[
                const SizedBox(height: 16),
                Text(
                  message!,
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

/// Shimmer-style loading placeholder for list items
class ShimmerListItem extends StatefulWidget {
  const ShimmerListItem({super.key});

  @override
  State<ShimmerListItem> createState() => _ShimmerListItemState();
}

class _ShimmerListItemState extends State<ShimmerListItem>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat(reverse: true);
    _animation = Tween<double>(begin: 0.3, end: 0.7).animate(_controller);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final baseColor = isDark ? const Color(0xFF3A3A3A) : const Color(0xFFEEEEEE);

    return AnimatedBuilder(
      animation: _animation,
      builder: (context, _) => Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Row(
          children: [
            _ShimmerBox(
              width: 44,
              height: 44,
              borderRadius: 22,
              opacity: _animation.value,
              color: baseColor,
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _ShimmerBox(
                    width: 160,
                    height: 14,
                    borderRadius: 7,
                    opacity: _animation.value,
                    color: baseColor,
                  ),
                  const SizedBox(height: 8),
                  _ShimmerBox(
                    width: 100,
                    height: 11,
                    borderRadius: 5,
                    opacity: _animation.value * 0.7,
                    color: baseColor,
                  ),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                _ShimmerBox(
                  width: 70,
                  height: 14,
                  borderRadius: 7,
                  opacity: _animation.value,
                  color: baseColor,
                ),
                const SizedBox(height: 8),
                _ShimmerBox(
                  width: 50,
                  height: 11,
                  borderRadius: 10,
                  opacity: _animation.value * 0.7,
                  color: baseColor,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _ShimmerBox extends StatelessWidget {
  final double width;
  final double height;
  final double borderRadius;
  final double opacity;
  final Color color;

  const _ShimmerBox({
    required this.width,
    required this.height,
    required this.borderRadius,
    required this.opacity,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Opacity(
      opacity: opacity,
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(borderRadius),
        ),
      ),
    );
  }
}

/// Loading list (multiple shimmer items)
class ShimmerList extends StatelessWidget {
  final int count;

  const ShimmerList({super.key, this.count = 6});

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      physics: const NeverScrollableScrollPhysics(),
      itemCount: count,
      separatorBuilder: (_, __) => const Divider(height: 1, indent: 72),
      itemBuilder: (_, __) => const ShimmerListItem(),
    );
  }
}
