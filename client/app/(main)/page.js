import HeroBanner from '@/components/HeroBanner';
import MovieRow from '@/components/MovieRow';

const DUMMY_MOVIES = [
  { id: 1, title: 'Stranger Things', poster: 'https://static.tvmaze.com/uploads/images/original_untouched/595/1489169.jpg' },
  { id: 2, title: 'Squid Game', poster: 'https://static.tvmaze.com/uploads/images/original_untouched/576/1440521.jpg' },
  { id: 3, title: 'Breaking Bad', poster: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg' },
  { id: 4, title: 'The Boys', poster: 'https://static.tvmaze.com/uploads/images/original_untouched/619/1547768.jpg' },
  { id: 5, title: 'Dark', poster: 'https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg' },
  { id: 6, title: 'Peaky Blinders', poster: 'https://static.tvmaze.com/uploads/images/original_untouched/48/122213.jpg' },
  { id: 7, title: 'The Witcher', poster: 'https://static.tvmaze.com/uploads/images/original_untouched/594/1486674.jpg' },
];

export default function Home() {
  return (
    <main className="w-full flex flex-col bg-brand-bg relative z-0">
      <HeroBanner />
      
      <div className="flex flex-col space-y-6 mt-[-100px] relative z-20">
        <MovieRow title="Trending Now" movies={DUMMY_MOVIES} />
        <MovieRow title="New Releases" movies={[...DUMMY_MOVIES].reverse()} />
        <MovieRow title="Action & Thrillers" movies={[DUMMY_MOVIES[3], DUMMY_MOVIES[5], DUMMY_MOVIES[1], DUMMY_MOVIES[6], DUMMY_MOVIES[0], DUMMY_MOVIES[2], DUMMY_MOVIES[4]]} />
      </div>

      {/* Padding for Floating Nav Dock */}
      <div className="pb-32"></div>
    </main>
  );
}
