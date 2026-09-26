import HeroBanner from '@/components/HeroBanner';
import CurvedCategorySlider from '@/components/CurvedCategorySlider';
import MovieRow from '@/components/MovieRow';
import Link from 'next/link';
import { fetchTrending, fetchNewReleases, fetchActionMovies, fetchBollywood, fetchAnime, fetchKDramas } from '@/utils/tmdb';
import dynamic from 'next/dynamic';

const DynamicMovieRow = dynamic(() => import('@/components/MovieRow'), {
  loading: () => <div className="h-60 w-full animate-pulse bg-gray-900/10 dark:bg-gray-800/20 mb-8 rounded-xl"></div>
});

export default async function Home() {
  let trendingData = { results: [] };
  let newReleasesData = { results: [] };
  let actionData = { results: [] };
  let bollywoodData = { results: [] };
  let animeData = { results: [] };
  let kdramasData = { results: [] };

  try {
    const results = await Promise.allSettled([
      fetchTrending(),
      fetchNewReleases(),
      fetchActionMovies(),
      fetchBollywood(),
      fetchAnime(),
      fetchKDramas()
    ]);
    
    trendingData = results[0].status === 'fulfilled' ? results[0].value : { results: [] };
    newReleasesData = results[1].status === 'fulfilled' ? results[1].value : { results: [] };
    actionData = results[2].status === 'fulfilled' ? results[2].value : { results: [] };
    bollywoodData = results[3].status === 'fulfilled' ? results[3].value : { results: [] };
    animeData = results[4].status === 'fulfilled' ? results[4].value : { results: [] };
    kdramasData = results[5].status === 'fulfilled' ? results[5].value : { results: [] };
  } catch (error) {
    console.error("Failed to fetch TMDB data:", error);
  }

  return (
    <main className="w-full flex flex-col bg-[#FBFBFD] dark:bg-brand-bg relative z-0 transition-colors duration-500">
      <HeroBanner trendingData={trendingData.results} />
      
      <div className="flex flex-col space-y-6 mt-[-100px] relative z-20">
        <CurvedCategorySlider />
        <DynamicMovieRow title="Trending Now" initialMovies={trendingData.results} fetchCategory="trending" href="/explore" />
        <DynamicMovieRow title="New Releases" initialMovies={newReleasesData.results} fetchCategory="newReleases" href="/explore" />
        <DynamicMovieRow title="Action & Thrillers" initialMovies={actionData.results} fetchCategory="action" />
        <DynamicMovieRow title="Blockbuster Bollywood" initialMovies={bollywoodData.results} fetchCategory="bollywood" fallbackType="movie" />
        <DynamicMovieRow title="Trending Anime" initialMovies={animeData.results} fetchCategory="anime" fallbackType="tv" />
        <DynamicMovieRow title="Top K-Dramas" initialMovies={kdramasData.results} fetchCategory="kdramas" fallbackType="tv" />
      </div>

      <footer className="w-full text-center py-12 mt-12 border-t border-gray-800">
        <Link href="/sitemap" className="text-gray-500 hover:text-brand-primary transition-colors text-sm font-medium">
          Sitemap
        </Link>
      </footer>

      {/* Padding for Floating Nav Dock */}
      <div className="pb-32"></div>
    </main>
  );
}
