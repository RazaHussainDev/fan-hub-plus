"use client";
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Search, Download, Film, Tv } from 'lucide-react';

export default function TMDBImporter() {
  const [tmdbId, setTmdbId] = useState('');
  const [mediaType, setMediaType] = useState('movie');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleFetch = async () => {
    if (!tmdbId) return toast.error("Enter a TMDB ID first!");
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/tmdb/fetch/${mediaType}/${tmdbId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('fanhub_token')}` }
      });
      const data = await res.json();
      if (data.success) {
        // Inject mediaType into the preview data so we can use it during import
        setPreview({ ...data.data, media_type: mediaType });
        toast.success("Data fetched successfully!", {
          style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' },
          iconTheme: { primary: '#a7c957', secondary: '#0b0f0a' }
        });
      } else {
        toast.error(data.message || "Failed to fetch from TMDB");
      }
    } catch (err) {
      toast.error("Network error: Could not reach backend");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!preview) return;
    setImporting(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/admin/movies/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('fanhub_token')}`
        },
        body: JSON.stringify(preview)
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success(`${preview.title || preview.name} imported to database!`, {
          style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' },
          iconTheme: { primary: '#a7c957', secondary: '#0b0f0a' }
        });
        setPreview(null);
        setTmdbId('');
      } else {
        toast.error(data.message || "Failed to save to database");
      }
    } catch (err) {
      toast.error("Network error: Could not save to database");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 font-body">
      <div>
        <h1 className="text-3xl font-bold text-white font-heading tracking-tight">TMDB Auto-Importer</h1>
        <p className="text-gray-400 mt-1">Instantly pull high-res metadata from The Movie Database and save it to MongoDB.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6 shadow-2xl">
        <div className="flex gap-4 mb-4">
          <button onClick={() => setMediaType('movie')} className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${mediaType === 'movie' ? 'bg-[#a7c957] text-[#0b0f0a]' : 'bg-black/50 text-gray-400 hover:text-white border border-white/10'}`}>
            <Film size={20}/> Movie
          </button>
          <button onClick={() => setMediaType('tv')} className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${mediaType === 'tv' ? 'bg-[#a7c957] text-[#0b0f0a]' : 'bg-black/50 text-gray-400 hover:text-white border border-white/10'}`}>
            <Tv size={20}/> TV Show
          </button>
        </div>

        <div className="flex gap-4 flex-col sm:flex-row">
          <input 
            type="text" 
            placeholder={`Enter TMDB ID (e.g., ${mediaType === 'movie' ? '299534 for Endgame' : '1399 for Game of Thrones'})`} 
            value={tmdbId} 
            onChange={(e) => setTmdbId(e.target.value)} 
            className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#a7c957] focus:ring-1 focus:ring-[#a7c957] focus:outline-none transition-all" 
          />
          <button 
            onClick={handleFetch} 
            disabled={loading} 
            className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 sm:py-0 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border border-white/10 disabled:opacity-50 disabled:hover:bg-white/10"
          >
            {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Fetching...</> : <><Search size={20} /> Fetch Data</>}
          </button>
        </div>
      </div>

      {/* Premium Preview Card */}
      {preview && (
        <div className="bg-black/40 border border-[#a7c957]/30 rounded-2xl p-6 flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-[0_0_30px_rgba(167,201,87,0.1)]">
          {preview.poster_path ? (
            <img src={`https://image.tmdb.org/t/p/w500${preview.poster_path}`} alt="Poster" className="w-full md:w-48 rounded-xl shadow-lg border border-white/10 object-cover" />
          ) : (
            <div className="w-full md:w-48 h-72 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
              <span className="text-gray-500 font-medium">No Poster</span>
            </div>
          )}
          
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white font-heading">{preview.title || preview.name}</h2>
              <p className="text-[#a7c957] font-medium mt-1">
                {preview.release_date || preview.first_air_date} • Rating: {preview.vote_average?.toFixed(1)}/10
              </p>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{preview.overview || "No description available."}</p>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleImport} 
                disabled={importing}
                className="flex-1 bg-gradient-to-r from-[#a7c957] to-[#c2e078] text-[#0b0f0a] font-bold py-3 px-6 rounded-xl shadow-[0_0_20px_rgba(167,201,87,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
              >
                {importing ? (
                  <><span className="w-5 h-5 border-2 border-[#0b0f0a]/30 border-t-[#0b0f0a] rounded-full animate-spin"></span> Importing...</>
                ) : (
                  <><Download size={20} /> Import to Database</>
                )}
              </button>
              <button 
                onClick={() => setPreview(null)} 
                disabled={importing}
                className="px-6 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl font-medium transition-all disabled:opacity-50"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
