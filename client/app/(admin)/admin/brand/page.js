"use client";
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Film, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function HeroController() {
  const { token } = useAuth();
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [newId, setNewId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (token) {
      fetch('http://localhost:5000/api/admin/settings/global')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.settings?.featuredMovies) {
            setFeaturedMovies(data.settings.featuredMovies);
          }
        })
        .catch(err => toast.error('Failed to load hero banner settings'))
        .finally(() => setLoading(false));
    }
  }, [token]);

  const handleAdd = () => {
    const trimmedId = newId.trim();
    if (!trimmedId) return;
    if (featuredMovies.includes(trimmedId)) return toast.error("Movie ID already exists in the slider!");
    setFeaturedMovies([...featuredMovies, trimmedId]);
    setNewId('');
  };

  const handleRemove = (idToRemove) => {
    setFeaturedMovies(featuredMovies.filter(id => id !== idToRemove));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/settings/global', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ featuredMovies })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Hero Banner updated successfully!", {
          style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' },
          iconTheme: { primary: '#a7c957', secondary: '#0b0f0a' }
        });
      } else {
        toast.error("Failed to update banner");
      }
    } catch (err) {
      toast.error("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#a7c957]/30 border-t-[#a7c957] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 font-body">
      <div>
        <h1 className="text-3xl font-bold font-heading text-white tracking-tight">Hero Banner Controller</h1>
        <p className="text-gray-400 mt-1">Manage the featured movies shown on the homepage 3D coverflow slider.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Enter TMDB Movie/TV ID (e.g., 299534)" 
            value={newId} 
            onChange={(e) => setNewId(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#a7c957] focus:ring-1 focus:ring-[#a7c957] focus:outline-none transition-all placeholder:text-gray-600" 
          />
          <button 
            onClick={handleAdd} 
            className="bg-[#a7c957] text-[#0b0f0a] px-6 py-3 md:py-0 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 hover:shadow-[0_0_15px_rgba(167,201,87,0.4)] transition-all"
          >
            <Plus size={20} /> Add to Slider
          </button>
        </div>

        <div className="space-y-3 mt-6 relative z-10">
          {featuredMovies.length === 0 ? (
            <div className="text-center py-8 text-gray-500 border border-dashed border-white/10 rounded-xl">
              No movies featured. Add some IDs above!
            </div>
          ) : (
            featuredMovies.map((id, index) => (
              <div key={index} className="flex justify-between items-center bg-black/40 border border-white/5 p-4 rounded-xl hover:border-white/10 transition-colors group">
                <div className="flex items-center gap-3">
                  <Film className="text-[#a7c957]" size={20} />
                  <span className="text-white font-medium">TMDB ID: <span className="text-[#a7c957] ml-1">{id}</span></span>
                </div>
                <button 
                  onClick={() => handleRemove(id)} 
                  className="text-red-400 opacity-50 group-hover:opacity-100 hover:text-red-300 p-2 hover:bg-red-400/10 rounded-lg transition-all"
                  title="Remove from banner"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="pt-6 border-t border-white/10 flex justify-end relative z-10">
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-[#a7c957] to-[#c2e078] text-[#0b0f0a] font-bold py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(167,201,87,0.3)] hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {saving ? (
              <><div className="w-5 h-5 border-2 border-[#0b0f0a] border-t-transparent rounded-full animate-spin" /> Publishing...</>
            ) : (
              <><Save className="w-5 h-5" /> Publish Changes</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
