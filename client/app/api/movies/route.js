import { NextResponse } from 'next/server';
import { fetchTrending, fetchNewReleases, fetchActionMovies, fetchBollywood, fetchAnime, fetchKDramas } from '@/utils/tmdb';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  
  try {
    let data;
    switch (category) {
      case 'trending': data = await fetchTrending(); break;
      case 'newReleases': data = await fetchNewReleases(); break;
      case 'action': data = await fetchActionMovies(); break;
      case 'bollywood': data = await fetchBollywood(); break;
      case 'anime': data = await fetchAnime(); break;
      case 'kdramas': data = await fetchKDramas(); break;
      default: data = await fetchTrending(); break;
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}
