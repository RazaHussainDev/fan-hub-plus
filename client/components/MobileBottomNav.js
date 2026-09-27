'use client';

import { Home, Compass, List, Search, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSearch } from '@/context/SearchContext';
import { useAuth } from '@/context/AuthContext';

/**
 * PHASE 4 & 5 — MOBILE: Fixed bottom navigation bar.
 * - 5 tabs: Home, Explore, My List, Search, Profile
 * - Only visible on mobile (hidden on md+)
 * - Respects safe-area-inset-bottom for iPhone notch
 * - 44px+ touch targets per Apple HIG
 * - Active tab indicator with matcha glow
 * - Smooth scale animation on tap
 */
const tabs = [
  { name: 'Home',    icon: Home,    href: '/' },
  { name: 'Explore', icon: Compass, href: '/explore' },
  { name: 'My List', icon: List,    href: '/mylist' },
  { name: 'Profile', icon: User,    href: '/profile' },
];

export default function MobileBottomNav() {
  const pathname    = usePathname();
  const { openSearch } = useSearch();
  const { user } = useAuth();

  // Hide on auth, admin, and stream pages (stream has its own fullscreen UI)
  const hide = pathname === '/login'
    || pathname === '/register'
    || pathname?.startsWith('/admin')
    || pathname?.startsWith('/stream');

  if (hide) return null;

  return (
    <nav className="mobile-bottom-nav md:hidden" aria-label="Mobile navigation">
      <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
        {/* Regular tabs */}
        {tabs.map(({ name, icon: Icon, href }) => {
          const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href));
          return (
            <Link
              key={name}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-2 px-3 rounded-2xl transition-all duration-200 active:scale-90 ${
                isActive
                  ? 'text-[#a7c957]'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              aria-label={name}
            >
              <div className={`relative p-1.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-[#a7c957]/15 shadow-[0_0_12px_rgba(167,201,87,0.3)]'
                  : ''
              }`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#a7c957] rounded-full" />
                )}
              </div>
              <span className={`text-[10px] font-bold tracking-wide ${isActive ? 'text-[#a7c957]' : 'text-gray-600'}`}>
                {name}
              </span>
            </Link>
          );
        })}

        {/* Search button */}
        <button
          onClick={openSearch}
          className="flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-2 px-3 rounded-2xl text-gray-500 hover:text-gray-300 transition-all duration-200 active:scale-90"
          aria-label="Search"
        >
          <div className="p-1.5 rounded-xl">
            <Search size={22} strokeWidth={1.8} />
          </div>
          <span className="text-[10px] font-bold tracking-wide text-gray-600">Search</span>
        </button>
      </div>
    </nav>
  );
}
