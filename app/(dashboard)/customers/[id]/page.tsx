'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail, MapPin, Plus } from 'lucide-react';
import { useCustomer } from '@/hooks/useCustomers';
import { useTransactions } from '@/hooks/useTransactions';
import { PageLoading } from '@/components/common/Loading';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { customer, isLoading } = useCustomer(id);
  const { transactions } = useTransactions();

  if (isLoading) return <PageLoading />;
  if (!customer) return <div className="text-center py-20 text-gray-400">Customer not found</div>;

  const customerTxns = transactions.filter((t) => t.customerId === id);

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/customers" className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Customer Details</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-blue-700 flex items-center justify-center text-white text-xl font-bold">
              {getInitials(customer.name)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Phone size={14} /><span>+91 {customer.phone}</span>
              </div>
              {customer.email && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                  <Mail size={14} /><span>{customer.email}</span>
                </div>
              )}
              {customer.address && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                  <MapPin size={14} /><span>{customer.address}</span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Balance</p>
            <p className={cn('text-2xl font-bold', customer.balance > 0 ? 'text-green-600' : customer.balance < 0 ? 'text-red-500' : 'text-gray-500')}>
              {customer.balance === 0 ? 'Settled' : formatCurrency(Math.abs(customer.balance))}
            </p>
            {customer.balance !== 0 && (
              <p className="text-sm text-gray-400">{customer.balance > 0 ? 'to receive' : 'to pay'}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="text-center">
            <p className="text-lg font-bold text-green-600">{formatCurrency(customer.totalCredit)}</p>
            <p className="text-xs text-gray-500 mt-1">Total Credit Given</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-red-500">{formatCurrency(customer.totalDebit)}</p>
            <p className="text-xs text-gray-500 mt-1">Total Payments Received</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-blue-700">{customerTxns.length}</p>
            <p className="text-xs text-gray-500 mt-1">Total Transactions</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Transactions</h3>
          <Link href="/transactions/new" className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
            <Plus size={14} /> Add
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {customerTxns.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">No transactions yet</p>
          ) : (
            customerTxns.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">{tx.description || 'Transaction'}</p>
                  <p className="text-xs text-gray-500">{formatDate(tx.date)} · {tx.paymentMethod}</p>
                </div>
                <span className={cn('text-sm font-semibold', tx.type === 'credit' ? 'text-green-600' : 'text-red-500')}>
                  {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
