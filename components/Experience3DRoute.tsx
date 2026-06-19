import React, { useEffect, Suspense, lazy, Component } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { AppShellContext } from '../types';
import { usePageMeta } from '../utils/usePageMeta';
import { ROUTE_META } from '../data/routeMeta';

const Experience3D = lazy(() => import('./Experience3D'));

/**
 * Catches WebGL/Spline crashes on the /3d route and redirects to the 2D home.
 */
class WebGLErrorBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const WebGLFallback: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // Redirect to 2D home after a brief moment
    // transient: a crash fallback is not a user preference
    const t = setTimeout(() => navigate('/', { state: { force2D: true, transient: true }, replace: true }), 100);
    return () => clearTimeout(t);
  }, [navigate]);
  return (
    <div className="fixed inset-0 bg-[#121212] flex items-center justify-center">
      <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/50 animate-pulse">
        3D unavailable, loading static site...
      </span>
    </div>
  );
};

const Experience3DRoute: React.FC = () => {
  const context = useOutletContext<AppShellContext>();
  const navigate = useNavigate();
  usePageMeta(ROUTE_META['/3d']);

  useEffect(() => {
    // Entering 3D explicitly clears any stored preference for the static site
    sessionStorage.setItem('experienceChoice.v2', '3d');
  }, []);

  return (
    <WebGLErrorBoundary fallback={<WebGLFallback />}>
      <div className="animate-in fade-in duration-1000 h-screen w-screen overflow-hidden">
        <Suspense fallback={
          <div className="fixed inset-0 bg-[#121212] flex flex-col items-center justify-center px-6">
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
                onClick={() => navigate('/', { state: { force2D: true, transient: true } })}
                className="px-6 py-3 min-h-[44px] rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-white hover:border-[#24A2A7]/40 transition-[color,border-color,transform] active:scale-95"
              >
                Skip — view the static site
              </button>
            </div>
          </div>
        }>
          <Experience3D
            setSelectedContent={context.setSelectedContent}
            openAbout={context.openAbout}
          />
        </Suspense>
      </div>
    </WebGLErrorBoundary>
  );
};

export default Experience3DRoute;
