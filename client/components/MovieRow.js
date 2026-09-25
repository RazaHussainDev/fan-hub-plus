'use client';

import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { BASE_IMG_URL } from '@/utils/tmdb';
import SkeletonCard from './SkeletonCard';

const fetcher = (url) => fetch(url).then((res) => res.json());

const MovieRow = ({ title, fetchCategory, initialMovies = null, fallbackType = 'movie' }) => {
  // If fetchCategory is provided, we use SWR to fetch and cache data on the client.
  // Otherwise, fallback to initialMovies.
  const { data, error, isLoading: swrLoading } = useSWR(
    fetchCategory ? `/api/movies?category=${fetchCategory}` : null,
    fetcher,
    {
      fallbackData: initialMovies ? { results: initialMovies } : undefined,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      shouldRetryOnError: false
    }
  );

  const movies = data?.results || initialMovies || [];
  const isLoading = fetchCategory ? swrLoading && !data : false;
  const showSkeletons = isLoading || movies.length === 0;

  return (
    <div className="w-full flex flex-col space-y-2 py-4">
      {/* Apple-style section heading */}
      <div className="flex items-baseline justify-between px-6 md:px-16">
        <h2 className="text-xl md:text-2xl font-heading font-bold text-[#1d1d1f] dark:text-gray-100 transition-colors duration-300">
          {title}
        </h2>
        <span className="text-sm font-semibold text-brand-primary cursor-pointer hover:opacity-70 transition-opacity">
          See All
        </span>
      </div>

      <div className="flex overflow-x-auto scrollbar-hide space-x-4 py-4 px-6 md:px-16 pb-12">
        {showSkeletons ? (
          [...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))
        ) : (
          movies.map((movie) => {
            if (!movie.poster_path) return null;
            return <MovieCard key={movie.id} movie={movie} fallbackType={fallbackType} />;
          })
        )}
      </div>
    </div>
  );
};

// Separated into a component so we can use hooks per card cleanly without breaking the list if we ever expand functionality
const MovieCard = ({ movie, fallbackType }) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = require('@/hooks/useWatchlist').useWatchlist();
  const { toast } = require('react-hot-toast');
  const { Play, Share2, Plus, Check } = require('lucide-react');
  
  const type = movie.media_type || fallbackType;
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
    <Link
      href={`/stream/${movie.id}?type=${type}`}
      className="shrink-0 block group relative rounded-2xl bg-[#0a0d08] border border-white/5 transition-all duration-500 hover:border-brand-primary/40 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(167,201,87,0.15)] w-32 md:w-40"
    >
      <div className="relative w-full aspect-[2/3] rounded-t-2xl overflow-hidden">
        <img
          src={`${BASE_IMG_URL}${movie.poster_path}`}
          alt={movie.title || movie.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
          loading="lazy"
        />
        
        {/* Quick Action Top Icons (Share & Watchlist) */}
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

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px] z-10">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-brand-primary text-[#0b0f0a] rounded-full flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-[0_0_20px_rgba(167,201,87,0.5)]">
            <Play size={20} fill="currentColor" className="ml-1 md:w-6 md:h-6" />
          </div>
        </div>
      </div>
      
      <div className="p-3 relative">
        <div className="absolute top-[-10px] right-3 px-1.5 py-[1px] bg-[#0b0f0a] border border-brand-primary/30 text-brand-primary text-[9px] font-bold tracking-widest uppercase rounded shadow-lg">
          {type === 'tv' ? 'Series' : 'Movie'}
        </div>
        <p className="text-xs md:text-sm font-bold text-gray-200 truncate group-hover:text-white transition-colors mt-1">
          {movie.title || movie.name}
        </p>
      </div>
    </Link>
  );
};

export default MovieRow;
