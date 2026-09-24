'use client';

import { useState, useEffect } from 'react';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('fan_hub_watchlist');
    if (stored) {
      try {
        setWatchlist(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse watchlist from localStorage', e);
      }
    }
  }, []);

  const addToWatchlist = (item) => {
    setWatchlist((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) return prev;
      const updated = [...prev, item];
      localStorage.setItem('fan_hub_watchlist', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromWatchlist = (id) => {
    setWatchlist((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      localStorage.setItem('fan_hub_watchlist', JSON.stringify(updated));
      return updated;
    });
  };

  const isInWatchlist = (id) => {
    return watchlist.some((item) => item.id === id);
  };

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  };
}
