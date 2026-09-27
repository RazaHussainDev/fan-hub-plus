'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useWatchlist } from '@/hooks/useWatchlist';
import { BASE_IMG_URL } from '@/utils/tmdb';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Play, Compass, StickyNote, Trash2, Edit3, X, Save, Sparkles } from 'lucide-react';

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

export default function MyListPage() {
  const { watchlist, removeFromWatchlist, updateNote } = useWatchlist();
  const [editingItem, setEditingItem] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const openNoteEditor = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingItem(item);
    setNoteText(item.note || '');
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSaving(true);
    await updateNote(editingItem.movieId || editingItem.id, noteText);
    setIsSaving(false);
    setEditingItem(null);
  };

  const handleRemove = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromWatchlist(item);
  };

  return (
    <main className="min-h-screen bg-[#FBFBFD] dark:bg-[#060805] text-gray-900 dark:text-gray-200 p-6 md:p-12 pb-32 font-body flex flex-col items-center relative overflow-hidden transition-colors duration-500">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#a7c957]/15 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] bg-black/5 dark:bg-[#0b0f0a]/80 blur-[150px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1400px] z-10 relative">
        <Breadcrumbs />
        
        <header className="mb-14 w-full text-center relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#a7c957]/10 border border-[#a7c957]/20 text-[#a7c957] text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles size={14} /> Personal Fandom Vault
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-black text-gray-900 dark:text-white mb-4 tracking-tighter transition-colors duration-500">
              My <span className="text-[#a7c957]">Collection</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-medium text-lg max-w-xl mx-auto transition-colors duration-500">
              Your personalized sanctuary of cinema, anime lore, and custom fan notes.
            </p>
          </motion.div>
          {/* Subtle separator */}
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#a7c957]/50 to-transparent mx-auto mt-8 rounded-full" />
        </header>

        {watchlist.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10 relative z-20"
          >
            {watchlist.map((item) => (
              <motion.div key={item.movieId || item.id} variants={itemVariants}>
                <div className="group relative rounded-2xl bg-white dark:bg-[#0a0d08] border border-black/5 dark:border-white/5 transition-all duration-500 hover:border-[#a7c957]/40 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(167,201,87,0.15)] shadow-sm dark:shadow-none flex flex-col justify-between overflow-hidden">
                  
                  {/* Poster Link Container */}
                  <Link
                    href={`/stream/${item.movieId || item.id}?type=${item.media_type || 'movie'}`}
                    className="block relative w-full aspect-[2/3] rounded-t-2xl overflow-hidden"
                  >
                    <img
                      src={`${BASE_IMG_URL}${item.poster_path}`}
                      alt={item.title || item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Hover Overlay Play Icon */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="w-12 h-12 bg-[#a7c957] text-[#0b0f0a] rounded-full flex items-center justify-center translate-y-3 group-hover:translate-y-0 transition-all duration-300 shadow-[0_0_20px_rgba(167,201,87,0.5)]">
                        <Play size={20} fill="currentColor" className="ml-1" />
                      </div>
                    </div>

                    {/* Media Type Badge */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-md border border-white/10 text-[#a7c957] text-[10px] font-bold tracking-widest uppercase rounded">
                      {item.media_type === 'tv' ? 'Series' : 'Movie'}
                    </div>

                    {/* Quick Delete Button */}
                    <button
                      onClick={(e) => handleRemove(item, e)}
                      title="Remove from vault"
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-red-500/80 text-gray-300 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 backdrop-blur-md"
                    >
                      <Trash2 size={13} />
                    </button>
                  </Link>
                  
                  {/* Info & Notes Area */}
                  <div className="p-3.5 flex flex-col justify-between flex-1">
                    <div>
                      <Link href={`/stream/${item.movieId || item.id}?type=${item.media_type || 'movie'}`}>
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate group-hover:text-black dark:group-hover:text-white transition-colors">
                          {item.title || item.name}
                        </p>
                      </Link>

                      {/* Display Personal Note if Exists */}
                      {item.note ? (
                        <div 
                          onClick={(e) => openNoteEditor(item, e)}
                          title="Click to edit personal note"
                          className="mt-2 text-xs text-[#a7c957] bg-[#a7c957]/10 p-2 rounded-xl border border-[#a7c957]/20 flex items-start gap-1.5 cursor-pointer hover:bg-[#a7c957]/20 transition-all"
                        >
                          <StickyNote size={12} className="shrink-0 mt-0.5 text-[#a7c957]" />
                          <span className="line-clamp-2 italic text-[11px] leading-tight font-medium">
                            {item.note}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => openNoteEditor(item, e)}
                          className="mt-2 w-full text-left text-[11px] text-gray-400 hover:text-[#a7c957] flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-all"
                        >
                          <Edit3 size={11} /> Add fandom note
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl mx-auto mt-12 relative z-20"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#a7c957]/10 to-transparent rounded-[40px] blur-xl" />
            <div className="relative p-12 md:p-16 rounded-[40px] bg-white/80 dark:bg-[#0a0d08]/80 backdrop-blur-2xl border border-black/5 dark:border-white/5 shadow-2xl text-center overflow-hidden transition-colors duration-500">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-1 bg-gradient-to-r from-transparent via-[#a7c957] to-transparent opacity-30" />
              
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 mx-auto bg-gray-50 dark:bg-gradient-to-br dark:from-[#1a2315] dark:to-[#0a0d08] border border-black/5 dark:border-white/10 rounded-full flex items-center justify-center mb-8 shadow-inner dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-colors duration-500"
              >
                <Compass className="w-10 h-10 text-[#a7c957]/80" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight transition-colors duration-500">Your vault is empty</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-10 max-w-md mx-auto leading-relaxed transition-colors duration-500">
                Explore anime, gaming cinematic universes, and blockbusters. Save titles and track episode logs with personal notes.
              </p>
              
              <Link 
                href="/explore" 
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-[#0b0f0a] rounded-full overflow-hidden bg-[#a7c957] shadow-[0_0_25px_rgba(167,201,87,0.3)] hover:brightness-110 transition-all"
              >
                <span className="relative flex items-center gap-2">
                  Start Exploring <Play size={16} fill="currentColor" />
                </span>
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      {/* Note Editor Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b0f0a] border border-white/15 rounded-3xl w-full max-w-lg p-6 md:p-8 space-y-6 shadow-2xl relative"
            >
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs text-[#a7c957] font-bold uppercase tracking-wider mb-1">
                    <StickyNote size={13} /> Fandom Vault Note
                  </div>
                  <h3 className="text-xl font-bold font-heading text-white truncate max-w-xs sm:max-w-sm">
                    {editingItem.title || editingItem.name}
                  </h3>
                </div>
                <button
                  onClick={() => setEditingItem(null)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveNote} className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-gray-400 block font-bold mb-2">
                    Personal Note / Progress Tracker
                  </label>
                  <textarea
                    rows={4}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="e.g. 'Paused at Season 2 Episode 8', 'Incredible boss fight soundtrack', 'Must recommend to friend'..."
                    className="w-full p-4 bg-black/60 border border-white/15 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#a7c957] leading-relaxed"
                    maxLength={300}
                  />
                  <div className="text-right text-[11px] text-gray-500 mt-1">
                    {noteText.length}/300 characters
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {editingItem.note ? (
                    <button
                      type="button"
                      onClick={() => setNoteText('')}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Clear Note
                    </button>
                  ) : <span />}

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#a7c957] text-[#0b0f0a] font-bold text-xs hover:brightness-110 transition-all shadow-[0_0_15px_rgba(167,201,87,0.3)]"
                    >
                      <Save size={13} /> {isSaving ? 'Saving...' : 'Save Note'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
