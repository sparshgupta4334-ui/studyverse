'use client';

import { transactions, customers, monthlyData } from '@/lib/sampleData';
import { Download, FileText, TrendingUp, Users, ArrowLeftRight, IndianRupee } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

const COLORS = ['#1E88E5', '#F57C00', '#43A047', '#E53935', '#8E24AA', '#00ACC1'];

export default function ReportsPage() {
  const totalCredit = transactions.filter((t) => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const totalDebit = transactions.filter((t) => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
  const netBalance = totalCredit - totalDebit;

  const categoryData = Object.entries(
    transactions.reduce((acc: Record<string, number>, t) => {
      acc[t.category || 'Other'] = (acc[t.category || 'Other'] || 0) + t.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const topCustomersData = [...customers]
    .filter((c) => c.balance > 0)
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 8)
    .map((c) => ({ name: c.name.split(' ')[0], balance: c.balance }));

  const handleExportCSV = () => {
    const rows = [
      ['Date', 'Customer', 'Type', 'Amount', 'Category', 'Notes'],
      ...transactions.map((t) => [t.date, t.customerName, t.type, t.amount, t.category || '', t.notes]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'report.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 text-sm mt-0.5">Business insights and data export</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium">
            <FileText className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Revenue', value: formatCurrency(totalCredit), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
          { title: 'Total Payments Out', value: formatCurrency(totalDebit), icon: ArrowLeftRight, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
          { title: 'Net Balance', value: formatCurrency(netBalance), icon: IndianRupee, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { title: 'Active Customers', value: customers.length.toString(), icon: Users, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className={`${card.bg} border ${card.border} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${card.color}`} />
                <p className={`text-xs font-medium ${card.color}`}>{card.title}</p>
              </div>
              <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Area Chart - Revenue Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Revenue Trend (Last 6 Months)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Legend />
              <Area type="monotone" dataKey="credit" name="Revenue" stroke="#1E88E5" fill="#BBDEFB" strokeWidth={2} />
              <Area type="monotone" dataKey="net" name="Net" stroke="#43A047" fill="#C8E6C9" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Category wise */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Sales by Category</h2>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Bar - Top Customers */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Top Customers by Receivable</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topCustomersData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={60} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Bar dataKey="balance" name="Balance" fill="#1E88E5" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Credit vs Debit Monthly */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Credit vs Debit by Month</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Legend />
              <Bar dataKey="credit" name="Credit" fill="#43A047" radius={[4, 4, 0, 0]} />
              <Bar dataKey="debit" name="Debit" fill="#E53935" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction Summary Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Monthly Summary</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Month</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Credit</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Debit</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Net</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Growth</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((row, idx) => {
                const prev = monthlyData[idx - 1];
                const growth = prev ? (((row.net - prev.net) / prev.net) * 100).toFixed(1) : null;
                return (
                  <tr key={row.month} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">{row.month} 2023{row.month === 'Jan' ? '/24' : ''}</td>
                    <td className="px-4 py-3 text-right text-green-600 font-medium">{formatCurrency(row.credit)}</td>
                    <td className="px-4 py-3 text-right text-red-500 font-medium">{formatCurrency(row.debit)}</td>
                    <td className="px-4 py-3 text-right text-blue-700 font-bold">{formatCurrency(row.net)}</td>
                    <td className="px-4 py-3 text-right">
                      {growth ? (
                        <span className={`text-xs font-medium ${parseFloat(growth) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {parseFloat(growth) >= 0 ? '+' : ''}{growth}%
                        </span>
                      ) : <span className="text-xs text-gray-400">-</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
