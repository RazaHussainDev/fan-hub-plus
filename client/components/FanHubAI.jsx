'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Flame, 
  Star, 
  LayoutGrid, 
  User, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  Film, 
  ChevronRight,
  Compass,
  ArrowUp
} from 'lucide-react';

const QUICK_ACTIONS = [
  {
    id: 'find',
    label: 'Find Movies & TV Shows',
    icon: Search,
    query: 'Find Movies & TV Shows',
    reply: "You can explore over 1,000+ curated titles in our Fandom Explorer! Try searching by genre, release year, or visit the '/explore' page to filter by your favorite fandom."
  },
  {
    id: 'trending',
    label: "What's Trending?",
    icon: Flame,
    query: "What's Trending?",
    reply: "🔥 Top Trending this week on Fan Hub Plus:\n• Cyberpunk: Edgerunners (Anime)\n• Elden Ring: Shadow of the Erdtree Lore (Gaming)\n• Arcane Season 2 (TV Shows)\n• Dune: Part Two (Movies)\nCheck out our Stream section for 4K playback!"
  },
  {
    id: 'recommendations',
    label: 'Content Recommendations',
    icon: Film,
    query: 'Content Recommendations',
    reply: "Looking for recommendations? Tell me your favorite genre (like Cyberpunk, Dark Fantasy, or Shonen) or check out our Character Dossiers at '/characters' to explore deep lore!"
  },
  {
    id: 'features',
    label: 'Help with Features',
    icon: Star,
    query: 'Help with Features',
    reply: "Here is what you can do on Fan Hub Plus:\n✨ Stream 4K movies & TV series\n🎧 Listen to iconic OSTs in the Audio Turntable ('/audio')\n📍 Discover conventions near you ('/events')\n📝 Save titles & add personal notes in 'My List'\n🛍️ Browse exclusive collector merchandise ('/merchandise')"
  }
];

