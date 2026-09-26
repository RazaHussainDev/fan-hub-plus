"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { user, isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'admin' && user.role !== 'superadmin') {
        toast.error("Unauthorized Area", { style: { background: '#0b0f0a', color: '#ef4444', border: '1px solid #ef4444' } });
        router.push('/');
      }
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || !user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return (
      <div className="h-screen w-full bg-[#0b0f0a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#a7c957]/30 border-t-[#a7c957] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0b0f0a] text-[#f3f4f6] overflow-hidden selection:bg-[#a7c957]/30 font-body">
      <AdminSidebar />
      <div className="flex flex-col flex-1 relative overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-hide">
          {children}
        </main>
      </div>
    </div>
  );
}
