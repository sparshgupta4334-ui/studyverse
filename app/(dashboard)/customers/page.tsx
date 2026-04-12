'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { customersApi } from '@/lib/api';
import type { Customer } from '@/lib/types';
import CustomersList from '@/components/CustomersList';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCustomers = useCallback(async (q?: string) => {
    setLoading(true);
    try {
      const res = await customersApi.list(q);
      if (res.data.success) setCustomers(res.data.data ?? []);
    } catch {
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  useEffect(() => {
    const t = setTimeout(() => fetchCustomers(search), 400);
    return () => clearTimeout(t);
  }, [search, fetchCustomers]);

  const handleDelete = async (id: string) => {
    await customersApi.delete(id);
    setCustomers((prev) => prev.filter((c) => c.customer_id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500 text-sm mt-0.5">{customers.length} customers</p>
        </div>
        <Link href="/customers/new" className="btn-primary inline-flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Customer
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-100">{error}</div>
      )}

      <div className="card">
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>
        </div>
        <CustomersList customers={customers} onDelete={handleDelete} loading={loading} />
      </div>
    </div>
  );
}
