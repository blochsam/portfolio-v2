import React, { useState, useEffect, Suspense, lazy, Component } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import { track } from '../utils/track';
import Experience2D from './Experience2D';
import { AppShellContext } from '../types';

// 3D is opt-in. The Spline chunk (and its heavy scene asset) load only when a
// visitor actually enters 3D — never eagerly on the default landing — so the
// static site stays instant for everyone who doesn't choose the immersive view.
const Experience3D = lazy(() => import('./Experience3D'));

/**
 * Shown while the 3D chunk loads. Leads with who Sam is and offers an
 * immediate exit to the static site, so impatient visitors aren't stuck
 * staring at jargon with no way out.
 */
const Experience3DLoadingFallback = ({ onSkip }: { onSkip: () => void }) => (
  <div className="fixed inset-0 bg-[#121212] flex flex-col items-center justify-center z-0 px-6">
    {/* Poster frame paints the desk instantly behind the loading copy */}
    <img src="/scene-poster.webp" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/70 via-[#121212]/25 to-[#121212]/85" />
    <div className="text-center relative z-10">
      <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2">
        <span className="text-white">SAM</span> <span className="text-[#24A2A7]">BLOCH</span>
      </h1>
      <p className="text-xs uppercase tracking-[0.3em] text-gray-300 mb-10">Program Manager · AI Builder · Educator</p>
      <div className="animate-pulse mb-8">
        <span className="text-[10px] font-mono uppercase tracking-[0.6em] text-white/45">Building the workspace…</span>
      </div>
      <button
        onClick={onSkip}
        className="px-6 py-3 min-h-[44px] rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-white hover:border-[#24A2A7]/40 transition-[color,border-color,transform] active:scale-95"
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
  // 2D is the default landing for everyone — it matches the pre-rendered HTML,
  // so first paint is instant and there's no flash. 3D is opted into below.
  const [is3D, setIs3D] = useState<boolean>(false);
  const context = useOutletContext<AppShellContext>();
  const location = useLocation();

  useEffect(() => {
    // Navigated here with force2D signal ("Switch to Static Site"). Only a
    // deliberate, non-transient choice persists for the session.
    if (location.state?.force2D) {
      if (!location.state?.transient) {
        sessionStorage.setItem('experienceChoice.v2', '2d');
      }
      setIs3D(false);
      // Clear the state so refreshing doesn't stick on 2D
      window.history.replaceState({}, '');
      return;
    }
    // Respect an explicit 3D choice made earlier this session (via the
    // "Enter Immersive 3D" button / the /3d route), so navigating Home keeps
    // a visitor who opted in inside the immersive view — and the scene is
    // already warm in the service-worker cache, so it's instant.
    if (sessionStorage.getItem('experienceChoice.v2') === '3d') {
      setIs3D(true);
      return;
    }
    // Everyone else gets the fast static site. The 3D desk is a heavy download,
    // so it loads only when a visitor opts in — it stays one click away.
    setIs3D(false);
  }, [location.state]);

  // Which experience visitors actually land in (3d / 2d, and why)
  useEffect(() => {
    if (is3D !== null) {
      track('experience_mode', {
        mode: is3D ? '3d' : '2d',
        chose2D: sessionStorage.getItem('experienceChoice.v2') === '2d',
      });
    }
  }, [is3D]);

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
