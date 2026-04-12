import Link from 'next/link';
import { BookOpen, Check, ArrowRight, Zap } from 'lucide-react';

const allFeatures = [
  { name: 'Customers', free: 'Unlimited', pro: 'Unlimited' },
  { name: 'Transactions', free: 'Unlimited', pro: 'Unlimited' },
  { name: 'SMS Reminders', free: '100/month', pro: '1000/month' },
  { name: 'Reports', free: 'Basic', pro: 'Advanced' },
  { name: 'Data Export', free: 'CSV only', pro: 'CSV + PDF' },
  { name: 'Cloud Backup', free: 'Daily', pro: 'Real-time' },
  { name: 'Multi-user Access', free: '1 user', pro: '5 users' },
  { name: 'Priority Support', free: false, pro: true },
  { name: 'Custom Branding', free: false, pro: true },
  { name: 'API Access', free: false, pro: true },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">Gupta Paper Stores</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">Home</Link>
            <Link href="/dashboard" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Dashboard</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-12 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
          <Zap className="w-4 h-4" />
          Simple, Transparent Pricing
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Free Forever</h1>
        <p className="text-gray-600 max-w-xl mx-auto">Gupta Paper Stores ka basic plan hamesha FREE rahega. Premium features ke liye GPS Pro available hai.</p>
      </section>

      {/* Plans */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="border-2 border-gray-200 rounded-3xl p-8">
            <div className="text-gray-500 font-semibold text-sm mb-2 uppercase tracking-wide">Free Plan</div>
            <div className="text-5xl font-bold text-gray-900 mb-1">0</div>
            <div className="text-gray-500 mb-6">per month, always free (INR)</div>
            <div className="space-y-3 mb-8">
              {[
                'Unlimited customers',
                'Unlimited transactions',
                '100 SMS reminders/month',
                'Basic reports',
                'CSV export',
                'Daily cloud backup',
                '1 user access',
              ].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700 text-sm">{f}</span>
                </div>
              ))}
            </div>
            <Link href="/dashboard" className="block w-full text-center bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors">
              Abhi Shuru Karein Free
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="border-2 border-blue-600 rounded-3xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full">COMING SOON</div>
            <div className="text-blue-600 font-semibold text-sm mb-2 uppercase tracking-wide">GPS Pro</div>
            <div className="flex items-baseline gap-1 mb-1">
              <div className="text-5xl font-bold text-gray-900">499</div>
              <div className="text-gray-500">/month (INR)</div>
            </div>
            <div className="text-gray-500 mb-6">Billed monthly, cancel anytime</div>
            <div className="space-y-3 mb-8">
              {[
                'Everything in Free',
                '1000 SMS reminders/month',
                'Advanced analytics & reports',
                'CSV + PDF export',
                'Real-time cloud backup',
                '5 user access',
                'Priority support',
                'Custom business branding',
                'API access',
              ].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="text-gray-700 text-sm">{f}</span>
                </div>
              ))}
            </div>
            <button disabled className="block w-full text-center bg-blue-200 text-blue-400 py-3.5 rounded-xl font-bold cursor-not-allowed">
              Coming Soon - Notify Me
            </button>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Feature Comparison</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
              <div className="px-5 py-3 text-sm font-semibold text-gray-600">Feature</div>
              <div className="px-5 py-3 text-sm font-semibold text-gray-700 text-center">Free</div>
              <div className="px-5 py-3 text-sm font-semibold text-blue-600 text-center">GPS Pro</div>
            </div>
            {allFeatures.map((f, idx) => (
              <div key={f.name} className={`grid grid-cols-3 border-b border-gray-100 last:border-0 ${idx % 2 === 0 ? '' : 'bg-gray-50'}`}>
                <div className="px-5 py-3 text-sm text-gray-700">{f.name}</div>
                <div className="px-5 py-3 text-center">
                  {typeof f.free === 'boolean' ? (
                    f.free ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <span className="text-gray-300 text-lg">—</span>
                  ) : (
                    <span className="text-sm text-gray-600">{f.free}</span>
                  )}
                </div>
                <div className="px-5 py-3 text-center">
                  {typeof f.pro === 'boolean' ? (
                    f.pro ? <Check className="w-4 h-4 text-blue-500 mx-auto" /> : <span className="text-gray-300 text-lg">—</span>
                  ) : (
                    <span className="text-sm text-blue-700 font-medium">{f.pro}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-blue-600 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">Free Plan Se Shuru Karein Aaj Hi</h2>
        <p className="text-blue-200 mb-6">No credit card. No commitment. Just start.</p>
        <Link href="/dashboard" className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50">
          Free Mein Shuru Karein <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center">
        <p className="text-sm">2024 Gupta Paper Stores. Made with love in India.</p>
      </footer>
    </div>
  );
}
