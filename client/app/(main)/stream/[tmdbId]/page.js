'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { fetchDetails, BASE_IMG_URL, fetchCredits, fetchVideos, fetchSimilar } from '@/utils/tmdb';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import MovieRow from '@/components/MovieRow';
import Breadcrumbs from '@/components/Breadcrumbs';
import MediaRatingSection from '@/components/MediaRatingSection';
import DownloadModal from '@/components/DownloadModal';
import {
  Play, X, Plus, Check, Download, Share2,
  TrendingUp, Star, Clock, CalendarDays,
  Wifi, AlertTriangle, ShieldCheck, Maximize2,
  Minimize2, RotateCw, Monitor, ArrowLeft,
  ChevronLeft, ChevronRight, Sparkles, Film
} from 'lucide-react';
import { useWatchlist } from '@/hooks/useWatchlist';
import toast from 'react-hot-toast';

/* ─── CDN Configurations ─────────────────────────────────────────────────── */
const BACKDROP = 'https://image.tmdb.org/t/p/original';
const POSTER   = 'https://image.tmdb.org/t/p/w500';

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

const SERVERS = [
  { id: 'vidlink', name: 'Server 1 (VidLink 4K • Ad-Free)', badge: 'Ultra HD 4K', speed: 'Fastest' },
  { id: 'autoembed', name: 'Server 2 (AutoEmbed CDN)', badge: 'Ad-Shielded', speed: 'Smooth' },
  { id: 'vidsrccc', name: 'Server 3 (Vidsrc VIP V2)', badge: 'Multi-Sub', speed: 'High Speed' },
  { id: 'embedsu', name: 'Server 4 (EmbedSU Global)', badge: 'Global Mirror', speed: 'Backup' },
];

