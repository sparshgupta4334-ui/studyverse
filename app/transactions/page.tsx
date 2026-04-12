'use client';

import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, Filter, Download, X } from 'lucide-react';
import { sampleTransactions } from '@/lib/sample-data';

export default function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selected, setSelected] = useState<typeof sampleTransactions[0] | null>(null);

  const filtered = useMemo(() => {
    let data = [...sampleTransactions];
    if (search) data = data.filter(t =>
      t.customerName.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase())
    );
    if (filterType !== 'all') data = data.filter(t => t.type === filterType);
    data.sort((a, b) => {
      let valA: string | number = sortBy === 'date' ? a.date : sortBy === 'amount' ? a.amount : a.customerName;
      let valB: string | number = sortBy === 'date' ? b.date : sortBy === 'amount' ? b.amount : b.customerName;
      if (typeof valA === 'string') return sortDir === 'asc' ? valA.localeCompare(valB as string) : (valB as string).localeCompare(valA);
      return sortDir === 'asc' ? valA - (valB as number) : (valB as number) - valA;
    });
    return data;
  }, [search, filterType, sortBy, sortDir]);

  const toggleSort = (field: string) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('desc'); }
  };

  const totalCredit = filtered.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const totalDebit = filtered.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Complete ledger of all business transactions</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{sampleTransactions.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Transactions</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">+₹{totalCredit.toLocaleString()}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Credits</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">-₹{totalDebit.toLocaleString()}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Debits</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'credit', 'debit'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all capitalize ${
                    filterType === type
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
              <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left px-5 py-3.5 text-gray-500 dark:text-gray-400 font-medium">ID</th>
                  <th className="text-left px-5 py-3.5 text-gray-500 dark:text-gray-400 font-medium">
                    <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white" onClick={() => toggleSort('customer')}>
                      Customer <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  </th>
                  <th className="text-left px-5 py-3.5 text-gray-500 dark:text-gray-400 font-medium hidden sm:table-cell">Description</th>
                  <th className="text-left px-5 py-3.5 text-gray-500 dark:text-gray-400 font-medium">
                    <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white" onClick={() => toggleSort('date')}>
                      Date <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  </th>
                  <th className="text-right px-5 py-3.5 text-gray-500 dark:text-gray-400 font-medium">
                    <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white ml-auto" onClick={() => toggleSort('amount')}>
                      Amount <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  </th>
                  <th className="text-right px-5 py-3.5 text-gray-500 dark:text-gray-400 font-medium hidden md:table-cell">Balance</th>
                  <th className="text-right px-5 py-3.5 text-gray-500 dark:text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-500 dark:text-gray-400">{tx.id}</td>
                    <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{tx.customerName}</td>
                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400 hidden sm:table-cell">{tx.description}</td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{tx.date}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`font-bold ${tx.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-gray-600 dark:text-gray-400 hidden md:table-cell">₹{Math.abs(tx.balance).toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => setSelected(tx)} className="text-primary-600 dark:text-primary-400 hover:underline text-sm">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
            Showing {filtered.length} of {sampleTransactions.length} transactions
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Transaction Details</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              {[
                ['Transaction ID', selected.id, 'mono'],
                ['Customer', selected.customerName, ''],
                ['Description', selected.description, ''],
                ['Date', selected.date, ''],
                ['Category', selected.category, 'capitalize'],
              ].map(([k, v, cls]) => (
                <div key={String(k)} className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">{k}</span>
                  <span className={`text-gray-900 dark:text-white font-medium ${cls === 'mono' ? 'font-mono text-xs' : ''} ${cls === 'capitalize' ? 'capitalize' : ''}`}>{v}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 dark:text-gray-400">Amount</span>
                <span className={`font-bold text-lg ${selected.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {selected.type === 'credit' ? '+' : '-'}₹{selected.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Running Balance</span>
                <span className="text-gray-900 dark:text-white font-medium">₹{Math.abs(selected.balance).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
