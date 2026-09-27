'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Gamepad2, Film, Tv, Music, BookOpen, Book, Users, Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
  { id: 1, name: 'Movies', icon: Film, image: 'https://image.tmdb.org/t/p/original/eZ239CUp1d6OryZEBPnO2n87gMG.jpg' },
  { id: 2, name: 'TV Shows', icon: Tv, image: 'https://image.tmdb.org/t/p/original/9P4IIMYY3HifqeruZq0ZZ9g7YUi.jpg' },
  { id: 3, name: 'Anime', icon: Star, image: 'https://image.tmdb.org/t/p/original/3GQKYh6Trm8pxd2AypovoYQf4Ay.jpg' },
  { id: 4, name: 'Gaming', icon: Gamepad2, image: 'https://image.tmdb.org/t/p/original/5cvnxEHT3e39DvT6ARw4GNCFrB0.jpg' },
  { id: 5, name: 'K-Pop', icon: Music, image: 'https://image.tmdb.org/t/p/original/vpo3qdjgasu2kxHIKkNIXK9hDHM.jpg' },
  { id: 6, name: 'Comics', icon: BookOpen, image: 'https://image.tmdb.org/t/p/original/kVd3a9YeLGkoeR50jGEXM6EqseS.jpg' },
  { id: 7, name: 'Manga', icon: Book, image: 'https://image.tmdb.org/t/p/original/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg' },
  { id: 8, name: 'Cosplay', icon: Users, image: 'https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?w=1920&q=100' },
];

export default function CurvedCategorySlider() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getOffset = (index) => {
    let offset = index - activeIndex;
    const length = categories.length;
    const half = Math.floor(length / 2);
    if (offset > half) offset -= length;
    if (offset < -half) offset += length;
    return offset;
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % categories.length);
  };

  return (
    <section className="w-full py-8 md:py-12 overflow-hidden relative z-30">
      <div className="max-w-7xl mx-auto px-4 mb-2 text-center">
        <h2 className="text-xl md:text-2xl font-bold font-heading text-[#1d1d1f] dark:text-white">Explore Fandoms</h2>
        <p className="text-[#86868b] dark:text-gray-400 text-xs sm:text-sm mt-1">Discover communities matching your interests</p>
      </div>

      <div className={`relative w-full max-w-[1400px] mx-auto ${isMobile ? 'h-[320px]' : 'h-[440px]'} flex justify-center items-center overflow-hidden [perspective:1200px]`}>
        {categories.map((category, index) => {
          const offset = getOffset(index);

          let transform = '';
          let zIndex = 50 - Math.abs(offset);
          let opacity = Math.abs(offset) >= (isMobile ? 3 : 4) ? 0 : 1;

          const step = isMobile ? 80 : 180;
          const zDepth = isMobile ? 50 : 80;

          if (offset === 0) {
            transform = `translateX(0px) translateZ(${isMobile ? '80px' : '150px'}) rotateY(0deg) scale(${isMobile ? 1.05 : 1.1})`;
          } else if (offset < 0) {
            transform = `translateX(${offset * step}px) translateZ(${-Math.abs(offset) * zDepth}px) rotateY(${isMobile ? 25 : 35}deg) scale(${isMobile ? 0.85 : 0.9})`;
          } else {
            transform = `translateX(${offset * step}px) translateZ(${-Math.abs(offset) * zDepth}px) rotateY(${isMobile ? -25 : -35}deg) scale(${isMobile ? 0.85 : 0.9})`;
          }

          const isActive = offset === 0;

          return (
            <div
              key={category.id}
              onClick={() => {
                if (isActive) {
                  router.push(`/explore?category=${encodeURIComponent(category.name)}`);
                } else {
                  setActiveIndex(index);
                }
              }}
              style={{ transform, zIndex, opacity }}
              className={`absolute w-36 h-52 sm:w-52 sm:h-72 rounded-2xl bg-gray-900 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] cursor-pointer shadow-2xl group select-none ${
                isActive 
                  ? 'border-2 border-brand-primary shadow-[0_20px_50px_rgba(0,0,0,0.8)]' 
                  : 'border border-white/5 opacity-60 hover:opacity-85'
              }`}
            >
              {/* Background Image */}
              <img 
                src={category.image}
                alt={`${category.name} Wallpaper`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className={`absolute inset-0 transition-opacity duration-700 ${isActive ? 'bg-gradient-to-t from-brand-bg via-brand-bg/40 to-transparent' : 'bg-brand-bg/80'}`} />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-3 sm:p-5 flex flex-col items-center justify-end text-center z-10">
                <category.icon className={`w-6 h-6 sm:w-8 sm:h-8 mb-1.5 transition-colors duration-500 ${isActive ? 'text-brand-primary drop-shadow-md' : 'text-gray-500'}`} />
                <h3 className={`font-bold text-sm sm:text-base tracking-wide transition-colors duration-500 ${isActive ? 'text-brand-light' : 'text-gray-400'} font-heading`}>
                  {category.name}
                </h3>
                {isActive && (
                  <span className="mt-1 sm:mt-2 inline-flex items-center gap-1 text-[9px] sm:text-[11px] font-bold text-brand-primary uppercase tracking-widest bg-brand-primary/10 px-2 py-0.5 rounded-full border border-brand-primary/30">
                    Explore <ArrowRight size={10} />
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Mobile Navigation Controls */}
        <button
          onClick={handlePrev}
          aria-label="Previous Category"
          className="absolute left-2 z-50 p-2 rounded-full bg-black/60 text-white hover:text-brand-primary border border-white/10 md:hidden backdrop-blur-md active:scale-95 transition-all"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Category"
          className="absolute right-2 z-50 p-2 rounded-full bg-black/60 text-white hover:text-brand-primary border border-white/10 md:hidden backdrop-blur-md active:scale-95 transition-all"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
