'use client';
import Link from 'next/link';
import {
  BookOpen,
  BarChart2,
  Bell,
  Shield,
  CreditCard,
  Users,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const features = [
  { icon: BookOpen, title: 'Digital Ledger', desc: 'Record credits and debits instantly from any device.' },
  { icon: Users, title: 'Customer Management', desc: 'Manage all your customers and their outstanding balances.' },
  { icon: BarChart2, title: 'Reports & Analytics', desc: 'Get insights with monthly charts and exportable reports.' },
  { icon: Bell, title: 'SMS Reminders', desc: 'Send automated payment reminders via SMS to customers.' },
  { icon: CreditCard, title: 'Online Payments', desc: 'Accept payments via Razorpay directly from the platform.' },
  { icon: Shield, title: 'Secure & Reliable', desc: 'Enterprise-grade security with JWT authentication.' },
];

const stats = [
  { value: '10,000+', label: 'Businesses' },
  { value: '₹50Cr+', label: 'Transactions' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9★', label: 'Rating' },
];

const steps = [
  { num: '01', title: 'Sign Up', desc: 'Create your account with phone verification in 2 minutes.' },
  { num: '02', title: 'Add Customers', desc: 'Import or manually add your customers and opening balances.' },
  { num: '03', title: 'Record Transactions', desc: 'Add credits and debits with notes and categories.' },
  { num: '04', title: 'Get Paid', desc: 'Send reminders and accept online payments effortlessly.' },
];

const testimonials = [
  { name: 'Ramesh Gupta', role: 'Kirana Store Owner', text: 'This app replaced our physical khata completely. Very easy to use!' },
  { name: 'Priya Sharma', role: 'Wholesale Trader', text: 'The SMS reminder feature has reduced our overdue collections by 40%.' },
  { name: 'Ajay Verma', role: 'Hardware Dealer', text: 'Reports and exports save us hours of manual work every month.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">Gupta Paper Stores</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
            <a href="#testimonials" className="hover:text-primary transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-outline text-sm px-4 py-2">Login</Link>
            <Link href="/signup" className="btn-primary text-sm px-4 py-2">Sign Up Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/30 rounded-full px-4 py-1.5 text-sm mb-6">
            <CheckCircle className="w-4 h-4" /> Trusted by 10,000+ businesses
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Manage Your Business<br />
            <span className="text-orange-400">Ledger with Ease</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Replace your paper khata with a digital ledger. Track credits, debits, send payment reminders and accept online payments — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-accent hover:bg-orange-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg border border-white/30">
              Login to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-12 border-y border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-4">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-primary">{s.value}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">A complete toolkit to manage your business finances digitally.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="card hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="bg-gray-50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-500 text-lg">Get started in minutes — no training required.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="flex gap-5">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {s.num}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-gray-500 text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="card">
                <p className="text-gray-600 text-sm mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-primary text-xs">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-blue-700 py-16 px-4 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to go digital?</h2>
        <p className="text-blue-100 mb-8">Join thousands of businesses that trust Gupta Paper Stores.</p>
        <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors text-lg">
          Create Free Account <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white">Gupta Paper Stores</span>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} Gupta Paper Stores. All rights reserved.</p>
          <div className="flex gap-4 text-sm">
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
