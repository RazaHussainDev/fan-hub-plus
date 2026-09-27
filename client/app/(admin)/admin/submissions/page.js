'use client';

import React, { useState, useEffect } from 'react';
import { FileCheck, Check, X, Clock, Eye, User, Sparkles, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const backendBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem('fanhub_token') || localStorage.getItem('token');
      
      const res = await fetch(`${backendBase}/api/admin/submissions/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.results || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load pending submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleModerate = async (id, status) => {
    try {
      const backendBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem('fanhub_token') || localStorage.getItem('token');

      const res = await fetch(`${backendBase}/api/admin/submissions/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const data = await res.json();
      if (data.success) {
        toast.success(status === 'approved' ? "Article approved & published to community!" : "Article rejected", {
          style: { background: '#0b0f0a', color: status === 'approved' ? '#a7c957' : '#f87171', border: `1px solid ${status === 'approved' ? '#a7c957' : '#f87171'}` }
        });
        setSubmissions(prev => prev.filter(s => s._id !== id));
        setSelectedSubmission(null);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="space-y-8 font-body max-w-6xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a7c957]/10 border border-[#a7c957]/20 text-[#a7c957] text-xs font-bold uppercase tracking-wider mb-2">
          <FileCheck size={14} /> Community Content Moderation
        </div>
        <h1 className="text-3xl font-bold font-heading text-white tracking-tight">Fan Submissions Queue</h1>
        <p className="text-gray-400 text-sm mt-1">
          Review, approve, or reject fan lore, convention chronicles, and community-authored articles.
        </p>
      </div>

      {/* Submissions Table / Cards */}
      {loading ? (
        <div className="p-12 text-center text-gray-500 animate-pulse">Loading pending submissions...</div>
      ) : submissions.length === 0 ? (
        <div className="p-16 rounded-3xl bg-white/5 border border-white/10 text-center">
          <div className="w-14 h-14 rounded-full bg-[#a7c957]/10 border border-[#a7c957]/20 text-[#a7c957] flex items-center justify-center mx-auto mb-4">
            <Check size={28} />
          </div>
          <h3 className="text-xl font-bold text-white font-heading">Queue is Clean!</h3>
          <p className="text-gray-400 text-sm mt-1 max-w-sm mx-auto">
            All user-submitted articles have been moderated. New community fan submissions will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-black/60 text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="p-4 font-bold">Article Title</th>
                <th className="p-4 font-bold">Author</th>
                <th className="p-4 font-bold">Category</th>
                <th className="p-4 font-bold">Submitted Date</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-black/20 text-sm">
              {submissions.map((sub) => (
                <tr key={sub._id} className="hover:bg-white/5 transition-all">
                  <td className="p-4">
                    <span className="text-white font-bold block">{sub.title}</span>
                    <span className="text-gray-400 text-xs line-clamp-1">{sub.summary}</span>
                  </td>
                  <td className="p-4 text-gray-300">
                    <span className="font-semibold">{sub.author?.name || 'Community Fan'}</span>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#a7c957]/10 text-[#a7c957] border border-[#a7c957]/20 text-xs font-bold uppercase">
                      {sub.category}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 text-xs">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedSubmission(sub)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 text-xs font-semibold transition-all flex items-center gap-1"
                    >
                      <Eye size={13} /> Preview
                    </button>
                    <button
                      onClick={() => handleModerate(sub._id, 'approved')}
                      className="p-1.5 rounded-lg bg-[#a7c957] text-[#0b0f0a] hover:scale-105 font-bold transition-all shadow-md"
                      title="Approve & Publish"
                    >
                      <Check size={16} strokeWidth={3} />
                    </button>
                    <button
                      onClick={() => handleModerate(sub._id, 'rejected')}
                      className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/30"
                      title="Reject"
                    >
                      <X size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Preview Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="relative w-full max-w-2xl bg-[#0c100a] border border-white/15 rounded-3xl p-6 md:p-8 max-h-[88vh] overflow-y-auto shadow-2xl text-white">
            <button
              onClick={() => setSelectedSubmission(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X size={18} />
            </button>

            <span className="px-3 py-1 rounded-full bg-[#a7c957] text-[#0b0f0a] font-bold text-xs uppercase tracking-wider">
              {selectedSubmission.category} • {selectedSubmission.fandom}
            </span>

            <h2 className="text-2xl font-bold font-heading text-white mt-2">
              {selectedSubmission.title}
            </h2>

            <div className="text-xs text-gray-400 mt-2 mb-4 pb-3 border-b border-white/10">
              Submitted by <strong>{selectedSubmission.author?.name}</strong> • {selectedSubmission.readTime}
            </div>

            <div className="text-gray-300 text-sm leading-relaxed space-y-3 whitespace-pre-wrap">
              {selectedSubmission.content}
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/10">
              <button
                onClick={() => handleModerate(selectedSubmission._id, 'approved')}
                className="flex-1 py-3 rounded-full bg-[#a7c957] text-[#0b0f0a] font-bold text-sm hover:scale-[1.02] transition-transform shadow-lg shadow-[#a7c957]/30 flex items-center justify-center gap-2"
              >
                <Check size={16} strokeWidth={3} /> Approve & Publish Live
              </button>
              <button
                onClick={() => handleModerate(selectedSubmission._id, 'rejected')}
                className="px-6 py-3 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white font-bold text-sm transition-colors border border-red-500/30"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
