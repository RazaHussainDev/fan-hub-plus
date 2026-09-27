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
  Film, 
  Users, 
  Bookmark, 
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import { setAuthSession } from '@/utils/apiClient';

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
      toast.success('🛡️ SuperAdmin credentials loaded', {
        style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
      });
    } else if (role === 'admin') {
      setFormData({ email: 'admin@fanhubplus.com', password: 'AdminPass123!' });
      toast.success('⚡ Admin credentials loaded', {
        style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
      });
    } else {
      setFormData({ email: 'fan@fanhubplus.com', password: 'FanPass123!' });
      toast.success('🌟 VIP Fan credentials loaded', {
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

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setLoading(true);
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${codeResponse.access_token}` },
        });
        const googleUser = await userInfoRes.json();

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const backendRes = await fetch(`${apiUrl}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            email: googleUser.email,
            name: googleUser.name,
            picture: googleUser.picture,
            accessToken: codeResponse.access_token,
          }),
        });
        const data = await backendRes.json();

        if (data.success) {
          if (data.sessionHint) {
            await fetch('/api/auth/session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sessionHint: data.sessionHint }),
            }).catch(() => {});
          }
          setAuthSession(data.accessToken || data.token, data.user);
          toast.success(`Welcome, ${data.user.name}!`, {
            style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
          });
          const requestedPath = new URLSearchParams(window.location.search).get('callbackUrl');
          const safeRequestedPath = requestedPath?.startsWith('/') && !requestedPath.startsWith('//')
            ? requestedPath
            : null;
          if (safeRequestedPath) {
            router.push(safeRequestedPath);
          } else if (data.user.role === 'admin' || data.user.role === 'superadmin') {
            router.push('/admin');
          } else {
            router.push('/');
          }
        } else {
          toast.error(data.message || 'Google login failed.');
        }
      } catch (err) {
        console.error('Google Sign-In Error:', err);
        toast.error('Google Sign-In failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google OAuth Error:', error);
      toast.error('Google Sign-In was cancelled or failed.');
    },
  });

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
                Welcome to FanHub+
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-heading font-black tracking-tight text-white leading-[1.05]">
              Your Universe <br />
              of <span className="text-[#a7c957] drop-shadow-[0_0_35px_rgba(167,201,87,0.35)]">Fandom</span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
              Discover movies, TV shows, anime, and more. Keep your watchlist, explore fan content, and be part of a global fandom community.
            </p>
          </div>

          {/* 3D Tilted Cinematic Posters Cascade (Desktop & Tablet) */}
          <div className="relative my-8 h-48 sm:h-56 lg:h-64 w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl p-4 flex items-center justify-center">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#080c07] via-transparent to-[#080c07] z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080c07] via-transparent to-transparent z-10 pointer-events-none" />

            {/* Collage of Cinematic Stills */}
            <div className="flex items-center gap-3 sm:gap-4 -rotate-2 scale-95 sm:scale-100 hover:rotate-0 transition-transform duration-700">
              {/* Poster 1: The Last of Us */}
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

              {/* Poster 2: Anime */}
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

              {/* Poster 3: Sci-Fi Cosmic */}
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

              {/* Poster 4: Fantasy Universe */}
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

          {/* 3 Feature Badges Row (as shown in reference) */}
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
            RIGHT COLUMN: LUXURY SIGN IN CARD
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
                Sign In
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
                Welcome back! Enter your credentials to continue your fandom journey.
              </p>
            </div>

            {/* ─── Judge & Jury Quick-Fill Toolbar ─── */}
            <div className="mb-6 p-3 rounded-2xl bg-[#a7c957]/10 border border-[#a7c957]/20">
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mb-2">
                <span className="flex items-center gap-1.5 text-[#a7c957] uppercase tracking-wider text-[10px]">
                  <ShieldCheck size={13} /> Judge Quick Fill
                </span>
                <span className="text-[10px] text-gray-400">1-Click Autofill</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => fillTestCredentials('superadmin')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer border ${
                    selectedRole === 'superadmin'
                      ? 'bg-[#a7c957] text-[#0b0f0a] border-[#a7c957] shadow-lg shadow-[#a7c957]/30'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:border-[#a7c957]/50 hover:bg-white/10'
                  }`}
                >
                  <span className="text-[11px]">🛡️ SuperAdmin</span>
                  <span className="text-[9px] opacity-75 font-normal">Full Access</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillTestCredentials('admin')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer border ${
                    selectedRole === 'admin'
                      ? 'bg-[#a7c957] text-[#0b0f0a] border-[#a7c957] shadow-lg shadow-[#a7c957]/30'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:border-[#a7c957]/50 hover:bg-white/10'
                  }`}
                >
                  <span className="text-[11px]">⚡ Admin</span>
                  <span className="text-[9px] opacity-75 font-normal">Moderator</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillTestCredentials('fan')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer border ${
                    selectedRole === 'fan'
                      ? 'bg-[#a7c957] text-[#0b0f0a] border-[#a7c957] shadow-lg shadow-[#a7c957]/30'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:border-[#a7c957]/50 hover:bg-white/10'
                  }`}
                >
                  <span className="text-[11px]">🌟 VIP Fan</span>
                  <span className="text-[9px] opacity-75 font-normal">Streaming</span>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Field */}
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
                    placeholder="name@fanhubplus.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-black/60 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#a7c957] focus:ring-1 focus:ring-[#a7c957] transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => toast("Contact support to reset password.", { icon: "ℹ️" })}
                    className="text-xs text-[#a7c957] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
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
                    <LogIn size={18} />
                    <span>Sign In</span>
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

            {/* Social Logins - Google OAuth */}
            <div>
              <button
                type="button"
                onClick={() => loginWithGoogle()}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#a7c957]/40 text-white font-bold py-3.5 px-4 rounded-2xl transition-all shadow-md active:scale-[0.99] cursor-pointer disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Bottom Register Redirect Link */}
            <div className="mt-8 text-center text-xs text-gray-400">
              Don&apos;t have an account?{' '}
              <Link 
                href="/register" 
                className="font-bold text-[#a7c957] hover:text-[#c2e078] hover:underline transition-colors"
              >
                Create Account →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
