'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Compass, 
  Users, 
  BookOpen, 
  Headphones, 
  ShoppingBag, 
  Calendar, 
  MessageSquare, 
  ArrowUp, 
  ShieldCheck, 
  Send, 
  Globe, 
  Radio, 
  Heart,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    toast.success('Subscribed to the Fandom Universe Dispatch!', {
      style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
    });
    setEmail('');
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const fandomCategories = [
    { name: 'Sci-Fi & Cyberpunk', href: '/explore?category=sci-fi' },
    { name: 'Anime & Shonen', href: '/explore?category=anime' },
    { name: 'Fantasy & Mythos', href: '/explore?category=fantasy' },
    { name: 'Superheroes & Comics', href: '/explore?category=superhero' },
    { name: 'Horror & Paranormal', href: '/explore?category=horror' },
    { name: 'Gaming & Esports', href: '/explore?category=gaming' },
    { name: 'Prestige Drama & Cinema', href: '/explore?category=drama' },
    { name: 'Cult & Retro Classics', href: '/explore?category=cult' },
  ];

  const discoveryLinks = [
    { name: 'Character Dossiers', href: '/characters', icon: Users },
    { name: 'Live Watch Party Arena', href: '/live', icon: Radio },
    { name: 'Lore & Theory Articles', href: '/articles', icon: BookOpen },
    { name: 'Soundtrack & Vinyl Lounge', href: '/audio', icon: Headphones },
    { name: 'Collector Drops & Merch', href: '/merchandise', icon: ShoppingBag },
    { name: 'Conventions & Live Events', href: '/events', icon: Calendar },
    { name: 'Interactive Feedback Terminal', href: '/feedback', icon: MessageSquare },
    { name: 'Universal Sitemap & Index', href: '/sitemap', icon: Globe },
  ];

  const communityLinks = [
    { name: 'Submit Lore Article', href: '/articles#submit' },
    { name: 'Propose Character Profile', href: '/characters#submit' },
    { name: 'Fandom Community Guidelines', href: '/articles' },
    { name: 'VIP Creator Privileges', href: '/profile' },
    { name: 'Admin Command Gateway', href: '/admin' },
  ];

  return (
    <footer className="w-full bg-[#080c07] text-gray-300 border-t border-white/10 relative z-10 transition-colors duration-500 overflow-hidden">
      {/* Decorative ambient matcha glow at top edge */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-px bg-gradient-to-r from-transparent via-[#a7c957]/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-[#a7c957]/5 blur-3xl pointer-events-none -z-10" />

      {/* ─────────────────────────────────────────────────────────────
          Tier 1: Newsletter & Dispatch Tier
      ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-12 border-b border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-between">
          <div className="lg:col-span-6 space-y-2">
            <span className="px-3 py-1 rounded-full bg-[#a7c957]/15 border border-[#a7c957]/30 text-[#a7c957] text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a7c957] animate-pulse" />
              Weekly Fandom Dispatch
            </span>
            <h3 className="text-2xl md:text-3xl font-heading font-black text-white tracking-tight">
              Stay immersed in the continuum
            </h3>
            <p className="text-gray-400 text-sm max-w-md">
              Receive hand-curated character drops, festival dates, rare soundtrack releases, and lore deep dives straight to your inbox.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your fan email address..."
                disabled={subscribed}
                className="flex-1 px-5 py-3.5 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#a7c957] focus:ring-1 focus:ring-[#a7c957] text-sm transition-all"
              />
              <button
                type="submit"
                disabled={subscribed}
                className="px-8 py-3.5 rounded-full bg-[#a7c957] text-[#0b0f0a] font-bold text-sm hover:brightness-110 shadow-[0_0_20px_rgba(167,201,87,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 whitespace-nowrap"
              >
                {subscribed ? (
                  <>
                    <CheckCircle2 size={16} /> Subscribed
                  </>
                ) : (
                  <>
                    <Send size={16} /> Subscribe
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          Tier 2: Main Multi-Column Directory Grid
      ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Brand & Live Health */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Fan Hub Plus Logo"
                width={48}
                height={48}
                className="object-contain drop-shadow-[0_0_12px_rgba(167,201,87,0.4)]"
              />
              <div className="flex flex-col">
                <span className="font-heading font-black text-2xl tracking-tight text-white leading-none">
                  FanHub<span className="text-[#a7c957]">+</span>
                </span>
                <span className="text-[10px] font-bold tracking-widest text-[#a7c957] uppercase">
                  Fandom Universe
                </span>
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              The premier unified ecosystem uniting pop culture, anime, cinema, gaming, and collectible lore under one cinematic sky. Built for true fans.
            </p>

            {/* Live Operational Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span className="text-gray-300 font-semibold">All Systems Operational</span>
              <span className="text-gray-500">|</span>
              <span className="text-[#a7c957] font-bold">TMDB Edge Sync</span>
            </div>

            <div className="pt-2 text-xs text-gray-500 font-mono">
              Aptech TechWiz 7 Official Academic Project
            </div>
          </div>

          {/* Column 2: 8 Fandom Categories */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Compass size={16} className="text-[#a7c957]" />
              Universes
            </h4>
            <ul className="space-y-2.5 text-sm">
              {fandomCategories.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-[#a7c957] hover:translate-x-1 transition-all inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Discovery & Experience */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Radio size={16} className="text-[#a7c957]" />
              Experience
            </h4>
            <ul className="space-y-2.5 text-sm">
              {discoveryLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-400 hover:text-[#a7c957] hover:translate-x-1 transition-all flex items-center gap-2"
                    >
                      <Icon size={14} className="text-gray-500" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 4: Community & Creators */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Users size={16} className="text-[#a7c957]" />
              Community
            </h4>
            <ul className="space-y-2.5 text-sm">
              {communityLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-[#a7c957] hover:translate-x-1 transition-all inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://github.com/RazaHussainDev/fan-hub-plus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#a7c957] hover:translate-x-1 transition-all flex items-center gap-1.5"
                >
                  GitHub Repository <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          Tier 3: Section 1.5 Academic Non-Commercial Disclaimer
      ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-12">
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#a7c957]">
            <ShieldCheck size={16} />
            Academic Submission & Fair Use Notice (Section 1.5 Compliance)
          </div>
          <p className="text-xs text-gray-400 leading-relaxed font-sans">
            Fan Hub Plus is an educational non-commercial academic demonstration developed exclusively for the <strong>Aptech TechWiz 7</strong> competition. All intellectual property, characters, posters, audiovisual trailers, and trademarks are the exclusive property of their respective copyright owners (including The Walt Disney Company, Warner Bros. Discovery, Sony Pictures, Toei Animation, MAPPA, Netflix, and respective studios). Audiovisual content and metadata are integrated for academic evaluation purposes using TMDB API under fair-use principles. No commercial transactions or monetization are conducted on this platform.
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          Tier 4: Bottom Copyright & Scroll to Top Bar
          Added ample bottom padding (pb-28 md:pb-24) to avoid dock overlap
      ───────────────────────────────────────────────────────────── */}
      <div className="border-t border-white/5 bg-[#050805]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 pb-28 md:pb-24">
          <div className="text-xs text-gray-400 text-center sm:text-left flex items-center gap-1 flex-wrap justify-center sm:justify-start">
            <span>© 2026 Fan Hub Plus. Engineered with</span>
            <Heart size={13} className="text-[#a7c957] fill-[#a7c957] inline" />
            <span>for universal fandoms.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/sitemap" className="text-xs text-gray-400 hover:text-[#a7c957] transition-colors">
              Sitemap Index
            </Link>
            <Link href="/feedback" className="text-xs text-gray-400 hover:text-[#a7c957] transition-colors">
              Help Terminal
            </Link>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-[#a7c957] hover:text-[#0b0f0a] border border-white/10 text-xs text-gray-300 font-semibold transition-all cursor-pointer active:scale-95 shadow-sm"
              aria-label="Back to Top"
            >
              <span>Back to Top</span>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
