'use client';

import { useState } from 'react';

export default function SplashIntro() {
  const [showIntro, setShowIntro] = useState(true);

  if (!showIntro) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden">
      <video 
        src="/intro.mp4" 
        autoPlay 
        muted 
        playsInline 
        onEnded={() => setShowIntro(false)}
        onError={() => setShowIntro(false)}
        className="w-full h-full object-cover"
      />
      <button
        onClick={() => setShowIntro(false)}
        className="absolute top-6 right-6 z-10 text-white/60 hover:text-white text-xs uppercase tracking-widest font-bold px-4 py-2 rounded-full border border-white/20 bg-black/40 backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
      >
        Skip
      </button>
    </div>
  );
}
