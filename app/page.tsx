import Link from 'next/link';
import { BookOpen, CheckCircle, Star, ChevronDown } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FEATURES, FAQS, APP_NAME } from '@/lib/constants';
import {
  Users, ArrowLeftRight, Smartphone, Bell, FileText, WifiOff
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Users, ArrowLeftRight, Smartphone, Bell, FileText, WifiOff,
};

const TESTIMONIALS = [
  {
    name: 'Suresh Patel',
    business: 'Patel Hardware Store, Mumbai',
    text: 'Gupta Paper Stores app has completely transformed how I manage my business. I can track every transaction instantly and send reminders with one click!',
    rating: 5,
  },
  {
    name: 'Kavita Sharma',
    business: 'Sharma Textiles, Jaipur',
    text: 'The best khata app I have used. It is simple, fast, and the SMS reminder feature has helped me recover dues much faster than before.',
    rating: 5,
  },
  {
    name: 'Rajan Mehta',
    business: 'Mehta General Stores, Pune',
    text: 'Free of cost and full of features! The PDF report feature is amazing for sharing accounts with customers. Highly recommended!',
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white py-20 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-blue-600/50 rounded-full px-4 py-1.5 text-sm mb-6">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              100% Free Digital Ledger App
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Smart Digital Khata for{' '}
              <span className="text-orange-400">Your Business</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Manage customers, track credit-debit transactions, send SMS payment reminders, and generate PDF reports — all for FREE.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-xl text-lg transition-colors"
              >
                Start for Free →
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-3.5 rounded-xl text-lg transition-colors border border-white/20"
              >
                Login
              </Link>
            </div>
            <p className="mt-6 text-blue-300 text-sm">No credit card required · No hidden fees · Unlimited usage</p>
          </div>
        </section>

        {/* Stats bar */}
        <section className="bg-white border-b py-8 px-4">
          <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '10,000+', label: 'Happy Businesses' },
              { value: '50L+', label: 'Transactions Tracked' },
              { value: '100%', label: 'Free Forever' },
              { value: '4.9★', label: 'App Rating' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl font-extrabold text-blue-700">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-16 px-4 bg-gray-50">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Everything You Need</h2>
              <p className="text-gray-500 text-lg">Powerful features to run your business smoothly</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature) => {
                const Icon = ICON_MAP[feature.icon] ?? BookOpen;
                return (
                  <div key={feature.title} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="mb-4 inline-flex p-3 bg-blue-50 rounded-lg">
                      <Icon size={22} className="text-blue-700" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-16 px-4 bg-white">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Simple Pricing</h2>
            <p className="text-gray-500 mb-10">One plan. All features. Always free.</p>
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-8 text-white shadow-xl">
              <div className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">MOST POPULAR</div>
              <h3 className="text-2xl font-bold mb-2">Free Forever</h3>
              <div className="text-5xl font-extrabold mb-1">₹0</div>
              <p className="text-blue-200 mb-8">/month · No credit card needed</p>
              <ul className="space-y-3 text-left mb-8">
                {['Unlimited Customers', 'Unlimited Transactions', 'SMS Reminders', 'PDF Reports', 'UPI Payment Tracking', 'Offline Support', 'Mobile & Desktop Access', '24/7 Customer Support'].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <CheckCircle size={16} className="text-orange-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors text-center"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">What Businesses Say</h2>
              <p className="text-gray-500">Trusted by thousands of shop owners across India</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={16} className="text-orange-400 fill-orange-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.business}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-white">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
              <p className="text-gray-500">Everything you need to know</p>
            </div>
            <div className="space-y-4">
              {FAQS.map((faq) => (
                <div key={faq.question} className="border border-gray-200 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center justify-between">
                    {faq.question}
                    <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
                  </h3>
                  <p className="text-sm text-gray-500">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Grow Your Business?</h2>
            <p className="text-blue-100 mb-8 text-lg">Join 10,000+ businesses already using {APP_NAME}</p>
            <Link
              href="/signup"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors"
            >
              Start Free Today →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
