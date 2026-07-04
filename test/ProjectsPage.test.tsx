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

  it('renders category filter buttons', () => {
    render(<ProjectsPage />);
    // Use aria-label since button text may appear in project cards too
    expect(screen.getByRole('button', { name: /Filter by All/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Filter by Design/i })).toBeInTheDocument();
  });

  it('filters projects by category', async () => {
    const user = userEvent.setup();
    render(<ProjectsPage />);

    // Click on "Leadership" filter
    await user.click(screen.getByRole('button', { name: /Filter by Leadership/i }));

    // Leadership category project should be visible
    expect(screen.getByText('Michigan Speech Coaches Platform')).toBeInTheDocument();
    // But pure Design projects should not
    expect(screen.queryByText('Augmented Reality Detroit Zoo App')).not.toBeInTheDocument();
  });

  it('search filters by title', async () => {
    const user = userEvent.setup();
    render(<ProjectsPage />);

    // Type in the search input (it should be visible by default or after toggling)
    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, 'fudge');

    // Should show Fudge
    expect(screen.getByText('Fudge')).toBeInTheDocument();
    // Should not show unrelated projects
    expect(screen.queryByText('The D-Cade')).not.toBeInTheDocument();
  });

  it('renders back button with text', () => {
    render(<ProjectsPage />);
    expect(screen.getByText('Back')).toBeInTheDocument();
  });
});
