'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sun, Moon, BarChart3, Users, FileText, CreditCard, Bell, TrendingUp } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/customers', label: 'Customers', icon: Users },
    { href: '/transactions', label: 'Transactions', icon: FileText },
    { href: '/payments', label: 'Payments', icon: CreditCard },
    { href: '/reminders', label: 'Reminders', icon: Bell },
    { href: '/reports', label: 'Reports', icon: TrendingUp },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-lg transition-shadow">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-gray-900 dark:text-white font-bold text-sm leading-tight">Gupta Paper</div>
              <div className="text-primary-500 font-semibold text-xs">Stores</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-sm font-medium"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <Link href="/pricing" className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors px-3 py-2">
              Pricing
            </Link>
            <Link href="/features" className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors px-3 py-2">
              Features
            </Link>
            <Link href="/about" className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors px-3 py-2">
              About
            </Link>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link
              href="/dashboard"
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg hover:-translate-y-0.5"
            >
              Open Dashboard
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-xl">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-sm font-medium"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <Link href="/pricing" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Pricing</Link>
              <Link href="/features" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Features</Link>
              <Link href="/about" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">About</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
