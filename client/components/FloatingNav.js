'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Search, List, LogIn, Grip } from 'lucide-react';
import { useSearch } from '@/context/SearchContext';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import AccessibilityControls from './AccessibilityControls';

const containerVariants = {
  expanded: { 
    transition: { staggerChildren: 0.15, delayChildren: 0.2 } 
  },
  collapsed: { 
    transition: { staggerChildren: 0.15, staggerDirection: -1 } 
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
    x: -80, // Pulls strongly towards the toggle button
    y: 20, // Slight arc
    scale: 0, // completely disappear
    filter: "blur(8px)", 
    transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] } // Very slow and buttery
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
      <motion.div 
        layout
        initial={false}
        className={`fixed z-50 flex items-center p-2 backdrop-blur-2xl border shadow-2xl overflow-hidden
          transition-colors duration-1000
          ${isExpanded 
            ? "bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-white/70 dark:bg-black/50 border-white/60 dark:border-white/10" 
            : "top-6 left-6 rounded-2xl bg-white/90 dark:bg-black/80 border-black/10 dark:border-white/20"
          }`}
        style={{ borderRadius: isExpanded ? 9999 : 24 }} // forces smooth corner rounding
        transition={{ type: "spring", stiffness: 120, damping: 25 }} // Ultra smooth layout transition
      >
        {/* Master Toggle Button (Snake Head) */}
        <motion.button 
          layout
          onClick={() => setIsExpanded(!isExpanded)}
          animate={{
            scale: isExpanded ? 1 : [1, 1.3, 0.8, 1.2, 0.9, 1.1, 1], // The "swallowing" snake game effect
            rotate: isExpanded ? 0 : -90
          }}
          transition={{ duration: isExpanded ? 0.5 : 1.5, ease: "easeInOut" }}
          className={`p-3 z-10 flex items-center justify-center transition-colors duration-500 cursor-pointer
            ${isExpanded 
              ? 'rounded-full bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-brand-primary hover:bg-brand-primary/20 dark:hover:bg-brand-primary/20' 
              : 'rounded-xl bg-brand-primary text-[#0b0f0a] shadow-[0_0_30px_rgba(167,201,87,0.8)]'
            }`}
        >
          <Grip size={22} className={`transition-transform duration-500 ${isExpanded ? 'rotate-0' : '-rotate-90'}`} />
        </motion.button>

        {/* mode="popLayout" allows exiting elements to float absolute while the parent shrinks! */}
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
              {navItems.map((item, index) => {
                const IconWrapper = ({ children }) => (
                  <div className="relative group flex flex-col items-center cursor-pointer">
                    <div className="absolute -top-14 px-3 py-1.5 bg-brand-primary text-[#0b0f0a] text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap backdrop-blur-md scale-90 group-hover:scale-100 shadow-xl">
                      {item.name}
                    </div>
                    <div className="p-3 bg-transparent hover:bg-brand-primary/20 hover:text-brand-primary rounded-full transition-all duration-300 active:scale-90">
                      {children}
                    </div>
                  </div>
                );

                const iconContent = item.isAvatar ? (
                  user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover shadow-sm" />
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-brand-primary text-[#0b0f0a] flex items-center justify-center text-xs font-bold shadow-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )
                ) : (
                  <item.icon size={22} className="text-gray-700 dark:text-gray-300 group-hover:text-brand-primary transition-colors" />
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

      {/* Accessibility controls stay fixed based on state */}
      <div className={`fixed z-40 transition-all duration-1000 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isExpanded ? "bottom-24 left-1/2 -translate-x-1/2" : "bottom-6 left-6"}`}>
        <AccessibilityControls />
      </div>
    </>
  );
};

export default FloatingNav;
