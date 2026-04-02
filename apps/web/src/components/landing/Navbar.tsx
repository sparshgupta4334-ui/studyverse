"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-glass-dark">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 shadow-neon-purple">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Study<span className="text-gradient-purple">Verse</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm text-gray-400 transition-colors hover:text-white">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-gray-400 transition-colors hover:text-white">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm text-gray-400 transition-colors hover:text-white">
              Pricing
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/auth/signin"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-neon-purple transition-all hover:bg-brand-500"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-white/5 bg-surface md:hidden"
        >
          <div className="flex flex-col gap-1 px-6 py-4">
            <Link href="#features" className="py-2 text-sm text-gray-400 hover:text-white" onClick={() => setMenuOpen(false)}>Features</Link>
            <Link href="#how-it-works" className="py-2 text-sm text-gray-400 hover:text-white" onClick={() => setMenuOpen(false)}>How It Works</Link>
            <Link href="#pricing" className="py-2 text-sm text-gray-400 hover:text-white" onClick={() => setMenuOpen(false)}>Pricing</Link>
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/auth/signin" className="rounded-lg border border-white/10 px-4 py-2 text-center text-sm font-medium text-gray-300">Sign In</Link>
              <Link href="/auth/signup" className="rounded-lg bg-brand-600 px-4 py-2 text-center text-sm font-medium text-white">Get Started Free</Link>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
