'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  { category: 'Getting Started', items: [
    { q: 'Is Gupta Paper Stores really free?', a: 'Yes! 100% free forever. No credit card, no trial period, no hidden fees. All features are included in the free plan.' },
    { q: 'Do I need to create an account?', a: 'No account needed to explore the demo. For saving your own data, you can create a free account anytime.' },
    { q: 'How do I get started?', a: 'Just click "Open Dashboard" and you can immediately explore all features with sample data. No setup required.' },
  ]},
  { category: 'Features', items: [
    { q: 'How many customers can I add?', a: 'Unlimited. There is no cap on customers, transactions, or any data.' },
    { q: 'Can I export my data?', a: 'Yes! Export as CSV or PDF at any time. Your data belongs to you completely.' },
    { q: 'Does it work offline?', a: 'Yes! The app works without internet and syncs automatically when connected.' },
    { q: 'Can I send SMS reminders?', a: 'Yes! Send payment reminders to customers. SMS charges apply (₹0.10-0.20 per SMS).' },
  ]},
  { category: 'Data & Security', items: [
    { q: 'Is my data safe?', a: 'Absolutely. All data is encrypted with AES-256 encryption and backed up automatically.' },
    { q: 'Can I delete my data?', a: 'Yes! You can delete individual entries or your entire account at any time.' },
    { q: 'Do you share my data?', a: 'Never. Your business data is private and we never share it with third parties.' },
  ]},
];

export default function FaqPage() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">FAQ</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Everything you need to know</p>
        </div>
        <div className="space-y-8">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{section.category}</h2>
              <div className="space-y-2">
                {section.items.map((item, i) => {
                  const key = `${section.category}-${i}`;
                  return (
                    <div key={key} className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                      <button
                        onClick={() => setOpenItem(openItem === key ? null : key)}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                        <span className="font-semibold text-gray-900 dark:text-white pr-4">{item.q}</span>
                        {openItem === key ? <ChevronUp className="w-5 h-5 text-primary-500 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
                      </button>
                      {openItem === key && (
                        <div className="px-5 pb-5">
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
