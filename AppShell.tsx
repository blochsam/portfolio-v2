import React, { useState, useEffect, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AudioPlayer from './components/AudioPlayer';
import Footer from './components/Footer';
import Overlay from './components/Overlay';
import { PortfolioContent, AppShellContext } from './types';

/* #6 Lazy-load AboutOverlay — defers ~6 images until user opens it */
const AboutOverlay = React.lazy(() => import('./components/AboutOverlay'));

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

  /* Footer is always fixed across all pages */

  const context: AppShellContext = {
    setSelectedContent,
    openAbout: () => setIsAboutOpen(true),
  };

  return (
    <div className="relative w-full h-full bg-[#121212]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-6 focus:py-3 focus:rounded-full focus:bg-[#24A2A7] focus:text-[#121212] focus:font-black focus:uppercase focus:text-[10px] focus:tracking-widest focus:shadow-xl"
      >
        Skip to content
      </a>
      <AudioPlayer />
      <div id="main-content">
        <Outlet context={context} />
      </div>
      <Overlay
        content={selectedContent}
        onClose={() => setSelectedContent(null)}
      />
      <Suspense fallback={null}>
        <AboutOverlay
          isOpen={isAboutOpen}
          onClose={() => setIsAboutOpen(false)}
        />
      </Suspense>
      {!isOverlayOpen && (
        <Footer />
      )}
    </div>
  );
};

export default AppShell;
