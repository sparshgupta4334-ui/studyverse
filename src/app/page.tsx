'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Menu,
  X,
  ArrowRight,
  Users,
  ArrowLeftRight,
  CreditCard,
  Bell,
  BarChart3,
  Cloud,
  Check,
  Star,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Shield,
  Zap,
} from 'lucide-react';

const features = [
  { icon: Users, title: 'Customer Management', desc: 'Add, edit and manage unlimited customers with complete profile and transaction history.', color: 'bg-blue-100 text-blue-600' },
  { icon: ArrowLeftRight, title: 'Ledger Tracking', desc: 'Record credit and debit entries with running balance. Know who owes you money instantly.', color: 'bg-green-100 text-green-600' },
  { icon: CreditCard, title: 'UPI Payments', desc: 'Track UPI, cash, bank transfers and cheque payments with status updates.', color: 'bg-orange-100 text-orange-600' },
  { icon: Bell, title: 'SMS Reminders', desc: 'Send automated payment reminders via SMS in Hindi and English.', color: 'bg-purple-100 text-purple-600' },
  { icon: BarChart3, title: 'Smart Reports', desc: 'Visual charts and reports to understand your business performance at a glance.', color: 'bg-pink-100 text-pink-600' },
  { icon: Cloud, title: 'Cloud Backup', desc: 'Your data is automatically backed up to cloud. Access from any device anytime.', color: 'bg-cyan-100 text-cyan-600' },
];

const testimonials = [
  { name: 'Ramesh Sharma', business: 'Sharma General Store, Delhi', text: 'Pehle hath se khata likhte the aur bhool jaate the. Ab Gupta Paper Stores app se sab kuch phone mein hai. Bahut aasan hai!', rating: 5, initial: 'R' },
  { name: 'Anita Joshi', business: 'Joshi Printing Press, Noida', text: 'SMS reminder feature ne meri collection 40% badha di. Customers ko automatically reminder jaata hai toh payment bhi time pe aata hai.', rating: 5, initial: 'A' },
  { name: 'Suresh Yadav', business: 'Yadav Paper House, Gurgaon', text: 'Bilkul free hai aur features premium apps jaisi hain. Reports dekh ke ab main better decisions leta hoon apne business ke liye.', rating: 5, initial: 'S' },
  { name: 'Priya Gupta', business: 'City Public School, Faridabad', text: 'School ka stationery account manage karna bahut aasan ho gaya. Sabhi teachers ko pending balances dikha sakti hoon ek click mein.', rating: 5, initial: 'P' },
];

const faqs = [
  { q: 'Kya yeh app bilkul free hai?', a: 'Haan! Gupta Paper Stores app completely FREE hai. Koi hidden charges nahi, koi credit card nahi chahiye. Unlimited customers, unlimited transactions - sab free.' },
  { q: 'Kya mera data safe hai?', a: 'Bilkul. Aapka data bank-level encryption ke saath secure hai. Daily automatic backups hoti hain aur aapka data kabhi delete nahi hoga.' },
  { q: 'Kya main multiple devices pe use kar sakta hoon?', a: 'Haan! Aap mobile, tablet aur computer - kisi bhi device pe apna account access kar sakte hain. Data real-time sync hota hai.' },
  { q: 'SMS reminder kaise kaam karta hai?', a: 'Aap customer select karein, amount check karein, aur ek click mein SMS reminder bhej sakte hain. Hindi aur English dono mein templates available hain.' },
  { q: 'Kya main data export kar sakta hoon?', a: 'Haan! Aap apna poora data CSV aur PDF format mein export kar sakte hain anytime. Aapka data hamesha aapke paas rehega.' },
];

