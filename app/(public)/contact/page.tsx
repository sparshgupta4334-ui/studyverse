'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Phone, Mail, MapPin, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16 px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-3">Contact Us</h1>
          <p className="text-blue-100">We&apos;re here to help. Reach out any time!</p>
        </section>

        <section className="py-16 px-4">
          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <div className="space-y-4">
                {[
                  { icon: Phone, label: 'Phone', value: '+91 99999 99999' },
                  { icon: Mail, label: 'Email', value: 'support@guptapaper.com' },
                  { icon: MapPin, label: 'Address', value: 'Chandni Chowk, New Delhi - 110006' },
                  { icon: MessageSquare, label: 'Working Hours', value: 'Mon-Sat, 9AM - 6PM IST' },
                ].map((c) => (
                  <div key={c.label} className="flex items-start gap-4">
                    <div className="p-2.5 bg-blue-50 rounded-lg flex-shrink-0"><c.icon size={18} className="text-blue-700" /></div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">{c.label}</p>
                      <p className="text-gray-900">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-5">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Your Name" placeholder="Raj Gupta" value={form.name} onChange={set('name')} required />
                <Input label="Email" type="email" placeholder="raj@example.com" value={form.email} onChange={set('email')} required />
                <Input label="Subject" placeholder="How can we help?" value={form.subject} onChange={set('subject')} required />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Message</label>
                  <textarea value={form.message} onChange={set('message')} rows={4} placeholder="Your message..." required className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm resize-none" />
                </div>
                <Button type="submit" isLoading={loading} className="w-full" size="lg">Send Message</Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
