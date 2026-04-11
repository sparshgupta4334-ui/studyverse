'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const MOCK_USERS = [
  { id: 1, name: 'Raj Gupta', business: 'Gupta Paper Stores', phone: '9999999999', joined: '01 Jan 2024', status: 'active', txns: 142 },
  { id: 2, name: 'Meena Patel', business: 'Patel Traders', phone: '9888888888', joined: '15 Jan 2024', status: 'active', txns: 89 },
  { id: 3, name: 'Suresh Kumar', business: 'Kumar Electronics', phone: '9777777777', joined: '20 Jan 2024', status: 'inactive', txns: 23 },
  { id: 4, name: 'Anita Singh', business: 'Singh Garments', phone: '9666666666', joined: '25 Jan 2024', status: 'active', txns: 67 },
  { id: 5, name: 'Vijay Sharma', business: 'Sharma Hardware', phone: '9555555555', joined: '28 Jan 2024', status: 'active', txns: 201 },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const filtered = MOCK_USERS.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.business.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">User Management</h1>
        <span className="text-sm text-gray-400">{MOCK_USERS.length} total users</span>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-sm" />
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-800">
            <tr>
              {['Name & Business', 'Phone', 'Joined', 'Transactions', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-gray-800/50">
                <td className="px-4 py-3">
                  <p className="font-medium text-white">{u.name}</p>
                  <p className="text-xs text-gray-500">{u.business}</p>
                </td>
                <td className="px-4 py-3 text-gray-400">{u.phone}</td>
                <td className="px-4 py-3 text-gray-400">{u.joined}</td>
                <td className="px-4 py-3 text-gray-400">{u.txns}</td>
                <td className="px-4 py-3">
                  <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', u.status === 'active' ? 'bg-green-900/40 text-green-400' : 'bg-gray-800 text-gray-500')}>
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-xs text-orange-400 hover:text-orange-300">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
