import { NextResponse } from 'next/server';
import { fetchExplore } from '@/utils/tmdb';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || 1;
  
  try {
    const data = await fetchExplore(page);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch explore movies' }, { status: 500 });
  }
}
