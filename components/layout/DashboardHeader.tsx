'use client';

import { Bell, Menu, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/lib/utils';

interface DashboardHeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
        >
          <Menu size={20} />
        </button>
        {title && <h1 className="text-base font-semibold text-gray-800 hidden sm:block">{title}</h1>}
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-1.5 rounded-full text-gray-500 hover:bg-gray-100">
          <Bell size={20} />
          <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold">
            {user ? getInitials(user.name) : 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-800 leading-tight">{user?.name ?? 'User'}</p>
            <p className="text-xs text-gray-500 leading-tight">{user?.businessName ?? ''}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
