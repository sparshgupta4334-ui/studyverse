'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowUpDown, Phone, MapPin, Building2, TrendingUp, TrendingDown, Download, Filter, X } from 'lucide-react';
import { sampleCustomers } from '@/lib/sample-data';

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [filterType, setFilterType] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof sampleCustomers[0] | null>(null);

  const filtered = useMemo(() => {
    let data = [...sampleCustomers];
    if (search) data = data.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.business.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
    );
    if (filterType !== 'all') data = data.filter(c => c.type === filterType);
    data.sort((a, b) => {
      let valA: string | number = sortBy === 'name' ? a.name : sortBy === 'balance' ? Math.abs(a.balance) : sortBy === 'city' ? a.city : a.totalTransactions;
      let valB: string | number = sortBy === 'name' ? b.name : sortBy === 'balance' ? Math.abs(b.balance) : sortBy === 'city' ? b.city : b.totalTransactions;
      if (typeof valA === 'string') return sortDir === 'asc' ? valA.localeCompare(valB as string) : (valB as string).localeCompare(valA);
      return sortDir === 'asc' ? valA - (valB as number) : (valB as number) - valA;
    });
    return data;
  }, [search, sortBy, sortDir, filterType]);

  const toggleSort = (field: string) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('asc'); }
  };

  const formatCurrency = (amount: number) => `₹${Math.abs(amount).toLocaleString()}`;

  const totalReceivable = sampleCustomers.filter(c => c.type === 'receivable').reduce((s, c) => s + c.balance, 0);
  const totalPayable = sampleCustomers.filter(c => c.type === 'payable').reduce((s, c) => s + Math.abs(c.balance), 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage all your business contacts and their balances</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{sampleCustomers.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Customers</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">+{formatCurrency(totalReceivable)}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Receivable</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">-{formatCurrency(totalPayable)}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Payable</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, business, city, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'receivable', 'payable'].map(type => (
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

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left px-5 py-3.5 text-gray-500 dark:text-gray-400 font-medium">
                    <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white" onClick={() => toggleSort('name')}>
                      Customer <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  </th>
                  <th className="text-left px-5 py-3.5 text-gray-500 dark:text-gray-400 font-medium hidden md:table-cell">Business</th>
                  <th className="text-left px-5 py-3.5 text-gray-500 dark:text-gray-400 font-medium hidden lg:table-cell">
                    <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white" onClick={() => toggleSort('city')}>
                      City <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  </th>
                  <th className="text-right px-5 py-3.5 text-gray-500 dark:text-gray-400 font-medium">
                    <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white ml-auto" onClick={() => toggleSort('balance')}>
                      Balance <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  </th>
                  <th className="text-right px-5 py-3.5 text-gray-500 dark:text-gray-400 font-medium hidden sm:table-cell">
                    <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white ml-auto" onClick={() => toggleSort('transactions')}>
                      Txns <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  </th>
                  <th className="text-right px-5 py-3.5 text-gray-500 dark:text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {filtered.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm shrink-0">
                          {customer.name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{customer.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {customer.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        {customer.business}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {customer.city}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`font-bold ${customer.type === 'receivable' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {customer.type === 'receivable' ? '+' : '-'}{formatCurrency(customer.balance)}
                      </span>
                      <div className={`text-xs capitalize ${customer.type === 'receivable' ? 'text-green-500' : 'text-red-500'}`}>
                        {customer.type}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                      {customer.totalTransactions}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
            Showing {filtered.length} of {sampleCustomers.length} customers
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedCustomer(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-xl">
                  {selectedCustomer.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">{selectedCustomer.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{selectedCustomer.business}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4 text-primary-500" />
                <span>{selectedCustomer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 text-primary-500" />
                <span>{selectedCustomer.city}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Building2 className="w-4 h-4 text-primary-500" />
                <span>{selectedCustomer.business}</span>
              </div>
              <div className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Balance</span>
                  <span className={`font-bold text-lg ${selectedCustomer.type === 'receivable' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {selectedCustomer.type === 'receivable' ? '+' : '-'}{formatCurrency(selectedCustomer.balance)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Total Transactions</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedCustomer.totalTransactions}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Last Transaction</span>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">{selectedCustomer.lastTransaction}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
