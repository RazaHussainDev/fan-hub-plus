'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Download, 
  X, 
  CheckCircle2, 
  HardDrive, 
  ShieldCheck, 
  Wifi, 
  Layers, 
  Film, 
  Tv, 
  FileCheck,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BASE_IMG_URL } from '@/utils/tmdb';
import toast from 'react-hot-toast';

export default function DownloadModal({ isOpen, onClose, movie }) {
  const [quality, setQuality] = useState('1080p');
  const [audioTrack, setAudioTrack] = useState('original');
  const [subtitle, setSubtitle] = useState('en');
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState('38.4 MB/s');
  const [downloadComplete, setDownloadComplete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setDownloading(false);
      setProgress(0);
      setDownloadComplete(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !movie) return null;

  const title = movie.title || movie.name || 'Fandom Feature';
  const posterUrl = movie.poster_path 
    ? (movie.poster_path.startsWith('http') ? movie.poster_path : `${BASE_IMG_URL}${movie.poster_path}`)
    : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80';

  const type = movie.media_type || (movie.title ? 'movie' : 'tv');

  const qualityOptions = [
    { id: '4k', label: '4K Ultra HD', spec: '2160p HEVC • HDR10 • Dolby Atmos', size: '5.8 GB' },
    { id: '1080p', label: '1080p Full HD', spec: '1080p x264 • 5.1 Surround Sound', size: '1.9 GB', recommended: true },
    { id: '720p', label: '720p Data Saver', spec: '720p H.264 • AAC Stereo', size: '780 MB' }
  ];

  const handleStartDownload = () => {
    setDownloading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(false);
          setDownloadComplete(true);

          // Save to local offline vault index
          try {
            const existing = JSON.parse(localStorage.getItem('fanhub_offline_vault') || '[]');
            const updated = [
              {
                id: movie.id,
                title,
                poster_path: movie.poster_path,
                quality,
                size: qualityOptions.find(q => q.id === quality)?.size || '1.9 GB',
                downloadedAt: new Date().toISOString()
              },
              ...existing.filter(item => String(item.id) !== String(movie.id))
            ];
            localStorage.setItem('fanhub_offline_vault', JSON.stringify(updated));
          } catch (e) {
            console.warn("Could not save to offline vault storage", e);
          }

          // Trigger browser file download (virtual video payload license package)
          try {
            const dummyBlob = new Blob([
              `[FANHUB-OFFLINE-STREAM-PACKAGE]\nTitle: ${title}\nQuality: ${quality}\nFormat: MP4 Encrypted Offline Container\nTimestamp: ${new Date().toISOString()}\nPlayer: FanHub Plus Internal HTML5 Engine`
            ], { type: 'application/octet-stream' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dummyBlob);
            link.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${quality}.fanhub`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } catch (e) {
            console.warn("File download trigger error", e);
          }

          toast.success(`"${title}" saved to your Offline Vault!`, {
            style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
          });
          return 100;
        }

        // Realistic variation in download speeds
        const delta = Math.floor(Math.random() * 15) + 10;
        const currentMB = (Math.random() * 15 + 32).toFixed(1);
        setSpeed(`${currentMB} MB/s`);
        return Math.min(100, prev + delta);
      });
    }, 350);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-[#0b0f0a] border border-white/15 rounded-3xl max-w-lg w-full overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(167,201,87,0.15)] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/5 border border-white/15 text-gray-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close download modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header with Movie Preview */}
        <div className="p-6 border-b border-white/10 flex items-center gap-4 bg-white/[0.02]">
          <div className="w-16 h-24 rounded-xl overflow-hidden relative shrink-0 border border-white/15 shadow-md">
            <Image
              src={posterUrl}
              alt={title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="overflow-hidden">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-[#a7c957]/20 text-[#a7c957] font-bold text-[10px] uppercase tracking-wider">
                {type === 'tv' ? 'Series' : 'Movie'}
              </span>
              <span className="text-xs text-gray-400 font-mono">Offline Package</span>
            </div>
            <h3 className="text-lg font-bold text-white truncate">{title}</h3>
            <p className="text-xs text-gray-400 mt-0.5">Select your stream quality and download for offline viewing.</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Quality Options */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <HardDrive size={14} className="text-[#a7c957]" />
              Video Quality
            </label>
            <div className="grid grid-cols-1 gap-2">
              {qualityOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  disabled={downloading}
                  onClick={() => setQuality(opt.id)}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    quality === opt.id
                      ? 'bg-[#a7c957]/15 border-[#a7c957] shadow-[0_0_15px_rgba(167,201,87,0.15)]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{opt.label}</span>
                      {opt.recommended && (
                        <span className="px-1.5 py-0.5 rounded bg-[#a7c957] text-[#0b0f0a] font-black text-[9px] uppercase">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{opt.spec}</div>
                  </div>
                  <span className="font-mono font-bold text-xs text-[#a7c957]">{opt.size}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Subtitle & Audio Selectors */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400">Audio Track</label>
              <select
                value={audioTrack}
                onChange={(e) => setAudioTrack(e.target.value)}
                disabled={downloading}
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#a7c957]"
              >
                <option value="original" className="bg-[#0b0f0a]">Original (Dolby 5.1)</option>
                <option value="en" className="bg-[#0b0f0a]">English Dub (Stereo)</option>
                <option value="hi" className="bg-[#0b0f0a]">Hindi Dub</option>
                <option value="ja" className="bg-[#0b0f0a]">Japanese Audio</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400">Subtitles</label>
              <select
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                disabled={downloading}
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#a7c957]"
              >
                <option value="en" className="bg-[#0b0f0a]">English (SDH)</option>
                <option value="ur" className="bg-[#0b0f0a]">Urdu / Roman Urdu</option>
                <option value="none" className="bg-[#0b0f0a]">None (Audio Only)</option>
              </select>
            </div>
          </div>

          {/* Download Progress Bar (When Downloading) */}
          {downloading && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Wifi size={13} className="text-[#a7c957] animate-pulse" />
                  Streaming Chunks ({speed})
                </span>
                <span className="font-mono font-bold text-[#a7c957]">{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#a7c957] to-[#8db33f] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-[10px] text-gray-400 flex items-center justify-between pt-0.5">
                <span>Multi-threaded TMDB CDN Relay</span>
                <span>Encrypted HLS Chunks</span>
              </div>
            </div>
          )}

          {/* Download Completed Status Card */}
          {downloadComplete && (
            <div className="p-4 rounded-2xl bg-[#a7c957]/15 border border-[#a7c957]/40 flex items-center gap-3">
              <CheckCircle2 size={24} className="text-[#a7c957] shrink-0" />
              <div>
                <div className="text-white font-bold text-sm">Download Complete & Verified!</div>
                <div className="text-xs text-gray-300">File is stored in your Offline Vault container.</div>
              </div>
            </div>
          )}

          {/* Action Button */}
          {!downloadComplete ? (
            <button
              onClick={handleStartDownload}
              disabled={downloading}
              className="w-full py-3.5 rounded-full bg-[#a7c957] text-[#0b0f0a] font-bold text-sm hover:brightness-110 shadow-[0_0_20px_rgba(167,201,87,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {downloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0b0f0a] border-t-transparent rounded-full animate-spin" />
                  <span>Downloading Offline Package ({progress}%)...</span>
                </>
              ) : (
                <>
                  <Download size={18} />
                  <span>Start High-Speed Download</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex gap-2.5">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Close Window
              </button>
              <button
                onClick={() => {
                  onClose();
                  toast.success("Opening offline player...", {
                    style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
                  });
                }}
                className="flex-1 py-3 rounded-full bg-[#a7c957] text-[#0b0f0a] font-bold text-xs hover:brightness-110 shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play size={14} fill="currentColor" /> Play Offline
              </button>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 font-mono text-center">
            <ShieldCheck size={12} className="text-[#a7c957]" />
            Educational Academic Offline Storage Simulation
          </div>
        </div>
      </motion.div>
    </div>
  );
}
