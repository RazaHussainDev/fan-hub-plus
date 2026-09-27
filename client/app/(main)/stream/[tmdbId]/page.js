'use client';

import { useState, useEffect, useMemo } from 'react';
import { fetchDetails, BASE_IMG_URL, fetchCredits, fetchVideos, fetchSimilar } from '@/utils/tmdb';
import { useParams, useSearchParams } from 'next/navigation';
import MovieRow from '@/components/MovieRow';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Play, X, Plus, Check } from 'lucide-react';
import { useWatchlist } from '@/hooks/useWatchlist';
import CustomHTML5Player from '@/components/CustomHTML5Player';
import MediaRatingSection from '@/components/MediaRatingSection';

export default function StreamPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  
  const tmdbId = params?.tmdbId;
  const contentType = searchParams?.get('type') || 'movie';
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [sources, setSources] = useState(null);
  const [activeLayer, setActiveLayer] = useState('primary');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [metadata, setMetadata] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isPlayingIntro, setIsPlayingIntro] = useState(true);

  const handleVideoEnded = () => {
    if (isPlayingIntro) {
      setIsPlayingIntro(false);
    }
  };

  useEffect(() => {
    const fetchMeta = async () => {
      if (!tmdbId) return;
      try {
        const [data, creditsData, videosData, similarData] = await Promise.all([
          fetchDetails(tmdbId, contentType).catch(() => null),
          fetchCredits(tmdbId, contentType).catch(() => null),
          fetchVideos(tmdbId, contentType).catch(() => null),
          fetchSimilar(tmdbId, contentType).catch(() => null)
        ]);
        
        if (data) {
          setMetadata(data);
          const validSeasons = data?.seasons?.filter(s => s.season_number > 0) || [];
          if (validSeasons.length > 0 && season === 1) {
            setSeason(Number(validSeasons[0].season_number));
          }
        }
        
        if (videosData?.results) {
          const officialTrailer = videosData.results.find(v => v.site === 'YouTube' && v.type === 'Trailer');
          setTrailer(officialTrailer);
        }
        
        if (creditsData?.cast) {
          setCast(creditsData.cast.slice(0, 10));
        }
        
        if (similarData?.results) {
          setSimilar(similarData.results);
        }
      } catch (err) {
        console.error("Failed to fetch metadata", err);
      }
    };
    fetchMeta();
  }, [tmdbId, contentType]);

  useEffect(() => {
    if (metadata) {
      setLoading(false);
    }
  }, [metadata]);

  const title = metadata?.name || metadata?.title || 'Loading...';
  const backdrop = metadata?.backdrop_path ? `https://image.tmdb.org/t/p/original${metadata.backdrop_path}` : null;
  const releaseYear = metadata?.release_date?.split('-')[0] || metadata?.first_air_date?.split('-')[0] || '';

  const episodeCount = useMemo(() => {
    if (!metadata?.seasons) return 0;
    const currentSeason = metadata.seasons.find(s => Number(s.season_number) === Number(season));
    return currentSeason?.episode_count || 0;
  }, [metadata, season]);

  const getEmbedUrl = (server) => {
    if (contentType === 'tv') {
      if (server === 'primary') return `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;
      if (server === 'backup1') return `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`;
      return `https://vidsrc.pro/embed/tv/${tmdbId}/${season}/${episode}`;
    } else {
      if (server === 'primary') return `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`;
      if (server === 'backup1') return `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1`;
      return `https://vidsrc.pro/embed/movie/${tmdbId}`;
    }
  };

  return (
    <main className="relative min-h-screen bg-[#FBFBFD] dark:bg-brand-bg text-[#1d1d1f] dark:text-gray-50 p-6 md:p-12 font-body flex flex-col items-center overflow-hidden transition-colors duration-500">
      {/* Cinematic Faded Background */}
      {backdrop && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-10 dark:opacity-20"
          style={{ backgroundImage: `url('${backdrop}')` }}
        />
      )}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#FBFBFD] dark:from-brand-bg via-[#FBFBFD]/80 dark:via-brand-bg/80 to-transparent transition-colors duration-500" />

      <div className="relative z-10 max-w-5xl w-full">
        <Breadcrumbs />
        
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#1d1d1f] dark:text-white tracking-tight mb-2 drop-shadow-lg transition-colors duration-300">
            {title} {releaseYear && `(${releaseYear})`} {contentType === 'tv' ? `- S${season < 10 ? '0'+season : season} E${episode < 10 ? '0'+episode : episode}` : ''}
          </h1>
          <p className="text-brand-primary font-medium mb-4">Hydra Cascade Engine Active</p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            {trailer && (
              <button
                onClick={() => setIsTrailerOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-red-900/50"
              >
                <Play size={18} fill="currentColor" /> Watch Trailer
              </button>
            )}

            {metadata && (
              <button
                onClick={() => isInWatchlist(metadata.id) ? removeFromWatchlist(metadata.id) : addToWatchlist({...metadata, media_type: contentType})}
                className={`inline-flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all shadow-lg ${
                  isInWatchlist(metadata?.id)
                    ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary hover:bg-brand-primary/30'
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
              >
                {isInWatchlist(metadata?.id) ? (
                  <><Check size={18} /> Remove from List</>
                ) : (
                  <><Plus size={18} /> Add to List</>
                )}
              </button>
            )}
          </div>
        </header>

        {/* Video Player Container */}
        <div className="mb-8 w-full relative z-20">
          {loading ? (
            <div className="w-full aspect-video bg-gray-200 dark:bg-gray-900 rounded-2xl flex flex-col gap-4 items-center justify-center border border-gray-300 dark:border-gray-800 shadow-2xl transition-colors duration-500">
              <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-500 dark:text-gray-400 font-medium">Fetching Stream...</span>
            </div>
          ) : error ? (
            <div className="w-full aspect-video bg-red-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center border border-red-200 dark:border-red-800 shadow-2xl transition-colors duration-500">
              <span className="text-red-500 dark:text-red-400 font-medium">{error}</span>
            </div>
          ) : (
            <div className="relative w-full aspect-video bg-white dark:bg-[#0b0f0a] rounded-2xl overflow-hidden border border-black/10 dark:border-[#a7c957]/30 shadow-2xl dark:shadow-[0_0_40px_rgba(167,201,87,0.15)] group transition-colors duration-500">
              {isPlayingIntro ? (
                <div className="relative w-full h-full bg-black flex items-center justify-center">
                  <video
                    src="/intro.mp4"
                    autoPlay
                    playsInline
                    onEnded={handleVideoEnded}
                    onError={handleVideoEnded}
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={handleVideoEnded}
                    className="absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md hover:bg-white/20 transition-all active:scale-95 cursor-pointer shadow-lg"
                  >
                    Skip Intro
                  </button>
                </div>
              ) : (
                <iframe
                  src={getEmbedUrl(activeLayer)}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; fullscreen"
                ></iframe>
              )}
              {/* Subtle glow overlay that ignores pointer events */}
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_20px_rgba(167,201,87,0.1)] rounded-2xl transition-shadow duration-500"></div>
            </div>
          )}

          {/* Server Switching UI */}
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium flex items-center mr-2 transition-colors duration-500">If video is buffering, change server:</span>
              <button
                onClick={() => setActiveLayer('primary')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                  activeLayer === 'primary' ? 'bg-brand-primary text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-transparent'
                }`}
              >
                Server 1 (Primary)
              </button>
              <button
                onClick={() => setActiveLayer('backup1')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                  activeLayer === 'backup1' ? 'bg-brand-primary text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-transparent'
                }`}
              >
                Server 2 (Backup)
              </button>
              <button
                onClick={() => setActiveLayer('backup2')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                  activeLayer === 'backup2' ? 'bg-brand-primary text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-transparent'
                }`}
              >
                Server 3 (Alt)
              </button>
            </div>
        </div>

        {/* Controls Section */}
        {contentType === 'tv' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-lg space-y-6 mb-40 relative z-20 transition-colors duration-500">
            {/* SEASON SELECTOR */}
            <div>
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-500">SELECT SEASON</h3>
              <div className="flex flex-wrap gap-2">
                {metadata?.seasons?.filter(s => s.season_number > 0).map((s) => (
                  <button
                    key={`season-${s.season_number}`}
                    onClick={() => {
                      setSeason(Number(s.season_number));
                      setEpisode(1);
                    }}
                    className={`px-4 py-2 rounded-md transition-all duration-200 ${Number(season) === Number(s.season_number) ? 'bg-brand-primary text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                  >
                    Season {s.season_number}
                  </button>
                ))}
              </div>
            </div>

            {/* EPISODE SELECTOR */}
            <div className="mb-40">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-500">SELECT EPISODE</h3>
              <div key={`ep-container-${season}`} className="flex flex-wrap gap-2">
                {Array.from({ length: episodeCount }, (_, i) => i + 1).map((ep) => (
                  <button
                    key={`ep-btn-${season}-${ep}`}
                    onClick={() => setEpisode(ep)}
                    className={`px-4 py-2 rounded-md transition-all duration-200 ${Number(episode) === ep ? 'bg-red-600 text-white font-bold shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                  >
                    {ep}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cast & Crew Section */}
        {cast.length > 0 && (
          <div className="mt-12 w-full relative z-20">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-4 px-2 transition-colors duration-500">Cast & Crew</h2>
            <div className="flex overflow-x-auto gap-4 scrollbar-hide px-2 pb-4">
              {cast.map((actor) => {
                if (!actor.profile_path) return null;
                return (
                  <div key={actor.id} className="flex flex-col items-center shrink-0 w-28 text-center">
                    <img 
                      src={`${BASE_IMG_URL}${actor.profile_path}`} 
                      alt={actor.name}
                      className="w-24 h-24 rounded-full object-cover shadow-lg border border-gray-200 dark:border-gray-700 mb-2 transition-colors duration-500"
                    />
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 line-clamp-1 transition-colors duration-500">{actor.name}</p>
                    <p className="text-xs text-brand-primary line-clamp-1">{actor.character}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5-Star Media Rating & Community Feedback Section (SRS 1.6) */}
        <MediaRatingSection mediaId={tmdbId} mediaType={contentType} title={title} />
      </div>

      {/* You May Also Like Row */}
      {similar.length > 0 && (
        <div className="w-full max-w-[1400px] mt-8 mb-40">
          <MovieRow movies={similar} title="You May Also Like" fallbackType={contentType} />
        </div>
      )}

      {/* Trailer Modal */}
      {isTrailerOpen && trailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-12">
          <button 
            onClick={() => setIsTrailerOpen(false)}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
          >
            <X size={32} />
          </button>
          <div className="w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800 relative">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title="Official Trailer"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </main>
  );
}