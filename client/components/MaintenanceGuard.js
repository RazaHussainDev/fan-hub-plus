"use client";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AlertTriangle, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function MaintenanceGuard({ children }) {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    let isSubscribed = true;
    const checkSettings = async () => {
      try {
        const backendBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${backendBase}/api/admin/settings/global`, {
          signal: AbortSignal.timeout(1500)
        });
        const data = await res.json();
        if (isSubscribed && data.success && data.settings?.maintenanceMode) {
          setIsMaintenance(true);
        }
      } catch (error) {
        // Non-blocking: gracefully allow site access if backend is unreachable
      }
    };
    checkSettings();

    return () => {
      isSubscribed = false;
    };
  }, []);

  // Allow Admins to bypass, and NEVER block the /admin routes or /login route
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login') || user?.role === 'admin' || user?.role === 'superadmin') {
    return <>{children}</>;
  }

  if (isMaintenance) {
    return (
      <div className="min-h-screen bg-[#0b0f0a] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden selection:bg-[#a7c957]/30 font-body">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#a7c957]/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center max-w-md">
          <div className="relative mb-6">
            <Settings className="w-20 h-20 text-[#a7c957] animate-[spin_10s_linear_infinite]" />
            <AlertTriangle className="w-8 h-8 text-amber-400 absolute bottom-0 right-0 animate-bounce" />
          </div>

          <span className="px-3 py-1 rounded-full bg-[#a7c957]/10 text-[#a7c957] text-xs font-mono font-bold tracking-widest uppercase mb-4 border border-[#a7c957]/20">
            System Maintenance Mode
          </span>

          <h1 className="text-3xl sm:text-4xl font-heading font-black text-white mb-3 tracking-tight">
            Upgrading the Continuum
          </h1>

          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Fan Hub Plus is currently undergoing scheduled infrastructure optimization. The Fandom Universe will return shortly.
          </p>

          <a 
            href="/login" 
            className="px-6 py-2.5 rounded-full bg-[#a7c957] text-[#0b0f0a] font-bold text-xs hover:brightness-110 shadow-lg transition-all"
          >
            Admin Sign In
          </a>
        </div>
      </div>
    );
  }

  // Instant render without blocking initial page paint!
  return <>{children}</>;
}
