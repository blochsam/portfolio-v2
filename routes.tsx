import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppShell from './AppShell';
import ExperienceDefault from './components/ExperienceDefault';
import Experience3DRoute from './components/Experience3DRoute';
import ResumePage from './components/ResumePage';
import ProjectsPage from './components/ProjectsPage';
import ProjectCaseStudy from './components/ProjectCaseStudy';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <ExperienceDefault /> },
      { path: '3d', element: <Experience3DRoute /> },
      { path: 'resume', element: <ResumePage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/:projectId', element: <ProjectCaseStudy /> },
    ],
  },
]);
