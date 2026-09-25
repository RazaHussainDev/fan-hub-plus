'use client';

import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminTopbar() {
  const { user } = useAuth();
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'A';

  return (
    <header className="h-20 bg-transparent border-b border-white/5 flex items-center justify-between px-8 z-40 backdrop-blur-sm">
      <div className="flex items-center gap-4 text-gray-400">
        <Search size={20} className="hover:text-[#a7c957] cursor-pointer transition-colors" />
        <span className="text-sm font-medium">Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded-md text-xs">Cmd+K</kbd> to search</span>
      </div>

      <div className="flex items-center gap-6">
        {/* Glowing Notification Bell */}
        <div className="relative cursor-pointer group">
          <Bell size={20} className="text-gray-400 group-hover:text-white transition-colors" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0b0f0a] shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse" />
        </div>

        <div className="w-px h-6 bg-white/10" />

        {/* Admin Avatar */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-white">{user?.name || 'Administrator'}</p>
            <p className="text-xs font-semibold text-[#a7c957] uppercase tracking-wider">Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#a7c957]/30 shadow-[0_0_15px_rgba(167,201,87,0.15)] bg-[#0a0d08] flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} alt="Admin" className="w-full h-full object-cover" />
            ) : (
              <span className="font-black text-[#a7c957]">{initials}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
