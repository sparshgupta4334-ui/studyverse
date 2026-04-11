'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FAQS } from '@/lib/constants';

const EXTRA_FAQS = [
  ...FAQS,
  { question: 'Can multiple people use the same account?', answer: 'Currently, accounts are single-user. Multi-user team accounts are on our roadmap.' },
  { question: 'How do I recover my account?', answer: 'Simply log in with your registered phone number and verify via OTP.' },
  { question: 'Is there a mobile app?', answer: 'The web app is fully optimized for mobile browsers. A dedicated Android app is coming soon.' },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16 px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-3">Frequently Asked Questions</h1>
          <p className="text-blue-100">Find answers to the most common questions</p>
        </section>

        <section className="py-16 px-4">
          <div className="mx-auto max-w-3xl space-y-3">
            {EXTRA_FAQS.map((faq, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setOpen(open === idx ? null : idx)}
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  {open === idx ? <ChevronUp size={18} className="text-blue-600 flex-shrink-0" /> : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />}
                </button>
                {open === idx && (
                  <div className="px-6 pb-5 text-gray-600 text-sm border-t border-gray-100 pt-3">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
