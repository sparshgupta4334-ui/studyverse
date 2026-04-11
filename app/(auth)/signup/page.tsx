'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', businessName: '', phone: '', email: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.businessName.trim()) e.businessName = 'Business name is required';
    if (form.phone.length !== 10) e.phone = 'Enter valid 10-digit phone number';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Account created! Please verify your phone.');
    router.push(`/otp?phone=${form.phone}`);
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: '' }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-700 font-bold text-xl mb-3">
            <BookOpen className="h-8 w-8 text-orange-600" />
            Gupta Paper Stores
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Start managing your business for free</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Your Name" placeholder="Raj Gupta" value={form.name} onChange={set('name')} error={errors.name} />
            <Input label="Business Name" placeholder="Gupta Paper Stores" value={form.businessName} onChange={set('businessName')} error={errors.businessName} />
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Phone Number</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">+91</span>
                <input
                  type="tel" maxLength={10}
                  value={form.phone}
                  onChange={(e) => { setForm(f => ({ ...f, phone: e.target.value.replace(/\D/, '') })); setErrors(er => ({ ...er, phone: '' })); }}
                  placeholder="Phone number"
                  className="w-full pl-12 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                />
              </div>
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
            <Input label="Email (optional)" type="email" placeholder="raj@example.com" value={form.email} onChange={set('email')} />
            <Button type="submit" isLoading={loading} className="w-full mt-2" size="lg">
              Create Free Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
          </p>
          <p className="mt-3 text-center text-xs text-gray-400">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="underline">Terms</Link> and{' '}
            <Link href="/privacy" className="underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
