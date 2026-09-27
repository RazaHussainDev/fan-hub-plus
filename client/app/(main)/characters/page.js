'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumbs from '@/components/Breadcrumbs';
import { 
  Users, Search, Star, Heart, Sparkles, X, Shield, 
  Quote, Zap, Layers, Trophy, Share2, Info 
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'All', 'Anime', 'Gaming', 'Movies', 'TV Shows', 'Comics', 'Manga'
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } 
  }
};

function CharactersContent() {
  const [characters, setCharacters] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeDossier, setActiveDossier] = useState(null);
  const [likedMap, setLikedMap] = useState({});

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== 'All') params.append('category', selectedCategory);
        if (searchQuery.trim()) params.append('search', searchQuery.trim());

        const res = await fetch(`/api/fandom/characters?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setCharacters(data.results || []);
        }
      } catch (err) {
        console.error('Characters fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchCharacters, 150);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  const handleLike = async (e, charId) => {
    e.preventDefault();
    e.stopPropagation();
    if (likedMap[charId]) return;

    setLikedMap(prev => ({ ...prev, [charId]: true }));
    setCharacters(prev => prev.map(c => c._id === charId ? { ...c, likesCount: c.likesCount + 1 } : c));

    try {
      const backendBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await fetch(`${backendBase}/api/fandom/characters/${charId}/like`, { method: 'PATCH' });
      toast.success("Favorited character!", {
        style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = (e, char) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    toast.success(`Share link for ${char.name} copied!`, {
      style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
    });
  };

  return (
    <main className="min-h-screen bg-[#FBFBFD] dark:bg-[#060805] text-gray-900 dark:text-gray-100 p-4 md:p-10 pb-36 font-body relative overflow-hidden transition-colors duration-500">
      
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-[#a7c957]/15 dark:bg-[#a7c957]/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 dark:bg-purple-900/15 blur-[160px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1400px] mx-auto z-10 relative">
        <Breadcrumbs />

        {/* ─── Hero Header ──────────────────────────────────────────────────────── */}
        <header className="mt-4 mb-10 text-center relative z-20">
          <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 text-xs font-bold text-[#a7c957] uppercase tracking-widest mb-3 backdrop-blur-md">
              <Users size={14} className="text-[#a7c957]" />
              Fandom Character Archive
            </div>
            
            <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tight text-gray-950 dark:text-white">
              Character <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a7c957] via-[#c2e078] to-[#80b918]">Dossiers</span>
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 font-medium text-base md:text-lg max-w-2xl mx-auto mt-2">
              Explore combat abilities, iconic quotes, lore bios, and voice actors across the greatest fandom universes.
            </p>
          </motion.div>
        </header>

        {/* ─── Search & Category Filter ────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 z-20 relative">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar w-full md:w-auto">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold tracking-wide transition-all duration-300 border ${
                    isSelected
                      ? 'bg-[#a7c957] text-[#0b0f0a] border-transparent shadow-[0_0_15px_rgba(167,201,87,0.4)]'
                      : 'text-gray-600 dark:text-gray-400 bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 hover:border-[#a7c957]/30 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search characters, abilities, lore..."
              className="w-full pl-10 pr-9 py-2.5 rounded-full bg-black/[0.04] dark:bg-white/5 border border-black/[0.08] dark:border-white/10 text-xs md:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a7c957]/50 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ─── Character Grid ──────────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-black/5 dark:bg-white/5 rounded-3xl animate-pulse border border-black/5 dark:border-white/5" />
            ))}
          </div>
        ) : characters.length === 0 ? (
          <div className="w-full py-20 text-center bg-black/5 dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/10 p-8">
            <Users size={40} className="mx-auto text-gray-500 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading">No characters found</h3>
            <p className="text-gray-500 text-sm mt-1">Try another search query or category.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {characters.map((char) => {
              const isLiked = likedMap[char._id];

              return (
                <motion.div
                  key={char._id}
                  variants={itemVariants}
                  onClick={() => setActiveDossier(char)}
                  className="group relative flex flex-col rounded-3xl bg-white/70 dark:bg-[#0c100a] border border-black/5 dark:border-white/10 overflow-hidden shadow-lg transition-all duration-500 hover:border-[#a7c957]/50 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(167,201,87,0.18)] cursor-pointer"
                >
                  {/* Portrait Image Container */}
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-900">
                    <img
                      src={char.imageUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80'}
                      alt={char.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c100a] via-[#0c100a]/20 to-black/30 opacity-80 group-hover:opacity-60 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-black text-[#a7c957] uppercase tracking-wider">
                        {char.fandom}
                      </span>
                      
                      <button
                        onClick={(e) => handleLike(e, char._id)}
                        className={`p-2 rounded-full backdrop-blur-md border shadow-lg transition-all ${
                          isLiked 
                            ? 'bg-rose-500 text-white border-rose-500' 
                            : 'bg-black/60 border-white/20 text-white hover:bg-rose-500 hover:border-rose-500'
                        }`}
                        title="Favorite"
                      >
                        <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    {/* Bottom overlay info */}
                    <div className="absolute bottom-3 left-4 right-4 z-10">
                      <span className="text-[11px] font-bold text-[#a7c957] uppercase tracking-wider block mb-1">
                        {char.role}
                      </span>
                      <h3 className="text-xl md:text-2xl font-heading font-black text-white group-hover:text-[#a7c957] transition-colors leading-tight">
                        {char.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Details Footer */}
                  <div className="p-4 flex flex-col justify-between flex-1 bg-white dark:bg-[#0c100a] border-t border-black/5 dark:border-white/5">
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed mb-3">
                      {char.bio}
                    </p>

                    {/* Abilities tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(char.abilities || []).slice(0, 3).map((ab) => (
                        <span key={ab} className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[10px] font-medium text-gray-700 dark:text-gray-300">
                          {ab}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Heart size={12} className="text-rose-500" fill="currentColor" /> {char.likesCount || 0}
                      </span>
                      <span className="text-[#a7c957] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        View Dossier →
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* ─── Character Dossier Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {activeDossier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 25 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-[#0c100a] border border-white/15 rounded-3xl overflow-y-auto shadow-2xl text-white scrollbar-hide"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveDossier(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 border border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-5">
                {/* Left Portrait Column (2 cols) */}
                <div className="md:col-span-2 relative min-h-[300px] md:min-h-[480px] bg-gray-900">
                  <img
                    src={activeDossier.imageUrl}
                    alt={activeDossier.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-transparent to-[#0c100a]" />
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-[#a7c957] text-[#0b0f0a] font-bold text-xs uppercase tracking-wider">
                      {activeDossier.fandom}
                    </span>
                  </div>
                </div>

                {/* Right Dossier Column (3 cols) */}
                <div className="md:col-span-3 p-6 md:p-8 flex flex-col justify-between space-y-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#a7c957]">
                      {activeDossier.role}
                    </span>
                    <h2 className="text-3xl font-heading font-black text-white mt-1">
                      {activeDossier.name}
                    </h2>
                    
                    {/* Iconic Quote */}
                    {activeDossier.quote && (
                      <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 relative">
                        <Quote size={20} className="text-[#a7c957]/40 mb-1" />
                        <p className="text-sm font-medium italic text-gray-200">
                          &ldquo;{activeDossier.quote}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Biography */}
                    <div className="mt-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Biography & Lore</h4>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {activeDossier.bio}
                      </p>
                    </div>

                    {/* Abilities & Combat Power */}
                    <div className="mt-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Zap size={14} className="text-[#a7c957]" /> Key Abilities & Mastery
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {(activeDossier.abilities || []).map((ab) => (
                          <span key={ab} className="px-2.5 py-1 rounded-lg bg-[#a7c957]/10 border border-[#a7c957]/20 text-xs font-semibold text-[#a7c957]">
                            {ab}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="mt-4 grid grid-cols-2 gap-3 pt-4 border-t border-white/10 text-xs">
                      {activeDossier.actor && (
                        <div>
                          <span className="text-gray-500 block">Voice Actor / Portrayal</span>
                          <span className="font-semibold text-gray-200">{activeDossier.actor}</span>
                        </div>
                      )}
                      {activeDossier.firstAppearance && (
                        <div>
                          <span className="text-gray-500 block">First Appearance</span>
                          <span className="font-semibold text-gray-200">{activeDossier.firstAppearance}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={(e) => handleLike(e, activeDossier._id)}
                      className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#a7c957] to-[#c2e078] text-[#0b0f0a] font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg shadow-[#a7c957]/30"
                    >
                      <Heart size={16} fill="currentColor" /> Favorite Character ({activeDossier.likesCount})
                    </button>
                    <button
                      onClick={(e) => handleShare(e, activeDossier)}
                      className="p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
                      title="Share"
                    >
                      <Share2 size={16} />
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

export default function CharactersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#060805] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#a7c957] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CharactersContent />
    </Suspense>
  );
}
