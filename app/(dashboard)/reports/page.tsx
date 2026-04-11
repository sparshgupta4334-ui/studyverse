'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { FileText } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const monthlyData = [
  { month: 'Aug', credit: 18000, debit: 12000 },
  { month: 'Sep', credit: 22000, debit: 15000 },
  { month: 'Oct', credit: 19500, debit: 13500 },
  { month: 'Nov', credit: 25000, debit: 16000 },
  { month: 'Dec', credit: 21000, debit: 14500 },
  { month: 'Jan', credit: 28000, debit: 17000 },
];

const paymentMethodData = [
  { name: 'Cash', value: 35, color: '#1E40AF' },
  { name: 'UPI', value: 45, color: '#EA580C' },
  { name: 'Bank Transfer', value: 15, color: '#16a34a' },
  { name: 'Cheque', value: 5, color: '#7c3aed' },
];

const netData = monthlyData.map((m) => ({ ...m, net: m.credit - m.debit }));

export default function ReportsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Reports & Analytics</h1>
        <button className="flex items-center gap-2 border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <FileText size={16} /> Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue (Jan)', value: formatCurrency(28000), sub: '+33% vs last month', positive: true },
          { label: 'Total Payments (Jan)', value: formatCurrency(17000), sub: '+17% vs last month', positive: true },
          { label: 'Net Profit (Jan)', value: formatCurrency(11000), sub: '+57% vs last month', positive: true },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
            <p className="text-xs text-green-600 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Monthly Credit vs Debit</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v) => formatCurrency(Number(v))} />
            <Legend />
            <Bar dataKey="credit" name="Credit Given" fill="#16a34a" radius={[4, 4, 0, 0]} />
            <Bar dataKey="debit" name="Payment Received" fill="#1E40AF" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Net Balance Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={netData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Line type="monotone" dataKey="net" name="Net Balance" stroke="#EA580C" strokeWidth={2.5} dot={{ fill: '#EA580C', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Payment Methods</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={paymentMethodData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                {paymentMethodData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${Number(v)}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
