"use client";
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Search, Database, Film, Tv, Eye, EyeOff, PlusCircle } from 'lucide-react';

export default function ContentEngine() {
  const [activeTab, setActiveTab] = useState('library'); // 'library' or 'search'

  // Library State
  const [dbMovies, setDbMovies] = useState([]);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaType, setMediaType] = useState('movie');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load Library
  const fetchLibrary = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/movies/library`, { headers: { Authorization: `Bearer ${localStorage.getItem('fanhub_token')}` }});
      const data = await res.json();
      if (data.success) setDbMovies(data.movies);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (activeTab === 'library') fetchLibrary();
  }, [activeTab]);

  // TMDB Name Search
  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/tmdb/search/${mediaType}/${searchQuery}`, { headers: { Authorization: `Bearer ${localStorage.getItem('fanhub_token')}` }});
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.results);
        if (data.results.length === 0) toast.error("No results found.");
      }
    } catch (err) {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  // Import to Database
  const handleImport = async (item) => {
    try {
      const payload = { ...item, media_type: mediaType };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/movies/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('fanhub_token')}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`${item.title || item.name} imported successfully!`, {
          style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' },
          iconTheme: { primary: '#a7c957', secondary: '#0b0f0a' }
        });
        setActiveTab('library'); // Switch back to library to see it
      } else {
        toast.error(data.message || "Import failed");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  // Toggle Revoke/Publish
  const toggleStatus = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/movies/${id}/toggle`, { method: 'PATCH', headers: { Authorization: `Bearer ${localStorage.getItem('fanhub_token')}` }});
      if (res.ok) {
         fetchLibrary(); // Refresh list
         toast.success("Visibility updated!", {
           style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' },
           iconTheme: { primary: '#a7c957', secondary: '#0b0f0a' }
         });
      }
    } catch (err) { toast.error("Failed to update status"); }
  };

  return (
    <div className="max-w-6xl space-y-8 font-body">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight font-heading">Content Engine</h1>
          <p className="text-gray-400 mt-1">Manage your dynamic streaming library and import new titles.</p>
        </div>
        <div className="flex bg-black/50 border border-white/10 rounded-xl p-1">
          <button onClick={() => setActiveTab('library')} className={`px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition-all ${activeTab === 'library' ? 'bg-[#a7c957] text-[#0b0f0a]' : 'text-gray-400 hover:text-white'}`}>
            <Database size={18}/> My Library
          </button>
          <button onClick={() => setActiveTab('search')} className={`px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition-all ${activeTab === 'search' ? 'bg-[#a7c957] text-[#0b0f0a]' : 'text-gray-400 hover:text-white'}`}>
            <PlusCircle size={18}/> Add New
          </button>
        </div>
      </div>

      {activeTab === 'search' && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl">
          <div className="flex gap-4 mb-4">
            <button onClick={() => setMediaType('movie')} className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${mediaType === 'movie' ? 'bg-[#a7c957] text-[#0b0f0a]' : 'bg-black/50 text-gray-400 hover:text-white border border-white/10'}`}>
              <Film size={20}/> Movie
            </button>
            <button onClick={() => setMediaType('tv')} className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${mediaType === 'tv' ? 'bg-[#a7c957] text-[#0b0f0a]' : 'bg-black/50 text-gray-400 hover:text-white border border-white/10'}`}>
              <Tv size={20}/> TV Show
            </button>
          </div>

          <div className="flex gap-4">
            <input type="text" placeholder={`Search ${mediaType === 'movie' ? 'movie' : 'TV show'} name (e.g., Avengers)...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#a7c957] focus:ring-1 focus:ring-[#a7c957] focus:outline-none transition-all" />
            <button onClick={handleSearch} disabled={loading} className="bg-gradient-to-r from-[#a7c957] to-[#c2e078] text-[#0b0f0a] px-8 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100">
              {loading ? <><span className="w-5 h-5 border-2 border-[#0b0f0a]/30 border-t-[#0b0f0a] rounded-full animate-spin"></span> Searching</> : <><Search size={20}/> Search</>}
            </button>
          </div>

          {/* TMDB Search Results Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 pt-4">
            {searchResults.map(item => (
              <div key={item.id} className="bg-black/40 border border-white/5 rounded-xl overflow-hidden group hover:border-[#a7c957]/50 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(167,201,87,0.15)] flex flex-col">
                <div className="relative aspect-[2/3] w-full">
                  <img src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'} alt={item.title || item.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-[#a7c957] border border-white/10">
                    {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
                  </div>
                </div>
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between bg-black/80">
                  <h3 className="text-white font-bold text-sm line-clamp-2" title={item.title || item.name}>{item.title || item.name}</h3>
                  <button onClick={() => handleImport(item)} className="w-full py-2 bg-white/10 hover:bg-[#a7c957] hover:text-black text-white rounded-lg text-sm font-bold transition-all mt-2">
                    Import
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'library' && (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          {dbMovies.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <Database size={48} className="mx-auto text-gray-600" />
              <p className="text-gray-400 font-medium">Your library is currently empty. Switch to "Add New" to import titles.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-black/60 text-gray-400 text-sm border-b border-white/10">
                  <tr>
                    <th className="p-4 font-bold tracking-wider">TITLE</th>
                    <th className="p-4 font-bold tracking-wider text-center">TYPE</th>
                    <th className="p-4 font-bold tracking-wider text-center">STATUS</th>
                    <th className="p-4 font-bold tracking-wider text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-black/30">
                  {dbMovies.map(movie => (
                    <tr key={movie._id} className="hover:bg-white/5 transition-all">
                      <td className="p-4 flex items-center gap-4">
                        {movie.posterPath ? (
                          <img src={`https://image.tmdb.org/t/p/w200${movie.posterPath}`} alt={movie.title} className="w-12 h-16 rounded-md object-cover shadow border border-white/10" />
                        ) : (
                          <div className="w-12 h-16 rounded-md bg-white/5 border border-white/10 flex items-center justify-center"><Film size={16} className="text-gray-600"/></div>
                        )}
                        <div>
                          <span className="text-white font-bold block">{movie.title}</span>
                          <span className="text-xs text-gray-500">{movie.releaseDate}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-gray-400 uppercase text-xs font-bold tracking-widest bg-white/5 px-2 py-1 rounded-md">{movie.mediaType || 'movie'}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border ${movie.isPublished ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                          {movie.isPublished ? 'Live' : 'Revoked'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => toggleStatus(movie._id)} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 transition-all border border-white/5 hover:border-white/20" title={movie.isPublished ? "Revoke (Hide)" : "Publish (Show)"}>
                          {movie.isPublished ? <EyeOff size={18} className="text-red-400"/> : <Eye size={18} className="text-[#a7c957]"/>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
