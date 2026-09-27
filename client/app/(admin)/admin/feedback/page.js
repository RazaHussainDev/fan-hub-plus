'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquareCheck, 
  Bug, 
  Lightbulb, 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  User, 
  Mail, 
  Search, 
  Filter, 
  RefreshCw,
  ExternalLink,
  MessageCircle,
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import { apiFetch } from '@/utils/apiClient';

export default function AdminFeedbackPage() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (typeFilter !== 'all') queryParams.append('type', typeFilter);
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);

      const res = await apiFetch(`/api/admin/feedback?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setFeedbackList(data.results || []);
      } else {
        toast.error(data.message || 'Failed to fetch feedback');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error loading feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [typeFilter, statusFilter]);

  const handleUpdateStatus = async (id, newStatus, currentNote = '') => {
    try {
      const res = await apiFetch(`/api/admin/feedback/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: newStatus,
          adminNotes: currentNote || adminNote 
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Marked as ${newStatus}`, {
          style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
        });
        setFeedbackList(prev => prev.map(item => item._id === id ? data.feedback : item));
        if (selectedItem && selectedItem._id === id) {
          setSelectedItem(data.feedback);
        }
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleSaveNote = async () => {
    if (!selectedItem) return;
    setSavingNote(true);
    try {
      const res = await apiFetch(`/api/admin/feedback/${selectedItem._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: selectedItem.status,
          adminNotes: adminNote 
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Admin note saved', {
          style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
        });
        setFeedbackList(prev => prev.map(item => item._id === selectedItem._id ? data.feedback : item));
        setSelectedItem(data.feedback);
      }
    } catch (err) {
      toast.error('Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  const openDetails = (item) => {
    setSelectedItem(item);
    setAdminNote(item.adminNotes || '');
  };

  const filtered = feedbackList.filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.subject?.toLowerCase().includes(q) ||
      item.message?.toLowerCase().includes(q) ||
      item.name?.toLowerCase().includes(q) ||
      item.email?.toLowerCase().includes(q)
    );
  });

  const bugCount = feedbackList.filter(f => f.type === 'bug' && f.status !== 'resolved').length;
  const suggestionCount = feedbackList.filter(f => f.type === 'suggestion').length;
  const queryCount = feedbackList.filter(f => f.type === 'query').length;
  const resolvedCount = feedbackList.filter(f => f.status === 'resolved').length;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'bug': return <Bug size={14} className="text-red-400" />;
      case 'suggestion': return <Lightbulb size={14} className="text-amber-400" />;
      case 'query': return <HelpCircle size={14} className="text-cyan-400" />;
      default: return <MessageSquareCheck size={14} className="text-gray-400" />;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'bug':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold uppercase tracking-wider"><Bug size={12} /> Bug</span>;
      case 'suggestion':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider"><Lightbulb size={12} /> Suggestion</span>;
      case 'query':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold uppercase tracking-wider"><HelpCircle size={12} /> Query</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/20 text-xs font-bold uppercase tracking-wider">{type}</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs font-medium"><Clock size={12} /> Pending</span>;
      case 'in-progress':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium"><AlertCircle size={12} /> In Progress</span>;
      case 'resolved':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#a7c957]/10 text-[#a7c957] border border-[#a7c957]/20 text-xs font-medium"><CheckCircle2 size={12} /> Resolved</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-8 font-body max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a7c957]/10 border border-[#a7c957]/20 text-[#a7c957] text-xs font-bold uppercase tracking-wider mb-2">
            <MessageSquareCheck size={14} /> User Voice & Moderation
          </div>
          <h1 className="text-3xl font-bold font-heading text-white tracking-tight">Feedback & Bug Inbox</h1>
          <p className="text-gray-400 text-sm mt-1">
            Real-time issues, UX suggestions, and community queries reported by platform users.
          </p>
        </div>
        <button
          onClick={fetchFeedback}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-sm font-medium transition-all"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Total Submissions</span>
            <MessageCircle size={16} className="text-[#a7c957]" />
          </div>
          <div className="text-3xl font-black text-white">{feedbackList.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-red-500/20 backdrop-blur-xl bg-gradient-to-br from-red-500/5 to-transparent">
          <div className="flex items-center justify-between text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Open Bugs</span>
            <Bug size={16} />
          </div>
          <div className="text-3xl font-black text-red-400">{bugCount}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-amber-500/20 backdrop-blur-xl bg-gradient-to-br from-amber-500/5 to-transparent">
          <div className="flex items-center justify-between text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Suggestions</span>
            <Lightbulb size={16} />
          </div>
          <div className="text-3xl font-black text-amber-300">{suggestionCount}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-[#a7c957]/20 backdrop-blur-xl bg-gradient-to-br from-[#a7c957]/5 to-transparent">
          <div className="flex items-center justify-between text-[#a7c957] text-xs font-bold uppercase tracking-wider mb-2">
            <span>Resolved</span>
            <CheckCircle2 size={16} />
          </div>
          <div className="text-3xl font-black text-[#a7c957]">{resolvedCount}</div>
        </div>
      </div>

      {/* Controls Bar: Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center p-4 rounded-2xl bg-white/5 border border-white/10">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by subject, email, or user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#a7c957]/50"
          />
        </div>

        {/* Type & Status Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 p-1 rounded-xl">
            {['all', 'bug', 'suggestion', 'query'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  typeFilter === type
                    ? 'bg-[#a7c957] text-[#0b0f0a] shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 p-1 rounded-xl">
            {['all', 'pending', 'in-progress', 'resolved'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  statusFilter === status
                    ? 'bg-white/20 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main List & Details Modal / Drawer */}
      {loading ? (
        <div className="p-16 text-center text-gray-500 animate-pulse">Loading feedback records...</div>
      ) : filtered.length === 0 ? (
        <div className="p-16 rounded-3xl bg-white/5 border border-white/10 text-center">
          <CheckCircle2 size={36} className="text-[#a7c957] mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white font-heading">No Feedback Found</h3>
          <p className="text-gray-400 text-sm mt-1 max-w-sm mx-auto">
            {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'No records match your active search and filter criteria.'
              : 'Inbox is clean. No feedback submissions yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((item) => (
            <div
              key={item._id}
              onClick={() => openDetails(item)}
              className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                selectedItem?._id === item._id
                  ? 'bg-white/10 border-[#a7c957]/50 shadow-[0_0_20px_rgba(167,201,87,0.15)]'
                  : 'bg-white/5 border-white/10 hover:bg-white/[0.08] hover:border-white/20'
              }`}
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="mt-1 p-2 rounded-xl bg-black/40 border border-white/10 shrink-0">
                  {getTypeIcon(item.type)}
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {getTypeBadge(item.type)}
                    {getStatusBadge(item.status)}
                    <span className="text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white font-heading truncate">
                    {item.subject}
                  </h3>

                  <p className="text-xs text-gray-400 line-clamp-2">
                    {item.message}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
                    <span className="flex items-center gap-1 text-gray-300">
                      <User size={12} className="text-[#a7c957]" /> {item.name}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-gray-400 truncate">
                      <Mail size={12} /> {item.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Switcher Quick Buttons */}
              <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-white/5" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleUpdateStatus(item._id, 'pending')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    item.status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  title="Mark Pending"
                >
                  Pending
                </button>
                <button
                  onClick={() => handleUpdateStatus(item._id, 'in-progress')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    item.status === 'in-progress'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  title="Mark In Progress"
                >
                  In Progress
                </button>
                <button
                  onClick={() => handleUpdateStatus(item._id, 'resolved')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    item.status === 'resolved'
                      ? 'bg-[#a7c957]/20 text-[#a7c957] border border-[#a7c957]/40'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  title="Mark Resolved"
                >
                  Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details & Admin Response Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0e140d] border border-white/15 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl relative">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {getTypeBadge(selectedItem.type)}
                  {getStatusBadge(selectedItem.status)}
                </div>
                <h2 className="text-2xl font-bold font-heading text-white">{selectedItem.subject}</h2>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center text-lg"
              >
                ✕
              </button>
            </div>

            {/* Submitter Info */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 text-xs">
              <div>
                <span className="text-gray-400 uppercase tracking-wider block mb-1">Reported By</span>
                <span className="text-white font-semibold flex items-center gap-1.5">
                  <User size={13} className="text-[#a7c957]" /> {selectedItem.name}
                </span>
              </div>
              <div>
                <span className="text-gray-400 uppercase tracking-wider block mb-1">Email Address</span>
                <a href={`mailto:${selectedItem.email}`} className="text-[#a7c957] hover:underline flex items-center gap-1.5">
                  <Mail size={13} /> {selectedItem.email}
                </a>
              </div>
              <div>
                <span className="text-gray-400 uppercase tracking-wider block mb-1">Submitted On</span>
                <span className="text-gray-300">
                  {new Date(selectedItem.createdAt).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-400 uppercase tracking-wider block mb-1">Current State</span>
                <span className="capitalize text-white font-medium">{selectedItem.status}</span>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <span className="text-xs uppercase tracking-wider text-gray-400 block mb-2 font-bold">Feedback Details</span>
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                {selectedItem.message}
              </div>
            </div>

            {/* Admin Internal Resolution Notes */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-gray-400 block font-bold">
                Internal Resolution Notes / Fix Log
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Log internal action (e.g. 'Patched CSS selector bug in v1.2', 'Added to Q4 roadmap', 'Replied via email')..."
                rows={3}
                className="w-full p-3.5 bg-black/50 border border-white/15 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#a7c957]"
              />
            </div>

            {/* Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Change Status:</span>
                <button
                  onClick={() => handleUpdateStatus(selectedItem._id, 'pending', adminNote)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                    selectedItem.status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedItem._id, 'in-progress', adminNote)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                    selectedItem.status === 'in-progress'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedItem._id, 'resolved', adminNote)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                    selectedItem.status === 'resolved'
                      ? 'bg-[#a7c957]/20 text-[#a7c957] border border-[#a7c957]/40'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  Resolved
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveNote}
                  disabled={savingNote}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#a7c957] text-[#0b0f0a] font-bold text-sm hover:brightness-110 transition-all shadow-[0_0_15px_rgba(167,201,87,0.3)]"
                >
                  <Save size={15} /> {savingNote ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
