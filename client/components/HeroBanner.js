'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Play, 
  Info, 
  X, 
  Volume2, 
  VolumeX, 
  Bookmark, 
  Check, 
  Share2, 
  Star, 
  Calendar, 
  Clock, 
  Film, 
  Tv, 
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchVideos, fetchDetails, fetchCredits } from '@/utils/tmdb';
import { useWatchlist } from '@/hooks/useWatchlist';
import ContinueWatchingHero from '@/components/ContinueWatchingHero';
import toast from 'react-hot-toast';

const HeroBanner = ({ trendingData = [], customHeroProp = null }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showVideoBackdrop, setShowVideoBackdrop] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  // More Info Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDetails, setModalDetails] = useState(null);
  const [modalCast, setModalCast] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);
  const [modalTrailerKey, setModalTrailerKey] = useState(null);

  const { isInWatchlist, addToWatchlist } = useWatchlist();

  // Format the trending data to match the expected SLIDES format
  const standardSlides = trendingData.slice(0, 6).map(m => ({
    id: m.id,
    title: m.title || m.name,
    badge: 'Trending Worldwide',
    description: m.overview,
    image: m.backdrop_path ? `https://image.tmdb.org/t/p/original${m.backdrop_path}` : '',
    poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '',
    type: m.title ? 'movie' : (m.media_type || 'tv'),
    vote_average: m.vote_average ? Number(m.vote_average).toFixed(1) : '8.2',
    release_date: m.release_date || m.first_air_date || '2024',
    originalItem: m
  }));

  const slides = customHeroProp ? [
    {
      id: 'custom-hero',
      title: customHeroProp.title,
      badge: 'Featured Content',
      description: customHeroProp.description,
      image: customHeroProp.imageUrl,
      poster: customHeroProp.imageUrl,
      type: 'custom',
      vote_average: '9.0',
      release_date: '2024',
      buttonText: customHeroProp.buttonText,
      buttonLink: customHeroProp.buttonLink,
      originalItem: null
    }
  ] : standardSlides;

  const currentMovie = slides[currentIndex];

  // Auto-rotation timer: 12 seconds per slide (paused when More Info modal is open)
  useEffect(() => {
    if (slides.length <= 1 || isModalOpen) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 12000);
    return () => clearInterval(timer);
  }, [slides, isModalOpen]);

  // Fetch YouTube trailer whenever currentIndex changes
  useEffect(() => {
    let isSubscribed = true;
    setShowVideoBackdrop(false);
    setTrailerKey(null);

    if (!currentMovie || currentMovie.type === 'custom') {
      return;
    }

    const loadTrailer = async () => {
      try {
        const videosData = await fetchVideos(currentMovie.id, currentMovie.type);
        if (!isSubscribed) return;

        const results = videosData?.results || [];
        const official = results.find(v => v.site === 'YouTube' && v.type === 'Trailer') ||
                         results.find(v => v.site === 'YouTube' && (v.type === 'Teaser' || v.type === 'Clip'));

        if (official?.key) {
          setTrailerKey(official.key);
          // Allow 2.5 seconds for the high-res poster to shine before fading in video trailer
          const timer = setTimeout(() => {
            if (isSubscribed) {
              setShowVideoBackdrop(true);
            }
          }, 2500);
          return () => clearTimeout(timer);
        }
      } catch (err) {
        console.warn("Could not fetch trailer for hero carousel:", err);
      }
    };

    loadTrailer();

    return () => {
      isSubscribed = false;
    };
  }, [currentIndex]);

  // Lock body scroll when modal is open + support Escape key
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setIsModalOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isModalOpen]);

  // Open and populate the Luxury More Info Modal
  const handleOpenMoreInfo = async () => {
    if (!currentMovie) return;
    setIsModalOpen(true);
    setLoadingModal(true);
    setModalDetails(null);
    setModalCast([]);
    setModalTrailerKey(trailerKey);

    try {
      if (currentMovie.type !== 'custom') {
        const [details, credits, videos] = await Promise.all([
          fetchDetails(currentMovie.id, currentMovie.type).catch(() => null),
          fetchCredits(currentMovie.id, currentMovie.type).catch(() => null),
          fetchVideos(currentMovie.id, currentMovie.type).catch(() => null)
        ]);

        setModalDetails(details || currentMovie.originalItem);
        if (credits?.cast) {
          setModalCast(credits.cast.slice(0, 8));
        }
        if (videos?.results) {
          const trailer = videos.results.find(v => v.site === 'YouTube' && v.type === 'Trailer') ||
                          videos.results.find(v => v.site === 'YouTube');
          if (trailer?.key) {
            setModalTrailerKey(trailer.key);
          }
        }
      } else {
        setModalDetails({
          title: currentMovie.title,
          overview: currentMovie.description,
          backdrop_path: null,
          imageUrl: currentMovie.image,
          vote_average: currentMovie.vote_average,
          release_date: currentMovie.release_date
        });
      }
    } catch (e) {
      console.error("Failed to load modal details:", e);
    } finally {
      setLoadingModal(false);
    }
  };

  const handleShare = () => {
    if (!currentMovie) return;
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/stream/${currentMovie.id}?type=${currentMovie.type}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
      toast.success("Stream link copied to clipboard!", {
        style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
      });
    }
  };

  if (slides.length === 0 || !currentMovie) return null;

  const isSaved = currentMovie.originalItem ? isInWatchlist(currentMovie.id) : false;

  return (
    <div className="hero-banner-mobile relative w-full h-[88vh] min-h-[640px] flex items-end pb-24 md:pb-32 px-6 md:px-16 overflow-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HIGH-RES STATIC BACKDROP (Ken Burns Zoom Animation)
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.05 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 -z-20"
        >
          <Image
            src={currentMovie.image || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80'}
            alt={currentMovie.title}
            fill
            priority={true}
            fetchPriority="high"
            quality={90}
            className="object-cover"
            unoptimized
          />
        </motion.div>
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          2. YOUTUBE VIDEO TRAILER BACKDROP (Smooth Crossfade)
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showVideoBackdrop && trailerKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
          >
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${trailerKey}&playsinline=1&rel=0&showinfo=0&modestbranding=1&disablekb=1&iv_load_policy=3`}
              title="Carousel Trailer Backdrop"
              className="w-full h-full scale-135 md:scale-125 object-cover opacity-60 dark:opacity-55 pointer-events-none"
              style={{ border: 'none', width: '100%', height: '100%' }}
              allow="autoplay; encrypted-media"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sleek Cinematic Gradient Overlays for High Legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/60 to-transparent dark:from-[#0b0f0a] dark:via-[#0b0f0a]/75 dark:to-transparent z-0 transition-colors duration-500 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent dark:from-[#0b0f0a] dark:via-transparent to-transparent z-0 transition-colors duration-500 pointer-events-none" />
      
      {/* ─────────────────────────────────────────────────────────────
          3. TRAILER PREVIEW BADGE & MUTE / UNMUTE BUTTON
      ───────────────────────────────────────────────────────────── */}
      {showVideoBackdrop && trailerKey && (
        <div className="absolute top-20 md:top-24 right-6 md:right-16 z-20 flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 dark:bg-[#0b0f0a]/80 backdrop-blur-md border border-white/10 text-[11px] font-bold text-[#a7c957] uppercase tracking-wider shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#a7c957] animate-ping" />
            Trailer Active
          </div>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 rounded-full bg-black/60 dark:bg-[#0b0f0a]/85 hover:bg-[#a7c957] hover:text-[#0b0f0a] text-white backdrop-blur-md border border-white/15 transition-all shadow-xl active:scale-95 cursor-pointer"
            title={isMuted ? "Unmute Trailer Audio" : "Mute Trailer Audio"}
            aria-label="Toggle trailer audio"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. MAIN HERO CONTENT CONTAINER
      ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-2xl w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovie.id}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4"
          >
            {/* Premium Badges Row */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15, transition: { duration: 0.2 } }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-2.5 mb-1"
            >
              <div className="px-3 py-1 bg-[#a7c957]/15 border border-[#a7c957]/30 text-[#a7c957] rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a7c957]" />
                {currentMovie.badge}
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 bg-black/30 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-full text-xs font-bold text-gray-800 dark:text-gray-200">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                {currentMovie.vote_average}
              </div>
              <div className="px-2.5 py-1 bg-black/30 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-full text-xs font-bold text-gray-800 dark:text-gray-200 uppercase">
                {currentMovie.type === 'movie' ? 'Movie' : 'Series'}
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15, transition: { duration: 0.2 } }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-3xl sm:text-5xl md:text-7xl font-heading font-black text-gray-900 dark:text-white tracking-tight drop-shadow-md leading-[1.05]"
            >
              {currentMovie.title}
            </motion.h1>
            
            {/* Overview */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15, transition: { duration: 0.2 } }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-gray-700 dark:text-gray-300 text-sm md:text-lg font-medium max-w-xl leading-relaxed drop-shadow-sm line-clamp-3"
            >
              {currentMovie.description}
            </motion.p>

            {/* CTA Buttons Row */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15, transition: { duration: 0.2 } }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap items-center gap-2.5 md:gap-3.5 pt-3 md:pt-4"
            >
              {/* Primary Watch Action */}
              <Link
                href={currentMovie.type === 'custom' ? currentMovie.buttonLink : `/stream/${currentMovie.id}?type=${currentMovie.type}`}
                className="flex items-center gap-2 bg-gradient-to-r from-[#a7c957] to-[#8db33f] text-[#0b0f0a] px-5 md:px-8 py-3 md:py-3.5 rounded-full font-black text-sm md:text-lg hover:scale-105 shadow-[0_10px_25px_rgba(167,201,87,0.4)] transition-all active:scale-95"
              >
                <Play fill="currentColor" size={20} />
                {currentMovie.type === 'custom' ? currentMovie.buttonText : 'Watch Now'}
              </Link>
              
              {/* Interactive More Info Trigger */}
              <button 
                onClick={handleOpenMoreInfo}
                className="flex items-center gap-2 bg-black/10 dark:bg-white/10 backdrop-blur-xl border border-black/15 dark:border-white/20 text-gray-900 dark:text-white px-5 md:px-7 py-3 md:py-3.5 rounded-full font-bold text-sm md:text-lg hover:bg-[#a7c957]/20 hover:border-[#a7c957]/50 hover:text-[#a7c957] transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <Info size={20} />
                More Info
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3D Tilted Continue Watching Carousel Overlay */}
      <ContinueWatchingHero data={trendingData.slice(4, 10)} />

      {/* ─────────────────────────────────────────────────────────────
          5. PROGRESS INDICATORS & SLIDE SELECTOR
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute bottom-10 left-6 md:left-16 flex items-center gap-2.5 z-20">
        {slides.map((_, index) => (
          <button 
            key={index} 
            className="h-1.5 rounded-full bg-black/20 dark:bg-white/20 overflow-hidden cursor-pointer p-0 border-0"
            style={{ width: index === currentIndex ? '52px' : '14px', transition: 'width 0.4s ease' }}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Jump to slide ${index + 1}`}
          >
            {index === currentIndex && (
              <motion.div
                key={currentIndex}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 12, ease: "linear" }}
                className="h-full bg-[#a7c957]"
              />
            )}
          </button>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          6. LUXURY GLASSMORPHIC "MORE INFO" MODAL
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="bg-[#0b0f0a] border border-white/15 rounded-3xl max-w-3xl w-full overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(167,201,87,0.15)] relative my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-[#a7c957] hover:text-[#0b0f0a] transition-all cursor-pointer shadow-lg active:scale-95"
                aria-label="Close details"
              >
                <X size={20} />
              </button>

              {/* Modal Hero / Trailer Preview Header */}
              <div className="relative w-full h-64 md:h-80 bg-black overflow-hidden">
                {modalTrailerKey ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${modalTrailerKey}?autoplay=1&mute=0&controls=1&rel=0`}
                    title="Official Movie Trailer"
                    className="w-full h-full object-cover"
                    style={{ border: 'none' }}
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <Image
                      src={currentMovie.image || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80'}
                      alt={currentMovie.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f0a] via-[#0b0f0a]/40 to-transparent" />
                  </>
                )}

                {/* Subtle gradient at the bottom to blend seamlessly into content */}
                <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#0b0f0a] to-transparent pointer-events-none" />
              </div>

              {/* Modal Content Body */}
              <div className="p-6 md:p-8 space-y-6">
                {/* Header Information */}
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#a7c957]/20 border border-[#a7c957]/40 text-[#a7c957] text-xs font-bold uppercase tracking-wider">
                      {currentMovie.type === 'movie' ? 'Feature Film' : 'Series'}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-md">
                      <Star size={12} className="fill-amber-400" />
                      {modalDetails?.vote_average ? Number(modalDetails.vote_average).toFixed(1) : currentMovie.vote_average} / 10
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-gray-400 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-md">
                      <Calendar size={12} />
                      {(modalDetails?.release_date || modalDetails?.first_air_date || currentMovie.release_date || '').slice(0, 4)}
                    </span>
                    {(modalDetails?.runtime || modalDetails?.episode_run_time?.[0]) && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-gray-400 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-md">
                        <Clock size={12} />
                        {modalDetails.runtime ? `${modalDetails.runtime} min` : `${modalDetails.episode_run_time[0]} min`}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl md:text-4xl font-heading font-black text-white tracking-tight">
                    {modalDetails?.title || modalDetails?.name || currentMovie.title}
                  </h2>

                  {modalDetails?.tagline && (
                    <p className="text-sm font-serif italic text-[#a7c957]/80 mt-1">
                      "{modalDetails.tagline}"
                    </p>
                  )}
                </div>

                {/* Genres Pills */}
                {modalDetails?.genres && modalDetails.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {modalDetails.genres.map(g => (
                      <span key={g.id} className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 font-medium">
                        {g.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Synopsis */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase tracking-wider text-gray-400 font-bold">Synopsis</h4>
                  <p className="text-sm md:text-base text-gray-300 leading-relaxed font-sans">
                    {modalDetails?.overview || currentMovie.description || "No overview available for this title."}
                  </p>
                </div>

                {/* Cast Roster */}
                {modalCast.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs uppercase tracking-wider text-gray-400 font-bold">Top Cast & Performers</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {modalCast.map(actor => (
                        <div key={actor.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10">
                          {actor.profile_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                              alt={actor.name}
                              className="w-10 h-10 rounded-full object-cover border border-[#a7c957]/30"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#a7c957]/20 text-[#a7c957] font-bold text-xs flex items-center justify-center">
                              {actor.name.charAt(0)}
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-white truncate">{actor.name}</p>
                            <p className="text-[10px] text-gray-400 truncate">{actor.character || 'Cast'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons Row */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                  <Link
                    href={currentMovie.type === 'custom' ? currentMovie.buttonLink : `/stream/${currentMovie.id}?type=${currentMovie.type}`}
                    className="flex-1 min-w-[160px] flex items-center justify-center gap-2 bg-[#a7c957] text-[#0b0f0a] font-bold py-3 px-6 rounded-full hover:brightness-110 shadow-[0_0_20px_rgba(167,201,87,0.3)] transition-all active:scale-95 text-sm"
                  >
                    <Play size={18} fill="currentColor" /> Play Title
                  </Link>

                  {currentMovie.originalItem && (
                    <button
                      onClick={() => addToWatchlist(currentMovie.originalItem)}
                      className={`flex items-center gap-2 py-3 px-5 rounded-full border text-sm font-bold transition-all active:scale-95 cursor-pointer ${
                        isSaved
                          ? 'bg-[#a7c957]/20 border-[#a7c957] text-[#a7c957]'
                          : 'bg-white/5 border-white/15 text-white hover:bg-white/10'
                      }`}
                    >
                      {isSaved ? <Check size={18} /> : <Bookmark size={18} />}
                      {isSaved ? 'In Watchlist' : 'Add to List'}
                    </button>
                  )}

                  <button
                    onClick={handleShare}
                    className="p-3 rounded-full bg-white/5 border border-white/15 text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer active:scale-95"
                    title="Share Title"
                    aria-label="Share Title"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeroBanner;
