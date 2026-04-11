'use client';

import { useEffect, useState } from 'react';
import { getPayments } from '@/lib/api';
import { PageLoading } from '@/components/common/Loading';
import { formatCurrency, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Payment } from '@/lib/types';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { getPayments().then(setPayments).finally(() => setIsLoading(false)); }, []);

  if (isLoading) return <PageLoading />;

  const total = payments.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Payments History</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Payments</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{formatCurrency(total)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-500">Transactions</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{payments.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{payments.filter(p => p.status === 'completed').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Customer', 'Amount', 'Method', 'Date', 'Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{p.customerName}</td>
                <td className="px-4 py-3 font-semibold text-green-600">{formatCurrency(p.amount)}</td>
                <td className="px-4 py-3 text-gray-500 capitalize">{p.method}</td>
                <td className="px-4 py-3 text-gray-500">{formatDate(p.date)}</td>
                <td className="px-4 py-3">
                  <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    p.status === 'completed' ? 'bg-green-100 text-green-700' : p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700')}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
