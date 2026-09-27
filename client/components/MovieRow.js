'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { BASE_IMG_URL } from '@/utils/tmdb';
import SkeletonCard from './SkeletonCard';
import { useWatchlist } from '@/hooks/useWatchlist';
import { toast } from 'react-hot-toast';
import { Play, Share2, Plus, Check, Download } from 'lucide-react';
import DownloadModal from '@/components/DownloadModal';

const fetcher = (url) => fetch(url).then((res) => res.json());

const MovieRow = ({ title, fetchCategory, initialMovies = null, fallbackType = 'movie', href }) => {
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
  // Only show skeletons during active SWR fetch — NOT when movies are passed directly as a prop
  const isLoading = fetchCategory ? (swrLoading && !data) : false;
  const showSkeletons = isLoading;

  return (
    <div className="w-full flex flex-col space-y-2 py-4 cv-auto">
      <div className="flex items-baseline justify-between px-6 md:px-16">
        <h2 className="text-xl md:text-2xl font-heading font-bold text-[#1d1d1f] dark:text-gray-100 transition-colors duration-300">
          {title}
        </h2>
        <Link 
          href={href || `/explore?category=${fetchCategory || 'trending'}`} 
          className="text-xs md:text-sm font-semibold text-brand-primary hover:text-[#c2e078] cursor-pointer hover:opacity-80 transition-all flex items-center gap-1 group py-1 px-2 rounded-lg hover:bg-brand-primary/10"
        >
          <span>See All</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      </div>

      <div className="flex overflow-x-auto scrollbar-hide mobile-row space-x-4 py-4 px-6 md:px-16 pb-12">
        {showSkeletons ? (
          [...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))
        ) : movies.length === 0 ? null : (
          movies.map((movie) => {
            if (!movie.poster_path && !movie.poster) return null;
            return <MovieCard key={movie.id} movie={movie} fallbackType={fallbackType} />;
          })
        )}
      </div>
    </div>
  );
};

// Separated into a component so we can use hooks per card cleanly
const MovieCard = ({ movie, fallbackType }) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  
  const type = movie.media_type || fallbackType;
  const isSaved = isInWatchlist(movie.id);

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const movieTitle = movie.title || movie.name || 'Fandom Movie';
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/stream/${movie.id}?type=${type}`;
    
    // 1. Try native Web Share API (mobile/desktop share sheet)
    if (navigator?.share) {
      try {
        await navigator.share({
          title: movieTitle,
          text: `Watch ${movieTitle} on Fan Hub Plus!`,
          url: url
        });
        return;
      } catch (err) {
        // User aborted share or share failed; continue to clipboard fallback
      }
    }

    // 2. Try modern Clipboard API
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        toast.success(`Link for "${movieTitle}" copied!`, { 
          style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
        });
        return;
      } catch (err) {
        // Continue to fallback
      }
    }

    // 3. Fallback for insecure context or restricted permissions
    try {
      const tempInput = document.createElement('textarea');
      tempInput.value = url;
      tempInput.style.position = 'fixed';
      tempInput.style.opacity = '0';
      document.body.appendChild(tempInput);
      tempInput.focus();
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      toast.success(`Link for "${movieTitle}" copied!`, { 
        style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
      });
    } catch (err) {
      toast.error("Could not copy link to clipboard");
    }
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

  const handleOpenDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDownloadOpen(true);
  };

  return (
    <>
      <Link
        href={`/stream/${movie.id}?type=${type}`}
        className="shrink-0 block group relative rounded-2xl bg-[#0a0d08] border border-white/5 transition-all duration-500 hover:border-brand-primary/40 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(167,201,87,0.15)] w-32 md:w-40"
      >
        <div className="relative w-full aspect-[2/3] rounded-t-2xl overflow-hidden">
          <img
            src={movie.poster_path
              ? (movie.poster_path.startsWith('http') ? movie.poster_path : `${BASE_IMG_URL}${movie.poster_path}`)
              : (movie.poster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80')}
            alt={movie.title || movie.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
            loading="lazy"
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80'; }}
          />
          
          {/* Quick Action Top Icons (Watchlist, Download, Share) */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-20">
            {/* Watchlist */}
            <button 
              onClick={handleWatchlist}
              className={`p-1.5 rounded-full backdrop-blur-md border shadow-lg transition-colors cursor-pointer ${
                isSaved 
                  ? 'bg-brand-primary text-[#0b0f0a] border-brand-primary hover:bg-red-500 hover:border-red-500 hover:text-white' 
                  : 'bg-black/60 border-white/20 text-white hover:bg-brand-primary hover:text-[#0b0f0a] hover:border-brand-primary'
              }`}
              title={isSaved ? "Remove from List" : "Add to List"}
              aria-label={isSaved ? "Remove from List" : "Add to List"}
            >
              {isSaved ? <Check size={13} strokeWidth={3} /> : <Plus size={13} strokeWidth={3} />}
            </button>

            {/* Offline Download */}
            <button 
              onClick={handleOpenDownload}
              className="p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-lg transition-colors hover:bg-brand-primary hover:text-[#0b0f0a] hover:border-brand-primary cursor-pointer"
              title="Download for Offline Viewing"
              aria-label="Download for Offline Viewing"
            >
              <Download size={13} strokeWidth={2.5} />
            </button>

            {/* Share */}
            <button 
              onClick={handleShare}
              className="p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-lg transition-colors hover:bg-brand-primary hover:text-[#0b0f0a] hover:border-brand-primary cursor-pointer"
              title="Share Link"
              aria-label="Share Link"
            >
              <Share2 size={13} strokeWidth={2.5} />
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

      {/* Offline Download Modal */}
      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        movie={{
          id: movie.id,
          title: movie.title || movie.name,
          poster_path: movie.poster_path,
          media_type: type
        }}
      />
    </>
  );
};

export default MovieRow;
