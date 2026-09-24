'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Plyr } from 'plyr-react';
import 'plyr-react/plyr.css';
import Hls from 'hls.js';

export default function CustomPlayer({ videoSrc, isTorrent, onError }) {
  const ref = useRef(null);
  const [audioTracks, setAudioTracks] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(0);
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const [hlsInstance, setHlsInstance] = useState(null);

  useEffect(() => {
    let hls = null;
    let videoElement = null;

    const handleError = (e) => {
      console.error('Video error:', e);
      if (onError) onError(e);
    };

    let watchdogTimer = null;
    let clearWatchdog = null;

    const initHls = () => {
      const player = ref.current?.plyr;
      const video = player?.elements?.original;
      if (!video) return;
      videoElement = video;

      // Add error listener for 404/500 backend timeouts
      video.addEventListener('error', handleError);

      // Smart Watchdog Timer
      clearWatchdog = () => {
        if (watchdogTimer) clearTimeout(watchdogTimer);
      };
      video.addEventListener('loadeddata', clearWatchdog);
      video.addEventListener('playing', clearWatchdog);

      watchdogTimer = setTimeout(() => {
        if (video.readyState === 0) {
          console.warn("Watchdog Timer: Video failed to load within 4000ms. Forcing cascade.");
          if (onError) onError(new Error("Watchdog timeout: Video dead"));
        }
      }, 4000);

      if (!videoSrc.includes('.m3u8')) {
        // Fallback for non-HLS direct proxy streams (e.g., Webtor.io MKV/MP4)
        player.source = {
          type: 'video',
          sources: [{ src: videoSrc, type: 'video/mp4' }]
        };
        player.play().catch(e => console.log("Autoplay blocked:", e));
        return;
      }

      if (Hls.isSupported()) {
        hls = new Hls({ enableWorker: true });
        hls.loadSource(videoSrc);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          const tracks = hls.audioTracks.map(t => t.name || t.lang || 'Unknown');
          setAudioTracks(tracks);
          setCurrentAudio(hls.audioTrack !== -1 ? hls.audioTrack : 0);
          setHlsInstance(hls);
        });

        hls.on(Hls.Events.AUDIO_TRACK_SWITCHED, (event, data) => {
          setCurrentAudio(data.id);
        });

        hls.on(Hls.Events.ERROR, function (event, data) {
          if (data.fatal) {
            console.error('HLS error:', data);
            if (onError) onError(data);
          }
        });

      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSrc;
      }
    };

    const timeout = setTimeout(initHls, 100);

    return () => {
      clearTimeout(timeout);
      if (watchdogTimer) clearTimeout(watchdogTimer);
      if (videoElement) {
        videoElement.removeEventListener('error', handleError);
        if (clearWatchdog) {
          videoElement.removeEventListener('loadeddata', clearWatchdog);
          videoElement.removeEventListener('playing', clearWatchdog);
        }
      }
      if (hls) {
        hls.destroy();
      }
    };
  }, [videoSrc, isTorrent, onError]);

  const handleAudioSwitch = (index) => {
    if (hlsInstance) {
      hlsInstance.audioTrack = index;
      setCurrentAudio(index);
      setShowAudioMenu(false);
    }
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-2xl border border-gray-800 bg-black aspect-video custom-plyr-container group">
      <Plyr
        ref={ref}
        source={{
          type: 'video',
          sources: [
            {
              src: videoSrc,
              provider: 'html5',
            },
          ],
        }}
        options={{
          controls: [
            'play-large', 'play', 'progress', 'current-time',
            'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'
          ],
          settings: ['quality', 'speed'],
        }}
      />

      {/* Custom React Audio Track Overlay */}
      {audioTracks.length > 1 && (
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => setShowAudioMenu(!showAudioMenu)}
            className="bg-gray-900/80 hover:bg-gray-800 backdrop-blur border border-gray-700 text-gray-200 px-4 py-2 rounded-lg text-sm font-medium shadow-xl transition-all"
          >
            Audio & Subtitles
          </button>

          {showAudioMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl p-2 z-50">
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 px-2 pt-1">
                Audio Track
              </div>
              <div className="flex flex-col gap-1">
                {audioTracks.map((trackName, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAudioSwitch(idx)}
                    className={`text-left px-3 py-2 rounded text-sm transition-all duration-200 flex items-center justify-between ${
                      currentAudio === idx
                        ? 'bg-indigo-600 text-white font-medium shadow-md'
                        : 'bg-transparent text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <span>{trackName}</span>
                    {currentAudio === idx && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Global CSS override to hide default Plyr background to prevent double backgrounds */}
      <style jsx global>{`
        .custom-plyr-container .plyr {
          width: 100%;
          height: 100%;
          border-radius: 0.75rem;
        }
      `}</style>
    </div>
  );
}
