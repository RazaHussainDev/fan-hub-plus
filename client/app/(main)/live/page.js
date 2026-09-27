'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Radio, 
  Users, 
  Eye, 
  Heart, 
  Send, 
  Share2, 
  Play, 
  Flame, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Smile, 
  Plus, 
  X, 
  CheckCircle2,
  Tv
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const LIVE_STREAMS = [
  {
    id: 'live-1',
    title: '🔴 Attack on Titan Finale: Ultimate Watchalong & Ending Lore Breakdown',
    host: 'ErenLore_99',
    hostAvatar: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=100&auto=format&fit=crop&q=80',
    category: 'Anime Watchalong',
    viewers: 2840,
    likes: 1940,
    streamUrl: 'https://www.youtube.com/embed/LembwKDo1Dk?autoplay=1&mute=0',
    description: 'Streaming the climax of Shingeki no Kyojin with live fan reactions, chapter comparison, and timeline analysis.'
  },
  {
    id: 'live-2',
    title: '⚡ Marvel Cinematic Universe: Avengers Secret Wars Multiverse Theories Live',
    host: 'StarkIndustries_Archivist',
    hostAvatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=100&auto=format&fit=crop&q=80',
    category: 'Comics & MCU',
    viewers: 1420,
    likes: 890,
    streamUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1',
    description: 'Examining Doctor Doom incursions, Battleworld geography, and X-Men integration theories.'
  },
  {
    id: 'live-3',
    title: '🎮 Cyberpunk 2077: Phantom Liberty 100% Secret Ending Run',
    host: 'Netrunner_V',
    hostAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    category: 'Gaming Live',
    viewers: 940,
    likes: 620,
    streamUrl: 'https://www.youtube.com/embed/LembwKDo1Dk?autoplay=1&mute=1',
    description: 'Full immersive playthrough with commentary on Dogtown lore, Kurt Hansen, and Songbird motives.'
  }
];

const INITIAL_CHAT = [
  { id: 1, user: 'Mikasa_Ackerman', text: 'That ODM gear animation in 4K is breathtaking! 🔥', role: 'VIP Fan', time: '12:02' },
  { id: 2, user: 'LeviCaptain', text: 'Clean cut through the nape. 10/10 adaptation.', role: 'Moderator', time: '12:03' },
  { id: 3, user: 'LoreHunter', text: 'Wait look at the tree in the background, connects to Ymir directly!', role: 'Lorekeeper', time: '12:04' },
  { id: 4, user: 'CyberOtaku', text: 'Soundtrack by Sawano Hiroyuki gives pure goosebumps every single time', role: 'VIP Fan', time: '12:05' }
];

