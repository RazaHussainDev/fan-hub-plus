'use client';

import { useState } from 'react';
import { Gamepad2, Film, Tv, Music, BookOpen, Book, Users, Star } from 'lucide-react';

const categories = [
  { id: 1, name: 'Movies', icon: Film, image: 'https://image.tmdb.org/t/p/original/eZ239CUp1d6OryZEBPnO2n87gMG.jpg' }, // Dune Part Two
  { id: 2, name: 'TV Shows', icon: Tv, image: 'https://image.tmdb.org/t/p/original/9P4IIMYY3HifqeruZq0ZZ9g7YUi.jpg' }, // Stranger Things
  { id: 3, name: 'Anime', icon: Star, image: 'https://image.tmdb.org/t/p/original/3GQKYh6Trm8pxd2AypovoYQf4Ay.jpg' }, // Demon Slayer
  { id: 4, name: 'Gaming', icon: Gamepad2, image: 'https://image.tmdb.org/t/p/original/5cvnxEHT3e39DvT6ARw4GNCFrB0.jpg' }, // Arcane
  { id: 5, name: 'K-Pop', icon: Music, image: 'https://image.tmdb.org/t/p/original/vpo3qdjgasu2kxHIKkNIXK9hDHM.jpg' }, // Blackpink
  { id: 6, name: 'Comics', icon: BookOpen, image: 'https://image.tmdb.org/t/p/original/kVd3a9YeLGkoeR50jGEXM6EqseS.jpg' }, // Spider-Verse
  { id: 7, name: 'Manga', icon: Book, image: 'https://image.tmdb.org/t/p/original/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg' }, // Attack on Titan
  { id: 8, name: 'Cosplay', icon: Users, image: 'https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?w=1920&q=100' }, // Epic Cosplay
];

export default function CurvedCategorySlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  const getOffset = (index) => {
    let offset = index - activeIndex;
    const length = categories.length;
    const half = Math.floor(length / 2);
    if (offset > half) offset -= length;
    if (offset < -half) offset += length;
    return offset;
  };

  return (
    <section className="w-full py-12 overflow-hidden relative z-30">
      <div className="max-w-7xl mx-auto px-4 mb-2 text-center">
        <h2 className="text-2xl font-bold font-heading text-[#1d1d1f] dark:text-white">Explore Fandoms</h2>
        <p className="text-[#86868b] dark:text-gray-400 text-sm mt-1">Discover communities matching your interests</p>
      </div>

      <div className="relative w-full max-w-[1400px] mx-auto h-[450px] flex justify-center items-center overflow-hidden perspective-[1200px] [perspective:1200px]">
        {categories.map((category, index) => {
          const offset = getOffset(index);

          let transform = '';
          let zIndex = 50 - Math.abs(offset);
          let opacity = Math.abs(offset) >= 4 ? 0 : 1; // Show more cards clearly

          if (offset === 0) {
            transform = 'translateX(0px) translateZ(150px) rotateY(0deg) scale(1.1)';
          } else if (offset < 0) {
            // Left side cards
            transform = `translateX(${offset * 180}px) translateZ(${-Math.abs(offset) * 80}px) rotateY(35deg) scale(0.9)`;
          } else {
            // Right side cards
            transform = `translateX(${offset * 180}px) translateZ(${-Math.abs(offset) * 80}px) rotateY(-35deg) scale(0.9)`;
          }

          const isActive = offset === 0;

          return (
            <div
              key={category.id}
              onClick={() => setActiveIndex(index)}
              style={{ transform, zIndex, opacity }}
              className={`absolute w-52 h-72 rounded-2xl bg-gray-900 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] cursor-pointer shadow-2xl group select-none
                ${isActive 
                  ? 'border border-brand-primary shadow-[0_20px_50px_rgba(0,0,0,0.8)]' 
                  : 'border border-white/5 opacity-60'
                }
              `}
            >
              {/* Background Image with Alt Text Fallback */}
              <img 
                src={category.image}
                alt={`${category.name} Wallpaper`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className={`absolute inset-0 transition-opacity duration-700 ${isActive ? 'bg-gradient-to-t from-brand-bg via-brand-bg/40 to-transparent' : 'bg-brand-bg/80'}`} />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col items-center justify-end text-center z-10">
                <category.icon className={`w-8 h-8 mb-2 transition-colors duration-500 ${isActive ? 'text-brand-primary drop-shadow-md' : 'text-gray-500'}`} />
                <h3 className={`font-bold tracking-wide transition-colors duration-500 ${isActive ? 'text-brand-light' : 'text-gray-400'} font-heading`}>
                  {category.name}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
