import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { BRAND_COLORS } from '../constants';
import { Howl } from 'howler';

export const AudioPlayer: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(24);
  const soundRef = useRef<Howl | null>(null);
  const popupTimeoutRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const sound = new Howl({
      src: ['/paper-clips.mp3'],
      loop: true,
      volume: 0.3,
      html5: true,
      onload: () => {
        setLoadError(false);
      },
      onloaderror: (_id, _error) => {
        if (sound.state() === 'unloaded') {
          setLoadError(true);
        }
      },
      onplayerror: () => {
        sound.once('unlock', () => {
          sound.play();
        });
      }
    });

    soundRef.current = sound;

    return () => {
      sound.unload();
      soundRef.current = null;
      if (popupTimeoutRef.current) window.clearTimeout(popupTimeoutRef.current);
    };
  }, []);

  /* Dynamic positioning: sit near bottom, slide up when footer scrolls in */
  const updatePosition = useCallback(() => {
    const footer = document.getElementById('site-footer');
    if (!footer) {
      setBottomOffset(24);
      return;
    }

    const footerRect = footer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const defaultBottom = 24;
    const gap = 16;

    if (footerRect.top < viewportHeight) {
      // Footer is visible — push toggle above it
      const overlap = viewportHeight - footerRect.top;
      setBottomOffset(Math.max(defaultBottom, overlap + gap));
    } else {
      setBottomOffset(defaultBottom);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updatePosition(); // initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updatePosition]);

  const toggle = () => {
    if (!soundRef.current) return;

    if (playing) {
      soundRef.current.pause();
      setIsVisible(false);
    } else {
      soundRef.current.play();
      setIsVisible(true);
      if (popupTimeoutRef.current) window.clearTimeout(popupTimeoutRef.current);
      popupTimeoutRef.current = window.setTimeout(() => {
        setIsVisible(false);
      }, 1500);
    }
    setPlaying(!playing);
  };

  if (loadError) {
    return (
      <div
        className="fixed left-6 z-50 flex items-center gap-2 px-4 py-2 bg-red-900/20 border border-red-900/50 rounded-full backdrop-blur-md transition-[bottom] duration-300 ease-out pointer-events-auto"
        style={{ bottom: bottomOffset }}
      >
        <AlertCircle className="w-4 h-4 text-red-500" />
        <span className="text-[10px] uppercase font-bold tracking-tighter text-red-500">Audio Failed</span>
      </div>
    );
  }

  return (
    <div
      className="fixed left-6 z-50 flex items-center transition-[bottom] duration-300 ease-out pointer-events-none"
      style={{ bottom: bottomOffset }}
    >
      <button
        onClick={toggle}
        className="p-3 rounded-full border-2 transition-all hover:scale-110 active:scale-90 group backdrop-blur-md relative pointer-events-auto"
        style={{
          borderColor: playing ? BRAND_COLORS.teal : '#333333',
          backgroundColor: playing ? `${BRAND_COLORS.teal}20` : 'rgba(0,0,0,0.4)'
        }}
        aria-label="Toggle Music"
      >
        {playing ? (
          <Volume2 className="w-6 h-6" style={{ color: BRAND_COLORS.teal }} />
        ) : (
          <VolumeX className="w-6 h-6 text-gray-500" />
        )}
      </button>

      <div
        className={`ml-4 px-4 py-2 bg-black/80 text-[11px] font-bold text-[#24A2A7] border border-[#24A2A7]/30 backdrop-blur-md rounded-full pointer-events-none whitespace-nowrap shadow-xl transition-all duration-500 ease-in-out ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
        }`}
      >
        Enjoy some plunky browse music :)
      </div>
    </div>
  );
};

export default AudioPlayer;
