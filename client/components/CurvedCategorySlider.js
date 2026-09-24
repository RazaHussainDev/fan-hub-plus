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
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="w-full py-16 overflow-x-clip overflow-y-visible relative z-30">
      {/* 3D Perspective Wrapper */}
      <div className="w-full [perspective:1400px] flex justify-center items-center overflow-visible">
        
        {/* Transform Container */}
        <div className="flex justify-center items-center gap-2 sm:gap-4 w-full max-w-[1600px] px-2 sm:px-6 [transform-style:preserve-3d]">
          {categories.map((category, index) => {
            const isActive = index === activeIndex;
            
            // Calculate Concave Arc
            const middle = (categories.length - 1) / 2;
            const diff = index - middle;
            
            // Left side rotates right (+), Right side rotates left (-)
            const rotateY = -diff * 8; 
            // Pull the outer edges closer to the user to form a wraparound screen
            const translateZ = Math.abs(diff) * 25;
            // Optionally drop them slightly to make a "smile" curve
            const translateY = Math.abs(diff) * 2;

            return (
              <div
                key={category.id}
                onClick={() => setActiveIndex(index)}
                className={`relative shrink-0 w-[20vw] sm:w-[12vw] min-w-[110px] sm:min-w-[150px] max-w-[220px] aspect-[4/3] sm:aspect-[1.2] rounded-2xl cursor-pointer transition-all duration-500 ease-out overflow-hidden group
                  ${isActive 
                    ? 'ring-2 ring-[#a855f7] shadow-[0_0_30px_rgba(168,85,247,0.7)] z-50 scale-105' 
                    : 'border border-white/10 shadow-2xl hover:border-white/30 z-10'
                  }
                `}
                style={{
                  transform: `rotateY(${rotateY}deg) translateZ(${translateZ}px) translateY(${translateY}px)`,
                }}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                
                {/* Gradients to match the reference UI */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent opacity-95" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/60 to-transparent opacity-50" />
                
                {/* Icon & Title */}
                <div className="absolute bottom-3 left-3 right-2 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <div className={`p-1.5 sm:p-2 rounded-full backdrop-blur-md ${isActive ? 'bg-white/20 text-white' : 'bg-black/40 text-gray-300'}`}>
                    <category.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <h3 className={`font-bold tracking-wide text-[10px] sm:text-xs md:text-sm leading-tight ${isActive ? 'text-white' : 'text-gray-300'} font-heading line-clamp-2`}>
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
