"use client";
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Save, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminSettings() {
  const { token } = useAuth();
  const [formData, setFormData] = useState({ siteName: '', tagline: '', maintenanceMode: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const timeout = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 5000);

    const fetchSettings = async () => {
      try {
        console.log("Fetching global settings...");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/settings/global`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        console.log("Global settings fetched:", data);
        if (isMounted && data.success && data.settings) {
          setFormData({
            siteName: data.settings.siteName || '',
            tagline: data.settings.tagline || '',
            maintenanceMode: data.settings.maintenanceMode || false
          });
        }
      } catch (err) {
        console.warn('Failed to load settings:', err.message);
        if (isMounted) toast.error('Failed to load settings');
      } finally {
        if (isMounted) {
          console.log("Setting loading to false");
          setLoading(false);
          clearTimeout(timeout);
        }
      }
    };
    fetchSettings();
    return () => { isMounted = false; clearTimeout(timeout); };
  }, []);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/settings/global`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const data = await res.json();
      
      if (data.success) {
        toast.success('Global settings saved successfully!', {
          style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' },
          iconTheme: { primary: '#a7c957', secondary: '#0b0f0a' }
        });
      } else {
        toast.error('Failed to save settings: ' + (data.message || 'Server Error'));
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        toast.error('Save request timed out. Backend might be unreachable.');
      } else {
        toast.error('Network Error: Could not connect to backend');
      }
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
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Global Settings</h1>
        <p className="text-gray-400 mt-1">Manage core platform configurations and operational states.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-8">

        {/* Maintenance Mode Toggle Section */}
        <div className="flex items-center justify-between p-6 bg-red-500/5 border border-red-500/20 rounded-xl">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="text-red-400 w-5 h-5" /> Maintenance Mode
            </h3>
            <p className="text-gray-400 text-sm mt-1 max-w-lg">Lock down the frontend for all standard users. Admins can still access the site to perform necessary maintenance.</p>
          </div>

          {/* Custom Matcha Green Toggle */}
          <label className="relative inline-flex items-center cursor-pointer ml-4">
            <input type="checkbox" className="sr-only peer" checked={formData.maintenanceMode} onChange={(e) => setFormData({...formData, maintenanceMode: e.target.checked})} />
            <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#a7c957] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"></div>
          </label>
        </div>

        {/* Branding Settings */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white">Platform Branding</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400 font-medium">Site Name</label>
              <input type="text" value={formData.siteName} onChange={(e) => setFormData({...formData, siteName: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#a7c957] focus:ring-1 focus:ring-[#a7c957] transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400 font-medium">Global Tagline</label>
              <input type="text" value={formData.tagline} onChange={(e) => setFormData({...formData, tagline: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#a7c957] focus:ring-1 focus:ring-[#a7c957] transition-all" />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6 border-t border-white/10 flex justify-end">
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-[#a7c957] to-[#c2e078] text-[#0b0f0a] font-bold py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(167,201,87,0.3)] hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {saving ? (
              <><div className="w-5 h-5 border-2 border-[#0b0f0a] border-t-transparent rounded-full animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-5 h-5" /> Save Configuration</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
