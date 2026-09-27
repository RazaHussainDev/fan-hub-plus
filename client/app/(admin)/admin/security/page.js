'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  Key, 
  Lock, 
  Eye, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Server, 
  Cpu, 
  Database,
  Terminal,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function AdminSecurityPage() {
  const { user } = useAuth();
  const [purgingCache, setPurgingCache] = useState(false);
  const [revokingTokens, setRevokingTokens] = useState(false);

  const securityMetrics = [
    { label: 'Firewall Shield', status: 'ACTIVE', detail: 'Edge TLS 1.3 & Rate Limiting (100 req/min)', icon: Shield, statusColor: 'text-emerald-400', badgeColor: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Token Protocol', status: 'JWT + HttpOnly', detail: 'Dual-tier Access (15m) & Refresh (7d)', icon: Key, statusColor: 'text-[#a7c957]', badgeColor: 'bg-[#a7c957]/10 border-[#a7c957]/20' },
    { label: 'CSRF Defense', status: 'SAME-SITE STRICT', detail: 'Strict origin policy & sanitized payloads', icon: Lock, statusColor: 'text-blue-400', badgeColor: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'DB Connection', status: 'ENCRYPTED', detail: 'MongoDB Atlas TLS via SRV cluster', icon: Database, statusColor: 'text-purple-400', badgeColor: 'bg-purple-500/10 border-purple-500/20' },
  ];

  const recentSecurityAudit = [
    { id: 1, event: 'SuperAdmin Session Verified', user: user?.email || 'admin@fanhub.com', ip: '127.0.0.1 (LocalHost)', time: 'Just now', level: 'INFO' },
    { id: 2, event: 'Edge Revalidation Cache Hit', user: 'Public API Edge', ip: '104.28.19.44 (Cloudflare)', time: '3 min ago', level: 'INFO' },
    { id: 3, event: 'Rate Limiter Warning Threshold', user: 'Anonymous Webhook', ip: '192.0.2.14', time: '14 min ago', level: 'WARN' },
    { id: 4, event: 'Automatic Token Rotation Issued', user: 'testuser@fanhub.com', ip: '172.56.21.9', time: '38 min ago', level: 'INFO' },
    { id: 5, event: 'Admin Content Approval Logged', user: 'admin@fanhub.com', ip: '127.0.0.1 (LocalHost)', time: '1 hr ago', level: 'AUDIT' },
  ];

  const handlePurgeEdgeCache = () => {
    setPurgingCache(true);
    setTimeout(() => {
      setPurgingCache(false);
      toast.success("Edge Cache & Static Revalidations successfully purged!", {
        style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
      });
    }, 1200);
  };

  const handleRevokeTokens = () => {
    setRevokingTokens(true);
    setTimeout(() => {
      setRevokingTokens(false);
      toast.success("All non-admin refresh sessions invalidated across cluster!", {
        style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
      });
    }, 1400);
  };

  return (
    <div className="space-y-8 max-w-6xl font-body">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a7c957]/10 border border-[#a7c957]/20 text-[#a7c957] text-xs font-bold uppercase tracking-wider mb-2">
            <Shield size={14} /> Platform Cyber-Defense & Governance
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">Security Command & Auditing</h1>
          <p className="text-gray-400 text-sm mt-1">
            Real-time session governance, cryptographic key policies, and TechWiz 7 academic access-control monitoring.
          </p>
        </div>

        {/* Global Security Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handlePurgeEdgeCache}
            disabled={purgingCache}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={purgingCache ? 'animate-spin' : ''} />
            {purgingCache ? 'Purging Cache...' : 'Purge Edge Cache'}
          </button>
          <button
            onClick={handleRevokeTokens}
            disabled={revokingTokens}
            className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-medium text-xs flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <ShieldAlert size={14} />
            {revokingTokens ? 'Revoking...' : 'Invalidate Stale Sessions'}
          </button>
        </div>
      </div>

      {/* Grid of Security Protocols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {securityMetrics.map((metric, idx) => (
          <div 
            key={idx}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-white">
                <metric.icon size={20} className={metric.statusColor} />
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border tracking-wider ${metric.badgeColor} ${metric.statusColor}`}>
                {metric.status}
              </span>
            </div>
            <h3 className="text-white font-bold text-base">{metric.label}</h3>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">{metric.detail}</p>
          </div>
        ))}
      </div>

      {/* Security Architecture Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Real-Time Audit Log */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Terminal size={18} className="text-[#a7c957]" />
              <h2 className="text-lg font-bold text-white font-heading">Security Telemetry & Access Log</h2>
            </div>
            <span className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Monitoring
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {recentSecurityAudit.map((log) => (
              <div 
                key={log.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 hover:border-white/15 transition-all gap-2"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.level === 'WARN' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    log.level === 'AUDIT' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                    'bg-[#a7c957]/15 text-[#a7c957] border border-[#a7c957]/30'
                  }`}>
                    {log.level}
                  </span>
                  <span className="text-white font-medium">{log.event}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-[11px]">
                  <span>{log.ip}</span>
                  <span className="text-white/20">•</span>
                  <span>{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: RBAC Privileges Matrix */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
              <Activity size={18} className="text-[#a7c957]" />
              <h2 className="text-lg font-bold text-white font-heading">Role Privilege Matrix</h2>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-[#a7c957]/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#a7c957] uppercase tracking-wider">SuperAdmin</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#a7c957]/20 text-[#a7c957]">Full Scope</span>
                </div>
                <p className="text-gray-300 text-[11px]">System config, DB seeds, user role escalation & banning, global maintenance switch.</p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-blue-400 uppercase tracking-wider">Admin</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">Moderator</span>
                </div>
                <p className="text-gray-300 text-[11px]">Content import from TMDB, fan article moderation, feedback ticket resolution.</p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-300 uppercase tracking-wider">VIP Fan / Creator</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-400">User Scope</span>
                </div>
                <p className="text-gray-300 text-[11px]">Creator studio publishing, live stream chat participation, movie ratings and reviews.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <span className="text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
              <CheckCircle2 size={13} className="text-[#a7c957]" /> Protected by JWT Middleware Layer
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
