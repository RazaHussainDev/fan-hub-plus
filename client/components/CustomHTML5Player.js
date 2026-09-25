'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

export default function CustomHTML5Player({ videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4" }) {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  
  const [isMounted, setIsMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(playerRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(playerRef.current.duration);
  };

  const handleSeek = (e) => {
    const newTime = e.target.value;
    playerRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    playerRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    playerRef.current.volume = newVolume;
    setVolume(newVolume);
    if (newVolume === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
  };

  if (!isMounted) return <div className="w-full aspect-video bg-black animate-pulse rounded-xl"></div>;

  return (
    <div 
      ref={containerRef} 
      className="relative w-full aspect-video bg-[#0b0f0a] rounded-xl overflow-hidden shadow-[0_0_40px_rgba(167,201,87,0.15)] border border-gray-800 group"
    >
      <video
        ref={playerRef}
        className="w-full h-full object-contain cursor-pointer bg-black"
        preload="metadata"
        crossOrigin="anonymous"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        controls={false}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-3">
        {/* Seek Bar */}
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #a7c957 ${(currentTime / duration) * 100 || 0}%, #4b5563 ${(currentTime / duration) * 100 || 0}%)`
          }}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Play/Pause Button */}
            <button onClick={togglePlay} className="text-[#f3f4f6] hover:text-[#a7c957] transition-colors focus:outline-none">
              {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2 group/volume relative">
              <button onClick={toggleMute} className="text-[#f3f4f6] hover:text-[#a7c957] transition-colors focus:outline-none">
                {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 opacity-0 group-hover/volume:w-24 group-hover/volume:opacity-100 transition-all duration-300 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #a7c957 ${isMuted ? 0 : volume * 100}%, #4b5563 ${isMuted ? 0 : volume * 100}%)`
                }}
              />
            </div>

            {/* Time Display */}
            <span className="text-[#f3f4f6] text-sm font-medium tracking-wide">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Fullscreen Button */}
            <button onClick={toggleFullscreen} className="text-[#f3f4f6] hover:text-[#a7c957] transition-colors focus:outline-none">
              {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Global styles for custom range inputs */}
      <style jsx>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #f3f4f6;
          cursor: pointer;
          transition: transform 0.1s;
        }
        input[type=range]::-webkit-slider-thumb:hover {
          transform: scale(1.3);
        }
      `}</style>
    </div>
  );
}
