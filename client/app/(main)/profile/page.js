'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useWatchlist } from '@/hooks/useWatchlist';
import { BASE_IMG_URL } from '@/utils/tmdb';
import { LogOut, User, Sparkles } from 'lucide-react';

// Framer Motion variants matching the floating dock's smooth staggered intro
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      ease: [0.32, 0.72, 0, 1]
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] }
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
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Get user initials for fallback avatar
  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U';

  return (
    <main className="min-h-screen bg-brand-bg text-brand-light font-body pb-32">
      {/* Profile Header (Glassmorphism) */}
      <div className="w-full bg-[#0b0f0a] border-b border-brand-primary/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)] pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 relative z-10">
          
          {/* Avatar */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-brand-primary shadow-[0_0_30px_rgba(167,201,87,0.3)] bg-brand-primary flex items-center justify-center shrink-0">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-black text-[#0b0f0a]">{initials}</span>
            )}
          </div>

          {/* User Details */}
          <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">{user.name}</h1>
            <p className="text-gray-400 font-medium mb-4">{user.email}</p>
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-primary/10 border border-brand-primary rounded-full text-brand-primary text-sm font-semibold tracking-wide">
              <Sparkles size={16} /> Fandom Member
            </div>
          </div>

          {/* Actions */}
          <div className="shrink-0 mt-6 md:mt-0">
            <button 
              onClick={handleLogout}
              className="group flex items-center gap-2 px-6 py-3 bg-gray-900 border border-gray-700 hover:border-red-500/50 hover:bg-red-950/30 text-gray-300 hover:text-red-400 rounded-full font-bold transition-all duration-300 shadow-lg"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              Logout
            </button>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-primary/5 blur-[120px] rounded-[100%] pointer-events-none" />
      </div>

      {/* Dashboard & Watchlist Section */}
      <div className="max-w-6xl mx-auto px-6 mt-12">
        <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
          <h2 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
            <User className="text-brand-primary" /> My Watchlist
          </h2>
          <span className="text-sm font-medium text-gray-500 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
            {watchlist.length} {watchlist.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        {watchlist.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
          >
            {watchlist.map((item) => (
              <motion.div key={item.movieId} variants={itemVariants}>
                <Link
                  href={`/stream/${item.movieId}?type=${item.media_type || 'movie'}`}
                  className="block group relative overflow-hidden rounded-xl shadow-lg border border-gray-800 bg-gray-900 transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(167,201,87,0.15)]"
                >
                  <img
                    src={`${BASE_IMG_URL}${item.poster_path}`}
                    alt={item.title}
                    className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0b0f0a] via-[#0b0f0a]/60 to-transparent pointer-events-none" />
                  
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-sm font-bold text-white truncate group-hover:text-brand-primary transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-brand-accent uppercase font-semibold mt-1 tracking-wider">
                      {item.media_type === 'tv' ? 'TV Series' : 'Movie'}
                    </p>
                  </div>

                  {/* Active Ring */}
                  <div className="absolute inset-0 rounded-xl ring-0 group-hover:ring-2 group-hover:ring-brand-primary/50 transition-all duration-300 pointer-events-none" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mt-20 bg-gray-900/40 backdrop-blur-sm p-12 rounded-3xl border border-gray-800 shadow-2xl max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-brand-primary" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 font-heading">Your watchlist is empty</h2>
            <p className="text-gray-400 mb-8 text-lg">Go explore the Fandom Universe and start building your ultimate collection!</p>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-brand-primary hover:bg-brand-accent text-[#0b0f0a] font-black rounded-full transition-all shadow-[0_0_20px_rgba(167,201,87,0.3)] hover:scale-105"
            >
              Explore Now
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  );
}
