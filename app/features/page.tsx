import Link from 'next/link';
import { CheckCircle, Users, FileText, CreditCard, Bell, TrendingUp, BarChart3, Shield, Smartphone, Globe, Download, Zap } from 'lucide-react';

const features = [
  { icon: Users, title: 'Customer Management', desc: 'Manage unlimited customers with complete details, balance tracking, and full transaction history per customer.', points: ['Add/Edit/Delete customers', 'Search and filter', 'Bulk import from contacts', 'Customer-wise reports'] },
  { icon: FileText, title: 'Digital Ledger', desc: 'Replace paper khata with a powerful digital ledger with real-time balance calculations.', points: ['Credit/Debit entries', 'Running balance', 'Transaction history', 'Category tagging'] },
  { icon: CreditCard, title: 'Payment Tracking', desc: 'Track all payment methods including UPI, cash, and bank transfers with automatic reconciliation.', points: ['UPI QR code generation', 'Payment history', 'Status tracking', 'Receipt sharing'] },
  { icon: Bell, title: 'SMS Reminders', desc: 'Automated payment reminders to reduce bad debt and improve collections.', points: ['Bulk SMS sending', 'Custom templates', 'Delivery tracking', 'Schedule reminders'] },
  { icon: TrendingUp, title: 'Reports & Export', desc: 'Professional PDF and CSV reports for all time periods with sharing capabilities.', points: ['Daily/Weekly/Monthly', 'PDF generation', 'CSV export', 'Email sharing'] },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Visual business insights with charts and trend analysis.', points: ['Revenue charts', 'Top customers', 'Growth trends', 'Performance metrics'] },
  { icon: Shield, title: 'Data Security', desc: 'Bank-grade encryption and automatic cloud backup to keep your data safe.', points: ['AES-256 encryption', 'Auto cloud backup', 'Local data storage', 'Data recovery'] },
  { icon: Smartphone, title: 'Offline First', desc: 'Works completely without internet. Sync when connection is available.', points: ['No internet needed', 'Auto sync', 'Works on 2G/3G', 'Lightweight app'] },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">All Features</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Complete business management suite designed for Indian small businesses.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {features.map((feature) => (
            <div key={feature.title} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center shrink-0">
                  <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm leading-relaxed">{feature.desc}</p>
                  <ul className="space-y-1">
                    {feature.points.map(point => (
                      <li key={point} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link href="/dashboard" className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all">
            Try All Features — Free
          </Link>
        </div>
      </div>
    </div>
  );
}
