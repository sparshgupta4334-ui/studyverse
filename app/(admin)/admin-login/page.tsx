'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Lock } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.email !== 'admin@guptapaper.com') { toast.error('Invalid credentials'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    toast.success('Logged in as Admin');
    router.push('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-white font-bold text-xl mb-3">
            <BookOpen className="h-8 w-8 text-orange-400" />
            Gupta Paper Stores
          </div>
          <div className="inline-flex items-center gap-2 bg-gray-800 text-gray-300 text-sm px-3 py-1.5 rounded-full mb-2">
            <Lock size={14} /> Admin Portal
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-gray-400 text-xs mt-1">Use admin@guptapaper.com / any password</p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="admin@guptapaper.com"
                className="w-full px-3 py-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-sm"
              />
            </div>
            <Button type="submit" isLoading={loading} className="w-full bg-orange-600 hover:bg-orange-700" size="lg">
              Sign In as Admin
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-gray-500">
            <Link href="/" className="hover:text-gray-400">← Back to main site</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
