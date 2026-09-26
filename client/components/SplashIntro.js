'use client';

import React, { useState, useEffect } from 'react';

export default function SplashIntro() {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    try {
      const introPlayed = sessionStorage.getItem('introPlayed');
      if (!introPlayed) {
        setShowSplash(true);
      }
    } catch (e) {
      // In case sessionStorage is blocked (e.g. iframe or strict privacy)
      setShowSplash(false);
    }
  }, []);

  const handleDismiss = () => {
    try {
      sessionStorage.setItem('introPlayed', 'true');
    } catch (e) {}
    setShowSplash(false);
  };

  if (!showSplash) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden">
      <video
        src="/intro.mp4"
        autoPlay
        muted
        playsInline
        onEnded={handleDismiss}
        onError={handleDismiss}
        className="w-full h-full max-w-5xl max-h-[85vh] object-contain"
      />
      <button
        onClick={handleDismiss}
        className="absolute top-6 right-6 z-10 text-white/60 hover:text-white text-xs uppercase tracking-widest font-bold px-4 py-2 rounded-full border border-white/20 bg-black/40 backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
      >
        Skip Intro
      </button>
    </div>
  );
}
