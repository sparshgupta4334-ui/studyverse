"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Sparkles, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "Failed to create account.");
        return;
      }

      // Sign in after registration
      const { signIn } = await import("next-auth/react");
      await signIn("credentials", { email, password, callbackUrl: "/app" });
      router.push("/app");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-brand-700/15 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-neon-cyan/10 blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-2xl border border-white/10 bg-glass p-8 shadow-2xl">
          {/* Logo */}
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 shadow-neon-purple">
                <Sparkles size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">StudyVerse</span>
            </Link>
            <h1 className="mt-6 text-2xl font-bold text-white">Create your account</h1>
            <p className="mt-1 text-sm text-gray-400">Join thousands of learners in the StudyVerse</p>
          </div>

          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User size={16} />}
              required
              autoComplete="name"
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={16} />}
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Min 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock size={16} />}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              required
              autoComplete="new-password"
            />

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Create Account
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-500">
            By signing up, you agree to our{" "}
            <a href="#" className="text-brand-400 hover:text-brand-300">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-brand-400 hover:text-brand-300">Privacy Policy</a>.
          </p>

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-medium text-brand-400 hover:text-brand-300">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
