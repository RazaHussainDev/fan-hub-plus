'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
  {
    id: 71446,
    title: 'Money Heist',
    description: 'To carry out the biggest heist in history, a mysterious man called The Professor recruits a band of eight robbers who have a single characteristic: none of them has anything to lose.',
    image: 'https://static.tvmaze.com/uploads/images/original_untouched/209/523445.jpg',
    type: 'tv'
  },
  {
    id: 94997,
    title: 'House of the Dragon',
    description: 'An internal succession conflict within house Targaryen that causes the decline of their power, 172 years before the birth of Daenerys Targaryen.',
    image: 'https://image.tmdb.org/t/p/original/etj8E2o0NpZHp1ZQQW0jNl735fH.jpg',
    type: 'tv'
  },
  {
    id: 157336,
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival as Earth\'s resources run out.',
    image: 'https://image.tmdb.org/t/p/original/xJHokMbljvjEVAZSZA15fs44KjZ.jpg',
    type: 'movie'
  },
  {
    id: 119051,
    title: 'Wednesday',
    description: 'Wednesday Addams is sent to Nevermore Academy, a bizarre boarding school where she attempts to master her psychic powers and stop a monstrous killing spree.',
    image: 'https://image.tmdb.org/t/p/original/tML3O6z9i5Bf0gL4kL1fJzC2sQZ.jpg',
    type: 'tv'
  }
];

const HeroBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const currentMovie = SLIDES[currentIndex];

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
          className="absolute inset-0 bg-cover bg-center -z-10"
          style={{ backgroundImage: `url(${currentMovie.image})` }}
        />
      </AnimatePresence>

      {/* Gradient Overlay for smooth transition and text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FBFBFD] dark:from-brand-bg via-[#FBFBFD]/75 dark:via-brand-bg/80 to-transparent z-0 transition-colors duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#FBFBFD] dark:from-brand-bg via-[#FBFBFD]/60 dark:via-brand-bg/40 to-transparent z-0 transition-colors duration-500" />

      {/* Content Container */}
      <div className="relative z-10 max-w-2xl w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovie.id}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-heading font-extrabold text-gray-900 dark:text-white tracking-tight drop-shadow-xl"
            >
              {currentMovie.title}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-gray-700 dark:text-gray-300 text-lg md:text-xl font-medium max-w-xl leading-relaxed drop-shadow-md"
            >
              {currentMovie.description}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <Link
                href={`/stream/${currentMovie.id}?type=${currentMovie.type}`}
                className="flex items-center gap-2 bg-brand-primary text-white px-8 py-3.5 rounded-full font-bold text-lg hover:bg-brand-primary/80 transition-all hover:scale-105 shadow-lg shadow-brand-primary/30"
              >
                <Play fill="currentColor" size={22} />
                Watch Now
              </Link>
              
              <button className="flex items-center gap-2 bg-gray-900/10 dark:bg-white/10 backdrop-blur-md border border-gray-900/20 dark:border-white/20 text-gray-900 dark:text-white px-8 py-3.5 rounded-full font-bold text-lg hover:bg-gray-900/20 dark:hover:bg-white/20 transition-all shadow-xl">
                <Info size={22} />
                More Info
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-6 md:left-16 flex items-center gap-3 z-20">
        {SLIDES.map((_, index) => (
          <div 
            key={index} 
            className="h-1.5 rounded-full bg-black/20 dark:bg-white/20 overflow-hidden cursor-pointer"
            style={{ width: index === currentIndex ? '48px' : '16px', transition: 'width 0.4s ease' }}
            onClick={() => setCurrentIndex(index)}
          >
            {index === currentIndex && (
              <motion.div
                key={currentIndex}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 7, ease: "linear" }}
                className="h-full bg-brand-primary"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
