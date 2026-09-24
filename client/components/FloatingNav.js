'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Search, List, LogIn, Command } from 'lucide-react';
import { useSearch } from '@/context/SearchContext';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import AccessibilityControls from './AccessibilityControls';

const containerVariants = {
  expanded: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  collapsed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
};

const itemVariants = {
  expanded: { opacity: 1, scale: 1, y: 0, display: "flex", transition: { type: "spring", stiffness: 300, damping: 20 } },
  collapsed: { opacity: 0, scale: 0.5, y: -20, transition: { duration: 0.2 }, transitionEnd: { display: "none" } }
};

const FloatingNav = () => {
  const { openSearch } = useSearch();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Search', icon: Search, onClick: openSearch },
    { name: 'My List', icon: List, href: '/mylist' },
    user
      ? {
          name: user.name.split(' ')[0],
          isAvatar: true,
          href: '/profile',
        }
      : { name: 'Sign In', icon: LogIn, href: '/login' },
  ];

  return (
    <>
      <motion.div 
        layout
        initial={false}
        animate={isCollapsed ? "collapsed" : "expanded"}
        className={`fixed z-50 flex items-center p-2 backdrop-blur-xl border border-white/60 dark:border-white/20 shadow-2xl transition-all duration-1000 ease-[cubic-bezier(0.25,0.8,0.25,1)]
          ${isCollapsed 
            ? "top-6 left-6 rounded-2xl bg-white/50 dark:bg-black/50" 
            : "bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-white/70 dark:bg-black/40"
          }`}
      >
        {/* Toggle Button */}
        <motion.button 
          layout
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-3 mr-2 bg-brand-primary text-white rounded-full shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:bg-brand-primary/80 transition-colors duration-300 z-10 cursor-pointer"
        >
          <Command size={22} />
        </motion.button>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div 
              variants={containerVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="flex items-center gap-1"
            >
              {navItems.map((item, index) => {
                const IconWrapper = ({ children }) => (
                  <div className="relative group flex flex-col items-center cursor-pointer">
                    <div className="absolute -top-12 px-3 py-1 bg-gray-900/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap backdrop-blur-md border border-white/10 scale-95 group-hover:scale-100 shadow-lg">
                      {item.name}
                    </div>
                    <div className="p-3 bg-transparent hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors duration-300">
                      {children}
                    </div>
                  </div>
                );

                const iconContent = item.isAvatar ? (
                  user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover shadow-sm" />
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center text-xs font-bold shadow-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )
                ) : (
                  <item.icon size={22} className="text-gray-700 dark:text-gray-300 group-hover:text-brand-primary dark:group-hover:text-white transition-colors" />
                );

                if (item.onClick) {
                  return (
                    <motion.button key={index} variants={itemVariants} layout onClick={item.onClick}>
                      <IconWrapper>{iconContent}</IconWrapper>
                    </motion.button>
                  );
                }

                return (
                  <motion.div key={index} variants={itemVariants} layout>
                    <Link href={item.href}>
                      <IconWrapper>{iconContent}</IconWrapper>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Optional: Position Accessibility controls dynamically based on dock state */}
      <div className={`fixed z-40 transition-all duration-1000 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isCollapsed ? "top-6 right-6" : "bottom-24 left-1/2 -translate-x-1/2"}`}>
        <AccessibilityControls />
      </div>
    </>
  );
};

export default FloatingNav;
