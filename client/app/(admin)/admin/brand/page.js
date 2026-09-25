"use client";
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Upload, Zap, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function HeroController() {
  const { token } = useAuth();
  const [customHero, setCustomHero] = useState({ 
    isActive: false, 
    title: '', 
    description: '', 
    imageUrl: '', 
    buttonText: 'Watch Now', 
    buttonLink: '/' 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/settings/global')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings?.customHero) {
          setCustomHero(data.settings.customHero);
        }
      })
      .catch(err => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomHero({ ...customHero, imageUrl: reader.result }); // Save as Base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/settings/global', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ customHero })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Server rejected the request');
      }

      toast.success("Hero Banner settings updated successfully!", {
        style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' },
        iconTheme: { primary: '#a7c957', secondary: '#0b0f0a' }
      });
    } catch (err) {
      console.error("Save Error:", err);
      toast.error(err.message || "Something went wrong while saving!");
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
        <p className="text-gray-400 mt-1">Control the main homepage banner. Auto-fetches TMDB Trending by default.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-8 shadow-2xl relative overflow-hidden">
        {/* Manual Override Toggle */}
        <div className="flex justify-between items-center bg-[#a7c957]/10 border border-[#a7c957]/20 p-6 rounded-xl relative z-10">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2"><Zap className="text-[#a7c957] w-5 h-5"/> Manual Override</h3>
            <p className="text-gray-400 text-sm mt-1">Enable this to hide TMDB trending and show your custom banner below.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={customHero.isActive} onChange={(e) => setCustomHero({...customHero, isActive: e.target.checked})} />
            <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#a7c957] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"></div>
          </label>
        </div>

        {/* Custom Banner Form (Only visible if active) */}
        {customHero.isActive && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium">Custom Heading / Title</label>
                <input type="text" value={customHero.title} onChange={e => setCustomHero({...customHero, title: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#a7c957] focus:ring-1 focus:ring-[#a7c957] focus:outline-none transition-all" placeholder="e.g. Aptech Techwiz 7 Special" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium">Button Link</label>
                <input type="text" value={customHero.buttonLink} onChange={e => setCustomHero({...customHero, buttonLink: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#a7c957] focus:ring-1 focus:ring-[#a7c957] focus:outline-none transition-all" placeholder="e.g. /category/techwiz" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400 font-medium">Description</label>
              <textarea value={customHero.description} onChange={e => setCustomHero({...customHero, description: e.target.value})} className="w-full h-24 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#a7c957] focus:ring-1 focus:ring-[#a7c957] focus:outline-none transition-all" placeholder="Description for the banner..."></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400 font-medium">Custom Background Image</label>
              <div className="flex items-center gap-4">
                {customHero.imageUrl ? (
                  <img src={customHero.imageUrl} alt="Preview" className="w-32 h-20 object-cover rounded-lg border border-[#a7c957]" />
                ) : (
                  <div className="w-32 h-20 bg-black/50 rounded-lg flex items-center justify-center border border-white/10"><ImageIcon className="text-gray-500"/></div>
                )}
                <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
                  <Upload size={16}/> Upload Image
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-white/10 flex justify-end relative z-10">
          <button onClick={handleSave} className="bg-gradient-to-r from-[#a7c957] to-[#c2e078] text-[#0b0f0a] font-bold py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(167,201,87,0.3)] hover:scale-105 transition-all">
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
