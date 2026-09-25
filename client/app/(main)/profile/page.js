'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useWatchlist } from '@/hooks/useWatchlist';
import { BASE_IMG_URL } from '@/utils/tmdb';
import { LogOut, Play, Compass, Star, Clock, ShieldCheck } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

export default function ProfilePage() {
  const { user, logout, isAuthLoading } = useAuth();
  const { watchlist } = useWatchlist();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || !user) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U';

  return (
    <main className="min-h-screen bg-[#060805] text-gray-200 font-body pb-32 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-[#0b0f0a]/50 blur-[150px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <div className="relative w-full pt-32 pb-16 px-6 z-10 border-b border-white/5 bg-gradient-to-b from-[#0b0f0a]/80 to-[#060805] backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          
          {/* Animated Avatar */}
          <div className="relative group cursor-pointer">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-1.5 bg-gradient-to-r from-brand-primary via-[#4ade80] to-brand-primary rounded-full blur-[10px] opacity-70 group-hover:opacity-100 transition duration-500"
            />
            <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-[#1a2315] bg-[#0a0d08] flex items-center justify-center z-10 shadow-2xl">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl font-black text-brand-primary tracking-tighter">{initials}</span>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
              <h1 className="text-4xl md:text-5xl font-heading font-black text-white tracking-tight">{user.name}</h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-brand-primary/20 to-brand-primary/5 border border-brand-primary/30 rounded-full text-brand-primary text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(167,201,87,0.2)]">
                <ShieldCheck size={14} /> VIP Fandom
              </span>
            </div>
            <p className="text-gray-400 font-medium tracking-wide mb-6">{user.email}</p>
            
            {/* Stats Row (UI visual enhancement for competition) */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8">
              <div className="flex flex-col">
                <span className="text-brand-primary/80 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Star size={12}/> Saved</span>
                <span className="text-2xl font-black text-white">{watchlist.length} <span className="text-sm font-medium text-gray-500">Titles</span></span>
              </div>
              <div className="w-px h-10 bg-white/10 hidden md:block" />
              <div className="flex flex-col">
                <span className="text-brand-primary/80 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Clock size={12}/> Watch Time</span>
                <span className="text-2xl font-black text-white">124 <span className="text-sm font-medium text-gray-500">Hours</span></span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="shrink-0">
            <button 
              onClick={handleLogout}
              className="relative overflow-hidden group px-8 py-3 rounded-full font-bold bg-[#0a0d08] border border-red-900/30 text-gray-300 transition-all shadow-lg hover:shadow-red-900/20"
            >
              <div className="absolute inset-0 bg-red-600/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative flex items-center gap-2 group-hover:text-red-400 transition-colors">
                <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                Sign Out
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Watchlist Section */}
      <div className="max-w-6xl mx-auto px-6 mt-16 relative z-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black font-heading text-white tracking-tight">Your Collection</h2>
            <p className="text-gray-500 mt-1 font-medium">Continue where you left off</p>
          </div>
          {watchlist.length > 0 && (
            <Link href="/mylist" className="text-sm font-bold text-brand-primary hover:text-brand-accent transition-colors flex items-center gap-1">
              View All <Compass size={14} />
            </Link>
          )}
        </div>

        {watchlist.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10"
          >
            {watchlist.map((item) => (
              <motion.div key={item.movieId} variants={itemVariants}>
                <Link
                  href={`/stream/${item.movieId}?type=${item.media_type || 'movie'}`}
                  className="block group relative rounded-2xl bg-[#0a0d08] border border-white/5 transition-all duration-500 hover:border-brand-primary/40 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(167,201,87,0.15)]"
                >
                  <div className="relative w-full aspect-[2/3] rounded-t-2xl overflow-hidden">
                    <img
                      src={`${BASE_IMG_URL}${item.poster_path}`}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="w-14 h-14 bg-brand-primary text-[#0b0f0a] rounded-full flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-[0_0_20px_rgba(167,201,87,0.5)]">
                        <Play size={24} fill="currentColor" className="ml-1" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 relative">
                    <div className="absolute top-[-14px] right-4 px-2 py-0.5 bg-[#0b0f0a] border border-brand-primary/30 text-brand-primary text-[10px] font-bold tracking-widest uppercase rounded">
                      {item.media_type === 'tv' ? 'Series' : 'Movie'}
                    </div>
                    <p className="text-sm font-bold text-gray-200 truncate group-hover:text-white transition-colors mt-1">
                      {item.title}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl mx-auto mt-12 relative"
          >
            {/* Cinematic Empty State */}
            <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/5 to-transparent rounded-[40px] blur-xl" />
            <div className="relative p-12 md:p-16 rounded-[40px] bg-[#0a0d08]/80 backdrop-blur-2xl border border-white/5 shadow-2xl text-center overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-30" />
              
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 mx-auto bg-gradient-to-br from-[#1a2315] to-[#0a0d08] border border-white/10 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
              >
                <Compass className="w-10 h-10 text-brand-primary/80" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">Your vault is empty</h2>
              <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
                Dive into the Fandom universe. Discover movies and series to curate your ultimate personal collection.
              </p>
              
              <Link 
                href="/" 
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-[#0b0f0a] rounded-full overflow-hidden"
              >
                <div className="absolute inset-0 bg-brand-primary transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700" />
                <span className="relative flex items-center gap-2">
                  Start Exploring <Play size={16} fill="currentColor" />
                </span>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
