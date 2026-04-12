import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';

const allFeatures = [
  'Unlimited Customers', 'Unlimited Transactions', 'Unlimited SMS Reminders', 'PDF Report Generation',
  'CSV Data Export', 'UPI Payment Tracking', 'Business Analytics', 'Offline Mode',
  'Cloud Backup', 'Multi-device Access', 'Customer Support', 'Regular Feature Updates',
  'Data Import/Export', 'Bulk SMS Sending', 'Custom Templates', 'Transaction Categories',
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">Honest Pricing</h1>
        <p className="text-gray-500 dark:text-gray-400 text-xl mb-4">No tricks. No tiers. No hidden costs.</p>
        <p className="text-gray-900 dark:text-white text-lg font-semibold mb-12">Just one plan: <span className="text-primary-600 dark:text-primary-400">FREE forever.</span></p>

        <div className="relative bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-8 text-white shadow-2xl shadow-primary-500/20 mb-12">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <span className="bg-accent-500 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg">⭐ ONLY PLAN — FREE</span>
          </div>
          <div className="text-7xl font-black mb-2">₹0</div>
          <div className="text-primary-100 mb-8 text-lg">Per month · Forever · No credit card</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mb-8">
            {allFeatures.map(f => (
              <div key={f} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-300 shrink-0" />
                <span className="text-primary-100 text-sm">{f}</span>
              </div>
            ))}
          </div>
          <Link href="/dashboard" className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-gray-50 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl">
            Start Using Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 text-left">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              ['Is it really free forever?', 'Yes! 100% free. We believe small business owners should have access to powerful tools without paying hefty fees.'],
              ['How do you make money then?', 'We plan to offer premium optional features like custom domain, white-labeling, and API access in the future. Core features will always be free.'],
              ['Are there any usage limits?', 'Absolutely none. Unlimited customers, unlimited transactions, unlimited reports, unlimited reminders.'],
              ['What about SMS costs?', 'The app itself is free. SMS reminders use real SMS providers which charge ₹0.10-0.20 per SMS. You only pay for SMS you send.'],
            ].map(([q, a]) => (
              <div key={String(q)} className="border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0">
                <div className="font-semibold text-gray-900 dark:text-white mb-1">{q}</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">{a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
