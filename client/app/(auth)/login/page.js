'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FBFBFD] dark:bg-brand-bg p-4 transition-colors duration-500">
      {/* Background glow orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-brand-accent/10 dark:bg-brand-accent/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-extrabold text-brand-primary tracking-tight">Fan Hub Plus</h1>
          <p className="text-[#86868b] dark:text-gray-400 mt-1 text-sm">Welcome back</p>
        </div>

        {/* Glass Card */}
        <div
          className="rounded-3xl p-8 border border-black/[0.07] dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/70 backdrop-blur-2xl transition-colors duration-300"
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.8) inset' }}
        >
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-white mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#3c3c43] dark:text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-black/[0.04] dark:bg-white/5 border border-black/[0.08] dark:border-gray-700 text-[#1d1d1f] dark:text-white placeholder-[#86868b] dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#3c3c43] dark:text-gray-400 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-black/[0.04] dark:bg-white/5 border border-black/[0.08] dark:border-gray-700 text-[#1d1d1f] dark:text-white placeholder-[#86868b] dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all pr-12"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-brand-primary transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-base transition-all active:scale-[0.98] shadow-lg shadow-brand-primary/30 flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><LogIn size={18} /> Sign In</>}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-[#86868b] dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-brand-primary font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
