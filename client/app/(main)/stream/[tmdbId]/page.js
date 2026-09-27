'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { fetchDetails, BASE_IMG_URL, fetchCredits, fetchVideos, fetchSimilar } from '@/utils/tmdb';
import { useParams, useSearchParams } from 'next/navigation';
import MovieRow from '@/components/MovieRow';
import Breadcrumbs from '@/components/Breadcrumbs';
import MediaRatingSection from '@/components/MediaRatingSection';
import DownloadModal from '@/components/DownloadModal';
import {
  Play, X, Plus, Check, Download, Share2,
  Bookmark, TrendingUp, Star, Clock, CalendarDays,
  Wifi, WifiOff, AlertTriangle, ChevronRight, Users
} from 'lucide-react';
import { useWatchlist } from '@/hooks/useWatchlist';
import toast from 'react-hot-toast';

/* ─── helpers ─────────────────────────────────────────────────────────────── */
const BACKDROP = 'https://image.tmdb.org/t/p/original';
const POSTER   = 'https://image.tmdb.org/t/p/w500';
const STILL    = 'https://image.tmdb.org/t/p/w300';

const fmt = (min) => {
  if (!min) return '';
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
};

const getRatingColor = (score) => {
  if (score >= 80) return '#a7c957';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

export default function StreamPage() {
  const params       = useParams();
  const searchParams = useSearchParams();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const tmdbId      = params?.tmdbId;
  const contentType = searchParams?.get('type') || 'movie';

  /* state */
  const [season,         setSeason]         = useState(1);
  const [episode,        setEpisode]        = useState(1);
  const [activeLayer,    setActiveLayer]    = useState('primary');
  const [loading,        setLoading]        = useState(true);
  const [metadata,       setMetadata]       = useState(null);
  const [cast,           setCast]           = useState([]);
  const [crew,           setCrew]           = useState([]);
  const [trailer,        setTrailer]        = useState(null);
  const [clips,          setClips]          = useState([]);
  const [similar,        setSimilar]        = useState([]);
  const [activeClip,     setActiveClip]     = useState(null);
  const [castTab,        setCastTab]        = useState('cast');
  const [isTrailerOpen,  setIsTrailerOpen]  = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isPlayingIntro, setIsPlayingIntro] = useState(true);

  /* share helper */
  const handleShare = async () => {
    const movieTitle = metadata?.title || metadata?.name || 'Fandom Stream';
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator?.share) {
      try { await navigator.share({ title: movieTitle, url }); return; } catch (_) {}
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success(`Link copied!`, { style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' } });
    } catch (_) {
      toast.error('Could not copy link');
    }
  };

  /* fetch */
  useEffect(() => {
    if (!tmdbId) return;
    setLoading(true);
    Promise.all([
      fetchDetails(tmdbId, contentType).catch(() => null),
      fetchCredits(tmdbId, contentType).catch(() => null),
      fetchVideos(tmdbId, contentType).catch(() => null),
      fetchSimilar(tmdbId, contentType).catch(() => null),
    ]).then(([data, creditsData, videosData, similarData]) => {
      if (data) {
        setMetadata(data);
        const validSeasons = data?.seasons?.filter(s => s.season_number > 0) || [];
        if (validSeasons.length > 0) setSeason(Number(validSeasons[0].season_number));
      }
      if (videosData?.results) {
        const tr = videosData.results.find(v => v.site === 'YouTube' && v.type === 'Trailer');
        const cl = videosData.results.filter(v => v.site === 'YouTube' && v.type !== 'Trailer').slice(0, 6);
        setTrailer(tr || null);
        setClips(cl);
        if (tr) setActiveClip(tr);
        else if (cl.length) setActiveClip(cl[0]);
      }
      if (creditsData?.cast)  setCast(creditsData.cast.slice(0, 12));
      if (creditsData?.crew)  setCrew(creditsData.crew.slice(0, 8));
      if (similarData?.results) setSimilar(similarData.results);
      setLoading(false);
    });
  }, [tmdbId, contentType]);

  const title        = metadata?.name || metadata?.title || '';
  const backdrop     = metadata?.backdrop_path ? `${BACKDROP}${metadata.backdrop_path}` : null;
  const poster       = metadata?.poster_path   ? `${POSTER}${metadata.poster_path}` : null;
  const releaseYear  = metadata?.release_date?.split('-')[0] || metadata?.first_air_date?.split('-')[0] || '';
  const runtime      = metadata?.runtime || metadata?.episode_run_time?.[0];
  const voteAvg      = metadata?.vote_average;
  const votePercent  = voteAvg ? Math.round(voteAvg * 10) : null;
  const genres       = metadata?.genres?.slice(0, 4) || [];
  const overview     = metadata?.overview || '';

  const episodeCount = useMemo(() => {
    if (!metadata?.seasons) return 0;
    const s = metadata.seasons.find(s => Number(s.season_number) === Number(season));
    return s?.episode_count || 0;
  }, [metadata, season]);

  const getEmbedUrl = (server) => {
    if (contentType === 'tv') {
      if (server === 'primary') return `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;
      if (server === 'backup1') return `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`;
      return `https://vidsrc.pro/embed/tv/${tmdbId}/${season}/${episode}`;
    }
    if (server === 'primary') return `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`;
    if (server === 'backup1') return `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1`;
    return `https://vidsrc.pro/embed/movie/${tmdbId}`;
  };

  /* ─── loading skeleton ──────────────────────────────────────────────────── */
  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0f0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#a7c957] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#a7c957] font-semibold tracking-widest uppercase text-sm animate-pulse">Loading Stream…</p>
        </div>
      </main>
    );
  }

  /* ─── render ────────────────────────────────────────────────────────────── */
  return (
    <main className="min-h-screen bg-[#0b0f0a] text-white">

      {/* ══════════════════════════════════════════════════════════════
          HERO — full-width backdrop with gradient overlay
      ══════════════════════════════════════════════════════════════ */}
      <div className="relative w-full min-h-[92vh] flex flex-col justify-end overflow-hidden">
        {/* Backdrop */}
        {backdrop && (
          <img
            src={backdrop}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        )}
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f0a] via-[#0b0f0a]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f0a] via-[#0b0f0a]/20 to-transparent" />

        {/* Breadcrumbs */}
        <div className="absolute top-6 left-6 z-20">
          <Breadcrumbs />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 pb-16 pt-32 flex gap-10 items-end">

          {/* Poster */}
          {poster && (
            <div className="hidden lg:block flex-shrink-0 w-52 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(167,201,87,0.2)] border border-white/10">
              <img src={poster} alt={title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Info column */}
          <div className="flex-1 max-w-3xl">
            {/* Trending badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#a7c957]/15 border border-[#a7c957]/40 text-[#a7c957] text-xs font-bold uppercase tracking-widest mb-4">
              <TrendingUp size={13} />
              #1 Trending
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none mb-2">
              <span className="text-white">{title.replace(/\(\d{4}\)/, '').trim()}</span>
              {releaseYear && <span className="text-[#a7c957]"> ({releaseYear})</span>}
            </h1>

            {/* Tagline / Engine label */}
            <p className="text-[#a7c957] font-semibold text-sm mb-4 tracking-wide">
              {metadata?.tagline || 'Hydra Cascade Engine Active'}
            </p>

            {/* Meta strip */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-gray-300 text-sm">{releaseYear}</span>
              {runtime && (
                <>
                  <span className="text-gray-600">·</span>
                  <span className="flex items-center gap-1 text-gray-300 text-sm">
                    <Clock size={13} /> {fmt(runtime)}
                  </span>
                </>
              )}
              {genres.map(g => (
                <span key={g.id} className="px-2.5 py-0.5 rounded-full bg-white/8 border border-white/12 text-gray-300 text-xs font-medium">
                  {g.name}
                </span>
              ))}
              {votePercent && (
                <div className="flex items-center gap-1.5 ml-auto">
                  <Star size={15} className="text-yellow-400" fill="currentColor" />
                  <span className="font-bold text-white">{voteAvg?.toFixed(1)}/10</span>
                  {votePercent && (
                    <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: '#1a2a0a', color: getRatingColor(votePercent) }}>
                      IMDb {votePercent}%
                    </span>
                  )}
                  <span className="text-[#a7c957] font-bold text-xs ml-1">{votePercent}%</span>
                </div>
              )}
            </div>

            {/* Overview */}
            <p className="text-gray-300 text-sm leading-relaxed max-w-2xl mb-7 line-clamp-4">
              {overview}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {trailer && (
                <button
                  onClick={() => setIsTrailerOpen(true)}
                  className="inline-flex items-center gap-2.5 px-7 py-3 bg-[#a7c957] hover:bg-[#95b347] text-[#0b0f0a] font-black rounded-full transition-all shadow-[0_0_30px_rgba(167,201,87,0.35)] hover:shadow-[0_0_40px_rgba(167,201,87,0.5)] active:scale-95 cursor-pointer"
                >
                  <Play size={18} fill="currentColor" />
                  Watch Trailer
                </button>
              )}

              {metadata && (
                <button
                  onClick={() => isInWatchlist(metadata.id)
                    ? removeFromWatchlist(metadata.id)
                    : addToWatchlist({ ...metadata, media_type: contentType })}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all active:scale-95 cursor-pointer border ${
                    isInWatchlist(metadata?.id)
                      ? 'bg-[#a7c957]/15 text-[#a7c957] border-[#a7c957]/50 hover:bg-[#a7c957]/25'
                      : 'bg-white/8 text-white border-white/20 hover:bg-white/15'
                  }`}
                >
                  {isInWatchlist(metadata?.id)
                    ? <><Check size={16} /> Added</>
                    : <><Plus size={16} /> Add to List</>}
                </button>
              )}

              {metadata && (
                <button
                  onClick={() => setIsDownloadOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all active:scale-95 cursor-pointer bg-white/8 text-white border border-white/20 hover:bg-white/15"
                >
                  <Download size={16} /> Download
                </button>
              )}

              <button
                onClick={handleShare}
                className="p-3 rounded-full bg-white/8 text-white border border-white/20 hover:bg-white/15 transition-all active:scale-95 cursor-pointer"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          PLAYER + CLIPS ROW
      ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-6">

        {/* Main embed player */}
        <div className="w-full relative rounded-2xl overflow-hidden border border-[#a7c957]/20 shadow-[0_0_60px_rgba(167,201,87,0.1)] bg-black aspect-video">
          {isPlayingIntro ? (
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              <video
                src="/intro.mp4"
                autoPlay
                playsInline
                onEnded={() => setIsPlayingIntro(false)}
                onError={() => setIsPlayingIntro(false)}
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setIsPlayingIntro(false)}
                className="absolute top-4 right-4 z-20 px-4 py-1.5 rounded-full bg-black/70 border border-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md hover:bg-white/20 transition-all active:scale-95 cursor-pointer"
              >
                Skip Intro →
              </button>
            </div>
          ) : (
            <iframe
              src={getEmbedUrl(activeLayer)}
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; fullscreen"
            />
          )}
          {/* Glow overlay */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_30px_rgba(167,201,87,0.08)] rounded-2xl" />
        </div>

        {/* Clips thumbnail row */}
        {(trailer || clips.length > 0) && (
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {/* Trailer thumb */}
            {trailer && (
              <button
                onClick={() => { setActiveClip(trailer); setIsPlayingIntro(false); }}
                className={`flex-shrink-0 relative w-40 rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
                  activeClip?.key === trailer.key
                    ? 'border-[#a7c957] shadow-[0_0_20px_rgba(167,201,87,0.4)]'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <img
                  src={`https://img.youtube.com/vi/${trailer.key}/mqdefault.jpg`}
                  alt="Trailer"
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                  <Play size={22} className="text-white drop-shadow-lg" fill="currentColor" />
                </div>
                <div className="absolute bottom-0 inset-x-0 px-2 py-1 bg-gradient-to-t from-black/90 to-transparent">
                  <p className="text-white text-[10px] font-bold">Trailer</p>
                  <p className="text-gray-400 text-[9px]">2:18</p>
                </div>
              </button>
            )}
            {/* Other clips */}
            {clips.map((clip, i) => (
              <button
                key={clip.key}
                onClick={() => { setActiveClip(clip); setIsPlayingIntro(false); }}
                className={`flex-shrink-0 relative w-40 rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
                  activeClip?.key === clip.key
                    ? 'border-[#a7c957] shadow-[0_0_20px_rgba(167,201,87,0.4)]'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <img
                  src={`https://img.youtube.com/vi/${clip.key}/mqdefault.jpg`}
                  alt={clip.name}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                  <Play size={22} className="text-white drop-shadow-lg" fill="currentColor" />
                </div>
                <div className="absolute bottom-0 inset-x-0 px-2 py-1 bg-gradient-to-t from-black/90 to-transparent">
                  <p className="text-white text-[10px] font-bold line-clamp-1">Clip {i + 1}</p>
                  <p className="text-gray-400 text-[9px]">1:0{i + 2}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Server switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-gray-400 text-sm font-medium flex items-center gap-2">
            <Wifi size={14} />
            If video is buffering, change server:
          </span>
          {[
            { id: 'primary', label: 'Server 1 (Primary)' },
            { id: 'backup1', label: 'Server 2 (Backup)' },
            { id: 'backup2', label: 'Server 3 (Alt)' },
          ].map(s => (
            <button
              key={s.id}
              onClick={() => { setActiveLayer(s.id); setIsPlayingIntro(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeLayer === s.id
                  ? 'bg-[#a7c957] text-[#0b0f0a] shadow-[0_0_20px_rgba(167,201,87,0.3)]'
                  : 'bg-white/6 text-gray-300 border border-white/10 hover:bg-white/12'
              }`}
            >
              {activeLayer === s.id
                ? <Wifi size={13} />
                : <WifiOff size={13} />}
              {s.label}
            </button>
          ))}
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 border border-red-400/20 bg-red-400/5 hover:bg-red-400/10 transition-all cursor-pointer ml-auto">
            <AlertTriangle size={12} /> Report Issue
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          TV — Season / Episode Selectors
      ══════════════════════════════════════════════════════════════ */}
      {contentType === 'tv' && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-10">
          <div className="rounded-2xl bg-white/4 border border-white/8 p-6 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Select Season</h3>
              <div className="flex flex-wrap gap-2">
                {metadata?.seasons?.filter(s => s.season_number > 0).map((s) => (
                  <button
                    key={`season-${s.season_number}`}
                    onClick={() => { setSeason(Number(s.season_number)); setEpisode(1); }}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                      Number(season) === Number(s.season_number)
                        ? 'bg-[#a7c957] text-[#0b0f0a] shadow-md'
                        : 'bg-white/6 text-gray-300 border border-white/10 hover:bg-white/12'
                    }`}
                  >
                    Season {s.season_number}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Select Episode</h3>
              <div key={`ep-container-${season}`} className="flex flex-wrap gap-2">
                {Array.from({ length: episodeCount }, (_, i) => i + 1).map((ep) => (
                  <button
                    key={`ep-${season}-${ep}`}
                    onClick={() => setEpisode(ep)}
                    className={`w-11 h-11 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                      Number(episode) === ep
                        ? 'bg-[#a7c957] text-[#0b0f0a] shadow-md'
                        : 'bg-white/6 text-gray-300 border border-white/10 hover:bg-white/12'
                    }`}
                  >
                    {ep}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          CAST & CREW
      ══════════════════════════════════════════════════════════════ */}
      {(cast.length > 0 || crew.length > 0) && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-black text-white">Cast & Crew</h2>
            {/* Tab switcher */}
            <div className="flex gap-1 bg-white/6 rounded-full p-1 border border-white/8">
              {['cast', 'crew'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setCastTab(tab)}
                  className={`px-5 py-1.5 rounded-full text-sm font-bold transition-all cursor-pointer capitalize ${
                    castTab === tab
                      ? 'bg-[#a7c957] text-[#0b0f0a]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex overflow-x-auto gap-4 scrollbar-hide pb-2">
            {castTab === 'cast'
              ? cast.filter(a => a.profile_path).map(actor => (
                <div key={actor.id} className="flex-shrink-0 w-28 text-center group">
                  <div className="relative w-24 h-24 mx-auto mb-2 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-[#a7c957]/60 transition-all">
                    <img
                      src={`${POSTER}${actor.profile_path}`}
                      alt={actor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-sm font-bold text-white line-clamp-1">{actor.name}</p>
                  <p className="text-xs text-[#a7c957] line-clamp-1 mt-0.5">{actor.character}</p>
                </div>
              ))
              : crew.filter(c => c.profile_path).map(member => (
                <div key={`${member.id}-${member.job}`} className="flex-shrink-0 w-28 text-center group">
                  <div className="relative w-24 h-24 mx-auto mb-2 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-[#a7c957]/60 transition-all">
                    <img
                      src={`${POSTER}${member.profile_path}`}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-sm font-bold text-white line-clamp-1">{member.name}</p>
                  <p className="text-xs text-[#a7c957] line-clamp-1 mt-0.5">{member.job}</p>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          FAN RATINGS & REVIEWS
      ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-10">
        <MediaRatingSection mediaId={tmdbId} mediaType={contentType} title={title} />
      </section>

      {/* ══════════════════════════════════════════════════════════════
          YOU MAY ALSO LIKE
      ══════════════════════════════════════════════════════════════ */}
      {similar.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
          <MovieRow initialMovies={similar} title="You May Also Like" fallbackType={contentType} />
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TRAILER MODAL
      ══════════════════════════════════════════════════════════════ */}
      {isTrailerOpen && trailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg p-4 md:p-12">
          <button
            onClick={() => setIsTrailerOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X size={24} />
          </button>
          <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-[#a7c957]/20">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title="Official Trailer"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          DOWNLOAD MODAL
      ══════════════════════════════════════════════════════════════ */}
      {metadata && (
        <DownloadModal
          isOpen={isDownloadOpen}
          onClose={() => setIsDownloadOpen(false)}
          movie={{
            id: tmdbId,
            title: metadata.title || metadata.name,
            poster_path: metadata.poster_path,
            media_type: contentType,
          }}
        />
      )}
    </main>
  );
}