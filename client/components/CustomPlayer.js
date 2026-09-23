'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Plyr } from 'plyr-react';
import 'plyr-react/plyr.css';
import Hls from 'hls.js';

export default function CustomPlayer({ videoSrc }) {
  const ref = useRef(null);
  const [audioTracks, setAudioTracks] = useState([]);
  const [hlsInstance, setHlsInstance] = useState(null);

  useEffect(() => {
    let hls = null;
    const player = ref.current?.plyr;

    const handleLanguageChange = (event) => {
      if (hls) {
        const selectedIndex = event.detail?.index ?? event.detail?.plyr?.language ?? -1;
        if (selectedIndex !== -1) {
          hls.audioTrack = selectedIndex;
        }
      }
    };

    const initHls = () => {
      const video = ref.current?.plyr?.elements?.original;
      const currentPlayer = ref.current?.plyr;
      if (!video) return;

      if (currentPlayer?.elements?.container) {
        currentPlayer.elements.container.addEventListener('languagechange', handleLanguageChange);
      }

      if (Hls.isSupported()) {
        hls = new Hls({ enableWorker: true });
        hls.loadSource(videoSrc);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          const tracks = hls.audioTracks || [];
          setAudioTracks(tracks);
          setHlsInstance(hls);

          // Force update DOM if Plyr didn't render the audio menu natively
          // Undocumented Plyr DOM manipulation to inject audio tracks into the settings menu
          setTimeout(() => {
            if (!player || !player.elements.settings.menu) return;
            const settingsMenu = player.elements.settings.menu;
            
            // Check if audio tab already exists natively
            if (!settingsMenu.querySelector('[data-plyr="audio"]')) {
              // Create the Audio menu entry in the home settings panel
              const homeSettings = settingsMenu.querySelector('#plyr-settings-' + player.id + '-home');
              if (homeSettings && tracks.length > 1) {
                const audioTabHTML = `
                  <div class="plyr__menu__container" id="plyr-settings-${player.id}-audio" hidden>
                    <div class="plyr__menu__value">
                      <button data-plyr="back" type="button" class="plyr__control plyr__control--back">
                        <span class="plyr__menu__value">Audio</span>
                      </button>
                    </div>
                    <div class="plyr__menu__choices">
                      ${tracks.map((t, i) => `
                        <button data-plyr="language" type="button" class="plyr__control" data-value="${i}" ${hls.audioTrack === i ? 'aria-checked="true"' : ''}>
                          <span>${t.name || t.lang || `Track ${i + 1}`}</span>
                        </button>
                      `).join('')}
                    </div>
                  </div>
                `;
                
                const audioMenuBtnHTML = `
                  <button data-plyr="audio" type="button" class="plyr__control plyr__control--forward" aria-haspopup="true" aria-expanded="false" aria-controls="plyr-settings-${player.id}-audio">
                    <span>Audio</span>
                    <span class="plyr__menu__value">${tracks[hls.audioTrack]?.name || tracks[hls.audioTrack]?.lang || 'Default'}</span>
                  </button>
                `;

                // Append the nested menu and the button
                homeSettings.insertAdjacentHTML('beforeend', audioMenuBtnHTML);
                settingsMenu.insertAdjacentHTML('beforeend', audioTabHTML);

                // Add event listeners to the newly injected DOM elements
                const newTab = settingsMenu.querySelector(`#plyr-settings-${player.id}-audio`);
                const newBtn = homeSettings.querySelector('[data-plyr="audio"]');
                
                newBtn.addEventListener('click', () => {
                  homeSettings.hidden = true;
                  newTab.hidden = false;
                });

                const backBtn = newTab.querySelector('[data-plyr="back"]');
                backBtn.addEventListener('click', () => {
                  newTab.hidden = true;
                  homeSettings.hidden = false;
                });

                const choices = newTab.querySelectorAll('[data-plyr="language"]');
                choices.forEach(choice => {
                  choice.addEventListener('click', (e) => {
                    const idx = Number(e.currentTarget.getAttribute('data-value'));
                    // Fire custom language change event on the player
                    const event = new CustomEvent('languagechange', { detail: { index: idx } });
                    player.elements.container.dispatchEvent(event);
                    
                    // Update UI states
                    choices.forEach(c => c.removeAttribute('aria-checked'));
                    e.currentTarget.setAttribute('aria-checked', 'true');
                    newBtn.querySelector('.plyr__menu__value').innerText = e.currentTarget.innerText;
                    newTab.hidden = true;
                    homeSettings.hidden = false;
                  });
                });
              }
            }
          }, 300);
        });

      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSrc;
      }
    };

    const timeout = setTimeout(initHls, 100);

    return () => {
      clearTimeout(timeout);
      const currentPlayer = ref.current?.plyr;
      if (currentPlayer?.elements?.container) {
        currentPlayer.elements.container.removeEventListener('languagechange', handleLanguageChange);
      }
      if (hls) {
        hls.destroy();
      }
    };
  }, [videoSrc]);

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
          settings: ['quality', 'speed', 'audio'],
        }}
      />

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
