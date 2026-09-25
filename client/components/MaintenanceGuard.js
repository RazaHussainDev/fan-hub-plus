"use client";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AlertTriangle, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function MaintenanceGuard({ children }) {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const { user } = useAuth();

  useEffect(() => {
    const checkSettings = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/settings/global');
        const data = await res.json();
        if (data.success && data.settings?.maintenanceMode) {
          setIsMaintenance(true);
        }
      } catch (error) {
        console.error("Failed to fetch settings");
      } finally {
        setLoading(false);
      }
    };
    checkSettings();
  }, []);

  // Allow Admins to bypass, and NEVER block the /admin routes or /login route
  if (pathname.startsWith('/admin') || pathname.startsWith('/login') || user?.role === 'admin') {
    return <>{children}</>;
  }

  if (loading) return <div className="h-screen w-full bg-[#0b0f0a] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#a7c957]/30 border-t-[#a7c957] rounded-full animate-spin"></div></div>;

  if (isMaintenance) {
    return (
      <div className="min-h-screen bg-[#0b0f0a] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden selection:bg-[#a7c957]/30 font-body">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#a7c957]/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-8">
            <Settings className="w-24 h-24 text-[#a7c957] animate-[spin_10s_linear_infinite]" />
            <AlertTriangle className="w-10 h-10 text-[#0b0f0a] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" fill="#a7c957" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black font-heading text-[#f3f4f6] mb-6 tracking-tighter">System Upgrade</h1>
          <p className="text-gray-400 max-w-lg mb-10 text-lg leading-relaxed">
            Fan Hub Plus is currently undergoing scheduled maintenance to improve your streaming experience. We'll be back online shortly.
          </p>

          <div className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-300 flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a7c957] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#a7c957]"></span>
            </span>
            Core Systems Offline
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
