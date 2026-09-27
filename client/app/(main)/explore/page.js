'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { 
  Film, Tv, Gamepad2, Compass, Music, BookOpen, Users, 
  Search, SlidersHorizontal, Star, X, Play, Share2, Check, Plus, 
  Flame, Calendar, ArrowUpDown, Download, Zap, Sparkles, Filter
} from 'lucide-react';
import { useWatchlist } from '@/hooks/useWatchlist';
import DownloadModal from '@/components/DownloadModal';
import toast from 'react-hot-toast';

// ─── Categories matching both Homepage See All links & Fandom disciplines ──────
const FANDOM_CATEGORIES = [
  { id: 'all', name: 'All Titles', icon: Compass },
  { id: 'trending', name: 'Trending Now', icon: Flame },
  { id: 'newReleases', name: 'New Releases', icon: Sparkles },
  { id: 'action', name: 'Action & Thrillers', icon: Zap },
  { id: 'anime', name: 'Anime Universe', icon: Star },
  { id: 'bollywood', name: 'Bollywood', icon: Film },
  { id: 'kdramas', name: 'Top K-Dramas', icon: Tv },
  { id: 'gaming', name: 'Gaming & Sci-Fi', icon: Gamepad2 },
  { id: 'comics', name: 'Comics & Heroes', icon: BookOpen },
  { id: 'tv', name: 'TV Series', icon: Tv },
  { id: 'k-pop', name: 'K-Pop', icon: Music },
  { id: 'cosplay', name: 'Cosplay', icon: Users },
];

const SORT_OPTIONS = [
  { id: 'popular', label: 'Most Popular', icon: Flame },
  { id: 'latest', label: 'Latest Release', icon: Calendar },
  { id: 'rating', label: 'Top Rated', icon: Star },
  { id: 'alpha', label: 'Alphabetical (A-Z)', icon: ArrowUpDown },
];

