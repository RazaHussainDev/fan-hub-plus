'use client';

import { useState } from 'react';
import { Gamepad2, Film, Tv, Music, BookOpen, Book, Users, Star } from 'lucide-react';

const categories = [
  { id: 1, name: 'Movies', icon: Film, image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80' },
  { id: 2, name: 'TV Shows', icon: Tv, image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&q=80' },
  { id: 3, name: 'Anime', icon: Star, image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&q=80' },
  { id: 4, name: 'Gaming', icon: Gamepad2, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&q=80' },
  { id: 5, name: 'K-Pop', icon: Music, image: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5646d?w=500&q=80' },
  { id: 6, name: 'Comics', icon: BookOpen, image: 'https://images.unsplash.com/photo-1612036782180-6f0b6ce846ce?w=500&q=80' },
  { id: 7, name: 'Manga', icon: Book, image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&q=80' },
  { id: 8, name: 'Cosplay', icon: Users, image: 'https://images.unsplash.com/photo-1542458578-83bba01bcac6?w=500&q=80' },
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
              className={`absolute w-52 h-72 rounded-2xl bg-gray-900 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group select-none
                ${isActive 
                  ? 'border-2 border-brand-accent shadow-[0_0_25px_rgba(56,189,248,0.5)]' 
                  : ''
                }
              `}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              
              {/* Overlay */}
              <div className={`absolute inset-0 transition-opacity duration-700 ${isActive ? 'bg-gradient-to-t from-black/90 via-black/20 to-transparent' : 'bg-black/60'}`} />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col items-center justify-end text-center z-10">
                <category.icon className={`w-8 h-8 mb-2 transition-colors duration-500 ${isActive ? 'text-brand-accent drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]' : 'text-gray-400'}`} />
                <h3 className={`font-bold tracking-wide transition-colors duration-500 ${isActive ? 'text-brand-light' : 'text-gray-300'} font-heading`}>
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
