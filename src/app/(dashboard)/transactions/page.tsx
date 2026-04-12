'use client';

import { useState } from 'react';
import { transactions as initialTransactions, customers, Transaction } from '@/lib/sampleData';
import { Search, Plus, Download, ArrowUpRight, ArrowDownRight, X, Filter } from 'lucide-react';

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

export default function TransactionsPage() {
  const [txnList, setTxnList] = useState<Transaction[]>(initialTransactions);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ customerId: '', amount: '', type: 'credit' as 'credit' | 'debit', notes: '', date: new Date().toISOString().split('T')[0] });

  const filtered = txnList.filter((t) => {
    const matchSearch = t.customerName.toLowerCase().includes(search.toLowerCase()) ||
      t.notes.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || t.type === typeFilter;
    const matchCustomer = customerFilter === 'all' || t.customerId === customerFilter;
    return matchSearch && matchType && matchCustomer;
  });

  const totalCredit = filtered.filter((t) => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const totalDebit = filtered.filter((t) => t.type === 'debit').reduce((s, t) => s + t.amount, 0);

  const handleSave = () => {
    if (!form.customerId || !form.amount) return;
    const customer = customers.find((c) => c.id === form.customerId);
    const newTxn: Transaction = {
      id: `t${Date.now()}`,
      customerId: form.customerId,
      customerName: customer?.name || 'Unknown',
      amount: parseFloat(form.amount),
      type: form.type,
      date: form.date,
      notes: form.notes,
    };
    setTxnList((prev) => [newTxn, ...prev]);
    setShowModal(false);
    setForm({ customerId: '', amount: '', type: 'credit', notes: '', date: new Date().toISOString().split('T')[0] });
  };

  const handleExport = () => {
    const csv = [
      ['Date', 'Customer', 'Type', 'Amount', 'Notes'],
      ...filtered.map((t) => [t.date, t.customerName, t.type, t.amount, t.notes]),
    ].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500 text-sm mt-0.5">{filtered.length} transactions</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Entry
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <p className="text-xs text-green-600 font-medium mb-1">Total Credit</p>
          <p className="text-lg font-bold text-green-700">{formatCurrency(totalCredit)}</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-xs text-red-600 font-medium mb-1">Total Debit</p>
          <p className="text-lg font-bold text-red-700">{formatCurrency(totalDebit)}</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs text-blue-600 font-medium mb-1">Net Balance</p>
          <p className={`text-lg font-bold ${totalCredit - totalDebit >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
            {formatCurrency(Math.abs(totalCredit - totalDebit))}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-gray-600 outline-none w-full"
          />
        </div>
        <select
          value={customerFilter}
          onChange={(e) => setCustomerFilter(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none"
        >
          <option value="all">All Customers</option>
          {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="flex gap-2">
          {(['all', 'credit', 'debit'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === f ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Date</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Customer</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Notes</th>
                <th className="text-center px-4 py-3 text-gray-500 font-medium">Type</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{t.customerName}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell max-w-[200px] truncate">{t.notes}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${t.type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {t.type === 'credit' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {t.type === 'credit' ? 'Credit' : 'Debit'}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold whitespace-nowrap ${t.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'credit' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Add Transaction</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
                <select
                  value={form.customerId}
                  onChange={(e) => setForm((p) => ({ ...p, customerId: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                >
                  <option value="">Select customer</option>
                  {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <div className="flex gap-3">
                  {(['credit', 'debit'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm((p) => ({ ...p, type: t }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${form.type === t ? (t === 'credit' ? 'bg-green-600 text-white border-green-600' : 'bg-red-600 text-white border-red-600') : 'border-gray-200 text-gray-600'}`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  placeholder="Transaction description..."
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
