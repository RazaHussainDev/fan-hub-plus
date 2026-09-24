import React from 'react';
import Link from 'next/link';

import { BASE_IMG_URL } from '@/utils/tmdb';

const MovieRow = ({ title, movies }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="w-full flex flex-col space-y-2 py-4">
      <h2 className="text-xl md:text-2xl font-heading font-bold text-gray-100 px-6 md:px-16">
        {title}
      </h2>
      
      <div className="flex overflow-x-auto scrollbar-hide space-x-4 py-4 px-6 md:px-16">
        {movies.map((movie) => {
          if (!movie.poster_path) return null;
          return (
            <Link href={`/stream/${movie.id}`} key={movie.id} target="_blank" rel="noopener noreferrer" className="shrink-0 block">
              <img 
                src={`${BASE_IMG_URL}${movie.poster_path}`} 
                alt={movie.title || movie.name} 
                className="w-32 md:w-40 aspect-[2/3] object-cover rounded-md hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg border border-gray-800"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MovieRow;
