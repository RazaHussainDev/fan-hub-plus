import { NextResponse } from 'next/server';
import { fetchCategoryMovies } from '@/utils/tmdb';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'trending';
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  try {
    const data = await fetchCategoryMovies(category, page);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Movies API route error:', error);
    return NextResponse.json({ error: 'Failed to fetch movies', results: [] }, { status: 500 });
  }
}
