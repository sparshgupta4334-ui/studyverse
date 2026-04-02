"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-hero-gradient pt-16">
      {/* Animated background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-brand-700/20 blur-[120px]" />
        <div className="absolute -bottom-20 -right-40 h-[500px] w-[500px] rounded-full bg-neon-blue/15 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-cyan/10 blur-[100px]" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px),
              linear-gradient(to right, rgba(168,85,247,0.5) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-2"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-neon-cyan" />
          <span className="text-sm font-medium text-brand-300">
            🚀 3D Multiplayer Learning — Now in Beta
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 text-5xl font-black leading-[1.1] tracking-tight md:text-7xl lg:text-8xl"
        >
          <span className="text-gradient-hero">Study Smarter</span>
          <br />
          <span className="text-white">In Another</span>{" "}
          <span className="text-gradient-purple">Dimension</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-400 md:text-xl"
        >
          Enter a shared 3D universe where you can collaborate in real-time, upload and search
          your study materials, and get AI-powered insights — all while exploring an immersive
          virtual study space.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href="/auth/signup"
            className="group flex items-center gap-2 rounded-xl bg-brand-600 px-8 py-4 text-base font-semibold text-white shadow-neon-purple transition-all hover:bg-brand-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
          >
            Enter StudyVerse
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <button className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-gray-200 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10">
            <Play size={16} className="fill-current" />
            Watch Demo
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-8"
        >
          {[
            { value: "10K+", label: "Active Learners" },
            { value: "50K+", label: "Notes Created" },
            { value: "99.9%", label: "Uptime" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-black text-gradient-purple md:text-3xl">{value}</div>
              <div className="mt-1 text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Preview Screenshot */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="relative mx-auto mt-20 max-w-5xl"
        >
          <div className="rounded-2xl border border-white/10 bg-surface-100 p-1 shadow-2xl shadow-brand-900/50">
            <div className="flex items-center gap-2 rounded-t-xl border-b border-white/5 bg-surface-50 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full bg-green-500/70" />
              </div>
              <div className="mx-auto rounded-md border border-white/10 bg-surface-200 px-12 py-0.5 text-xs text-gray-500">
                studyverse.app/app
              </div>
            </div>
            <div className="relative h-[400px] overflow-hidden rounded-b-xl bg-gradient-to-br from-surface-100 via-surface-200 to-[#0f0f1a] md:h-[500px]">
              {/* Simulated 3D world preview */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mb-4 text-6xl">🌌</div>
                  <p className="text-lg font-semibold text-gray-400">3D Study World Preview</p>
                  <p className="mt-2 text-sm text-gray-600">
                    Sign up to explore the full experience
                  </p>
                </div>
              </div>
              {/* Floating UI elements for visual effect */}
              <div className="absolute left-6 top-6 rounded-xl border border-white/10 bg-glass px-4 py-3 text-left">
                <div className="mb-1 text-xs text-gray-500">Players Online</div>
                <div className="text-xl font-bold text-neon-cyan">24</div>
              </div>
              <div className="absolute bottom-6 right-6 rounded-xl border border-white/10 bg-glass px-4 py-3 text-left">
                <div className="mb-1 text-xs text-gray-500">AI Chat</div>
                <div className="text-sm text-gray-300">
                  &ldquo;Explain quantum entanglement...&rdquo;
                </div>
              </div>
            </div>
          </div>
          {/* Glow under preview */}
          <div className="absolute -bottom-8 left-1/2 h-32 w-3/4 -translate-x-1/2 rounded-full bg-brand-600/20 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
