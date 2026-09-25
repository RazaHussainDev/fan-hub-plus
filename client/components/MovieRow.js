'use client';

import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { BASE_IMG_URL } from '@/utils/tmdb';
import SkeletonCard from './SkeletonCard';

const fetcher = (url) => fetch(url).then((res) => res.json());

const MovieRow = ({ title, fetchCategory, initialMovies = null, fallbackType = 'movie' }) => {
  // If fetchCategory is provided, we use SWR to fetch and cache data on the client.
  // Otherwise, fallback to initialMovies.
  const { data, error, isLoading: swrLoading } = useSWR(
    fetchCategory ? `/api/movies?category=${fetchCategory}` : null,
    fetcher,
    {
      fallbackData: initialMovies ? { results: initialMovies } : undefined,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      shouldRetryOnError: false
    }
  );

  const movies = data?.results || initialMovies || [];
  const isLoading = fetchCategory ? swrLoading && !data : false;
  const showSkeletons = isLoading || movies.length === 0;

  return (
    <div className="w-full flex flex-col space-y-2 py-4">
      {/* Apple-style section heading */}
      <div className="flex items-baseline justify-between px-6 md:px-16">
        <h2 className="text-xl md:text-2xl font-heading font-bold text-[#1d1d1f] dark:text-gray-100 transition-colors duration-300">
          {title}
        </h2>
        <span className="text-sm font-semibold text-brand-primary cursor-pointer hover:opacity-70 transition-opacity">
          See All
        </span>
      </div>

      <div className="flex overflow-x-auto scrollbar-hide space-x-4 py-4 px-6 md:px-16">
        {showSkeletons ? (
          [...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))
        ) : (
          movies.map((movie) => {
            if (!movie.poster_path) return null;
            return (
              <Link
                href={`/stream/${movie.id}?type=${movie.media_type || fallbackType}`}
                key={movie.id}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 block group"
              >
                {/* Card with poster + gradient title overlay */}
                <div className="relative w-32 md:w-40 rounded-2xl overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1"
                  style={{
                    boxShadow: '0 2px 8px rgba(0,0,0,0.10), 0 8px 24px rgba(0,0,0,0.12)',
                  }}
                >
                  <img
                    src={`${BASE_IMG_URL}${movie.poster_path}`}
                    alt={movie.title || movie.name}
                    loading="lazy"
                    className="w-full aspect-[2/3] object-cover"
                  />
                  {/* Gradient title overlay — always visible at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-2">
                    <p className="text-white text-xs font-semibold leading-tight line-clamp-2 drop-shadow-sm">
                      {movie.title || movie.name}
                    </p>
                  </div>
                  {/* Hover glow ring */}
                  <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 group-hover:ring-brand-primary/60 transition-all duration-300" />
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MovieRow;
