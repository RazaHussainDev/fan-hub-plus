'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumbs from '@/components/Breadcrumbs';
import { 
  BookOpen, Search, Plus, Clock, Eye, Heart, 
  Send, X, CheckCircle, Tag, Calendar, User, ArrowRight, Share2 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Anime', 'Gaming', 'Movies', 'TV Shows', 'Comics', 'Manga', 'Cosplay'];

export default function ArticlesPage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Reader Modal State
  const [activeArticle, setActiveArticle] = useState(null);

  // Submit Modal State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'Anime',
    fandom: '',
    coverImage: '',
    tags: ''
  });

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/fandom/articles?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setArticles(data.results || []);
      }
    } catch (err) {
      console.error('Articles fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchArticles, 150);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  const handleOpenArticle = async (art) => {
    setActiveArticle(art);
    try {
      const backendBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await fetch(`${backendBase}/api/fandom/articles/${art._id}`);
      setArticles(prev => prev.map(a => a._id === art._id ? { ...a, views: (a.views || 0) + 1 } : a));
    } catch (e) {}
  };

  const handleSubmitFanArticle = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to submit fan articles!");
      return;
    }

    if (!formData.title || !formData.content) {
      toast.error("Please fill in title and content!");
      return;
    }

    setIsSubmitting(true);
    try {
      const backendBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem('fanhub_token') || localStorage.getItem('token');

      const res = await fetch(`${backendBase}/api/fandom/articles/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message, {
          style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' },
          duration: 5000
        });
        setIsSubmitModalOpen(false);
        setFormData({ title: '', summary: '', content: '', category: 'Anime', fandom: '', coverImage: '', tags: '' });
        fetchArticles();
      } else {
        toast.error(data.message || "Submission failed");
      }
    } catch (err) {
      toast.error(err.message || "Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const featuredArticle = articles.find(a => a.isFeatured) || articles[0];
  const regularArticles = articles.filter(a => a._id !== featuredArticle?._id);

  return (
    <main className="min-h-screen bg-[#FBFBFD] dark:bg-[#060805] text-gray-900 dark:text-gray-100 p-4 md:p-10 pb-36 font-body relative overflow-hidden transition-colors duration-500">
      
      {/* Background Ambience */}
      <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] bg-[#a7c957]/15 dark:bg-[#a7c957]/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-emerald-950/20 blur-[160px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1400px] mx-auto z-10 relative">
        <Breadcrumbs />

        {/* ─── Hero Header & Action Button ───────────────────────────────────────── */}
        <header className="mt-4 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 text-xs font-bold text-[#a7c957] uppercase tracking-widest mb-3 backdrop-blur-md">
              <BookOpen size={14} className="text-[#a7c957]" />
              Fandom Editorial & Lore Hub
            </div>
            
            <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tight text-gray-950 dark:text-white">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a7c957] via-[#c2e078] to-[#80b918]">Articles</span>
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 font-medium text-base md:text-lg max-w-xl mt-2">
              Deep dives, event chronicles, convention retrospectives, and community lore written by and for fans.
            </p>
          </div>

          {/* Submit Fan Content Button (SRS 1.6 Requirement) */}
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#a7c957] text-[#0b0f0a] font-bold text-sm hover:scale-105 transition-all shadow-[0_0_20px_rgba(167,201,87,0.4)] cursor-pointer self-start md:self-auto"
          >
            <Plus size={18} strokeWidth={3} /> Submit Fan Lore / Article
          </button>
        </header>

        {/* ─── Category Filter Tabs & Search ────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 z-20 relative">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar w-full md:w-auto">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold tracking-wide transition-all duration-300 border ${
                    isSelected
                      ? 'bg-[#a7c957] text-[#0b0f0a] border-transparent shadow-[0_0_15px_rgba(167,201,87,0.4)]'
                      : 'text-gray-600 dark:text-gray-400 bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 hover:border-[#a7c957]/30 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, lore, tags..."
              className="w-full pl-10 pr-9 py-2.5 rounded-full bg-black/[0.04] dark:bg-white/5 border border-black/[0.08] dark:border-white/10 text-xs md:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a7c957]/50 transition-all"
            />
          </div>
        </div>

        {/* ─── Featured Spotlight Article (Editorial Hero) ─────────────────────── */}
        {!searchQuery && selectedCategory === 'All' && featuredArticle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => handleOpenArticle(featuredArticle)}
            className="group relative w-full rounded-3xl overflow-hidden bg-gray-900 border border-black/10 dark:border-white/10 shadow-2xl mb-12 cursor-pointer transition-all duration-500 hover:border-[#a7c957]/50"
          >
            <div className="relative h-80 md:h-[420px] w-full overflow-hidden">
              <img
                src={featuredArticle.coverImage}
                alt={featuredArticle.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060805] via-[#060805]/60 to-black/30" />

              <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 z-10 max-w-3xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-[#a7c957] text-[#0b0f0a] font-black text-xs uppercase tracking-wider">
                    Featured Story
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-semibold text-white">
                    {featuredArticle.category} • {featuredArticle.fandom}
                  </span>
                </div>

                <h2 className="text-2xl md:text-4xl font-heading font-black text-white group-hover:text-[#a7c957] transition-colors leading-tight">
                  {featuredArticle.title}
                </h2>

                <p className="text-gray-300 text-sm md:text-base mt-2 line-clamp-2 leading-relaxed">
                  {featuredArticle.summary}
                </p>

                <div className="flex items-center gap-4 mt-4 text-xs font-medium text-gray-400">
                  <span className="flex items-center gap-1.5 text-white">
                    <User size={14} className="text-[#a7c957]" /> {featuredArticle.author?.name || 'Staff Editor'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {featuredArticle.readTime}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye size={14} /> {featuredArticle.views || 0} reads
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── Articles Grid ──────────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-black/5 dark:bg-white/5 rounded-3xl animate-pulse border border-black/5 dark:border-white/5" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="w-full py-20 text-center bg-black/5 dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/10 p-8">
            <BookOpen size={40} className="mx-auto text-gray-500 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading">No articles found</h3>
            <p className="text-gray-500 text-sm mt-1">Be the first to submit a lore article for this fandom!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(searchQuery || selectedCategory !== 'All' ? articles : regularArticles).map((art) => (
              <motion.div
                key={art._id}
                onClick={() => handleOpenArticle(art)}
                className="group relative flex flex-col rounded-3xl bg-white/70 dark:bg-[#0c100a] border border-black/5 dark:border-white/10 overflow-hidden shadow-lg transition-all duration-500 hover:border-[#a7c957]/50 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(167,201,87,0.18)] cursor-pointer"
              >
                {/* Article Cover */}
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-900">
                  <img
                    src={art.coverImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80'}
                    alt={art.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c100a] via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-black text-[#a7c957] uppercase tracking-wider">
                      {art.category}
                    </span>
                  </div>

                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] text-gray-300 font-semibold flex items-center gap-1">
                    <Clock size={11} /> {art.readTime}
                  </span>
                </div>

                {/* Article Info */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      {art.fandom}
                    </span>
                    <h3 className="text-lg font-heading font-black text-gray-900 dark:text-white mt-1 group-hover:text-[#a7c957] transition-colors line-clamp-2 leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-2 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs text-gray-500">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[60%]">
                      By {art.author?.name || 'Fan Contributor'}
                    </span>
                    <span className="text-[#a7c957] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read Story →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Full Article Reader Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 25 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-[#0c100a] border border-white/15 rounded-3xl overflow-y-auto shadow-2xl text-white scrollbar-hide"
            >
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 border border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="relative h-64 md:h-80 w-full overflow-hidden">
                <img src={activeArticle.coverImage} alt={activeArticle.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c100a] via-[#0c100a]/50 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="px-3 py-1 rounded-full bg-[#a7c957] text-[#0b0f0a] text-xs font-black uppercase tracking-wider">
                    {activeArticle.category} • {activeArticle.fandom}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-heading font-black text-white mt-2 leading-tight">
                    {activeArticle.title}
                  </h2>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs text-gray-400">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#a7c957]/20 border border-[#a7c957]/40 flex items-center justify-center font-bold text-[#a7c957]">
                      {activeArticle.author?.name ? activeArticle.author.name[0] : 'F'}
                    </div>
                    <div>
                      <span className="text-white font-bold block">{activeArticle.author?.name || 'Fan Contributor'}</span>
                      <span className="text-gray-500">{activeArticle.author?.role || 'Community Contributor'}</span>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {activeArticle.readTime}</span>
                </div>

                {/* Article Content Paragraphs */}
                <div className="prose prose-invert max-w-none text-gray-300 text-sm md:text-base leading-relaxed space-y-4">
                  {activeArticle.content.split('\n\n').map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>

                {/* Tags */}
                {activeArticle.tags?.length > 0 && (
                  <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2">
                    {activeArticle.tags.map((t) => (
                      <span key={t} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Submit Fan Lore Modal (SRS 1.6 Requirement) ─────────────────────── */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 25 }}
              className="relative w-full max-w-2xl bg-[#0c100a] border border-white/15 rounded-3xl p-6 md:p-8 shadow-2xl text-white max-h-[92vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="mb-6">
                <span className="px-3 py-1 rounded-full bg-[#a7c957]/10 text-[#a7c957] font-bold text-xs uppercase tracking-widest border border-[#a7c957]/30">
                  Community Submission
                </span>
                <h2 className="text-2xl font-heading font-black text-white mt-2">
                  Submit Fan Lore & Articles
                </h2>
                <p className="text-gray-400 text-xs mt-1">
                  Share theories, cosplay guides, or lore retrospectives. Submissions will be verified by the Admin team.
                </p>
              </div>

              <form onSubmit={handleSubmitFanArticle} className="space-y-4 text-xs md:text-sm">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Why the Rumbling was Eren's Inevitable Choice"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#a7c957]/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 font-semibold mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0c100a] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#a7c957]/50"
                    >
                      {CATEGORIES.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 font-semibold mb-1">Fandom Name</label>
                    <input
                      type="text"
                      value={formData.fandom}
                      onChange={(e) => setFormData({ ...formData, fandom: e.target.value })}
                      placeholder="e.g. Attack on Titan"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#a7c957]/50"
                    >
                    </input>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Short Summary (Preview)</label>
                  <input
                    type="text"
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Brief 1-2 sentence hook for the card preview..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#a7c957]/50"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Article Content (Markdown supported) *</label>
                  <textarea
                    required
                    rows={6}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your article, lore explanation, or event chronicle here..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#a7c957]/50 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 font-semibold mb-1">Cover Image URL</label>
                    <input
                      type="url"
                      value={formData.coverImage}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#a7c957]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-semibold mb-1">Tags (Comma-separated)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="Eren, Titans, Anime Lore"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#a7c957]/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#a7c957] to-[#c2e078] text-[#0b0f0a] font-bold text-sm hover:scale-[1.01] transition-transform shadow-lg shadow-[#a7c957]/30 flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : <><Send size={16} /> Submit Article for Approval</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
