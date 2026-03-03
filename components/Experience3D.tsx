import React, { useState, useRef, Suspense, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import { Howl } from 'howler';
import { CONTENT_MAP, COLORS, LOGO } from '../constants';
import { PortfolioContent, SplineObjectId } from '../types';
import { Menu, X } from 'lucide-react';

interface Experience3DProps {
  setSelectedContent: (content: PortfolioContent | null) => void;
  openAbout: () => void;
}

const Experience3D: React.FC<Experience3DProps> = ({ setSelectedContent, openAbout }) => {
  const navigate = useNavigate();
  const [hoveredMenuId, setHoveredMenuId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDeskHint, setShowDeskHint] = useState(true);
  const [hintFading, setHintFading] = useState(false);
  const splineAppRef = useRef<any>(null);
  const hintTimeoutRef = useRef<number | null>(null);
  const lastHoverPosRef = useRef<{ x: number; y: number } | null>(null);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const hoverFrom3DRef = useRef(false);

  const menuItems = (Object.keys(CONTENT_MAP) as SplineObjectId[]).filter(
    (id) => id !== '1dfa5782-8ffc-47dc-9562-db86cba5ee72'
  );

  // Samulation hint: show on first visit, fade after ~4 seconds
  useEffect(() => {
    const fadeTimeout = window.setTimeout(() => {
      setHintFading(true);
      hintTimeoutRef.current = window.setTimeout(() => {
        setShowDeskHint(false);
      }, 800);
    }, 4000);
    return () => {
      window.clearTimeout(fadeTimeout);
      if (hintTimeoutRef.current) window.clearTimeout(hintTimeoutRef.current);
    };
  }, []);

  const findContentInHierarchy = useCallback((obj: any): PortfolioContent | null => {
    let current = obj;
    while (current) {
      const keysToTest = [current.uuid, current.id, current.name];
      for (const k of keysToTest) {
        if (k && CONTENT_MAP[k as SplineObjectId]) return CONTENT_MAP[k as SplineObjectId];
      }
      if (!current.parent || current.parent === current) break;
      current = current.parent;
    }
    return null;
  }, []);

  const findContentKeyInHierarchy = useCallback((obj: any): string | null => {
    let current = obj;
    while (current) {
      const keysToTest = [current.uuid, current.id, current.name];
      for (const k of keysToTest) {
        if (k && CONTENT_MAP[k as SplineObjectId]) return k;
      }
      if (!current.parent || current.parent === current) break;
      current = current.parent;
    }
    return null;
  }, []);

  const onLoad = (splineApp: any) => {
    splineAppRef.current = splineApp;
    splineApp.addEventListener('mouseHover', (e: any) => {
      const key = findContentKeyInHierarchy(e.target);
      if (key) {
        hoverFrom3DRef.current = true;
        lastHoverPosRef.current = { x: lastMousePosRef.current.x, y: lastMousePosRef.current.y };
        setHoveredMenuId(key);
      }
    });
    splineApp.addEventListener('mouseDown', (e: any) => {
      const content = findContentInHierarchy(e.target);
      
      if (!content) return;

      // Handle Sesame sound effect
      if (content.id === 'sesame') {
        try {
          const meow = new Howl({
            src: ['/meow.mp3'],
            volume: 0.6,
            html5: true
          });
          meow.play();
        } catch (err) {
          console.warn("Could not play meow sound", err);
        }
      }

      // Navigation logic
      if (content.id === 'guitar') {
        openAbout();
      } else {
        setSelectedContent(content);
      }
    });
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#121212] overflow-hidden select-none">
      {/* Background Loading State (Visible behind Spline) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-0">
        <div className="text-center animate-pulse">
          <span className="text-[10px] font-mono uppercase tracking-[0.8em] text-white/20 mb-4 block">Uplink established</span>
          <h2 className="text-xl font-black uppercase tracking-[0.4em] text-white/10">Initializing Samulation...</h2>
        </div>
      </div>

      <Suspense fallback={null}>
        <div 
          className="w-full h-full relative z-10"
          onMouseMove={(e) => {
            const { clientX, clientY } = e;
            lastMousePosRef.current = { x: clientX, y: clientY };
            if (hoverFrom3DRef.current && lastHoverPosRef.current) {
              const dx = clientX - lastHoverPosRef.current.x;
              const dy = clientY - lastHoverPosRef.current.y;
              if (Math.sqrt(dx * dx + dy * dy) > 40) {
                setHoveredMenuId(null);
                lastHoverPosRef.current = null;
                hoverFrom3DRef.current = false;
              }
            }
          }}
          onMouseLeave={() => {
            setHoveredMenuId(null);
            lastHoverPosRef.current = null;
            hoverFrom3DRef.current = false;
          }}
        >
          <Spline 
            scene="https://prod.spline.design/PWw4ZCT9Of0-KIiv/scene.splinecode" 
            onLoad={onLoad}
          />
        </div>
      </Suspense>

      {/* Samulation hint - center top, fades after a few seconds */}
      {showDeskHint && (
        <div 
          className={`absolute left-1/2 -translate-x-1/2 top-24 z-30 pointer-events-none transition-opacity duration-700 ease-out ${
            hintFading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-6 py-3 rounded-full bg-black/40 backdrop-blur-md border border-white/5 shadow-xl">
            Click and drag to explore Sam&apos;s desk
          </p>
        </div>
      )}

      {/* HUD: Top Left */}
      <div className="absolute top-8 left-8 z-20 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2 leading-none">
            <span className="text-white">SAM</span>
            <span style={{ color: COLORS.teal }}>BLOCH</span>
          </h1>
        </div>
        
        {/* Only visible on non-mobile in the traditional HUD layout */}
        <div className="hidden md:flex flex-col gap-2">
          <button
            onClick={() => navigate('/', { state: { force2D: true } })}
            className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-all bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/5 hover:border-[#24A2A7]/40 shadow-xl active:scale-95"
          >
            <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Switch to Static Site
          </button>
        </div>
      </div>

      {/* HUD: Top Right Menu (Desktop) */}
      <div className="absolute top-10 right-10 z-20 hidden md:flex flex-nowrap justify-end items-center gap-6 lg:gap-10 max-w-[70vw] overflow-hidden">
        {menuItems.map(uuid => (
          <button 
            key={uuid}
            onMouseEnter={() => {
              hoverFrom3DRef.current = false;
              setHoveredMenuId(uuid);
              splineAppRef.current?.emitEvent('mouseHover', uuid);
            }}
            onMouseLeave={() => {
              setHoveredMenuId(null);
              splineAppRef.current?.emitEventReverse('mouseHover', uuid);
            }}
            onClick={() => {
              if (CONTENT_MAP[uuid].id === 'guitar') {
                openAbout();
              } else {
                setSelectedContent(CONTENT_MAP[uuid]);
              }
            }}
            className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-300 relative group py-2 whitespace-nowrap
              ${hoveredMenuId === uuid ? 'text-[#24A2A7]' : 'text-gray-500 hover:text-white'}`}
          >
            {CONTENT_MAP[uuid].title.split(' ')[0]}
            <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#24A2A7] transition-all duration-500 
              ${hoveredMenuId === uuid ? 'w-full' : 'w-0'}`}>
            </span>
          </button>
        ))}
        {/* Responsive Resume item: remains in-line, hides if screen gets too small (below lg) */}
        <button 
          onMouseEnter={() => {
            hoverFrom3DRef.current = false;
            setHoveredMenuId('resume-btn');
          }}
          onMouseLeave={() => setHoveredMenuId(null)}
          onClick={() => navigate('/resume')}
          className={`hidden lg:block text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-300 relative group py-2 whitespace-nowrap
            ${hoveredMenuId === 'resume-btn' ? 'text-[#24A2A7]' : 'text-gray-500 hover:text-white'}`}
        >
          Resume
          <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#24A2A7] transition-all duration-500 
            ${hoveredMenuId === 'resume-btn' ? 'w-full' : 'w-0'}`}>
          </span>
        </button>
      </div>

      {/* Mobile Hamburger Button (Top Right) */}
      <div className="md:hidden absolute top-8 right-8 z-[110]">
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-3 bg-black/40 backdrop-blur-md border border-white/5 rounded-full text-gray-400 hover:text-white transition-all shadow-xl"
          aria-label="Open Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[120] bg-[#121212] flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-8 right-8 p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Close Menu"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="flex flex-col gap-10 text-center">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/', { state: { force2D: true } });
              }}
              className="text-3xl font-black uppercase tracking-tighter hover:text-[#24A2A7] transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
              }}
              className="text-3xl font-black uppercase tracking-tighter text-[#24A2A7] transition-colors"
            >
              3D Experience
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openAbout();
              }}
              className="text-3xl font-black uppercase tracking-tighter hover:text-[#24A2A7] transition-colors"
            >
              About
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/projects');
              }}
              className="text-3xl font-black uppercase tracking-tighter hover:text-[#24A2A7] transition-colors"
            >
              Projects & Artifacts
            </button>
            <a 
              href="/SBloch_Resume.pdf" 
              download="SBloch_Resume.pdf"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-3xl font-black uppercase tracking-tighter hover:text-[#24A2A7] transition-colors"
            >
              Resume
            </a>
          </div>
          
          <div className="mt-20 opacity-20 scale-75">
            {LOGO}
          </div>
        </div>
      )}

    </div>
  );
};

export default Experience3D;