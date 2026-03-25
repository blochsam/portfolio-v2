import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotFound from '../components/NotFound';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/not-found' }),
}));

describe('NotFound', () => {
  it('renders 404 heading', () => {
    render(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders descriptive text', () => {
    render(<NotFound />);
    expect(screen.getByText(/doesn't exist in the Samulation/)).toBeInTheDocument();
  });

  it('renders Return Home button', () => {
    render(<NotFound />);
    expect(screen.getByText('Return Home')).toBeInTheDocument();
  });

  it('navigates home when Return Home is clicked', async () => {
    const user = userEvent.setup();
    render(<NotFound />);
    await user.click(screen.getByText('Return Home'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
