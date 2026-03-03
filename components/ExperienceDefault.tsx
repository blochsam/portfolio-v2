import React, { useState, useEffect } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import Experience2D from './Experience2D';
import Experience3D from './Experience3D';
import { AppShellContext } from '../types';

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

  // Store last main view for back-navigation from subpages
  useEffect(() => {
    if (is3D !== null) {
      sessionStorage.setItem('lastMainView', is3D ? '/3d' : '/');
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
      <Experience3D
        setSelectedContent={context.setSelectedContent}
        openAbout={context.openAbout}
      />
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
