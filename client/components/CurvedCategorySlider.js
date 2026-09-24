'use client';

import { useState } from 'react';
import { Gamepad2, Film, Tv, Music, BookOpen, Book, Users, Zap, TrendingUp } from 'lucide-react';

const categories = [
  { id: 1, name: 'Trending Now', icon: TrendingUp, image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800' },
  { id: 2, name: 'Blockbuster', icon: Film, image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800' },
  { id: 3, name: 'Action', icon: Zap, image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800' },
  { id: 4, name: 'Sci-Fi', icon: BookOpen, image: 'https://images.unsplash.com/photo-1612036782180-6f0b6ce846ce?w=800' },
  { id: 5, name: 'Anime', icon: Tv, image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800' },
  { id: 6, name: 'K-Dramas', icon: Music, image: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5646d?w=800' },
  { id: 7, name: 'Documentary', icon: Book, image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800' },
  { id: 8, name: 'Gaming', icon: Gamepad2, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800' },
];

export default function CurvedCategorySlider() {
  const [activeIndex, setActiveIndex] = useState(3);

  return (
    <section className="w-full py-12 overflow-hidden relative z-30">
      <div className="max-w-7xl mx-auto px-4 mb-2 text-center">
        <h2 className="text-2xl font-bold font-heading text-[#1d1d1f] dark:text-white">Explore Fandoms</h2>
        <p className="text-[#86868b] dark:text-gray-400 text-sm mt-1">Discover communities matching your interests</p>
      </div>

      <div className="relative w-full h-[400px] flex justify-center items-center overflow-hidden [perspective:1200px]">
        {categories.map((category, index) => {
          const offset = index - activeIndex;

          let transform = '';
          let zIndex = 50 - Math.abs(offset);
          let opacity = Math.abs(offset) > 3 ? 0 : 1; // Hide cards too far away

          if (offset === 0) {
            // Center active card
            transform = 'translateX(0px) translateZ(50px) rotateY(0deg) scale(1.1)';
          } else if (offset < 0) {
            // Left cards
            transform = `translateX(${offset * 140}px) translateZ(-100px) rotateY(35deg) scale(0.85)`;
          } else {
            // Right cards
            transform = `translateX(${offset * 140}px) translateZ(-100px) rotateY(-35deg) scale(0.85)`;
          }

          const isActive = offset === 0;

          return (
            <div
              key={category.id}
              onClick={() => setActiveIndex(index)}
              style={{ transform, zIndex, opacity }}
              className={`absolute transition-all duration-500 ease-out [transform-style:preserve-3d] cursor-pointer overflow-hidden group select-none rounded-2xl w-48 h-64
                ${isActive 
                  ? 'border-2 border-brand-primary shadow-[0_0_30px_rgba(139,92,246,0.6)]' 
                  : 'border border-black/10 dark:border-white/10 shadow-lg'
                }
              `}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              
              {/* Overlay */}
              <div className={`absolute inset-0 transition-opacity duration-500 ${isActive ? 'bg-gradient-to-t from-black/90 via-black/20 to-transparent' : 'bg-black/60'}`} />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col items-center justify-end text-center">
                <category.icon className={`w-8 h-8 mb-2 ${isActive ? 'text-brand-primary drop-shadow-[0_0_10px_rgba(139,92,246,0.8)]' : 'text-gray-400'}`} />
                <h3 className={`font-bold tracking-wide ${isActive ? 'text-white' : 'text-gray-300'} font-heading`}>
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
