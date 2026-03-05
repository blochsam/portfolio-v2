import React, { useEffect, Suspense, lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AppShellContext } from '../types';

const Experience3D = lazy(() => import('./Experience3D'));

const Experience3DRoute: React.FC = () => {
  const context = useOutletContext<AppShellContext>();

  useEffect(() => {
    sessionStorage.setItem('experienceMode', '3d');
  }, []);

  return (
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
  );
};

export default Experience3DRoute;
