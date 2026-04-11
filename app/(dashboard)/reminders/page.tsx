'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getReminders } from '@/lib/api';
import { PageLoading } from '@/components/common/Loading';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Reminder } from '@/lib/types';

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { getReminders().then(setReminders).finally(() => setIsLoading(false)); }, []);

  if (isLoading) return <PageLoading />;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Reminders</h1>
        <Link href="/reminders/new" className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus size={16} /> Send Reminder
        </Link>
      </div>

      <div className="space-y-3">
        {reminders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 py-12 text-center text-gray-400">No reminders sent yet</div>
        ) : (
          reminders.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-semibold text-gray-900">{r.customerName}</p>
                    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      r.status === 'sent' ? 'bg-green-100 text-green-700' : r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700')}>
                      {r.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{r.message}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>+91 {r.phone}</span>
                    <span>Amount: {formatCurrency(r.amount)}</span>
                    {r.sentAt && <span>Sent: {formatDateTime(r.sentAt)}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
