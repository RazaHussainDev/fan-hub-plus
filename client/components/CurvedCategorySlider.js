'use client';

import { useState } from 'react';
import { Gamepad2, Film, Tv, Music, BookOpen, Book, Users, Star } from 'lucide-react';

const categories = [
  { id: 1, name: 'Anime', icon: Star, image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800' },
  { id: 2, name: 'Gaming', icon: Gamepad2, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800' },
  { id: 3, name: 'Movies', icon: Film, image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800' },
  { id: 4, name: 'TV Shows', icon: Tv, image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800' },
  { id: 5, name: 'K-Pop', icon: Music, image: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5646d?w=800' },
  { id: 6, name: 'Comics', icon: BookOpen, image: 'https://images.unsplash.com/photo-1612036782180-6f0b6ce846ce?w=800' },
  { id: 7, name: 'Manga', icon: Book, image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800' },
  { id: 8, name: 'Cosplay', icon: Users, image: 'https://images.unsplash.com/photo-1542458578-83bba01bcac6?w=800' },
];

export default function CurvedCategorySlider() {
  const [activeIndex, setActiveIndex] = useState(3);

  return (
    <section className="w-full py-12 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 mb-2">
        <h2 className="text-2xl font-bold font-heading text-[#1d1d1f] dark:text-white">Explore Fandoms</h2>
        <p className="text-[#86868b] dark:text-gray-400 text-sm mt-1">Discover communities matching your interests</p>
      </div>

      <div className="w-full [perspective:1000px] flex justify-center items-center py-10 relative">
        <div className="relative flex justify-center items-center w-full max-w-6xl h-64 [transform-style:preserve-3d]">
          {categories.map((category, index) => {
            const isActive = index === activeIndex;
            const isLeft = index < activeIndex;
            const isRight = index > activeIndex;
            const diff = Math.abs(index - activeIndex);

            let transform = 'translate(-50%, -50%) ';
            let zIndex = 50 - diff;
            
            const offset = diff * 120; // Fan out distance

            if (isActive) {
              transform += 'translateX(0px) rotateY(0deg) scale(1.1) translateZ(50px)';
            } else if (isLeft) {
              transform += `translateX(-${offset}px) rotateY(25deg) scale(0.9) translateZ(-20px)`;
            } else if (isRight) {
              transform += `translateX(${offset}px) rotateY(-25deg) scale(0.9) translateZ(-20px)`;
            }

            const opacity = diff > 3 ? 0 : 1;
            const pointerEvents = diff > 3 ? 'none' : 'auto';

            return (
              <div
                key={category.id}
                onClick={() => setActiveIndex(index)}
                className={`absolute left-1/2 top-1/2 w-48 h-64 rounded-2xl cursor-pointer transition-all duration-500 ease-out overflow-hidden group select-none
                  ${isActive ? 'border-2 border-brand-primary shadow-[0_0_20px_rgba(139,92,246,0.6)]' : 'border border-black/10 dark:border-white/10 shadow-lg'}
                `}
                style={{
                  transform,
                  zIndex,
                  opacity,
                  pointerEvents
                }}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col items-center justify-end text-center">
                  <category.icon className={`w-8 h-8 mb-2 ${isActive ? 'text-brand-primary drop-shadow-[0_0_10px_rgba(139,92,246,0.8)]' : 'text-gray-300'}`} />
                  <h3 className={`font-bold tracking-wide ${isActive ? 'text-white' : 'text-gray-200'} font-heading`}>
                    {category.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
