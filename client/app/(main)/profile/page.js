'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { LogOut, User, Mail, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-[#FBFBFD] dark:bg-brand-bg text-[#1d1d1f] dark:text-gray-50 p-6 md:p-12 pb-40 font-body flex flex-col items-center transition-colors duration-500">
      <div className="w-full max-w-2xl">
        <Breadcrumbs />

        {/* Avatar Header */}
        <div className="flex flex-col items-center text-center mt-8 mb-10">
          <div className="w-24 h-24 rounded-full bg-brand-primary flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-brand-primary/30 mb-4">
            {user.avatar
              ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              : user.name.charAt(0).toUpperCase()
            }
          </div>
          <h1 className="text-2xl font-heading font-bold">{user.name}</h1>
          <p className="text-[#86868b] dark:text-gray-400 text-sm mt-1">{user.email}</p>
          <span className="mt-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wide">
            {user.role}
          </span>
        </div>

        {/* Info Card */}
        <div
          className="rounded-3xl p-6 border border-black/[0.07] dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/70 backdrop-blur-2xl mb-4 transition-colors duration-300"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}
        >
          <h2 className="text-sm font-bold text-[#86868b] dark:text-gray-500 uppercase tracking-widest mb-4">Account Info</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-brand-primary/10"><User size={18} className="text-brand-primary" /></div>
              <div>
                <p className="text-xs text-[#86868b] dark:text-gray-500">Full Name</p>
                <p className="font-semibold">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-brand-accent/10"><Mail size={18} className="text-brand-accent" /></div>
              <div>
                <p className="text-xs text-[#86868b] dark:text-gray-500">Email</p>
                <p className="font-semibold">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-green-100 dark:bg-green-900/30"><Shield size={18} className="text-green-600 dark:text-green-400" /></div>
              <div>
                <p className="text-xs text-[#86868b] dark:text-gray-500">Role</p>
                <p className="font-semibold capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-4 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all active:scale-[0.98]"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </main>
  );
}
