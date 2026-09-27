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
  Palette, 
  Check, 
  X, 
  Film, 
  Gamepad2, 
  Tv, 
  Music, 
  BookOpen, 
  Flame,
  Volume2,
  Server,
  Upload,
  Video,
  Eye,
  ThumbsUp,
  MessageSquare,
  TrendingUp,
  BarChart3,
  HardDrive,
  Trash2,
  Share2,
  Plus,
  Radio,
  User,
  Heart,
  ExternalLink
} from 'lucide-react';

const FANDOM_OPTIONS = [
  { id: 'Anime', label: 'Anime', icon: Flame },
  { id: 'Gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'Movies', label: 'Movies', icon: Film },
  { id: 'TV Shows', label: 'TV Shows', icon: Tv },
  { id: 'K-Pop', label: 'K-Pop', icon: Music },
  { id: 'Comics', label: 'Comics', icon: BookOpen },
  { id: 'Manga', label: 'Manga', icon: BookOpen },
  { id: 'Cosplay', label: 'Cosplay', icon: Palette },
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

const DEFAULT_UPLOADS = [
  {
    id: 'vid-1',
    title: 'Cyberpunk 2077: The Philosophy of Night City & V\'s Fate',
    category: 'Lore Breakdown',
    thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/LembwKDo1Dk',
    duration: '18:42',
    views: 18420,
    likes: 1490,
    comments: 234,
    retention: 82,
    status: 'published',
    createdAt: '2 days ago',
    description: 'A deep-dive video essay analyzing Mike Pondsmith\'s cyberpunk ethics and CDPR\'s environmental storytelling.'
  },
  {
    id: 'vid-2',
    title: 'Jujutsu Kaisen Season 2 - Gojo Satoru Awakening [4K HDR AMV]',
    category: 'Anime AMV & Edits',
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/LembwKDo1Dk',
    duration: '03:15',
    views: 34180,
    likes: 3820,
    comments: 492,
    retention: 94,
    status: 'published',
    createdAt: '5 days ago',
    description: 'High-octane 60FPS anime music video honoring the Honored One across Shibuya and Hidden Inventory.'
  },
  {
    id: 'vid-3',
    title: 'Dune Part Two: Fremen Desert Survival & Spice Biology Explained',
    category: 'Film Theories',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/LembwKDo1Dk',
    duration: '24:10',
    views: 9240,
    likes: 810,
    comments: 118,
    retention: 76,
    status: 'published',
    createdAt: '1 week ago',
    description: 'Answering how sand worms produce the melange and Frank Herbert\'s ecological allegories in Arrakis.'
  }
];

export default function ProfilePage() {
  const { user, logout, isAuthLoading, updateUser } = useAuth();
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const router = useRouter();

  // Navigation Tabs: overview | creator | vault | downloads | preferences
  const [activeTab, setActiveTab] = useState('creator');

  // Edit Profile Modal
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

  // Creator Studio State
  const [userUploads, setUserUploads] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activePreviewVideo, setActivePreviewVideo] = useState(null);
  const [newVideo, setNewVideo] = useState({
    title: '',
    category: 'Anime AMV & Edits',
    videoUrl: '',
    thumbnail: '',
    duration: '10:00',
    description: ''
  });

  // Offline Downloads State
  const [offlineDownloads, setOfflineDownloads] = useState([]);

  // Load User Data & Local Data on Mount
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

      // Load Creator Uploads from localStorage or defaults
      try {
        const storedUploads = localStorage.getItem('fanhub_user_uploads');
        if (storedUploads) {
          setUserUploads(JSON.parse(storedUploads));
        } else {
          setUserUploads(DEFAULT_UPLOADS);
          localStorage.setItem('fanhub_user_uploads', JSON.stringify(DEFAULT_UPLOADS));
        }
      } catch (e) {
        setUserUploads(DEFAULT_UPLOADS);
      }

      // Load Offline Vault Downloads
      try {
        const storedDownloads = localStorage.getItem('fanhub_offline_vault');
        if (storedDownloads) {
          setOfflineDownloads(JSON.parse(storedDownloads));
        }
      } catch (e) {
        setOfflineDownloads([]);
      }
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || !user) {
    return (
      <div className="min-h-screen bg-[#080c07] flex items-center justify-center">
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

  // Creator Studio: Publish Video Handler
  const handlePublishVideo = (e) => {
    e.preventDefault();
    if (!newVideo.title) {
      return toast.error("Please provide a video title");
    }

    const createdItem = {
      id: `vid-${Date.now()}`,
      title: newVideo.title,
      category: newVideo.category,
      thumbnail: newVideo.thumbnail || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
      videoUrl: newVideo.videoUrl || 'https://www.youtube.com/embed/LembwKDo1Dk',
      duration: newVideo.duration || '12:00',
      views: 1,
      likes: 1,
      comments: 0,
      retention: 100,
      status: 'published',
      createdAt: 'Just now',
      description: newVideo.description || 'Uploaded by fandom creator.'
    };

    const updated = [createdItem, ...userUploads];
    setUserUploads(updated);
    try {
      localStorage.setItem('fanhub_user_uploads', JSON.stringify(updated));
    } catch (e) {}

    toast.success("Video published to your Creator Studio!", {
      style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
    });

    setNewVideo({
      title: '',
      category: 'Anime AMV & Edits',
      videoUrl: '',
      thumbnail: '',
      duration: '10:00',
      description: ''
    });
    setIsUploadModalOpen(false);
  };

  // Creator Studio: Delete Video Handler
  const handleDeleteVideo = (id) => {
    const updated = userUploads.filter(v => v.id !== id);
    setUserUploads(updated);
    try {
      localStorage.setItem('fanhub_user_uploads', JSON.stringify(updated));
    } catch (e) {}
    toast.success("Video removed from Creator Studio");
  };

  // Offline Downloads: Delete Item
  const handleDeleteDownload = (id) => {
    const updated = offlineDownloads.filter(d => String(d.id) !== String(id));
    setOfflineDownloads(updated);
    try {
      localStorage.setItem('fanhub_offline_vault', JSON.stringify(updated));
    } catch (e) {}
    toast.success("Package deleted from Offline Vault");
  };

  // Aggregated Creator Metrics
  const totalViews = userUploads.reduce((acc, v) => acc + (v.views || 0), 0);
  const totalLikes = userUploads.reduce((acc, v) => acc + (v.likes || 0), 0);
  const totalComments = userUploads.reduce((acc, v) => acc + (v.comments || 0), 0);
  const avgRetention = userUploads.length > 0 
    ? Math.round(userUploads.reduce((acc, v) => acc + (v.retention || 80), 0) / userUploads.length)
    : 85;

  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U';

  return (
    <main className="min-h-screen bg-[#080c07] text-gray-200 font-body pb-32 relative overflow-hidden transition-colors duration-500">
      
      {/* Decorative Matcha Ambient Lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#a7c957]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-[#a7c957]/5 blur-[160px] rounded-full pointer-events-none" />

      {/* ─────────────────────────────────────────────────────────────
          1. CREATOR HERO PROFILE CARD
      ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full pt-32 pb-12 px-6 z-10 border-b border-white/10 bg-gradient-to-b from-[#0b0f0a]/90 to-[#080c07] backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Left Avatar & User Identity */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative group cursor-pointer" onClick={() => setIsEditOpen(true)}>
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-[#a7c957]/40 bg-[#0a0d08] flex items-center justify-center shadow-[0_0_25px_rgba(167,201,87,0.25)]">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-black text-[#a7c957]">{initials}</span>
                )}
              </div>
              <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#a7c957] text-[#0b0f0a] font-bold text-xs shadow-md">
                <SlidersHorizontal size={12} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-md bg-[#a7c957]/20 border border-[#a7c957]/40 text-[#a7c957] text-xs font-bold uppercase tracking-wider">
                  {user.role === 'admin' ? '🛡️ Admin Studio' : '🌟 Creator Tier'}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">{user.email}</p>
              <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-gray-400">
                <span>Karma Level: <strong className="text-white">Level 7 Lorekeeper</strong></span>
                <span>•</span>
                <span>Submissions: <strong className="text-[#a7c957]">{userUploads.length} Videos</strong></span>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditOpen(true)}
              className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <SlidersHorizontal size={14} /> Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. LUXURY DASHBOARD NAVIGATION TABS
      ───────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 border-b border-white/10">
          <button
            onClick={() => setActiveTab('creator')}
            className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'creator'
                ? 'bg-[#a7c957] text-[#0b0f0a] shadow-[0_0_15px_rgba(167,201,87,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Video size={16} /> Creator Studio ({userUploads.length})
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'vault'
                ? 'bg-[#a7c957] text-[#0b0f0a] shadow-[0_0_15px_rgba(167,201,87,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Film size={16} /> My Watch Vault ({watchlist.length})
          </button>

          <button
            onClick={() => setActiveTab('downloads')}
            className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'downloads'
                ? 'bg-[#a7c957] text-[#0b0f0a] shadow-[0_0_15px_rgba(167,201,87,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <HardDrive size={16} /> Offline Vault ({offlineDownloads.length})
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-[#a7c957] text-[#0b0f0a] shadow-[0_0_15px_rgba(167,201,87,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 size={16} /> Fandom Taste & Preferences
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. TAB 1: CREATOR STUDIO & VIDEO UPLOADS DASHBOARD
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'creator' && (
        <div className="max-w-6xl mx-auto px-6 py-6 space-y-8">
          
          {/* Creator Header with Publish Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#a7c957] mb-1">
                <Radio size={14} className="animate-pulse" />
                Creator Broadcast Hub
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-black text-white">
                Fan Video Content & Theory Studio
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
                Upload your anime AMVs, cinematic lore breakdowns, and gaming highlights. Monitor live audience reach, likes, retention, and viewer comments.
              </p>
            </div>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-6 py-3 rounded-full bg-[#a7c957] text-[#0b0f0a] font-black text-xs sm:text-sm hover:brightness-110 shadow-[0_0_20px_rgba(167,201,87,0.3)] transition-all active:scale-95 flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Upload size={16} /> Upload New Creation
            </button>
          </div>

          {/* 4 Analytics KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase">
                <span>Total Views</span>
                <Eye size={16} className="text-[#a7c957]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                {totalViews.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                <TrendingUp size={12} /> +24.8% this week
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase">
                <span>Total Likes</span>
                <Heart size={16} className="text-red-400 fill-red-400/20" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                {totalLikes.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                <TrendingUp size={12} /> +18.2% engagement
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase">
                <span>Discussions</span>
                <MessageSquare size={16} className="text-sky-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                {totalComments.toLocaleString()}
              </div>
              <div className="text-[11px] text-gray-400 font-semibold">
                Active fan comments
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase">
                <span>Audience Retention</span>
                <BarChart3 size={16} className="text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                {avgRetention}%
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-[#a7c957]" style={{ width: `${avgRetention}%` }} />
              </div>
            </div>
          </div>

          {/* Uploaded Videos Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-black text-white flex items-center gap-2">
              <span>Published Content Portfolio</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300 font-mono">
                {userUploads.length}
              </span>
            </h3>

            {userUploads.length === 0 ? (
              <div className="text-center py-16 p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
                <Video size={40} className="mx-auto text-gray-600" />
                <h4 className="text-lg font-bold text-white">No creations uploaded yet</h4>
                <p className="text-sm text-gray-400 max-w-sm mx-auto">
                  Publish your first anime edit, lore analysis, or reaction video and join the fan continuum.
                </p>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-6 py-2.5 rounded-full bg-[#a7c957] text-[#0b0f0a] font-bold text-xs cursor-pointer"
                >
                  Upload First Video
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userUploads.map((video) => (
                  <div
                    key={video.id}
                    className="group rounded-3xl bg-[#0b0f0a] border border-white/10 overflow-hidden shadow-xl hover:border-[#a7c957]/40 transition-all flex flex-col justify-between"
                  >
                    {/* Video Thumbnail Header */}
                    <div 
                      className="relative w-full aspect-video bg-black overflow-hidden cursor-pointer"
                      onClick={() => setActivePreviewVideo(video)}
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#a7c957] text-[#0b0f0a] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play size={20} fill="currentColor" className="ml-1" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white font-mono text-[10px] font-bold">
                        {video.duration}
                      </span>
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#a7c957]/90 text-[#0b0f0a] text-[10px] font-black uppercase">
                        {video.category}
                      </span>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 
                          onClick={() => setActivePreviewVideo(video)}
                          className="font-bold text-white text-base line-clamp-2 hover:text-[#a7c957] transition-colors cursor-pointer"
                        >
                          {video.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{video.description}</p>
                      </div>

                      {/* Performance Metric Row */}
                      <div className="space-y-2.5 pt-3 border-t border-white/10">
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="p-2 rounded-xl bg-white/5">
                            <div className="text-[10px] text-gray-400">Views</div>
                            <div className="font-bold text-white font-mono mt-0.5">{(video.views || 0).toLocaleString()}</div>
                          </div>
                          <div className="p-2 rounded-xl bg-white/5">
                            <div className="text-[10px] text-gray-400">Likes</div>
                            <div className="font-bold text-red-400 font-mono mt-0.5">{(video.likes || 0).toLocaleString()}</div>
                          </div>
                          <div className="p-2 rounded-xl bg-white/5">
                            <div className="text-[10px] text-gray-400">Comments</div>
                            <div className="font-bold text-[#a7c957] font-mono mt-0.5">{(video.comments || 0).toLocaleString()}</div>
                          </div>
                        </div>

                        {/* Retention Bar */}
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                            <span>Audience Retention:</span>
                            <span className="font-bold text-white font-mono">{video.retention || 80}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full bg-emerald-400" style={{ width: `${video.retention || 80}%` }} />
                          </div>
                        </div>

                        {/* Card Action Footer */}
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-[10px] text-gray-500 font-mono">
                            {video.createdAt}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                if (navigator.clipboard) {
                                  navigator.clipboard.writeText(video.videoUrl);
                                  toast.success("Video URL copied to clipboard!");
                                }
                              }}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                              title="Share Video"
                            >
                              <Share2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteVideo(video.id)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                              title="Delete Video"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. TAB 2: MY FANDOM WATCH VAULT (Watchlist)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'vault' && (
        <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-heading font-black text-white">
                Saved Fandom Vault
              </h3>
              <p className="text-xs text-gray-400">All bookmarks, movie queues, and notes synced across your devices.</p>
            </div>
            <Link
              href="/explore"
              className="px-4 py-2 rounded-full bg-[#a7c957]/15 border border-[#a7c957]/30 text-[#a7c957] font-bold text-xs hover:bg-[#a7c957] hover:text-[#0b0f0a] transition-all"
            >
              + Discover More Titles
            </Link>
          </div>

          {watchlist.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-3">
              <Film size={36} className="mx-auto text-gray-600" />
              <h4 className="text-base font-bold text-white">Your Vault is empty</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Explore thousands of movies and series and add them to your watchlist.
              </p>
              <Link href="/" className="inline-block px-5 py-2 rounded-full bg-[#a7c957] text-[#0b0f0a] font-bold text-xs">
                Browse Home
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {watchlist.map((item) => (
                <div key={item.movieId || item.id} className="group relative rounded-2xl bg-[#0b0f0a] border border-white/10 overflow-hidden flex flex-col justify-between">
                  <div className="relative aspect-[2/3] w-full bg-black overflow-hidden">
                    <img
                      src={item.poster_path ? `${BASE_IMG_URL}${item.poster_path}` : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&auto=format&fit=crop&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <Link
                      href={`/stream/${item.movieId || item.id}?type=${item.media_type || 'movie'}`}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#a7c957] text-[#0b0f0a] flex items-center justify-center">
                        <Play size={16} fill="currentColor" className="ml-0.5" />
                      </div>
                    </Link>
                    <button
                      onClick={() => removeFromWatchlist(item.movieId || item.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-gray-400 hover:text-red-400 border border-white/10 transition-colors"
                      title="Remove from Vault"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  <div className="p-2.5">
                    <h5 className="font-bold text-xs text-white truncate">{item.title}</h5>
                    <span className="text-[10px] text-gray-400 uppercase font-mono">{item.media_type || 'Movie'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. TAB 3: OFFLINE VAULT DOWNLOADS
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'downloads' && (
        <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-heading font-black text-white">
                Offline Downloaded Packages
              </h3>
              <p className="text-xs text-gray-400">Media stored on local device for offline flight or convention streaming.</p>
            </div>
          </div>

          {offlineDownloads.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-3">
              <HardDrive size={36} className="mx-auto text-gray-600" />
              <h4 className="text-base font-bold text-white">No offline downloads found</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Use the download icon on any movie card or stream page to save offline packages.
              </p>
              <Link href="/" className="inline-block px-5 py-2 rounded-full bg-[#a7c957] text-[#0b0f0a] font-bold text-xs">
                Browse Titles to Download
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {offlineDownloads.map((pkg) => (
                <div key={pkg.id} className="p-4 rounded-2xl bg-[#0b0f0a] border border-white/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-12 h-16 rounded-lg bg-black overflow-hidden shrink-0 relative border border-white/15">
                      <img
                        src={pkg.poster_path ? `${BASE_IMG_URL}${pkg.poster_path}` : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100&auto=format&fit=crop&q=80'}
                        alt={pkg.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <h5 className="font-bold text-sm text-white truncate">{pkg.title}</h5>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-mono mt-0.5">
                        <span className="text-[#a7c957] font-bold uppercase">{pkg.quality}</span>
                        <span>•</span>
                        <span>{pkg.size}</span>
                      </div>
                      <span className="text-[10px] text-gray-500">Offline Ready</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/stream/${pkg.id}`}
                      className="p-2 rounded-full bg-[#a7c957] text-[#0b0f0a] hover:brightness-110 shadow-sm"
                      title="Play Offline"
                    >
                      <Play size={14} fill="currentColor" />
                    </Link>
                    <button
                      onClick={() => handleDeleteDownload(pkg.id)}
                      className="p-2 rounded-full bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete Package"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. TAB 4: FANDOM TASTE & PREFERENCES
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="max-w-6xl mx-auto px-6 py-6 space-y-8">
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-6">
            <h3 className="text-xl font-heading font-black text-white flex items-center gap-2">
              <Compass size={20} className="text-[#a7c957]" />
              Fandom DNA & Selected Universes
            </h3>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">Favorite Fandoms</label>
              <div className="flex flex-wrap gap-2.5">
                {favoriteFandoms.map(f => (
                  <span key={f} className="px-4 py-2 rounded-full bg-[#a7c957]/15 border border-[#a7c957]/30 text-[#a7c957] font-bold text-xs flex items-center gap-1.5">
                    <Flame size={14} /> {f}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">Sub-genres & Categories of Interest</label>
              <div className="flex flex-wrap gap-2.5">
                {categoriesOfInterest.map(c => (
                  <span key={c} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 font-medium text-xs">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Stream Quality & Server Priority</h4>
                <p className="text-xs text-gray-400">Current playback protocol: <strong className="text-[#a7c957] capitalize">{displayPrefs.streaming_server} Node</strong></p>
              </div>
              <button
                onClick={() => setIsEditOpen(true)}
                className="px-5 py-2 rounded-full bg-[#a7c957] text-[#0b0f0a] font-bold text-xs"
              >
                Modify Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          7. PUBLISH VIDEO MODAL
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0b0f0a] border border-white/15 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-heading font-black text-white">Publish Fan Video</h3>
                  <p className="text-xs text-gray-400">Share your original edits, AMVs, or theory breakdowns with the community.</p>
                </div>
                <button onClick={() => setIsUploadModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handlePublishVideo} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Video Title</label>
                  <input
                    type="text"
                    required
                    value={newVideo.title}
                    onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                    placeholder="e.g. Attack on Titan Finale: The Rumbling Analysis"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#a7c957]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-300">Fandom Category</label>
                    <select
                      value={newVideo.category}
                      onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                      className="w-full px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#a7c957]"
                    >
                      <option value="Anime AMV & Edits" className="bg-[#0b0f0a]">Anime AMV & Edits</option>
                      <option value="Lore Breakdown" className="bg-[#0b0f0a]">Lore Breakdown</option>
                      <option value="Film Theories" className="bg-[#0b0f0a]">Film Theories</option>
                      <option value="Gaming Montage" className="bg-[#0b0f0a]">Gaming Montage</option>
                      <option value="Cosplay & Vlog" className="bg-[#0b0f0a]">Cosplay & Vlog</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-300">Duration (MM:SS)</label>
                    <input
                      type="text"
                      value={newVideo.duration}
                      onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                      placeholder="14:20"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#a7c957]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">YouTube Embed or MP4 Video URL</label>
                  <input
                    type="url"
                    value={newVideo.videoUrl}
                    onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#a7c957]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Thumbnail Cover Image URL</label>
                  <input
                    type="url"
                    value={newVideo.thumbnail}
                    onChange={(e) => setNewVideo({ ...newVideo, thumbnail: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#a7c957]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Description & Theory Notes</label>
                  <textarea
                    rows={3}
                    value={newVideo.description}
                    onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                    placeholder="Describe your creation..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#a7c957]"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="flex-1 py-3 rounded-full bg-white/5 text-gray-300 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-full bg-[#a7c957] text-[#0b0f0a] font-bold text-xs hover:brightness-110 shadow-md"
                  >
                    Publish to Studio
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          8. VIDEO PREVIEW PLAYER MODAL
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activePreviewVideo && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setActivePreviewVideo(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b0f0a] border border-white/15 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActivePreviewVideo(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-[#a7c957] hover:text-[#0b0f0a] transition-colors"
              >
                <X size={18} />
              </button>

              <div className="w-full aspect-video bg-black">
                <iframe
                  src={activePreviewVideo.videoUrl}
                  title={activePreviewVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#a7c957]/20 text-[#a7c957] text-xs font-bold uppercase">
                    {activePreviewVideo.category}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    {activePreviewVideo.views.toLocaleString()} views • {activePreviewVideo.createdAt}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">{activePreviewVideo.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{activePreviewVideo.description}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          9. EDIT PROFILE MODAL
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b0f0a] border border-white/15 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-xl font-heading font-black text-white">Edit Fandom Profile</h3>
                <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSavePreferences} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#a7c957]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-300">Preset Avatars</label>
                  <div className="flex gap-2.5 overflow-x-auto pb-2">
                    {AVATAR_PRESETS.map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => setAvatar(p.url)}
                        className={`w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 transition-transform ${
                          avatar === p.url ? 'border-[#a7c957] scale-110' : 'border-white/20'
                        }`}
                      >
                        <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-300">Favorite Fandoms</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {FANDOM_OPTIONS.map((f) => {
                      const Icon = f.icon;
                      const selected = favoriteFandoms.includes(f.label);
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => toggleFandom(f.label)}
                          className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                            selected ? 'bg-[#a7c957]/20 border-[#a7c957] text-[#a7c957]' : 'bg-white/5 border-white/10 text-gray-400'
                          }`}
                        >
                          <Icon size={14} /> {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="flex-1 py-3 rounded-full bg-white/5 text-gray-300 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 rounded-full bg-[#a7c957] text-[#0b0f0a] font-bold text-xs hover:brightness-110 shadow-md"
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
