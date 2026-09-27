'use client';

import React, { useState, useEffect, useTransition, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { 
  Film, Tv, Gamepad2, Compass, Music, BookOpen, Book, Users, 
  Search, SlidersHorizontal, Star, X, Play, Share2, Check, Plus, 
  Flame, Calendar, ArrowUpDown, Layers, ExternalLink, Info, Filter
} from 'lucide-react';
import { useWatchlist } from '@/hooks/useWatchlist';
import toast from 'react-hot-toast';

// ─── Categories definition matching SRS 1.4 & 1.6 ─────────────────────────────
const FANDOM_CATEGORIES = [
  { id: 'all', name: 'All Fandoms', icon: Compass, color: 'from-[#a7c957] to-[#c2e078]' },
  { id: 'Anime', name: 'Anime', icon: Star, color: 'from-amber-400 to-orange-500' },
  { id: 'Gaming', name: 'Gaming', icon: Gamepad2, color: 'from-violet-400 to-purple-600' },
  { id: 'Movies', name: 'Movies', icon: Film, color: 'from-blue-400 to-indigo-600' },
  { id: 'TV Shows', name: 'TV Shows', icon: Tv, color: 'from-emerald-400 to-teal-600' },
  { id: 'K-Pop', name: 'K-Pop', icon: Music, color: 'from-pink-400 to-rose-600' },
  { id: 'Comics', name: 'Comics', icon: BookOpen, color: 'from-yellow-400 to-red-500' },
  { id: 'Manga', name: 'Manga', icon: Book, color: 'from-cyan-400 to-blue-500' },
  { id: 'Cosplay', name: 'Cosplay', icon: Users, color: 'from-fuchsia-400 to-pink-600' },
];

const SORT_OPTIONS = [
  { id: 'popular', label: 'Most Popular', icon: Flame },
  { id: 'latest', label: 'Latest Release', icon: Calendar },
  { id: 'rating', label: 'Top Rated', icon: Star },
  { id: 'alpha', label: 'Alphabetical (A-Z)', icon: ArrowUpDown },
];

const YEAR_OPTIONS = [
  { id: 'all', label: 'All Years' },
  { id: '2025', label: '2025 (Upcoming)' },
  { id: '2024', label: '2024' },
  { id: '2023', label: '2023' },
  { id: '2022', label: '2022' },
  { id: 'classic', label: 'Classics (<2020)' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } 
  }
};

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL state synchronization
  const initialCategory = searchParams.get('category') || 'all';
  const initialGenre = searchParams.get('genre') || 'all';
  const initialYear = searchParams.get('year') || 'all';
  const initialSort = searchParams.get('sort') || 'popular';
  const initialQuery = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const [items, setItems] = useState([]);
  const [availableGenres, setAvailableGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [activeModalItem, setActiveModalItem] = useState(null);

  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  // Fetch data when filters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
        if (selectedGenre && selectedGenre !== 'all') params.append('genre', selectedGenre);
        if (selectedYear && selectedYear !== 'all') params.append('year', selectedYear);
        if (selectedSort) params.append('sort', selectedSort);
        if (searchQuery.trim()) params.append('search', searchQuery.trim());
        params.append('limit', '36');

        const res = await fetch(`/api/fandom/explore?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
          setItems(data.results || []);
          setTotalCount(data.total || 0);
          if (data.availableGenres) {
            setAvailableGenres(data.availableGenres);
          }
        }
      } catch (err) {
        console.error('Explore fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchData, 200);
    return () => clearTimeout(debounceTimer);
  }, [selectedCategory, selectedGenre, selectedYear, selectedSort, searchQuery]);

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setSelectedGenre('all'); // Reset genre when changing category
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedGenre('all');
    setSelectedYear('all');
    setSelectedSort('popular');
    setSearchQuery('');
  };

  const hasActiveFilters = 
    selectedCategory !== 'all' || 
    selectedGenre !== 'all' || 
    selectedYear !== 'all' || 
    selectedSort !== 'popular' || 
    searchQuery.trim().length > 0;

  const handleShare = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success(`Link for "${item.title}" copied!`, {
      style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
    });
  };

  const handleWatchlistToggle = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const isSaved = isInWatchlist(item._id || item.id);
    if (isSaved) {
      removeFromWatchlist(item._id || item.id);
      toast.success(`Removed from My List`, {
        style: { background: '#0b0f0a', color: '#f87171', border: '1px solid #f87171' }
      });
    } else {
      addToWatchlist({
        id: item._id || item.id,
        movieId: item._id || item.id,
        title: item.title,
        poster_path: item.poster,
        media_type: item.type === 'stream' ? 'movie' : item.type
      });
      toast.success(`Added to My List!`, {
        style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#FBFBFD] dark:bg-[#060805] text-gray-900 dark:text-gray-100 p-4 md:p-10 pb-36 font-body relative overflow-hidden transition-colors duration-500">
      
      {/* Background Cinematic Gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] bg-[#a7c957]/15 dark:bg-[#a7c957]/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-[35%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-purple-900/15 blur-[160px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1440px] mx-auto z-10 relative">
        <Breadcrumbs />

        {/* ─── Hero Header ──────────────────────────────────────────────────────── */}
        <header className="mt-4 mb-8 text-center relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 text-xs font-bold text-[#a7c957] uppercase tracking-widest mb-3 backdrop-blur-md">
              <Compass size={14} className="text-[#a7c957]" />
              Fandom Universe Explorer
            </div>
            
            <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tight text-gray-950 dark:text-white">
              Explore The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a7c957] via-[#c2e078] to-[#80b918]">Fandom Multiverse</span>
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 font-medium text-base md:text-lg max-w-2xl mx-auto mt-2">
              Curated multimedia across Anime, Gaming, Movies, TV Shows, K-Pop, Comics, Manga, and Cosplay.
            </p>
          </motion.div>
        </header>

        {/* ─── Fandom Categories Switcher (SRS 1.4 & 1.6) ────────────────────────── */}
        <div className="w-full mb-8 relative z-20">
          <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-hide no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:justify-center">
            {FANDOM_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 cursor-pointer select-none border ${
                    isSelected
                      ? 'text-[#0b0f0a] border-transparent shadow-[0_0_20px_rgba(167,201,87,0.4)] scale-105'
                      : 'text-gray-700 dark:text-gray-300 bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 hover:border-[#a7c957]/40 hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="active-fandom-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-[#a7c957] to-[#c2e078] -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon size={16} strokeWidth={isSelected ? 2.5 : 2} className={isSelected ? 'text-[#0b0f0a]' : 'text-[#a7c957]'} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Multi-Level Filter Toolbar ────────────────────────────────────────── */}
        <div className="bg-white/80 dark:bg-[#0c100a]/80 backdrop-blur-2xl border border-black/5 dark:border-white/10 p-4 md:p-5 rounded-3xl shadow-xl dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] mb-10 z-20 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-center">
            
            {/* Search Input (5 cols) */}
            <div className="lg:col-span-5 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${selectedCategory === 'all' ? 'all fandoms' : selectedCategory}...`}
                className="w-full pl-11 pr-10 py-3 rounded-2xl bg-black/[0.04] dark:bg-white/5 border border-black/[0.08] dark:border-white/10 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a7c957]/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Genre Filter (2 cols) */}
            <div className="lg:col-span-2 relative">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-black/[0.04] dark:bg-white/5 border border-black/[0.08] dark:border-white/10 text-sm font-medium text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#a7c957]/50 cursor-pointer appearance-none"
              >
                <option value="all" className="bg-[#0b0f0a] text-white">All Genres</option>
                {availableGenres.map((g) => (
                  <option key={g} value={g} className="bg-[#0b0f0a] text-white">{g}</option>
                ))}
              </select>
              <Filter size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Release Year Filter (2 cols) */}
            <div className="lg:col-span-2 relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-black/[0.04] dark:bg-white/5 border border-black/[0.08] dark:border-white/10 text-sm font-medium text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#a7c957]/50 cursor-pointer appearance-none"
              >
                {YEAR_OPTIONS.map((y) => (
                  <option key={y.id} value={y.id} className="bg-[#0b0f0a] text-white">{y.label}</option>
                ))}
              </select>
              <Calendar size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Sorting Filter (3 cols) */}
            <div className="lg:col-span-3 relative">
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-black/[0.04] dark:bg-white/5 border border-black/[0.08] dark:border-white/10 text-sm font-medium text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#a7c957]/50 cursor-pointer appearance-none"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#0b0f0a] text-white">
                    {s.label}
                  </option>
                ))}
              </select>
              <ArrowUpDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Active Filters Summary & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-black/5 dark:border-white/5 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span>Showing <strong className="text-gray-900 dark:text-white">{items.length}</strong> of {totalCount} items</span>
              {selectedCategory !== 'all' && (
                <span className="px-2 py-0.5 rounded-full bg-[#a7c957]/10 text-[#a7c957] font-semibold border border-[#a7c957]/20">
                  {selectedCategory}
                </span>
              )}
              {selectedGenre !== 'all' && (
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">
                  {selectedGenre}
                </span>
              )}
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-400 font-semibold transition-colors cursor-pointer"
              >
                <X size={14} /> Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* ─── Results Grid ──────────────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-black/5 dark:bg-white/5 rounded-3xl animate-pulse border border-black/5 dark:border-white/5" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="w-full py-24 text-center bg-black/5 dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/10 p-8">
            <SlidersHorizontal size={40} className="mx-auto text-gray-500 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading">No fandom content found</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
              We couldn&apos;t find anything matching your exact filter criteria. Try clearing some filters or searching for another fandom.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 px-6 py-2.5 rounded-full bg-[#a7c957] text-[#0b0f0a] font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-[#a7c957]/30"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8"
          >
            {items.map((item) => {
              const isSaved = isInWatchlist(item._id || item.id);
              const isStreamable = item.type === 'stream' || item.type === 'video';

              return (
                <motion.div
                  key={item._id || item.id}
                  variants={itemVariants}
                  className="group relative flex flex-col rounded-3xl bg-white/70 dark:bg-[#0c100a] border border-black/5 dark:border-white/10 overflow-hidden transition-all duration-500 hover:border-[#a7c957]/50 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(167,201,87,0.18)]"
                >
                  {/* Poster Thumbnail */}
                  <div 
                    onClick={() => setActiveModalItem(item)}
                    className="relative w-full aspect-[2/3] overflow-hidden cursor-pointer bg-gray-900"
                  >
                    <img
                      src={item.poster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f0a] via-transparent to-black/30 opacity-70 group-hover:opacity-40 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-bold text-white tracking-wider uppercase truncate max-w-[65%]">
                        {item.fandom}
                      </span>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0b0f0a]/80 backdrop-blur-md border border-[#a7c957]/40 text-[10px] font-black text-[#a7c957]">
                        <Star size={10} fill="currentColor" />
                        {item.rating ? item.rating.toFixed(1) : '9.0'}
                      </span>
                    </div>

                    {/* Quick Action Buttons (Top Right Overlay) */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1.5 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      <button
                        onClick={(e) => handleWatchlistToggle(e, item)}
                        className={`p-2 rounded-full backdrop-blur-md border shadow-lg transition-all ${
                          isSaved
                            ? 'bg-[#a7c957] text-[#0b0f0a] border-[#a7c957]'
                            : 'bg-black/60 border-white/20 text-white hover:bg-[#a7c957] hover:text-[#0b0f0a]'
                        }`}
                        title={isSaved ? 'In Watchlist' : 'Add to Watchlist'}
                      >
                        {isSaved ? <Check size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={3} />}
                      </button>

                      <button
                        onClick={(e) => handleShare(e, item)}
                        className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-lg hover:bg-[#a7c957] hover:text-[#0b0f0a] transition-all"
                        title="Share Link"
                      >
                        <Share2 size={14} strokeWidth={2.5} />
                      </button>
                    </div>

                    {/* Play / Inspect Action Center Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px] z-10">
                      <div className="w-12 h-12 rounded-full bg-[#a7c957] text-[#0b0f0a] flex items-center justify-center transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 shadow-[0_0_25px_rgba(167,201,87,0.7)]">
                        {isStreamable ? <Play size={20} fill="currentColor" className="ml-0.5" /> : <Info size={20} />}
                      </div>
                    </div>
                  </div>

                  {/* Card Meta Content */}
                  <div className="p-3.5 flex flex-col flex-1 justify-between bg-white dark:bg-[#0c100a]">
                    <div>
                      {/* Category & Year */}
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#a7c957]">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-gray-500 font-semibold">
                          {item.releaseYear || 2024}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 
                        onClick={() => setActiveModalItem(item)}
                        className="text-xs md:text-sm font-bold text-gray-900 dark:text-gray-100 line-clamp-2 hover:text-[#a7c957] transition-colors cursor-pointer leading-snug"
                        title={item.title}
                      >
                        {item.title}
                      </h3>
                    </div>

                    {/* Genres Chips */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {(item.genres || []).slice(0, 2).map((g) => (
                        <span key={g} className="px-1.5 py-0.5 text-[9px] font-medium rounded-md bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-black/5 dark:border-white/5">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* ─── Detail Modal (For Articles, Galleries & Stream info) ──────────────── */}
      <AnimatePresence>
        {activeModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0e130c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 border border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Backdrop Header */}
              <div className="relative w-full h-64 overflow-hidden">
                <img
                  src={activeModalItem.backdrop || activeModalItem.poster}
                  alt={activeModalItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e130c] via-[#0e130c]/40 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-[#a7c957]/20 border border-[#a7c957]/40 text-[#a7c957] text-xs font-bold uppercase tracking-widest">
                      {activeModalItem.category} • {activeModalItem.fandom}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-heading font-black mt-2 text-white drop-shadow-md">
                      {activeModalItem.title}
                    </h2>
                  </div>
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-black/70 border border-[#a7c957]/40 text-[#a7c957] font-black text-sm">
                    <Star size={14} fill="currentColor" /> {activeModalItem.rating || 9.2}
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 space-y-4">
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  {activeModalItem.description}
                </p>

                {/* Genres & Tags */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Genres & Lore Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {(activeModalItem.genres || []).map((g) => (
                      <span key={g} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-gray-300">
                        {g}
                      </span>
                    ))}
                    {(activeModalItem.tags || []).map((t) => (
                      <span key={t} className="px-3 py-1 rounded-lg bg-[#a7c957]/10 border border-[#a7c957]/20 text-xs font-medium text-[#a7c957]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  {activeModalItem.streamUrl ? (
                    <Link
                      href={`/stream/${activeModalItem._id || activeModalItem.id}?type=${activeModalItem.type === 'stream' ? 'movie' : 'tv'}`}
                      className="flex-1 py-3.5 rounded-full bg-gradient-to-r from-[#a7c957] to-[#c2e078] text-[#0b0f0a] font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(167,201,87,0.4)]"
                    >
                      <Play size={16} fill="currentColor" /> Start Watching
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        toast.success("Added to your reading & fandom queue!");
                        setActiveModalItem(null);
                      }}
                      className="flex-1 py-3.5 rounded-full bg-[#a7c957] text-[#0b0f0a] font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                    >
                      <BookOpen size={16} /> Explore Lore & Gallery
                    </button>
                  )}

                  <button
                    onClick={(e) => handleWatchlistToggle(e, activeModalItem)}
                    className="p-3.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
                    title="Bookmark"
                  >
                    {isInWatchlist(activeModalItem._id || activeModalItem.id) ? (
                      <Check size={18} className="text-[#a7c957]" />
                    ) : (
                      <Plus size={18} />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#060805] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#a7c957] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}
