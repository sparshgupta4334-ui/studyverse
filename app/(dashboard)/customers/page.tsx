'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { PageLoading } from '@/components/common/Loading';
import { formatCurrency, getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function CustomersPage() {
  const { customers, isLoading } = useCustomers();
  const [search, setSearch] = useState('');

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  if (isLoading) return <PageLoading />;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Customers</h1>
        <Link href="/customers/new" className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus size={16} /> Add Customer
        </Link>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">No customers found</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((c) => (
              <Link key={c.id} href={`/customers/${c.id}`} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {getInitials(c.name)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{c.name}</p>
                    <p className="text-sm text-gray-500">+91 {c.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn('font-semibold', c.balance > 0 ? 'text-green-600' : c.balance < 0 ? 'text-red-500' : 'text-gray-500')}>
                    {c.balance === 0 ? 'Settled' : `${c.balance > 0 ? '+' : ''}${formatCurrency(c.balance)}`}
                  </p>
                  <p className="text-xs text-gray-400">{c.balance > 0 ? 'to receive' : c.balance < 0 ? 'to pay' : ''}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
