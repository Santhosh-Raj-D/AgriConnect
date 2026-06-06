'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { login } from '@/lib/actions/authActions';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await login(null, formData);
      if (res.success) {
        if (res.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else if (res.role === 'FARMER') {
          router.push('/farmer/dashboard');
        } else {
          router.push('/store');
        }
        router.refresh();
      } else {
        setError(res.error || 'Login failed');
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-forest px-6 py-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-moss rounded-full blur-[80px] opacity-30" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-fern rounded-full blur-[80px] opacity-30" />
      </div>

      <div className="w-full max-w-md bg-canopy border border-solid border-fern/40 p-8 rounded-sm shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="nav-logo justify-center text-2xl font-serif text-cream inline-flex items-center gap-2 mb-2">
            <span className="logo-dot" /> Agriconnect
          </Link>
          <p className="text-xs tracking-widest text-gold uppercase font-mono mt-2">
            Portal Authentication
          </p>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-solid border-red-700/60 text-red-200 text-sm px-4 py-3 rounded-sm mb-6 font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-mono tracking-widest uppercase text-mist mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              disabled={isPending}
              className="w-full bg-forest border border-solid border-fern/60 focus:border-gold outline-none px-4 py-3 text-cream text-sm transition-colors rounded-sm"
              placeholder="e.g. buyer@agriconnect.com"
            />
          </div>

          <div>
            <label className="block text-xs font-mono tracking-widest uppercase text-mist mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              disabled={isPending}
              className="w-full bg-forest border border-solid border-fern/60 focus:border-gold outline-none px-4 py-3 text-cream text-sm transition-colors rounded-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-gold hover:bg-gold/90 text-forest font-medium tracking-wider text-xs uppercase font-sans transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-sm"
          >
            {isPending ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-solid border-fern/20 text-xs text-mist">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-gold hover:underline font-medium">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}
