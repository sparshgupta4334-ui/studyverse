'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useTransaction } from '@/hooks/useTransactions';
import { PageLoading } from '@/components/common/Loading';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function TransactionDetailPage() {
  const { id } = useParams();
  const { transaction, isLoading } = useTransaction(id as string);

  if (isLoading) return <PageLoading />;
  if (!transaction) return <div className="text-center py-20 text-gray-400">Transaction not found</div>;

  const fields = [
    { label: 'Customer', value: transaction.customerName },
    { label: 'Type', value: transaction.type === 'credit' ? 'Credit (Given)' : 'Debit (Received)' },
    { label: 'Amount', value: formatCurrency(transaction.amount) },
    { label: 'Payment Method', value: transaction.paymentMethod },
    { label: 'Date', value: formatDateTime(transaction.date) },
    { label: 'Description', value: transaction.description || '-' },
    { label: 'Transaction ID', value: transaction.id },
  ];

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/transactions" className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Transaction Details</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className={cn('px-6 py-5 text-center rounded-t-xl', transaction.type === 'credit' ? 'bg-green-50' : 'bg-red-50')}>
          <p className={cn('text-3xl font-extrabold', transaction.type === 'credit' ? 'text-green-700' : 'text-red-600')}>
            {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
          </p>
          <span className={cn('mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium', transaction.type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
            {transaction.type === 'credit' ? 'Credit' : 'Debit'}
          </span>
        </div>
        <div className="divide-y divide-gray-100">
          {fields.map((f) => (
            <div key={f.label} className="flex justify-between px-6 py-3 text-sm">
              <span className="text-gray-500">{f.label}</span>
              <span className="font-medium text-gray-900 capitalize">{f.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
