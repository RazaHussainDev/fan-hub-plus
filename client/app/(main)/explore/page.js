'use client';

import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BASE_IMG_URL } from '@/utils/tmdb';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Play, Compass, Plus, Check, Share2 } from 'lucide-react';
import { useWatchlist } from '@/hooks/useWatchlist';
import toast from 'react-hot-toast';

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

// Separated MovieCard for hooks
const ExploreMovieCard = ({ movie }) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const type = movie.media_type || 'movie';
  const isSaved = isInWatchlist(movie.id);

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/stream/${movie.id}?type=${type}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!", { style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }});
  };

  const handleWatchlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist({ ...movie, media_type: type });
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <Link
        href={`/stream/${movie.id}?type=${type}`}
        className="block group relative rounded-2xl bg-white dark:bg-[#0a0d08] border border-black/5 dark:border-white/5 transition-all duration-500 hover:border-brand-primary/40 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(167,201,87,0.15)] shadow-sm dark:shadow-none"
      >
        <div className="relative w-full aspect-[2/3] rounded-t-2xl overflow-hidden">
          <img
            src={`${BASE_IMG_URL}${movie.poster_path}`}
            alt={movie.title || movie.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
            loading="lazy"
          />
          
          <div className="absolute top-2 right-2 flex flex-col gap-2 translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-20">
            <button 
              onClick={handleWatchlist}
              className={`p-2 rounded-full backdrop-blur-md border shadow-lg transition-colors ${isSaved ? 'bg-brand-primary text-[#0b0f0a] border-brand-primary hover:bg-red-500 hover:border-red-500 hover:text-white' : 'bg-black/50 border-white/20 text-white hover:bg-brand-primary hover:text-[#0b0f0a] hover:border-brand-primary'}`}
              title={isSaved ? "Remove from List" : "Add to List"}
            >
              {isSaved ? <Check size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={3} />}
            </button>
            <button 
              onClick={handleShare}
              className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white shadow-lg transition-colors hover:bg-brand-primary hover:text-[#0b0f0a] hover:border-brand-primary"
              title="Share Link"
            >
              <Share2 size={14} strokeWidth={2.5} />
            </button>
          </div>

          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px] z-10">
            <div className="w-14 h-14 bg-brand-primary text-[#0b0f0a] rounded-full flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-[0_0_20px_rgba(167,201,87,0.5)]">
              <Play size={24} fill="currentColor" className="ml-1" />
            </div>
          </div>
        </div>
        
        <div className="p-4 relative">
          <div className="absolute top-[-14px] right-4 px-2 py-0.5 bg-white dark:bg-[#0b0f0a] border border-brand-primary/30 text-brand-primary text-[10px] font-bold tracking-widest uppercase rounded shadow-md">
            {type === 'tv' ? 'Series' : 'Movie'}
          </div>
          <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate group-hover:text-black dark:group-hover:text-white transition-colors mt-1">
            {movie.title || movie.name}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default function ExplorePage() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView({ threshold: 0.1 });

  const fetchMovies = async (pageNumber) => {
    try {
      const res = await fetch(`/api/movies/explore?page=${pageNumber}`);
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        setHasMore(false);
      } else {
        setMovies(prev => {
          // Prevent duplicates that sometimes happen with pagination
          const newMovies = data.results.filter(newMovie => !prev.some(p => p.id === newMovie.id));
          return [...prev, ...newMovies];
        });
      }
    } catch (error) {
      console.error("Failed to fetch movies", error);
    }
  };

  useEffect(() => {
    fetchMovies(1);
  }, []);

  useEffect(() => {
    if (inView && hasMore && movies.length > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(nextPage);
    }
  }, [inView, hasMore, movies.length]);

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
              Explore <span className="text-brand-primary">Universe</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-medium text-lg max-w-xl mx-auto transition-colors duration-500">
              Discover an infinite stream of trending cinematic masterpieces.
            </p>
          </motion.div>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent mx-auto mt-8 rounded-full" />
        </header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10 relative z-20"
        >
          {movies.map((movie) => {
            if (!movie.poster_path) return null;
            return <ExploreMovieCard key={movie.id} movie={movie} />;
          })}
        </motion.div>

        {/* The Trigger Element */}
        {hasMore && (
          <div ref={ref} className="w-full flex justify-center py-12 relative z-20">
            <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </main>
  );
}
