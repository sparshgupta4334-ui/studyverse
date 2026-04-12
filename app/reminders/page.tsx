'use client';

import { useState } from 'react';
import { Bell, CheckCircle, Clock, XCircle, Send, Download } from 'lucide-react';
import { sampleReminders, sampleCustomers } from '@/lib/sample-data';

export default function RemindersPage() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? sampleReminders : sampleReminders.filter(r => r.deliveryStatus === filter);
  const deliveredCount = sampleReminders.filter(r => r.deliveryStatus === 'delivered').length;

  const statusIcon = (status: string) => {
    if (status === 'delivered') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === 'pending') return <Clock className="w-4 h-4 text-yellow-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const statusColor = (status: string) => {
    if (status === 'delivered') return 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400';
    if (status === 'pending') return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400';
    return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reminders</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Send SMS payment reminders to customers</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{sampleReminders.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Sent</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{deliveredCount}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Delivered</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{Math.round((deliveredCount / sampleReminders.length) * 100)}%</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Delivery Rate</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">₹{(sampleReminders.length * 0.15).toFixed(2)}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">SMS Cost</div>
          </div>
        </div>

        {/* Send Reminder Card */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-6 mb-6 text-white">
          <h3 className="font-bold text-lg mb-2">Send Bulk Reminders</h3>
          <p className="text-primary-100 text-sm mb-4">Send payment reminders to all customers with outstanding balance at once.</p>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 bg-white text-primary-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg">
              <Send className="w-4 h-4" />
              Send to All Overdue ({sampleCustomers.filter(c => c.type === 'payable').length})
            </button>
            <button className="flex items-center gap-2 border border-white/40 hover:bg-white/10 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all">
              Customize Template
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm mb-4">
          <div className="flex gap-2 flex-wrap">
            {['all', 'delivered', 'pending', 'failed'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                  filter === s ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((reminder) => (
            <div key={reminder.id} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">{reminder.customerName}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{reminder.phone}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{reminder.message}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>Sent: {reminder.date}</span>
                    <span>•</span>
                    <span>Amount: <strong className="text-red-600 dark:text-red-400">₹{reminder.amount.toLocaleString()}</strong></span>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap ${statusColor(reminder.deliveryStatus)}`}>
                  {statusIcon(reminder.deliveryStatus)}
                  {reminder.deliveryStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
