import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

// Mock heavy components to avoid loading Spline, etc.
vi.mock('../components/Experience3DRoute', () => ({
  default: () => <div>3D Route</div>,
}));
vi.mock('../components/ResumePage', () => ({
  default: () => <div>Resume Page</div>,
}));
vi.mock('../components/ProjectsPage', () => ({
  default: () => <div>Projects Page</div>,
}));
vi.mock('../components/ProjectCaseStudy', () => ({
  default: () => <div>Case Study</div>,
}));
vi.mock('../components/ExperienceDefault', () => ({
  default: () => <div>Home Page</div>,
}));
vi.mock('../components/AudioPlayer', () => ({
  default: () => null,
}));
vi.mock('../components/AboutOverlay', () => ({
  default: () => null,
}));
vi.mock('../components/Footer', () => ({
  default: () => null,
}));
vi.mock('../components/Overlay', () => ({
  default: () => null,
}));
vi.mock('../utils/usePageMeta', () => ({
  usePageMeta: () => {},
}));

import AppShell from '../AppShell';
import ExperienceDefault from '../components/ExperienceDefault';
import NotFound from '../components/NotFound';
import ErrorBoundary from '../components/ErrorBoundary';

describe('Routes', () => {
  function renderRoute(path: string) {
    const routes = [
      {
        path: '/',
        element: <AppShell />,
        children: [
          { index: true, element: <ExperienceDefault /> },
          { path: 'projects', element: <div>Projects Page</div> },
          { path: 'resume', element: <div>Resume Page</div> },
          { path: '*', element: <NotFound /> },
        ],
      },
    ];
    const router = createMemoryRouter(routes, { initialEntries: [path] });
    return render(<RouterProvider router={router} />);
  }

  it('renders home page at /', () => {
    renderRoute('/');
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('renders projects page at /projects', () => {
    renderRoute('/projects');
    expect(screen.getByText('Projects Page')).toBeInTheDocument();
  });

  it('renders resume page at /resume', () => {
    renderRoute('/resume');
    expect(screen.getByText('Resume Page')).toBeInTheDocument();
  });

  it('renders 404 for unknown routes', () => {
    renderRoute('/nonexistent-page');
    expect(screen.getByText('404')).toBeInTheDocument();
  });
});
