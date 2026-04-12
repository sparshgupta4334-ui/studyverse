'use client';

import { sampleCustomers, sampleTransactions, stats } from '@/lib/sample-data';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Cell } from 'recharts';

const growthData = [
  { month: 'Aug', users: 8200, transactions: 18000 },
  { month: 'Sep', users: 9100, transactions: 21000 },
  { month: 'Oct', users: 9800, transactions: 24000 },
  { month: 'Nov', users: 10900, transactions: 28000 },
  { month: 'Dec', users: 11600, transactions: 33000 },
  { month: 'Jan', users: 12847, transactions: 38000 },
];

const COLORS = ['#1E88E5', '#F57C00', '#43A047', '#E53935', '#8E24AA'];

export default function AnalyticsPage() {
  const topCustomers = [...sampleCustomers].sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance)).slice(0, 5);
  const cityData = sampleCustomers.reduce((acc: Record<string, number>, c) => {
    acc[c.city] = (acc[c.city] || 0) + 1;
    return acc;
  }, {});
  const cityChartData = Object.entries(cityData).map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Business insights and performance metrics</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Active Users', value: stats.activeUsers.toLocaleString(), trend: '+12%' },
            { label: 'Transactions', value: (stats.transactionsProcessed / 100000).toFixed(1) + 'L', trend: '+18%' },
            { label: 'Amount Managed', value: '₹' + (stats.totalAmountManaged / 10000000).toFixed(1) + 'Cr', trend: '+22%' },
            { label: 'Cities Served', value: stats.citiesServed + '+', trend: '+8%' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
              <div className="text-xs text-green-500 mt-1">{stat.trend} this month</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">User Growth</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => `${v/1000}K`} />
                <Tooltip formatter={(value) => [Number(value).toLocaleString(), '']} />
                <Line type="monotone" dataKey="users" stroke="#1E88E5" strokeWidth={2} dot={{ fill: '#1E88E5', r: 3 }} name="Users" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Customers by City</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={cityChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="city" width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#1E88E5" radius={[0, 4, 4, 0]} name="Customers">
                  {cityChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Top Customers by Balance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left pb-3 text-gray-500 dark:text-gray-400 font-medium">#</th>
                  <th className="text-left pb-3 text-gray-500 dark:text-gray-400 font-medium">Customer</th>
                  <th className="text-left pb-3 text-gray-500 dark:text-gray-400 font-medium hidden sm:table-cell">Business</th>
                  <th className="text-right pb-3 text-gray-500 dark:text-gray-400 font-medium">Balance</th>
                  <th className="text-right pb-3 text-gray-500 dark:text-gray-400 font-medium hidden sm:table-cell">Transactions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {topCustomers.map((c, i) => (
                  <tr key={c.id}>
                    <td className="py-3 text-gray-400 font-mono text-xs">{i + 1}</td>
                    <td className="py-3 font-medium text-gray-900 dark:text-white">{c.name}</td>
                    <td className="py-3 text-gray-600 dark:text-gray-400 hidden sm:table-cell">{c.business}</td>
                    <td className="py-3 text-right">
                      <span className={`font-bold ${c.type === 'receivable' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {c.type === 'receivable' ? '+' : '-'}₹{Math.abs(c.balance).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 text-right text-gray-600 dark:text-gray-400 hidden sm:table-cell">{c.totalTransactions}</td>
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
