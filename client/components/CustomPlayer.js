'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Plyr } from 'plyr-react';
import 'plyr-react/plyr.css';
import Hls from 'hls.js';

export default function CustomPlayer({ videoSrc }) {
  const ref = useRef(null);
  const [audioTracks, setAudioTracks] = useState([]);
  const [activeTrack, setActiveTrack] = useState(-1);
  const [hlsInstance, setHlsInstance] = useState(null);

  useEffect(() => {
    let hls = null;

    const initHls = () => {
      // Plyr-react exposes the original video element via ref.current.plyr.elements.original
      const video = ref.current?.plyr?.elements?.original;
      if (!video) return;

      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
        });

        hls.loadSource(videoSrc);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          setAudioTracks(hls.audioTracks || []);
          setActiveTrack(hls.audioTrack);
          setHlsInstance(hls);
        });

        hls.on(Hls.Events.AUDIO_TRACK_SWITCHED, (event, data) => {
          setActiveTrack(data.id);
        });

      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        video.src = videoSrc;
      }
    };

    // Delay slightly to ensure Plyr DOM is fully mounted before attaching Hls.js
    const timeout = setTimeout(initHls, 100);

    return () => {
      clearTimeout(timeout);
      if (hls) {
        hls.destroy();
      }
    };
  }, [videoSrc]);

  const switchAudioTrack = (index) => {
    if (hlsInstance) {
      hlsInstance.audioTrack = index;
      setActiveTrack(index);
    }
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-2xl border border-gray-800 bg-black aspect-video custom-plyr-container">
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
      
      {/* Custom Audio Track Switcher Overlay */}
      {audioTracks && audioTracks.length > 1 && (
        <div className="absolute top-4 left-4 z-[50] bg-gray-900/90 backdrop-blur border border-gray-700 rounded-lg p-3 shadow-xl transition-opacity hover:opacity-100 opacity-80">
          <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 block">Audio Track</label>
          <div className="flex flex-col gap-1">
            {audioTracks.map((track, idx) => (
              <button
                key={idx}
                onClick={() => switchAudioTrack(idx)}
                className={`text-left px-3 py-1.5 rounded text-sm transition-all duration-200 ${
                  activeTrack === idx
                    ? 'bg-indigo-600 text-white font-medium shadow-md'
                    : 'bg-transparent text-gray-300 hover:bg-gray-800'
                }`}
              >
                {track.name || track.lang || `Track ${idx + 1}`}
              </button>
            ))}
          </div>
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
