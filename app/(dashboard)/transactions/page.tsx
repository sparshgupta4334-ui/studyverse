'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { transactionsApi } from '@/lib/api';
import type { Transaction } from '@/lib/types';
import TransactionsList from '@/components/TransactionsList';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<{ type: string; from: string; to: string }>({ type: '', from: '', to: '' });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await transactionsApi.list({
        type: filter.type || undefined,
        from: filter.from || undefined,
        to: filter.to || undefined,
        page,
        limit,
      });
      if (res.data.success && res.data.data) {
        setTransactions(res.data.data.transactions);
        setTotal(res.data.data.total);
      }
    } catch {
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} total</p>
        </div>
        <Link href="/transactions/new" className="btn-primary inline-flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Transaction
        </Link>
      </div>

      {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-100">{error}</div>}

      <div className="card">
        <div className="flex flex-wrap gap-3 mb-5">
          <select
            value={filter.type}
            onChange={(e) => { setFilter((f) => ({ ...f, type: e.target.value })); setPage(1); }}
            className="input-field w-auto"
          >
            <option value="">All Types</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filter.from}
              onChange={(e) => { setFilter((f) => ({ ...f, from: e.target.value })); setPage(1); }}
              className="input-field w-auto"
            />
            <span className="text-gray-400 text-sm">to</span>
            <input
              type="date"
              value={filter.to}
              onChange={(e) => { setFilter((f) => ({ ...f, to: e.target.value })); setPage(1); }}
              className="input-field w-auto"
            />
          </div>
          {(filter.type || filter.from || filter.to) && (
            <button
              onClick={() => { setFilter({ type: '', from: '', to: '' }); setPage(1); }}
              className="text-sm text-gray-500 hover:text-red-500 underline"
            >
              Clear filters
            </button>
          )}
        </div>

        <TransactionsList transactions={transactions} loading={loading} />

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => p - 1)} disabled={page === 1} className="btn-outline text-sm px-3 py-1.5 disabled:opacity-40">
                Previous
              </button>
              <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages} className="btn-primary text-sm px-3 py-1.5 disabled:opacity-40">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
