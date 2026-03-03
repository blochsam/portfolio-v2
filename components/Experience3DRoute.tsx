import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Experience3D from './Experience3D';
import { AppShellContext } from '../types';

const Experience3DRoute: React.FC = () => {
  const context = useOutletContext<AppShellContext>();

  // Store last main view for back-navigation from subpages
  useEffect(() => {
    sessionStorage.setItem('lastMainView', '/3d');
  }, []);

  return (
    <div className="animate-in fade-in duration-1000 h-screen w-screen overflow-hidden">
      <Experience3D
        setSelectedContent={context.setSelectedContent}
        openAbout={context.openAbout}
      />
    </div>
  );
};

export default Experience3DRoute;
