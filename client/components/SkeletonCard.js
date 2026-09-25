'use client';

export default function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-40 h-60 sm:w-48 sm:h-72 bg-gray-800/50 rounded-xl overflow-hidden animate-pulse border border-white/5">
      <div className="w-full h-full bg-gradient-to-t from-gray-900/80 to-gray-800/20"></div>
    </div>
  );
}
