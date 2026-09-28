'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] px-4 py-12 font-sans selection:bg-[#f12131]/20 selection:text-[#f12131]">
      {/* Decorative ambient background glows matching public theme */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-200/40 via-rose-100/30 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-10 h-[450px] w-[450px] rounded-full bg-gradient-to-tl from-red-100/40 to-transparent blur-3xl" />
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#29247c 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back to public site button */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-600 shadow-xs backdrop-blur-xs transition hover:border-slate-300 hover:bg-white hover:text-[#29247c]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Website</span>
          </Link>

          <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            System Online
          </span>
        </div>

        {/* Card Container */}
        <div className="rounded-[32px] border border-slate-200/80 bg-white/95 p-8 shadow-2xl shadow-slate-900/5 backdrop-blur-xl sm:p-10">
          {/* Official KPN Logo & Branding Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex items-center justify-center">
              <Link href="/">
                <img
                  src="/images/newlogoo.jpeg"
                  alt="KPN Promoters"
                  className="h-14 w-auto object-contain transition hover:opacity-90"
                />
              </Link>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 mb-2">
              <ShieldCheck className="h-3.5 w-3.5 text-[#f12131]" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#29247c]">
                CMS & Control Center
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#29247c] font-heading sm:text-3xl">
              Admin Portal
            </h1>
            <p className="mt-1 text-xs text-slate-500 font-medium">
              Enter your authorized staff credentials to continue
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-xs font-medium text-red-700 animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-[#f12131] mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email-input"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600 font-heading"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  id="email-input"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your Email"
                  suppressHydrationWarning
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 pl-11 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition hover:border-slate-300 focus:border-[#29247c] focus:bg-white focus:ring-4 focus:ring-[#29247c]/10"
                />
              </div>
            </div>

            {/* Password Field with Eye Toggle */}
            <div>
              <label
                htmlFor="password-input"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600 font-heading"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  suppressHydrationWarning
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 pl-11 pr-12 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition hover:border-slate-300 focus:border-[#29247c] focus:bg-white focus:ring-4 focus:ring-[#29247c]/10"
                />
                {/* Eye toggle button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  suppressHydrationWarning
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              suppressHydrationWarning
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#f12131] text-sm font-bold text-white shadow-lg shadow-red-500/25 transition-all hover:bg-[#d81928] hover:shadow-xl hover:shadow-red-500/30 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Verifying Credentials...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <div className="mt-6 border-t border-slate-100 pt-4 text-center text-[11px] font-medium text-slate-400">
            <span>KPN Promoters Real Estate Platform • Secure Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
