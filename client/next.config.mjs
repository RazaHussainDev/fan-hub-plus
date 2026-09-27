/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─── PHASE 2 SPEED: Enable gzip/brotli compression ───────────────
  compress: true,

  // ─── PHASE 1 SPEED: Image optimization ───────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
    qualities: [40, 60, 75, 90],
    // Optimize for mobile sizes
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 160, 256],
    // Minimize layout shift
    minimumCacheTTL: 3600,
  },

  // ─── PHASE 3 SPEED: Package optimization ─────────────────────────
  experimental: {
    // Optimize package imports to reduce bundle size
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // ─── PHASE 2 SPEED: Strict HTTP cache headers ────────────────────
  async headers() {
    return [
      {
        // Cache static assets aggressively
        source: '/(.*)\\.(png|jpg|jpeg|gif|webp|avif|ico|svg)$',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Cache intro video in browser (avoid re-downloading on every visit)
        source: '/intro.mp4',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
          { key: 'Accept-Ranges', value: 'bytes' },
        ],
      },
    ];
  },
};

export default nextConfig;
