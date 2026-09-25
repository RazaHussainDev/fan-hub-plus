'use client';

import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Wifi, WifiOff } from 'lucide-react';

export default function NetworkDetector() {
  useEffect(() => {
    const handleOnline = () => {
      toast.success("Back online! Connection restored.", {
        icon: <Wifi className="text-brand-primary" />,
        style: { background: '#0b0f0a', color: '#f3f4f6', border: '1px solid #a7c957' }
      });
    };

    const handleOffline = () => {
      toast.error("No internet connection. Operating offline.", {
        icon: <WifiOff className="text-red-500" />,
        duration: 5000,
        style: { background: '#0b0f0a', color: '#f3f4f6', border: '1px solid #ef4444' }
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return null;
}
