'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const CustomPlayer = dynamic(() => import('@/components/CustomPlayer'), { 
  ssr: false,
  loading: () => <div className="w-full aspect-video bg-gray-900 rounded-xl flex items-center justify-center border border-gray-800"><span className="text-gray-400">Loading Player Component...</span></div>
});

export default function MoneyHeistPlayer() {
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [videoSrc, setVideoSrc] = useState(null);
  const [isTorrent, setIsTorrent] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const seasons = [1, 2, 3, 4, 5];
  const episodes = Array.from({ length: 10 }, (_, i) => i + 1);
  const tmdbId = 71446;

  useEffect(() => {
    const fetchStream = async () => {
      setLoading(true);
      setError(null);
      setVideoSrc(null);
      setIsTorrent(false);
      setFallbackUrl(null);
      
      try {
        const response = await fetch(`http://localhost:5000/api/content/stream/${tmdbId}?season=${season}&episode=${episode}`);
        const data = await response.json();
        
        if (data.success && data.data && data.data.streamUrl) {
          setVideoSrc(data.data.streamUrl);
          setIsTorrent(data.data.isTorrent || false);
        } else {
          // Trigger fallback gracefully
          setFallbackUrl(`https://autoembed.co/tv/tmdb/${tmdbId}-${season}-${episode}`);
        }
      } catch (err) {
        console.error('API Fetch Error:', err);
        // Trigger fallback gracefully
        setFallbackUrl(`https://autoembed.co/tv/tmdb/${tmdbId}-${season}-${episode}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStream();
  }, [season, episode]);

  return (
    <main className="min-h-screen bg-gray-950 text-gray-50 p-6 md:p-12 font-body flex flex-col items-center">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight mb-2">
            Money Heist <span className="text-gray-400 font-normal text-2xl md:text-3xl">(La Casa de Papel)</span>
          </h1>
          <p className="text-emerald-400 font-medium">HLS.js + Plyr Multi-Audio PoC (API Connected)</p>
        </header>

        {/* Video Player Container */}
        <div className="mb-8 w-full">
          {fallbackUrl && !loading && (
            <div className="mb-2 text-right">
              <span className="bg-amber-600/20 text-amber-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-amber-500/30">
                ⚠️ Playing via Fallback Server
              </span>
            </div>
          )}

          {loading ? (
            <div className="w-full aspect-video bg-gray-900 rounded-xl flex flex-col gap-4 items-center justify-center border border-gray-800 shadow-2xl">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-400 font-medium">Fetching Stream...</span>
            </div>
          ) : fallbackUrl ? (
            <div className="w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-amber-800/50 relative aspect-video">
              <iframe
                src={fallbackUrl}
                title={`Money Heist Season ${season} Episode ${episode}`}
                className="absolute top-0 left-0 w-full h-full border-0"
                allowFullScreen
                referrerPolicy="origin"
              />
            </div>
          ) : videoSrc ? (
            <CustomPlayer isTorrent={isTorrent} videoSrc={videoSrc} />
          ) : error ? (
             <div className="w-full aspect-video bg-gray-900 rounded-xl flex items-center justify-center border border-red-800 shadow-2xl">
              <span className="text-red-400 font-medium">{error}</span>
            </div>
          ) : null}
        </div>

        {/* Controls Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg space-y-6">
          {/* Season Selector */}
          <div>
            <h2 className="text-sm uppercase tracking-wider text-gray-400 font-semibold mb-3">
              Select Season
            </h2>
            <div className="flex flex-wrap gap-2">
              {seasons.map((s) => (
                <button
                  key={`season-${s}`}
                  onClick={() => {
                    setSeason(s);
                    setEpisode(1); // Reset to ep 1 on season change
                  }}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    season === s
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50 scale-105'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Season {s}
                </button>
              ))}
            </div>
          </div>

          {/* Episode Selector */}
          <div>
            <h2 className="text-sm uppercase tracking-wider text-gray-400 font-semibold mb-3">
              Select Episode
            </h2>
            <div className="flex flex-wrap gap-2">
              {episodes.map((ep) => (
                <button
                  key={`episode-${ep}`}
                  onClick={() => setEpisode(ep)}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg font-medium transition-all duration-200 ${
                    episode === ep
                      ? 'bg-red-600 text-white shadow-md shadow-red-900/50 scale-105'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {ep}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
