import 'package:flutter/material.dart';
import '../../config/app_config.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final List<Widget>? actions;
  final Widget? leading;
  final bool showBack;
  final VoidCallback? onBack;
  final Color? backgroundColor;
  final double elevation;
  final Widget? bottom;
  final double bottomHeight;

  const CustomAppBar({
    super.key,
    required this.title,
    this.actions,
    this.leading,
    this.showBack = true,
    this.onBack,
    this.backgroundColor,
    this.elevation = 0,
    this.bottom,
    this.bottomHeight = 0,
  });

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: Text(title),
      leading: leading ??
          (showBack && Navigator.canPop(context)
              ? IconButton(
                  icon: const Icon(Icons.arrow_back_ios_new),
                  onPressed: onBack ?? () => Navigator.pop(context),
                )
              : null),
      automaticallyImplyLeading: false,
      actions: actions,
      backgroundColor: backgroundColor ?? AppConfig.primaryColor,
      elevation: elevation,
      bottom: bottom != null
          ? PreferredSize(
              preferredSize: Size.fromHeight(bottomHeight),
              child: bottom!,
            )
          : null,
    );
  }

  @override
  Size get preferredSize =>
      Size.fromHeight(kToolbarHeight + bottomHeight);
}
