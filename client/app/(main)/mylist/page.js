'use client';

import React from 'react';
import Link from 'next/link';
import { useWatchlist } from '@/hooks/useWatchlist';
import { BASE_IMG_URL } from '@/utils/tmdb';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function MyListPage() {
  const { watchlist } = useWatchlist();

  return (
    <main className="min-h-screen bg-brand-bg text-gray-50 p-6 md:p-12 pb-32 font-body flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <Breadcrumbs />
        
        <header className="mb-12 w-full text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-2 tracking-tight drop-shadow-md">
            My List
          </h1>
          <p className="text-gray-400 font-medium">Your personalized collection</p>
        </header>

        {watchlist.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {watchlist.map((item) => (
              <Link
                key={item.id || item.movieId}
                href={`/stream/${item.id || item.movieId}?type=${item.media_type || 'movie'}`}
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
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 mt-20 bg-gray-900/50 p-12 rounded-2xl border border-gray-800 shadow-xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Your list is empty</h2>
            <p className="text-gray-400 mb-8">Explore movies and shows to add them here and build your ultimate watchlist!</p>
            <Link href="/" className="px-8 py-3 bg-brand-primary text-white font-bold rounded-full hover:bg-brand-primary/80 transition-colors shadow-lg">
              Explore Now
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
