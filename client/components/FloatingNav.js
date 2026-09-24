'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Search, List, User } from 'lucide-react';
import { useSearch } from '@/context/SearchContext';
import AccessibilityControls from './AccessibilityControls';

const FloatingNav = () => {
  const { openSearch } = useSearch();

  const navItems = [
    { label: 'Home', icon: <Home size={20} />, href: '/' },
    { label: 'Search', icon: <Search size={20} />, onClick: openSearch },
    { label: 'My List', icon: <List size={20} />, href: '/mylist' },
    { label: 'Profile', icon: <User size={20} />, href: '/profile' },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
      {/* Accessibility Controls above dock */}
      <AccessibilityControls />

      {/* Main macOS-style Dock */}
      <nav
        style={{
          background: 'rgba(255,255,255,0.72)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(0,0,0,0.06) inset',
        }}
        className="flex items-center gap-1 px-3 py-2 rounded-2xl backdrop-blur-[30px] border border-white/60 dark:border-gray-700/60 dark:!bg-gray-900/80 dark:!shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-300"
      >
        {navItems.map((item, index) => {
          const btnClass = [
            "group flex flex-col items-center justify-center gap-1 rounded-xl px-4 py-2.5 min-w-[52px]",
            "text-[#3c3c43]/80 dark:text-gray-400",
            "hover:bg-black/[0.04] dark:hover:bg-white/10",
            "hover:text-[#1d1d1f] dark:hover:text-white",
            "active:scale-95 transition-all duration-200",
          ].join(' ');

          const content = (
            <>
              <span className="group-hover:text-brand-primary transition-colors duration-200">
                {item.icon}
              </span>
              <span className="text-[10px] font-medium tracking-tight">
                {item.label}
              </span>
            </>
          );

          if (item.onClick) {
            return (
              <button key={index} onClick={item.onClick} className={btnClass}>
                {content}
              </button>
            );
          }

          return (
            <Link key={index} href={item.href} className={btnClass}>
              {content}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default FloatingNav;
