'use client';

import { useState, useEffect, use } from 'react';
import dynamic from 'next/dynamic';
import { fetchDetails, BASE_IMG_URL } from '@/utils/tmdb';



export default function StreamPage({ params }) {
  const { tmdbId } = use(params);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [sources, setSources] = useState(null);
  const [activeLayer, setActiveLayer] = useState('primary');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [metadata, setMetadata] = useState(null);

  const seasons = [1, 2, 3, 4, 5];
  const episodes = Array.from({ length: 10 }, (_, i) => i + 1);



  useEffect(() => {
    const fetchMeta = async () => {
      try {
        let data = await fetchDetails(tmdbId, 'tv').catch(() => null);
        if (!data || data.success === false) {
          data = await fetchDetails(tmdbId, 'movie').catch(() => null);
        }
        if (data) {
          setMetadata(data);
        }
      } catch (err) {
        console.error("Failed to fetch metadata", err);
      }
    };
    fetchMeta();
  }, [tmdbId]);

  useEffect(() => {
    const fetchStream = async () => {
      if (!metadata) return;

      setLoading(true);
      setError(null);
      setSources(null);
      setActiveLayer('primary');
      
      try {
        const contentType = metadata.media_type;
        const response = await fetch(`http://localhost:5000/api/content/stream/${tmdbId}?type=${contentType}&season=${season}&episode=${episode}`);
        const data = await response.json();
        
        if (data.success && data.data && data.data.primary) {
          setSources(data.data);
          setActiveLayer('primary');
          setError(null);
        } else {
          setError("Failed to fetch stream sources.");
        }
      } catch (err) {
        console.error('API Fetch Error:', err);
        setError("Network error. Could not reach backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchStream();
  }, [tmdbId, metadata, season, episode]);

  const title = metadata?.name || metadata?.title || 'Loading...';
  const backdrop = metadata?.backdrop_path ? `https://image.tmdb.org/t/p/original${metadata.backdrop_path}` : null;

  return (
    <main className="relative min-h-screen bg-brand-bg text-gray-50 p-6 md:p-12 font-body flex flex-col items-center overflow-hidden">
      {/* Cinematic Faded Background */}
      {backdrop && (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url('${backdrop}')` }}
        />
      )}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-brand-bg via-brand-bg/80 to-transparent" />

      <div className="relative z-10 max-w-5xl w-full">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight mb-2 drop-shadow-lg">
            {title}
          </h1>
          <p className="text-brand-primary font-medium">Hydra Cascade Engine Active</p>
        </header>

        {/* Video Player Container */}
        <div className="mb-8 w-full">
          {loading ? (
            <div className="w-full aspect-video bg-gray-900 rounded-xl flex flex-col gap-4 items-center justify-center border border-gray-800 shadow-2xl">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-400 font-medium">Fetching Stream...</span>
            </div>
          ) : error ? (
            <div className="w-full aspect-video bg-gray-900 rounded-xl flex items-center justify-center border border-red-800 shadow-2xl">
              <span className="text-red-400 font-medium">{error}</span>
            </div>
          ) : sources && sources[activeLayer] ? (
            <div className="w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800 relative aspect-video">
              <iframe
                src={sources[activeLayer]}
                title={`${title} - Video Player`}
                className="absolute top-0 left-0 w-full h-full border-0"
                allowFullScreen
                referrerPolicy="origin"
              />
            </div>
          ) : null}

          {/* Server Switching UI */}
          {sources && (
            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              <span className="text-sm text-gray-400 font-medium flex items-center mr-2">If video is buffering, change server:</span>
              <button
                onClick={() => setActiveLayer('primary')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeLayer === 'primary' ? 'bg-brand-primary text-white shadow-lg' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Server 1 (Primary)
              </button>
              <button
                onClick={() => setActiveLayer('backup1')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeLayer === 'backup1' ? 'bg-brand-primary text-white shadow-lg' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Server 2 (Backup)
              </button>
              <button
                onClick={() => setActiveLayer('backup2')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeLayer === 'backup2' ? 'bg-brand-primary text-white shadow-lg' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Server 3 (Alt)
              </button>
            </div>
          )}
        </div>

        {/* Controls Section */}
        {metadata?.media_type !== 'movie' && (
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
        )}
      </div>
    </main>
  );
}
