'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { LayoutDashboard, Film, Users, Settings, Palette, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { name: 'Content Engine', icon: Film, path: '/admin/content' },
  { name: 'Users', icon: Users, path: '/admin/users' },
  { name: 'Brand & UI', icon: Palette, path: '/admin/brand' },
  { name: 'Security', icon: Shield, path: '/admin/security' },
  { name: 'Settings', icon: Settings, path: '/admin/settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col border-r border-white/5 bg-[#0b0f0a]/80 backdrop-blur-2xl z-50">
      <div className="h-20 flex items-center px-8 border-b border-white/5">
        <Image src="/logo.png" alt="Fan Hub Plus Logo" width={32} height={32} className="mr-3 object-contain" />
        <span className="font-bold text-xl tracking-tight text-white">Hub<span className="text-[#a7c957]">Admin</span></span>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        {menuItems.map((item) => {
          // If the path is precisely '/admin', only match exact. For others, match subroutes.
          const isActive = item.path === '/admin' ? pathname === '/admin' : pathname.startsWith(item.path);
          return (
            <Link key={item.name} href={item.path} className="relative block">
              {isActive && (
                <motion.div layoutId="admin-active-pill" className="absolute inset-0 bg-[#a7c957]/10 rounded-xl border border-[#a7c957]/20" transition={{ type: "spring", stiffness: 300, damping: 20 }} />
              )}
              <div className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 z-10 ${isActive ? 'text-[#a7c957]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="font-medium">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
