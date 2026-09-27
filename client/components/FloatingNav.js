'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Search, 
  List, 
  LogIn, 
  Settings, 
  Compass, 
  Users, 
  BookOpen, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  Grip,
  ShoppingBag, 
  Calendar, 
  Headphones, 
  MessageSquare,
  Radio,
  ChevronRight
} from 'lucide-react';
import { useSearch } from '@/context/SearchContext';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  expanded: { 
    transition: { staggerChildren: 0.08, delayChildren: 0.1 } 
  },
  collapsed: { 
    transition: { staggerChildren: 0.06, staggerDirection: -1 } 
  }
};

const itemVariants = {
  expanded: { 
    opacity: 1, 
    x: 0,
    y: 0, 
    scale: 1, 
    filter: "blur(0px)", 
    transition: { type: "spring", stiffness: 200, damping: 20 } 
  },
  collapsed: { 
    opacity: 0, 
    x: -60, 
    y: 15, 
    scale: 0, 
    filter: "blur(6px)", 
    transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] } 
  }
};

export default function FloatingNav() {
  const { openSearch } = useSearch();
  const { user } = useAuth();
  const pathname = usePathname();

  const [isDark, setIsDark] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [mounted, setMounted] = useState(false);

  // Do not render floating dock on auth portals or admin command center
  const isAuthOrAdminPage = pathname === '/login' || pathname === '/register' || pathname?.startsWith('/admin');
  if (isAuthOrAdminPage) {
    return null;
  }

  // Synchronize theme on mount
  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme');
    const savedFontSize = parseInt(localStorage.getItem('fanhub_font_size') || '16', 10);
    const html = document.documentElement;

    if (storedTheme === 'light') {
      html.classList.remove('dark');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      setIsDark(true);
    }

    setFontSize(savedFontSize);
    document.documentElement.style.fontSize = `${savedFontSize}px`;

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const changeFontSize = (delta) => {
    const newSize = Math.max(12, Math.min(22, fontSize + delta));
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
    localStorage.setItem('fanhub_font_size', newSize.toString());
  };

  const desktopNavItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Explore', icon: Compass, href: '/explore' },
    { name: 'Characters', icon: Users, href: '/characters' },
    { name: 'Articles', icon: BookOpen, href: '/articles' },
    { name: 'Logo', isLogo: true, href: '/' },
    { name: 'My List', icon: List, href: '/mylist' },
    { name: 'Search', icon: Search, onClick: openSearch },
  ];

  const mobileDrawerLinks = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Fandom Explorer', icon: Compass, href: '/explore', badge: '8 Categories' },
    { name: 'Character Dossiers', icon: Users, href: '/characters' },
    { name: 'Lore & Articles', icon: BookOpen, href: '/articles' },
    { name: 'My Collection', icon: List, href: '/mylist' },
    { name: 'Merchandise Showcase', icon: ShoppingBag, href: '/merchandise' },
    { name: 'Events & Conventions', icon: Calendar, href: '/events' },
    { name: 'Live Watch Arena', icon: Radio, href: '/live', badge: 'LIVE 🔴' },
    { name: 'Audio & Soundtracks', icon: Headphones, href: '/audio' },
    { name: 'Feedback & Queries', icon: MessageSquare, href: '/feedback' },
  ];

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. MOBILE TOP HEADER (Screen width < md)
          Slim bar: Logo + Brand name | Right: Search, Theme, Menu
      ───────────────────────────────────────────────────────────── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 safe-top">
        <div className="h-14 px-4 bg-[#0b0f0a]/95 dark:bg-[#0b0f0a]/95 backdrop-blur-2xl border-b border-white/8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 active:opacity-70 transition-opacity">
            <Image
              src="/logo.png"
              alt="Fan Hub Plus"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
            <span className="font-heading font-black text-base tracking-tight text-white leading-none">
              FanHub<span className="text-[#a7c957]">+</span>
            </span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={openSearch}
              className="w-10 h-10 rounded-full text-gray-300 flex items-center justify-center active:bg-white/10 transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full text-gray-300 flex items-center justify-center active:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10 rounded-full bg-[#a7c957]/10 border border-[#a7c957]/30 text-[#a7c957] flex items-center justify-center active:scale-90 transition-all"
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. MOBILE SLIDE-OVER NAVIGATION DRAWER
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="bg-[#0b0f0a] border-t border-white/15 rounded-t-[32px] w-full max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Top Handle */}
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto" />

              {/* User Profile Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                {user ? (
                  <Link 
                    href="/profile" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3"
                  >
                    <div className="w-11 h-11 rounded-full bg-[#a7c957]/20 border border-[#a7c957]/40 flex items-center justify-center text-[#a7c957] font-bold text-lg">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm flex items-center gap-1.5">
                        {user.name}
                        {user.role === 'admin' && (
                          <span className="px-1.5 py-0.2 rounded bg-[#a7c957]/20 text-[#a7c957] text-[10px] font-bold uppercase">
                            Admin
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">View Fandom Profile</span>
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <div className="text-white font-bold text-sm">Welcome, Fan!</div>
                      <div className="text-xs text-gray-400">Join the universal fandom hub</div>
                    </div>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#a7c957] text-[#0b0f0a] text-xs font-bold shadow-md"
                    >
                      <LogIn size={14} /> Sign In
                    </Link>
                  </div>
                )}

                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#a7c957] text-xs font-bold flex items-center gap-1"
                  >
                    <Settings size={14} /> Panel
                  </Link>
                )}
              </div>

              {/* Navigation Links Grid */}
              <div className="grid grid-cols-1 gap-1.5">
                {mobileDrawerLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                        isActive
                          ? 'bg-[#a7c957]/15 text-[#a7c957] border border-[#a7c957]/30'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isActive ? 'bg-[#a7c957] text-[#0b0f0a]' : 'bg-white/5 text-gray-400'}`}>
                          <Icon size={18} />
                        </div>
                        <span className="font-semibold text-sm">{link.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {link.badge && (
                          <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] text-gray-300 font-medium">
                            {link.badge}
                          </span>
                        )}
                        <ChevronRight size={16} className="text-gray-600" />
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Accessibility Font Size & Theme Row */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                <span className="font-medium">Text Sizing:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => changeFontSize(-1)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono font-bold"
                  >
                    A-
                  </button>
                  <span className="text-white font-bold font-mono">{fontSize}px</span>
                  <button
                    onClick={() => changeFontSize(1)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono font-bold"
                  >
                    A+
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          3. DESKTOP FLOATING DOCK (Screen width >= md)
          9-dot Snake Collapse/Expand + Prominent Logo + Integrated Theme
      ───────────────────────────────────────────────────────────── */}
      <motion.nav 
        layout
        initial={false}
        className={`hidden md:flex fixed z-40 items-center p-2 backdrop-blur-2xl border shadow-2xl overflow-hidden
          transition-colors duration-700
          ${isExpanded 
            ? "bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-white/85 dark:bg-[#0b0f0a]/90 border-black/10 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3),0_0_25px_rgba(167,201,87,0.18)]" 
            : "top-6 left-6 rounded-2xl bg-white/95 dark:bg-[#0b0f0a]/95 border-black/15 dark:border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
          }`}
        style={{ borderRadius: isExpanded ? 9999 : 20 }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
        aria-label="Desktop Fandom Navigation"
      >
        {/* Master Toggle Button (9-Dot Snake Head) */}
        <motion.button 
          layout
          onClick={() => setIsExpanded(!isExpanded)}
          animate={{
            scale: isExpanded ? 1 : [1, 1.3, 0.8, 1.2, 0.9, 1.1, 1],
            rotate: isExpanded ? 0 : -90
          }}
          transition={{ duration: isExpanded ? 0.4 : 1.2, ease: "easeInOut" }}
          title={isExpanded ? "Collapse Navigation" : "Expand Navigation"}
          className={`p-3 z-10 flex items-center justify-center transition-colors duration-300 cursor-pointer
            ${isExpanded 
              ? 'rounded-full bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:text-[#a7c957] hover:bg-[#a7c957]/20' 
              : 'rounded-xl bg-[#a7c957] text-[#0b0f0a] shadow-[0_0_25px_rgba(167,201,87,0.7)]'
            }`}
        >
          <Grip size={20} className={`transition-transform duration-500 ${isExpanded ? 'rotate-0' : '-rotate-90'}`} />
        </motion.button>

        <AnimatePresence initial={false} mode="popLayout">
          {isExpanded && (
            <motion.div 
              layout
              variants={containerVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="flex items-center ml-2 space-x-1 pr-1"
            >
              {desktopNavItems.map((item) => {
                if (item.isLogo) {
                  return (
                    <motion.div key="logo" variants={itemVariants} layout className="mx-2">
                      <Link 
                        href="/" 
                        className="group flex items-center justify-center hover:scale-105 transition-transform"
                        title="Fan Hub Plus Home"
                      >
                        <Image
                          src="/logo.png"
                          alt="Fan Hub Plus Logo"
                          width={82}
                          height={36}
                          className="object-contain drop-shadow-[0_0_12px_rgba(167,201,87,0.35)]"
                          priority
                        />
                      </Link>
                    </motion.div>
                  );
                }

                const Icon = item.icon;
                const isActive = pathname === item.href;

                const IconWrapper = ({ children, tooltip }) => (
                  <div className="relative group flex flex-col items-center">
                    <div className="absolute -top-12 px-2.5 py-1 bg-[#a7c957] text-[#0b0f0a] text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg scale-90 group-hover:scale-100 z-50">
                      {tooltip}
                    </div>
                    <div className={`p-3 rounded-full transition-all duration-300 active:scale-95 ${
                      isActive 
                        ? 'text-[#a7c957] bg-[#a7c957]/20 shadow-[0_0_15px_rgba(167,201,87,0.3)]' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-[#a7c957] hover:bg-white/10 dark:hover:bg-white/5'
                    }`}>
                      {children}
                      {isActive && (
                        <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#a7c957] rounded-full" />
                      )}
                    </div>
                  </div>
                );

                if (item.onClick) {
                  return (
                    <motion.button key={item.name} variants={itemVariants} layout onClick={item.onClick}>
                      <IconWrapper tooltip={item.name}>
                        <Icon size={20} />
                      </IconWrapper>
                    </motion.button>
                  );
                }

                return (
                  <motion.div key={item.name} variants={itemVariants} layout>
                    <Link href={item.href}>
                      <IconWrapper tooltip={item.name}>
                        <Icon size={20} />
                      </IconWrapper>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Divider */}
              <motion.div variants={itemVariants} layout className="w-px h-6 bg-black/10 dark:bg-white/10 mx-1" />

              {/* Integrated Theme Toggle */}
              <motion.button
                variants={itemVariants}
                layout
                onClick={toggleTheme}
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className="relative group flex flex-col items-center"
              >
                <div className="absolute -top-12 px-2.5 py-1 bg-[#a7c957] text-[#0b0f0a] text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg scale-90 group-hover:scale-100 z-50">
                  {isDark ? "Light Mode" : "Dark Mode"}
                </div>
                <div className="p-3 rounded-full text-gray-700 dark:text-gray-300 hover:text-[#a7c957] hover:bg-[#a7c957]/15 transition-all duration-300 active:scale-95">
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </div>
              </motion.button>

              {/* Admin Command Link (if admin) */}
              {user?.role === 'admin' && (
                <motion.div variants={itemVariants} layout>
                  <Link
                    href="/admin"
                    title="Admin Command Center"
                    className="relative group flex flex-col items-center"
                  >
                    <div className="absolute -top-12 px-2.5 py-1 bg-[#a7c957] text-[#0b0f0a] text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg scale-90 group-hover:scale-100 z-50">
                      Admin Panel
                    </div>
                    <div className={`p-3 rounded-full transition-all duration-300 ${
                      pathname.startsWith('/admin')
                        ? 'text-[#a7c957] bg-[#a7c957]/20 shadow-[0_0_15px_rgba(167,201,87,0.3)]'
                        : 'text-gray-700 dark:text-gray-300 hover:text-[#a7c957] hover:bg-white/10'
                    }`}>
                      <Settings size={20} />
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* User Profile Avatar / Sign In */}
              <motion.div variants={itemVariants} layout>
                {user ? (
                  <Link
                    href="/profile"
                    title={`Profile: ${user.name}`}
                    className="ml-1 pl-1 pr-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 hover:bg-[#a7c957]/20 border border-black/10 dark:border-white/10 flex items-center gap-2 transition-all duration-300"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#a7c957] text-[#0b0f0a] flex items-center justify-center font-bold text-xs shadow-sm overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200 max-w-[80px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    title="Sign In"
                    className="ml-1 px-4 py-2 rounded-full bg-[#a7c957] text-[#0b0f0a] font-bold text-xs hover:brightness-110 transition-all shadow-[0_0_15px_rgba(167,201,87,0.3)] flex items-center gap-1.5"
                  >
                    <LogIn size={15} /> Sign In
                  </Link>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
