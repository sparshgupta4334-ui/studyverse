'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, ArrowLeftRight, CreditCard,
  Bell, BarChart2, Settings, BookOpen, LogOut, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';

const NAV = [
  { label: 'Dashboard', href: '/dashboard', Icon: LayoutDashboard },
  { label: 'Customers', href: '/customers', Icon: Users },
  { label: 'Transactions', href: '/transactions', Icon: ArrowLeftRight },
  { label: 'Payments', href: '/payments', Icon: CreditCard },
  { label: 'Reminders', href: '/reminders', Icon: Bell },
  { label: 'Reports', href: '/reports', Icon: BarChart2 },
  { label: 'Settings', href: '/settings', Icon: Settings },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { signOut, user } = useAuth();

  return (
    <aside className="flex h-full flex-col bg-blue-800 text-white w-64">
      <div className="flex items-center justify-between px-5 py-4 border-b border-blue-700">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <BookOpen className="h-6 w-6 text-orange-400" />
          <span className="truncate">{APP_NAME}</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-blue-300 hover:text-white lg:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="px-4 py-4 border-b border-blue-700">
        <p className="text-sm font-semibold text-white truncate">{user?.name ?? 'User'}</p>
        <p className="text-xs text-blue-300 truncate">{user?.businessName ?? ''}</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV.map(({ label, href, Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-200 hover:bg-blue-700/60 hover:text-white'
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-blue-700 p-3">
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-blue-200 hover:bg-blue-700/60 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
