'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, BarChart2, Server, FileText, BookOpen, Menu, X, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin', Icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', Icon: Users },
  { label: 'Analytics', href: '/admin/analytics', Icon: BarChart2 },
  { label: 'System', href: '/admin/system', Icon: Server },
  { label: 'Content', href: '/admin/content', Icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-gray-900 border-r border-gray-800">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-800">
          <BookOpen className="h-6 w-6 text-orange-400" />
          <span className="text-white font-bold">Admin Panel</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {ADMIN_NAV.map(({ label, href, Icon }) => {
            const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
            return (
              <Link key={href} href={href} className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors', isActive ? 'bg-orange-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white')}>
                <Icon size={18} /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-gray-800 p-3">
          <Link href="/admin-login" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <LogOut size={18} /> Logout
          </Link>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-50 flex flex-col w-64 bg-gray-900">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <span className="text-white font-bold">Admin Panel</span>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {ADMIN_NAV.map(({ label, href, Icon }) => (
                <Link key={href} href={href} onClick={() => setSidebarOpen(false)} className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors', pathname === href ? 'bg-orange-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white')}>
                  <Icon size={18} /> {label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-gray-800 bg-gray-900 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white"><Menu size={20} /></button>
            <span className="text-white font-semibold text-sm">Gupta Paper Stores — Admin</span>
          </div>
          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">admin@guptapaper.com</span>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-950 p-4 sm:p-6 text-white">
          {children}
        </main>
      </div>
    </div>
  );
}
