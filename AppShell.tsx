import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AudioPlayer from './components/AudioPlayer';
import Footer from './components/Footer';
import Overlay from './components/Overlay';
import AboutOverlay from './components/AboutOverlay';
import { PortfolioContent, AppShellContext } from './types';

const AppShell: React.FC = () => {
  const [selectedContent, setSelectedContent] = useState<PortfolioContent | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  // Close overlays on route change
  useEffect(() => {
    setSelectedContent(null);
    setIsAboutOpen(false);
  }, [location.pathname]);

  const isOverlayOpen = selectedContent !== null || isAboutOpen;
  const isSubpage = location.pathname.startsWith('/resume') ||
    location.pathname.startsWith('/projects');

  const context: AppShellContext = {
    setSelectedContent,
    openAbout: () => setIsAboutOpen(true),
  };

  return (
    <div className="relative w-full h-full bg-[#121212]">
      <AudioPlayer />
      <Outlet context={context} />
      <Overlay
        content={selectedContent}
        onClose={() => setSelectedContent(null)}
      />
      <AboutOverlay
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
      {!isOverlayOpen && !isSubpage && <Footer />}
    </div>
  );
};

export default AppShell;
