'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ContinueWatchingHero({ data = [] }) {
  const scrollRef = useRef(null);

  const scroll = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (!data || data.length === 0) return null;

  return (
    <div className="absolute bottom-8 right-8 w-full max-w-lg lg:max-w-2xl [perspective:1200px] z-40 hidden md:block group/container">
      
      {/* 3D Tilted Glass Container */}
      <div 
        className="bg-white/10 dark:bg-black/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl p-5 shadow-[0_30px_50px_rgba(0,0,0,0.5)] transition-all duration-700 ease-out preserve-3d"
        style={{ transform: "rotateX(15deg) rotateY(-5deg) translateZ(20px)" }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "rotateX(5deg) rotateY(0deg) translateZ(40px) scale(1.02)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "rotateX(15deg) rotateY(-5deg) translateZ(20px)"; }}
      >
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-white font-bold text-lg tracking-wide drop-shadow-md">Continue Watching</h3>
          <div className="flex gap-2 opacity-0 group-hover/container:opacity-100 transition-opacity duration-300">
            <button 
              onClick={() => scroll(-300)} 
              className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => scroll(300)} 
              className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll */}
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2 pt-1 px-1 -mx-1"
        >
          {data.map((item, i) => {
            // Generate a random progress percentage for the mock UI
            const progress = 30 + (i * 15) % 60; 
            
            return (
              <Link 
                key={item.id} 
                href={`/stream/${item.id}?type=${item.media_type || 'tv'}`}
                className="relative shrink-0 w-48 h-28 rounded-xl overflow-hidden group/card cursor-pointer border border-white/10 shadow-lg hover:border-brand-primary/50 hover:shadow-[0_0_20px_rgba(167,201,87,0.3)] transition-all duration-300"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 transition-transform duration-500 group-hover/card:scale-110"
                >
                  <img src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`} alt={item.title || item.name} loading="lazy" className="w-full h-full object-cover" />
                </div>
                
                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                {/* Play Hover State */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-[2px]">
                  <PlayCircle size={36} className="text-white drop-shadow-lg" />
                </div>

                {/* Title */}
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white text-xs font-bold truncate drop-shadow-md">
                    {item.title || item.name}
                  </p>
                </div>

                {/* Progress Bar Container */}
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-800/80">
                  <div 
                    className="h-full bg-brand-primary rounded-r-full shadow-[0_0_10px_rgba(167,201,87,0.8)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
