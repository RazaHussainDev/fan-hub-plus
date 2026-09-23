'use client';

import dynamic from 'next/dynamic';

const CustomPlayer = dynamic(() => import('@/components/CustomPlayer'), { 
  ssr: false,
  loading: () => <div className="w-full aspect-video bg-gray-900 rounded-xl flex items-center justify-center border border-gray-800"><span className="text-gray-400">Loading Player...</span></div>
});

export default function MoneyHeistPlayer() {
  // Using a standard test HLS stream to verify Plyr + HLS.js controls and audio switcher UI
  const testStreamUrl = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

  return (
    <main className="min-h-screen bg-gray-950 text-gray-50 p-6 md:p-12 font-body flex flex-col items-center">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight mb-2">
            Money Heist <span className="text-gray-400 font-normal text-2xl md:text-3xl">(La Casa de Papel)</span>
          </h1>
          <p className="text-emerald-400 font-medium">HLS.js + Plyr Multi-Audio PoC</p>
        </header>

        {/* Video Player Container */}
        <div className="mb-8">
          <CustomPlayer src={testStreamUrl} />
        </div>

        {/* Info Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg text-center">
          <h2 className="text-gray-300 font-medium text-lg mb-2">Multi-Audio Testing</h2>
          <p className="text-gray-500 text-sm">
            This player uses a placeholder `.m3u8` manifest to test the <strong>Plyr controls</strong> and 
            the custom <strong>HLS.js Audio Track Switcher</strong>. If the stream contains multiple audio languages, 
            a selector menu will dynamically appear overlaid on the top left of the video.
          </p>
        </div>
      </div>
    </main>
  );
}
