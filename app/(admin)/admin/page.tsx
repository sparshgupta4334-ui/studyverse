'use client';

import { Users, ArrowLeftRight, TrendingUp, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';

const stats = [
  { label: 'Total Users', value: '10,248', icon: Users, change: '+128 this month', color: 'bg-blue-900/40 text-blue-400' },
  { label: 'Total Transactions', value: '5,24,831', icon: ArrowLeftRight, change: '+2,340 today', color: 'bg-green-900/40 text-green-400' },
  { label: 'Total Volume', value: '₹48.7 Cr', icon: TrendingUp, change: '+₹1.2 Cr today', color: 'bg-orange-900/40 text-orange-400' },
  { label: 'Active Today', value: '1,832', icon: Activity, change: '78% of daily avg', color: 'bg-purple-900/40 text-purple-400' },
];

const weeklySignups = [
  { day: 'Mon', users: 42 },
  { day: 'Tue', users: 58 },
  { day: 'Wed', users: 35 },
  { day: 'Thu', users: 71 },
  { day: 'Fri', users: 65 },
  { day: 'Sat', users: 48 },
  { day: 'Sun', users: 30 },
];

export default function AdminDashboardPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm">System overview and key metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">{s.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.change}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${s.color}`}>
                <s.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
        <h3 className="font-semibold text-white mb-4">New User Signups (This Week)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklySignups}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
            <Bar dataKey="users" name="New Users" fill="#EA580C" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <h3 className="font-semibold text-white mb-3">Recent Signups</h3>
          <div className="space-y-3">
            {['Ravi Kumar - Delhi', 'Meena Patel - Mumbai', 'Suresh Jha - Patna', 'Ananya Singh - Kolkata'].map((u) => (
              <div key={u} className="flex items-center justify-between text-sm">
                <span className="text-gray-300">{u}</span>
                <span className="text-xs text-gray-500">2h ago</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <h3 className="font-semibold text-white mb-3">System Status</h3>
          <div className="space-y-3">
            {[
              { name: 'API Server', status: 'Operational', ok: true },
              { name: 'Database', status: 'Operational', ok: true },
              { name: 'SMS Service', status: 'Degraded', ok: false },
              { name: 'Storage', status: 'Operational', ok: true },
            ].map((s) => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <span className="text-gray-300">{s.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${s.ok ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'}`}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
