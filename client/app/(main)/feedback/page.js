'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Breadcrumbs from '@/components/Breadcrumbs';
import { 
  MessageSquare, Bug, Lightbulb, HelpCircle, Send, 
  CheckCircle, ShieldCheck, Mail, User 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const FEEDBACK_TYPES = [
  { id: 'suggestion', label: 'Feature Suggestion', icon: Lightbulb, color: 'text-[#a7c957] border-[#a7c957]' },
  { id: 'bug', label: 'Bug Report', icon: Bug, color: 'text-rose-400 border-rose-500' },
  { id: 'query', label: 'General Query', icon: HelpCircle, color: 'text-blue-400 border-blue-500' },
];

export default function FeedbackPage() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState('suggestion');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: selectedType
        })
      });

      const data = await res.json();
      if (data.success) {
        setIsSubmitted(true);
        toast.success("Feedback submitted! Thank you.", {
          style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
        });
      } else {
        toast.error(data.message || "Failed to submit feedback");
      }
    } catch (err) {
      toast.error("Error submitting feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FBFBFD] dark:bg-[#060805] text-gray-900 dark:text-gray-100 p-4 md:p-10 pb-36 font-body relative overflow-hidden transition-colors duration-500">
      
      {/* Background Ambience */}
      <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] bg-[#a7c957]/15 dark:bg-[#a7c957]/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-emerald-950/20 blur-[160px] rounded-full pointer-events-none" />

      <div className="w-full max-w-3xl mx-auto z-10 relative">
        <Breadcrumbs />

        {/* ─── Hero Header ──────────────────────────────────────────────────────── */}
        <header className="mt-4 mb-8 text-center relative z-20">
          <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 text-xs font-bold text-[#a7c957] uppercase tracking-widest mb-3 backdrop-blur-md">
              <MessageSquare size={14} className="text-[#a7c957]" />
              Fandom Community Feedback
            </div>
            
            <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-gray-950 dark:text-white">
              Feedback & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a7c957] via-[#c2e078] to-[#80b918]">Analytics Voice</span>
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 font-medium text-sm md:text-base max-w-xl mx-auto mt-2">
              Have an idea for a new fandom category, encountered a stream buffering issue, or have a question? Let our dev team know.
            </p>
          </motion.div>
        </header>

        {/* ─── Feedback Terminal Form ───────────────────────────────────────────── */}
        <div className="p-6 md:p-10 rounded-3xl bg-white/80 dark:bg-[#0c100a]/90 border border-black/5 dark:border-white/10 backdrop-blur-2xl shadow-2xl relative">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#a7c957]/15 border border-[#a7c957]/30 text-[#a7c957] flex items-center justify-center mx-auto">
                <CheckCircle size={36} />
              </div>
              <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                Feedback Received!
              </h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Thank you for contributing to Fan Hub Plus. Our team reviews all community bug reports and suggestions.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({ name: user?.name || '', email: user?.email || '', subject: '', message: '' });
                }}
                className="mt-4 px-6 py-2.5 rounded-full bg-[#a7c957] text-[#0b0f0a] font-bold text-sm hover:scale-105 transition-all shadow-md"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Type Categorization Switcher */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                  Feedback Classification *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {FEEDBACK_TYPES.map((t) => {
                    const Icon = t.icon;
                    const isSelected = selectedType === t.id;

                    return (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => setSelectedType(t.id)}
                        className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#a7c957]/15 border-[#a7c957] text-[#a7c957] shadow-lg shadow-[#a7c957]/20 scale-102'
                            : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                        }`}
                      >
                        <Icon size={16} />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Captain Fandom"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/[0.04] dark:bg-black/30 border border-black/[0.08] dark:border-white/10 text-xs md:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#a7c957]/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. fan@fanhub.plus"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/[0.04] dark:bg-black/30 border border-black/[0.08] dark:border-white/10 text-xs md:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#a7c957]/50"
                    />
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Add Bleach Thousand-Year Blood War to Anime Hub"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/[0.04] dark:bg-black/30 border border-black/[0.08] dark:border-white/10 text-xs md:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#a7c957]/50"
                />
              </div>

              {/* Message Content */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Detailed Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Explain the suggestion, steps to reproduce the issue, or your inquiry in detail..."
                  className="w-full p-4 rounded-xl bg-black/[0.04] dark:bg-black/30 border border-black/[0.08] dark:border-white/10 text-xs md:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#a7c957]/50 leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#a7c957] to-[#c2e078] text-[#0b0f0a] font-bold text-sm hover:scale-[1.01] transition-transform shadow-lg shadow-[#a7c957]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Transmitting..." : <><Send size={16} /> Submit Community Feedback</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
