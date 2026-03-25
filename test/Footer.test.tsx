import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';

describe('Footer', () => {
  it('renders copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/Copyright © Sam Bloch 2026/i)).toBeInTheDocument();
  });

  it('renders LinkedIn link with correct href', () => {
    render(<Footer />);
    const link = screen.getByLabelText('LinkedIn');
    expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/blochsam/');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders GitHub link with correct href', () => {
    render(<Footer />);
    const link = screen.getByLabelText('GitHub');
    expect(link).toHaveAttribute('href', 'https://github.com/blochsam');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders email button', () => {
    render(<Footer />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders as fixed by default', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer?.className).toContain('fixed');
  });

  it('renders as inline when isInline prop is true', () => {
    const { container } = render(<Footer isInline />);
    const footer = container.querySelector('footer');
    expect(footer?.className).toContain('relative');
    expect(footer?.className).not.toContain('fixed');
  });

  it('has footer element with id site-footer', () => {
    render(<Footer />);
    expect(document.getElementById('site-footer')).toBeInTheDocument();
  });
});
