'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  Bell, 
  Menu, 
  X, 
  ExternalLink, 
  LayoutDashboard, 
  Film, 
  Users, 
  Settings, 
  Palette, 
  Shield, 
  FileCheck, 
  MessageSquareCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { name: 'Content Engine', icon: Film, path: '/admin/content' },
  { name: 'Submissions', icon: FileCheck, path: '/admin/submissions' },
  { name: 'Feedback & Bugs', icon: MessageSquareCheck, path: '/admin/feedback' },
  { name: 'Users', icon: Users, path: '/admin/users' },
  { name: 'Brand & UI', icon: Palette, path: '/admin/brand' },
  { name: 'Security', icon: Shield, path: '/admin/security' },
  { name: 'Settings', icon: Settings, path: '/admin/settings' },
];

export default function AdminTopbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'A';

  return (
    <>
      <header className="h-20 bg-transparent border-b border-white/5 flex items-center justify-between px-4 md:px-8 z-40 backdrop-blur-sm">
        {/* Left: Mobile Toggle & Desktop Search */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-xl bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all border border-white/10"
            aria-label="Open Admin Menu"
          >
            <Menu size={20} />
          </button>

          <div className="hidden sm:flex items-center gap-3 text-gray-400">
            <Search size={18} className="hover:text-[#a7c957] cursor-pointer transition-colors" />
            <span className="text-xs md:text-sm font-medium">Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded-md text-xs text-gray-300">Cmd+K</kbd> to search</span>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <span className="font-bold text-sm text-white">Hub<span className="text-[#a7c957]">Admin</span></span>
          </div>
        </div>

        {/* Right: View Live Site & Profile */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Quick link to live public site */}
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#a7c957]/15 border border-white/10 hover:border-[#a7c957]/30 text-gray-300 hover:text-[#a7c957] text-xs font-semibold transition-all"
          >
            <span>Live Site</span>
            <ExternalLink size={12} />
          </Link>

          {/* Glowing Notification Bell */}
          <div className="relative cursor-pointer group p-2 rounded-xl hover:bg-white/5 transition-colors">
            <Bell size={18} className="text-gray-400 group-hover:text-white transition-colors" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#0b0f0a] shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
          </div>

          <div className="w-px h-6 bg-white/10 hidden sm:block" />

          {/* Admin Avatar */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-white">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] font-semibold text-[#a7c957] uppercase tracking-wider">{user?.role === 'superadmin' ? 'Super Admin' : 'Admin'}</p>
            </div>
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl overflow-hidden border border-[#a7c957]/30 shadow-[0_0_15px_rgba(167,201,87,0.15)] bg-[#0a0d08] flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt="Admin" className="w-full h-full object-cover" />
              ) : (
                <span className="font-black text-sm text-[#a7c957]">{initials}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-72 max-w-[85vw] h-full bg-[#0c100a] border-r border-white/10 flex flex-col p-6 z-10 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Image src="/logo.png" alt="Logo" width={28} height={28} className="object-contain" priority={true} />
                  <span className="font-bold text-lg text-white">Hub<span className="text-[#a7c957]">Admin</span></span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 py-6 space-y-1.5 overflow-y-auto">
                {menuItems.map((item) => {
                  const isActive = item.path === '/admin' ? pathname === '/admin' : pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.name}
                      href={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive 
                          ? 'bg-[#a7c957]/15 text-[#a7c957] border border-[#a7c957]/30 shadow-[0_0_15px_rgba(167,201,87,0.15)]' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Bottom Drawer Actions */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <Link
                  href="/"
                  target="_blank"
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <span>Open Public Live Site</span>
                  <ExternalLink size={14} />
                </Link>
                <div className="text-[11px] text-gray-500 text-center">
                  Signed in as <strong className="text-gray-300">{user?.email}</strong>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
