'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Users, FileText, CreditCard, Bell, TrendingUp, BarChart3,
  CheckCircle, Star, ChevronDown, ChevronUp, ArrowRight,
  Shield, Smartphone
} from 'lucide-react';
import { sampleTestimonials, stats } from '@/lib/sample-data';

function CounterNumber({ end, duration = 2000, prefix = '', suffix = '' }: { end: number; duration?: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const step = end / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  const formatNum = (n: number) => {
    if (n >= 10000000) return (n / 10000000).toFixed(1) + 'Cr';
    if (n >= 100000) return (n / 100000).toFixed(1) + 'L';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  return <span ref={ref}>{prefix}{formatNum(count)}{suffix}</span>;
}

const features = [
  { icon: Users, title: 'Customer Management', desc: 'Manage unlimited customers with complete contact details, balance tracking, and transaction history.', color: 'blue' },
  { icon: FileText, title: 'Digital Ledger', desc: 'Replace your paper khata with a powerful digital ledger. Track every credit and debit with real-time balance.', color: 'green' },
  { icon: CreditCard, title: 'UPI Payment Tracking', desc: 'Track all UPI payments, generate QR codes, and monitor payment status in real-time.', color: 'purple' },
  { icon: Bell, title: 'SMS Reminders', desc: 'Send automated payment reminders via SMS to customers with outstanding balances.', color: 'orange' },
  { icon: TrendingUp, title: 'Business Reports', desc: 'Generate detailed PDF reports - daily, weekly, monthly. Share with your accountant instantly.', color: 'red' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Visual charts showing your business growth, top customers, and payment trends.', color: 'teal' },
  { icon: Shield, title: 'Data Security', desc: 'Your data is encrypted and backed up automatically. Never lose your business records.', color: 'indigo' },
  { icon: Smartphone, title: 'Works Offline', desc: 'Full functionality even without internet. Sync automatically when connection is restored.', color: 'pink' },
];

const faqItems = [
  { q: 'Is it really 100% free?', a: 'Yes! Gupta Paper Stores is completely free forever. No credit card, no hidden fees, no trial period. Unlimited customers, unlimited transactions, unlimited everything.' },
  { q: 'Do I need to create an account?', a: 'No! You can explore all features directly without any login or registration. Just open the website and start exploring the demo data.' },
  { q: 'Can I use it on my phone?', a: 'Yes! The website works perfectly on mobile phones, tablets, and computers. We also have an Android app available for download.' },
  { q: 'Is my data safe?', a: 'Absolutely. All data is encrypted with industry-standard AES-256 encryption. We take privacy seriously and never share your data.' },
  { q: 'Can I export my data?', a: 'Yes! You can export your data as CSV, Excel, or PDF at any time. Your data belongs to you.' },
  { q: 'Does it work without internet?', a: 'Yes! The app works completely offline and syncs automatically when you get connected to the internet.' },
  { q: 'How many customers can I add?', a: 'Unlimited! There is no cap on the number of customers, transactions, or any other data.' },
  { q: 'Can I send bulk SMS reminders?', a: 'Yes! You can send payment reminders to multiple customers at once. SMS charges are nominal (approx ₹0.15 per SMS).' },
];

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  teal: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400',
  indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
  pink: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',
};

export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % sampleTestimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8 text-white text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              🎉 100% FREE — No Credit Card Required
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Smart Business
              <span className="block bg-gradient-to-r from-blue-300 to-orange-400 bg-clip-text text-transparent">
                Management
              </span>
              <span className="block text-4xl sm:text-5xl lg:text-6xl mt-2">for Everyone</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Replace your paper khata with a powerful digital solution.
              Manage customers, track payments, send reminders, and generate reports — all in one place.
              <strong className="text-white"> Completely FREE forever.</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 bg-white text-blue-700 hover:bg-gray-50 px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:-translate-y-1 transition-all"
              >
                <BarChart3 className="w-5 h-5" />
                Start Managing Your Business Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/features"
                className="flex items-center gap-2 border-2 border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all backdrop-blur-sm hover:bg-white/10"
              >
                Explore Features
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {['✅ No Login Required', '✅ Works on Phone', '✅ Unlimited Data', '✅ Export PDF & CSV', '✅ Works Offline'].map(item => (
                <span key={item} className="text-green-400">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-blue-600 dark:bg-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center text-white">
            {[
              { label: 'Active Users', value: stats.activeUsers },
              { label: 'Transactions', value: stats.transactionsProcessed },
              { label: 'Amount Managed', value: stats.totalAmountManaged, prefix: '₹' },
              { label: 'Cities Served', value: stats.citiesServed, suffix: '+' },
              { label: 'Customers Managed', value: stats.customersManaged },
              { label: 'Uptime', value: 99, suffix: '%' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold mb-1">
                  <CounterNumber end={stat.value} prefix={stat.prefix || ''} suffix={stat.suffix || ''} />
                </div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">Features</span>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">Everything You Need to Run Your Business</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Powerful tools designed specifically for Indian small and medium businesses.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-700 card-hover bg-white dark:bg-gray-900 group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClasses[feature.color]}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">Pricing</span>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">Simple, Honest Pricing</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-12">No tricks. No tiers. No hidden fees. Just one plan — FREE.</p>
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 border-2 border-blue-500 shadow-2xl">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-6 py-1.5 rounded-full text-sm font-semibold shadow-lg">⭐ Most Popular</span>
            </div>
            <div className="text-6xl font-bold text-gray-900 dark:text-white mb-2">₹0</div>
            <div className="text-gray-500 dark:text-gray-400 mb-8">Forever Free · No Credit Card Required</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
              {['Unlimited Customers','Unlimited Transactions','Unlimited Reminders','PDF Reports','Data Export (CSV)','UPI Payment Tracking','Business Analytics','Offline Mode','Cloud Backup','Multi-device Access','Priority Support','Regular Updates'].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
            <Link href="/dashboard" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-all shadow-lg hover:-translate-y-0.5">
              Start Using for Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-12">Loved by 12,000+ Business Owners</h2>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 mb-6">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(sampleTestimonials[activeTestimonial].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6 italic">
              &ldquo;{sampleTestimonials[activeTestimonial].text}&rdquo;
            </p>
            <div className="font-semibold text-gray-900 dark:text-white">{sampleTestimonials[activeTestimonial].name}</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">{sampleTestimonials[activeTestimonial].business}</div>
          </div>
          <div className="flex justify-center gap-2">
            {sampleTestimonials.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)}
                className={`h-2.5 rounded-full transition-all ${i === activeTestimonial ? 'bg-blue-500 w-6' : 'bg-gray-300 dark:bg-gray-700 w-2.5'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">FAQ</span>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-2">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <span className="font-semibold text-gray-900 dark:text-white pr-4">{item.q}</span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 text-blue-500 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/faq" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">View all FAQ →</Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated with Business Tips</h2>
          <p className="text-blue-100 mb-8">Get weekly business management tips, feature updates, and success stories.</p>
          <form onSubmit={(e) => { e.preventDefault(); alert(`Subscribed: ${email}`); setEmail(''); }}
            className="flex flex-col sm:flex-row gap-3 justify-center">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address" required
              className="flex-1 px-5 py-3 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50" />
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors whitespace-nowrap">
              Subscribe Free
            </button>
          </form>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Ready to Transform Your Business?</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">
            Join 12,000+ business owners who have already gone digital. It&apos;s free, instant, and no setup required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:-translate-y-0.5">
              <BarChart3 className="w-5 h-5" />
              Open Dashboard — Free
            </Link>
            <Link href="/features"
              className="inline-flex items-center gap-2 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500 px-8 py-4 rounded-xl font-semibold text-lg transition-all">
              Explore Features
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
