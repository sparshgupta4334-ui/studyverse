'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';

export default function NewCustomerPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (form.phone.length !== 10) e.phone = 'Enter valid 10-digit number';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    toast.success('Customer added successfully!');
    router.push('/customers');
  };

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/customers" className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Add Customer</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Customer Name *" placeholder="Ramesh Sharma" value={form.name} onChange={set('name')} error={errors.name} />
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Phone Number *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">+91</span>
              <input
                type="tel" maxLength={10}
                value={form.phone}
                onChange={(e) => { setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '') })); setErrors(er => ({ ...er, phone: '' })); }}
                placeholder="Phone number"
                className="w-full pl-12 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
              />
            </div>
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>
          <Input label="Email (optional)" type="email" placeholder="ramesh@example.com" value={form.email} onChange={set('email')} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Address (optional)</label>
            <textarea
              value={form.address}
              onChange={set('address')}
              rows={3}
              placeholder="Full address..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Link href="/customers" className="flex-1">
              <Button variant="outline" className="w-full" type="button">Cancel</Button>
            </Link>
            <Button type="submit" isLoading={loading} className="flex-1">Add Customer</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
