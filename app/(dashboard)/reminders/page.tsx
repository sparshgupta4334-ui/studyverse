'use client';
import { useEffect, useState } from 'react';
import { customersApi, remindersApi } from '@/lib/api';
import type { Customer, Reminder } from '@/lib/types';
import { formatDate } from '@/lib/constants';
import { clsx } from 'clsx';
import { Send } from 'lucide-react';

export default function RemindersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('all');
  const [message, setMessage] = useState('Dear {name}, you have an outstanding balance of {balance}. Please clear your dues. - Gupta Paper Stores');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    customersApi.list().then((r) => { if (r.data.success) setCustomers(r.data.data ?? []); });
    remindersApi.list().then((r) => { if (r.data.success) setReminders(r.data.data ?? []); });
  }, []);

  const handleSend = async () => {
    if (!message.trim()) { setError('Enter a message'); return; }
    setError(''); setLoading(true);
    try {
      if (selectedCustomer === 'all') {
        const res = await remindersApi.sendBulk(message);
        if (res.data.success && res.data.data) {
          setSuccess(`Sent: ${res.data.data.sent}, Failed: ${res.data.data.failed}`);
        }
      } else {
        const res = await remindersApi.send(selectedCustomer, message);
        if (res.data.success) {
          setSuccess('Reminder sent!');
          if (res.data.data) setReminders((r) => [res.data.data!, ...r]);
        }
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Failed to send reminder');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">SMS Reminders</h1>
        <p className="text-gray-500 text-sm mt-0.5">Send payment reminders to customers via SMS</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Send Reminder</h2>
          {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4 border border-red-100">{error}</div>}
          {success && <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-4 border border-green-100">{success}</div>}

          <div className="space-y-4">
            <div>
              <label className="label">Send to</label>
              <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)} className="input-field">
                <option value="all">All customers with balance</option>
                {customers.map((c) => (
                  <option key={c.customer_id} value={c.customer_id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Message Template</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="input-field resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">Use {'{name}'} and {'{balance}'} as placeholders</p>
            </div>
            <button onClick={handleSend} disabled={loading} className="btn-primary w-full py-2.5 flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              {loading ? 'Sending...' : 'Send Reminder'}
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Reminder History</h2>
          {reminders.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">No reminders sent yet</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {reminders.map((r) => (
                <div key={r.reminder_id} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">{r.customer_name || '—'}</p>
                    <span className={clsx(
                      'text-xs px-2 py-0.5 rounded-full',
                      r.status === 'sent' ? 'bg-green-50 text-green-700' :
                      r.status === 'failed' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                    )}>
                      {r.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{r.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(r.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
