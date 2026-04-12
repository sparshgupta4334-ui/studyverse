'use client';
import { formatCurrency, formatDate } from '@/lib/constants';
import type { Transaction } from '@/lib/types';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  loading?: boolean;
  showCustomer?: boolean;
}

export default function TransactionsList({ transactions, loading, showCustomer = true }: Props) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-sm">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {showCustomer && <th className="text-left py-3 px-4 text-gray-500 font-medium">Customer</th>}
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Type</th>
            <th className="text-right py-3 px-4 text-gray-500 font-medium">Amount</th>
            <th className="text-right py-3 px-4 text-gray-500 font-medium">Balance After</th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Notes</th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.transaction_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              {showCustomer && (
                <td className="py-3 px-4 font-medium text-gray-900">{t.customer_name || '—'}</td>
              )}
              <td className="py-3 px-4">
                <span className={clsx(
                  'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
                  t.type === 'credit' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                )}>
                  {t.type === 'credit'
                    ? <TrendingUp className="w-3 h-3" />
                    : <TrendingDown className="w-3 h-3" />}
                  {t.type === 'credit' ? 'Credit' : 'Debit'}
                </span>
              </td>
              <td className="py-3 px-4 text-right font-medium">
                <span className={t.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                  {t.type === 'credit' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>
              </td>
              <td className="py-3 px-4 text-right text-gray-600">{formatCurrency(t.balance_after)}</td>
              <td className="py-3 px-4 text-gray-500 max-w-xs truncate">{t.notes || '—'}</td>
              <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{formatDate(t.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
