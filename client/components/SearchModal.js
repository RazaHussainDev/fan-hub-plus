'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Search as SearchIcon, Film, Tv, Play } from 'lucide-react';
import { fetchSearch, BASE_IMG_URL } from '@/utils/tmdb';
import { useSearch } from '@/context/SearchContext';
import useDebounce from '@/hooks/useDebounce';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchModal() {
  const { isSearchOpen, closeSearch } = useSearch();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (!isSearchOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (debouncedQuery.trim().length > 2) {
      setIsSearching(true);
      fetchSearch(debouncedQuery)
        .then(data => {
          setResults(data.results || []);
        })
        .catch(err => console.error("Search failed", err))
        .finally(() => setIsSearching(false));
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  if (!isSearchOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 bg-[#FBFBFD]/90 dark:bg-[#060805]/90 backdrop-blur-2xl transition-colors duration-500 overflow-y-auto"
      >
        <button
          onClick={closeSearch}
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors bg-black/5 dark:bg-white/10 rounded-full p-2"
        >
          <X size={24} />
        </button>

        <motion.div 
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full max-w-3xl relative"
        >
          {/* Spotlight Input */}
          <div className="relative group z-20">
            <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" size={24} />
            <input
              type="text"
              placeholder="Search movies, TV shows, anime..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value.trim().length > 2) setIsSearching(true);
              }}
              className="w-full bg-white/60 dark:bg-[#0b0f0a]/60 backdrop-blur-md border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-500 rounded-full py-5 pl-16 pr-14 focus:outline-none focus:border-brand-primary focus:shadow-[0_0_20px_rgba(167,201,87,0.3)] transition-all text-xl md:text-2xl font-medium shadow-2xl"
              autoFocus
            />
            {isSearching && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2">
                <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Results Dropdown Container */}
          <AnimatePresence>
            {(results.length > 0 || (debouncedQuery.trim().length > 2 && !isSearching)) && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-[80px] left-0 right-0 bg-white/80 dark:bg-[#0a0d08]/90 backdrop-blur-3xl border border-gray-200 dark:border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col z-10"
              >
                {results.length > 0 ? (
                  <div className="max-h-[60vh] overflow-y-auto scrollbar-hide py-4 px-2">
                    {results.map((item) => {
                      if (!item.poster_path && !item.poster) return null;
                      const releaseYear = item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0] || '';
                      
                      return (
                        <Link
                          key={item.id}
                          href={`/stream/${item.id}?type=${item.media_type || 'movie'}`}
                          onClick={closeSearch}
                          className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                        >
                          <div className="relative w-16 md:w-20 aspect-[2/3] shrink-0 rounded-lg overflow-hidden border border-black/5 dark:border-white/10 shadow-md">
                            <img
                              src={item.poster_path
                                ? (item.poster_path.startsWith('http') ? item.poster_path : `${BASE_IMG_URL}${item.poster_path}`)
                                : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&q=80'}
                              alt={item.title || item.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&q=80'; }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                               <Play size={20} className="text-brand-primary ml-1" fill="currentColor" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-brand-primary transition-colors">
                              {item.title || item.name}
                            </h3>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400 font-medium">
                              <span className="flex items-center gap-1">
                                {item.media_type === 'tv' ? <Tv size={14} className="text-brand-primary"/> : <Film size={14} className="text-brand-primary"/>}
                                {item.media_type === 'tv' ? 'Series' : 'Movie'}
                              </span>
                              {releaseYear && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                                  <span>{releaseYear}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-16 px-8 text-center flex flex-col items-center">
                    <SearchIcon size={40} className="text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-200">
                      No results found for <span className="text-brand-primary">"{debouncedQuery}"</span>
                    </p>
                    <p className="text-sm mt-2 text-gray-500 dark:text-gray-500">
                      Try adjusting your keywords or spelling.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
