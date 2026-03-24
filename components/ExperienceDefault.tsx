import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import Experience2D from './Experience2D';
import { AppShellContext } from '../types';

// Eagerly kick off the import on desktop so the 2MB chunk starts downloading
// immediately instead of waiting for useEffect → setState → re-render.
const experience3DImport = typeof window !== 'undefined' &&
  !window.matchMedia('(pointer: coarse)').matches &&
  window.innerWidth >= 768
    ? import('./Experience3D')
    : null;

const Experience3D = lazy(() => experience3DImport || import('./Experience3D'));

const Experience3DLoadingFallback = () => (
  <div className="fixed inset-0 bg-[#121212] flex flex-col items-center justify-center z-0">
    <div className="text-center animate-pulse">
      <span className="text-[10px] font-mono uppercase tracking-[0.8em] text-white/50 mb-4 block">Uplink established</span>
      <h2 className="text-xl font-black uppercase tracking-[0.4em] text-white/40">Initializing Samulation...</h2>
    </div>
  </div>
);

const ExperienceDefault: React.FC = () => {
  const [is3D, setIs3D] = useState<boolean | null>(null);
  const context = useOutletContext<AppShellContext>();
  const location = useLocation();

  useEffect(() => {
    // Check if navigated here with force2D signal (from "Switch to Static Site")
    if (location.state?.force2D) {
      setIs3D(false);
      // Clear the state so refreshing doesn't stick on 2D
      window.history.replaceState({}, '');
      return;
    }
    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    setIs3D(!isMobile);
  }, [location.state]);

  // Store which experience mode is active for back-navigation from subpages
  useEffect(() => {
    if (is3D !== null) {
      sessionStorage.setItem('experienceMode', is3D ? '3d' : '2d');
    }
  }, [is3D]);

  if (is3D === null) {
    return (
      <div className="fixed inset-0 bg-[#121212] flex items-center justify-center">
        <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/50 animate-pulse">
          Initializing Samulation...
        </span>
      </div>
    );
  }

  return is3D ? (
    <div className="animate-in fade-in duration-1000 h-screen w-screen overflow-hidden">
      <Suspense fallback={<Experience3DLoadingFallback />}>
        <Experience3D
          setSelectedContent={context.setSelectedContent}
          openAbout={context.openAbout}
        />
      </Suspense>
    </div>
  ) : (
    <div className="animate-in fade-in duration-1000">
      <Experience2D
        setSelectedContent={context.setSelectedContent}
        openAbout={context.openAbout}
      />
    </div>
  );
};

export default ExperienceDefault;
