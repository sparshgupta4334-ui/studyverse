'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, ArrowLeftRight, Users } from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import type { DashboardStats } from '@/lib/types';
import DashboardCards from '@/components/DashboardCards';
import TransactionsList from '@/components/TransactionsList';
import { formatDate } from '@/lib/constants';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardApi.stats()
      .then((res) => { if (res.data.success) setStats(res.data.data ?? null); })
      .catch(() => setError('Failed to load dashboard stats'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {formatDate(new Date().toISOString())}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/transactions/new" className="btn-primary inline-flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add Transaction
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <DashboardCards stats={stats} />
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/customers/new" className="card flex items-center gap-4 hover:shadow-md transition-shadow group">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
            <Users className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Add Customer</p>
            <p className="text-sm text-gray-500">Register a new customer</p>
          </div>
        </Link>
        <Link href="/transactions/new" className="card flex items-center gap-4 hover:shadow-md transition-shadow group">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-accent transition-colors">
            <ArrowLeftRight className="w-6 h-6 text-accent group-hover:text-white transition-colors" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Add Transaction</p>
            <p className="text-sm text-gray-500">Record a credit or debit</p>
          </div>
        </Link>
        <Link href="/reminders" className="card flex items-center gap-4 hover:shadow-md transition-shadow group">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-600 transition-colors">
            <svg className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Send Reminder</p>
            <p className="text-sm text-gray-500">SMS payment reminders</p>
          </div>
        </Link>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Recent Transactions</h2>
          <Link href="/transactions" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        <TransactionsList
          transactions={stats?.recent_transactions ?? []}
          loading={loading}
        />
      </div>
    </div>
  );
}
