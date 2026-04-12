import Link from 'next/link';
import { Mail, Phone, MapPin, Globe, Rss, Share2, Play } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <div>
                <div className="text-white font-bold">Gupta Paper Stores</div>
                <div className="text-primary-400 text-xs">Digital Business Management</div>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              India&apos;s most trusted digital ledger solution for small and medium businesses.
              Manage customers, transactions, payments, and reminders — all in one place. 100% FREE forever.
            </p>
            <div className="flex gap-3">
              {[Globe, Rss, Share2, Play].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Customers', href: '/customers' },
                { label: 'Transactions', href: '/transactions' },
                { label: 'Payments', href: '/payments' },
                { label: 'Reminders', href: '/reminders' },
                { label: 'Reports', href: '/reports' },
                { label: 'Analytics', href: '/analytics' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Features', href: '/features' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'How It Works', href: '/how-it-works' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'FAQ', href: '/faq' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">Gupta Paper Stores, Main Market, Delhi - 110001, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary-400 shrink-0" />
                <a href="tel:+911234567890" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">+91 12345 67890</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-400 shrink-0" />
                <a href="mailto:support@guptapaperstores.com" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">support@guptapaperstores.com</a>
              </li>
            </ul>
            <div className="mt-6 p-3 rounded-lg bg-green-900/20 border border-green-700/30">
              <p className="text-xs text-green-400 font-medium">✅ 100% FREE Forever</p>
              <p className="text-xs text-gray-400 mt-1">No credit card. No hidden fees. Unlimited usage.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">© 2024 Gupta Paper Stores. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-primary-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-primary-400 transition-colors">Terms of Service</Link>
            <Link href="/faq" className="text-xs text-gray-500 hover:text-primary-400 transition-colors">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
