export const BASE_IMG_URL = "https://image.tmdb.org/t/p/w500";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Helper for fast timeouts (prevents 10-second server hangs when TMDB is blocked)
const fetchWithTimeout = async (url, options = {}) => {
  try {
    const res = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(2000) // 2-second strict timeout
    });
    if (!res.ok) throw new Error("TMDB HTTP Error: " + res.status);
    return await res.json();
  } catch (err) {
    console.warn("TMDB Fetch Failed:", err.message);
    return { results: [] }; // Fallback to empty array to prevent UI crashes
  }
};

export const fetchTrending = async () => {
  return fetchWithTimeout(`${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US`, { next: { revalidate: 3600 } });
};

export const fetchNewReleases = async () => {
  return fetchWithTimeout(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`, { next: { revalidate: 3600 } });
};

export const fetchActionMovies = async () => {
  return fetchWithTimeout(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28&language=en-US`, { next: { revalidate: 3600 } });
};

export const fetchDetails = async (id, type = 'tv') => {
  try {
    const res = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=en-US`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`Failed to fetch details`);
    const data = await res.json();
    data.media_type = type;
    return data;
  } catch (e) {
    return null;
  }
};

export const fetchExternalIds = async (id, type = 'tv') => {
  return fetchWithTimeout(`${BASE_URL}/${type}/${id}/external_ids?api_key=${API_KEY}`);
};

export const fetchBollywood = async () => {
  return fetchWithTimeout(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=hi&sort_by=popularity.desc`);
};

export const fetchAnime = async () => {
  return fetchWithTimeout(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_original_language=ja&with_genres=16&sort_by=popularity.desc`);
};

export const fetchKDramas = async () => {
  return fetchWithTimeout(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_original_language=ko&sort_by=popularity.desc`);
};

export const fetchSearch = async (query) => {
  if (!query) return { results: [] };
  return fetchWithTimeout(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`);
};

export const fetchCredits = async (id, type = 'tv') => {
  return fetchWithTimeout(`${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}`);
};

export const fetchVideos = async (id, type = 'tv') => {
  return fetchWithTimeout(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`);
};

export const fetchSimilar = async (id, type = 'tv') => {
  return fetchWithTimeout(`${BASE_URL}/${type}/${id}/similar?api_key=${API_KEY}`);
};

export const fetchExplore = async (page = 1) => {
  return fetchWithTimeout(`${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US&page=${page}`);
};

