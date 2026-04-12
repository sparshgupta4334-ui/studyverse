'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Mail, Phone, MapPin, MessageCircle, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '', subject: 'general' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Humse Sampark Karein</h1>
        <p className="text-gray-600 max-w-xl mx-auto">Koi sawaal hai? Koi problem? Hum yahan hain. 24 ghante mein jawab denge.</p>
      </section>

      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Humse Milein</h2>
            {[
              { icon: Phone, title: 'Phone Support', info: '+91 98765 43210', sub: 'Mon-Sat, 9 AM - 7 PM', color: 'bg-blue-100 text-blue-600' },
              { icon: Mail, title: 'Email', info: 'support@guptapaper.in', sub: 'We reply within 24 hours', color: 'bg-green-100 text-green-600' },
              { icon: MapPin, title: 'Office', info: 'Chandni Chowk, Delhi - 110006', sub: 'Visit us anytime', color: 'bg-orange-100 text-orange-600' },
              { icon: MessageCircle, title: 'WhatsApp', info: '+91 98765 43210', sub: 'Quick chat support', color: 'bg-purple-100 text-purple-600' },
            ].map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="flex items-start gap-4">
                  <div className={`w-11 h-11 ${c.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{c.title}</p>
                    <p className="text-gray-700 text-sm">{c.info}</p>
                    <p className="text-gray-400 text-xs">{c.sub}</p>
                  </div>
                </div>
              );
            })}

            {/* FAQ Quick */}
            <div className="bg-blue-50 rounded-xl p-5 mt-6">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Common Questions</h3>
              {[
                'App free hai?',
                'Data kahan store hota hai?',
                'SMS feature kaise use karein?',
                'Data export kar sakte hain?',
              ].map((q) => (
                <div key={q} className="flex items-center gap-2 py-1.5 border-b border-blue-100 last:border-0">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Mil Gaya!</h2>
                <p className="text-gray-500 mb-6">Hum 24 ghante mein aapko reply karenge. Shukriya!</p>
                <button onClick={() => setSubmitted(false)} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  Naya Message Bhejein
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-8 space-y-5">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Message Bhejein</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Naam *</label>
                    <input required type="text" placeholder="Aapka naam" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input required type="tel" placeholder="10-digit number" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" placeholder="email@example.com" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vishay (Subject)</label>
                  <select value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400">
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea required rows={5} placeholder="Apna sawaal ya problem likhein..." value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400 resize-none" />
                </div>
                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                  <Send className="w-4 h-4" />
                  Message Bhejein
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center">
        <p className="text-sm">2024 Gupta Paper Stores. Made with love in India.</p>
      </footer>
    </div>
  );
}
