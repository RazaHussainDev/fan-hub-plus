'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { fetchDetails, BASE_IMG_URL } from '@/utils/tmdb';


import { useParams, useSearchParams } from 'next/navigation';

export default function StreamPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const tmdbId = params?.tmdbId;
  const contentType = searchParams?.get('type') || 'movie';
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [sources, setSources] = useState(null);
  const [activeLayer, setActiveLayer] = useState('primary');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [metadata, setMetadata] = useState(null);



  useEffect(() => {
    const fetchMeta = async () => {
      if (!tmdbId) return;
      try {
        let data = await fetchDetails(tmdbId, contentType).catch(() => null);
        if (data) {
          setMetadata(data);
          const validSeasons = data?.seasons?.filter(s => s.season_number > 0) || [];
          if (validSeasons.length > 0 && season === 1) {
            setSeason(validSeasons[0].season_number);
          }
        }
      } catch (err) {
        console.error("Failed to fetch metadata", err);
      }
    };
    fetchMeta();
  }, [tmdbId, contentType]);

  useEffect(() => {
    const fetchStream = async () => {
      if (!metadata) return;

      setLoading(true);
      setError(null);
      setSources(null);
      setActiveLayer('primary');
      
      try {
        const urlParams = contentType === 'tv' ? `&season=${season}&episode=${episode}` : '';
        const response = await fetch(`http://localhost:5000/api/content/stream/${tmdbId}?type=${contentType}${urlParams}`);
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
  const releaseYear = metadata?.release_date?.split('-')[0] || metadata?.first_air_date?.split('-')[0] || '';

  // Dynamic Seasons & Episodes

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
            {title} {releaseYear && `(${releaseYear})`} {contentType === 'tv' ? `- S${season < 10 ? '0'+season : season} E${episode < 10 ? '0'+episode : episode}` : ''}
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
                title={`${title} - ${contentType === 'tv' ? 'S'+season+'E'+episode : 'Movie'}`}
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
        {contentType === 'tv' && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg space-y-6">
            {/* SEASON SELECTOR */}
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-400 mb-2">SELECT SEASON</h3>
              <div className="flex flex-wrap gap-2">
                {metadata?.seasons?.filter(s => s.season_number > 0).map((s) => (
                  <button
                    key={s.season_number}
                    onClick={() => {
                      setSeason(s.season_number);
                      setEpisode(1);
                    }}
                    className={`px-4 py-2 rounded-md ${season === s.season_number ? 'bg-brand-primary text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                  >
                    Season {s.season_number}
                  </button>
                ))}
              </div>
            </div>

            {/* EPISODE SELECTOR */}
            <div className="mb-40">
              <h3 className="text-sm font-bold text-gray-400 mb-2">SELECT EPISODE</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: metadata?.seasons?.find(s => s.season_number === season)?.episode_count || 0 }, (_, i) => i + 1).map((ep) => (
                  <button
                    key={ep}
                    onClick={() => setEpisode(ep)}
                    className={`px-4 py-2 rounded-md ${episode === ep ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
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
