'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ContinueWatchingHero from '@/components/ContinueWatchingHero';

const SLIDES = [
  {
    id: 71446,
    title: 'Money Heist',
    badge: 'Nº 1 in TV Shows Today',
    description: 'To carry out the biggest heist in history, a mysterious man called The Professor recruits a band of eight robbers who have a single characteristic: none of them has anything to lose.',
    image: 'https://image.tmdb.org/t/p/original/gFZriCkpJYsApPZEF3jhxL4yLzG.jpg',
    type: 'tv'
  },
  {
    id: 94997,
    title: 'House of the Dragon',
    badge: 'New Season',
    description: 'An internal succession conflict within house Targaryen that causes the decline of their power, 172 years before the birth of Daenerys Targaryen.',
    image: 'https://image.tmdb.org/t/p/original/577eXC8wFQT0eUrJcgznSiFPRmk.jpg',
    type: 'tv'
  },
  {
    id: 157336,
    title: 'Interstellar',
    badge: 'Critically Acclaimed',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival as Earth\'s resources run out.',
    image: 'https://image.tmdb.org/t/p/original/8sNiAPPYU14PUepFNeSNGUTiHW.jpg',
    type: 'movie'
  },
  {
    id: 119051,
    title: 'Wednesday',
    badge: 'Trending Globally',
    description: 'Wednesday Addams is sent to Nevermore Academy, a bizarre boarding school where she attempts to master her psychic powers and stop a monstrous killing spree.',
    image: 'https://image.tmdb.org/t/p/original/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg',
    type: 'tv'
  }
];

const HeroBanner = ({ trendingData = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const currentMovie = SLIDES[currentIndex];

  return (
    <div className="relative w-full h-[85vh] min-h-[600px] flex items-end pb-24 md:pb-32 px-6 md:px-16 overflow-hidden">
      
      {/* Background Image (Ken Burns Effect) */}
      <AnimatePresence>
        <motion.img
          key={currentMovie.id}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.05 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          src={currentMovie.image}
          alt={currentMovie.title}
          className="absolute inset-0 w-full h-full object-cover -z-10"
        />
      </AnimatePresence>

      {/* Sleek Cinematic Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-light via-brand-light/50 dark:from-brand-bg dark:via-brand-bg/60 to-transparent z-0 transition-colors duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-light via-transparent dark:from-brand-bg dark:via-transparent to-transparent z-0 transition-colors duration-500" />
      
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
                <div className="px-3 py-1 bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 text-brand-accent rounded-md text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-sm">
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
                href={`/stream/${currentMovie.id}?type=${currentMovie.type}`}
                className="flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-accent text-white px-8 py-3.5 rounded-full font-bold text-lg hover:scale-105 shadow-[0_10px_20px_rgba(56,189,248,0.4)] transition-all"
              >
                <Play fill="currentColor" size={22} />
                Watch Now
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
        {SLIDES.map((_, index) => (
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
