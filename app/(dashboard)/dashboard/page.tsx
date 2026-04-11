'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Users, ArrowLeftRight, Plus } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { BalanceSummary } from '@/components/dashboard/BalanceSummary';
import { PageLoading } from '@/components/common/Loading';
import { getDashboardStats } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import type { DashboardStats } from '@/lib/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  if (!stats) return <PageLoading />;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back! Here&apos;s your business overview.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/customers/new" className="hidden sm:inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Plus size={16} /> Add Customer
          </Link>
          <Link href="/transactions/new" className="hidden sm:inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Plus size={16} /> Add Entry
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Receivable" value={formatCurrency(stats.totalReceivable)} icon={TrendingUp} color="green" trend="vs last month" trendUp />
        <StatCard title="Total Payable" value={formatCurrency(stats.totalPayable)} icon={TrendingDown} color="red" />
        <StatCard title="Total Customers" value={String(stats.totalCustomers)} icon={Users} color="blue" trend="+2 this month" trendUp />
        <StatCard title="Total Transactions" value={String(stats.totalTransactions)} icon={ArrowLeftRight} color="purple" trend="+5 this month" trendUp />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactions transactions={stats.recentTransactions} />
        </div>
        <div>
          <BalanceSummary totalReceivable={stats.totalReceivable} totalPayable={stats.totalPayable} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Add Customer', href: '/customers/new', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
            { label: 'New Transaction', href: '/transactions/new', color: 'bg-green-50 text-green-700 hover:bg-green-100' },
            { label: 'Send Reminder', href: '/reminders/new', color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
            { label: 'View Reports', href: '/reports', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
          ].map((action) => (
            <Link key={action.href} href={action.href} className={`rounded-lg p-4 text-sm font-medium text-center transition-colors ${action.color}`}>
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
