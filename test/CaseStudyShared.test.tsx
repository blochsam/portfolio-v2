import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Overline, CaseStudyImage, CountUp } from '../components/CaseStudyShared';

describe('Overline', () => {
  it('renders children text', () => {
    render(<Overline>Design Process</Overline>);
    expect(screen.getByText('Design Process')).toBeInTheDocument();
  });

  it('renders tag prefix when provided', () => {
    render(<Overline tag="01">First Section</Overline>);
    expect(screen.getByText('[01]')).toBeInTheDocument();
    expect(screen.getByText('First Section')).toBeInTheDocument();
  });

  it('does not render tag when not provided', () => {
    const { container } = render(<Overline>No Tag</Overline>);
    expect(container.querySelector('span')).toBeNull();
  });

  it('applies data-reveal attribute', () => {
    const { container } = render(<Overline>Revealed</Overline>);
    expect(container.querySelector('[data-reveal]')).not.toBeNull();
  });

  it('accepts custom className', () => {
    const { container } = render(
      <Overline className="custom-class">Custom</Overline>
    );
    expect(container.querySelector('.custom-class')).not.toBeNull();
  });

  it('accepts custom style', () => {
    const { container } = render(
      <Overline style={{ color: 'red' }}>Styled</Overline>
    );
    const el = container.querySelector('p');
    expect(el?.style.color).toBe('red');
  });
});

describe('CaseStudyImage', () => {
  const defaultProps = {
    src: '/test.webp',
    alt: 'Test image',
    onOpen: vi.fn(),
  };

  it('renders an image with correct src and alt', () => {
    render(<CaseStudyImage {...defaultProps} />);
    const img = screen.getByAltText('Test image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test.webp');
  });

  it('calls onOpen with image data when clicked', async () => {
    const onOpen = vi.fn();
    const user = userEvent.setup();
    render(<CaseStudyImage {...defaultProps} onOpen={onOpen} />);
    await user.click(screen.getByRole('button'));
    expect(onOpen).toHaveBeenCalledWith({ src: '/test.webp', alt: 'Test image' });
  });

  it('renders caption when provided', () => {
    render(<CaseStudyImage {...defaultProps} caption="A test caption" />);
    expect(screen.getByText('A test caption')).toBeInTheDocument();
  });

  it('does not render caption when not provided', () => {
    const { container } = render(<CaseStudyImage {...defaultProps} />);
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(0);
  });

  it('defaults to lazy loading', () => {
    render(<CaseStudyImage {...defaultProps} />);
    expect(screen.getByAltText('Test image')).toHaveAttribute('loading', 'lazy');
  });

  it('accepts eager loading', () => {
    render(<CaseStudyImage {...defaultProps} loading="eager" />);
    expect(screen.getByAltText('Test image')).toHaveAttribute('loading', 'eager');
  });
});

describe('CountUp', () => {
  it('renders with prefix and suffix', () => {
    render(<CountUp end={100} prefix="$" suffix="+" />);
    // Initially starts at 0
    expect(screen.getByText('$0+')).toBeInTheDocument();
  });

  it('renders without prefix/suffix by default', () => {
    render(<CountUp end={50} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
