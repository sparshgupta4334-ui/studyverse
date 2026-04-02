import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <HeroSection />
      <FeaturesSection />

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-[#0a0a0f] py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-700/20 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-6 text-4xl font-black text-white md:text-5xl">
            Ready to Enter the{" "}
            <span className="text-gradient-purple">StudyVerse?</span>
          </h2>
          <p className="mb-10 text-lg text-gray-400">
            Join thousands of learners already using StudyVerse to level up their studies. Free
            to start, no credit card required.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-10 py-4 text-lg font-bold text-white shadow-neon-purple transition-all hover:bg-brand-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.6)]"
          >
            Start Learning Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-surface py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
                <span className="text-sm font-bold text-white">S</span>
              </div>
              <span className="text-lg font-bold text-white">StudyVerse</span>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} StudyVerse. Built with ❤️ for learners worldwide.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-300">Privacy</a>
              <a href="#" className="hover:text-gray-300">Terms</a>
              <a href="#" className="hover:text-gray-300">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
