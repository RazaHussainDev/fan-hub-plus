'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Search, List, User, LogIn } from 'lucide-react';
import { useSearch } from '@/context/SearchContext';
import { useAuth } from '@/context/AuthContext';
import AccessibilityControls from './AccessibilityControls';

const FloatingNav = () => {
  const { openSearch } = useSearch();
  const { user } = useAuth();

  const navItems = [
    { label: 'Home', icon: <Home size={22} />, href: '/' },
    { label: 'Search', icon: <Search size={22} />, onClick: openSearch },
    { label: 'My List', icon: <List size={22} />, href: '/mylist' },
    user
      ? {
          label: user.name.split(' ')[0],
          icon: user.avatar
            ? <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
            : (
              <span className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center text-xs font-bold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            ),
          href: '/profile',
        }
      : { label: 'Sign In', icon: <LogIn size={22} />, href: '/login' },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
      {/* Accessibility pill above dock */}
      <AccessibilityControls />

      {/* Rounded Pill Dock */}
      <nav className="flex items-center gap-1 px-3 py-2.5 rounded-full bg-white/70 dark:bg-gray-900/80 backdrop-blur-2xl border border-white/60 dark:border-gray-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300">
        {navItems.map((item, index) => {
          const btnClass = [
            "group relative flex items-center justify-center",
            "rounded-full p-3",
            "text-[#3c3c43]/70 dark:text-gray-400",
            "hover:bg-black/[0.06] dark:hover:bg-white/10",
            "hover:text-brand-primary dark:hover:text-brand-primary",
            "active:scale-90 transition-all duration-200",
          ].join(' ');

          const Tooltip = (
            <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-gray-900/90 dark:bg-white/90 text-white dark:text-gray-900 text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
              {item.label}
            </span>
          );

          if (item.onClick) {
            return (
              <button key={index} onClick={item.onClick} className={btnClass}>
                {Tooltip}
                {item.icon}
              </button>
            );
          }

          return (
            <Link key={index} href={item.href} className={btnClass}>
              {Tooltip}
              {item.icon}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default FloatingNav;
