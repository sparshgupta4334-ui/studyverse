'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Users, TrendingUp, TrendingDown, DollarSign, Search, ArrowUpDown, Eye } from 'lucide-react';
import { sampleCustomers, sampleTransactions } from '@/lib/sample-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#1E88E5', '#F57C00', '#43A047', '#E53935', '#8E24AA'];

const monthlyData = [
  { month: 'Aug', receivable: 45000, payable: 22000 },
  { month: 'Sep', receivable: 52000, payable: 28000 },
  { month: 'Oct', receivable: 48000, payable: 19000 },
  { month: 'Nov', receivable: 61000, payable: 31000 },
  { month: 'Dec', receivable: 73000, payable: 25000 },
  { month: 'Jan', receivable: 85000, payable: 33000 },
];

export default function DashboardPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [filterType, setFilterType] = useState('all');

  const totalReceivable = sampleCustomers.filter(c => c.type === 'receivable').reduce((s, c) => s + c.balance, 0);
  const totalPayable = sampleCustomers.filter(c => c.type === 'payable').reduce((s, c) => s + Math.abs(c.balance), 0);
  const netBalance = totalReceivable - totalPayable;

  const filteredCustomers = useMemo(() => {
    let data = [...sampleCustomers];
    if (search) data = data.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.business.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
    );
    if (filterType !== 'all') data = data.filter(c => c.type === filterType);
    data.sort((a, b) => {
      const valA = sortBy === 'name' ? a.name : sortBy === 'balance' ? Math.abs(a.balance) : a.lastTransaction;
      const valB = sortBy === 'name' ? b.name : sortBy === 'balance' ? Math.abs(b.balance) : b.lastTransaction;
      if (typeof valA === 'string') return sortDir === 'asc' ? valA.localeCompare(valB as string) : (valB as string).localeCompare(valA);
      return sortDir === 'asc' ? valA - (valB as number) : (valB as number) - valA;
    });
    return data;
  }, [search, sortBy, sortDir, filterType]);

  const pieData = [
    { name: 'Receivable', value: totalReceivable },
    { name: 'Payable', value: totalPayable },
  ];

  const toggleSort = (field: string) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('asc'); }
  };

  const fmt = (amount: number) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span>Public Demo Dashboard</span>
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-green-500">Live Data</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Business Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Complete overview of Gupta Paper Stores — Sample Demo Data</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-xs bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">Receivable</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{fmt(totalReceivable)}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Money to Collect</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">Payable</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{fmt(totalPayable)}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Money to Pay</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${netBalance >= 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>Net</span>
            </div>
            <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {netBalance >= 0 ? '+' : ''}{fmt(Math.abs(netBalance))}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Net Balance</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">Total</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{sampleCustomers.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Customers</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Monthly Overview (₹)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${v / 1000}K`} />
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, '']} />
                <Bar dataKey="receivable" fill="#1E88E5" name="Receivable" radius={[4, 4, 0, 0]} />
                <Bar dataKey="payable" fill="#F57C00" name="Payable" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Balance Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>Receivable
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>Payable
              </div>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden mb-8">
          <div className="p-5 border-b border-gray-100 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Customers</h3>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-60">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                  <option value="all">All</option>
                  <option value="receivable">Receivable</option>
                  <option value="payable">Payable</option>
                </select>
                <Link href="/customers" className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap">
                  View All <Eye className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="text-left px-5 py-3 text-gray-500 dark:text-gray-400 font-medium">
                    <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white" onClick={() => toggleSort('name')}>
                      Name <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  </th>
                  <th className="text-left px-5 py-3 text-gray-500 dark:text-gray-400 font-medium hidden md:table-cell">Business</th>
                  <th className="text-left px-5 py-3 text-gray-500 dark:text-gray-400 font-medium hidden lg:table-cell">City</th>
                  <th className="text-right px-5 py-3 text-gray-500 dark:text-gray-400 font-medium">
                    <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white ml-auto" onClick={() => toggleSort('balance')}>
                      Balance <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  </th>
                  <th className="text-left px-5 py-3 text-gray-500 dark:text-gray-400 font-medium hidden sm:table-cell">
                    <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white" onClick={() => toggleSort('date')}>
                      Last Tx <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {filteredCustomers.slice(0, 10).map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm">
                          {customer.name[0]}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{customer.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{customer.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400 hidden md:table-cell">{customer.business}</td>
                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400 hidden lg:table-cell">{customer.city}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`font-semibold ${customer.type === 'receivable' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {customer.type === 'receivable' ? '+' : '-'}{fmt(Math.abs(customer.balance))}
                      </span>
                      <div className={`text-xs ${customer.type === 'receivable' ? 'text-green-500' : 'text-red-500'}`}>{customer.type}</div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 hidden sm:table-cell">{customer.lastTransaction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Showing {Math.min(10, filteredCustomers.length)} of {filteredCustomers.length} customers</span>
            <Link href="/customers" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">View All Customers →</Link>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
            <Link href="/transactions" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">View All →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="text-left px-5 py-3 text-gray-500 dark:text-gray-400 font-medium">Customer</th>
                  <th className="text-left px-5 py-3 text-gray-500 dark:text-gray-400 font-medium hidden sm:table-cell">Description</th>
                  <th className="text-left px-5 py-3 text-gray-500 dark:text-gray-400 font-medium hidden md:table-cell">Date</th>
                  <th className="text-right px-5 py-3 text-gray-500 dark:text-gray-400 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {sampleTransactions.slice(0, 8).map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-gray-900 dark:text-white">{tx.customerName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{tx.id}</div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400 hidden sm:table-cell">{tx.description}</td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 hidden md:table-cell">{tx.date}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`font-semibold ${tx.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
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