const steps = [
  { num: '01', title: 'Customer Add Karein', desc: 'Customer ka naam, phone number aur basic details add karein. Bas 30 seconds!' },
  { num: '02', title: 'Transactions Record Karein', desc: 'Har sale aur payment ko record karein. Credit ya debit - balance automatically calculate hoga.' },
  { num: '03', title: 'Reports Dekh Aur Paisa Pao', desc: 'Smart reports se business samjhein. Overdue customers ko SMS reminder bhejein aur paisa waqt pe pao.' },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-base leading-tight">Gupta Paper Stores</div>
              <div className="text-xs text-gray-500 leading-tight">Digital Khata App</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {[['Features', '#features'], ['How It Works', '#how-it-works'], ['Pricing', '/pricing'], ['About', '/about']].map(([label, href]) => (
              <Link key={label} href={href} className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">{label}</Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/dashboard" className="px-4 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">Dashboard</Link>
            <Link href="/dashboard" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Shuru Karein Free
            </Link>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-600">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2">
            {[['Features', '#features'], ['How It Works', '#how-it-works'], ['Pricing', '/pricing'], ['About', '/about'], ['Contact', '/contact']].map(([label, href]) => (
              <Link key={label} href={href} className="block py-2 text-sm text-gray-600 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>{label}</Link>
            ))}
            <Link href="/dashboard" className="block mt-2 text-center px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg" onClick={() => setMobileMenuOpen(false)}>
              Dashboard Kholo Free
            </Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-orange-50 pt-16 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Zap className="w-4 h-4" />
            India ka #1 Free Khata App
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            India ka Sabse Trusted{' '}
            <span className="text-blue-600">Khata App</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Digital ledger, UPI tracking, SMS reminders aur smart reports — sab ek jagah.
            50,000+ businesses trust karte hain Gupta Paper Stores ko.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
              Abhi Shuru Karein FREE
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 px-8 py-3.5 rounded-xl font-semibold text-base hover:border-blue-300 hover:text-blue-600 transition-colors">
              Demo Dekhen
              <Smartphone className="w-5 h-5" />
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">Bilkul Free &nbsp;|&nbsp; No Credit Card &nbsp;|&nbsp; 2 Minute Setup</p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-blue-600 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-white">
            {[
              { value: '50,000+', label: 'Businesses' },
              { value: '100Cr+', label: 'Tracked (INR)' },
              { value: '99.9%', label: 'Uptime' },
              { value: '4.8 Star', label: 'User Rating' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl sm:text-3xl font-bold">{s.value}</div>
                <div className="text-blue-200 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Sab Kuch Ek App Mein</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Aapke business ke liye zaruri har feature — simple, fast aur reliable.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 transition-all group">
                  <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Kaise Kaam Karta Hai?</h2>
            <p className="text-gray-500">Sirf 3 simple steps mein apna digital khata shuru karein</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={step.num} className="relative text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                  <span className="text-white font-bold text-xl">{step.num}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/dashboard" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
              Abhi Try Karein
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">50,000+ Businesses Ki Pasand</h2>
            <p className="text-gray-500">Unke shabd, unke anubhav</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{t.initial}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.business}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-blue-50">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Simple Pricing</h2>
          <p className="text-gray-500 mb-8">No confusion, no hidden fees</p>
          <div className="bg-white rounded-3xl border-2 border-blue-600 p-8 shadow-xl">
            <div className="text-blue-600 font-bold text-sm mb-2 uppercase tracking-wide">Forever Free</div>
            <div className="text-6xl font-bold text-gray-900 mb-1">0</div>
            <div className="text-gray-500 mb-6">per month, forever (INR)</div>
            <div className="space-y-3 text-left mb-8">
              {[
                'Unlimited Customers',
                'Unlimited Transactions',
                'UPI Payment Tracking',
                'SMS Reminders (100/month)',
                'Reports and Analytics',
                'Cloud Backup',
                'Mobile and Desktop Access',
                'Customer Support',
              ].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700 text-sm">{f}</span>
                </div>
              ))}
            </div>
            <Link href="/dashboard" className="block w-full bg-blue-600 text-white text-center py-3.5 rounded-xl font-bold text-base hover:bg-blue-700 transition-colors">
              Free Mein Shuru Karein
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Aksar Pooche Jaane Wale Sawaal</h2>
            <p className="text-gray-500">Koi doubt? Hum jawab dete hain</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900 text-sm">{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Abhi Shuru Karein 100% Free</h2>
          <p className="text-blue-200 mb-8 text-lg">2 minute mein setup karein. Koi credit card nahi chahiye.</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg">
            Free Account Banayein
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold">Gupta Paper Stores</span>
              </div>
              <p className="text-sm leading-relaxed">India ka trusted digital khata platform for small and medium businesses.</p>
            </div>
            {[
              { title: 'Product', links: [['Dashboard', '/dashboard'], ['Customers', '/customers'], ['Reports', '/reports'], ['Pricing', '/pricing']] },
              { title: 'Company', links: [['About', '/about'], ['Contact', '/contact']] },
              { title: 'Support', links: [['Help Center', '#'], ['Privacy Policy', '#'], ['Terms of Service', '#']] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-semibold text-sm mb-3">{col.title}</h4>
                <div className="space-y-2">
                  {col.links.map(([label, href]) => (
                    <Link key={label} href={href} className="block text-sm hover:text-white transition-colors">{label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-sm">2024 Gupta Paper Stores. All rights reserved.</p>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-green-400">SSL Secured and GDPR Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
