'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { signup } from '@/lib/actions/authActions';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [role, setRole] = useState<'BUYER' | 'FARMER'>('BUYER');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await signup(null, formData);
      if (res.success) {
        if (res.role === 'FARMER') {
          router.push('/farmer/dashboard');
        } else {
          router.push('/store');
        }
        router.refresh();
      } else {
        setError(res.error || 'Registration failed');
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-forest px-6 py-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-moss rounded-full blur-[80px] opacity-30" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-fern rounded-full blur-[80px] opacity-30" />
      </div>

      <div className="w-full max-w-lg bg-canopy border border-solid border-fern/40 p-8 rounded-sm shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="nav-logo justify-center text-2xl font-serif text-cream inline-flex items-center gap-2 mb-2">
            <span className="logo-dot" /> Agriconnect
          </Link>
          <p className="text-xs tracking-widest text-gold uppercase font-mono mt-2">
            Platform Registration
          </p>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-solid border-red-700/60 text-red-200 text-sm px-4 py-3 rounded-sm mb-6 font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase text-mist mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                disabled={isPending}
                className="w-full bg-forest border border-solid border-fern/60 focus:border-gold outline-none px-4 py-3 text-cream text-sm transition-colors rounded-sm"
                placeholder="e.g. Priyan Nair"
              />
            </div>

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
                placeholder="e.g. priya@email.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div>
              <label className="block text-xs font-mono tracking-widest uppercase text-mist mb-2">
                User Role
              </label>
              <select
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'BUYER' | 'FARMER')}
                disabled={isPending}
                className="w-full bg-forest border border-solid border-fern/60 focus:border-gold outline-none px-4 py-3 text-cream text-sm transition-colors rounded-sm appearance-none cursor-pointer"
              >
                <option value="BUYER">Buyer (Access Marketplace)</option>
                <option value="FARMER">Farmer (Sell Produce)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono tracking-widest uppercase text-mist mb-2">
              Physical Address
            </label>
            <input
              type="text"
              name="address"
              required
              disabled={isPending}
              className="w-full bg-forest border border-solid border-fern/60 focus:border-gold outline-none px-4 py-3 text-cream text-sm transition-colors rounded-sm"
              placeholder="e.g. Indiranagar, Bengaluru"
            />
          </div>

          {role === 'FARMER' && (
            <div className="border-t border-dashed border-fern/30 pt-6 space-y-6">
              <div>
                <label className="block text-xs font-mono tracking-widest uppercase text-mist mb-2">
                  Farm Name
                </label>
                <input
                  type="text"
                  name="farmName"
                  required
                  disabled={isPending}
                  className="w-full bg-forest border border-solid border-fern/60 focus:border-gold outline-none px-4 py-3 text-cream text-sm transition-colors rounded-sm"
                  placeholder="e.g. Green Meadows Farm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono tracking-widest uppercase text-mist mb-2">
                  Farm Description & Produce Specialization
                </label>
                <textarea
                  name="farmDetails"
                  rows={3}
                  disabled={isPending}
                  className="w-full bg-forest border border-solid border-fern/60 focus:border-gold outline-none px-4 py-3 text-cream text-sm transition-colors rounded-sm resize-none"
                  placeholder="Tell us what you specialize in growing or dairy details..."
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-gold hover:bg-gold/90 text-forest font-medium tracking-wider text-xs uppercase font-sans transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-sm"
          >
            {isPending ? 'Registering...' : 'Complete Register'}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-solid border-fern/20 text-xs text-mist">
          Already have an account?{' '}
          <Link href="/login" className="text-gold hover:underline font-medium">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
