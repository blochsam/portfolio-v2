import React, { useState, useEffect, Suspense, lazy, Component } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import { track } from '@vercel/analytics';
import Experience2D from './Experience2D';
import { AppShellContext } from '../types';

// Start loading the 2MB 3D chunk on desktop, but defer to idle so it doesn't
// compete with first paint. Falls back to immediate import if requestIdleCallback
// isn't available (Safari <16.4).
let experience3DImport: Promise<typeof import('./Experience3D')> | null = null;

if (typeof window !== 'undefined' &&
    !window.matchMedia('(pointer: coarse)').matches &&
    window.innerWidth >= 768) {
  if ('requestIdleCallback' in window) {
    experience3DImport = new Promise((resolve) => {
      window.requestIdleCallback(() => {
        resolve(import('./Experience3D'));
      });
    });
  } else {
    experience3DImport = import('./Experience3D');
  }
}

const Experience3D = lazy(() => experience3DImport || import('./Experience3D'));

/**
 * Shown while the 3D chunk loads. Leads with who Sam is and offers an
 * immediate exit to the static site, so impatient visitors aren't stuck
 * staring at jargon with no way out.
 */
const Experience3DLoadingFallback = ({ onSkip }: { onSkip: () => void }) => (
  <div className="fixed inset-0 bg-[#121212] flex flex-col items-center justify-center z-0 px-6">
    <div className="text-center">
      <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2">
        <span className="text-white">SAM</span> <span className="text-[#24A2A7]">BLOCH</span>
      </h1>
      <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-10">Program Manager · AI Builder · College Educator</p>
      <div className="animate-pulse mb-10">
        <span className="text-[10px] font-mono uppercase tracking-[0.8em] text-white/50 mb-3 block">Uplink established</span>
        <h2 className="text-lg font-black uppercase tracking-[0.4em] text-white/40">Loading 3D experience...</h2>
      </div>
      <button
        onClick={onSkip}
        className="px-6 py-3 min-h-[44px] rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:border-[#24A2A7]/40 transition-[color,border-color,transform] active:scale-95"
      >
        Skip — view the static site
      </button>
    </div>
  </div>
);

/**
 * Catches WebGL/Spline crashes and falls back to the 2D experience
 * instead of showing a raw error screen.
 */
interface WebGLErrorBoundaryProps {
  children: React.ReactNode;
  onFallback: () => void;
}

class WebGLErrorBoundary extends Component<WebGLErrorBoundaryProps, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidUpdate(_prevProps: WebGLErrorBoundaryProps, prevState: { hasError: boolean }) {
    if (this.state.hasError && !prevState.hasError) {
      this.props.onFallback();
    }
  }

  render() {
    if (this.state.hasError) {
      return null; // Parent will render 2D instead
    }
    return this.props.children;
  }
}

const ExperienceDefault: React.FC = () => {
  const [is3D, setIs3D] = useState<boolean | null>(null);
  const context = useOutletContext<AppShellContext>();
  const location = useLocation();

  useEffect(() => {
    // Navigated here with force2D signal ("Switch to Static Site" / "Skip").
    // This is the ONLY path that persists a 2D preference — crash fallbacks
    // and device detection must never stick, or one bad WebGL moment locks
    // the whole session out of 3D.
    if (location.state?.force2D) {
      sessionStorage.setItem('experienceChoice', '2d');
      setIs3D(false);
      // Clear the state so refreshing doesn't stick on 2D
      window.history.replaceState({}, '');
      return;
    }
    // Respect an earlier explicit choice of the static site this session.
    if (sessionStorage.getItem('experienceChoice') === '2d') {
      setIs3D(false);
      return;
    }
    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    setIs3D(!isMobile);
  }, [location.state]);

  // Which experience visitors actually land in (3d / 2d, and why)
  useEffect(() => {
    if (is3D !== null) {
      track('experience_mode', {
        mode: is3D ? '3d' : '2d',
        chose2D: sessionStorage.getItem('experienceChoice') === '2d',
      });
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
    <WebGLErrorBoundary onFallback={() => setIs3D(false)}>
      <div className="animate-in fade-in duration-1000 h-screen w-screen overflow-hidden">
        <Suspense fallback={<Experience3DLoadingFallback onSkip={() => setIs3D(false)} />}>
          <Experience3D
            setSelectedContent={context.setSelectedContent}
            openAbout={context.openAbout}
          />
        </Suspense>
      </div>
    </WebGLErrorBoundary>
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
