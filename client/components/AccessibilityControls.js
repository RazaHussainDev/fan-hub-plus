'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, Minus, Plus } from 'lucide-react';

export default function AccessibilityControls() {
  const [isDark, setIsDark] = useState(true);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    // Run only on client side after mount to prevent hydration mismatch
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

  return (
    <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur border border-gray-300 dark:border-gray-700 rounded-full px-3 py-1.5 shadow-lg transition-colors duration-300">
      <button
        onClick={() => changeFontSize(-1)}
        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-1"
        aria-label="Decrease font size"
      >
        <span className="flex items-center text-xs font-bold font-mono">A<Minus size={10} /></span>
      </button>

      <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>

      <button
        onClick={() => changeFontSize(1)}
        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-1"
        aria-label="Increase font size"
      >
        <span className="flex items-center text-sm font-bold font-mono">A<Plus size={12} /></span>
      </button>

      <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>

      <button
        onClick={toggleTheme}
        className="text-gray-600 dark:text-gray-300 hover:text-brand-primary transition-colors px-1"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </div>
  );
}
