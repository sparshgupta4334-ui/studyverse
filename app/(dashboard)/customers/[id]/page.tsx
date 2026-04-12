'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import { customersApi, transactionsApi } from '@/lib/api';
import type { Customer, Transaction } from '@/lib/types';
import TransactionsList from '@/components/TransactionsList';
import { formatCurrency } from '@/lib/constants';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    Promise.all([
      customersApi.get(id),
      transactionsApi.list({ customer_id: id, limit: 20 }),
    ]).then(([cRes, tRes]) => {
      if (cRes.data.success && cRes.data.data) {
        setCustomer(cRes.data.data);
        reset(cRes.data.data);
      }
      if (tRes.data.success) setTransactions(tRes.data.data?.transactions ?? []);
    }).catch(() => setError('Failed to load customer')).finally(() => setLoading(false));
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    setSaving(true); setError(''); setSuccess('');
    try {
      const res = await customersApi.update(id, data);
      if (res.data.success) { setSuccess('Customer updated successfully'); setCustomer(res.data.data ?? null); }
      else setError(res.data.message || 'Update failed');
    } catch {
      setError('Update failed');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/customers" className="p-2 text-gray-500 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{customer?.name}</h1>
            <p className="text-sm text-gray-500">Customer details</p>
          </div>
        </div>
        <Link href={`/transactions/new?customer_id=${id}`} className="btn-primary inline-flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Transaction
        </Link>
      </div>

      {customer && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <p className="text-blue-100 text-sm">Current Balance</p>
            <p className="text-3xl font-bold mt-1">{formatCurrency(Math.abs(customer.balance))}</p>
            <p className="text-blue-200 text-xs mt-1">{customer.balance >= 0 ? 'Receivable' : 'Payable'}</p>
          </div>
          <div className="card md:col-span-2">
            <p className="text-sm text-gray-500 mb-1">Contact</p>
            <p className="font-medium">{customer.phone || '—'}</p>
            <p className="text-sm text-gray-500">{customer.email || '—'}</p>
            {customer.address && <p className="text-sm text-gray-500 mt-1">{customer.address}</p>}
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-4">Edit Customer</h2>
        {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4 border border-red-100">{error}</div>}
        {success && <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-4 border border-green-100">{success}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Name</label>
            <input {...register('name')} className="input-field" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label">Phone</label>
            <input {...register('phone')} type="tel" className="input-field" />
          </div>
          <div>
            <label className="label">Email</label>
            <input {...register('email')} type="email" className="input-field" />
          </div>
          <div>
            <label className="label">Address</label>
            <input {...register('address')} className="input-field" />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary px-6 py-2.5">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => { if (confirm('Delete this customer?')) { customersApi.delete(id).then(() => router.push('/customers')); } }}
              className="px-6 py-2.5 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              Delete Customer
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-4">Transaction History</h2>
        <TransactionsList transactions={transactions} showCustomer={false} />
      </div>
    </div>
  );
}
