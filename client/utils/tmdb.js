export const BASE_IMG_URL = "https://image.tmdb.org/t/p/w500";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchTrending = async () => {
  const res = await fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error("Failed to fetch trending");
  return res.json();
};

export const fetchNewReleases = async () => {
  // Fetching popular movies as "New Releases"
  const res = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error("Failed to fetch new releases");
  return res.json();
};

export const fetchActionMovies = async () => {
  // Genre ID 28 is Action
  const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28&language=en-US`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error("Failed to fetch action movies");
  return res.json();
};

export const fetchDetails = async (id, type = 'tv') => {
  const res = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=en-US`);
  if (!res.ok) throw new Error(`Failed to fetch details for ${type} ${id}`);
  const data = await res.json();
  data.media_type = type; // Inject type so frontend knows if it's movie or tv
  return data;
};

export const fetchExternalIds = async (id, type = 'tv') => {
  const res = await fetch(`${BASE_URL}/${type}/${id}/external_ids?api_key=${API_KEY}`);
  if (!res.ok) throw new Error(`Failed to fetch external IDs for ${type} ${id}`);
  return res.json();
};

// Fetch Bollywood Movies (Hindi)
export const fetchBollywood = async () => {
  const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=hi&sort_by=popularity.desc`);
  return res.json();
};

// Fetch Anime (Japanese + Animation Genre 16)
export const fetchAnime = async () => {
  const res = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_original_language=ja&with_genres=16&sort_by=popularity.desc`);
  return res.json();
};

// Fetch K-Dramas (Korean)
export const fetchKDramas = async () => {
  const res = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_original_language=ko&sort_by=popularity.desc`);
  return res.json();
};

export const fetchSearch = async (query) => {
  if (!query) return { results: [] };
  const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`);
  return res.json();
};

export const fetchCredits = async (id, type = 'tv') => {
  const res = await fetch(`${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}`);
  return res.json();
};

export const fetchVideos = async (id, type = 'tv') => {
  const res = await fetch(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`);
  return res.json();
};

export const fetchSimilar = async (id, type = 'tv') => {
  const res = await fetch(`${BASE_URL}/${type}/${id}/similar?api_key=${API_KEY}`);
  return res.json();
};
