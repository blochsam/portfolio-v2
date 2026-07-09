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
  wrapperClassName = 'overflow-hidden rounded-2xl border border-white/[0.06] glow-border transition-[border-color,box-shadow] duration-700 group-hover:border-white/[0.12] group-hover:shadow-2xl group-hover:shadow-[#24A2A7]/5',
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

/* ─── At a glance ───
   Skim strip for the top of case studies: what it is, my role, the outcome,
   in seconds. Added after the feedback study showed readers skim first and
   commit second. Theme-agnostic via accent/ink/muted props (dark defaults). */
export const AtAGlance: React.FC<{
  items: { label: string; value: string }[];
  accent?: string;
  ink?: string;
  muted?: string;
  border?: string;
  bg?: string;
}> = ({ items, accent = '#24A2A7', ink = '#e8e8e6', muted = '#9a9a9f', border = 'rgba(255,255,255,0.08)', bg = '#161616' }) => (
  <section aria-label="At a glance"
    className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 pt-10 pb-2">
    <div className="rounded-2xl px-6 py-5 md:px-8" style={{ border: `1px solid ${border}`, background: bg }}>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4" style={{ color: accent }}>At a glance</p>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
        {items.map((it) => (
          <div key={it.label} className="flex gap-3 items-baseline">
            <dt className="text-[11px] font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: muted }}>{it.label}</dt>
            <dd className="text-[14px] leading-snug" style={{ color: ink }}>{it.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  </section>
);
