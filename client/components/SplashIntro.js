'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * SplashIntro — Instant Cinematic Video Intro
 * - Renders immediately on first visit without layout delay
 * - Plays /intro.mp4 with high performance while background website hydrates
 * - Smoothly fades out upon video completion or skip, revealing the website
 * - Uses sessionStorage so it only displays once per user session
 */
export default function SplashIntro() {
  const [showIntro, setShowIntro] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    try {
      const hasShown = sessionStorage.getItem('fanhub_splash_shown');
      if (hasShown) {
        setShowIntro(false);
        return;
      }
      sessionStorage.setItem('fanhub_splash_shown', 'true');
    } catch (e) {
      // Private browsing / restricted
    }

    // Auto-play video immediately
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // If autoplay is blocked by browser policy, keep video ready
      });
    }

    // Maximum safety timeout: dismiss after 8s regardless
    const safety = setTimeout(() => {
      handleDismiss();
    }, 8000);

    return () => clearTimeout(safety);
  }, []);

  const handleDismiss = () => {
    setIsFading(true);
    setTimeout(() => {
      setShowIntro(false);
    }, 500); // 500ms smooth fade transition
  };

  if (!showIntro) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-[#0b0f0a] flex items-center justify-center overflow-hidden transition-opacity duration-500 ease-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ willChange: 'opacity' }}
    >
      {/* Intro Video */}
      <video
        ref={videoRef}
        src="/intro.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={handleDismiss}
        onError={handleDismiss}
        className="w-full h-full object-cover"
      />

      {/* Skip button — instant escape */}
      <button
        onClick={handleDismiss}
        className="absolute top-6 right-6 z-10 text-white/80 hover:text-white text-xs uppercase tracking-widest font-bold px-4 py-2 rounded-full border border-white/20 bg-black/60 backdrop-blur-md transition-all hover:bg-white/20 active:scale-95 cursor-pointer shadow-lg"
        style={{ minHeight: '40px' }}
      >
        Skip →
      </button>
    </div>
  );
}
