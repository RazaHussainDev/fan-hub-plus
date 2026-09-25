"use client";
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';

export default function AdminLayout({ children }) {
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
