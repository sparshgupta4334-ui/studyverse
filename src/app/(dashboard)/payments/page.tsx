'use client';

import { useState } from 'react';
import { payments as initialPayments, customers, Payment } from '@/lib/sampleData';
import { Plus, X, CreditCard, CheckCircle, Clock, XCircle, Download } from 'lucide-react';

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

const StatusBadge = ({ status }: { status: Payment['status'] }) => {
  const map = {
    completed: { cls: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Completed' },
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

export default function PaymentsPage() {
  const [paymentList, setPaymentList] = useState<Payment[]>(initialPayments);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ customerId: '', amount: '', method: 'UPI' as Payment['method'], upiId: '', reference: '', date: new Date().toISOString().split('T')[0] });

  const totalCollected = paymentList.filter((p) => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
  const totalPending = paymentList.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const thisMonth = paymentList.filter((p) => p.status === 'completed' && p.date.startsWith('2024-01')).reduce((s, p) => s + p.amount, 0);

  const handleSave = () => {
    if (!form.customerId || !form.amount) return;
    const customer = customers.find((c) => c.id === form.customerId);
    const newPayment: Payment = {
      id: `p${Date.now()}`,
      customerId: form.customerId,
      customerName: customer?.name || 'Unknown',
      amount: parseFloat(form.amount),
      method: form.method,
      status: 'pending',
      date: form.date,
      upiId: form.upiId || undefined,
      reference: form.reference || undefined,
    };
    setPaymentList((prev) => [newPayment, ...prev]);
    setShowModal(false);
    setForm({ customerId: '', amount: '', method: 'UPI', upiId: '', reference: '', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500 text-sm mt-0.5">UPI & payment tracking</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Record Payment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-100 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-700 font-medium">Total Collected</p>
          </div>
          <p className="text-2xl font-bold text-green-800">{formatCurrency(totalCollected)}</p>
          <p className="text-xs text-green-600 mt-1">{paymentList.filter((p) => p.status === 'completed').length} payments</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-yellow-700 font-medium">Pending</p>
          </div>
          <p className="text-2xl font-bold text-yellow-800">{formatCurrency(totalPending)}</p>
          <p className="text-xs text-yellow-600 mt-1">{paymentList.filter((p) => p.status === 'pending').length} payments</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-blue-700 font-medium">This Month</p>
          </div>
          <p className="text-2xl font-bold text-blue-800">{formatCurrency(thisMonth)}</p>
          <p className="text-xs text-blue-600 mt-1">January 2024</p>
        </div>
      </div>

      {/* Payment Method Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Payment Methods</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(['UPI', 'Cash', 'Bank Transfer', 'Cheque'] as Payment['method'][]).map((method) => {
            const count = paymentList.filter((p) => p.method === method).length;
            const total = paymentList.filter((p) => p.method === method && p.status === 'completed').reduce((s, p) => s + p.amount, 0);
            const colors: Record<string, string> = { UPI: 'bg-purple-50 border-purple-100 text-purple-700', Cash: 'bg-green-50 border-green-100 text-green-700', 'Bank Transfer': 'bg-blue-50 border-blue-100 text-blue-700', Cheque: 'bg-orange-50 border-orange-100 text-orange-700' };
            return (
              <div key={method} className={`rounded-lg border p-3 ${colors[method]}`}>
                <p className="text-xs font-medium mb-1">{method}</p>
                <p className="text-lg font-bold">{count} <span className="text-xs font-normal">payments</span></p>
                <p className="text-xs mt-0.5">{formatCurrency(total)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Payment History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Date</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Customer</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium hidden sm:table-cell">Method</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Reference</th>
                <th className="text-center px-4 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {paymentList.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {new Date(p.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-700 font-bold text-xs">{p.customerName.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-gray-900">{p.customerName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">{p.method}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-400 text-xs">{p.upiId || p.reference || '-'}</td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(p.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Record Payment</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
                <select value={form.customerId} onChange={(e) => setForm((p) => ({ ...p, customerId: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400">
                  <option value="">Select customer</option>
                  {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
                <input type="number" placeholder="0.00" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select value={form.method} onChange={(e) => setForm((p) => ({ ...p, method: e.target.value as Payment['method'] }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400">
                  {(['UPI', 'Cash', 'Bank Transfer', 'Cheque'] as Payment['method'][]).map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              {form.method === 'UPI' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                  <input type="text" placeholder="name@paytm" value={form.upiId} onChange={(e) => setForm((p) => ({ ...p, upiId: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference / Cheque No.</label>
                <input type="text" placeholder="Optional reference" value={form.reference} onChange={(e) => setForm((p) => ({ ...p, reference: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Record Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
