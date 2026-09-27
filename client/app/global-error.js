"use client";
import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // If it's a chunk loading error from Vercel deployments, force a full page reload silently
    if (error?.message && (error.message.includes('Failed to fetch') || error.message.includes('Loading chunk') || error.message.includes('fetch'))) {
      window.location.reload();
    }
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0f0a] text-white p-4 text-center font-sans">
          <div className="w-12 h-12 border-3 border-[#a7c957] border-t-transparent rounded-full animate-spin mb-4" />
          <h2 className="text-2xl font-bold mb-2">Updating Fan Hub Plus...</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-sm">New platform updates are being synced seamlessly.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#a7c957] hover:bg-[#95b347] text-[#0b0f0a] rounded-xl font-bold transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            Refresh Page
          </button>
        </div>
      </body>
    </html>
  );
}
