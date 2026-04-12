'use client';
import { useEffect, useState } from 'react';
import { customersApi, paymentsApi } from '@/lib/api';
import type { Customer, Payment } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/constants';
import { clsx } from 'clsx';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function PaymentsPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    customersApi.list().then((r) => { if (r.data.success) setCustomers(r.data.data ?? []); });
    paymentsApi.list().then((r) => { if (r.data.success) setPayments(r.data.data ?? []); });

    // Load Razorpay script
    if (!document.getElementById('razorpay-script')) {
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);
    }
  }, []);

  const handlePayment = async () => {
    if (!selectedCustomer || !amount) { setError('Select customer and enter amount'); return; }
    setError(''); setLoading(true);
    try {
      const paise = Math.round(parseFloat(amount) * 100);
      const orderRes = await paymentsApi.createOrder(selectedCustomer, paise);
      if (!orderRes.data.success || !orderRes.data.data) {
        setError('Failed to create payment order'); setLoading(false); return;
      }
      const { order_id, amount: orderAmount, currency } = orderRes.data.data;
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency,
        name: 'Gupta Paper Stores',
        description: 'Payment',
        order_id,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const verifyRes = await paymentsApi.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customer_id: selectedCustomer,
            });
            if (verifyRes.data.success) {
              setSuccess('Payment successful!');
              if (verifyRes.data.data) setPayments((p) => [verifyRes.data.data!, ...p]);
            }
          } catch { setError('Payment verification failed'); }
        },
        prefill: { contact: customers.find((c) => c.customer_id === selectedCustomer)?.phone || '' },
        theme: { color: '#1E88E5' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch { setError('Payment initialization failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-500 text-sm mt-0.5">Accept online payments via Razorpay</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Collect Payment</h2>
          {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4 border border-red-100">{error}</div>}
          {success && <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-4 border border-green-100">{success}</div>}

          <div className="space-y-4">
            <div>
              <label className="label">Customer</label>
              <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)} className="input-field">
                <option value="">Select customer...</option>
                {customers.map((c) => (
                  <option key={c.customer_id} value={c.customer_id}>
                    {c.name} — {formatCurrency(Math.abs(c.balance))}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="input-field"
              />
            </div>
            <button onClick={handlePayment} disabled={loading} className="btn-primary w-full py-2.5">
              {loading ? 'Processing...' : 'Initiate Payment'}
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Payment History</h2>
          {payments.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">No payments yet</p>
          ) : (
            <div className="space-y-3">
              {payments.map((p) => (
                <div key={p.payment_id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.customer_name || '—'}</p>
                    <p className="text-xs text-gray-400">{formatDate(p.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(p.amount)}</p>
                    <span className={clsx(
                      'text-xs px-2 py-0.5 rounded-full',
                      p.status === 'success' ? 'bg-green-50 text-green-700' :
                      p.status === 'failed' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                    )}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
