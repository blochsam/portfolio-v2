import React, { useState, useEffect, useRef } from 'react';

/* ─── Scroll reveal with staggered delays ───
   IntersectionObserver-based hook that adds 'revealed' class
   to elements with [data-reveal] attribute when they scroll into view.
   ─────────────────────────────────────────── */
export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll('[data-reveal]');
    if (!targets.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ─── Overline label ───
   Small uppercase label used as section headers in case studies.
   Supports optional `tag` (shown as [TAG] prefix), custom `className`
   for theme-specific reveal classes (apple-reveal, arcade-reveal, etc.),
   and optional inline `style` for custom colors.
   ─────────────────────────────────────────── */
export const Overline: React.FC<{
  children: React.ReactNode;
  tag?: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, tag, className = 'apple-reveal text-[13px] font-semibold uppercase tracking-[0.2em] text-[#24A2A7] mb-6', style }) => (
  <p data-reveal className={className} style={style}>
    {tag && <span className="text-[#24A2A7]/70 mr-2">[{tag}]</span>}{children}
  </p>
);

/* ─── Image w/ lightbox ───
   Clickable image component that opens a lightbox on click.
   Supports optional className, caption, loading strategy,
   and customizable wrapper/caption class overrides.
   ─────────────────────────────────────────── */
export const CaseStudyImage: React.FC<{
  src: string;
  alt: string;
  caption?: string;
  onOpen: (img: { src: string; alt: string }) => void;
  className?: string;
  loading?: 'lazy' | 'eager';
  wrapperClassName?: string;
  captionClassName?: string;
}> = ({
  src,
  alt,
  caption,
  onOpen,
  className = '',
  loading = 'lazy',
  wrapperClassName = 'overflow-hidden rounded-2xl border border-white/[0.06] glow-border transition-all duration-700 group-hover:border-white/[0.12] group-hover:shadow-2xl group-hover:shadow-[#24A2A7]/5',
  captionClassName = 'text-[12px] text-[#9a9a9f] mt-3 tracking-wide',
}) => (
  <button
    type="button"
    onClick={() => onOpen({ src, alt })}
    className={`group block w-full text-left cursor-zoom-in ${className}`}
  >
    <div className={wrapperClassName}>
      <img src={src} alt={alt} className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]" loading={loading} />
    </div>
    {caption && <p className={captionClassName}>{caption}</p>}
  </button>
);

/* ─── Animated count-up number ───
   Displays a number that counts up from 0 to `end` when
   the element scrolls into view, with an eased animation.
   ─────────────────────────────────────────── */
export const CountUp: React.FC<{
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}> = ({ end, prefix = '', suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - t0) / duration, 1);
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};
