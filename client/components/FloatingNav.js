'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Search, List, LogIn, Grip } from 'lucide-react';
import { useSearch } from '@/context/SearchContext';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import AccessibilityControls from './AccessibilityControls';

const itemVariants = {
  expanded: { 
    opacity: 1, 
    x: 0, 
    scale: 1, 
    filter: "blur(0px)", 
    display: "flex",
    transition: { type: "spring", stiffness: 250, damping: 25 } 
  },
  collapsed: { 
    opacity: 0, 
    x: -10, 
    scale: 0.8, 
    filter: "blur(4px)", 
    transition: { duration: 0.2 },
    transitionEnd: { display: "none" }
  }
};

const FloatingNav = () => {
  const { openSearch } = useSearch();
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setIsExpanded(false);
      else setIsExpanded(true);
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
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
        <AccessibilityControls />
      </div>

      <motion.div 
        layout
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center p-2 rounded-full bg-white/70 dark:bg-black/50 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.6)] overflow-hidden"
      >
        {/* Toggle Button */}
        <motion.button 
          layout
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-3 rounded-full flex items-center justify-center transition-all duration-500 ease-out z-10 ${isExpanded ? 'bg-black/5 dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-brand-primary' : 'bg-brand-primary text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'}`}
        >
          <Grip size={22} className={`transition-transform duration-500 ${isExpanded ? 'rotate-90' : 'rotate-0'}`} />
        </motion.button>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div 
              layout
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              variants={{
                expanded: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
                collapsed: { transition: { staggerChildren: 0.04, staggerDirection: -1 } }
              }}
              className="flex items-center ml-2 space-x-1 pr-1"
            >
              {navItems.map((item, index) => {
                const IconWrapper = ({ children }) => (
                  <div className="relative group flex flex-col items-center cursor-pointer">
                    <div className="absolute -top-14 px-3 py-1.5 bg-black/90 dark:bg-white/90 text-white dark:text-black text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap backdrop-blur-md scale-90 group-hover:scale-100 shadow-xl">
                      {item.name}
                    </div>
                    <div className="p-3 bg-transparent hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-all duration-300 active:scale-90">
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
                  <item.icon size={22} className="text-gray-700 dark:text-gray-300 group-hover:text-brand-primary dark:group-hover:text-black transition-colors" />
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
    </>
  );
};

export default FloatingNav;
