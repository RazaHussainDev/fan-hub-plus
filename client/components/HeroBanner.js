'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ContinueWatchingHero from '@/components/ContinueWatchingHero';

const HeroBanner = ({ trendingData = [], customHeroProp = null }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Format the trending data to match the expected SLIDES format
  const standardSlides = trendingData.slice(0, 5).map(m => ({
    id: m.id,
    title: m.title || m.name,
    badge: 'Trending Now',
    description: m.overview,
    image: m.backdrop_path ? `https://image.tmdb.org/t/p/original${m.backdrop_path}` : '',
    type: m.title ? 'movie' : 'tv'
  }));

  const slides = customHeroProp ? [
    {
      id: 'custom-hero',
      title: customHeroProp.title,
      badge: 'Featured Content',
      description: customHeroProp.description,
      image: customHeroProp.imageUrl,
      type: 'custom',
      buttonText: customHeroProp.buttonText,
      buttonLink: customHeroProp.buttonLink
    }
  ] : standardSlides;

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides]);

  if (slides.length === 0) return null;

  const currentMovie = slides[currentIndex];
  if (!currentMovie) return null;

  return (
    <div className="relative w-full h-[85vh] min-h-[600px] flex items-end pb-24 md:pb-32 px-6 md:px-16 overflow-hidden">
      
      {/* Background Image (Ken Burns Effect) */}
      <AnimatePresence>
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.05 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 -z-10"
        >
          <Image
            src={currentMovie.image || 'https://via.placeholder.com/1920x1080?text=Fan+Hub+Plus'}
            alt={currentMovie.title}
            fill
            priority={true}          // CRITICAL: Preload instantly
            fetchPriority="high"     // CRITICAL: High network priority
            quality={90}
            className="object-cover"
            unoptimized              // Allow direct TMDB/external URLs
          />
        </motion.div>
      </AnimatePresence>

      {/* Sleek Cinematic Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-light via-brand-light/50 dark:from-[#0b0f0a] dark:via-[#0b0f0a]/60 to-transparent z-0 transition-colors duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-light via-transparent dark:from-[#0b0f0a] dark:via-transparent to-transparent z-0 transition-colors duration-500" />
      
      {/* Content Container */}
      <div className="relative z-10 max-w-2xl w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovie.id}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-5"
          >
            {/* Sleek Premium Badge */}
            {currentMovie.badge && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="flex items-center gap-2 mb-2"
              >
                <div className="px-3 py-1 bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 text-brand-primary rounded-md text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-sm">
                  {currentMovie.badge}
                </div>
              </motion.div>
            )}

            <motion.h1 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-heading font-black text-gray-900 dark:text-brand-light tracking-tight drop-shadow-md"
            >
              {currentMovie.title}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-gray-800 dark:text-gray-200 text-lg md:text-xl font-medium max-w-xl leading-relaxed drop-shadow-sm"
            >
              {currentMovie.description}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center gap-4 pt-6"
            >
              <Link
                href={currentMovie.type === 'custom' ? currentMovie.buttonLink : `/stream/${currentMovie.id}?type=${currentMovie.type}`}
                className="flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-accent text-[#0b0f0a] px-8 py-3.5 rounded-full font-black text-lg hover:scale-105 shadow-[0_10px_20px_rgba(167,201,87,0.4)] transition-all"
              >
                <Play fill="currentColor" size={22} />
                {currentMovie.type === 'custom' ? currentMovie.buttonText : 'Watch Now'}
              </Link>
              
              <button className="flex items-center gap-2 bg-black/5 dark:bg-white/10 backdrop-blur-xl border border-black/10 dark:border-white/20 text-gray-900 dark:text-white px-8 py-3.5 rounded-full font-bold text-lg hover:bg-black/10 dark:hover:bg-white/20 transition-all shadow-lg">
                <Info size={22} />
                More Info
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3D Tilted Continue Watching Carousel Overlay */}
      <ContinueWatchingHero data={trendingData.slice(4, 10)} />

      {/* Progress Indicators */}
      <div className="absolute bottom-10 left-6 md:left-16 flex items-center gap-3 z-20">
        {slides.map((_, index) => (
          <div 
            key={index} 
            className="h-1.5 rounded-full bg-black/20 dark:bg-white/20 overflow-hidden cursor-pointer"
            style={{ width: index === currentIndex ? '56px' : '16px', transition: 'width 0.4s ease' }}
            onClick={() => setCurrentIndex(index)}
          >
            {index === currentIndex && (
              <motion.div
                key={currentIndex}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 8, ease: "linear" }}
                className="h-full bg-black dark:bg-white"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
