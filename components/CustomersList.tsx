'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/constants';
import type { Customer } from '@/lib/types';

interface Props {
  customers: Customer[];
  onDelete?: (id: string) => void;
  loading?: boolean;
}

export default function CustomersList({ customers, onDelete, loading }: Props) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this customer?')) return;
    setDeleting(id);
    try { await onDelete?.(id); } finally { setDeleting(null); }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!customers.length) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg font-medium mb-2">No customers yet</p>
        <p className="text-sm mb-6">Add your first customer to get started</p>
        <Link href="/customers/new" className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Customer
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Name</th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Phone</th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Email</th>
            <th className="text-right py-3 px-4 text-gray-500 font-medium">Balance</th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Added</th>
            <th className="text-right py-3 px-4 text-gray-500 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.customer_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4">
                <Link href={`/customers/${c.customer_id}`} className="font-medium text-gray-900 hover:text-primary">
                  {c.name}
                </Link>
              </td>
              <td className="py-3 px-4 text-gray-600">{c.phone || '—'}</td>
              <td className="py-3 px-4 text-gray-600">{c.email || '—'}</td>
              <td className="py-3 px-4 text-right">
                <span className={c.balance >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                  {formatCurrency(Math.abs(c.balance))}
                  {c.balance < 0 && ' (Dr)'}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-500">{formatDate(c.created_at)}</td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/customers/${c.customer_id}`}
                    className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(c.customer_id)}
                    disabled={deleting === c.customer_id}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
