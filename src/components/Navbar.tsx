'use client';

import { useState } from 'react';
import { Menu, Bell, Search, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  onMenuClick: () => void;
  title?: string;
}

export default function Navbar({ onMenuClick, title }: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          <Menu className="w-5 h-5" />
        </button>
        {title && (
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-gray-600 outline-none w-40"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-50">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Notifications</h3>
              {[
                { msg: 'Ramesh Sharma payment overdue ₹12,500', time: '2m ago', color: 'bg-red-100 text-red-600' },
                { msg: 'Anita Joshi made payment ₹11,000', time: '1h ago', color: 'bg-green-100 text-green-600' },
                { msg: '3 reminders scheduled for today', time: '2h ago', color: 'bg-blue-100 text-blue-600' },
              ].map((n, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.color.split(' ')[0]}`}></div>
                  <div>
                    <p className="text-sm text-gray-700">{n.msg}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Link href="/" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="hidden sm:block text-sm font-medium text-gray-700">Home</span>
        </Link>
      </div>
    </header>
  );
}
