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

  // Derived array
  const watchlist = data?.watchlist || [];

  const toggleWatchlist = async (item) => {
    if (!user || !token) return toast.error("Please login to save movies!");

    try {
      const res = await fetch('http://localhost:5000/api/auth/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          movieId: String(item.id || item.movieId), // Force String to match MongoDB schema
          title: item.title || item.name,
          poster_path: item.poster_path,
          media_type: item.media_type || 'movie'
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
        
        const isCurrentlySaved = isInWatchlist(item.id || item.movieId);
        if (isCurrentlySaved) toast.success("Removed from Watchlist", { style: { background: '#0b0f0a', color: '#f3f4f6' } });
        else toast.success("Watchlist updated!", { style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' } });

        // Tell SWR to globally sync the new data
        mutate('http://localhost:5000/api/auth/watchlist'); 
      }
    } catch (err) {
      console.error("Watchlist Error:", err);
      toast.error("Error: Could not save to database.");
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
