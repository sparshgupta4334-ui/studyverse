'use client';
import { useEffect, useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { transactionsApi, customersApi } from '@/lib/api';
import type { Customer } from '@/lib/types';

const schema = z.object({
  customer_id: z.string().min(1, 'Select a customer'),
  amount: z.coerce.number().positive('Amount must be positive'),
  type: z.enum(['credit', 'debit']),
  notes: z.string().optional(),
  category: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function NewTransactionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillCustomer = searchParams.get('customer_id') || '';
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { customer_id: prefillCustomer, type: 'credit' },
  });

  useEffect(() => {
    customersApi.list().then((res) => {
      if (res.data.success) setCustomers(res.data.data ?? []);
    }).catch(() => {});
  }, []);

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      const res = await transactionsApi.create({
        customer_id: data.customer_id,
        amount: Math.round(data.amount * 100),
        type: data.type,
        notes: data.notes,
        category: data.category,
      });
      if (res.data.success) {
        router.push('/transactions');
      } else {
        setError(res.data.message || 'Failed to add transaction');
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Failed to add transaction');
    }
  };

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/transactions" className="p-2 text-gray-500 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Transaction</h1>
          <p className="text-gray-500 text-sm">Record a credit or debit</p>
        </div>
      </div>

      <div className="card">
        {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4 border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Customer <span className="text-red-500">*</span></label>
            <select {...register('customer_id')} className="input-field">
              <option value="">Select customer...</option>
              {customers.map((c) => (
                <option key={c.customer_id} value={c.customer_id}>{c.name}</option>
              ))}
            </select>
            {errors.customer_id && <p className="text-red-500 text-xs mt-1">{errors.customer_id.message}</p>}
          </div>

          <div>
            <label className="label">Transaction Type <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer has-[:checked]:border-green-500 has-[:checked]:bg-green-50">
                <input {...register('type')} type="radio" value="credit" className="accent-green-600" />
                <span className="text-sm font-medium text-gray-700">Credit (+ Add)</span>
              </label>
              <label className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer has-[:checked]:border-red-400 has-[:checked]:bg-red-50">
                <input {...register('type')} type="radio" value="debit" className="accent-red-600" />
                <span className="text-sm font-medium text-gray-700">Debit (- Subtract)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="label">Amount (₹) <span className="text-red-500">*</span></label>
            <input {...register('amount')} type="number" step="0.01" min="0.01" placeholder="0.00" className="input-field" />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
          </div>

          <div>
            <label className="label">Category</label>
            <input {...register('category')} type="text" placeholder="e.g. Purchase, Payment, Advance" className="input-field" />
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea {...register('notes')} rows={3} placeholder="Optional notes about this transaction" className="input-field resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 py-2.5">
              {isSubmitting ? 'Adding...' : 'Add Transaction'}
            </button>
            <Link href="/transactions" className="btn-outline px-6 py-2.5 text-sm text-center">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewTransactionPage() {
  return (
    <Suspense>
      <NewTransactionContent />
    </Suspense>
  );
}
