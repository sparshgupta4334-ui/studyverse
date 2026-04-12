'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">We are here to help. Reach out anytime.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Get In Touch</h2>
            <div className="space-y-4 mb-8">
              {[
                { icon: MapPin, title: 'Visit Us', value: 'Gupta Paper Stores, Main Market, Delhi - 110001', href: '#' },
                { icon: Phone, title: 'Call Us', value: '+91 12345 67890', href: 'tel:+911234567890' },
                { icon: Mail, title: 'Email Us', value: 'support@guptapaperstores.com', href: 'mailto:support@guptapaperstores.com' },
              ].map((item) => (
                <a key={item.title} href={item.href} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                  <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{item.title}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm mt-0.5">{item.value}</div>
                  </div>
                </a>
              ))}
            </div>
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-5 border border-primary-100 dark:border-primary-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Business Hours</h3>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between"><span>Monday - Friday</span><span className="font-medium">9:00 AM - 6:00 PM</span></div>
                <div className="flex justify-between"><span>Saturday</span><span className="font-medium">10:00 AM - 4:00 PM</span></div>
                <div className="flex justify-between"><span>Sunday</span><span className="font-medium text-red-500">Closed</span></div>
              </div>
            </div>
          </div>

          <div>
            {submitted ? (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8 border border-green-200 dark:border-green-800 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                <p className="text-gray-600 dark:text-gray-400">Thank you for reaching out. We will get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="mt-4 text-primary-600 dark:text-primary-400 hover:underline text-sm">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send a Message</h2>
                {['name', 'email', 'phone', 'subject'].map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">{field} {field !== 'phone' && <span className="text-red-500">*</span>}</label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      value={form[field as keyof typeof form]}
                      onChange={e => setForm({ ...form, [field]: e.target.value })}
                      required={field !== 'phone'}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
                      placeholder={`Enter your ${field}`}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message <span className="text-red-500">*</span></label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-primary-600/40">
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
