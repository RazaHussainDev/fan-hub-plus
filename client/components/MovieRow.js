import React from 'react';
import Link from 'next/link';

const MovieRow = ({ title, movies }) => {
  return (
    <div className="w-full flex flex-col space-y-2 py-4">
      <h2 className="text-xl md:text-2xl font-heading font-bold text-gray-100 px-6 md:px-16">
        {title}
      </h2>
      
      <div className="flex overflow-x-auto scrollbar-hide space-x-4 py-4 px-6 md:px-16">
        {movies.map((movie) => (
          <Link href={movie.link || '#'} key={movie.id} className="shrink-0 block">
            <img 
              src={movie.poster} 
              alt={movie.title} 
              className="w-32 md:w-40 aspect-[2/3] object-cover rounded-md hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg border border-gray-800"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieRow;
