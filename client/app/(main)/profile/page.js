'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useWatchlist } from '@/hooks/useWatchlist';
import { BASE_IMG_URL } from '@/utils/tmdb';
import { apiFetch } from '@/utils/apiClient';
import toast from 'react-hot-toast';
import { 
  LogOut, 
  Play, 
  Compass, 
  Star, 
  Clock, 
  ShieldCheck, 
  SlidersHorizontal, 
  Sparkles, 
  Check, 
  X, 
  Film, 
  Gamepad2, 
  Tv, 
  Music, 
  BookOpen, 
  Masks, 
  Flame,
  Volume2,
  Server
} from 'lucide-react';

const FANDOM_OPTIONS = [
  { id: 'Anime', label: 'Anime', icon: Flame },
  { id: 'Gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'Movies', label: 'Movies', icon: Film },
  { id: 'TV Shows', label: 'TV Shows', icon: Tv },
  { id: 'K-Pop', label: 'K-Pop', icon: Music },
  { id: 'Comics', label: 'Comics', icon: BookOpen },
  { id: 'Manga', label: 'Manga', icon: BookOpen },
  { id: 'Cosplay', label: 'Cosplay', icon: Sparkles },
];

const INTEREST_TAGS = [
  'Action & Shonen',
  'Sci-Fi & Cyberpunk',
  'Dark Fantasy',
  'Open World RPGs',
  'Superhero Lore',
  'K-Wave Idols',
  'Psychological Thrillers',
  'Esports & Tournaments'
];

const AVATAR_PRESETS = [
  { name: 'Cyberpunk Neon', url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80' },
  { name: 'Anime Shinobi', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&auto=format&fit=crop&q=80' },
  { name: 'Futuristic Netrunner', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80' },
  { name: 'Shadow Knight', url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=200&auto=format&fit=crop&q=80' },
  { name: 'Cosmic Explorer', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&auto=format&fit=crop&q=80' }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

export default function ProfilePage() {
  const { user, logout, isAuthLoading, updateUser } = useAuth();
  const { watchlist } = useWatchlist();
  const router = useRouter();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [favoriteFandoms, setFavoriteFandoms] = useState([]);
  const [categoriesOfInterest, setCategoriesOfInterest] = useState([]);
  const [displayPrefs, setDisplayPrefs] = useState({
    streaming_server: 'primary',
    autoplay_trailers: true,
    preferred_theme: 'dark'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    } else if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || '');
      setFavoriteFandoms(user.favorite_fandoms || ['Anime', 'Gaming']);
      setCategoriesOfInterest(user.categories_of_interest || ['Action & Shonen', 'Dark Fantasy']);
      setDisplayPrefs(user.display_preferences || {
        streaming_server: 'primary',
        autoplay_trailers: true,
        preferred_theme: 'dark'
      });
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || !user) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] dark:bg-[#060805] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#a7c957] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const toggleFandom = (fandomName) => {
    setFavoriteFandoms(prev => 
      prev.includes(fandomName) 
        ? prev.filter(f => f !== fandomName)
        : [...prev, fandomName]
    );
  };

  const toggleInterest = (tag) => {
    setCategoriesOfInterest(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiFetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          avatar,
          favorite_fandoms: favoriteFandoms,
          categories_of_interest: categoriesOfInterest,
          display_preferences: displayPrefs
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        if (updateUser) updateUser(data.user);
        toast.success('Fandom preferences updated!', {
          style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
        });
        setIsEditOpen(false);
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      toast.error('Network error saving preferences');
    } finally {
      setSaving(false);
    }
  };

  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U';

  return (
    <main className="min-h-screen bg-[#FBFBFD] dark:bg-[#060805] text-gray-900 dark:text-gray-200 font-body pb-32 relative overflow-hidden transition-colors duration-500">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#a7c957]/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-black/5 dark:bg-[#0b0f0a]/50 blur-[150px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <div className="relative w-full pt-32 pb-16 px-6 z-10 border-b border-black/5 dark:border-white/5 bg-gradient-to-b from-white/80 to-[#FBFBFD] dark:from-[#0b0f0a]/80 dark:to-[#060805] backdrop-blur-xl transition-colors duration-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          
          {/* Animated Avatar */}
          <div className="relative group cursor-pointer" onClick={() => setIsEditOpen(true)}>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-1.5 bg-gradient-to-r from-[#a7c957] via-[#4ade80] to-[#a7c957] rounded-full blur-[10px] opacity-70 group-hover:opacity-100 transition duration-500"
            />
            <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-white dark:border-[#1a2315] bg-gray-100 dark:bg-[#0a0d08] flex items-center justify-center z-10 shadow-2xl transition-colors duration-500">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl font-black text-[#a7c957] tracking-tighter">{initials}</span>
              )}
            </div>
            <div className="absolute bottom-1 right-1 z-20 p-2 rounded-full bg-[#0b0f0a] border border-[#a7c957]/40 text-[#a7c957] shadow-lg group-hover:scale-110 transition-transform">
              <SlidersHorizontal size={14} />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
              <h1 className="text-4xl md:text-5xl font-heading font-black text-gray-900 dark:text-white tracking-tight transition-colors duration-500">
                {user.name}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#a7c957]/10 dark:bg-gradient-to-r dark:from-[#a7c957]/20 dark:to-[#a7c957]/5 border border-[#a7c957]/30 rounded-full text-[#a7c957] text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(167,201,87,0.2)]">
                <ShieldCheck size={14} /> {user.role === 'admin' ? 'Admin Elite' : 'VIP Fandom Member'}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium tracking-wide mb-4 transition-colors duration-500">{user.email}</p>
            
            {/* Favorite Fandom Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-6">
              {(user.favorite_fandoms && user.favorite_fandoms.length > 0 ? user.favorite_fandoms : ['Anime', 'Gaming']).map((fandom) => (
                <span 
                  key={fandom}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 dark:bg-white/5 border border-white/10 text-xs font-medium text-gray-800 dark:text-gray-300"
                >
                  <Sparkles size={11} className="text-[#a7c957]" /> {fandom}
                </span>
              ))}
              <button
                onClick={() => setIsEditOpen(true)}
                className="text-xs text-[#a7c957] hover:underline font-semibold ml-1 flex items-center gap-1"
              >
                <SlidersHorizontal size={12} /> Edit Fandoms
              </button>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8">
              <div className="flex flex-col">
                <span className="text-[#a7c957] text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Star size={12}/> Saved In Vault</span>
                <span className="text-2xl font-black text-gray-900 dark:text-white transition-colors duration-500">{watchlist.length} <span className="text-sm font-medium text-gray-500">Titles</span></span>
              </div>
              <div className="w-px h-10 bg-black/10 dark:bg-white/10 hidden md:block transition-colors duration-500" />
              <div className="flex flex-col">
                <span className="text-[#a7c957] text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Clock size={12}/> Active Server</span>
                <span className="text-2xl font-black text-gray-900 dark:text-white transition-colors duration-500 capitalize">{user.display_preferences?.streaming_server || 'Primary'}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="shrink-0 relative z-20 flex flex-col md:flex-row items-center gap-4">
            <button
              onClick={() => setIsEditOpen(true)}
              className="relative overflow-hidden group flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-md"
            >
              <SlidersHorizontal size={16} className="text-[#a7c957]" />
              Preferences
            </button>

            {user.role === 'admin' && (
              <Link href="/admin" className="relative overflow-hidden group flex items-center gap-2 bg-[#a7c957]/10 text-[#a7c957] border border-[#a7c957]/30 hover:bg-[#a7c957] hover:text-[#0b0f0a] font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(167,201,87,0.15)]">
                <ShieldCheck size={16} className="group-hover:scale-110 transition-transform" />
                Admin Panel
              </Link>
            )}
            <button 
              onClick={handleLogout}
              className="relative overflow-hidden group px-6 py-3 rounded-full font-bold bg-white dark:bg-[#0a0d08] border border-red-500/30 dark:border-red-900/30 text-gray-700 dark:text-gray-300 transition-all shadow-lg hover:shadow-red-500/20 dark:hover:shadow-red-900/20"
            >
              <span className="relative flex items-center gap-2 group-hover:text-red-500 transition-colors">
                <LogOut size={15} />
                Sign Out
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Fandom Preferences Summary Banner */}
      <div className="max-w-6xl mx-auto px-6 mt-10">
        <div className="p-6 rounded-3xl bg-gradient-to-r from-white/60 via-white/40 to-white/60 dark:from-[#0b0f0a]/60 dark:via-[#11180f]/40 dark:to-[#0b0f0a]/60 border border-black/5 dark:border-white/10 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#a7c957] flex items-center gap-2">
              <Sparkles size={14} /> Curated Interests & Fandom Profile
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Personalized algorithms tailor your Explore feed and recommendations based on your selected interests.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {(user.categories_of_interest && user.categories_of_interest.length > 0 
                ? user.categories_of_interest 
                : ['Action & Shonen', 'Sci-Fi & Cyberpunk']
              ).map((interest) => (
                <span key={interest} className="px-2.5 py-1 rounded-lg bg-[#a7c957]/10 text-[#a7c957] border border-[#a7c957]/20 text-xs font-semibold">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsEditOpen(true)}
            className="shrink-0 px-4 py-2 rounded-xl bg-[#a7c957] text-[#0b0f0a] text-xs font-bold hover:brightness-110 transition-all shadow-md"
          >
            Customize
          </button>
        </div>
      </div>

      {/* Watchlist Section */}
      <div className="max-w-6xl mx-auto px-6 mt-14 relative z-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black font-heading text-gray-900 dark:text-white tracking-tight transition-colors duration-500">Your Fandom Vault</h2>
            <p className="text-gray-500 mt-1 font-medium text-sm">Saved movies, series, and personal notes</p>
          </div>
          {watchlist.length > 0 && (
            <Link href="/mylist" className="text-sm font-bold text-[#a7c957] hover:underline transition-colors flex items-center gap-1 relative z-20">
              Manage Collection & Notes <Compass size={14} />
            </Link>
          )}
        </div>

        {watchlist.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 relative z-20"
          >
            {watchlist.map((item) => (
              <motion.div key={item.movieId} variants={itemVariants}>
                <Link
                  href={`/stream/${item.movieId}?type=${item.media_type || 'movie'}`}
                  className="block group relative rounded-2xl bg-white dark:bg-[#0a0d08] border border-black/5 dark:border-white/5 transition-all duration-500 hover:border-[#a7c957]/40 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(167,201,87,0.15)] shadow-sm dark:shadow-none"
                >
                  <div className="relative w-full aspect-[2/3] rounded-t-2xl overflow-hidden">
                    <img
                      src={`${BASE_IMG_URL}${item.poster_path}`}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="w-14 h-14 bg-[#a7c957] text-[#0b0f0a] rounded-full flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-[0_0_20px_rgba(167,201,87,0.5)]">
                        <Play size={24} fill="currentColor" className="ml-1" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 relative">
                    <div className="absolute top-[-14px] right-4 px-2 py-0.5 bg-white dark:bg-[#0b0f0a] border border-[#a7c957]/30 text-[#a7c957] text-[10px] font-bold tracking-widest uppercase rounded shadow-md">
                      {item.media_type === 'tv' ? 'Series' : 'Movie'}
                    </div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate group-hover:text-black dark:group-hover:text-white transition-colors mt-1">
                      {item.title}
                    </p>
                    {item.note && (
                      <p className="text-[11px] text-[#a7c957] truncate mt-1 italic opacity-85">
                        📝 {item.note}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl mx-auto mt-8 relative z-20"
          >
            <div className="relative p-12 rounded-[40px] bg-white/80 dark:bg-[#0a0d08]/80 backdrop-blur-2xl border border-black/5 dark:border-white/5 shadow-2xl text-center overflow-hidden transition-colors duration-500">
              <Compass className="w-12 h-12 text-[#a7c957]/80 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Your vault is empty</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 max-w-md mx-auto">
                Explore the fandom universe and click the bookmark button on any title to save it to your personal collection.
              </p>
              <Link 
                href="/explore" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#a7c957] text-[#0b0f0a] font-bold text-sm hover:brightness-110 transition-all shadow-[0_0_20px_rgba(167,201,87,0.3)]"
              >
                Explore Fandoms <Play size={14} fill="currentColor" />
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      {/* Edit Preferences Modal */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b0f0a] border border-white/15 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-2xl font-bold font-heading text-white">Customize Profile & Preferences</h2>
                  <p className="text-xs text-gray-400 mt-1">Personalize your fandom affinities, UI behaviors, and avatar</p>
                </div>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSavePreferences} className="space-y-6">
                {/* Display Name */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#a7c957]"
                  />
                </div>

                {/* Avatar Selection */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Choose Avatar Preset</label>
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {AVATAR_PRESETS.map((p) => (
                      <button
                        type="button"
                        key={p.name}
                        onClick={() => setAvatar(p.url)}
                        className={`relative shrink-0 w-14 h-14 rounded-full overflow-hidden border-2 transition-all ${
                          avatar === p.url ? 'border-[#a7c957] ring-2 ring-[#a7c957]/50 scale-105' : 'border-white/20 hover:border-white/50 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                        {avatar === p.url && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Check size={14} className="text-[#a7c957]" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2">
                    <input
                      type="url"
                      placeholder="Or paste custom image URL..."
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      className="w-full px-4 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-[#a7c957]"
                    />
                  </div>
                </div>

                {/* Favorite Fandoms (Multi-select) */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                    Favorite Fandom Categories (SRS 8 Core Disciplines)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {FANDOM_OPTIONS.map((f) => {
                      const selected = favoriteFandoms.includes(f.id);
                      const Icon = f.icon;
                      return (
                        <button
                          type="button"
                          key={f.id}
                          onClick={() => toggleFandom(f.id)}
                          className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all ${
                            selected
                              ? 'bg-[#a7c957]/20 border-[#a7c957] text-[#a7c957] shadow-sm'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <Icon size={14} />
                          <span>{f.label}</span>
                          {selected && <Check size={12} className="ml-auto" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Categories / Genres of Interest */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                    Themes & Lore Interests
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_TAGS.map((tag) => {
                      const selected = categoriesOfInterest.includes(tag);
                      return (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => toggleInterest(tag)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                            selected
                              ? 'bg-[#a7c957]/20 border-[#a7c957] text-[#a7c957]'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Display & Playback Behaviors */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-300">
                    Playback & Stream Engine
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white">Autoplay Previews</div>
                      <div className="text-xs text-gray-400">Automatically preview trailers and intros on hover</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={displayPrefs.autoplay_trailers}
                      onChange={(e) => setDisplayPrefs(prev => ({ ...prev, autoplay_trailers: e.target.checked }))}
                      className="w-5 h-5 accent-[#a7c957] rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white">Streaming Server CDN</div>
                      <div className="text-xs text-gray-400">Primary server optimizes 4K buffering</div>
                    </div>
                    <select
                      value={displayPrefs.streaming_server}
                      onChange={(e) => setDisplayPrefs(prev => ({ ...prev, streaming_server: e.target.value }))}
                      className="px-3 py-1.5 bg-black/60 border border-white/20 rounded-lg text-xs text-white focus:outline-none"
                    >
                      <option value="primary">Primary (Fastest)</option>
                      <option value="backup">Backup (Global Fallback)</option>
                    </select>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-full bg-[#a7c957] text-[#0b0f0a] font-bold text-sm hover:brightness-110 transition-all shadow-[0_0_15px_rgba(167,201,87,0.3)]"
                  >
                    {saving ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
