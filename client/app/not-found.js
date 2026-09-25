import Link from 'next/link';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b0f0a] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Animated Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#a7c957]/10 blur-[120px] rounded-full pointer-events-none" />

      <AlertTriangle className="w-24 h-24 text-[#a7c957] mb-8 animate-bounce" />
      <h1 className="text-7xl font-black text-[#f3f4f6] mb-4 tracking-tighter">404</h1>
      <h2 className="text-3xl font-bold text-[#f3f4f6] mb-6">Lost in the Fandom Universe</h2>
      <p className="text-gray-400 max-w-lg mb-10 text-lg">
        The movie, show, or category you're looking for has been pulled into a black hole. Let's get you back to safe space.
      </p>

      <Link href="/" className="flex items-center gap-2 bg-gradient-to-r from-[#a7c957] to-[#c2e078] text-[#0b0f0a] font-bold py-3 px-8 rounded-full shadow-[0_0_20px_rgba(167,201,87,0.4)] hover:scale-105 transition-all">
        <Home className="w-5 h-5" />
        Return Home
      </Link>
    </div>
  );
}
