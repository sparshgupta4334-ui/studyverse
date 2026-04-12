'use client';
import { Users, TrendingUp, TrendingDown, ArrowLeftRight } from 'lucide-react';
import { formatCurrency } from '@/lib/constants';
import type { DashboardStats } from '@/lib/types';

interface Props {
  stats: DashboardStats | null;
}

export default function DashboardCards({ stats }: Props) {
  const cards = [
    {
      label: 'Total Customers',
      value: stats?.total_customers?.toString() ?? '—',
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      border: 'border-blue-100',
    },
    {
      label: 'Total Receivable',
      value: stats ? formatCurrency(stats.total_receivable) : '—',
      icon: TrendingUp,
      color: 'bg-green-50 text-green-600',
      border: 'border-green-100',
    },
    {
      label: 'Total Payable',
      value: stats ? formatCurrency(stats.total_payable) : '—',
      icon: TrendingDown,
      color: 'bg-orange-50 text-orange-600',
      border: 'border-orange-100',
    },
    {
      label: 'Total Transactions',
      value: stats?.total_transactions?.toString() ?? '—',
      icon: ArrowLeftRight,
      color: 'bg-purple-50 text-purple-600',
      border: 'border-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((c) => (
        <div key={c.label} className={`bg-white rounded-xl border ${c.border} p-5 shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500 font-medium">{c.label}</p>
            <div className={`w-9 h-9 rounded-lg ${c.color} flex items-center justify-center`}>
              <c.icon className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
