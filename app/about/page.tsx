import Link from 'next/link';
import { Target, Heart, Users, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About Gupta Paper Stores</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Building India&apos;s most accessible business management platform for small and medium businesses.
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Gupta Paper Stores started as a humble paper and stationery shop in Delhi in 1985. For decades,
              we maintained our business records in traditional paper khatas. In 2020, when we tried to digitize
              our operations, we found that most software was either too complex or too expensive for small businesses.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
              So we built our own solution. And then we decided to share it with every small business owner in India,
              completely free. Because we believe that access to good business tools should not be a privilege — it should be a right.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {[
            { icon: Target, title: 'Our Mission', desc: 'Make professional business management accessible to every small business owner in India, regardless of their technical expertise or budget.', color: 'blue' },
            { icon: Heart, title: 'Our Values', desc: 'Simplicity, transparency, and empowerment. We believe in building tools that are genuinely useful, not just impressive on paper.', color: 'red' },
            { icon: Users, title: 'Who We Serve', desc: 'Retail shop owners, wholesalers, distributors, service providers, restaurants, pharmacies — any business that maintains customer ledgers.', color: 'green' },
            { icon: TrendingUp, title: 'Our Impact', desc: '12,000+ businesses have already transformed their operations using our platform, managing over ₹89 crore in transactions.', color: 'purple' },
          ].map((item) => (
            <div key={item.title} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mb-3">
                <item.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/contact" className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
