import React from 'react';
import Link from 'next/link';
import { Play, Info } from 'lucide-react';

const HeroBanner = () => {
  return (
    <div className="relative w-full h-[80vh] min-h-[600px] flex items-end pb-24 md:pb-32 px-6 md:px-16 overflow-hidden">
      {/* Background Image with absolute positioning */}
      <img 
        src="https://static.tvmaze.com/uploads/images/original_untouched/209/523445.jpg" 
        alt="Hero Backdrop" 
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />
      
      {/* Gradient Overlay for smooth transition and text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#f5f5f7] dark:from-brand-bg via-[#f5f5f7]/80 dark:via-brand-bg/80 to-transparent z-0 transition-colors duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#f5f5f7] dark:from-brand-bg via-[#f5f5f7]/60 dark:via-brand-bg/40 to-transparent z-0 transition-colors duration-500" />

      {/* Content Container */}
      <div className="relative z-10 max-w-2xl w-full space-y-6">
        <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-gray-900 dark:text-white tracking-tight drop-shadow-xl transition-colors">
          Money Heist
        </h1>
        
        <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl font-medium max-w-xl leading-relaxed drop-shadow-md transition-colors">
          To carry out the biggest heist in history, a mysterious man called The Professor recruits a band of eight robbers who have a single characteristic: none of them has anything to lose.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-4">
          <Link
            href="/stream/71446?type=tv"
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-brand-primary text-white px-8 py-3.5 rounded-full font-bold text-lg hover:bg-brand-primary/80 transition-all hover:scale-105 shadow-lg shadow-brand-primary/30"
          >
            <Play fill="currentColor" size={22} />
            Watch Now
          </Link>
          
          <button className="flex items-center gap-2 bg-gray-900/10 dark:bg-white/10 backdrop-blur-md border border-gray-900/20 dark:border-white/20 text-gray-900 dark:text-white px-8 py-3.5 rounded-full font-bold text-lg hover:bg-gray-900/20 dark:hover:bg-white/20 transition-all shadow-xl">
            <Info size={22} />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
