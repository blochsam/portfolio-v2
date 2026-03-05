import React, { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppShell from './AppShell';
import ExperienceDefault from './components/ExperienceDefault';
import NotFound from './components/NotFound';

/* Route-level code splitting — heavy pages load on demand */
const Experience3DRoute = React.lazy(() => import('./components/Experience3DRoute'));
const ResumePage = React.lazy(() => import('./components/ResumePage'));
const ProjectsPage = React.lazy(() => import('./components/ProjectsPage'));
const ProjectCaseStudy = React.lazy(() => import('./components/ProjectCaseStudy'));

function LazyRoute({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#121212] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#24A2A7] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <ExperienceDefault /> },
      { path: '3d', element: <LazyRoute><Experience3DRoute /></LazyRoute> },
      { path: 'resume', element: <LazyRoute><ResumePage /></LazyRoute> },
      { path: 'projects', element: <LazyRoute><ProjectsPage /></LazyRoute> },
      { path: 'projects/:projectId', element: <LazyRoute><ProjectCaseStudy /></LazyRoute> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
