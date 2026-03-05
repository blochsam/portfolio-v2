import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, X } from 'lucide-react';
import { COLORS } from '../constants';
import InteractiveSitemap from './InteractiveSitemap';
import { SITEMAP } from '../sitemap';

/* ─── Scroll-triggered animations (unified: data-reveal / .revealed) ─── */
function useAnimateOnScroll() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll('[data-reveal]');
    if (!targets.length) return;
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    targets.forEach(t => observer.observe(t));
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ═══════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════ */

/* Before/After interactive comparison slider */
const BeforeAfterSlider: React.FC<{
  before: string; after: string; beforeLabel?: string; afterLabel?: string;
}> = ({ before, after, beforeLabel = 'Before', afterLabel = 'After' }) => {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos(Math.max(3, Math.min(97, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  useEffect(() => {
    const move = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      e.preventDefault();
      update('touches' in e ? e.touches[0].clientX : e.clientX);
    };
    const up = () => { dragging.current = false; };
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchend', up);
    };
  }, [update]);

  return (
    <div>
      <div className="flex justify-between items-center mb-3 px-1">
        <span className="text-[12px] font-mono font-bold uppercase tracking-[0.2em] text-[#24A2A7]/70">{afterLabel}</span>
        <span className="text-[12px] font-mono font-bold uppercase tracking-[0.2em] text-white/40">{beforeLabel}</span>
      </div>
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl border border-white/[0.08] glow-border cursor-col-resize select-none"
        onMouseDown={e => { dragging.current = true; update(e.clientX); }}
        onTouchStart={e => { dragging.current = true; update(e.touches[0].clientX); }}
      >
        <img src={before} alt={beforeLabel} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <img src={after} alt={afterLabel} className="w-full h-full object-cover" draggable={false} />
        </div>
        <div className="absolute top-0 bottom-0 w-[2px] bg-white/90 z-10 pointer-events-none" style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center pointer-events-auto">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M5 3L2 8L5 13" stroke="#121212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 3L14 8L11 13" stroke="#121212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Draggable horizontal image gallery with step indicators */
const DragGallery: React.FC<{
  images: Array<{ src: string; alt: string; caption: string; step: string }>;
  onOpen: (img: { src: string; alt: string }) => void;
}> = ({ images, onOpen }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const moved = useRef(false);

  const hinted = useRef(false);

  const down = (e: React.MouseEvent) => {
    isDragging.current = true;
    moved.current = false;
    startX.current = e.clientX;
    scrollStart.current = trackRef.current?.scrollLeft ?? 0;
    if (trackRef.current) trackRef.current.style.cursor = 'grabbing';
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const move = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - startX.current;
      if (Math.abs(dx) > 4) moved.current = true;
      track.scrollLeft = scrollStart.current - dx;
    };
    const up = () => { isDragging.current = false; if (track) track.style.cursor = 'grab'; };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  }, []);

  /* Auto-scroll hint when gallery enters viewport */
  useEffect(() => {
    const track = trackRef.current;
    if (!track || hinted.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hinted.current) {
          hinted.current = true;
          observer.disconnect();
          setTimeout(() => {
            track.scrollTo({ left: 160, behavior: 'smooth' });
            setTimeout(() => track.scrollTo({ left: 0, behavior: 'smooth' }), 800);
          }, 400);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <div ref={trackRef} className="flex gap-6 overflow-x-auto scrollbar-thin pb-4 cursor-grab snap-x snap-mandatory" onMouseDown={down}>
        {images.map((img, i) => (
          <button key={i} type="button" className="shrink-0 w-[80vw] md:w-[45vw] lg:w-[34vw] snap-start group text-left" onClick={() => { if (!moved.current) onOpen(img); }}>
            <div className="relative overflow-hidden rounded-xl border border-white/[0.06] transition-all duration-500 group-hover:border-white/[0.15]">
              <img src={img.src} alt={img.alt} className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" draggable={false} />
              {/* Step badge */}
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5">
                <span className="text-[9px] font-mono font-bold text-[#24A2A7]">{img.step}</span>
              </div>
            </div>
            <p className="text-[12px] font-mono text-[#9a9a9f] mt-3">{img.caption}</p>
          </button>
        ))}
      </div>
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20 mt-4 text-center md:text-left">Drag to explore</p>
    </div>
  );
};

/* Laptop device frame mockup */
const LaptopFrame: React.FC<{
  children: React.ReactNode;
  caption?: string;
  onOpen?: (img: { src: string; alt: string }) => void;
}> = ({ children, caption }) => (
  <div className="mx-auto max-w-4xl">
    <div className="relative bg-[#171717] rounded-t-2xl pt-7 px-3 pb-0 border border-white/[0.08] border-b-0 shadow-2xl shadow-black/50">
      {/* Camera dot */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/[0.06] ring-1 ring-white/[0.04]" />
      {/* Traffic lights */}
      <div className="absolute top-3 left-4 flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-[#ff5f57]/60" />
        <div className="w-2 h-2 rounded-full bg-[#febc2e]/60" />
        <div className="w-2 h-2 rounded-full bg-[#28c840]/60" />
      </div>
      {/* Screen */}
      <div className="rounded-lg overflow-hidden border border-white/[0.04]">
        {children}
      </div>
    </div>
    {/* Base */}
    <div className="relative">
      <div className="bg-gradient-to-b from-[#2a2a2a] to-[#1f1f1f] h-4 rounded-b-lg mx-1.5 border border-white/[0.04] border-t-0" />
      <div className="bg-gradient-to-b from-[#333] to-[#222] h-1 rounded-b-xl mx-10 border border-white/[0.03] border-t-0" />
    </div>
    {caption && <p className="text-[12px] font-mono text-[#9a9a9f] mt-4 text-center">{caption}</p>}
  </div>
);

/* Subtle gradient divider — thin line with soft glow */
const GradientMesh: React.FC<{ variant?: 'teal' | 'blue' | 'mixed' }> = ({ variant = 'teal' }) => {
  const colors: Record<string, string> = {
    teal: 'rgba(36,162,167,0.4)',
    blue: 'rgba(59,130,246,0.4)',
    mixed: 'rgba(36,162,167,0.3)',
  };
  return (
    <div className="relative py-4 md:py-6 overflow-hidden" aria-hidden="true">
      {/* Soft glow behind the line */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-16 md:h-24"
        style={{ background: `radial-gradient(ellipse at 50% 50%, ${colors[variant]}, transparent 70%)`, opacity: 0.15 }}
      />
      {/* The line itself */}
      <div className="relative h-px max-w-5xl mx-auto"
        style={{ background: `linear-gradient(to right, transparent, ${colors[variant]}, transparent)` }}
      />
    </div>
  );
};

/* Chapter label */
const Ch: React.FC<{ num: string; title: string }> = ({ num, title }) => (
  <div data-reveal className="dsb-fade-up flex items-baseline gap-4 mb-6">
    <span className="text-[13px] font-mono font-bold text-[#24A2A7]/40">{num}</span>
    <span className="text-[13px] font-black uppercase tracking-[0.25em] text-[#24A2A7]">{title}</span>
  </div>
);

/* Sharp image with lightbox trigger */
const Img: React.FC<{
  src: string; alt: string; caption?: string;
  onOpen: (img: { src: string; alt: string }) => void;
  className?: string;
  loading?: 'lazy' | 'eager';
}> = ({ src, alt, caption, onOpen, className = '', loading = 'lazy' }) => (
  <button type="button" onClick={() => onOpen({ src, alt })} className={`group block w-full text-left cursor-zoom-in ${className}`}>
    <div className="overflow-hidden rounded-xl border border-white/[0.06] glow-border transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-[#24A2A7]/8">
      <img src={src} alt={alt} className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]" loading={loading} />
    </div>
    {caption && <p className="text-[12px] font-mono text-[#9a9a9f] mt-3">{caption}</p>}
  </button>
);

/* Expandable accordion section */
const Expandable: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/[0.06]">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-6 text-left group">
        <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-[#24A2A7] transition-colors pr-4">{title}</h3>
        <span className={`text-white/40 text-2xl font-light transition-transform duration-300 shrink-0 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ${open ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
        <div className="text-[#9a9a9f] text-[15px] leading-[1.8]">{children}</div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   PORTFOLIO CASE STUDY — DESIGN B
   ═══════════════════════════════════════════════════ */
const PortfolioCaseStudy: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useAnimateOnScroll();
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const scrollBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  /* Scroll progress bar */
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const bar = scrollBarRef.current;
        if (bar) {
          const pct = Math.min(100, (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
          bar.style.width = `${pct}%`;
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  const handleDownloadPDF = async () => {
    const { generateCaseStudyPdfHtml } = await import('../utils/generateCaseStudyPdf');
    const html = generateCaseStudyPdfHtml('portfolio-v1', window.location.origin);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank', 'width=900,height=700');
    if (win) { win.onload = () => URL.revokeObjectURL(url); } else { URL.revokeObjectURL(url); }
  };

  const openImg = (img: { src: string; alt: string }) => setLightbox(img);

  return (
    <>
      {/* Design B animation styles */}
      <style>{`
        .dsb-fade-up { opacity: 0; transform: translateY(30px); transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94); will-change: opacity, transform; }
        .dsb-fade-up.revealed { opacity: 1; transform: translateY(0); }
        .dsb-slide-left { opacity: 0; transform: translateX(-50px); transition: opacity 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94); will-change: opacity, transform; }
        .dsb-slide-left.revealed { opacity: 1; transform: translateX(0); }
        .dsb-slide-right { opacity: 0; transform: translateX(50px); transition: opacity 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94); will-change: opacity, transform; }
        .dsb-slide-right.revealed { opacity: 1; transform: translateX(0); }
        .dsb-scale { opacity: 0; transform: scale(0.96); transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94); will-change: opacity, transform; }
        .dsb-scale.revealed { opacity: 1; transform: scale(1); }

        /* Hero entrance — unified easing, GPU-composited */
        @keyframes dsb-hero-fade-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dsb-hero-slide-right { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        .dsb-hero-label   { animation: dsb-hero-fade-up 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; will-change: opacity, transform; }
        .dsb-hero-title   { animation: dsb-hero-fade-up 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.15s both; will-change: opacity, transform; }
        .dsb-hero-desc    { animation: dsb-hero-fade-up 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.35s both; will-change: opacity, transform; }
        .dsb-hero-image   { animation: dsb-hero-slide-right 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s both; will-change: opacity, transform; }

        @keyframes dsb-pulse { 0%, 100% { opacity: 0.12; transform: translate(-50%,-50%) scale(1); } 50% { opacity: 0.2; transform: translate(-50%,-50%) scale(1.15); } }
        @keyframes gemini-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gemini-gradient {
          background: linear-gradient(135deg, #0D9488, #24A2A7, #22D3EE, #38BDF8, #34D399, #0D9488);
          background-size: 300% 300%;
          animation: gemini-shift 6s ease-in-out infinite;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        @media (prefers-reduced-motion: reduce) {
          .dsb-fade-up, .dsb-slide-left, .dsb-slide-right, .dsb-scale { opacity: 1; transform: none; transition: none; }
          .dsb-hero-label, .dsb-hero-title, .dsb-hero-desc, .dsb-hero-image { animation: none; opacity: 1; transform: none; }
          .gemini-gradient { animation: none; }
        }
      `}</style>

      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[70] h-[2px]">
        <div ref={scrollBarRef} className="h-full" style={{ width: '0%', background: '#24A2A7' }} />
      </div>

      <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#24A2A7]/30 font-sans overflow-x-clip">

        {/* Lightbox */}
        {lightbox && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-300" onClick={() => setLightbox(null)} role="dialog" aria-label="Enlarged image">
            <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all z-[101]" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
            <img src={lightbox.src} alt={lightbox.alt} className="max-w-full max-h-[85vh] rounded-2xl object-contain" onClick={e => e.stopPropagation()} />
          </div>
        )}

        {/* Back */}
        <button onClick={() => navigate('/projects')} className="fixed top-8 left-8 md:left-12 z-[60] flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-all bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/5 hover:border-[#24A2A7]/40 shadow-xl active:scale-95 no-print" aria-label="Back to projects">
          <ArrowLeft className="w-4 h-4" />
          Back to Archive
        </button>

        {/* PDF Download */}
        <div className="fixed bottom-32 md:bottom-24 right-6 z-[70] no-print">
          <button onClick={handleDownloadPDF} className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-90" style={{ backgroundColor: COLORS.teal, color: COLORS.charcoal }} title="Download Case Study PDF">
            <Download className="w-8 h-8" />
          </button>
        </div>

        {/* ═══ HERO — Flat side-by-side layout ═══ */}
        <header className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_40%,_rgba(36,162,167,0.06)_0%,_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_30%,_rgba(34,211,238,0.04)_0%,_transparent_50%)]" />

          <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-10 md:pb-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Left — Text */}
              <div>
                <p className="dsb-hero-label text-[11px] font-mono font-bold tracking-[0.3em] text-[#24A2A7]/70 mb-6">
                  PORTFOLIO REDESIGN &middot; 2025
                </p>
                <h1 className="dsb-hero-title text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-black leading-[0.88] tracking-tight mb-6">
                  <span className="block text-white">The</span>
                  <span className="block gemini-gradient" style={{ filter: 'drop-shadow(0 2px 16px rgba(36,162,167,0.25))' }}>
                    Samulation
                  </span>
                </h1>
                <p className="dsb-hero-desc text-base md:text-lg text-white/40 max-w-md leading-relaxed">
                  I rebuilt my portfolio from scratch as a dual-view experience — a 2D editorial site and an interactive 3D workstation, running from one React codebase.
                </p>
              </div>
              {/* Right — 3D scene showcase */}
              <div className="dsb-hero-image relative">
                <div className="absolute -inset-4 bg-[radial-gradient(ellipse_at_50%_50%,_rgba(36,162,167,0.12)_0%,_transparent_70%)] blur-2xl pointer-events-none" />
                <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/40" style={{ aspectRatio: '16 / 10' }}>
                  <img src="/case-study/3d-scene.webp" alt="The Samulation — 3D workstation experience" className="w-full h-full object-cover" fetchPriority="high" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-3 right-3 text-[8px] font-mono font-bold uppercase tracking-[0.2em] text-white/30 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    3D Workstation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ═══ STATS BAR ═══ */}
        <section className="border-y border-white/[0.04] bg-[#0c0c0c]">
          <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-16">
            <div className="flex flex-wrap justify-between gap-8 md:gap-4 text-center">
              {[
                { val: '2', label: 'Parallel Experiences' },
                { val: '5+', label: 'Case Studies' },
                { val: '6', label: 'Interactive Objects' },
                { val: 'Zero', label: 'Templates Used' },
              ].map((s, i) => (
                <div key={s.label} data-reveal className="dsb-fade-up flex-1 min-w-[120px]" style={{ transitionDelay: `${i * 100}ms` }}>
                  <p className="text-3xl md:text-4xl font-black tracking-tight text-white mb-1">{s.val}</p>
                  <p className="text-[12px] font-mono uppercase tracking-[0.15em] text-[#9a9a9f]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 01: THE PROBLEM ═══ */}
        <section className="py-16 md:py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <Ch num="01" title="The Problem" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-5">
              <h2 data-reveal className="dsb-slide-left text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.05] mb-6">
                My old site was fine.{' '}
                <span className="text-white/30">That was the problem.</span>
              </h2>
              <p data-reveal className="dsb-fade-up text-[17px] text-[#9a9a9f] leading-[1.8]">
                I graduated from Michigan State, put up a portfolio, and didn't touch it for years. White background, teal accent, eight categories in the nav. It said "here's who I am" but never showed what I could actually build. <span data-reveal className="highlight-reveal">That bugged me</span> more the longer I left it.
              </p>
            </div>
            <div className="lg:col-span-7 space-y-6">
              <div data-reveal className="dsb-slide-right">
                <Img src="/case-study/before-home.webp" alt="Previous portfolio home page" caption="Before — Home" onOpen={openImg} loading="eager" />
              </div>
              <div data-reveal className="dsb-slide-right" style={{ transitionDelay: '150ms' }}>
                <Img src="/case-study/before-about.webp" alt="Previous portfolio about page" caption="Before — About" onOpen={openImg} loading="eager" />
              </div>
            </div>
          </div>
        </section>

        {/* ═══ BEFORE / AFTER COMPARISON ═══ */}
        <section className="py-10 md:py-14 px-6 md:px-12 max-w-5xl mx-auto">
          <div data-reveal className="dsb-fade-up text-center mb-8">
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#24A2A7]/50 mb-2">Interactive</p>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Drag to compare
            </h3>
          </div>
          <div data-reveal className="dsb-scale">
            <BeforeAfterSlider
              before="/case-study/before-home.webp"
              after="/case-study/hero-desktop.webp"
              beforeLabel="Old Site"
              afterLabel="New Site"
            />
          </div>
        </section>

        {/* ═══ 02: THE BRIEF ═══ */}
        <section className="py-16 md:py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <Ch num="02" title="The Brief" />
          <h2 data-reveal className="dsb-fade-up text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white mb-8 max-w-2xl">
            I wrote four rules{' '}
            <span className="text-white/30">before touching any code.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {[
              { num: '01', title: 'Actually Use AI', desc: 'Not as a gimmick. I wanted AI woven into the build process itself — 3D asset generation, code iteration, the whole pipeline.' },
              { num: '02', title: 'Level Up Technically', desc: 'Go from flat HTML/CSS to a real React architecture. Routing, state management, components that compose properly.' },
              { num: '03', title: 'Build in 3D', desc: "I'd been playing with Spline and wanted to make something spatial — an environment people would actually explore, not just scroll past." },
              { num: '04', title: 'Prove the Thesis', desc: "If I claim I think in systems, the portfolio itself should prove it. Not describe it. Prove it." },
            ].map((goal, i) => (
              <div key={goal.num} data-reveal className="dsb-fade-up flex gap-5 items-start" style={{ transitionDelay: `${i * 100}ms` }}>
                <span className="text-[32px] font-black leading-none shrink-0 text-[#24A2A7]/15 tracking-tight">{goal.num}</span>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{goal.title}</h3>
                  <p className="text-[#9a9a9f] text-[15px] leading-relaxed">{goal.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ WIREFRAME — Early in the story, right after the brief ═══ */}
        <section className="py-10 md:py-14 px-6 md:px-12 max-w-5xl mx-auto">
          <div data-reveal className="dsb-scale">
            <Img src="/case-study/wireframe.webp" alt="Portfolio wireframe" caption="Where it started — rough wireframe before any code" onOpen={openImg} />
          </div>
        </section>

        {/* ═══ Atmospheric break ═══ */}
        <GradientMesh variant="teal" />

        {/* ═══ 03: DESIGN PHILOSOPHY ═══ */}
        <section className="py-16 md:py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <Ch num="03" title="Design Philosophy" />

          {/* Tech-Noir Aesthetics */}
          <div data-reveal className="dsb-slide-left mb-10">
            <div className="max-w-2xl">
              <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-3">
                Tech-Noir Aesthetics
              </h3>
              <p className="text-[#9a9a9f] text-[17px] leading-[1.8]">I kept gravitating toward teal on charcoal. The old site was white and open — this one needed to feel like it had a point of view. Sharp type, subtle gradients, dark everywhere.</p>
            </div>
          </div>

          {/* Full-bleed hero screenshot */}
          <div data-reveal className="dsb-scale mb-10 -mx-6 md:mx-0">
            <div className="relative rounded-none md:rounded-2xl overflow-hidden border-y md:border border-white/[0.06]">
              <img src="/case-study/hero-desktop.webp" alt="The Samulation 2D experience — teal on charcoal" className="w-full h-auto" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-white/40 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                The 2D editorial experience
              </span>
            </div>
          </div>

          {/* Editorial Minimalism */}
          <div data-reveal className="dsb-slide-right mb-10">
            <div className="max-w-2xl ml-auto text-right">
              <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-3">
                Editorial Minimalism
              </h3>
              <p className="text-[#9a9a9f] text-[17px] leading-[1.8]">Let content breathe. The 2D side should read like a magazine spread, not a corporate brochure. Big type, whitespace, no clutter.</p>
            </div>
          </div>

          {/* Code screenshot */}
          <div data-reveal className="dsb-scale mb-10 -mx-6 md:mx-0">
            <div className="relative rounded-none md:rounded-2xl overflow-hidden border-y md:border border-white/[0.06]">
              <img src="/case-study/code-screenshot.webp" alt="React component architecture in VS Code" className="w-full h-auto" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-white/40 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                Component architecture in TypeScript
              </span>
            </div>
          </div>

          {/* Human Touch */}
          <div data-reveal className="dsb-slide-left">
            <div className="max-w-2xl">
              <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-3">
                Human Touch
              </h3>
              <p className="text-[#9a9a9f] text-[17px] leading-[1.8]">I added ambient audio, gave my cat Sesame her own card, and wired the guitar to open my About page. A portfolio <span data-reveal className="highlight-reveal">should feel like it belongs to a person</span>, not a LinkedIn profile.</p>
            </div>
          </div>
        </section>

        {/* ═══ Atmospheric break ═══ */}
        <GradientMesh variant="blue" />

        {/* ═══ 04: THE ARCHITECTURE ═══ */}
        <section className="relative py-16 md:py-24 px-6 md:px-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0e0e0e] to-[#0a0a0a]" />
          <div className="relative max-w-6xl mx-auto">
            <Ch num="04" title="The Architecture" />
            <h2 data-reveal className="dsb-fade-up text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white mb-5 max-w-3xl">
              One codebase,{' '}
              <span className="text-white/30">two ways in.</span>
            </h2>
            <p data-reveal className="dsb-fade-up text-[#9a9a9f] text-[17px] leading-[1.8] mb-8 max-w-2xl">
              The whole thing runs from a single React app. A toggle flips between the two experiences — same content, same routes, different wrapper.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div data-reveal className="dsb-slide-left rounded-2xl border border-white/[0.06] bg-white/[0.015] relative overflow-hidden group glow-border transition-colors duration-500">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#24A2A7]/40 to-transparent z-10" />
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src="/case-study/result-2d-mobile.webp" alt="2D editorial mobile view" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/40 to-transparent" />
                  <span className="absolute top-4 left-4 text-[11px] font-mono font-bold text-[#24A2A7]/50">LAYER 01</span>
                </div>
                <div className="p-8 pt-5">
                  <h3 className="text-2xl font-black tracking-tight text-white mb-3">2D Editorial</h3>
                  <p className="text-[#9a9a9f] text-[15px] leading-relaxed">
                    The clean, scrollable version. Mobile visitors and lower-spec machines get this by default. Reads well, loads fast, doesn't ask your GPU for anything.
                  </p>
                </div>
              </div>
              <div data-reveal className="dsb-slide-right rounded-2xl border border-white/[0.06] bg-white/[0.015] relative overflow-hidden group glow-border transition-colors duration-500">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#3B82F6]/40 to-transparent z-10" />
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src="/case-study/3d-scene.webp" alt="3D workstation desktop view" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/40 to-transparent" />
                  <span className="absolute top-4 left-4 text-[11px] font-mono font-bold text-[#3B82F6]/50">LAYER 02</span>
                </div>
                <div className="p-8 pt-5">
                  <h3 className="text-2xl font-black tracking-tight text-white mb-3">3D Workstation</h3>
                  <p className="text-[#9a9a9f] text-[15px] leading-relaxed">
                    A Spline-powered room where you're at my desk. Orbit the camera, click objects — each one maps to a content theme. The guitar opens my About page.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Sitemap */}
            <div data-reveal className="dsb-fade-up">
              <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/25 mb-4">Site Architecture</p>
              <p className="text-[#9a9a9f] text-[15px] leading-relaxed mb-5 max-w-2xl">
                Two entry points, shared navigation, one content source. Here's how it all connects.
              </p>
              <InteractiveSitemap data={SITEMAP} />
            </div>
          </div>
        </section>

        {/* ═══ 05: THE BUILD — Process Documentation ═══ */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6 md:px-12 mb-10">
            <Ch num="05" title="The Build" />
            <h2 data-reveal className="dsb-fade-up text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white mb-5 max-w-3xl">
              Spline, Meshy, React, ship.
            </h2>
            <p data-reveal className="dsb-fade-up text-[#9a9a9f] text-[17px] leading-[1.8] max-w-2xl">
              The workflow bounced between spatial design in Spline, AI-generated 3D models from Meshy.ai, and stitching it all together in React. Lots of back and forth, lots of "wait, that doesn't look right."
            </p>
          </div>

          {/* Featured build image — Spline workspace */}
          <div className="max-w-6xl mx-auto px-6 md:px-12 mb-8">
            <div data-reveal className="dsb-scale">
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.06]">
                <img src="/case-study/spline-workflow.webp" alt="Building the 3D workstation in Spline" className="w-full h-auto" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-[#24A2A7]/70 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    Spline workspace
                  </span>
                  <p className="text-white/50 text-sm mt-3 max-w-lg">
                    Every object placed, lit, and animated by hand. The monitors, desk, and guitar are all clickable — each one mapped to a content theme.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Process steps timeline */}
          <div className="max-w-6xl mx-auto px-6 md:px-12 mb-10">
            <div data-reveal className="dsb-fade-up flex flex-wrap gap-3 md:gap-0 md:flex-nowrap items-center mb-6">
              {['Design', 'Generate', 'Develop', 'Ship'].map((step, i) => (
                <React.Fragment key={step}>
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full border border-[#24A2A7]/30 bg-[#24A2A7]/10 flex items-center justify-center text-[10px] font-mono font-bold text-[#24A2A7]">{i + 1}</span>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-white/50">{step}</span>
                  </div>
                  {i < 3 && <div className="hidden md:block flex-1 h-[1px] bg-gradient-to-r from-[#24A2A7]/20 to-transparent mx-4" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Drag gallery with step badges */}
          <div data-reveal className="dsb-fade-up pl-6 md:pl-12">
            <DragGallery
              images={[
                { src: '/case-study/spline-workflow.webp', alt: 'Spline workflow', caption: 'Spline — Building the desk scene from scratch in 3D', step: 'STEP 01' },
                { src: '/case-study/meshy-workflow.webp', alt: 'Meshy.ai workflow', caption: 'Meshy.ai — AI-generated 3D assets for the workstation', step: 'STEP 02' },
                { src: '/case-study/code-screenshot.webp', alt: 'Portfolio codebase', caption: 'React — Component architecture with TypeScript + Vite', step: 'STEP 03' },
                { src: '/case-study/3d-scene.webp', alt: '3D workstation scene', caption: 'Result — The fully interactive 3D workstation', step: 'STEP 04' },
              ]}
              onOpen={openImg}
            />
          </div>

          <div className="max-w-6xl mx-auto px-6 md:px-12 mt-12">
            <div data-reveal className="dsb-fade-up">
              <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/25 mb-4">Stack</p>
              <div className="flex flex-wrap gap-3">
                {['React 19', 'TypeScript 5.8', 'Vite 6', 'Tailwind v4', 'React Router v7', 'Spline', 'Meshy.ai', 'Claude AI'].map((tech, i) => (
                  <span key={tech} data-reveal className="dsb-fade-up px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] text-[12px] text-[#9a9a9f] font-mono glow-border hover:text-white/70 transition-all duration-300" style={{ transitionDelay: `${i * 60}ms` }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Atmospheric break ═══ */}
        <GradientMesh variant="mixed" />

        {/* ═══ 06: THE RESULT — Device Mockups ═══ */}
        <section className="relative py-16 md:py-24 px-6 md:px-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#080808] to-[#0a0a0a]" />
          <div className="relative max-w-6xl mx-auto">
            <Ch num="06" title="The Result" />
            <h2 data-reveal className="dsb-fade-up text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white mb-8 max-w-3xl">
              Two experiences, one codebase,{' '}
              <span className="text-white/30">zero templates.</span>
            </h2>

            {/* Hero screenshot in laptop frame */}
            <div data-reveal className="dsb-scale mb-8">
              <LaptopFrame caption="The new hero section — desktop view">
                <button type="button" onClick={() => openImg({ src: '/case-study/hero-desktop.webp', alt: 'New portfolio hero' })} className="block w-full cursor-zoom-in">
                  <img src="/case-study/hero-desktop.webp" alt="New portfolio hero" className="w-full h-auto" />
                </button>
              </LaptopFrame>
            </div>

            {/* Multi-device showcase: Desktop + Mobile side by side */}
            <div data-reveal className="dsb-fade-up mb-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                {/* Projects archive in laptop frame */}
                <div className="md:col-span-8">
                  <LaptopFrame caption="Projects & Artifacts — the full archive">
                    <button type="button" onClick={() => openImg({ src: '/case-study/result-projects.webp', alt: 'Projects archive page' })} className="block w-full cursor-zoom-in">
                      <img src="/case-study/result-projects.webp" alt="Projects archive page" className="w-full h-auto" />
                    </button>
                  </LaptopFrame>
                </div>
                {/* Mobile view — phone frame */}
                <div className="md:col-span-4 flex justify-center">
                  <div className="w-[220px] md:w-full max-w-[260px]">
                    {/* Phone frame */}
                    <div className="relative bg-[#171717] rounded-[28px] p-2 border border-white/[0.08] shadow-2xl shadow-black/50">
                      {/* Notch */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#171717] rounded-b-2xl z-10" />
                      <div className="rounded-[20px] overflow-hidden border border-white/[0.04]">
                        <button type="button" onClick={() => openImg({ src: '/case-study/result-2d-mobile.webp', alt: 'Portfolio mobile view' })} className="block w-full cursor-zoom-in">
                          <img src="/case-study/result-2d-mobile.webp" alt="Portfolio mobile view" className="w-full h-auto" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[12px] font-mono text-[#9a9a9f] mt-4 text-center">Mobile — responsive 2D experience</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume page in laptop frame */}
            <div data-reveal className="dsb-scale">
              <LaptopFrame caption="The resume page — clean, data-rich, and printable">
                <button type="button" onClick={() => openImg({ src: '/case-study/resume-page.webp', alt: 'New portfolio resume' })} className="block w-full cursor-zoom-in">
                  <img src="/case-study/resume-page.webp" alt="New portfolio resume" className="w-full h-auto" />
                </button>
              </LaptopFrame>
            </div>
          </div>
        </section>

        {/* ═══ 07: KEY DECISIONS ═══ */}
        <section className="pt-14 md:pt-18 pb-8 md:pb-10 px-6 md:px-12 max-w-4xl mx-auto">
          <Ch num="07" title="Decisions" />
          <h2 data-reveal className="dsb-fade-up text-3xl md:text-4xl font-black tracking-tight text-white mb-10">
            Questions I got asked a lot.
          </h2>

          <div className="border-t border-white/[0.06]">
            <Expandable title="Why two experiences?" defaultOpen>
              <p className="mb-3">Not every device can handle WebGL. Not every visitor wants it, either. The site checks what you're running and serves the right version. Mobile gets the editorial view. Desktop users can opt into the full 3D thing.</p>
              <p>Both paths surface the same content — nobody misses anything regardless of which one they land on.</p>
            </Expandable>
            <Expandable title="Why a desk?">
              <p className="mb-3">People remember "the site with the desk" more than "the site with the nice resume." It proves I can ship 3D, manage WebGL performance, and think spatially.</p>
              <p>It also grows with me. New content is just a new desk object. No redesign required.</p>
            </Expandable>
            <Expandable title="Why not a template?">
              <p className="mb-3">I wanted the portfolio to be the proof, not just the container. If I'm going to claim I think in systems, the site itself should demonstrate that. Templates are useful, but they tell a different story.</p>
              <p>Every component, every animation, every layout call was mine.</p>
            </Expandable>
            <Expandable title="How did AI fit in?">
              <p className="mb-3">Claude was basically my pair programmer — debugging weird CSS spec behavior, iterating on scroll animations, tuning ambient particles across probably 14 rounds of back and forth. We went deep.</p>
              <p>Meshy.ai generated the 3D assets for the Spline scene. AI made me faster. The creative calls were still mine.</p>
            </Expandable>
          </div>
        </section>

        {/* ═══ 08: REFLECTION ═══ */}
        <section className="pt-8 md:pt-10 pb-14 md:pb-18 px-6 md:px-12 max-w-5xl mx-auto">
          <Ch num="08" title="Reflection" />

          <div className="space-y-12">
            {[
              { quote: "Accessibility isn't a nice-to-have.", body: "The dual-view system and progressive fallbacks aren't compromises I made grudgingly. They make the product better for everyone — including people on the best hardware. I'm genuinely proud of how gracefully this degrades." },
              { quote: 'Nobody notices performance until it\'s bad.', body: "I killed backdrop-blur over WebGL, swapped useState scroll handlers for direct DOM refs, replaced overflow-x: hidden with clip. Nobody can name what changed. The site just feels right now." },
              { quote: 'Done is a direction, not a destination.', body: "The case studies went from header-heavy to prose-first. The particles got tuned, re-tuned, and tuned again. The Clyde logo went through six SVG iterations. I keep finding things to improve, and I think that's the point." },
            ].map((lesson, i) => (
              <div key={lesson.quote} data-reveal className={i % 2 === 0 ? 'dsb-slide-left' : 'dsb-slide-right'}>
                <div className={`max-w-2xl ${i % 2 !== 0 ? 'ml-auto text-right' : ''}`}>
                  <blockquote className="text-3xl md:text-4xl font-black tracking-tight text-white mb-5 leading-snug">
                    &ldquo;{lesson.quote}&rdquo;
                  </blockquote>
                  <p className="text-[#9a9a9f] text-[17px] leading-[1.8]">{lesson.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 md:py-24 text-center border-t border-white/5">
          <span className="text-[10px] font-black text-[#24A2A7] uppercase tracking-[0.5em] block mb-4">GET IN TOUCH</span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6">Like what you see?</h2>
          <p className="text-[#9a9a9f] text-[17px] leading-[1.8] max-w-lg mx-auto mb-10">
            I'm always open to discussing new opportunities, creative projects, or just nerding out about design and technology.
          </p>
          <button
            onClick={() => {
              const user = 'sam';
              const domain = 'sam-bloch.com';
              window.location.href = `mailto:${user}@${domain}`;
            }}
            className="group px-10 py-5 bg-[#24A2A7] text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-full hover:brightness-110 transition-all shadow-xl active:scale-95 inline-flex items-center gap-3"
          >
            Let's Connect
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="py-14 px-6 md:px-12 text-center border-t border-white/[0.04]">
          <p data-reveal className="dsb-fade-up text-white/25 text-[11px] font-mono uppercase tracking-[0.2em] mb-6">
            Built with React 19 &middot; TypeScript &middot; Tailwind v4 &middot; Spline &middot; Claude AI
          </p>
          <a
            href="https://github.com/sam-bloch"
            target="_blank"
            rel="noopener noreferrer"
            data-reveal
            className="dsb-fade-up inline-flex items-center gap-2 text-gray-400 hover:text-[#24A2A7] transition-colors text-sm"
          >
            View open source repository &rarr;
          </a>
        </section>
      </div>
    </>
  );
};

export default PortfolioCaseStudy;
