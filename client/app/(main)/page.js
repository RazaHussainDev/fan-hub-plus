import HeroBanner from '@/components/HeroBanner';
import MovieRow from '@/components/MovieRow';
import { fetchTrending, fetchNewReleases, fetchActionMovies, fetchBollywood, fetchAnime, fetchKDramas } from '@/utils/tmdb';

export default async function Home() {
  let trendingData = { results: [] };
  let newReleasesData = { results: [] };
  let actionData = { results: [] };
  let bollywoodData = { results: [] };
  let animeData = { results: [] };
  let kdramasData = { results: [] };

  try {
    const [trending, newReleases, action, bollywood, anime, kdramas] = await Promise.all([
      fetchTrending(),
      fetchNewReleases(),
      fetchActionMovies(),
      fetchBollywood(),
      fetchAnime(),
      fetchKDramas()
    ]);
    
    trendingData = trending;
    newReleasesData = newReleases;
    actionData = action;
    bollywoodData = bollywood;
    animeData = anime;
    kdramasData = kdramas;
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
        <MovieRow title="Blockbuster Bollywood" movies={bollywoodData.results} fallbackType="movie" />
        <MovieRow title="Trending Anime" movies={animeData.results} fallbackType="tv" />
        <MovieRow title="Top K-Dramas" movies={kdramasData.results} fallbackType="tv" />
      </div>

      {/* Padding for Floating Nav Dock */}
      <div className="pb-32"></div>
    </main>
  );
}
