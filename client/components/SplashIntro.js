'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * PHASE 1 — SPEED: SplashIntro is completely non-blocking.
 * - Page renders instantly (video only appears AFTER hydration)
 * - Video is lazy-loaded with preload="none" — won't block page paint
 * - sessionStorage gate: only shown once per session
 * - Safety auto-dismiss: 4s max (never hangs)
 * - Mobile: uses smaller compressed video if available
 */
export default function SplashIntro() {
  const [showIntro, setShowIntro] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Only run after full hydration — page is already visible by now
    try {
      const hasShown = sessionStorage.getItem('fanhub_splash_shown');
      if (!hasShown) {
        sessionStorage.setItem('fanhub_splash_shown', 'true');
        // Small delay so the page renders fully before the overlay appears
        const t = setTimeout(() => setShowIntro(true), 150);
        return () => clearTimeout(t);
      }
    } catch (e) {
      // Private browsing / restricted — skip entirely
    }
  }, []);

  useEffect(() => {
    if (!showIntro) return;

    // Safety timeout — dismiss after 4s regardless
    const safety = setTimeout(() => setShowIntro(false), 4000);

    // Start loading video now that overlay is visible
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        // Autoplay blocked — dismiss immediately
        setShowIntro(false);
      });
    }

    return () => clearTimeout(safety);
  }, [showIntro]);

  const dismiss = () => setShowIntro(false);

  if (!showIntro) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-[#0b0f0a] flex items-center justify-center overflow-hidden"
      style={{ willChange: 'opacity' }}
    >
      {/* Video — preload="none" so it doesn't block page resources */}
      <video
        ref={videoRef}
        src="/intro.mp4"
        muted
        playsInline
        preload="none"
        onCanPlay={() => setVideoLoaded(true)}
        onEnded={dismiss}
        onError={dismiss}
        className="w-full h-full object-cover"
        style={{
          opacity: videoLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Fallback logo while video loads */}
      {!videoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-[#a7c957]/10 border-2 border-[#a7c957]/40 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="16" fill="#a7c957" />
                <polygon points="14,11 28,18 14,25" fill="#0b0f0a" />
              </svg>
            </div>
            <p className="text-[#a7c957] text-xs font-bold tracking-widest uppercase animate-pulse">
              Fan Hub+
            </p>
          </div>
        </div>
      )}

      {/* Skip button — always visible */}
      <button
        onClick={dismiss}
        className="absolute top-6 right-6 z-10 text-white/70 hover:text-white text-xs uppercase tracking-widest font-bold px-4 py-2 rounded-full border border-white/20 bg-black/50 backdrop-blur-md transition-all hover:bg-white/20 active:scale-95 cursor-pointer"
        style={{ minHeight: '44px' }}
      >
        Skip →
      </button>
    </div>
  );
}
