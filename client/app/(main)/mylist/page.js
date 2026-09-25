'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useWatchlist } from '@/hooks/useWatchlist';
import { BASE_IMG_URL } from '@/utils/tmdb';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Play, Compass } from 'lucide-react';

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

export default function MyListPage() {
  const { watchlist } = useWatchlist();

  return (
    <main className="min-h-screen bg-[#FBFBFD] dark:bg-[#060805] text-gray-900 dark:text-gray-200 p-6 md:p-12 pb-32 font-body flex flex-col items-center relative overflow-hidden transition-colors duration-500">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-brand-primary/20 dark:bg-brand-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] bg-black/5 dark:bg-[#0b0f0a]/80 blur-[150px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1400px] z-10 relative">
        <Breadcrumbs />
        
        <header className="mb-16 w-full text-center relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-6xl font-heading font-black text-gray-900 dark:text-white mb-4 tracking-tighter transition-colors duration-500">
              My <span className="text-brand-primary">List</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-medium text-lg max-w-xl mx-auto transition-colors duration-500">
              Your personalized vault of cinematic adventures and binge-worthy series.
            </p>
          </motion.div>
          {/* Subtle separator */}
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent mx-auto mt-8 rounded-full" />
        </header>

        {watchlist.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10 relative z-20"
          >
            {watchlist.map((item) => (
              <motion.div key={item.movieId || item.id} variants={itemVariants}>
                <Link
                  href={`/stream/${item.movieId || item.id}?type=${item.media_type || 'movie'}`}
                  className="block group relative rounded-2xl bg-white dark:bg-[#0a0d08] border border-black/5 dark:border-white/5 transition-all duration-500 hover:border-brand-primary/40 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(167,201,87,0.15)] shadow-sm dark:shadow-none"
                >
                  <div className="relative w-full aspect-[2/3] rounded-t-2xl overflow-hidden">
                    <img
                      src={`${BASE_IMG_URL}${item.poster_path}`}
                      alt={item.title || item.name}
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
                    <div className="absolute top-[-14px] right-4 px-2 py-0.5 bg-white dark:bg-[#0b0f0a] border border-brand-primary/30 text-brand-primary text-[10px] font-bold tracking-widest uppercase rounded shadow-md">
                      {item.media_type === 'tv' ? 'Series' : 'Movie'}
                    </div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate group-hover:text-black dark:group-hover:text-white transition-colors mt-1">
                      {item.title || item.name}
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
            className="w-full max-w-3xl mx-auto mt-12 relative z-20"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/10 to-transparent rounded-[40px] blur-xl" />
            <div className="relative p-12 md:p-16 rounded-[40px] bg-white/80 dark:bg-[#0a0d08]/80 backdrop-blur-2xl border border-black/5 dark:border-white/5 shadow-2xl text-center overflow-hidden transition-colors duration-500">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-30" />
              
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 mx-auto bg-gray-50 dark:bg-gradient-to-br dark:from-[#1a2315] dark:to-[#0a0d08] border border-black/5 dark:border-white/10 rounded-full flex items-center justify-center mb-8 shadow-inner dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-colors duration-500"
              >
                <Compass className="w-10 h-10 text-brand-primary/80" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight transition-colors duration-500">Your vault is empty</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-10 max-w-md mx-auto leading-relaxed transition-colors duration-500">
                Dive into the Fandom universe. Discover movies and series to curate your ultimate personal collection.
              </p>
              
              <Link 
                href="/" 
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white dark:text-[#0b0f0a] rounded-full overflow-hidden"
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
