'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchSearch, BASE_IMG_URL } from '@/utils/tmdb';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <main className="min-h-screen bg-brand-bg text-gray-50 p-6 md:p-12 pb-32 font-body flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <header className="mb-8 w-full text-center">
          <h1 className="text-4xl font-heading font-bold text-white mb-6 tracking-tight drop-shadow-md">
            Global Search
          </h1>
          <div className="relative w-full max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for movies, tv shows, anime..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-400 rounded-full py-4 px-6 shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all text-lg"
            />
            {loading && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2">
                <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </header>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {results.map((item) => {
              if (!item.poster_path) return null;
              return (
                <Link
                  key={item.id}
                  href={`/stream/${item.id}?type=${item.media_type || 'movie'}`}
                  className="block group overflow-hidden rounded-md shadow-lg border border-gray-800 bg-gray-900 transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src={`${BASE_IMG_URL}${item.poster_path}`}
                    alt={item.title || item.name}
                    className="w-full aspect-[2/3] object-cover"
                  />
                  <div className="p-3">
                    <p className="text-sm font-bold text-gray-200 truncate group-hover:text-brand-primary transition-colors">
                      {item.title || item.name}
                    </p>
                    <p className="text-xs text-gray-500 uppercase font-semibold mt-1">
                      {item.media_type === 'tv' ? 'TV Series' : 'Movie'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          query.trim() && !loading && (
            <div className="text-center text-gray-400 mt-12">
              <p className="text-xl">No results found for "{query}"</p>
            </div>
          )
        )}
      </div>
    </main>
  );
}
