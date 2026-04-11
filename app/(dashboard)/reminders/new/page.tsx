'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useCustomers } from '@/hooks/useCustomers';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function NewReminderPage() {
  const router = useRouter();
  const { customers } = useCustomers();
  const [customerId, setCustomerId] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const selected = customers.find((c) => c.id === customerId);

  const handleCustomerChange = (id: string) => {
    setCustomerId(id);
    const c = customers.find((cu) => cu.id === id);
    if (c) {
      setMessage(`Dear ${c.name} ji, your outstanding balance is ${formatCurrency(c.balance)}. Please clear at your earliest convenience. - Gupta Paper Stores`);
    }
    setErrors((er) => ({ ...er, customerId: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) { setErrors({ customerId: 'Select a customer' }); return; }
    if (!message.trim()) { setErrors({ message: 'Message is required' }); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Reminder sent successfully!');
    router.push('/reminders');
  };

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/reminders" className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Send Reminder</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Select Customer *</label>
            <select value={customerId} onChange={(e) => handleCustomerChange(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white">
              <option value="">Choose a customer</option>
              {customers.filter((c) => c.balance > 0).map((c) => (
                <option key={c.id} value={c.id}>{c.name} — {formatCurrency(c.balance)} due</option>
              ))}
            </select>
            {errors.customerId && <p className="text-xs text-red-500">{errors.customerId}</p>}
          </div>

          {selected && (
            <div className="bg-blue-50 rounded-lg p-3 text-sm">
              <p className="text-gray-700">Phone: <span className="font-medium">+91 {selected.phone}</span></p>
              <p className="text-gray-700">Outstanding: <span className="font-semibold text-red-600">{formatCurrency(selected.balance)}</span></p>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Message *</label>
            <textarea
              value={message}
              onChange={(e) => { setMessage(e.target.value); setErrors(er => ({ ...er, message: '' })); }}
              rows={4}
              placeholder="Enter SMS reminder message..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm resize-none"
            />
            <p className="text-xs text-gray-400 text-right">{message.length}/160 chars</p>
            {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <Link href="/reminders" className="flex-1">
              <Button variant="outline" className="w-full" type="button">Cancel</Button>
            </Link>
            <Button type="submit" isLoading={loading} className="flex-1">Send SMS</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
