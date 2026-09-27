'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumbs from '@/components/Breadcrumbs';
import { 
  Calendar, MapPin, Compass, Navigation, Ticket, Users, 
  Search, Clock, ExternalLink, X, Check, Star, Sparkles, 
  Map, Globe, AlertCircle, Share2, Layers 
} from 'lucide-react';
import toast from 'react-hot-toast';

const EVENT_TYPES = ['All', 'Convention', 'Cosplay Meetup', 'Movie Screening', 'Gaming Tournament', 'Concert & Expo'];

const GLOBAL_CITIES = ['All', 'Tokyo', 'San Diego', 'London', 'Seoul', 'Los Angeles', 'New York', 'Cologne', 'Karachi'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.96 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } 
  }
};

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // GPS State
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [activeModalEvent, setActiveModalEvent] = useState(null);
  const [attendingMap, setAttendingMap] = useState({});

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCity !== 'All') params.append('city', selectedCity);
      if (selectedType !== 'All') params.append('eventType', selectedType);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      
      if (userLocation) {
        params.append('lat', userLocation.lat);
        params.append('lng', userLocation.lng);
      }

      const res = await fetch(`/api/events?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setEvents(data.results || []);
      }
    } catch (err) {
      console.error('Events fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchEvents, 150);
    return () => clearTimeout(timer);
  }, [selectedCity, selectedType, searchQuery, userLocation]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    toast.loading("Detecting your location...", { id: 'gps' });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        toast.success("Location synced! Sorted events by distance from you.", {
          id: 'gps',
          style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
        });
      },
      (err) => {
        setIsLocating(false);
        toast.error("Could not fetch location. Please check browser permissions.", { id: 'gps' });
      },
      { timeout: 10000 }
    );
  };

  const handleAttend = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (attendingMap[id]) return;

    setAttendingMap(prev => ({ ...prev, [id]: true }));
    setEvents(prev => prev.map(ev => ev._id === id ? { ...ev, attendeesCount: ev.attendeesCount + 1 } : ev));

    try {
      const backendBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await fetch(`${backendBase}/api/events/${id}/attend`, { method: 'POST' });
      toast.success("RSVP Confirmed! Added to your convention schedule.", {
        style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
      });
    } catch (e) {}
  };

  const handleShare = (e, ev) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    toast.success(`Share link for "${ev.title}" copied!`, {
      style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
    });
  };

  return (
    <main className="min-h-screen bg-[#FBFBFD] dark:bg-[#060805] text-gray-900 dark:text-gray-100 p-4 md:p-10 pb-36 font-body relative overflow-hidden transition-colors duration-500">
      
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-[#a7c957]/15 dark:bg-[#a7c957]/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 dark:bg-emerald-950/20 blur-[160px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1400px] mx-auto z-10 relative">
        <Breadcrumbs />

        {/* ─── Hero Header & GPS Action ─────────────────────────────────────────── */}
        <header className="mt-4 mb-8 text-center relative z-20">
          <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 text-xs font-bold text-[#a7c957] uppercase tracking-widest mb-3 backdrop-blur-md">
              <Compass size={14} className="text-[#a7c957]" />
              Location-Aware Discovery & Calendar
            </div>
            
            <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tight text-gray-950 dark:text-white">
              Conventions, Meetups & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a7c957] via-[#c2e078] to-[#80b918]">Screenings</span>
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 font-medium text-base md:text-lg max-w-2xl mx-auto mt-2">
              Browse world-renowned comic-cons, cosplay championships, gaming tournaments, and local screenings with GPS proximity sorting.
            </p>

            {/* GPS Proximity Locator Button */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleGetLocation}
                disabled={isLocating}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#a7c957] to-[#c2e078] text-[#0b0f0a] font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-[#a7c957]/30 cursor-pointer disabled:opacity-50"
              >
                <Navigation size={16} className={isLocating ? 'animate-spin' : ''} />
                {userLocation ? "Location Synced (Sorted by Nearest)" : "Find Events Near Me (GPS)"}
              </button>

              {userLocation && (
                <button
                  onClick={() => setUserLocation(null)}
                  className="px-4 py-3 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                >
                  Clear GPS Filter
                </button>
              )}
            </div>
          </motion.div>
        </header>

        {/* ─── Global Interactive Cities Bar ───────────────────────────────────── */}
        <div className="bg-white/80 dark:bg-[#0c100a]/80 backdrop-blur-2xl border border-black/5 dark:border-white/10 p-4 md:p-5 rounded-3xl shadow-xl mb-10 z-20 relative space-y-4">
          
          {/* City Selection */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Globe size={13} /> Cities:
            </span>
            {GLOBAL_CITIES.map((city) => {
              const isSelected = selectedCity === city;
              return (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-[#a7c957] text-[#0b0f0a] border-transparent shadow-[0_0_12px_rgba(167,201,87,0.4)]'
                      : 'text-gray-600 dark:text-gray-400 bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 hover:border-[#a7c957]/30 hover:text-white'
                  }`}
                >
                  {city}
                </button>
              );
            })}
          </div>

          {/* Event Type & Search Toolbar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-3 border-t border-black/5 dark:border-white/5">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-hide no-scrollbar">
              {EVENT_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    selectedType === type
                      ? 'bg-white/20 dark:bg-white/15 text-white font-bold border border-white/25'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search convention, venue, city..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-black/[0.04] dark:bg-white/5 border border-black/[0.08] dark:border-white/10 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a7c957]/50"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── Events Cards Grid ──────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-black/5 dark:bg-white/5 rounded-3xl animate-pulse border border-black/5 dark:border-white/5" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="w-full py-20 text-center bg-black/5 dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/10 p-8">
            <Calendar size={40} className="mx-auto text-gray-500 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading">No events found</h3>
            <p className="text-gray-500 text-sm mt-1">Try another city or reset your filters.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {events.map((ev) => {
              const isAttending = attendingMap[ev._id];

              return (
                <motion.div
                  key={ev._id}
                  variants={itemVariants}
                  onClick={() => setActiveModalEvent(ev)}
                  className="group relative flex flex-col rounded-3xl bg-white/70 dark:bg-[#0c100a] border border-black/5 dark:border-white/10 overflow-hidden shadow-lg transition-all duration-500 hover:border-[#a7c957]/50 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(167,201,87,0.18)] cursor-pointer"
                >
                  {/* Event Banner Image */}
                  <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-900">
                    <img
                      src={ev.bannerImage}
                      alt={ev.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c100a] via-transparent to-black/30 opacity-80 group-hover:opacity-50 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <span className="px-3 py-1 rounded-full bg-[#0b0f0a]/80 backdrop-blur-md border border-white/20 text-[10px] font-black text-[#a7c957] uppercase tracking-wider">
                        {ev.eventType}
                      </span>

                      {/* GPS Distance Badge (if active) */}
                      {ev.distanceKm !== undefined && (
                        <span className="px-2.5 py-1 rounded-full bg-[#a7c957] text-[#0b0f0a] font-black text-[10px] shadow-lg flex items-center gap-1">
                          <Navigation size={10} /> {ev.distanceKm} km away
                        </span>
                      )}
                    </div>

                    {/* Date Pill at bottom */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs z-10">
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white font-bold text-xs">
                        <Calendar size={13} className="text-[#a7c957]" /> {ev.dateString}
                      </span>
                      <span className="text-white font-bold text-xs bg-black/70 px-2.5 py-1 rounded-md backdrop-blur-md">
                        {ev.ticketPrice}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Details */}
                  <div className="p-5 flex flex-col justify-between flex-1 bg-white dark:bg-[#0c100a]">
                    <div>
                      {/* City & Venue */}
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        <MapPin size={14} className="text-[#a7c957]" />
                        <span>{ev.city}, {ev.country}</span>
                      </div>

                      <h3 className="text-lg font-heading font-black text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#a7c957] transition-colors leading-snug">
                        {ev.title}
                      </h3>

                      <p className="text-xs text-gray-500 line-clamp-2 mt-2 leading-relaxed">
                        {ev.description}
                      </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 mt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
                      <span className="text-gray-400 font-medium flex items-center gap-1">
                        <Users size={13} /> {ev.attendeesCount?.toLocaleString() || 120} attending
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleAttend(e, ev._id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                            isAttending
                              ? 'bg-[#a7c957] text-[#0b0f0a]'
                              : 'bg-black/5 dark:bg-white/10 hover:bg-[#a7c957] hover:text-[#0b0f0a]'
                          }`}
                        >
                          <Check size={12} strokeWidth={3} /> {isAttending ? 'RSVP\'d' : 'I\'m Attending'}
                        </button>

                        <button
                          onClick={(e) => handleShare(e, ev)}
                          className="p-1.5 rounded-full bg-black/5 dark:bg-white/10 hover:text-white transition-colors"
                          title="Share"
                        >
                          <Share2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* ─── Event Details & Ticket Modal ────────────────────────────────────── */}
      <AnimatePresence>
        {activeModalEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 25 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-[#0c100a] border border-white/15 rounded-3xl overflow-y-auto shadow-2xl text-white scrollbar-hide"
            >
              <button
                onClick={() => setActiveModalEvent(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 border border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="relative h-64 md:h-80 w-full overflow-hidden bg-gray-900">
                <img src={activeModalEvent.bannerImage} alt={activeModalEvent.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c100a] via-[#0c100a]/50 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-[#a7c957] text-[#0b0f0a] text-xs font-black uppercase tracking-wider">
                      {activeModalEvent.eventType} • {activeModalEvent.category}
                    </span>
                    {activeModalEvent.distanceKm !== undefined && (
                      <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md">
                        📍 {activeModalEvent.distanceKm} km from your GPS
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-heading font-black text-white mt-1 leading-tight">
                    {activeModalEvent.title}
                  </h2>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                {/* Logistics Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
                  <div>
                    <span className="text-gray-500 block mb-1 font-semibold flex items-center gap-1">
                      <Calendar size={13} className="text-[#a7c957]" /> Date & Time
                    </span>
                    <strong className="text-white text-sm block">{activeModalEvent.dateString}</strong>
                    <span className="text-gray-400">{activeModalEvent.time}</span>
                  </div>

                  <div>
                    <span className="text-gray-500 block mb-1 font-semibold flex items-center gap-1">
                      <MapPin size={13} className="text-[#a7c957]" /> Official Venue
                    </span>
                    <strong className="text-white text-sm block">{activeModalEvent.venue}</strong>
                    <span className="text-gray-400">{activeModalEvent.city}, {activeModalEvent.country}</span>
                  </div>

                  <div>
                    <span className="text-gray-500 block mb-1 font-semibold flex items-center gap-1">
                      <Ticket size={13} className="text-[#a7c957]" /> Ticket Tier
                    </span>
                    <strong className="text-[#a7c957] text-sm block">{activeModalEvent.ticketPrice}</strong>
                    <span className="text-gray-400">{activeModalEvent.attendeesCount?.toLocaleString()} Registered</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Event Schedule & Fandom Experience</h4>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                    {activeModalEvent.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/10">
                  <a
                    href={activeModalEvent.ticketUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-3.5 rounded-full bg-gradient-to-r from-[#a7c957] to-[#c2e078] text-[#0b0f0a] font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg shadow-[#a7c957]/30"
                  >
                    <ExternalLink size={16} /> Official Ticket Registration Portal
                  </a>

                  <button
                    onClick={(e) => handleAttend(e, activeModalEvent._id)}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={16} className={attendingMap[activeModalEvent._id] ? 'text-[#a7c957]' : ''} />
                    {attendingMap[activeModalEvent._id] ? 'Attending Confirmed' : 'RSVP to Schedule'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
