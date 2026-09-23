export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen w-full bg-gray-950 text-white">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4">
        <h2 className="text-xl font-bold font-heading text-indigo-400 mb-6">Admin Sidebar</h2>
        <nav className="flex flex-col gap-2">
          <div className="p-2 bg-gray-800 rounded">Dashboard</div>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
