import React from 'react';
import Link from 'next/link';
import { Play, Info } from 'lucide-react';

const HeroBanner = () => {
  return (
    <div className="relative w-full h-[80vh] min-h-[600px] flex items-end pb-24 md:pb-32 px-6 md:px-16">
      {/* Background Image with absolute positioning */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://image.tmdb.org/t/p/original/gYZsxcEUe9D7FjGnlq6s3w90x10.jpg')" }}
      />
      
      {/* Gradient Overlay for smooth transition into the dark theme */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-brand-bg via-brand-bg/50 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-brand-bg via-brand-bg/60 to-transparent" />

      {/* Content Container */}
      <div className="relative z-20 max-w-2xl w-full space-y-6">
        <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white tracking-tight drop-shadow-xl">
          Money Heist
        </h1>
        
        <p className="text-gray-300 text-lg md:text-xl font-medium max-w-xl leading-relaxed drop-shadow-md">
          To carry out the biggest heist in history, a mysterious man called The Professor recruits a band of eight robbers who have a single characteristic: none of them has anything to lose.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-4">
          <Link
            href="/money-heist"
            className="flex items-center gap-2 bg-brand-primary text-white px-8 py-3.5 rounded-full font-bold text-lg hover:bg-brand-primary/80 transition-all hover:scale-105 shadow-lg shadow-brand-primary/30"
          >
            <Play fill="currentColor" size={22} />
            Watch Now
          </Link>
          
          <button className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3.5 rounded-full font-bold text-lg hover:bg-white/20 transition-all shadow-xl">
            <Info size={22} />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
