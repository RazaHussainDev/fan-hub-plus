'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Users, Film, Activity, Server, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const mockChartData = [
  { name: 'Mon', streams: 4000 }, { name: 'Tue', streams: 3000 }, { name: 'Wed', streams: 5000 },
  { name: 'Thu', streams: 2780 }, { name: 'Fri', streams: 6890 }, { name: 'Sat', streams: 8390 }, { name: 'Sun', streams: 9490 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, ease: "easeOut" }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMovies: 0,
    activeStreams: 0,
    serverHealth: '...'
  });

  useEffect(() => {
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.stats);
        }
      })
      .catch(err => console.error("Failed to fetch admin stats", err));
    }
  }, [token]);

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, trend: '+12%', color: 'text-brand-primary', bgGlow: 'bg-brand-primary' },
    { title: 'Content Library', value: stats.totalMovies, icon: Film, trend: '+5%', color: 'text-blue-400', bgGlow: 'bg-blue-500' },
    { title: 'Active Streams', value: stats.activeStreams, icon: Activity, trend: '+24%', color: 'text-purple-400', bgGlow: 'bg-purple-500' },
    { title: 'Server Health', value: stats.serverHealth, icon: Server, trend: 'Stable', color: 'text-green-400', bgGlow: 'bg-green-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">Command Center</h1>
        <p className="text-gray-400 mt-2">Real-time metrics and system health overview.</p>
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, index) => (
          <motion.div key={index} variants={itemVariants} className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-brand-primary/50 transition-all duration-300 shadow-lg">
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bgGlow}/5 rounded-full blur-3xl group-hover:${stat.bgGlow}/10 transition-all duration-500`} />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 shadow-inner">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className={`${stat.color} text-sm font-medium flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full border border-white/5`}>
                {stat.trend} <TrendingUp className="w-3.5 h-3.5" />
              </span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium relative z-10">{stat.title}</h3>
            <p className="text-3xl md:text-4xl font-black text-white mt-1 tracking-tight relative z-10">
              {stat.value.toLocaleString()}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Recharts Area Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-8 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none" />
        
        <h3 className="text-xl font-bold font-heading text-white mb-8 relative z-10 flex items-center gap-2">
          <Activity className="text-brand-primary" />
          Weekly Streaming Activity
        </h3>
        
        <div className="h-[350px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorStreams" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a7c957" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#a7c957" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#6b7280" tick={{fill: '#86868b', fontSize: 12, fontWeight: 500}} axisLine={false} tickLine={false} dy={10} />
              <YAxis stroke="#6b7280" tick={{fill: '#86868b', fontSize: 12, fontWeight: 500}} axisLine={false} tickLine={false} dx={-10} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(11, 15, 10, 0.9)', 
                  backdropFilter: 'blur(10px)',
                  borderColor: 'rgba(167,201,87,0.3)', 
                  borderRadius: '16px', 
                  color: '#fff',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }} 
                itemStyle={{ color: '#a7c957', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="streams" 
                stroke="#a7c957" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorStreams)" 
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
