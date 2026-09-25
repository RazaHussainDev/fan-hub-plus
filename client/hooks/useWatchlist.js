'use client';

import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import useSWR, { useSWRConfig } from 'swr';

export function useWatchlist() {
  const { user, token } = useAuth();
  const { mutate } = useSWRConfig();

  // SWR Fetcher
  const fetcher = (url) => fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json());
  
  // Use SWR to automatically fetch & cache the watchlist
  const { data, error } = useSWR(token ? 'http://localhost:5000/api/auth/watchlist' : null, fetcher);

  // Derived array - prioritize fresh SWR data, fallback to context state, default to empty array
  const watchlist = data?.watchlist || user?.watchlist || [];

  const toggleWatchlist = async (item) => {
    if (!user || !token) return toast.error("Please login to save movies!");

    // Safely extract ID whether 'item' is an object or a primitive string/number
    const rawId = typeof item === 'object' ? (item.id || item.movieId) : item;
    const movieId = String(rawId);
    const isCurrentlySaved = isInWatchlist(movieId);

    // Optimistic UI mutation for instant feedback
    const updatedWatchlist = isCurrentlySaved
      ? watchlist.filter(i => String(i.movieId) !== movieId)
      : [...watchlist, { 
          movieId, 
          title: typeof item === 'object' ? (item.title || item.name || 'Unknown Title') : 'Unknown Title', 
          poster_path: typeof item === 'object' ? (item.poster_path || '') : '', 
          media_type: typeof item === 'object' ? (item.media_type || 'movie') : 'movie'
        }];
        
    mutate('http://localhost:5000/api/auth/watchlist', { success: true, watchlist: updatedWatchlist }, false);

    try {
      const res = await fetch('http://localhost:5000/api/auth/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          movieId, 
          title: typeof item === 'object' ? (item.title || item.name || 'Unknown Title') : 'Unknown Title',
          poster_path: typeof item === 'object' ? (item.poster_path || '') : '',
          media_type: typeof item === 'object' ? (item.media_type || 'movie') : 'movie'
        })
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || 'Failed to update watchlist');
      }

      if (resData.success) {
        // Sync local storage so it persists if the user hard reloads
        const storedUser = JSON.parse(localStorage.getItem('fanhub_user') || '{}');
        storedUser.watchlist = resData.watchlist;
        localStorage.setItem('fanhub_user', JSON.stringify(storedUser));
        
        if (isCurrentlySaved) toast.success("Removed from Watchlist", { style: { background: '#0b0f0a', color: '#f3f4f6' } });
        else toast.success("Watchlist updated!", { style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' } });

        // Tell SWR to globally sync the new data
        mutate('http://localhost:5000/api/auth/watchlist'); 
      }
    } catch (err) {
      console.error("Watchlist Error:", err);
      toast.error("Error: Could not save to database.");
      mutate('http://localhost:5000/api/auth/watchlist'); // Rollback
    }
  };

  const isInWatchlist = (id) => {
    return watchlist.some((item) => String(item.movieId) === String(id) || String(item.id) === String(id));
  };

  return {
    watchlist,
    addToWatchlist: toggleWatchlist,
    removeFromWatchlist: toggleWatchlist,
    isInWatchlist,
  };
}
