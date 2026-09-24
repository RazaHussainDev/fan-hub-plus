import HeroBanner from '@/components/HeroBanner';
import MovieRow from '@/components/MovieRow';

const DUMMY_MOVIES = [
  { id: 1, title: 'Stranger Things', poster: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8OSqAAwQv.jpg' },
  { id: 2, title: 'Squid Game', poster: 'https://image.tmdb.org/t/p/w500/dDlEmu3EZ0PggZ2K2QK1ZrvMac9.jpg' },
  { id: 3, title: 'Breaking Bad', poster: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg' },
  { id: 4, title: 'The Boys', poster: 'https://image.tmdb.org/t/p/w500/stTEycfG9928RWa4O917eFBRD6.jpg' },
  { id: 5, title: 'Dark', poster: 'https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg' },
  { id: 6, title: 'Peaky Blinders', poster: 'https://image.tmdb.org/t/p/w500/vUUqzWa2LcUICkOMqWHfd05Hn8L.jpg' },
  { id: 7, title: 'The Witcher', poster: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVICKPhnEn.jpg' },
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
