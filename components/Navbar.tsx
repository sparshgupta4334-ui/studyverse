'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Bell, LogOut, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { logout, getUser } from '@/lib/auth';

export default function Navbar() {
  const router = useRouter();
  const user = getUser();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900 hidden md:block">Gupta Paper Stores</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 text-gray-500 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900 leading-none">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 mt-0.5">{user?.phone}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <User className="w-4 h-4" /> Profile Settings
              </Link>
              <hr className="my-1 border-gray-100" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
