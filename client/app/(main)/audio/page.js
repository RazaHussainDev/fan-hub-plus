'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumbs from '@/components/Breadcrumbs';
import { 
  Headphones, Play, Pause, SkipForward, SkipBack, Volume2, 
  VolumeX, Heart, Share2, Disc3, Radio, Sparkles, Repeat, 
  ListMusic, Clock, Search, Layers 
} from 'lucide-react';
import toast from 'react-hot-toast';

const TYPES = ['All', 'OST / Soundtrack', 'Theme Song', 'Podcast', 'Remix'];

export default function AudioPage() {
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [likedMap, setLikedMap] = useState({});

  const audioRef = useRef(null);

  useEffect(() => {
    const fetchAudio = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedType !== 'All') params.append('type', selectedType);
        if (searchQuery.trim()) params.append('search', searchQuery.trim());

        const res = await fetch(`/api/audio?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setTracks(data.results || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAudio();
  }, [selectedType, searchQuery]);

  const currentTrack = tracks[currentTrackIndex] || null;

  // Handle play/pause
  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => console.log('Autoplay error:', e));
    }
  };

  const playSpecificTrack = (index) => {
    setCurrentTrackIndex(index);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log(e));
      }
    }, 50);
  };

  const handleNext = () => {
    if (tracks.length === 0) return;
    const nextIdx = (currentTrackIndex + 1) % tracks.length;
    playSpecificTrack(nextIdx);
  };

  const handlePrev = () => {
    if (tracks.length === 0) return;
    const prevIdx = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    playSpecificTrack(prevIdx);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const nextMute = !isMuted;
      audioRef.current.muted = nextMute;
      setIsMuted(nextMute);
    }
  };

  const handleLike = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (likedMap[id]) return;

    setLikedMap(prev => ({ ...prev, [id]: true }));
    setTracks(prev => prev.map(t => t._id === id ? { ...t, likes: t.likes + 1 } : t));

    try {
      const backendBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await fetch(`${backendBase}/api/audio/${id}/like`, { method: 'PATCH' });
      toast.success("Track added to favorite playlist!", {
        style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
      });
    } catch (e) {}
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <main className="min-h-screen bg-[#FBFBFD] dark:bg-[#060805] text-gray-900 dark:text-gray-100 p-4 md:p-10 pb-36 font-body relative overflow-hidden transition-colors duration-500">
      
      {/* Background Ambience */}
      <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] bg-[#a7c957]/15 dark:bg-[#a7c957]/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 dark:bg-emerald-950/20 blur-[160px] rounded-full pointer-events-none" />

      {/* Hidden Audio Element */}
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleNext}
          loop={isLooping}
        />
      )}

      <div className="w-full max-w-[1400px] mx-auto z-10 relative">
        <Breadcrumbs />

        {/* ─── Hero Header ──────────────────────────────────────────────────────── */}
        <header className="mt-4 mb-8 text-center relative z-20">
          <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 text-xs font-bold text-[#a7c957] uppercase tracking-widest mb-3 backdrop-blur-md">
              <Headphones size={14} className="text-[#a7c957]" />
              Fandom Soundtracks & Audio Hub
            </div>
            
            <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tight text-gray-950 dark:text-white">
              Fandom <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a7c957] via-[#c2e078] to-[#80b918]">Audio & Podcasts</span>
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 font-medium text-base md:text-lg max-w-2xl mx-auto mt-2">
              Stream iconic anime openings, orchestral gaming battle themes, movie scores, and community podcasts.
            </p>
          </motion.div>
        </header>

        {/* ─── Interactive Turntable Master Player ──────────────────────────────── */}
        {currentTrack && (
          <div className="w-full p-6 md:p-8 rounded-3xl bg-white/80 dark:bg-[#0c100a]/90 border border-black/5 dark:border-white/10 backdrop-blur-2xl shadow-2xl mb-12 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Vinyl / Cover Art (4 cols) */}
              <div className="lg:col-span-4 flex items-center justify-center relative">
                <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full p-2 bg-gradient-to-tr from-black via-gray-900 to-[#1b2317] border-2 border-white/10 shadow-2xl flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: isPlaying ? 360 : 0 }}
                    transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                    className="w-full h-full rounded-full overflow-hidden relative shadow-inner"
                  >
                    <img
                      src={currentTrack.coverImage}
                      alt={currentTrack.title}
                      className="w-full h-full object-cover rounded-full opacity-90"
                    />
                    <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/60 rounded-full" />
                    {/* Vinyl Center Hole */}
                    <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-[#0c100a] border-4 border-[#a7c957] shadow-lg flex items-center justify-center">
                      <Disc3 size={16} className="text-[#a7c957]" />
                    </div>
                  </motion.div>

                  {/* Playing Sound Glow */}
                  {isPlaying && (
                    <div className="absolute -inset-2 rounded-full border border-[#a7c957]/30 animate-ping pointer-events-none" />
                  )}
                </div>
              </div>

              {/* Master Controls & Waveform (8 cols) */}
              <div className="lg:col-span-8 flex flex-col justify-between space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-[#a7c957]/15 text-[#a7c957] font-bold text-xs uppercase tracking-wider border border-[#a7c957]/30">
                      {currentTrack.type}
                    </span>
                    <span className="text-xs text-gray-500 font-semibold">
                      {currentTrack.category} • {currentTrack.fandom}
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-heading font-black text-gray-900 dark:text-white leading-tight">
                    {currentTrack.title}
                  </h2>
                  <p className="text-gray-500 font-semibold text-sm mt-1">
                    {currentTrack.artist}
                  </p>
                </div>

                {/* Scrubber Range */}
                <div className="space-y-1.5">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 rounded-lg bg-black/10 dark:bg-white/10 appearance-none cursor-pointer accent-[#a7c957]"
                  />
                  <div className="flex justify-between text-xs text-gray-500 font-semibold">
                    <span>{formatTime(currentTime)}</span>
                    <span>{currentTrack.duration || formatTime(duration)}</span>
                  </div>
                </div>

                {/* Main Playback Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handlePrev}
                      className="p-3 rounded-full text-gray-600 dark:text-gray-300 hover:text-[#a7c957] transition-all hover:bg-black/5 dark:hover:bg-white/5"
                      title="Previous"
                    >
                      <SkipBack size={22} />
                    </button>

                    <button
                      onClick={togglePlay}
                      className="w-16 h-16 rounded-full bg-gradient-to-r from-[#a7c957] to-[#c2e078] text-[#0b0f0a] flex items-center justify-center hover:scale-105 transition-all shadow-[0_0_25px_rgba(167,201,87,0.5)] cursor-pointer"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                    </button>

                    <button
                      onClick={handleNext}
                      className="p-3 rounded-full text-gray-600 dark:text-gray-300 hover:text-[#a7c957] transition-all hover:bg-black/5 dark:hover:bg-white/5"
                      title="Next"
                    >
                      <SkipForward size={22} />
                    </button>

                    <button
                      onClick={() => setIsLooping(!isLooping)}
                      className={`p-3 rounded-full transition-all ${
                        isLooping ? 'text-[#a7c957] bg-[#a7c957]/15' : 'text-gray-500 hover:text-white'
                      }`}
                      title={isLooping ? "Loop On" : "Loop Off"}
                    >
                      <Repeat size={18} />
                    </button>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center gap-3">
                    <button onClick={toggleMute} className="text-gray-500 hover:text-white">
                      {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-24 h-1.5 rounded-lg bg-black/10 dark:bg-white/10 appearance-none cursor-pointer accent-[#a7c957]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Track Type Filters ──────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide no-scrollbar">
          {TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                selectedType === type
                  ? 'bg-[#a7c957] text-[#0b0f0a] border-transparent shadow-[0_0_12px_rgba(167,201,87,0.4)]'
                  : 'text-gray-600 dark:text-gray-400 bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 hover:border-[#a7c957]/30 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* ─── Playlist Stream ─────────────────────────────────────────────────── */}
        <div className="bg-white/70 dark:bg-[#0c100a]/80 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 md:p-6 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
            <h3 className="font-heading font-black text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <ListMusic size={18} className="text-[#a7c957]" /> Fandom Soundtracks Queue ({tracks.length})
            </h3>
            <span className="text-xs text-gray-500 font-semibold">High Fidelity 320kbps Stream</span>
          </div>

          <div className="divide-y divide-black/5 dark:divide-white/5">
            {tracks.map((track, idx) => {
              const isCurrent = currentTrackIndex === idx;

              return (
                <div
                  key={track._id}
                  onClick={() => playSpecificTrack(idx)}
                  className={`p-4 md:px-6 flex items-center justify-between gap-4 transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#a7c957]/10 dark:bg-[#a7c957]/15'
                      : 'hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="w-6 text-center text-xs font-bold text-gray-400">
                      {isCurrent && isPlaying ? (
                        <div className="flex items-end justify-center gap-0.5 h-3">
                          <span className="w-1 bg-[#a7c957] animate-pulse h-2" />
                          <span className="w-1 bg-[#a7c957] animate-pulse h-3" />
                          <span className="w-1 bg-[#a7c957] animate-pulse h-1.5" />
                        </div>
                      ) : (
                        idx + 1
                      )}
                    </span>

                    <img
                      src={track.coverImage}
                      alt={track.title}
                      className="w-12 h-12 rounded-xl object-cover shadow-md flex-shrink-0"
                    />

                    <div className="min-w-0">
                      <h4 className={`text-sm font-bold truncate ${isCurrent ? 'text-[#a7c957]' : 'text-gray-900 dark:text-white'}`}>
                        {track.title}
                      </h4>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {track.artist} • <span className="text-gray-400">{track.fandom}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-[10px] font-bold text-gray-400 border border-black/5 dark:border-white/10 hidden sm:inline-block">
                      {track.type}
                    </span>

                    <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                      <Clock size={12} /> {track.duration}
                    </span>

                    <button
                      onClick={(e) => handleLike(e, track._id)}
                      className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                      title="Favorite"
                    >
                      <Heart size={14} fill={likedMap[track._id] ? 'currentColor' : 'none'} className={likedMap[track._id] ? 'text-rose-500' : ''} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
