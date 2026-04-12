'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { customersApi } from '@/lib/api';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
  balance: z.coerce.number().default(0),
});
type FormData = z.infer<typeof schema>;

export default function NewCustomerPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { balance: 0 },
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      const res = await customersApi.create({
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        address: data.address,
        balance: Math.round((data.balance || 0) * 100),
      });
      if (res.data.success) {
        router.push('/customers');
      } else {
        setError(res.data.message || 'Failed to create customer');
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Failed to create customer');
    }
  };

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/customers" className="p-2 text-gray-500 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Customer</h1>
          <p className="text-gray-500 text-sm">Fill in the customer details below</p>
        </div>
      </div>

      <div className="card">
        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4 border border-red-100">{error}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Name <span className="text-red-500">*</span></label>
            <input {...register('name')} type="text" placeholder="Customer name" className="input-field" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label">Phone</label>
            <input {...register('phone')} type="tel" placeholder="9876543210" className="input-field" />
          </div>
          <div>
            <label className="label">Email</label>
            <input {...register('email')} type="email" placeholder="customer@email.com" className="input-field" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label">Address</label>
            <textarea {...register('address')} rows={3} placeholder="Customer address" className="input-field resize-none" />
          </div>
          <div>
            <label className="label">Opening Balance (₹)</label>
            <input {...register('balance')} type="number" step="0.01" placeholder="0.00" className="input-field" />
            <p className="text-xs text-gray-400 mt-1">Positive = receivable, negative = payable</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 py-2.5">
              {isSubmitting ? 'Adding...' : 'Add Customer'}
            </button>
            <Link href="/customers" className="btn-outline px-6 py-2.5 text-sm text-center">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
