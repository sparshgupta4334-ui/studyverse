'use client';

import { useState } from 'react';
import { customers as initialCustomers, Customer } from '@/lib/sampleData';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Phone,
  TrendingUp,
  TrendingDown,
  X,
  IndianRupee,
} from 'lucide-react';

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.abs(val));

export default function CustomersPage() {
  const [customerList, setCustomerList] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'receivable' | 'payable'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', businessType: '' });

  const filtered = customerList.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchFilter =
      filter === 'all' ||
      (filter === 'receivable' && c.balance > 0) ||
      (filter === 'payable' && c.balance < 0);
    return matchSearch && matchFilter;
  });

  const handleOpenAdd = () => {
    setEditCustomer(null);
    setForm({ name: '', phone: '', email: '', address: '', businessType: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (c: Customer) => {
    setEditCustomer(c);
    setForm({ name: c.name, phone: c.phone, email: c.email || '', address: c.address || '', businessType: c.businessType || '' });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.phone) return;
    if (editCustomer) {
      setCustomerList((prev) =>
        prev.map((c) => c.id === editCustomer.id ? { ...c, ...form } : c)
      );
    } else {
      const newCustomer: Customer = {
        id: `c${Date.now()}`,
        ...form,
        balance: 0,
        lastTransaction: new Date().toISOString().split('T')[0],
        totalTransactions: 0,
        joinDate: new Date().toISOString().split('T')[0],
      };
      setCustomerList((prev) => [newCustomer, ...prev]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setCustomerList((prev) => prev.filter((c) => c.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500 text-sm mt-0.5">{customerList.length} total customers</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-gray-600 outline-none w-full"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'receivable', 'payable'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Customer</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium hidden sm:table-cell">Phone</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Business Type</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Balance</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium hidden lg:table-cell">Last Txn</th>
                <th className="text-center px-4 py-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">No customers found</td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-700 font-bold">{c.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{c.name}</p>
                          <p className="text-xs text-gray-400 sm:hidden">{c.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        {c.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-600">{c.businessType || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className={`flex items-center justify-end gap-1 font-semibold ${c.balance > 0 ? 'text-green-600' : c.balance < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                        {c.balance > 0 ? <TrendingUp className="w-4 h-4" /> : c.balance < 0 ? <TrendingDown className="w-4 h-4" /> : null}
                        <span>
                          {c.balance === 0 ? 'Settled' : `${c.balance > 0 ? '+' : '-'}${formatCurrency(c.balance)}`}
                        </span>
                      </div>
                      {c.balance !== 0 && (
                        <p className={`text-xs mt-0.5 ${c.balance > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {c.balance > 0 ? 'Receivable' : 'Payable'}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-500">
                      {new Date(c.lastTransaction).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(c.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                {editCustomer ? 'Edit Customer' : 'Add New Customer'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Name *', key: 'name', placeholder: 'Customer name' },
                { label: 'Phone *', key: 'phone', placeholder: '10-digit mobile number' },
                { label: 'Email', key: 'email', placeholder: 'email@example.com' },
                { label: 'Address', key: 'address', placeholder: 'Full address' },
                { label: 'Business Type', key: 'businessType', placeholder: 'e.g. Retail Shop, School' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                {editCustomer ? 'Save Changes' : 'Add Customer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Customer</h2>
            <p className="text-sm text-gray-500 mb-5">Are you sure? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
