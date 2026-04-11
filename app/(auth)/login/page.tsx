'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Phone } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) { setError('Enter a valid 10-digit phone number'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    router.push(`/otp?phone=${phone}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-700 font-bold text-xl mb-3">
            <BookOpen className="h-8 w-8 text-orange-600" />
            Gupta Paper Stores
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">+91</span>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setError(''); }}
                placeholder="Enter phone number"
                className="w-full pl-12 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <Button type="submit" isLoading={loading} className="w-full" size="lg">
              Send OTP
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:underline font-medium">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
