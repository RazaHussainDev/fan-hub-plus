import { NextResponse } from 'next/server';
import { fetchCategoryMovies, fetchSearch } from '@/utils/tmdb';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'trending';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';

  try {
    let data;
    if (search.trim()) {
      data = await fetchSearch(search.trim(), page);
    } else {
      data = await fetchCategoryMovies(category, page);
    }

    const results = (data?.results || []).map((item) => ({
      id: item.id,
      title: item.title || item.name || 'Untitled',
      name: item.name || item.title || 'Untitled',
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      media_type: item.media_type || (item.title ? 'movie' : 'tv'),
      vote_average: item.vote_average ? Number(item.vote_average).toFixed(1) : '8.0',
      release_date: item.release_date || item.first_air_date || '',
      overview: item.overview || ''
    }));

    return NextResponse.json({
      success: true,
      results,
      page: data?.page || page,
      total_pages: data?.total_pages || 100,
      total_results: data?.total_results || 1000
    });
  } catch (error) {
    console.error('Explore API error:', error);
    return NextResponse.json({ success: false, results: [], total_pages: 0 }, { status: 500 });
  }
}