const YEAR_OPTIONS = [
  { id: 'all', label: 'All Years' },
  { id: '2025', label: '2025' },
  { id: '2024', label: '2024' },
  { id: '2023', label: '2023' },
  { id: '2022', label: '2022' },
  { id: 'classic', label: 'Classics (<2020)' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } 
  }
};

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Normalize initial category from URL
  const initialCategoryParam = searchParams.get('category') || 'all';
  const matchedCategory = FANDOM_CATEGORIES.some(c => c.id.toLowerCase() === initialCategoryParam.toLowerCase())
    ? initialCategoryParam
    : 'all';

  const [selectedCategory, setSelectedCategory] = useState(matchedCategory);
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || 'all');
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || 'all');
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'popular');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Infinite Scroll State
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Modals
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [downloadModalMovie, setDownloadModalMovie] = useState(null);

  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { ref: sentinelRef, inView } = useInView({ threshold: 0.1 });

  // Sync category changes when URL changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && cat !== selectedCategory) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Primary Data Fetcher (Page 1)
  const fetchPageOne = useCallback(async () => {
    setLoading(true);
    setPage(1);
    setHasMore(true);

    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedGenre && selectedGenre !== 'all') params.append('genre', selectedGenre);
      if (selectedYear && selectedYear !== 'all') params.append('year', selectedYear);
      if (selectedSort) params.append('sort', selectedSort);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      params.append('page', '1');

      const res = await fetch(`/api/fandom/explore?${params.toString()}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.results)) {
        setItems(data.results);
        setTotalCount(data.total || data.results.length);
        if (data.results.length === 0 || (data.total_pages && data.total_pages <= 1)) {
          setHasMore(false);
        }
      } else {
        setItems([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error('Explore fetch error:', err);
      toast.error('Failed to load explore content');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedGenre, selectedYear, selectedSort, searchQuery]);

  // Load More Function for Infinite Scroll
  const loadMoreItems = useCallback(async () => {
    if (loading || isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;

    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedGenre && selectedGenre !== 'all') params.append('genre', selectedGenre);
      if (selectedYear && selectedYear !== 'all') params.append('year', selectedYear);
      if (selectedSort) params.append('sort', selectedSort);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      params.append('page', String(nextPage));

      const res = await fetch(`/api/fandom/explore?${params.toString()}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.results) && data.results.length > 0) {
        setItems(prev => {
          const seen = new Set(prev.map(p => String(p.id || p._id)));
          const unique = data.results.filter(item => !seen.has(String(item.id || item._id)));
          return [...prev, ...unique];
        });
        setPage(nextPage);
        if (data.results.length < 10 || (data.total_pages && nextPage >= data.total_pages)) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Failed to load more items:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [loading, isLoadingMore, hasMore, page, selectedCategory, selectedGenre, selectedYear, selectedSort, searchQuery]);

  // Trigger Page 1 on Filter Change (with Debounce on Search)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPageOne();
    }, 250);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedGenre, selectedYear, selectedSort, searchQuery, fetchPageOne]);

  // Trigger Infinite Scroll when Sentinel Enters Viewport
  useEffect(() => {
    if (inView && hasMore && !loading && !isLoadingMore && items.length > 0) {
      loadMoreItems();
    }
  }, [inView, hasMore, loading, isLoadingMore, items.length, loadMoreItems]);

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setSelectedGenre('all');
    router.push(`/explore?category=${catId}`, { scroll: false });
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedGenre('all');
    setSelectedYear('all');
    setSelectedSort('popular');
    setSearchQuery('');
    router.push('/explore', { scroll: false });
  };

  const handleShare = async (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const movieTitle = item.title || item.name || 'Fandom Movie';
    const type = item.type === 'tv' ? 'tv' : 'movie';
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/stream/${item.id || item._id}?type=${type}`;

    if (navigator?.share) {
      try {
        await navigator.share({
          title: movieTitle,
          text: `Watch ${movieTitle} on Fan Hub Plus!`,
          url
        });
        return;
      } catch (err) {
        // Fall back to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success(`Link for "${movieTitle}" copied!`, {
        style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
      });
    } catch {
      toast.error('Could not copy link');
    }
  };

  const handleWatchlistToggle = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const itemId = String(item._id || item.id);
    const isSaved = isInWatchlist(itemId);

    if (isSaved) {
      removeFromWatchlist(itemId);
      toast.success('Removed from My List', {
        style: { background: '#0b0f0a', color: '#f87171', border: '1px solid #f87171' }
      });
    } else {
      addToWatchlist({
        id: itemId,
        movieId: itemId,
        title: item.title,
        poster_path: item.poster_path || (item.poster ? item.poster.replace('https://image.tmdb.org/t/p/w500', '') : ''),
        media_type: item.type === 'tv' ? 'tv' : 'movie'
      });
      toast.success('Added to My List!', {
        style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
      });
    }
  };

  const hasActiveFilters = 
    selectedCategory !== 'all' || 
    selectedGenre !== 'all' || 
    selectedYear !== 'all' || 
    selectedSort !== 'popular' || 
    searchQuery.trim().length > 0;

  return (
    <main className="min-h-screen bg-[#FBFBFD] dark:bg-[#060805] text-gray-900 dark:text-gray-100 p-4 md:p-10 pb-36 font-body relative overflow-hidden transition-colors duration-500">
      
      {/* Cinematic Ambient Glows */}
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
              Fandom Universe Infinite Explorer
            </div>
            
            <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tight text-gray-950 dark:text-white">
              Explore The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a7c957] via-[#c2e078] to-[#80b918]">Cinematic Multiverse</span>
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 font-medium text-base md:text-lg max-w-2xl mx-auto mt-2">
              Discover an infinite stream of trending movies, blockbuster anime, gaming lore, and TV series with real-time filters.
            </p>
          </motion.div>
        </header>

        {/* ─── Fandom Categories Switcher ────────────────────────────────────────── */}
        <div className="w-full mb-8 relative z-20">
          <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-hide no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:justify-center">
            {FANDOM_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all duration-300 cursor-pointer select-none border ${
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
                  <Icon size={15} strokeWidth={isSelected ? 2.5 : 2} className={isSelected ? 'text-[#0b0f0a]' : 'text-[#a7c957]'} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Multi-Level Filter Toolbar ────────────────────────────────────────── */}
        <div className="bg-white/80 dark:bg-[#0c100a]/80 backdrop-blur-2xl border border-black/5 dark:border-white/10 p-4 md:p-5 rounded-3xl shadow-xl dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] mb-8 z-20 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-center">
            
            {/* Search Input (6 cols) */}
            <div className="lg:col-span-6 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search thousands of movies, anime, or series..."
                className="w-full pl-11 pr-10 py-3 rounded-2xl bg-black/[0.04] dark:bg-white/5 border border-black/[0.08] dark:border-white/10 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a7c957]/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Release Year Filter (3 cols) */}
            <div className="lg:col-span-3 relative">
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
              <span>Displaying <strong className="text-gray-900 dark:text-white">{items.length}</strong> loaded titles (Infinite Stream Active)</span>
              {selectedCategory !== 'all' && (
                <span className="px-2 py-0.5 rounded-full bg-[#a7c957]/10 text-[#a7c957] font-semibold border border-[#a7c957]/20 uppercase">
                  {selectedCategory}
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-black/5 dark:bg-white/5 rounded-3xl animate-pulse border border-black/5 dark:border-white/5" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="w-full py-24 text-center bg-black/5 dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/10 p-8">
            <SlidersHorizontal size={40} className="mx-auto text-gray-500 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading">No content found</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
              We couldn&apos;t find anything matching your exact query. Try another keyword or reset filters.
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
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
          >
            {items.map((item) => {
              const itemId = String(item._id || item.id);
              const isSaved = isInWatchlist(itemId);
              const type = item.type === 'tv' ? 'tv' : 'movie';
              const posterSrc = item.poster_path 
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : (item.poster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80');

              return (
                <motion.div
                  key={itemId}
                  variants={itemVariants}
                  className="group relative flex flex-col rounded-3xl bg-white/70 dark:bg-[#0c100a] border border-black/5 dark:border-white/10 overflow-hidden transition-all duration-500 hover:border-[#a7c957]/50 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(167,201,87,0.18)]"
                >
                  {/* Poster Thumbnail */}
                  <div 
                    onClick={() => setActiveModalItem(item)}
                    className="relative w-full aspect-[2/3] overflow-hidden cursor-pointer bg-gray-900"
                  >
                    <img
                      src={posterSrc}
                      alt={item.title || item.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f0a] via-transparent to-black/30 opacity-70 group-hover:opacity-40 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-bold text-white tracking-wider uppercase truncate max-w-[65%]">
                        {type === 'tv' ? 'Series' : 'Movie'}
                      </span>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0b0f0a]/80 backdrop-blur-md border border-[#a7c957]/40 text-[10px] font-black text-[#a7c957]">
                        <Star size={10} fill="currentColor" />
                        {item.rating || item.vote_average ? Number(item.rating || item.vote_average).toFixed(1) : '8.5'}
                      </span>
                    </div>

                    {/* Quick Action Buttons (Top Right Overlay) */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1.5 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      {/* Watchlist */}
                      <button
                        onClick={(e) => handleWatchlistToggle(e, item)}
                        className={`p-2 rounded-full backdrop-blur-md border shadow-lg transition-all cursor-pointer ${
                          isSaved
                            ? 'bg-[#a7c957] text-[#0b0f0a] border-[#a7c957]'
                            : 'bg-black/60 border-white/20 text-white hover:bg-[#a7c957] hover:text-[#0b0f0a]'
                        }`}
                        title={isSaved ? 'In Watchlist' : 'Add to Watchlist'}
                      >
                        {isSaved ? <Check size={13} strokeWidth={3} /> : <Plus size={13} strokeWidth={3} />}
                      </button>

                      {/* Offline Download */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDownloadModalMovie({
                            id: item.id || item._id,
                            title: item.title || item.name,
                            poster_path: item.poster_path || (item.poster ? item.poster.replace('https://image.tmdb.org/t/p/w500', '') : ''),
                            media_type: type
                          });
                        }}
                        className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-lg hover:bg-[#a7c957] hover:text-[#0b0f0a] transition-all cursor-pointer"
                        title="Download for Offline Viewing"
                      >
                        <Download size={13} strokeWidth={2.5} />
                      </button>

                      {/* Share */}
                      <button
                        onClick={(e) => handleShare(e, item)}
                        className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-lg hover:bg-[#a7c957] hover:text-[#0b0f0a] transition-all cursor-pointer"
                        title="Share Link"
                      >
                        <Share2 size={13} strokeWidth={2.5} />
                      </button>
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px] z-10">
                      <div className="w-12 h-12 rounded-full bg-[#a7c957] text-[#0b0f0a] flex items-center justify-center transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 shadow-[0_0_25px_rgba(167,201,87,0.7)]">
                        <Play size={20} fill="currentColor" className="ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Card Meta Content */}
                  <div className="p-3.5 flex flex-col flex-1 justify-between bg-white dark:bg-[#0c100a]">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#a7c957]">
                          {item.category || (type === 'tv' ? 'Series' : 'Movie')}
                        </span>
                        <span className="text-[10px] text-gray-500 font-semibold">
                          {item.releaseYear || (item.release_date ? item.release_date.slice(0, 4) : '2024')}
                        </span>
                      </div>

                      <h3 
                        onClick={() => setActiveModalItem(item)}
                        className="text-xs md:text-sm font-bold text-gray-900 dark:text-gray-100 line-clamp-2 hover:text-[#a7c957] transition-colors cursor-pointer leading-snug"
                        title={item.title || item.name}
                      >
                        {item.title || item.name}
                      </h3>
                    </div>

                    <Link
                      href={`/stream/${item.id || item._id}?type=${type}`}
                      className="mt-3 w-full py-1.5 rounded-xl bg-white/5 hover:bg-[#a7c957] hover:text-[#0b0f0a] border border-white/10 text-center text-xs font-bold text-gray-300 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Play size={12} fill="currentColor" /> Watch Now
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ─── Infinite Scroll Sentinel ───────────────────────────────────────── */}
        {hasMore && !loading && (
          <div ref={sentinelRef} className="w-full flex flex-col items-center justify-center py-12 relative z-20">
            <div className="w-10 h-10 border-4 border-[#a7c957]/30 border-t-[#a7c957] rounded-full animate-spin"></div>
            <p className="text-xs text-gray-400 mt-3 font-medium tracking-wide">
              Loading more titles from the multiverse...
            </p>
          </div>
        )}

        {!hasMore && items.length > 0 && !loading && (
          <div className="w-full text-center py-12 text-gray-500 text-xs font-semibold tracking-widest uppercase">
            ✦ You have reached the edge of the universe ✦
          </div>
        )}
      </div>

      {/* ─── Detail Inspect Modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0e130c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl text-white"
            >
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 border border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="relative w-full h-64 overflow-hidden">
                <img
                  src={activeModalItem.backdrop_path ? `https://image.tmdb.org/t/p/original${activeModalItem.backdrop_path}` : (activeModalItem.backdrop || activeModalItem.poster)}
                  alt={activeModalItem.title || activeModalItem.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e130c] via-[#0e130c]/40 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-[#a7c957]/20 border border-[#a7c957]/40 text-[#a7c957] text-xs font-bold uppercase tracking-widest">
                      {activeModalItem.category || (activeModalItem.type === 'tv' ? 'Series' : 'Movie')}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-heading font-black mt-2 text-white drop-shadow-md">
                      {activeModalItem.title || activeModalItem.name}
                    </h2>
                  </div>
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-black/70 border border-[#a7c957]/40 text-[#a7c957] font-black text-sm">
                    <Star size={14} fill="currentColor" /> {activeModalItem.rating || (activeModalItem.vote_average ? Number(activeModalItem.vote_average).toFixed(1) : '8.5')}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  {activeModalItem.overview || activeModalItem.description || 'No detailed synopsis available for this title.'}
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <Link
                    href={`/stream/${activeModalItem.id || activeModalItem._id}?type=${activeModalItem.type === 'tv' ? 'tv' : 'movie'}`}
                    className="flex-1 py-3.5 rounded-full bg-gradient-to-r from-[#a7c957] to-[#c2e078] text-[#0b0f0a] font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(167,201,87,0.4)]"
                  >
                    <Play size={16} fill="currentColor" /> Stream In Theater
                  </Link>

                  <button
                    onClick={(e) => handleWatchlistToggle(e, activeModalItem)}
                    className="p-3.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer"
                    title="Bookmark"
                  >
                    {isInWatchlist(String(activeModalItem._id || activeModalItem.id)) ? (
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

      {/* ─── Download Modal ────────────────────────────────────────────────────── */}
      {downloadModalMovie && (
        <DownloadModal
          isOpen={!!downloadModalMovie}
          onClose={() => setDownloadModalMovie(null)}
          movie={downloadModalMovie}
        />
      )}
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
