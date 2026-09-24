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
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center gap-2 px-4 py-3 bg-white/60 dark:bg-gray-900/80 backdrop-blur-xl border border-white/40 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl rounded-full transition-all duration-300">
        {navItems.map((item, index) => {
          const content = (
            <>
              <span className="shrink-0 group-hover:text-brand-primary transition-colors duration-300">
                {item.icon}
              </span>
              <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-3 whitespace-nowrap font-medium text-sm transition-all duration-300 ease-in-out">
                {item.label}
              </span>
            </>
          );

          const className = "group flex items-center justify-center gap-0 overflow-hidden rounded-full p-3 text-[#1d1d1f] dark:text-gray-300 hover:text-brand-primary hover:bg-gray-200/50 dark:hover:bg-gray-800 transition-all duration-300 ease-in-out";

          if (item.onClick) {
            return (
              <button key={index} onClick={item.onClick} className={className}>
                {content}
              </button>
            );
          }

          return (
            <Link key={index} href={item.href} className={className}>
              {content}
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-4 flex justify-center">
        <AccessibilityControls />
      </div>
    </div>
  );
};

export default FloatingNav;
