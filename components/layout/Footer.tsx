import Link from 'next/link';
import { BookOpen, Phone, Mail, MapPin } from 'lucide-react';
import { APP_NAME, NAV_LINKS } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-7 w-7 text-orange-400" />
              <span className="text-white font-bold text-lg">{APP_NAME}</span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm">
              Smart digital ledger for your business. Manage customers, track transactions, and grow your business with ease.
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2"><Phone size={14} className="text-orange-400" /><span>+91 99999 99999</span></div>
              <div className="flex items-center gap-2"><Mail size={14} className="text-orange-400" /><span>support@guptapaper.com</span></div>
              <div className="flex items-center gap-2"><MapPin size={14} className="text-orange-400" /><span>New Delhi, India</span></div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-orange-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-sm hover:text-orange-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-sm hover:text-orange-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/faq" className="text-sm hover:text-orange-400 transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-orange-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved. Made with ❤️ in India.
        </div>
      </div>
    </footer>
  );
}
