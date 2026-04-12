'use client';

import { useState } from 'react';
import { FileText, Download, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import { sampleTransactions, sampleCustomers } from '@/lib/sample-data';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const monthlyData = [
  { month: 'Jul', revenue: 38000, expenses: 18000, profit: 20000 },
  { month: 'Aug', revenue: 45000, expenses: 22000, profit: 23000 },
  { month: 'Sep', revenue: 52000, expenses: 19000, profit: 33000 },
  { month: 'Oct', revenue: 48000, expenses: 25000, profit: 23000 },
  { month: 'Nov', revenue: 61000, expenses: 28000, profit: 33000 },
  { month: 'Dec', revenue: 73000, expenses: 31000, profit: 42000 },
  { month: 'Jan', revenue: 85000, expenses: 33000, profit: 52000 },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState('monthly');

  const totalRevenue = sampleTransactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = sampleTransactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const reports = [
    { title: "Today's Report", date: 'Jan 15, 2024', transactions: 3, amount: 21700, type: 'daily' },
    { title: 'This Week Report', date: 'Jan 8-15, 2024', transactions: 12, amount: 89400, type: 'weekly' },
    { title: 'This Month Report', date: 'January 2024', transactions: 25, amount: 285000, type: 'monthly' },
    { title: 'Annual Summary', date: 'Year 2023', transactions: 287, amount: 2340000, type: 'annual' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Generate and download business reports</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</span>
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">₹{totalRevenue.toLocaleString()}</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-red-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</span>
            </div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">₹{totalExpenses.toLocaleString()}</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-primary-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Net Profit</span>
            </div>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-primary-600 dark:text-primary-400' : 'text-red-600 dark:text-red-400'}`}>
              ₹{Math.abs(netProfit).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Revenue vs Expenses (₹)</h3>
            <div className="flex gap-2">
              {['monthly', 'weekly'].map(p => (
                <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1 rounded-lg text-xs font-medium capitalize ${period === p ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>{p}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `₹${v/1000}K`} />
              <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
              <Bar dataKey="revenue" fill="#1E88E5" name="Revenue" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#F57C00" name="Expenses" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Profit Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `₹${v/1000}K`} />
              <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
              <Line type="monotone" dataKey="profit" stroke="#1E88E5" strokeWidth={2} dot={{ fill: '#1E88E5', r: 4 }} name="Profit" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Available Reports</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reports.map((report) => (
            <div key={report.type} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mb-3">
                <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{report.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{report.date}</p>
              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Transactions</span>
                  <span className="font-medium text-gray-900 dark:text-white">{report.transactions}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Total Amount</span>
                  <span className="font-medium text-gray-900 dark:text-white">₹{report.amount.toLocaleString()}</span>
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-1.5 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-3 py-2 rounded-xl text-sm font-medium transition-colors">
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
