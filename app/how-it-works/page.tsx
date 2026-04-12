import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';

const steps = [
  { step: 1, title: 'Open Dashboard', desc: 'Access the complete business dashboard directly — no signup, no login required. Start exploring all features immediately.', icon: '🚀' },
  { step: 2, title: 'Add Your Customers', desc: 'Add customer details including name, phone number, business name, and city. Each customer gets their own ledger page.', icon: '👥' },
  { step: 3, title: 'Record Transactions', desc: 'Add credit (money to receive) or debit (money to pay) entries for each customer. Running balance is calculated automatically.', icon: '📝' },
  { step: 4, title: 'Track Payments', desc: 'Record UPI, cash, or bank transfer payments. Get notified when payments are received. Track payment history.', icon: '💳' },
  { step: 5, title: 'Send Reminders', desc: 'Send automated SMS payment reminders to customers with outstanding balances. Customize message templates.', icon: '🔔' },
  { step: 6, title: 'Generate Reports', desc: 'Create daily, weekly, monthly, or annual PDF reports. Share with your accountant or download for your records.', icon: '📊' },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Get started with Gupta Paper Stores in minutes. No technical knowledge required.
          </p>
        </div>
        <div className="space-y-8">
          {steps.map((step, i) => (
            <div key={step.step} className="flex gap-6 items-start">
              <div className="shrink-0">
                <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg shadow-primary-500/30">
                  {step.step}
                </div>
                {i < steps.length - 1 && <div className="w-0.5 h-8 bg-primary-100 dark:bg-primary-900 mx-auto mt-2"></div>}
              </div>
              <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                <div className="text-3xl mb-2">{step.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/dashboard" className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-primary-600/40">
            Get Started Now — Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