export default function StreamPage() {
  const params       = useParams();
  const searchParams = useSearchParams();
  const router       = useRouter();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const tmdbId      = params?.tmdbId;
  const contentType = searchParams?.get('type') || 'movie';

  /* state */
  const [season,          setSeason]          = useState(1);
  const [episode,         setEpisode]         = useState(1);
  const [activeServer,    setActiveServer]    = useState('vidlink');
  const [playerKey,       setPlayerKey]       = useState(1);
  const [isFullscreen,    setIsFullscreen]    = useState(false);
  const [isTheaterMode,   setIsTheaterMode]   = useState(false);
  const [adShieldActive,  setAdShieldActive]  = useState(true);
  const [loading,         setLoading]         = useState(true);
  const [metadata,        setMetadata]        = useState(null);
  const [cast,            setCast]            = useState([]);
  const [crew,            setCrew]            = useState([]);
  const [trailer,         setTrailer]         = useState(null);
  const [clips,           setClips]           = useState([]);
  const [similar,         setSimilar]         = useState([]);
  const [activeClip,      setActiveClip]      = useState(null);
  const [castTab,         setCastTab]         = useState('cast');
  const [isTrailerOpen,   setIsTrailerOpen]   = useState(false);
  const [isDownloadOpen,  setIsDownloadOpen]  = useState(false);
  const [isPlayingIntro,  setIsPlayingIntro]  = useState(true);

  const playerContainerRef = useRef(null);
  const playerSectionRef   = useRef(null);

  /* share helper */
  const handleShare = async () => {
    const movieTitle = metadata?.title || metadata?.name || 'Fandom Stream';
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator?.share) {
      try { await navigator.share({ title: movieTitle, url }); return; } catch (_) {}
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success(`Stream link copied!`, { style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' } });
    } catch (_) {
      toast.error('Could not copy link');
    }
  };

  /* Native Fullscreen API */
  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch((err) => {
        toast.error('Fullscreen request blocked by browser');
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  /* 1-Click Stream Reload */
  const reloadStream = () => {
    setPlayerKey(prev => prev + 1);
    toast.success('Refreshing stream connection…', {
      icon: '🔄',
      style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
    });
  };

  /* Server Switcher with Toast */
  const handleServerChange = (serverId) => {
    setActiveServer(serverId);
    setIsPlayingIntro(false);
    setPlayerKey(prev => prev + 1);
    const target = SERVERS.find(s => s.id === serverId);
    toast.success(`Switched to ${target?.name || 'Server'}`, {
      icon: '⚡',
      style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
    });
  };

  /* Scroll to player */
  const scrollToPlayer = () => {
    setIsPlayingIntro(false);
    playerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

  /* Build verified, ad-clean embed URLs */
  const getEmbedUrl = (server) => {
    const isTv = contentType === 'tv';
    switch (server) {
      case 'vidlink':
        // VidLink (High performance, minimal popup noise)
        return isTv
          ? `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}?primaryColor=a7c957&secondaryColor=0b0f0a&iconColor=a7c957&autoplay=false`
          : `https://vidlink.pro/movie/${tmdbId}?primaryColor=a7c957&secondaryColor=0b0f0a&iconColor=a7c957&autoplay=false`;

      case 'autoembed':
        // AutoEmbed (Super reliable fast stream mirror)
        return isTv
          ? `https://player.autoembed.cc/embed/tv/${tmdbId}/${season}/${episode}`
          : `https://player.autoembed.cc/embed/movie/${tmdbId}`;

      case 'vidsrccc':
        // Vidsrc CC v2
        return isTv
          ? `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${season}/${episode}`
          : `https://vidsrc.cc/v2/embed/movie/${tmdbId}`;

      case 'embedsu':
        // EmbedSU mirror
        return isTv
          ? `https://embed.su/embed/tv/${tmdbId}/${season}/${episode}`
          : `https://embed.su/embed/movie/${tmdbId}`;

      default:
        return isTv
          ? `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}?primaryColor=a7c957`
          : `https://vidlink.pro/movie/${tmdbId}?primaryColor=a7c957`;
    }
  };

  /* ─── loading skeleton ──────────────────────────────────────────────────── */
  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0f0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#a7c957] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#a7c957] font-semibold tracking-widest uppercase text-sm animate-pulse">Initializing Stream Engine…</p>
        </div>
      </main>
    );
  }

  /* ─── render ────────────────────────────────────────────────────────────── */
  return (
    <main className="min-h-screen bg-[#0b0f0a] text-white selection:bg-[#a7c957] selection:text-[#0b0f0a]">

      {/* ══════════════════════════════════════════════════════════════
          HERO — full-width backdrop with gradient overlay
      ══════════════════════════════════════════════════════════════ */}
      <div className="relative w-full min-h-[85vh] flex flex-col justify-end overflow-hidden">
        {/* Backdrop */}
        {backdrop && (
          <img
            src={backdrop}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-top opacity-60 scale-105 transition-transform duration-1000"
          />
        )}
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f0a] via-[#0b0f0a]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f0a] via-[#0b0f0a]/40 to-transparent" />

        {/* Top Navigation Bar & Back */}
        <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2.5 rounded-full bg-black/50 hover:bg-[#a7c957] hover:text-[#0b0f0a] text-white border border-white/15 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
              title="Go back"
            >
              <ArrowLeft size={18} />
            </button>
            <Breadcrumbs />
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Stream Ready
            </span>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 pb-14 pt-28 flex gap-10 items-end">

          {/* Poster */}
          {poster && (
            <div className="hidden lg:block flex-shrink-0 w-56 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(167,201,87,0.25)] border border-white/15 group relative">
              <img src={poster} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <button
                onClick={scrollToPlayer}
                className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-[#a7c957] text-[#0b0f0a] flex items-center justify-center shadow-xl">
                  <Play size={24} fill="currentColor" className="ml-1" />
                </div>
              </button>
            </div>
          )}

          {/* Info column */}
          <div className="flex-1 max-w-3xl">
            {/* Trending badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#a7c957]/15 border border-[#a7c957]/40 text-[#a7c957] text-xs font-bold uppercase tracking-widest mb-3">
              <TrendingUp size={13} />
              #1 Trending Fandom Stream
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight mb-2">
              <span className="text-white">{title.replace(/\(\d{4}\)/, '').trim()}</span>
              {releaseYear && <span className="text-[#a7c957]"> ({releaseYear})</span>}
            </h1>

            {/* Tagline / Engine label */}
            <p className="text-[#a7c957] font-semibold text-sm mb-4 tracking-wide flex items-center gap-2">
              <Sparkles size={14} />
              {metadata?.tagline || 'Hydra Cascade Engine Active • Ultra-Low Latency'}
            </p>

            {/* Meta strip */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-gray-300 text-sm font-semibold">{releaseYear}</span>
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
                  <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: '#1a2a0a', color: getRatingColor(votePercent) }}>
                    IMDb {votePercent}%
                  </span>
                </div>
              )}
            </div>

            {/* Overview */}
            <p className="text-gray-300 text-sm leading-relaxed max-w-2xl mb-7 line-clamp-3 md:line-clamp-4">
              {overview}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={scrollToPlayer}
                className="inline-flex items-center gap-2.5 px-7 py-3 bg-[#a7c957] hover:bg-[#95b347] text-[#0b0f0a] font-black rounded-full transition-all shadow-[0_0_30px_rgba(167,201,87,0.35)] hover:shadow-[0_0_40px_rgba(167,201,87,0.5)] active:scale-95 cursor-pointer"
              >
                <Play size={18} fill="currentColor" />
                Watch Stream
              </button>

              {trailer && (
                <button
                  onClick={() => setIsTrailerOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all active:scale-95 cursor-pointer bg-white/8 text-white border border-white/20 hover:bg-white/15"
                >
                  <Film size={16} /> Trailer
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
                    ? <><Check size={16} /> In List</>
                    : <><Plus size={16} /> Watchlist</>}
                </button>
              )}

              {metadata && (
                <button
                  onClick={() => setIsDownloadOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all active:scale-95 cursor-pointer bg-white/8 text-white border border-white/20 hover:bg-white/15"
                >
                  <Download size={16} /> Offline
                </button>
              )}

              <button
                onClick={handleShare}
                className="p-3 rounded-full bg-white/8 text-white border border-white/20 hover:bg-white/15 transition-all active:scale-95 cursor-pointer"
                title="Share stream"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          CINEMA VIDEO PLAYER & CONTROL DECK
      ══════════════════════════════════════════════════════════════ */}
      <section
        ref={playerSectionRef}
        className={`mx-auto px-4 md:px-12 py-8 transition-all duration-500 ${
          isTheaterMode ? 'max-w-full px-0' : 'max-w-7xl'
        }`}
      >
        {/* Cinema Deck Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 px-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Stream Node:</span>
            <span className="text-xs font-bold text-[#a7c957] bg-[#a7c957]/10 px-2.5 py-0.5 rounded-full border border-[#a7c957]/30">
              {SERVERS.find(s => s.id === activeServer)?.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Ad-Shield Badge */}
            <button
              onClick={() => {
                setAdShieldActive(!adShieldActive);
                toast.success(adShieldActive ? 'Ad-Shield paused' : 'Ad-Shield Active (Popups Blocked)', {
                  icon: '🛡️',
                  style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
                });
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                adShieldActive
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                  : 'bg-white/5 border-white/10 text-gray-400'
              }`}
              title="Click to toggle Ad-Shield Popup Blocker"
            >
              <ShieldCheck size={14} />
              {adShieldActive ? 'Ad-Shield Active' : 'Ad-Shield Off'}
            </button>

            {/* Quick Reload Stream */}
            <button
              onClick={reloadStream}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-all cursor-pointer active:scale-95"
              title="Reload video if buffering or frozen"
            >
              <RotateCw size={13} />
              Reload
            </button>

            {/* Theater Mode Toggle */}
            <button
              onClick={() => setIsTheaterMode(!isTheaterMode)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                isTheaterMode
                  ? 'bg-[#a7c957] text-[#0b0f0a] border-[#a7c957]'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
              }`}
              title="Toggle Theater Mode"
            >
              <Monitor size={13} />
              Theater
            </button>

            {/* Native Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/5 hover:bg-[#a7c957] hover:text-[#0b0f0a] border border-white/10 text-gray-300 transition-all cursor-pointer active:scale-95"
              title="Expand to Fullscreen"
            >
              {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              {isFullscreen ? 'Exit' : 'Fullscreen'}
            </button>
          </div>
        </div>

        {/* Video Player Frame Container */}
        <div
          ref={playerContainerRef}
          className={`w-full relative rounded-2xl overflow-hidden border border-[#a7c957]/30 shadow-[0_0_60px_rgba(167,201,87,0.15)] bg-black aspect-video transition-all ${
            isFullscreen ? 'h-screen w-screen rounded-none border-none' : ''
          }`}
        >
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
                className="absolute top-4 right-4 z-20 px-4 py-2 rounded-full bg-black/70 border border-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md hover:bg-white/20 transition-all active:scale-95 cursor-pointer shadow-lg"
              >
                Skip Intro →
              </button>
            </div>
          ) : (
            <iframe
              key={`player-${activeServer}-${playerKey}-${contentType}-${tmdbId}-${season}-${episode}`}
              src={getEmbedUrl(activeServer)}
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen={true}
              webkitallowfullscreen="true"
              mozallowfullscreen="true"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope"
              // Ad-Shield sandbox blocks popup windows and redirect ads while keeping video engine working
              sandbox={adShieldActive ? "allow-scripts allow-same-origin allow-forms allow-presentation allow-downloads" : undefined}
            />
          )}

          {/* Ambient Glow */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_30px_rgba(167,201,87,0.06)] rounded-2xl" />
        </div>

        {/* Multi-Server Selector Bar */}
        <div className="mt-4 p-4 rounded-2xl bg-white/[0.03] border border-white/8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
            <Wifi size={16} className="text-[#a7c957]" />
            <span>If video is buffering or down, switch server:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {SERVERS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleServerChange(s.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                  activeServer === s.id
                    ? 'bg-[#a7c957] text-[#0b0f0a] shadow-[0_0_20px_rgba(167,201,87,0.4)]'
                    : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                }`}
              >
                <span>{s.name.split(' (')[0]}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  activeServer === s.id ? 'bg-[#0b0f0a]/20 text-[#0b0f0a]' : 'bg-white/10 text-gray-400'
                }`}>
                  {s.speed}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          TV SHOWS — Clean Modern Season & Episode Selector
      ══════════════════════════════════════════════════════════════ */}
      {contentType === 'tv' && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-10">
          <div className="rounded-3xl bg-white/[0.03] border border-white/8 p-6 md:p-8 space-y-6">
            {/* Season switcher */}
            <div>
              <h3 className="text-xs font-bold text-[#a7c957] uppercase tracking-widest mb-3">Select Season</h3>
              <div className="flex flex-wrap gap-2">
                {metadata?.seasons?.filter(s => s.season_number > 0).map((s) => (
                  <button
                    key={`season-${s.season_number}`}
                    onClick={() => {
                      setSeason(Number(s.season_number));
                      setEpisode(1);
                      setIsPlayingIntro(false);
                      setPlayerKey(prev => prev + 1);
                    }}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                      Number(season) === Number(s.season_number)
                        ? 'bg-[#a7c957] text-[#0b0f0a] shadow-md shadow-[#a7c957]/20'
                        : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    Season {s.season_number} {s.episode_count ? `(${s.episode_count} eps)` : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Episode Navigator Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Season {season} Episodes ({episodeCount})
                </h3>
                {episode < episodeCount && (
                  <button
                    onClick={() => {
                      setEpisode(prev => prev + 1);
                      setIsPlayingIntro(false);
                      setPlayerKey(prev => prev + 1);
                    }}
                    className="text-xs text-[#a7c957] font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    Next Episode ({episode + 1}) →
                  </button>
                )}
              </div>

              <div key={`ep-grid-${season}`} className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
                {Array.from({ length: episodeCount }, (_, i) => i + 1).map((ep) => (
                  <button
                    key={`ep-${season}-${ep}`}
                    onClick={() => {
                      setEpisode(ep);
                      setIsPlayingIntro(false);
                      setPlayerKey(prev => prev + 1);
                    }}
                    className={`h-12 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center ${
                      Number(episode) === ep
                        ? 'bg-[#a7c957] text-[#0b0f0a] shadow-lg shadow-[#a7c957]/30 scale-105'
                        : 'bg-white/5 text-gray-300 border border-white/8 hover:bg-white/10'
                    }`}
                  >
                    <span>EP {ep < 10 ? `0${ep}` : ep}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          CAST & CREW — Luxury Squircle Profiles
      ══════════════════════════════════════════════════════════════ */}
      {(cast.length > 0 || crew.length > 0) && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-black text-white">Cast & Crew</h2>
            <div className="flex gap-1 bg-white/6 rounded-full p-1 border border-white/8">
              {['cast', 'crew'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setCastTab(tab)}
                  className={`px-5 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all cursor-pointer capitalize ${
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
                <div key={actor.id} className="flex-shrink-0 w-32 text-center group">
                  <div className="relative w-28 h-28 mx-auto mb-2 rounded-2xl overflow-hidden ring-2 ring-white/10 group-hover:ring-[#a7c957]/60 transition-all shadow-lg">
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
                <div key={`${member.id}-${member.job}`} className="flex-shrink-0 w-32 text-center group">
                  <div className="relative w-28 h-28 mx-auto mb-2 rounded-2xl overflow-hidden ring-2 ring-white/10 group-hover:ring-[#a7c957]/60 transition-all shadow-lg">
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
          FAN RATINGS & REVIEWS SECTION
      ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-10">
        <MediaRatingSection mediaId={tmdbId} mediaType={contentType} title={title} />
      </section>

      {/* ══════════════════════════════════════════════════════════════
          YOU MAY ALSO LIKE (Recommendations Carousel)
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