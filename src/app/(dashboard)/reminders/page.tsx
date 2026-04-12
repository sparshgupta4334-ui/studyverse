'use client';

import { useState } from 'react';
import { reminders as initialReminders, reminderTemplates, customers, Reminder } from '@/lib/sampleData';
import { Bell, Send, CheckCircle, Clock, XCircle, Plus, X, MessageSquare } from 'lucide-react';

const StatusBadge = ({ status }: { status: Reminder['status'] }) => {
  const map = {
    sent: { cls: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Sent' },
    pending: { cls: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Pending' },
    failed: { cls: 'bg-red-100 text-red-700', icon: XCircle, label: 'Failed' },
  };
  const { cls, icon: Icon, label } = map[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

export default function RemindersPage() {
  const [reminderList, setReminderList] = useState<Reminder[]>(initialReminders);
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(reminderTemplates[0].id);
  const [form, setForm] = useState({
    customerId: '',
    message: reminderTemplates[0].message,
    scheduledDate: new Date().toISOString().split('T')[0],
    type: 'payment_due' as Reminder['type'],
  });

  const sent = reminderList.filter((r) => r.status === 'sent').length;
  const pending = reminderList.filter((r) => r.status === 'pending').length;
  const failed = reminderList.filter((r) => r.status === 'failed').length;

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const tmpl = reminderTemplates.find((t) => t.id === templateId);
    if (tmpl) setForm((p) => ({ ...p, message: tmpl.message }));
  };

  const handleSend = () => {
    if (!form.customerId) return;
    const customer = customers.find((c) => c.id === form.customerId);
    if (!customer) return;
    const newReminder: Reminder = {
      id: `r${Date.now()}`,
      customerId: form.customerId,
      customerName: customer.name,
      phone: customer.phone,
      amount: Math.abs(customer.balance),
      message: form.message.replace('{name}', customer.name).replace('{amount}', Math.abs(customer.balance).toLocaleString('en-IN')),
      status: 'sent',
      scheduledDate: form.scheduledDate,
      sentDate: form.scheduledDate,
      type: form.type,
    };
    setReminderList((prev) => [newReminder, ...prev]);
    setShowModal(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reminders</h1>
          <p className="text-gray-500 text-sm mt-0.5">SMS payment reminders</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          <Send className="w-4 h-4" />
          Send Reminder
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <p className="text-xs text-green-700 font-medium">Sent</p>
          </div>
          <p className="text-2xl font-bold text-green-800">{sent}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-yellow-600" />
            <p className="text-xs text-yellow-700 font-medium">Pending</p>
          </div>
          <p className="text-2xl font-bold text-yellow-800">{pending}</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-4 h-4 text-red-600" />
            <p className="text-xs text-red-700 font-medium">Failed</p>
          </div>
          <p className="text-2xl font-bold text-red-800">{failed}</p>
        </div>
      </div>

      {/* Templates */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Message Templates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {reminderTemplates.map((t) => (
            <div key={t.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{t.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reminder History */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Reminder History</h2>
          <span className="text-sm text-gray-500">{reminderList.length} total</span>
        </div>
        <div className="divide-y divide-gray-50">
          {reminderList.map((r) => (
            <div key={r.id} className="px-5 py-4 hover:bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bell className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-gray-900 text-sm">{r.customerName}</p>
                      <span className="text-xs text-gray-400">{r.phone}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${r.type === 'overdue' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        {r.type === 'overdue' ? 'Overdue' : 'Payment Due'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{r.message}</p>
                    <p className="text-xs text-blue-600 font-medium mt-1">Amount: {formatCurrency(r.amount)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{new Date(r.scheduledDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Send Reminder Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Send Reminder</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
                <select value={form.customerId} onChange={(e) => setForm((p) => ({ ...p, customerId: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400">
                  <option value="">Select customer</option>
                  {customers.filter((c) => c.balance > 0).map((c) => <option key={c.id} value={c.id}>{c.name} – ₹{c.balance.toLocaleString('en-IN')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                <select value={selectedTemplate} onChange={(e) => handleTemplateChange(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400">
                  {reminderTemplates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} rows={4} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none" />
                <p className="text-xs text-gray-400 mt-1">Use {'{name}'} and {'{amount}'} as placeholders</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
                <input type="date" value={form.scheduledDate} onChange={(e) => setForm((p) => ({ ...p, scheduledDate: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSend} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Send Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
