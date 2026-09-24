import React from 'react';
import Link from 'next/link';

import { BASE_IMG_URL } from '@/utils/tmdb';

const MovieRow = ({ title, movies, fallbackType = 'movie' }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="w-full flex flex-col space-y-3 py-4">
      {/* Section header with Apple-style label hierarchy */}
      <div className="flex items-baseline gap-3 px-6 md:px-16">
        <h2 className="text-xl md:text-2xl font-heading font-bold text-[#1d1d1f] dark:text-gray-100 transition-colors duration-300">
          {title}
        </h2>
        <span className="text-sm font-medium text-[#86868b] dark:text-gray-500 transition-colors duration-300">See All</span>
      </div>

      <div className="flex overflow-x-auto scrollbar-hide space-x-4 py-3 px-6 md:px-16">
        {movies.map((movie) => {
          if (!movie.poster_path) return null;
          return (
            <Link
              href={`/stream/${movie.id}?type=${movie.media_type || fallbackType}`}
              key={movie.id}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 block group"
            >
              <div
                style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)' }}
                className="w-32 md:w-40 rounded-xl overflow-hidden border border-black/[0.06] dark:border-gray-700/40 group-hover:scale-105 transition-transform duration-300 dark:shadow-lg"
              >
                <img
                  src={`${BASE_IMG_URL}${movie.poster_path}`}
                  alt={movie.title || movie.name}
                  className="w-full aspect-[2/3] object-cover"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MovieRow;
