/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org' }
    ],
    qualities: [25, 50, 75, 90, 100],
  },
};

export default nextConfig;
