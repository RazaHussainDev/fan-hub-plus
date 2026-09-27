'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

/**
 * PHASE 2 — SPEED: YouTube-style slim progress bar on navigation.
 * No more full white-screen flash between pages.
 * NProgress bar styles are in globals.css (#nprogress).
 */
NProgress.configure({
  minimum: 0.15,
  easing: 'ease',
  speed: 350,
  showSpinner: false,
  trickleSpeed: 120,
});

function ProgressInner() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  return null;
}

export default function NavigationProgress() {
  // Global click delegation — starts progress on any internal link tap
  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest('a[href]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href) return;
      if (href.startsWith('/') || href.startsWith(window.location.origin)) {
        NProgress.start();
      }
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return (
    <Suspense fallback={null}>
      <ProgressInner />
    </Suspense>
  );
}
