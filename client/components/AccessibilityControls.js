'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function AccessibilityControls() {
  const [isDark, setIsDark] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme');
    const savedFontSize = parseInt(localStorage.getItem('fanhub_font_size') || '16', 10);
    const html = document.documentElement;

    if (storedTheme === 'light') {
      html.classList.remove('dark');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      setIsDark(true);
    }

    setFontSize(savedFontSize);
    document.documentElement.style.fontSize = `${savedFontSize}px`;
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const changeFontSize = (delta) => {
    const newSize = Math.max(12, Math.min(24, fontSize + delta));
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
    localStorage.setItem('fanhub_font_size', newSize.toString());
  };

  if (!mounted) return null;

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.72)',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.9) inset',
      }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-[30px] border border-white/60 dark:border-gray-700/50 dark:!bg-gray-900/80 dark:!shadow-[0_2px_16px_rgba(0,0,0,0.4)] transition-all duration-300"
    >
      <button
        onClick={() => changeFontSize(-1)}
        className="text-[#3c3c43] dark:text-gray-400 hover:text-[#1d1d1f] dark:hover:text-white transition-colors px-1.5 py-0.5 rounded-lg hover:bg-black/[0.05] dark:hover:bg-white/10 active:scale-95"
        aria-label="Decrease font size"
      >
        <span className="text-xs font-bold font-mono tracking-tighter">A-</span>
      </button>

      <div className="w-px h-3.5 bg-black/10 dark:bg-gray-600"></div>

      <button
        onClick={() => changeFontSize(1)}
        className="text-[#3c3c43] dark:text-gray-400 hover:text-[#1d1d1f] dark:hover:text-white transition-colors px-1.5 py-0.5 rounded-lg hover:bg-black/[0.05] dark:hover:bg-white/10 active:scale-95"
        aria-label="Increase font size"
      >
        <span className="text-sm font-bold font-mono tracking-tighter">A+</span>
      </button>

      <div className="w-px h-3.5 bg-black/10 dark:bg-gray-600"></div>

      <button
        onClick={toggleTheme}
        className="text-[#3c3c43] dark:text-gray-400 hover:text-brand-primary transition-colors px-1.5 py-0.5 rounded-lg hover:bg-black/[0.05] dark:hover:bg-white/10 active:scale-95"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={14} /> : <Moon size={14} />}
      </button>
    </div>
  );
}
