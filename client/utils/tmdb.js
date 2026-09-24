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
  return res.json();
};
