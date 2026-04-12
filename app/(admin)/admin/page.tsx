'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';
import { getUser, logout } from '@/lib/auth';
import type { User } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/constants';
import { LogOut, Users, ToggleLeft, ToggleRight } from 'lucide-react';

interface AdminStats {
  total_users: number;
  total_customers: number;
  total_transactions: number;
  total_amount: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser || currentUser.role !== 'admin') {
      router.replace('/admin-login');
      return;
    }
    Promise.all([adminApi.users(), adminApi.stats()])
      .then(([uRes, sRes]) => {
        if (uRes.data.success) setUsers(uRes.data.data ?? []);
        if (sRes.data.success && sRes.data.data) setStats(sRes.data.data);
      })
      .catch(() => setError('Failed to load admin data'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleToggle = async (user_id: string, current: boolean) => {
    try {
      const res = await adminApi.toggleUser(user_id, !current);
      if (res.data.success && res.data.data) {
        setUsers((u) => u.map((x) => x.user_id === user_id ? { ...x, is_active: !current } : x));
      }
    } catch { alert('Failed to update user'); }
  };

  const handleLogout = () => { logout(); router.push('/admin-login'); };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm">Gupta Paper Stores</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-gray-300 hover:text-white text-sm">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-100">{error}</div>}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Users', value: stats.total_users.toString(), icon: Users, color: 'text-blue-600' },
              { label: 'Total Customers', value: stats.total_customers.toString(), icon: Users, color: 'text-green-600' },
              { label: 'Total Transactions', value: stats.total_transactions.toString(), icon: Users, color: 'text-purple-600' },
              { label: 'Total Volume', value: formatCurrency(stats.total_amount), icon: Users, color: 'text-orange-600' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">All Users ({users.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Phone</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Joined</th>
                  <th className="text-center py-3 px-4 text-gray-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.user_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900">{u.name}</td>
                    <td className="py-3 px-4 text-gray-600">{u.phone}</td>
                    <td className="py-3 px-4 text-gray-500">{u.email || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{formatDate(u.created_at)}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggle(u.user_id, u.is_active)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium"
                        title={u.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {u.is_active
                          ? <ToggleRight className="w-5 h-5 text-green-500" />
                          : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                        <span className={u.is_active ? 'text-green-600' : 'text-gray-400'}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
