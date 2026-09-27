'use client';

import { useState, useEffect } from 'react';

export default function SplashIntro() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // Only show once per browser session to ensure blazingly fast subsequent loads
    try {
      const hasShown = sessionStorage.getItem('fanhub_splash_shown');
      if (!hasShown) {
        setShowIntro(true);
        sessionStorage.setItem('fanhub_splash_shown', 'true');

        // Safety timeout: Auto-dismiss after 3.2s so slow connections never hang
        const safetyTimer = setTimeout(() => {
          setShowIntro(false);
        }, 3200);

        return () => clearTimeout(safetyTimer);
      }
    } catch (e) {
      // In private browsing or restricted environments, don't block UI
      setShowIntro(false);
    }
  }, []);

  if (!showIntro) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden transition-opacity duration-500">
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
        className="absolute top-6 right-6 z-10 text-white/70 hover:text-white text-xs uppercase tracking-widest font-bold px-4 py-2 rounded-full border border-white/20 bg-black/50 backdrop-blur-md transition-all hover:bg-white/20 active:scale-95 cursor-pointer"
      >
        Skip Intro
      </button>
    </div>
  );
}
