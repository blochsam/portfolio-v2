import React, { useState, useEffect, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AudioPlayer from './components/AudioPlayer';
import Footer from './components/Footer';
import Overlay from './components/Overlay';
import SiteNav from './components/SiteNav';
import { track } from './utils/track';
import { PortfolioContent, AppShellContext } from './types';

/* #6 Lazy-load AboutOverlay — defers ~6 images until user opens it */
const AboutOverlay = React.lazy(() => import('./components/AboutOverlay'));

const AppShell: React.FC = () => {
  const [selectedContent, setSelectedContent] = useState<PortfolioContent | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const location = useLocation();

  // Scroll to top on route change + record pageview for the monthly report
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    track('pageview');
  }, [location.pathname]);

  // Close overlays on route change
  useEffect(() => {
    setSelectedContent(null);
    setIsAboutOpen(false);
  }, [location.pathname]);

  const isOverlayOpen = selectedContent !== null || isAboutOpen;

  // Lock body scroll when any overlay is open (prevents iOS Safari background scroll)
  useEffect(() => {
    document.body.style.overflow = isOverlayOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOverlayOpen]);

  /* Home experiences carry their own HUD nav; subpages get the slim SiteNav */
  const showSiteNav = location.pathname !== '/' && location.pathname !== '/3d';

  /* Long-scroll pages get an inline footer at the end of content instead of a
     fixed bar that permanently eats viewport height and collides with FABs */
  const inlineFooter = /^\/(projects|resume|privacy-policy|about)/.test(location.pathname);

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
      {showSiteNav && <SiteNav />}
      <main id="main-content">
        <Outlet context={context} />
      </main>
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
        <Footer isInline={inlineFooter} />
      )}
    </div>
  );
};

export default AppShell;
