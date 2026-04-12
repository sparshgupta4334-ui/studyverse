'use client';

import { useState } from 'react';
import { CreditCard, CheckCircle, Clock, XCircle, TrendingUp, Download } from 'lucide-react';
import { samplePayments } from '@/lib/sample-data';

export default function PaymentsPage() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? samplePayments : samplePayments.filter(p => p.status === filter);
  const totalSuccess = samplePayments.filter(p => p.status === 'success').reduce((s, p) => s + p.amount, 0);
  const successRate = Math.round((samplePayments.filter(p => p.status === 'success').length / samplePayments.length) * 100);

  const statusIcon = (status: string) => {
    if (status === 'success') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === 'pending') return <Clock className="w-4 h-4 text-yellow-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const statusColor = (status: string) => {
    if (status === 'success') return 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400';
    if (status === 'pending') return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400';
    return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payments</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track all UPI and bank payments</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{samplePayments.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Payments</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">₹{totalSuccess.toLocaleString()}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Collected</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{successRate}%</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Success Rate</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{samplePayments.filter(p => p.status === 'pending').length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Pending</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm mb-4">
          <div className="flex gap-2 flex-wrap">
            {['all', 'success', 'pending', 'failed'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                  filter === s ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {s}
              </button>
            ))}
            <button className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left px-5 py-3.5 text-gray-500 dark:text-gray-400 font-medium">Payment ID</th>
                  <th className="text-left px-5 py-3.5 text-gray-500 dark:text-gray-400 font-medium">Customer</th>
                  <th className="text-left px-5 py-3.5 text-gray-500 dark:text-gray-400 font-medium hidden sm:table-cell">Method</th>
                  <th className="text-left px-5 py-3.5 text-gray-500 dark:text-gray-400 font-medium hidden md:table-cell">Date</th>
                  <th className="text-right px-5 py-3.5 text-gray-500 dark:text-gray-400 font-medium">Amount</th>
                  <th className="text-right px-5 py-3.5 text-gray-500 dark:text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-500 dark:text-gray-400">{p.id}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-gray-900 dark:text-white">{p.customerName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{p.upiId !== '-' ? p.upiId : ''}</div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400 hidden sm:table-cell">{p.method}</td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 hidden md:table-cell">{p.date}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-gray-900 dark:text-white">₹{p.amount.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor(p.status)}`}>
                        {statusIcon(p.status)}
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