export default function LiveStreamPage() {
  const { user } = useAuth();
  const [activeStream, setActiveStream] = useState(LIVE_STREAMS[0]);
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT);
  const [newMessage, setNewMessage] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(LIVE_STREAMS[0].likes);
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);

  // New Host Stream State
  const [hostData, setHostData] = useState({
    title: '',
    category: 'Anime Watchalong',
    streamUrl: '',
    description: ''
  });

  const chatScrollRef = useRef(null);

  // Auto-scroll chat on new message
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const chatItem = {
      id: Date.now(),
      user: user ? user.name : 'Anonymous Fan',
      text: newMessage.trim(),
      role: user?.role === 'admin' ? 'Admin' : 'VIP Fan',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, chatItem]);
    setNewMessage('');
  };

  const handleSendReaction = (emoji) => {
    const chatItem = {
      id: Date.now(),
      user: user ? user.name : 'Fan Reaction',
      text: emoji,
      role: 'Reaction',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, chatItem]);
  };

  const handleToggleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount(prev => prev - 1);
    } else {
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
      toast.success("Stream liked!", {
        style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
      });
    }
  };

  const handleHostStream = (e) => {
    e.preventDefault();
    if (!hostData.title) return toast.error("Please enter a stream title");

    const newStream = {
      id: `live-${Date.now()}`,
      title: `🔴 ${hostData.title}`,
      host: user ? user.name : 'Community Host',
      hostAvatar: user?.avatar || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=100&auto=format&fit=crop&q=80',
      category: hostData.category,
      viewers: 1,
      likes: 1,
      streamUrl: hostData.streamUrl || 'https://www.youtube.com/embed/LembwKDo1Dk?autoplay=1&mute=0',
      description: hostData.description || 'Live fandom watch party.'
    };

    setActiveStream(newStream);
    setLikesCount(1);
    setIsLiked(true);
    setIsHostModalOpen(false);

    toast.success("Your live watch party is now on air!", {
      style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
    });

    // Post announcement in chat
    setChatMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        user: 'FanHub System',
        text: `🎉 ${newStream.host} just started a new live watch party: "${newStream.title}"! Welcome everyone!`,
        role: 'System',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <main className="min-h-screen bg-[#080c07] text-white pt-24 pb-28 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      
      {/* Ambient Lighting */}
      <div className="absolute top-0 left-1/4 w-[40%] h-[30%] bg-red-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[40%] h-[30%] bg-[#a7c957]/10 blur-[150px] rounded-full pointer-events-none" />

      {/* ─────────────────────────────────────────────────────────────
          1. ARENA TOP BAR & STATS
      ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span>FanHub Live Watch Party Arena</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
            Community Streams & Global Watchalongs
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono">
            <Users size={14} className="text-[#a7c957]" />
            <span><strong>5,200+</strong> Fans Watching</span>
          </div>

          <button
            onClick={() => setIsHostModalOpen(true)}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-xs hover:brightness-110 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Radio size={14} /> Go Live
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN STREAM STAGE & LIVE CHAT SPLIT GRID
      ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Stage: 16:9 Live Video Player (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative w-full aspect-video rounded-3xl bg-black overflow-hidden border border-white/15 shadow-2xl">
            <iframe
              src={activeStream.streamUrl}
              title={activeStream.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Stream Header Info & Controls */}
          <div className="p-6 rounded-3xl bg-[#0b0f0a] border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={activeStream.hostAvatar}
                  alt={activeStream.host}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#a7c957]"
                />
                <div>
                  <h2 className="text-lg sm:text-xl font-heading font-black text-white line-clamp-1">
                    {activeStream.title}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                    <span className="text-white font-bold">{activeStream.host}</span>
                    <span>•</span>
                    <span className="text-[#a7c957] font-semibold">{activeStream.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-red-400 font-mono font-bold">
                      <Eye size={12} /> {activeStream.viewers.toLocaleString()} watching
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleToggleLike}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer active:scale-95 ${
                    isLiked
                      ? 'bg-red-500/20 border-red-500 text-red-400'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Heart size={14} className={isLiked ? 'fill-red-400' : ''} />
                  <span>{likesCount.toLocaleString()}</span>
                </button>

                <button
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Watch party link copied!");
                    }
                  }}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer active:scale-95"
                  title="Share Watch Party"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans pt-2 border-t border-white/10">
              {activeStream.description}
            </p>
          </div>
        </div>

        {/* Right Stage: Interactive Real-Time Live Chat (4 cols) */}
        <div className="lg:col-span-4 h-[580px] lg:h-[680px] rounded-3xl bg-[#0b0f0a] border border-white/10 flex flex-col justify-between overflow-hidden shadow-2xl">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-[#a7c957]" />
              <span className="font-heading font-black text-sm text-white">Live Stream Chat</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Real-time Relay</span>
            </div>
          </div>

          {/* Chat Message Stream */}
          <div ref={chatScrollRef} className="flex-1 p-4 space-y-3 overflow-y-auto scrollbar-hide text-xs">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-[11px]">{msg.user}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      msg.role === 'Admin' ? 'bg-red-500/20 text-red-400' :
                      msg.role === 'Moderator' ? 'bg-[#a7c957]/20 text-[#a7c957]' :
                      msg.role === 'System' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-white/10 text-gray-400'
                    }`}>
                      {msg.role}
                    </span>
                  </div>
                  <span className="text-[9px] text-gray-500 font-mono">{msg.time}</span>
                </div>
                <p className="text-gray-200 text-xs break-words">{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Reaction Bar */}
          <div className="px-3 py-2 border-t border-white/5 flex items-center justify-between gap-1 bg-white/[0.01]">
            {['🔥', '🍿', '⚡', '😱', '❤️', '👏'].map(emoji => (
              <button
                key={emoji}
                onClick={() => handleSendReaction(emoji)}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors text-base cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Chat Message Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-[#080c07] flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Chat as fan..."
              className="flex-1 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#a7c957]"
            />
            <button
              type="submit"
              className="p-2.5 rounded-full bg-[#a7c957] text-[#0b0f0a] hover:brightness-110 transition-transform active:scale-95 cursor-pointer shadow-md"
              aria-label="Send message"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. OTHER ACTIVE COMMUNITY WATCH PARTIES
      ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto mt-12 space-y-4">
        <h3 className="text-lg font-heading font-black text-white flex items-center gap-2">
          <Tv size={18} className="text-[#a7c957]" />
          <span>Switch Watch Party Channels</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {LIVE_STREAMS.map((s) => (
            <div
              key={s.id}
              onClick={() => setActiveStream(s)}
              className={`p-4 rounded-3xl border transition-all cursor-pointer flex items-center gap-4 ${
                activeStream.id === s.id
                  ? 'bg-[#a7c957]/15 border-[#a7c957] shadow-[0_0_20px_rgba(167,201,87,0.15)]'
                  : 'bg-[#0b0f0a] border-white/10 hover:border-white/20'
              }`}
            >
              <img
                src={s.hostAvatar}
                alt={s.host}
                className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-white/15"
              />
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5 text-[10px] text-red-400 font-bold uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  <span>{s.category}</span>
                </div>
                <h4 className="font-bold text-sm text-white line-clamp-1 mt-0.5">{s.title}</h4>
                <div className="text-[11px] text-gray-400 mt-1 font-mono">
                  {s.viewers.toLocaleString()} fans watching
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. GO LIVE / HOST WATCH PARTY MODAL
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isHostModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b0f0a] border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                  <Radio size={18} />
                  <span>Start Live Fan Watch Party</span>
                </div>
                <button onClick={() => setIsHostModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleHostStream} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Party Title</label>
                  <input
                    type="text"
                    required
                    value={hostData.title}
                    onChange={(e) => setHostData({ ...hostData, title: e.target.value })}
                    placeholder="e.g. My Hero Academia Season 7 Episode 1 Reaction"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#a7c957]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Fandom Category</label>
                  <select
                    value={hostData.category}
                    onChange={(e) => setHostData({ ...hostData, category: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#a7c957]"
                  >
                    <option value="Anime Watchalong" className="bg-[#0b0f0a]">Anime Watchalong</option>
                    <option value="Comics & MCU" className="bg-[#0b0f0a]">Comics & MCU</option>
                    <option value="Gaming Live" className="bg-[#0b0f0a]">Gaming Live</option>
                    <option value="Sci-Fi Theories" className="bg-[#0b0f0a]">Sci-Fi Theories</option>
                    <option value="Cinema Discussion" className="bg-[#0b0f0a]">Cinema Discussion</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">YouTube Embed or HLS Stream URL</label>
                  <input
                    type="url"
                    value={hostData.streamUrl}
                    onChange={(e) => setHostData({ ...hostData, streamUrl: e.target.value })}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#a7c957]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Watch Party Description</label>
                  <textarea
                    rows={2}
                    value={hostData.description}
                    onChange={(e) => setHostData({ ...hostData, description: e.target.value })}
                    placeholder="What are you streaming and discussing?"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#a7c957]"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsHostModalOpen(false)}
                    className="flex-1 py-3 rounded-full bg-white/5 text-gray-300 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-full bg-red-600 text-white font-bold text-xs hover:brightness-110 shadow-md"
                  >
                    Go Live Now 🔴
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
