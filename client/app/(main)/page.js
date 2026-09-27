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
  let customHero = null;

  try {
    const results = await Promise.allSettled([
      fetchTrending(),
      fetchNewReleases(),
      fetchActionMovies(),
      fetchBollywood(),
      fetchAnime(),
      fetchKDramas(),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/settings/global`, { next: { revalidate: 60 }, signal: AbortSignal.timeout(5000) }).then(r => r.json())
    ]);
    
    trendingData = results[0].status === 'fulfilled' ? results[0].value : { results: [] };
    newReleasesData = results[1].status === 'fulfilled' ? results[1].value : { results: [] };
    actionData = results[2].status === 'fulfilled' ? results[2].value : { results: [] };
    bollywoodData = results[3].status === 'fulfilled' ? results[3].value : { results: [] };
    animeData = results[4].status === 'fulfilled' ? results[4].value : { results: [] };
    kdramasData = results[5].status === 'fulfilled' ? results[5].value : { results: [] };
    
    const settingsData = results[6].status === 'fulfilled' ? results[6].value : null;
    if (settingsData?.success && settingsData.settings?.customHero?.isActive) {
      customHero = settingsData.settings.customHero;
    }
  } catch (error) {
    console.error("Failed to fetch TMDB data:", error);
  }

  return (
    <main className="w-full flex flex-col bg-[#FBFBFD] dark:bg-brand-bg relative z-0 transition-colors duration-500 pt-14 md:pt-0">
      <HeroBanner trendingData={trendingData.results} customHeroProp={customHero} />
      
      <div className="flex flex-col space-y-6 mt-[-100px] relative z-20">
        <CurvedCategorySlider />
        <DynamicMovieRow title="Trending Now" initialMovies={trendingData.results} fetchCategory="trending" href="/explore?category=trending" />
        <DynamicMovieRow title="New Releases" initialMovies={newReleasesData.results} fetchCategory="newReleases" href="/explore?category=newReleases" />
        <DynamicMovieRow title="Action & Thrillers" initialMovies={actionData.results} fetchCategory="action" href="/explore?category=action" />
        <DynamicMovieRow title="Blockbuster Bollywood" initialMovies={bollywoodData.results} fetchCategory="bollywood" fallbackType="movie" href="/explore?category=bollywood" />
        <DynamicMovieRow title="Trending Anime" initialMovies={animeData.results} fetchCategory="anime" fallbackType="tv" href="/explore?category=anime" />
        <DynamicMovieRow title="Top K-Dramas" initialMovies={kdramasData.results} fetchCategory="kdramas" fallbackType="tv" href="/explore?category=kdramas" />
      </div>
    </main>
  );
}
