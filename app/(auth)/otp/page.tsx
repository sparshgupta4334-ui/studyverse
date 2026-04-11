'use client';

import { useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';

function OTPForm() {
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') ?? '';
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const { signIn, isLoading } = useAuth();

  const handleChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    setError('');
    if (val && idx < 3) refs[idx + 1].current?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) refs[idx - 1].current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 4) { setError('Enter the 4-digit OTP'); return; }
    await signIn(phone, code);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-700 font-bold text-xl mb-3">
            <BookOpen className="h-8 w-8 text-orange-600" />
            Gupta Paper Stores
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Verify OTP</h1>
          <p className="text-gray-500 text-sm mt-1">
            We sent a 4-digit OTP to <span className="font-medium text-gray-700">+91 {phone}</span>
          </p>
          <p className="text-xs text-blue-600 mt-1">(Use any 4 digits for demo)</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-3">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={refs[idx]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="h-14 w-14 rounded-xl border-2 border-gray-300 text-center text-xl font-bold outline-none focus:border-blue-500 transition-colors"
                />
              ))}
            </div>
            {error && <p className="text-xs text-red-500 text-center">{error}</p>}
            <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
              Verify & Login
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            <button className="text-blue-600 hover:underline font-medium">Resend OTP</button>
          </p>
          <p className="mt-3 text-center text-sm text-gray-500">
            <Link href="/login" className="text-gray-500 hover:underline">← Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OTPPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full" /></div>}>
      <OTPForm />
    </Suspense>
  );
}
