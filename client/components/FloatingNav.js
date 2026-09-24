import React from 'react';
import Link from 'next/link';
import { Home, Search, List, User } from 'lucide-react';

const FloatingNav = () => {
  const navItems = [
    { label: 'Home', icon: <Home size={20} />, href: '/' },
    { label: 'Search', icon: <Search size={20} />, href: '/search' },
    { label: 'My List', icon: <List size={20} />, href: '/my-list' },
    { label: 'Profile', icon: <User size={20} />, href: '/profile' },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-2xl">
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="group flex items-center justify-center gap-0 overflow-hidden rounded-full p-3 text-gray-300 hover:text-white hover:bg-brand-primary/20 transition-all duration-300 ease-in-out"
          >
            <span className="shrink-0 group-hover:text-brand-primary transition-colors duration-300">
              {item.icon}
            </span>
            <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-3 whitespace-nowrap font-medium text-sm transition-all duration-300 ease-in-out">
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default FloatingNav;
