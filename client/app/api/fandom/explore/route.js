import { NextResponse } from 'next/server';
import { fetchCategoryMovies, fetchSearch } from '@/utils/tmdb';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';
  const backendBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  let dbResults = [];
  try {
    const res = await fetch(`${backendBase}/api/fandom/explore?${searchParams.toString()}`, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.results)) {
        dbResults = data.results.map(item => {
          const posterUrl = item.poster || '';
          let posterPath = item.poster_path || null;

          if (!posterPath && posterUrl) {
            if (posterUrl.includes('image.tmdb.org')) {
              posterPath = posterUrl
                .replace('https://image.tmdb.org/t/p/w500', '')
                .replace('https://image.tmdb.org/t/p/w780', '')
                .replace('https://image.tmdb.org/t/p/original', '');
            }
          }

          return {
            ...item,
            id: item._id || item.id,
            poster: posterUrl,
            poster_path: posterPath,
            backdrop: item.backdrop || '',
            rating: item.rating || item.vote_average || 8.5
          };
        });
      }
    }
  } catch (e) {
    // Proceed with TMDB catalog if backend is not reachable
  }

  try {
    let tmdbData;
    if (search.trim()) {
      tmdbData = await fetchSearch(search.trim(), page);
    } else {
      tmdbData = await fetchCategoryMovies(category, page);
    }

    const tmdbMapped = (tmdbData?.results || []).map(m => ({
      _id: String(m.id),
      id: m.id,
      title: m.title || m.name || 'Untitled',
      name: m.name || m.title || 'Untitled',
      category: category === 'all' ? (m.title ? 'Movies' : 'TV Shows') : category,
      type: m.media_type || (m.title ? 'movie' : 'tv'),
      description: m.overview || '',
      poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '',
      poster_path: m.poster_path,
      backdrop: m.backdrop_path ? `https://image.tmdb.org/t/p/original${m.backdrop_path}` : '',
      rating: m.vote_average ? Number(m.vote_average).toFixed(1) : '8.2',
      vote_average: m.vote_average,
      releaseYear: m.release_date ? parseInt(m.release_date.slice(0, 4)) : 2024,
      release_date: m.release_date || m.first_air_date || ''
    }));

    const combined = page === 1 ? [...dbResults, ...tmdbMapped] : tmdbMapped;

    // Deduplicate by ID
    const seen = new Set();
    const uniqueResults = [];
    for (const item of combined) {
      const key = String(item.id || item._id);
      if (!seen.has(key) && (item.poster || item.poster_path)) {
        seen.add(key);
        uniqueResults.push(item);
      }
    }

    return NextResponse.json({
      success: true,
      results: uniqueResults,
      total: uniqueResults.length,
      page,
      total_pages: tmdbData?.total_pages || 100
    });
  } catch (error) {
    console.error("Fandom explore API error:", error);
    return NextResponse.json({ success: true, results: dbResults, total: dbResults.length });
  }
}
