'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { 
  Eye, 
  EyeOff, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Compass, 
  Headphones, 
  BookOpen, 
  Calendar 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fillQuickTestFan = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setFormData({
      name: `Fan Explorer ${randomSuffix}`,
      email: `fan${randomSuffix}@fanhubplus.com`,
      password: 'FanPass123!'
    });
    toast.success('Generated test fan credentials!', {
      style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      return toast.error('All fields are required.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return toast.error('Please enter a valid email address.');
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      return toast.error('Password must be at least 8 chars, 1 uppercase, 1 number, and 1 special char.');
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      toast.success('Welcome to Fan Hub Plus!');
      router.push('/');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    { title: '8 Fandom Universes', desc: 'Instant access to Anime, Sci-Fi, Marvel/DC, Gaming, and Prestige TV.', icon: Compass },
    { title: 'Lore Authoring', desc: 'Publish fan theories and character dossiers to the universal library.', icon: BookOpen },
    { title: 'Vinyl Soundtrack Hub', desc: 'Save custom audio playlists and listen to cinematic scores in Hi-Fi.', icon: Headphones },
    { title: 'VIP Convention RSVPs', desc: 'Discover comic-cons and fan gatherings with GPS distance filtering.', icon: Calendar },
  ];

  return (
    <main className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-[#080c07] text-white selection:bg-[#a7c957] selection:text-[#0b0f0a] relative overflow-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          1. CINEMATIC LEFT SHOWCASE (Community & Privileges)
      ───────────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:col-span-7 relative flex-col justify-between p-12 lg:p-16 overflow-hidden border-r border-white/10">
        {/* Cinematic Backdrop Image with Vignette */}
        <div className="absolute inset-0 -z-10 scale-105 transition-transform duration-1000">
          <Image
            src="https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1920&q=80"
            alt="Fandom Community Art"
            fill
            priority
            quality={90}
            className="object-cover opacity-30"
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

        {/* Centerpiece Privileges Grid */}
        <div className="space-y-6 z-10 max-w-xl my-auto py-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#a7c957]/15 border border-[#a7c957]/30 text-[#a7c957] text-xs font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a7c957] animate-pulse" />
            Universal Membership Privileges
          </div>

          <h2 className="text-4xl xl:text-5xl font-heading font-black text-white leading-tight tracking-tight">
            Claim your passport to infinite fandoms.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {perks.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-[#a7c957]/20 text-[#a7c957] flex items-center justify-center">
                    <Icon size={18} />
                  </div>
                  <h4 className="text-sm font-bold text-white">{p.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Status */}
        <div className="flex items-center justify-between text-xs text-gray-400 z-10 pt-6 border-t border-white/10 font-mono">
          <span>Aptech TechWiz 7 Academic Submission</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Zero Subscription Fees
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MINIMALIST LUXURY REGISTER CARD (Right Column)
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
              Create Account
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Join thousands of fans exploring the unified cinematic continuum.
            </p>
          </div>

          {/* Quick Jury Test Registration Pill */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-[#a7c957]/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-300">
              <ShieldCheck size={16} className="text-[#a7c957]" />
              <span className="font-semibold">Jury Evaluation?</span>
            </div>
            <button
              type="button"
              onClick={fillQuickTestFan}
              className="px-3 py-1.5 rounded-xl bg-[#a7c957]/20 border border-[#a7c957]/40 text-[#a7c957] font-bold text-xs hover:bg-[#a7c957] hover:text-[#0b0f0a] transition-all cursor-pointer active:scale-95"
            >
              Autofill Test Fan
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g. Tony Stark"
                  minLength={3}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#a7c957] focus:ring-1 focus:ring-[#a7c957] text-sm transition-all"
                />
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

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
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#a7c957] focus:ring-1 focus:ring-[#a7c957] text-sm transition-all"
                />
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="Min 8 chars, 1 upper, 1 special (#?!@)"
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
              <p className="text-[11px] text-gray-500 pt-0.5">
                Must be at least 8 characters, include 1 uppercase letter, 1 number, and 1 special symbol.
              </p>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#a7c957] to-[#8db33f] text-[#0b0f0a] font-black text-base hover:brightness-110 shadow-[0_10px_25px_rgba(167,201,87,0.35)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#0b0f0a] border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Join Fan Hub Plus</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="text-center pt-2 border-t border-white/10 text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-[#a7c957] font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
