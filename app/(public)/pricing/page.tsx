import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const FEATURES = [
  'Unlimited Customers',
  'Unlimited Transactions',
  'SMS Payment Reminders',
  'PDF Reports & Export',
  'UPI Payment Tracking',
  'Offline Support',
  'Mobile & Desktop Access',
  'Customer Transaction History',
  'Balance Summary',
  'Business Analytics',
  '24/7 Customer Support',
  'Free Forever',
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16 px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-3">Simple, Transparent Pricing</h1>
          <p className="text-blue-100 text-lg">No hidden charges. No credit card. Just free.</p>
        </section>

        <section className="py-16 px-4">
          <div className="mx-auto max-w-md text-center">
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-8 text-white shadow-xl">
              <div className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">ALL FEATURES INCLUDED</div>
              <h2 className="text-2xl font-bold mb-2">Free Plan</h2>
              <div className="text-6xl font-extrabold mb-1">₹0</div>
              <p className="text-blue-200 mb-8">per month, forever</p>
              <div className="grid grid-cols-1 gap-2.5 mb-8 text-left">
                {FEATURES.map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm">
                    <CheckCircle size={16} className="text-orange-400 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              <Link href="/signup" className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors">
                Get Started Free →
              </Link>
            </div>

            <div className="mt-8 bg-gray-50 rounded-xl border border-gray-200 p-5 text-left">
              <h3 className="font-bold text-gray-900 mb-3">Why is it free?</h3>
              <p className="text-sm text-gray-600">
                We believe every small business in India deserves access to quality financial tools. Our mission is to empower shopkeepers, traders, and small business owners with technology — without any cost barrier.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
