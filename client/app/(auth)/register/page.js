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
  Film, 
  Users, 
  Bookmark, 
  ArrowLeft,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
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
    if (formData.password.length < 8) {
      return toast.error('Password must be at least 8 characters.');
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      toast.success('Account created! Welcome to Fan Hub Plus!');
      router.push('/');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#080c07] text-white selection:bg-[#a7c957] selection:text-[#0b0f0a] relative overflow-hidden font-body flex items-center justify-center p-4 lg:p-8">
      
      {/* Background Ambient Radial Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-[#a7c957]/15 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-[#407421]/15 blur-[180px] rounded-full pointer-events-none" />

      {/* Main Responsive Grid Container */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">

        {/* ─────────────────────────────────────────────────────────────
            LEFT SHOWCASE: ARTWORK, BRANDING, FEATURE CARDS & STATS
        ───────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-7 flex flex-col justify-between relative py-4 lg:py-6">
          
          {/* Top Logo & Welcome Pill */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a7c957] to-[#407421] p-0.5 shadow-[0_0_20px_rgba(167,201,87,0.4)] group-hover:scale-105 transition-transform flex items-center justify-center">
                <Image 
                  src="/logo.png" 
                  alt="FanHub+ Logo" 
                  width={34} 
                  height={34} 
                  className="object-contain" 
                  priority 
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-2xl tracking-tight text-white leading-none">
                  FanHub<span className="text-[#a7c957]">+</span>
                </span>
                <span className="text-[10px] font-bold text-gray-400 tracking-[0.25em] uppercase mt-0.5">
                  Fandom Universe
                </span>
              </div>
            </Link>

            {/* Welcome Tag Pill */}
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#a7c957]/10 border border-[#a7c957]/30 text-xs font-bold text-[#a7c957] uppercase tracking-wider backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#a7c957] animate-pulse" />
                Join the Multiverse
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-heading font-black tracking-tight text-white leading-[1.05]">
              Your Universe <br />
              of <span className="text-[#a7c957] drop-shadow-[0_0_35px_rgba(167,201,87,0.35)]">Fandom</span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
              Create your account to unlock personalized watchlists, offline movie downloads, and interact in the fan live stream arena.
            </p>
          </div>

          {/* 3D Tilted Cinematic Posters Cascade */}
          <div className="relative my-8 h-48 sm:h-56 lg:h-64 w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl p-4 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-[#080c07] via-transparent to-[#080c07] z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080c07] via-transparent to-transparent z-10 pointer-events-none" />

            <div className="flex items-center gap-3 sm:gap-4 -rotate-2 scale-95 sm:scale-100 hover:rotate-0 transition-transform duration-700">
              <div className="w-28 sm:w-32 h-40 sm:h-48 rounded-2xl overflow-hidden border border-[#a7c957]/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80" 
                  alt="Cinematic Preview" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Cinema</span>
                </div>
              </div>

              <div className="w-32 sm:w-36 h-44 sm:h-52 rounded-2xl overflow-hidden border border-[#a7c957]/50 shadow-[0_0_25px_rgba(167,201,87,0.25)] relative shrink-0 -translate-y-2">
                <img 
                  src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&q=80" 
                  alt="Anime Preview" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[10px] font-bold text-[#a7c957] uppercase tracking-wider">Anime</span>
                </div>
              </div>

              <div className="w-32 sm:w-36 h-44 sm:h-52 rounded-2xl overflow-hidden border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative shrink-0 translate-y-1">
                <img 
                  src="https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=500&q=80" 
                  alt="Sci-Fi Preview" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Sci-Fi</span>
                </div>
              </div>

              <div className="w-28 sm:w-32 h-40 sm:h-48 rounded-2xl overflow-hidden border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative shrink-0 hidden sm:block">
                <img 
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80" 
                  alt="Fantasy Preview" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Fantasy</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Feature Badges Row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#a7c957]/30 transition-all flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#a7c957]/15 text-[#a7c957] shrink-0">
                <Film size={18} />
              </div>
              <div className="truncate">
                <p className="text-xs sm:text-sm font-bold text-white truncate">Movies</p>
                <p className="text-[10px] sm:text-xs text-gray-400 truncate">& TV Shows</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#a7c957]/30 transition-all flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#a7c957]/15 text-[#a7c957] shrink-0">
                <Users size={18} />
              </div>
              <div className="truncate">
                <p className="text-xs sm:text-sm font-bold text-white truncate">Fandom</p>
                <p className="text-[10px] sm:text-xs text-gray-400 truncate">Community</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#a7c957]/30 transition-all flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#a7c957]/15 text-[#a7c957] shrink-0">
                <Bookmark size={18} />
              </div>
              <div className="truncate">
                <p className="text-xs sm:text-sm font-bold text-white truncate">Personal</p>
                <p className="text-[10px] sm:text-xs text-gray-400 truncate">Watchlist</p>
              </div>
            </div>
          </div>

          {/* 3 Stat Counters Row */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-xl sm:text-2xl font-black text-white font-heading">10K+</span>
              <p className="text-[11px] text-gray-400 mt-0.5">Titles to Explore</p>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-xl sm:text-2xl font-black text-[#a7c957] font-heading">8+</span>
              <p className="text-[11px] text-gray-400 mt-0.5">Mega Fandoms</p>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-xl sm:text-2xl font-black text-white font-heading">4K</span>
              <p className="text-[11px] text-gray-400 mt-0.5">Cinematic Streams</p>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            RIGHT COLUMN: LUXURY CREATE ACCOUNT CARD
        ───────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-5 flex flex-col justify-center items-center relative">
          
          {/* Top Right "Back to Hub" Button */}
          <div className="w-full flex justify-end mb-4">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-semibold backdrop-blur-md transition-all group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Hub</span>
            </Link>
          </div>

          {/* The Glassmorphic Card Container */}
          <div className="w-full bg-[#0c100a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
            
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-3xl font-heading font-black text-white tracking-tight">
                Create Account
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
                Join the ultimate global fandom platform in seconds.
              </p>
            </div>

            {/* Quick-Fill Test Fan Button */}
            <div className="mb-5 flex justify-end">
              <button
                type="button"
                onClick={fillQuickTestFan}
                className="text-xs text-[#a7c957] hover:text-[#c2e078] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
              >
                <span>⚡ Quick Test Fan Profile</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Eren Yeager"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-black/60 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#a7c957] focus:ring-1 focus:ring-[#a7c957] transition-all"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="eren@fanhubplus.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-black/60 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#a7c957] focus:ring-1 focus:ring-[#a7c957] transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min. 8 characters"
                    className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-black/60 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#a7c957] focus:ring-1 focus:ring-[#a7c957] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#a7c957] to-[#c2e078] text-[#0b0f0a] font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.01] transition-all shadow-[0_0_25px_rgba(167,201,87,0.35)] disabled:opacity-50 cursor-pointer mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-[#0b0f0a] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus size={18} />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            {/* OR Divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#0c100a] px-3 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                OR
              </span>
              <div className="border-t border-white/10 w-full" />
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => toast("Google OAuth available in production build", { icon: "🔒" })}
                className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                </svg>
                <span className="text-[10px] text-gray-400 font-semibold">Google</span>
              </button>

              <button
                type="button"
                onClick={() => toast("Apple ID available in production build", { icon: "🔒" })}
                className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.89c.66-.82 1.11-1.96.99-3.1-.96.04-2.12.64-2.8 1.44-.59.69-1.11 1.83-.97 2.94 1.07.08 2.14-.54 2.78-1.28z" />
                </svg>
                <span className="text-[10px] text-gray-400 font-semibold">Apple</span>
              </button>

              <button
                type="button"
                onClick={() => toast("Discord OAuth available in production build", { icon: "🔒" })}
                className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 fill-[#5865F2]" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                <span className="text-[10px] text-gray-400 font-semibold">Discord</span>
              </button>
            </div>

            {/* Bottom Login Redirect Link */}
            <div className="mt-8 text-center text-xs text-gray-400">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="font-bold text-[#a7c957] hover:text-[#c2e078] hover:underline transition-colors"
              >
                Sign In →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
