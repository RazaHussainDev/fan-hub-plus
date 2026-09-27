export const BASE_IMG_URL = "https://image.tmdb.org/t/p/w500";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Helper for fast timeouts (prevents server hangs when TMDB has high latency)
const fetchWithTimeout = async (url, options = {}) => {
  try {
    const res = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(4000) // 4-second strict timeout
    });
    if (!res.ok) throw new Error("TMDB HTTP Error: " + res.status);
    return await res.json();
  } catch (err) {
    console.warn("TMDB Fetch Failed:", err.message);
    return { results: [] }; // Fallback to empty array to prevent UI crashes
  }
};

export const fetchTrending = async (page = 1) => {
  return fetchWithTimeout(`${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US&page=${page}`, { next: { revalidate: 3600 } });
};

export const fetchNewReleases = async (page = 1) => {
  return fetchWithTimeout(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`, { next: { revalidate: 3600 } });
};

export const fetchActionMovies = async (page = 1) => {
  return fetchWithTimeout(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28&language=en-US&page=${page}`, { next: { revalidate: 3600 } });
};

export const fetchDetails = async (id, type = 'tv') => {
  try {
    const res = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=en-US`, { 
      signal: AbortSignal.timeout(3000),
      next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error(`Failed to fetch details`);
    const data = await res.json();
    data.media_type = type;
    return data;
  } catch (e) {
    return null;
  }
};

export const fetchExternalIds = async (id, type = 'tv') => {
  return fetchWithTimeout(`${BASE_URL}/${type}/${id}/external_ids?api_key=${API_KEY}`, { next: { revalidate: 3600 } });
};

export const fetchBollywood = async (page = 1) => {
  return fetchWithTimeout(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=hi&sort_by=popularity.desc&page=${page}`, { next: { revalidate: 3600 } });
};

export const fetchAnime = async (page = 1) => {
  return fetchWithTimeout(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_original_language=ja&with_genres=16&sort_by=popularity.desc&page=${page}`, { next: { revalidate: 3600 } });
};

export const fetchKDramas = async (page = 1) => {
  return fetchWithTimeout(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_original_language=ko&sort_by=popularity.desc&page=${page}`, { next: { revalidate: 3600 } });
};

export const fetchGamingOrSciFi = async (page = 1) => {
  return fetchWithTimeout(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=878,14&sort_by=popularity.desc&page=${page}`, { next: { revalidate: 3600 } });
};

export const fetchComics = async (page = 1) => {
  return fetchWithTimeout(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_keywords=9715,9717,180547&sort_by=popularity.desc&page=${page}`, { next: { revalidate: 3600 } });
};

export const fetchSearch = async (query, page = 1) => {
  if (!query) return { results: [] };
  return fetchWithTimeout(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`);
};

export const fetchCategoryMovies = async (category = 'trending', page = 1) => {
  const cat = (category || 'trending').toLowerCase();
  switch (cat) {
    case 'trending':
    case 'all':
    case 'all fandoms':
    case 'movies':
      return fetchTrending(page);
    case 'newreleases':
    case 'new':
      return fetchNewReleases(page);
    case 'action':
      return fetchActionMovies(page);
    case 'bollywood':
      return fetchBollywood(page);
    case 'anime':
    case 'manga':
      return fetchAnime(page);
    case 'kdramas':
    case 'k-pop':
    case 'kpop':
      return fetchKDramas(page);
    case 'gaming':
      return fetchGamingOrSciFi(page);
    case 'comics':
      return fetchComics(page);
    case 'tv':
    case 'tv shows':
      return fetchWithTimeout(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=${page}`, { next: { revalidate: 3600 } });
    default:
      return fetchTrending(page);
  }
};

export const fetchCredits = async (id, type = 'tv') => {
  return fetchWithTimeout(`${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}`, { next: { revalidate: 3600 } });
};

export const fetchVideos = async (id, type = 'tv') => {
  return fetchWithTimeout(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`, { next: { revalidate: 3600 } });
};

export const fetchSimilar = async (id, type = 'tv') => {
  return fetchWithTimeout(`${BASE_URL}/${type}/${id}/similar?api_key=${API_KEY}`, { next: { revalidate: 3600 } });
};

export const fetchExplore = async (page = 1) => {
  return fetchTrending(page);
};
