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
    const t = setTimeout(() => navigate('/', { state: { force2D: true }, replace: true }), 100);
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
  usePageMeta(ROUTE_META['/3d']);

  useEffect(() => {
    sessionStorage.setItem('experienceMode', '3d');
  }, []);

  return (
    <WebGLErrorBoundary fallback={<WebGLFallback />}>
      <div className="animate-in fade-in duration-1000 h-screen w-screen overflow-hidden">
        <Suspense fallback={
          <div className="fixed inset-0 bg-[#121212] flex flex-col items-center justify-center">
            <div className="text-center animate-pulse">
              <span className="text-[10px] font-mono uppercase tracking-[0.8em] text-white/50 mb-4 block">Uplink established</span>
              <h2 className="text-xl font-black uppercase tracking-[0.4em] text-white/40">Initializing Samulation...</h2>
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
