'use client';

import { customers, transactions, payments, reminders, dashboardStats } from '@/lib/sampleData';
import { Users, ArrowLeftRight, CreditCard, Bell, TrendingUp, Shield, Server, CheckCircle } from 'lucide-react';

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

const recentUsers = [
  { name: 'Anita Joshi', business: 'Anita Printing Press', joinDate: '2024-01-15', plan: 'Free', status: 'active' },
  { name: 'Suresh Yadav', business: 'Yadav Paper House', joinDate: '2024-01-13', plan: 'Free', status: 'active' },
  { name: 'Neha Kapoor', business: 'Kapoor Stationery', joinDate: '2024-01-10', plan: 'Free', status: 'active' },
  { name: 'Pankaj Sharma', business: 'Sharma Contractors', joinDate: '2024-01-08', plan: 'Free', status: 'inactive' },
  { name: 'Mohan Lal', business: 'ML Retail Stores', joinDate: '2024-01-05', plan: 'Free', status: 'active' },
];

export default function AdminPage() {
  const totalReceivable = customers.filter((c) => c.balance > 0).reduce((s, c) => s + c.balance, 0);
  const totalPayable = customers.filter((c) => c.balance < 0).reduce((s, c) => s + Math.abs(c.balance), 0);

  const systemStats = [
    { label: 'Total Customers', value: customers.length.toString(), icon: Users, color: 'bg-blue-50 text-blue-700', iconBg: 'bg-blue-100' },
    { label: 'Total Transactions', value: transactions.length.toString(), icon: ArrowLeftRight, color: 'bg-orange-50 text-orange-700', iconBg: 'bg-orange-100' },
    { label: 'Total Payments', value: payments.length.toString(), icon: CreditCard, color: 'bg-green-50 text-green-700', iconBg: 'bg-green-100' },
    { label: 'Total Reminders', value: reminders.length.toString(), icon: Bell, color: 'bg-purple-50 text-purple-700', iconBg: 'bg-purple-100' },
  ];

  const healthChecks = [
    { name: 'Database Connection', status: 'operational', uptime: '99.99%' },
    { name: 'SMS Gateway', status: 'operational', uptime: '99.85%' },
    { name: 'UPI Payment API', status: 'operational', uptime: '99.92%' },
    { name: 'File Storage', status: 'operational', uptime: '100%' },
    { name: 'Email Service', status: 'degraded', uptime: '97.2%' },
    { name: 'Backup System', status: 'operational', uptime: '99.99%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-500 text-sm mt-0.5">System administration and monitoring</p>
      </div>

      {/* Business Metrics */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">Business Metrics</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {systemStats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className={`${s.color.split(' ')[0]} border rounded-xl p-4`} style={{ borderColor: 'transparent' }}>
                <div className={`w-8 h-8 ${s.iconBg} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 ${s.color.split(' ')[1]}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className={`text-xs font-medium mt-1 ${s.color.split(' ')[1]}`}>{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Financial Overview */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">Financial Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <p className="text-sm text-gray-600 font-medium">Total Receivable</p>
            </div>
            <p className="text-2xl font-bold text-green-700">{formatCurrency(totalReceivable)}</p>
            <p className="text-xs text-gray-400 mt-1">From {customers.filter((c) => c.balance > 0).length} customers</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-red-600 rotate-180" />
              <p className="text-sm text-gray-600 font-medium">Total Payable</p>
            </div>
            <p className="text-2xl font-bold text-red-700">{formatCurrency(totalPayable)}</p>
            <p className="text-xs text-gray-400 mt-1">To {customers.filter((c) => c.balance < 0).length} customers</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-gray-600 font-medium">Net Position</p>
            </div>
            <p className="text-2xl font-bold text-blue-700">{formatCurrency(totalReceivable - totalPayable)}</p>
            <p className="text-xs text-gray-400 mt-1">Healthy balance</p>
          </div>
        </div>
      </div>

      {/* Recent Registrations & System Health */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Recent User Registrations</h2>
          <div className="space-y-3">
            {recentUsers.map((u, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{u.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.business}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{new Date(u.joinDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                  <span className={`text-xs font-medium ${u.status === 'active' ? 'text-green-600' : 'text-gray-400'}`}>
                    {u.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Server className="w-5 h-5 text-gray-600" />
            <h2 className="text-base font-semibold text-gray-900">System Health</h2>
          </div>
          <div className="space-y-3">
            {healthChecks.map((h, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${h.status === 'operational' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <p className="text-sm text-gray-700">{h.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{h.uptime}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${h.status === 'operational' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {h.status === 'operational' ? 'Operational' : 'Degraded'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <p className="text-sm text-green-700 font-medium">All systems mostly operational</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <h2 className="text-lg font-bold mb-4">Platform Statistics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Businesses Registered', value: '50,000+' },
            { label: 'Transactions Processed', value: '₹100Cr+' },
            { label: 'SMS Reminders Sent', value: '5 Lakh+' },
            { label: 'System Uptime', value: '99.9%' },
          ].map((s) => (
            <div key={s.label} className="bg-white bg-opacity-10 rounded-lg p-3">
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-blue-200 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
