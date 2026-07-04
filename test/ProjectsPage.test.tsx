import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ to, children, ...props }: { to: string; children: React.ReactNode }) => (
    <a href={to} {...props}>{children}</a>
  ),
}));

// Mock the usePageMeta hook
vi.mock('../utils/usePageMeta', () => ({
  usePageMeta: () => {},
}));

import ProjectsPage from '../components/ProjectsPage';

describe('ProjectsPage', () => {
  it('renders the page title', () => {
    render(<ProjectsPage />);
    expect(screen.getByText('Projects & Artifacts')).toBeInTheDocument();
  });

  it('renders project cards', () => {
    render(<ProjectsPage />);
    expect(screen.getByText('My Portfolio Website')).toBeInTheDocument();
    expect(screen.getByText('The D-Cade')).toBeInTheDocument();
  });

  it('renders spotlight and archive sections', () => {
    render(<ProjectsPage />);
    expect(screen.getByText('SPOTLIGHT')).toBeInTheDocument();
    expect(screen.getByText('THE FULL ARCHIVE')).toBeInTheDocument();
  });

  it('back button returns to the static homepage without persisting 2D', async () => {
    const user = userEvent.setup();
    render(<ProjectsPage />);

    await user.click(screen.getByRole('button', { name: /Back to home/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/', { state: { force2D: true, transient: true } });
  });

  it('renders back button with text', () => {
    render(<ProjectsPage />);
    expect(screen.getByText('Back')).toBeInTheDocument();
  });
});
