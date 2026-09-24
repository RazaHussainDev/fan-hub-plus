import HeroBanner from '@/components/HeroBanner';
import MovieRow from '@/components/MovieRow';
import { fetchTrending, fetchNewReleases, fetchActionMovies } from '@/utils/tmdb';

export default async function Home() {
  let trendingData = { results: [] };
  let newReleasesData = { results: [] };
  let actionData = { results: [] };

  try {
    const [trending, newReleases, action] = await Promise.all([
      fetchTrending(),
      fetchNewReleases(),
      fetchActionMovies()
    ]);
    
    trendingData = trending;
    newReleasesData = newReleases;
    actionData = action;
  } catch (error) {
    console.error("Failed to fetch TMDB data:", error);
  }

  return (
    <main className="w-full flex flex-col bg-brand-bg relative z-0">
      <HeroBanner />
      
      <div className="flex flex-col space-y-6 mt-[-100px] relative z-20">
        <MovieRow title="Trending Now" movies={trendingData.results} />
        <MovieRow title="New Releases" movies={newReleasesData.results} />
        <MovieRow title="Action & Thrillers" movies={actionData.results} />
      </div>

      {/* Padding for Floating Nav Dock */}
      <div className="pb-32"></div>
    </main>
  );
}
