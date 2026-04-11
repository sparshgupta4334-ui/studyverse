'use client';

import Link from 'next/link';
import { User, Shield, Bell, Smartphone, HelpCircle, ChevronRight } from 'lucide-react';

const SETTINGS_SECTIONS = [
  { icon: User, label: 'Profile', description: 'Update your name, business info, and contact details', href: '/settings/profile' },
  { icon: Shield, label: 'Security', description: 'Manage your password and account security', href: '/settings/security' },
  { icon: Bell, label: 'Notifications', description: 'Configure SMS and app notification preferences', href: '#' },
  { icon: Smartphone, label: 'App Settings', description: 'Language, theme, and display preferences', href: '#' },
  { icon: HelpCircle, label: 'Help & Support', description: 'Get help, view FAQs, and contact support', href: '/faq' },
];

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Settings</h1>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
        {SETTINGS_SECTIONS.map(({ icon: Icon, label, description, href }) => (
          <Link key={label} href={href} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-50 rounded-lg"><Icon size={18} className="text-blue-700" /></div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{label}</p>
                <p className="text-xs text-gray-500">{description}</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </Link>
        ))}
      </div>
    </div>
  );
}
