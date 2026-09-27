'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { 
  Eye, 
  EyeOff, 
  LogIn, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Zap, 
  Star, 
  Film, 
  ArrowLeft,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const fillTestCredentials = (role) => {
    setSelectedRole(role);
    if (role === 'superadmin') {
      setFormData({ email: 'superadmin@fanhubplus.com', password: 'SuperPass123!' });
      toast.success('Super Admin credentials loaded', {
        style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
      });
    } else if (role === 'admin') {
      setFormData({ email: 'admin@fanhubplus.com', password: 'AdminPass123!' });
      toast.success('Admin credentials loaded', {
        style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
      });
    } else {
      setFormData({ email: 'fan@fanhubplus.com', password: 'FanPass123!' });
      toast.success('VIP Fan credentials loaded', {
        style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error('Email and password are required.');
    }

    setLoading(true);
    try {
      const resData = await login(formData.email, formData.password);
      toast.success('Welcome back to Fan Hub Plus!');
      const requestedPath = new URLSearchParams(window.location.search).get('callbackUrl');
      const safeRequestedPath = requestedPath?.startsWith('/') && !requestedPath.startsWith('//')
        ? requestedPath
        : null;
      if (safeRequestedPath) {
        router.push(safeRequestedPath);
      } else if (resData?.user?.role === 'admin' || resData?.user?.role === 'superadmin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-[#080c07] text-white selection:bg-[#a7c957] selection:text-[#0b0f0a] relative overflow-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          1. CINEMATIC LEFT SHOWCASE (Hidden on small mobile screens)
      ───────────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:col-span-7 relative flex-col justify-between p-12 lg:p-16 overflow-hidden border-r border-white/10">
        {/* Cinematic Backdrop Image with Vignette */}
        <div className="absolute inset-0 -z-10 scale-105 transition-transform duration-1000">
          <Image
            src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80"
            alt="Cinematic Fandom Universe"
            fill
            priority
            quality={90}
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080c07] via-transparent to-[#080c07]/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#080c07]" />
        </div>

        {/* Top Bar Branding */}
        <div className="flex items-center justify-between z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="Fan Hub Plus Logo"
              width={42}
              height={42}
              className="object-contain drop-shadow-[0_0_12px_rgba(167,201,87,0.4)] group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-heading font-black text-xl tracking-tight text-white leading-none">
                FanHub<span className="text-[#a7c957]">+</span>
              </span>
              <span className="text-[9px] font-bold tracking-widest text-[#a7c957] uppercase">
                Fandom Universe
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all backdrop-blur-md"
          >
            <ArrowLeft size={14} /> Back to Hub
          </Link>
        </div>

        {/* Centerpiece Hero Statement & Fandom Quote */}
        <div className="space-y-6 z-10 max-w-xl my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#a7c957]/15 border border-[#a7c957]/30 text-[#a7c957] text-xs font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a7c957] animate-pulse" />
            Universal Continuum Gateway
          </div>

          <h2 className="text-4xl xl:text-5xl font-heading font-black text-white leading-tight tracking-tight">
            One account for every universe, lore vault, and soundtrack.
          </h2>

          <p className="text-gray-400 text-base leading-relaxed font-sans">
            "Across infinite timelines, galaxies, and fandoms, your story begins here." Curate your watchlist, debate lore theories, and stream premium cinema in 4K HDR.
          </p>

          {/* 3 Metric Pills */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div>
              <div className="text-2xl font-black text-[#a7c957] font-mono">8</div>
              <div className="text-xs text-gray-400 font-medium">Mega Fandoms</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white font-mono">10,000+</div>
              <div className="text-xs text-gray-400 font-medium">Synced Titles</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#a7c957] font-mono">4K HDR</div>
              <div className="text-xs text-gray-400 font-medium">Cinematic Audio</div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer Footer */}
        <div className="flex items-center justify-between text-xs text-gray-400 z-10 pt-6 border-t border-white/10 font-mono">
          <span>Aptech TechWiz 7 Academic Submission</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Auth Edge Server Active
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MINIMALIST LUXURY AUTH CARD (Right Column)
      ───────────────────────────────────────────────────────────── */}
      <div className="col-span-12 lg:col-span-5 flex flex-col justify-center px-6 sm:px-12 xl:px-16 py-12 relative z-10">
        
        {/* Mobile Header (Shown on small screens) */}
        <div className="lg:hidden flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="Fan Hub Plus Logo"
              width={36}
              height={36}
              className="object-contain"
            />
            <span className="font-heading font-black text-lg text-white">
              FanHub<span className="text-[#a7c957]">+</span>
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-white"
          >
            <ArrowLeft size={14} /> Back
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto space-y-6">
          
          {/* Card Title */}
          <div>
            <h1 className="text-3xl font-heading font-black text-white tracking-tight">
              Sign In
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Enter your credentials to access your universal fandom vault.
            </p>
          </div>

          {/* ─────────────────────────────────────────────────────────
              JUDGE / JURY 1-CLICK QUICK TEST CREDENTIALS TOOLBAR
          ───────────────────────────────────────────────────────── */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-[#a7c957]/30 backdrop-blur-md space-y-2.5 shadow-[0_0_20px_rgba(167,201,87,0.08)]">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#a7c957]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} />
                Jury & Judge Quick Fill:
              </span>
              <span className="text-[10px] text-gray-400 normal-case font-mono">1-Click Autofill</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillTestCredentials('superadmin')}
                className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                  selectedRole === 'superadmin'
                    ? 'bg-[#a7c957] text-[#0b0f0a] border-[#a7c957] shadow-[0_0_12px_rgba(167,201,87,0.4)]'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>🛡️ SuperAdmin</span>
                <span className="text-[9px] opacity-75 font-mono">Full Access</span>
              </button>

              <button
                type="button"
                onClick={() => fillTestCredentials('admin')}
                className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                  selectedRole === 'admin'
                    ? 'bg-[#a7c957] text-[#0b0f0a] border-[#a7c957] shadow-[0_0_12px_rgba(167,201,87,0.4)]'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>⚡ Admin</span>
                <span className="text-[9px] opacity-75 font-mono">Moderation</span>
              </button>

              <button
                type="button"
                onClick={() => fillTestCredentials('fan')}
                className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                  selectedRole === 'fan'
                    ? 'bg-[#a7c957] text-[#0b0f0a] border-[#a7c957] shadow-[0_0_12px_rgba(167,201,87,0.4)]'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>🌟 VIP Fan</span>
                <span className="text-[9px] opacity-75 font-mono">Streaming</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="name@fanhubplus.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#a7c957] focus:ring-1 focus:ring-[#a7c957] text-sm transition-all"
                />
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                  Password
                </label>
                <span className="text-xs text-[#a7c957] hover:underline cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#a7c957] focus:ring-1 focus:ring-[#a7c957] text-sm transition-all"
                />
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#a7c957] to-[#8db33f] text-[#0b0f0a] font-black text-base hover:brightness-110 shadow-[0_10px_25px_rgba(167,201,87,0.35)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#0b0f0a] border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Enter Fandom Universe</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="text-center pt-2 border-t border-white/10 text-sm text-gray-400">
            New explorer in the universe?{' '}
            <Link href="/register" className="text-[#a7c957] font-bold hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