export default function FanHubAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      type: 'text',
      text: "Hi there! 👋 I'm FanHub AI, your entertainment assistant. How can I help you today?"
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    // Append user message
    const userMsg = {
      id: Date.now() + '-user',
      sender: 'user',
      type: 'text',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Simulate smart bot response
    setTimeout(() => {
      let botReply = '';
      const matchedAction = QUICK_ACTIONS.find(a => a.query.toLowerCase() === query.toLowerCase());

      if (matchedAction) {
        botReply = matchedAction.reply;
      } else if (query.toLowerCase().includes('hello') || query.toLowerCase().includes('hi')) {
        botReply = "Greetings, fellow fan! 🌟 How's your streaming journey going? You can ask me for recommendations, trending shows, or how to use any platform feature.";
      } else if (query.toLowerCase().includes('movie') || query.toLowerCase().includes('watch') || query.toLowerCase().includes('stream')) {
        botReply = "Head over to the '/explore' section to stream the highest-rated blockbusters, anime masterpieces, and TV series with zero buffering!";
      } else if (query.toLowerCase().includes('character') || query.toLowerCase().includes('lore')) {
        botReply = "Our Character Dossiers at '/characters' feature full power breakdowns, iconic quotes, and backstories for characters like Gojo Satoru, Johnny Silverhand, and Malenia!";
      } else {
        botReply = `Great question! As your FanHub AI guide, I'm here to help you navigate our 8 fandom categories, stream media, discover upcoming conventions, and collect fan gear. Let me know if you want specific recommendations for "${query}"!`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + '-bot',
          sender: 'bot',
          type: 'text',
          text: botReply
        }
      ]);
      setIsTyping(false);
    }, 900);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Collapsed State: Floating Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex items-center justify-center"
          >
            {/* Pulse rings */}
            <span className="absolute -inset-1 rounded-full bg-[#a7c957]/30 animate-ping opacity-75" />
            <span className="absolute -inset-2 rounded-full bg-[#a7c957]/15 blur-sm" />

            <button
              onClick={() => setIsOpen(true)}
              aria-label="Open FanHub AI Assistant"
              className="relative group w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#0b0f0a] border-2 border-[#a7c957]/60 p-2.5 shadow-[0_0_25px_rgba(167,201,87,0.4)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-300"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="FanHub AI Logo"
                  width={36}
                  height={36}
                  className="object-contain group-hover:rotate-12 transition-transform duration-300"
                />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#a7c957] border-2 border-[#0b0f0a] rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-[#0b0f0a] rounded-full" />
                </span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded State: Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50 w-[92vw] sm:w-[410px] h-[580px] max-h-[85vh] bg-[#0b0f0a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(167,201,87,0.15)] flex flex-col overflow-hidden font-body text-gray-200"
          >
            {/* Header */}
            <div className="relative px-5 py-4 bg-gradient-to-r from-[#121a10] via-[#0b0f0a] to-[#121a10] border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full bg-black/60 border border-[#a7c957]/40 p-1.5 flex items-center justify-center shadow-inner">
                  <Image
                    src="/logo.png"
                    alt="FanHub AI"
                    width={26}
                    height={26}
                    className="object-contain"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#a7c957] rounded-full border border-black shadow-[0_0_8px_#a7c957]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-heading font-bold text-white text-base tracking-tight">
                      FanHub <span className="text-[#a7c957]">AI</span>
                    </h3>
                    <span className="px-1.5 py-0.2 rounded bg-[#a7c957]/20 border border-[#a7c957]/40 text-[#a7c957] text-[10px] font-bold uppercase tracking-wider">
                      Assistant
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium">
                    Your Entertainment Assistant
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Close Chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-[#121a10] border border-[#a7c957]/30 flex items-center justify-center shrink-0 mt-0.5 text-[#a7c957]">
                      <Bot size={16} />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#a7c957] text-[#0b0f0a] font-medium rounded-br-none shadow-[0_4px_15px_rgba(167,201,87,0.25)]'
                        : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5 text-gray-300">
                      <User size={15} />
                    </div>
                  )}
                </div>
              ))}

              {/* Quick Actions Grid (Initial view or after welcome message) */}
              {messages.length === 1 && (
                <div className="pt-2 pb-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2.5 px-1 flex items-center gap-1.5">
                    <Sparkles size={12} className="text-[#a7c957]" /> Quick Suggestions
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_ACTIONS.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.id}
                          onClick={() => handleSendMessage(action.query)}
                          className="p-3 rounded-2xl bg-white/5 hover:bg-[#a7c957]/15 border border-white/10 hover:border-[#a7c957]/40 text-left transition-all duration-300 group flex flex-col justify-between"
                        >
                          <div className="w-7 h-7 rounded-lg bg-black/40 border border-white/10 group-hover:border-[#a7c957]/40 flex items-center justify-center text-[#a7c957] mb-2 group-hover:scale-110 transition-transform">
                            <Icon size={14} />
                          </div>
                          <span className="text-xs font-semibold text-gray-200 group-hover:text-white leading-snug">
                            {action.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bot Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2.5 justify-start">
                  <div className="w-8 h-8 rounded-full bg-[#121a10] border border-[#a7c957]/30 flex items-center justify-center shrink-0 text-[#a7c957]">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[#a7c957] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-[#a7c957] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-[#a7c957] animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input & Disclaimer Area */}
            <div className="p-3.5 bg-black/50 border-t border-white/10 shrink-0">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything..."
                  className="w-full pl-4 pr-12 py-3 bg-white/5 border border-white/15 focus:border-[#a7c957]/60 rounded-full text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim()}
                  className="absolute right-1.5 w-9 h-9 rounded-full bg-[#a7c957] hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100 text-[#0b0f0a] flex items-center justify-center transition-all shadow-md"
                  aria-label="Send Message"
                >
                  <ChevronRight size={20} strokeWidth={2.5} />
                </button>
              </div>

              {/* Disclaimer */}
              <p className="text-[10px] text-gray-500 text-center mt-2 font-medium tracking-tight">
                FanHub AI can make mistakes. Please verify important information.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
