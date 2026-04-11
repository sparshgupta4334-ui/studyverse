'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useCustomers } from '@/hooks/useCustomers';
import { PAYMENT_METHODS } from '@/lib/constants';
import toast from 'react-hot-toast';

export default function NewTransactionPage() {
  const router = useRouter();
  const { customers } = useCustomers();
  const [form, setForm] = useState({ customerId: '', type: 'credit', amount: '', description: '', paymentMethod: 'cash', date: new Date().toISOString().slice(0, 10) });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customerId) e.customerId = 'Select a customer';
    if (!form.amount || parseFloat(form.amount) <= 0) e.amount = 'Enter valid amount';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    toast.success('Transaction added!');
    router.push('/transactions');
  };

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/transactions" className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Add Transaction</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Customer *</label>
            <select value={form.customerId} onChange={set('customerId')} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white">
              <option value="">Select customer</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name} (+91 {c.phone})</option>)}
            </select>
            {errors.customerId && <p className="text-xs text-red-500">{errors.customerId}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Transaction Type</label>
            <div className="grid grid-cols-2 gap-3">
              {[{ value: 'credit', label: '↑ Credit (Given)', color: 'border-green-500 bg-green-50 text-green-700' }, { value: 'debit', label: '↓ Debit (Received)', color: 'border-red-400 bg-red-50 text-red-700' }].map((t) => (
                <button key={t.value} type="button" onClick={() => setForm(f => ({ ...f, type: t.value }))}
                  className={`py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition-all ${form.type === t.value ? t.color : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <Input label="Amount (₹) *" type="number" min="1" placeholder="0.00" value={form.amount} onChange={set('amount')} error={errors.amount} />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Payment Method</label>
            <select value={form.paymentMethod} onChange={set('paymentMethod')} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white">
              {PAYMENT_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>

          <Input label="Date" type="date" value={form.date} onChange={set('date')} />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Description (optional)</label>
            <textarea value={form.description} onChange={set('description')} rows={2} placeholder="Notes about this transaction..." className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <Link href="/transactions" className="flex-1">
              <Button variant="outline" className="w-full" type="button">Cancel</Button>
            </Link>
            <Button type="submit" isLoading={loading} className="flex-1">Save Transaction</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
