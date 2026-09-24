'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Search } from 'lucide-react';
import { fetchSearch, BASE_IMG_URL } from '@/utils/tmdb';
import { useSearch } from '@/context/SearchContext';

export default function SearchModal() {
  const { isSearchOpen, closeSearch } = useSearch();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSearchOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const data = await fetchSearch(query);
        setResults(data.results || []);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center pt-24 bg-[#FBFBFD]/90 dark:bg-black/80 backdrop-blur-2xl transition-all duration-300 overflow-y-auto">
      <button
        onClick={closeSearch}
        className="absolute top-6 right-6 text-[#3c3c43] dark:text-gray-400 hover:text-[#1d1d1f] dark:hover:text-white transition-colors bg-black/[0.06] dark:bg-white/10 rounded-full p-2"
      >
        <X size={24} />
      </button>

      <div className="w-full max-w-5xl px-6">
        <div className="relative w-full max-w-3xl mx-auto mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b] dark:text-gray-400" size={24} />
          <input
            type="text"
            placeholder="Search for movies, TV shows, anime..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-b-2 border-black/10 dark:border-gray-700 text-[#1d1d1f] dark:text-white placeholder-[#86868b] dark:placeholder-gray-500 py-4 pl-14 pr-12 focus:outline-none focus:border-brand-primary transition-all text-2xl md:text-3xl font-medium"
            autoFocus
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 pb-24">
            {results.map((item) => {
              if (!item.poster_path) return null;
              return (
                <Link
                  key={item.id}
                  href={`/stream/${item.id}?type=${item.media_type || 'movie'}`}
                  onClick={closeSearch}
                  style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)' }}
                  className="block group overflow-hidden rounded-xl border border-black/[0.06] dark:border-gray-800 bg-white dark:bg-gray-900 transition-transform duration-300 hover:scale-105 dark:shadow-lg"
                >
                  <img
                    src={`${BASE_IMG_URL}${item.poster_path}`}
                    alt={item.title || item.name}
                    className="w-full aspect-[2/3] object-cover"
                  />
                  <div className="p-3">
                    <p className="text-sm font-bold text-[#1d1d1f] dark:text-gray-200 truncate group-hover:text-brand-primary transition-colors">
                      {item.title || item.name}
                    </p>
                    <p className="text-xs text-[#86868b] dark:text-gray-500 uppercase font-semibold mt-1">
                      {item.media_type === 'tv' ? 'TV Series' : 'Movie'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          query.trim() && !loading && (
            <div className="text-center mt-12 bg-white/80 dark:bg-gray-900/50 p-8 rounded-2xl border border-black/[0.06] dark:border-gray-800 shadow-sm">
              <p className="text-xl md:text-2xl font-medium text-[#1d1d1f] dark:text-gray-400">No results found for <span className="text-brand-primary">"{query}"</span></p>
              <p className="text-sm mt-2 text-[#86868b] dark:text-gray-500">Try checking for typos or using different keywords!</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
