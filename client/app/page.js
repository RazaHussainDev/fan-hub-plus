'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [statusMessage, setStatusMessage] = useState('Checking connection...');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // 500ms delay to simulate loading state for visual feedback
    const timer = setTimeout(() => {
      fetch('http://localhost:5000/api/status')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setStatusMessage(data.message);
            setIsSuccess(true);
          } else {
            setStatusMessage('Failed to parse successful response.');
            setIsSuccess(false);
          }
        })
        .catch((err) => {
          console.error('Backend connection error:', err);
          setStatusMessage('Failed to connect to backend server. Make sure it is running.');
          setIsSuccess(false);
        });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-950">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-2xl text-center">
        <h1 className="font-heading text-4xl font-bold text-white mb-2 tracking-tight">
          Fan Hub <span className="text-indigo-500">Plus</span>
        </h1>
        <p className="font-body text-gray-400 mb-8 text-sm">
          Dynamic Fandom Information Hub
        </p>
        
        <div className={`p-4 rounded-lg flex items-center justify-center gap-3 border ${isSuccess ? 'bg-indigo-950/30 border-indigo-500/30 text-indigo-300' : 'bg-gray-800/50 border-gray-700 text-gray-300'}`}>
          {statusMessage === 'Checking connection...' && (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          )}
          {isSuccess && (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          <span className="font-medium text-sm">{statusMessage}</span>
        </div>
      </div>
    </main>
  );
}
