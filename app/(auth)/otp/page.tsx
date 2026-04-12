'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { authApi } from '@/lib/api';
import { saveToken, saveUser } from '@/lib/auth';

function OTPContent() {
  const router = useRouter();
  const params = useSearchParams();
  const phone = params.get('phone') || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val.slice(-1);
    setOtp(newOtp);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) { setError('Enter all 6 digits'); return; }
    setLoading(true); setError('');
    try {
      const res = await authApi.verifyOTP(phone, code);
      if (res.data.success && res.data.data) {
        saveToken(res.data.data.token);
        saveUser(res.data.data.user);
        router.push('/dashboard');
      } else {
        setError(res.data.message || 'Invalid OTP');
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      await authApi.sendOTP(phone);
      setResendTimer(30);
      setError('');
    } catch {
      setError('Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-3">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Verify OTP</h1>
          <p className="text-gray-500 text-sm mt-1">
            Enter the 6-digit code sent to <span className="font-semibold text-gray-700">{phone}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4 border border-red-100">
            {error}
          </div>
        )}

        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary transition-colors"
            />
          ))}
        </div>

        <button onClick={handleVerify} disabled={loading} className="btn-primary w-full py-3 text-base mb-4">
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        <p className="text-sm text-gray-500">
          Didn&apos;t receive the code?{' '}
          <button
            onClick={handleResend}
            disabled={resendTimer > 0}
            className="text-primary font-medium hover:underline disabled:text-gray-400 disabled:no-underline"
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default function OTPPage() {
  return (
    <Suspense>
      <OTPContent />
    </Suspense>
  );
}
