'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun, Minus, Plus } from 'lucide-react';

export default function AccessibilityControls() {
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState(16); // Base 16px

  useEffect(() => {
    // Initialization
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedFontSize = parseInt(localStorage.getItem('fanhub_font_size') || '16', 10);
    
    setTheme(savedTheme);
    setFontSize(savedFontSize);
    
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    applyFontSize(savedFontSize);
  }, []);

  const applyFontSize = (size) => {
    document.documentElement.style.fontSize = `${size}px`;
  };

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };

  const changeFontSize = (delta) => {
    const newSize = Math.max(12, Math.min(24, fontSize + delta)); // min 12px, max 24px
    setFontSize(newSize);
    applyFontSize(newSize);
    localStorage.setItem('fanhub_font_size', newSize.toString());
  };

  return (
    <div className="flex items-center gap-2 bg-gray-900/80 backdrop-blur border border-gray-700 rounded-full px-3 py-1.5 shadow-lg">
      <button 
        onClick={() => changeFontSize(-1)}
        className="text-gray-300 hover:text-white transition-colors px-1"
        aria-label="Decrease font size"
      >
        <span className="flex items-center text-xs font-bold font-mono">A<Minus size={10} /></span>
      </button>
      
      <div className="w-px h-4 bg-gray-700 mx-1"></div>
      
      <button 
        onClick={() => changeFontSize(1)}
        className="text-gray-300 hover:text-white transition-colors px-1"
        aria-label="Increase font size"
      >
        <span className="flex items-center text-sm font-bold font-mono">A<Plus size={12} /></span>
      </button>

      <div className="w-px h-4 bg-gray-700 mx-1"></div>

      <button 
        onClick={toggleTheme}
        className="text-gray-300 hover:text-brand-primary transition-colors px-1"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </div>
  );
}
