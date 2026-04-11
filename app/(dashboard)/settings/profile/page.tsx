'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name ?? '',
    businessName: user?.businessName ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
  });
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    toast.success('Profile updated successfully!');
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/settings" className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"><ArrowLeft size={20} /></Link>
        <h1 className="text-xl font-bold text-gray-900">Profile Settings</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="h-16 w-16 rounded-full bg-blue-700 flex items-center justify-center text-white text-xl font-bold">
            {user ? getInitials(user.name) : 'U'}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.businessName}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" value={form.name} onChange={set('name')} />
          <Input label="Business Name" value={form.businessName} onChange={set('businessName')} />
          <Input label="Email" type="email" value={form.email} onChange={set('email')} />
          <Input label="Phone" value={form.phone} disabled className="bg-gray-50" helperText="Phone number cannot be changed" />
          <Button type="submit" isLoading={loading} className="w-full">Save Changes</Button>
        </form>
      </div>
    </div>
  );
}
