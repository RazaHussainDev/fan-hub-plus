import React from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function SitemapPage() {
  const sections = [
    { name: 'Home', href: '/' },
    { name: 'Fandom Explorer', href: '/explore' },
    { name: 'Character Dossiers', href: '/characters' },
    { name: 'Featured Articles & Lore', href: '/articles' },
    { name: 'Merchandise & Upcoming Drops', href: '/merchandise' },
    { name: 'Events & Convention Calendar', href: '/events' },
    { name: 'Fandom Audio & Soundtracks', href: '/audio' },
    { name: 'My List', href: '/mylist' },
    { name: 'Search', href: '/search', isAction: true },
    { name: 'Anime Universe', href: '/explore?category=Anime' },
    { name: 'Gaming Legends', href: '/explore?category=Gaming' },
    { name: 'Movies & Cinema', href: '/explore?category=Movies' },
    { name: 'TV Shows & Series', href: '/explore?category=TV%20Shows' },
    { name: 'K-Pop Fandom', href: '/explore?category=K-Pop' },
    { name: 'Comics Multiverse', href: '/explore?category=Comics' },
    { name: 'Manga & Webtoons', href: '/explore?category=Manga' },
    { name: 'Cosplay Showcase', href: '/explore?category=Cosplay' },
    { name: 'User Profile & Dashboard', href: '/profile' },
    { name: 'Feedback & Bug Reports', href: '/feedback' }
  ];

  return (
    <main className="min-h-screen bg-brand-bg text-gray-50 p-6 md:p-12 pb-32 font-body flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <Breadcrumbs />
        
        <header className="mb-12 w-full border-b border-gray-800 pb-6">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-2 tracking-tight drop-shadow-md">
            Sitemap
          </h1>
          <p className="text-gray-400 font-medium">Explore all sections of Fan Hub Plus</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:bg-gray-800 transition-colors">
              <Link 
                href={section.href}
                className="text-lg font-bold text-gray-200 hover:text-brand-primary flex items-center gap-2"
              >
                {section.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
