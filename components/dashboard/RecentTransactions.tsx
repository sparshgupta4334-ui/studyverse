'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Transaction } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">Recent Transactions</h3>
        <Link href="/transactions" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
          View all <ArrowRight size={14} />
        </Link>
      </div>
      <div className="divide-y divide-gray-50">
        {transactions.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-gray-400">No transactions yet</p>
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={cn(
                  'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold',
                  tx.type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                )}>
                  {tx.type === 'credit' ? '↑' : '↓'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{tx.customerName}</p>
                  <p className="text-xs text-gray-500">{formatDate(tx.date)} · {tx.paymentMethod}</p>
                </div>
              </div>
              <span className={cn('text-sm font-semibold flex-shrink-0 ml-3', tx.type === 'credit' ? 'text-green-700' : 'text-red-600')}>
                {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
