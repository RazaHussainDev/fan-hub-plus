'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && user.watchlist) {
      setWatchlist(user.watchlist);
    } else {
      setWatchlist([]);
    }
  }, [user]);

  const toggleWatchlist = async (item) => {
    if (!user) return toast.error("Please login to save movies!");

    // Extract ID safely
    const movieId = item.id || item.movieId;

    // Optimistic UI Update
    setWatchlist((prev) => {
      const exists = prev.find((i) => String(i.movieId) === String(movieId) || String(i.id) === String(movieId));
      if (exists) {
        return prev.filter((i) => String(i.movieId) !== String(movieId) && String(i.id) !== String(movieId));
      }
      return [...prev, { movieId: String(movieId), title: item.title || item.name, poster_path: item.poster_path, media_type: item.media_type || 'movie' }];
    });

    try {
      const res = await fetch('http://localhost:5000/api/auth/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          movieId: movieId,
          title: item.title || item.name,
          poster_path: item.poster_path,
          media_type: item.media_type || 'movie'
        })
      });
      const data = await res.json();
      if (data.success) {
        setWatchlist(data.watchlist);
        
        // Also update local storage user state to keep it in sync for page reloads
        const storedUser = JSON.parse(localStorage.getItem('fanhub_user') || '{}');
        storedUser.watchlist = data.watchlist;
        localStorage.setItem('fanhub_user', JSON.stringify(storedUser));
        
        // Let's deduce if added or removed
        const exists = user.watchlist?.find(i => String(i.movieId) === String(movieId));
        if (exists) toast.success("Removed from Watchlist", { style: { background: '#0b0f0a', color: '#f3f4f6' } });
        else toast.success("Added to Watchlist!", { style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' } });
      }
    } catch (err) {
      toast.error("Failed to update watchlist");
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
