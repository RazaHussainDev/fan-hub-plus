'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumbs from '@/components/Breadcrumbs';
import { 
  Search, Heart, Share2, ExternalLink, X, Clock, 
  Tag, ShoppingBag, Flame, Eye, Layers, ShieldCheck, AlertCircle, 
  Calendar, Check 
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Anime', 'Gaming', 'Movies', 'TV Shows', 'K-Pop', 'Comics', 'Manga', 'Cosplay'];

const TAGS = ['All', 'Limited Edition', 'Pre-Order', 'Collectible', 'Official Merch', 'Exclusive'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.96 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } 
  }
};

export default function MerchandisePage() {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'available', 'upcoming'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState(null);
  const [likedMap, setLikedMap] = useState({});

  useEffect(() => {
    const fetchMerchandise = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== 'All') params.append('category', selectedCategory);
        if (selectedTag !== 'All') params.append('tag', selectedTag);
        if (activeTab === 'upcoming') params.append('upcoming', 'true');
        if (activeTab === 'available') params.append('upcoming', 'false');
        if (searchQuery.trim()) params.append('search', searchQuery.trim());

        const res = await fetch(`/api/merchandise?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setItems(data.results || []);
        }
      } catch (err) {
        console.error('Merchandise fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchMerchandise, 150);
    return () => clearTimeout(timer);
  }, [activeTab, selectedCategory, selectedTag, searchQuery]);

  const handleLike = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (likedMap[id]) return;

    setLikedMap(prev => ({ ...prev, [id]: true }));
    setItems(prev => prev.map(item => item._id === id ? { ...item, likes: (item.likes || 0) + 1 } : item));

    try {
      const backendBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await fetch(`${backendBase}/api/merchandise/${id}/like`, { method: 'PATCH' });
      toast.success("Saved to your wishlist!", {
        style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
      });
    } catch (e) {}
  };

  const handleShare = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    toast.success(`Share link for "${item.name}" copied!`, {
      style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
    });
  };

  const getTagBadgeStyle = (tag) => {
    switch (tag) {
      case 'Limited Edition':
        return 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30';
      case 'Pre-Order':
        return 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30';
      case 'Exclusive':
        return 'bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20 text-fuchsia-400 border-fuchsia-500/30';
      case 'Collectible':
        return 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-white/10 text-gray-300 border-white/20';
    }
  };

  return (
    <main className="min-h-screen bg-[#FBFBFD] dark:bg-[#060805] text-gray-900 dark:text-gray-100 p-4 md:p-10 pb-36 font-body relative overflow-hidden transition-colors duration-500">
      
      {/* Background Ambience */}
      <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] bg-[#a7c957]/15 dark:bg-[#a7c957]/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-[35%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 dark:bg-purple-900/15 blur-[160px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1400px] mx-auto z-10 relative">
        <Breadcrumbs />

        {/* ─── Hero Header ──────────────────────────────────────────────────────── */}
        <header className="mt-4 mb-8 text-center relative z-20">
          <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 text-xs font-bold text-[#a7c957] uppercase tracking-widest mb-3 backdrop-blur-md">
              <ShoppingBag size={14} className="text-[#a7c957]" />
              Fandom Vault & Collector Showcase
            </div>
            
            <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tight text-gray-950 dark:text-white">
              Merchandise & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a7c957] via-[#c2e078] to-[#80b918]">Anticipated Drops</span>
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 font-medium text-base md:text-lg max-w-2xl mx-auto mt-2">
              Discover authentic statues, limited vinyl, prop replicas, and upcoming fandom drops.
            </p>

            {/* SRS Compliance Badge */}
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[11px] text-gray-500">
              <ShieldCheck size={13} className="text-[#a7c957]" />
              Discovery & Showcase Only • Direct purchase excluded per SRS specifications
            </div>
          </motion.div>
        </header>

        {/* ─── Dual View Switcher (Showcase vs Upcoming Drops) ─────────────────── */}
        <div className="flex justify-center mb-8 z-20 relative">
          <div className="inline-flex p-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2 rounded-full text-xs md:text-sm font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-[#a7c957] text-[#0b0f0a] shadow-lg shadow-[#a7c957]/30'
                  : 'text-gray-600 dark:text-gray-400 hover:text-white'
              }`}
            >
              All Showcase ({items.length})
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-5 py-2 rounded-full text-xs md:text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'upcoming'
                  ? 'bg-[#a7c957] text-[#0b0f0a] shadow-lg shadow-[#a7c957]/30'
                  : 'text-gray-600 dark:text-gray-400 hover:text-white'
              }`}
            >
              <Calendar size={14} /> Upcoming Drops & Pre-Orders
            </button>
          </div>
        </div>

        {/* ─── Filters & Search Toolbar ────────────────────────────────────────── */}
        <div className="bg-white/80 dark:bg-[#0c100a]/80 backdrop-blur-2xl border border-black/5 dark:border-white/10 p-4 md:p-5 rounded-3xl shadow-xl mb-10 z-20 relative space-y-4">
          
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-[#a7c957] text-[#0b0f0a] border-transparent shadow-[0_0_12px_rgba(167,201,87,0.4)]'
                      : 'text-gray-600 dark:text-gray-400 bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 hover:border-[#a7c957]/30 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Tags & Search Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-3 border-t border-black/5 dark:border-white/5">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-hide no-scrollbar">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-1 flex items-center gap-1">
                <Tag size={12} /> Badge:
              </span>
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    selectedTag === tag
                      ? 'bg-white/20 dark:bg-white/15 text-white font-bold border border-white/25'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search merch, statues, vinyl..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-black/[0.04] dark:bg-white/5 border border-black/[0.08] dark:border-white/10 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a7c957]/50"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── Merchandise Cards Grid ──────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-black/5 dark:bg-white/5 rounded-3xl animate-pulse border border-black/5 dark:border-white/5" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="w-full py-20 text-center bg-black/5 dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/10 p-8">
            <ShoppingBag size={40} className="mx-auto text-gray-500 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading">No merchandise found</h3>
            <p className="text-gray-500 text-sm mt-1">Try resetting your filters or search query.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {items.map((item) => {
              const isLiked = likedMap[item._id];

              return (
                <motion.div
                  key={item._id}
                  variants={itemVariants}
                  onClick={() => setActiveItem(item)}
                  className="group relative flex flex-col rounded-3xl bg-white/70 dark:bg-[#0c100a] border border-black/5 dark:border-white/10 overflow-hidden shadow-lg transition-all duration-500 hover:border-[#a7c957]/50 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(167,201,87,0.18)] cursor-pointer"
                >
                  {/* Image Showcase */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-900">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c100a] via-transparent to-transparent opacity-80 group-hover:opacity-50 transition-opacity" />

                    {/* Tag Badge */}
                    <div className="absolute top-3 left-3 flex gap-2 z-10">
                      <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider backdrop-blur-md ${getTagBadgeStyle(item.tag)}`}>
                        {item.tag}
                      </span>
                    </div>

                    {/* Like & Share Action Buttons */}
                    <div className="absolute top-3 right-3 flex flex-col gap-1.5 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      <button
                        onClick={(e) => handleLike(e, item._id)}
                        className={`p-2 rounded-full backdrop-blur-md border shadow-lg transition-all ${
                          isLiked ? 'bg-rose-500 text-white border-rose-500' : 'bg-black/60 border-white/20 text-white hover:bg-rose-500 hover:border-rose-500'
                        }`}
                        title="Save to Wishlist"
                      >
                        <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                      </button>

                      <button
                        onClick={(e) => handleShare(e, item)}
                        className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-lg hover:bg-[#a7c957] hover:text-[#0b0f0a] transition-all"
                        title="Share Collectible"
                      >
                        <Share2 size={14} />
                      </button>
                    </div>

                    {/* Release Schedule Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs z-10">
                      <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-gray-300 font-semibold text-[10px]">
                        {item.fandom}
                      </span>
                      <span className="text-white font-bold text-xs bg-black/70 px-2 py-0.5 rounded-md backdrop-blur-md">
                        {item.estimatedPrice}
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-4 flex flex-col justify-between flex-1 bg-white dark:bg-[#0c100a]">
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        <span className="text-[#a7c957]">{item.category}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> {item.releaseDate}
                        </span>
                      </div>

                      <h3 className="text-sm font-heading font-black text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#a7c957] transition-colors leading-snug">
                        {item.name}
                      </h3>

                      <p className="text-xs text-gray-500 line-clamp-2 mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
                      <span className="text-gray-400 font-medium">
                        {item.views || 0} interested
                      </span>
                      <span className="text-[#a7c957] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Inspect Piece →
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* ─── Collectible Inspector Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {activeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 25 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-[#0c100a] border border-white/15 rounded-3xl overflow-y-auto shadow-2xl text-white scrollbar-hide"
            >
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 border border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left Product Image */}
                <div className="relative min-h-[300px] md:min-h-[440px] bg-gray-900 overflow-hidden">
                  <img src={activeItem.imageUrl} alt={activeItem.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-transparent to-[#0c100a]" />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full border text-xs font-black uppercase tracking-wider backdrop-blur-md ${getTagBadgeStyle(activeItem.tag)}`}>
                      {activeItem.tag}
                    </span>
                  </div>
                </div>

                {/* Right Details Column */}
                <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#a7c957]">
                      {activeItem.category} • {activeItem.fandom}
                    </span>
                    <h2 className="text-2xl font-heading font-black text-white mt-1 leading-tight">
                      {activeItem.name}
                    </h2>

                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-xl font-heading font-black text-[#a7c957]">
                        {activeItem.estimatedPrice}
                      </span>
                      <span className="text-xs text-gray-400 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                        {activeItem.releaseDate}
                      </span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Collector Overview & Lore</h4>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {activeItem.description}
                      </p>
                    </div>

                    {/* SRS Legal Disclaimer Notice */}
                    <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] leading-relaxed flex items-start gap-2">
                      <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                      <span>
                        Showcase specification: In compliance with TechWiz 7 SRS Section 1.5, Fan Hub Plus is exclusively for display and discovery. Direct purchase and payment gateways are excluded.
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <a
                      href={activeItem.officialStoreUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3.5 rounded-full bg-gradient-to-r from-[#a7c957] to-[#c2e078] text-[#0b0f0a] font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg shadow-[#a7c957]/30"
                    >
                      <ExternalLink size={16} /> Official Studio / Partner Page
                    </a>

                    <button
                      onClick={(e) => handleLike(e, activeItem._id)}
                      className="p-3.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
                      title="Save to Wishlist"
                    >
                      <Heart size={18} fill={likedMap[activeItem._id] ? 'currentColor' : 'none'} className={likedMap[activeItem._id] ? 'text-rose-500' : ''} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
