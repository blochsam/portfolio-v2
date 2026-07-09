import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFooterAwareBottom } from '../utils/useFooterAwareBottom';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, X } from 'lucide-react';
import { COLORS } from '../constants';
import {useScrollReveal, Overline, CaseStudyImage as Img, AtAGlance } from './CaseStudyShared';

/* ─── Full-bleed nature image section ─── */
const NatureMoment: React.FC<{
  src: string;
  alt: string;
  children?: React.ReactNode;
  className?: string;
}> = ({ src, alt, children, className = 'h-[60vh]' }) => (
  <section className={`relative ${className} flex items-center justify-center overflow-hidden`}>
    <div
      className="absolute inset-0 nature-parallax"
      style={{ backgroundImage: `url(${src})` }}
      role="img"
      aria-label={alt}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/50" />
    {children && (
      <div data-reveal className="apple-reveal relative z-10 text-center px-6 max-w-3xl mx-auto">
        {children}
      </div>
    )}
  </section>
);

/* ─── Radial stat ring SVG ─── */
const StatRing: React.FC<{ percent: number; color?: string; size?: number }> = ({ percent, color = '#24A2A7', size = 80 }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} className="shrink-0" aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="transition-[stroke-dashoffset] duration-1000"
      />
    </svg>
  );
};

/* ─── Process step connector (SVG) ─── */
const ProcessFlow: React.FC<{ steps: string[] }> = ({ steps }) => (
  <div className="flex items-center justify-between gap-0 w-full overflow-x-auto pb-4">
    {steps.map((step, i) => (
      <React.Fragment key={step}>
        <div className="flex flex-col items-center min-w-[100px] text-center">
          <div className="w-12 h-12 rounded-full border-2 border-[#24A2A7]/40 flex items-center justify-center text-[#24A2A7] text-sm font-bold mb-2 bg-[#24A2A7]/[0.06]">
            {i + 1}
          </div>
          <span className="text-[11px] text-[#9a9a9f] font-medium leading-tight max-w-[90px]">{step}</span>
        </div>
        {i < steps.length - 1 && (
          <div className="flex-1 h-px bg-gradient-to-r from-[#24A2A7]/30 to-[#24A2A7]/10 min-w-[20px] mt-[-20px]" />
        )}
      </React.Fragment>
    ))}
  </div>
);

/* ─── Animated count-up number ─── */
const CountUp: React.FC<{ end: number; prefix?: string; suffix?: string; duration?: number }> = ({ end, prefix = '', suffix = '', duration = 2000 }) => {
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

/* ─── 3D tilt card on hover ─── */
const TiltCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el || window.matchMedia('(hover: none)').matches) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale3d(1.03, 1.03, 1.03)`;
  }, []);

  const onLeave = useCallback(() => {
    if (cardRef.current) cardRef.current.style.transform = '';
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
};

/* ─── Floating ambient particles ─── */
const FloatingParticles: React.FC<{ count?: number }> = ({ count = 18 }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className="absolute rounded-full floating-particle"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${1.5 + Math.random() * 2.5}px`,
          height: `${1.5 + Math.random() * 2.5}px`,
          backgroundColor: '#24A2A7',
          '--fp-dur': `${10 + Math.random() * 10}s`,
          '--fp-del': `${Math.random() * 8}s`,
        } as React.CSSProperties}
      />
    ))}
  </div>
);

/* ─── Sticky scroll progress bar (direct DOM — no React re-renders) ─── */
const ScrollProgress: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const h = document.documentElement.scrollHeight - window.innerHeight;
          const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
          if (barRef.current) barRef.current.style.width = `${pct}%`;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 h-[3px] z-[70]"
      style={{ width: '0%', background: 'linear-gradient(90deg, #24A2A7, #7DD3D7)' }}
    />
  );
};

/* ─── Horizontal scroll showcase (drag-scroll on desktop, stacked on mobile) ─── */
const HorizontalShowcase: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="overflow-x-auto pb-4 px-6 md:px-12 scrollbar-thin" style={{ WebkitOverflowScrolling: 'touch' }}>
    <div className="flex gap-6 md:gap-8 w-max">
      {React.Children.map(children, (child) => (
        <div className="w-[280px] md:w-[360px] shrink-0">
          {child}
        </div>
      ))}
    </div>
  </div>
);

/* ─── SharePoint mockup (replaces actual screenshots to protect UoP privacy) ─── */
const SharePointMockup: React.FC<{ variant: 'home' | 'calendar' }> = ({ variant }) => (
  <div className="rounded-2xl border border-white/[0.06] overflow-hidden bg-[#1a1a2e]">
    {/* Browser chrome */}
    <div className="flex items-center gap-2 px-4 py-2 bg-[#0d0d1a] border-b border-white/[0.06]">
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
      </div>
      <div className="flex-1 bg-white/5 rounded px-3 py-1 text-[10px] text-white/30 font-mono truncate">
        ucanr.sharepoint.com/sites/environmental-stewards
      </div>
    </div>
    {variant === 'home' ? (
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded bg-[#24A2A7]/20 flex items-center justify-center text-[#24A2A7] text-[10px] font-bold">ES</div>
          <div>
            <p className="text-[11px] font-semibold text-white/70">UC Environmental Stewards</p>
            <p className="text-[9px] text-white/30">Community of Practice Portal</p>
          </div>
        </div>
        <div className="rounded-lg bg-gradient-to-r from-[#24A2A7]/15 to-[#2BB8BD]/8 p-4 mb-4">
          <p className="text-[12px] font-semibold text-white/60 mb-1">Welcome to the Alumni Hub</p>
          <p className="text-[10px] text-white/30">Resources, events, and community for 9,000+ certified stewards</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {['Resources', 'Events', 'Directory', 'Volunteer Log', 'Newsletter', 'Contact Staff'].map(item => (
            <div key={item} className="rounded bg-white/[0.03] p-2.5 text-center">
              <div className="w-5 h-5 rounded bg-white/[0.06] mx-auto mb-1.5" />
              <p className="text-[9px] text-white/35">{item}</p>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded bg-[#24A2A7]/20 flex items-center justify-center text-[#24A2A7] text-[10px] font-bold">ES</div>
          <p className="text-[11px] font-semibold text-white/70">Events Calendar</p>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['S','M','T','W','T','F','S'].map((d,i) => (
            <div key={i} className="text-center text-[9px] text-white/30 py-1">{d}</div>
          ))}
          {Array.from({length: 35}, (_, i) => {
            const day = ((i + 28) % 31) + 1;
            const hasEvent = i === 10 || i === 17 || i === 24;
            return (
              <div key={i} className={`aspect-square rounded text-[9px] flex items-center justify-center ${hasEvent ? 'bg-[#24A2A7]/20 text-[#24A2A7] font-semibold' : 'bg-white/[0.02] text-white/20'}`}>
                {day}
              </div>
            );
          })}
        </div>
        <div className="space-y-2">
          {['Nature Walk — Northern CA', 'Virtual Alumni Meetup', 'Volunteer Training Session'].map(e => (
            <div key={e} className="flex items-center gap-2 px-2.5 py-2 rounded bg-white/[0.02]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#24A2A7] shrink-0" />
              <p className="text-[10px] text-white/40">{e}</p>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

/* ─── 3D mouse-reactive Discord Clyde ─── */
const DiscordClyde3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const clydeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const clyde = clydeRef.current;
    if (!container || !clyde || window.matchMedia('(hover: none)').matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const x = (e.clientX - cx) / (rect.width / 2);
      const y = (e.clientY - cy) / (rect.height / 2);
      const dist = Math.sqrt(x * x + y * y);
      if (dist > 5) return;
      clyde.style.transform = `perspective(500px) rotateY(${x * 20}deg) rotateX(${-y * 20}deg) scale3d(1.08, 1.08, 1.08)`;
    };
    const onLeave = () => { clyde.style.transform = ''; };

    window.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div
        ref={clydeRef}
        className="transition-transform duration-200 ease-out bubbly-bob"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <svg width="80" height="60" viewBox="0 0 127.14 96.36" aria-hidden="true"
          style={{
            filter: 'drop-shadow(0 6px 24px rgba(136,153,255,0.5)) drop-shadow(0 2px 6px rgba(88,101,242,0.35))',
          }}
        >
          <defs>
            <linearGradient id="clyde-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b4bef9" />
              <stop offset="35%" stopColor="#8b9cf7" />
              <stop offset="65%" stopColor="#7289da" />
              <stop offset="100%" stopColor="#5865F2" />
            </linearGradient>
          </defs>
          <path
            fill="url(#clyde-grad)"
            d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
          />
        </svg>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════════
   CalNatCaseStudy — Apple-inspired, humanized "Design B" + 10 enhancements
   ════════════════════════════════════════════════════════════════════════════ */

const CalNatCaseStudy: React.FC = () => {
  const navigate = useNavigate();
  const fabBottom = useFooterAwareBottom();
  const containerRef = useScrollReveal();
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);

  /* Hero parallax — direct DOM manipulation to avoid React re-renders on scroll */
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const vh = window.innerHeight;
          const opacity = 1 - Math.min(scrollY / (vh * 0.6), 1);
          const scale = 1 + Math.min(scrollY / (vh * 2), 0.2);
          if (heroImgRef.current) {
            heroImgRef.current.style.opacity = String(opacity);
            heroImgRef.current.style.transform = `scale(${scale})`;
          }
          if (heroTextRef.current) {
            heroTextRef.current.style.opacity = String(opacity);
          }
          ticking = false;
        });
        ticking = true;
      }
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
    const html = generateCaseStudyPdfHtml('uc-calnat', window.location.origin);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank', 'width=900,height=700');
    if (win) {
      win.onload = () => URL.revokeObjectURL(url);
    } else {
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white selection:bg-[#24A2A7]/30 font-sans overflow-x-clip">

      {/* Sticky scroll progress bar */}
      <ScrollProgress />

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-300" onClick={() => setLightbox(null)} role="dialog" aria-label="Enlarged image">
          <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-[color,background-color] z-[201]" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
          <img src={lightbox.src} alt={lightbox.alt} className="max-w-full max-h-[85vh] rounded-2xl object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* Back */}
      <button onClick={() => navigate('/projects')} className="fixed top-8 left-8 md:left-12 z-[60] flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-[color,border-color,transform] bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/5 hover:border-[#24A2A7]/40 shadow-xl active:scale-95 no-print" aria-label="Back to projects">
        <ArrowLeft className="w-4 h-4" />
        Back to Archive
      </button>

      {/* Floating PDF Download */}
      <div className="fixed right-6 z-[70] no-print" style={{ bottom: fabBottom }}>
        <button
          onClick={handleDownloadPDF}
          className="h-14 px-5 rounded-full flex items-center justify-center gap-2 shadow-2xl transition-transform hover:scale-105 active:scale-95 group"
          style={{ backgroundColor: COLORS.teal, color: COLORS.charcoal }}
          aria-label="Download case study PDF"
        >
          <Download className="w-6 h-6" />
          <span className="text-xs font-black uppercase tracking-widest">PDF</span>
        </button>
      </div>

      {/* ════════════════════════════════════════
          HERO (scale-on-scroll + floating particles)
         ════════════════════════════════════════ */}
      <header className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Nature hero background with scale-on-scroll */}
        <img
          ref={heroImgRef}
          src="/case-study/calnat-hero.webp"
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover transition-none will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black pointer-events-none" />

        {/* Floating particles */}
        <FloatingParticles count={6} />

        <div ref={heroTextRef} className="relative z-10 transition-opacity duration-100">
          <p className="text-[13px] font-semibold uppercase tracking-[0.3em] text-[#24A2A7] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
            Design Thinking &middot; Fall 2024
          </p>
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-bold leading-[0.9] tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200 fill-mode-both" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5), 0 4px 40px rgba(0,0,0,0.3)' }}>
            <span className="block text-white">UC California</span>
            <span className="block bg-gradient-to-r from-[#24A2A7] via-[#2BB8BD] to-[#7DD3D7] bg-clip-text text-transparent" style={{ textShadow: 'none', filter: 'drop-shadow(0 2px 12px rgba(36,162,167,0.3))' }}>
              Climate Stewards
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500 fill-mode-both" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
            Designing a way to keep 9,000+ environmental stewards connected after graduation.
          </p>
        </div>

        <div className="absolute bottom-12 animate-in fade-in duration-1000 delay-1000 fill-mode-both">
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-[#24A2A7]/40 to-transparent mx-auto" />
        </div>
      </header>

      <AtAGlance items={[
        { label: "What", value: "A design-thinking engagement for UC Agriculture & Natural Resources" },
        { label: "My role", value: "UX research and facilitation" },
        { label: "Outcome", value: "A community-of-practice platform for 9,000+ stewardship alumni" },
        { label: "Method", value: "Stakeholder interviews · personas · journey mapping" }
      ]} />


      {/* ════════════════════════════════════════
          IMPACT NUMBERS (animated count-up + particles)
         ════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 bg-[#0a0a0a]">
        {/* Subtle gradient orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#24A2A7]/[0.03] blur-[120px] pointer-events-none" />
        <FloatingParticles count={4} />

        <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
          <div data-reveal className="apple-reveal mb-14 text-center">
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#24A2A7] mb-4">Impact at scale</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              The numbers that mattered.
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {[
              { end: 9000, suffix: '+', label: 'Certified Alumni', sub: 'across California' },
              { end: 240, suffix: 'K+', label: 'Volunteer Hours', sub: 'contributed statewide' },
              { end: 58, suffix: '', label: 'Counties Served', sub: 'every county in CA' },
              { end: 6, prefix: '$', suffix: 'M+', label: 'Impact Value', sub: 'in volunteer service' },
            ].map((s, i) => (
              <div key={s.label} data-reveal className="apple-reveal text-center" style={{ transitionDelay: `${i * 120}ms` }}>
                <p className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent mb-2 whitespace-nowrap overflow-visible">
                  <CountUp end={s.end} prefix={s.prefix} suffix={s.suffix} />
                </p>
                <p className="text-sm font-semibold text-white/90 mb-1">{s.label}</p>
                <p className="text-[12px] text-[#9a9a9f]">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Nature moment: Redwood forest ── */}
      <NatureMoment
        src="/case-study/calnat/nature-1.webp"
        alt="Towering redwood trees reaching toward the sky in a California forest"
      />

      {/* ════════════════════════════════════════
          THE STORY (humanized exec summary + highlight reveals)
         ════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <div data-reveal className="apple-reveal">
            <p className="text-xl md:text-2xl lg:text-[1.75rem] text-[#f5f5f7] leading-[1.7] font-light">
              I'm a certified Climate Steward. I took the course, did the fieldwork, got the certificate. When I found out the organization had zero infrastructure to keep alumni connected after graduation, <span data-reveal className="highlight-reveal">it felt personal</span>. So I emailed the program director, pitched a collab with my grad school's Design Thinking cohort, and a week later we had our first working session.
            </p>
          </div>
          <div data-reveal className="apple-reveal mt-10">
            <p className="text-xl md:text-2xl lg:text-[1.75rem] text-[#9a9a9f] leading-[1.7] font-light">
              Four months. Five people. We ran interviews, dug through survey data from 1,302 alumni, and built two working prototypes. We ended up recommending Discord. Not the obvious pick for an environmental nonprofit, but <span data-reveal className="highlight-reveal">the right one</span>.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          DESIGN PROCESS (visual flow)
         ════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-[#0a0a0a] px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div data-reveal className="apple-reveal text-center mb-12">
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#24A2A7] mb-4">Process</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Design Thinking, applied.</h2>
          </div>
          <div data-reveal className="apple-reveal">
            <ProcessFlow steps={['What Is?', 'What If?', 'What Wows?', 'What Works?']} />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CONTEXT
         ════════════════════════════════════════ */}
      <section id="calnat-context" className="scroll-mt-20 py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <Overline>Context</Overline>

          <div data-reveal className="apple-reveal mb-14">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              9,000 alumni across California.<br />
              <span className="text-[#9a9a9f]">No way to reach any of them.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-6">
              <p data-reveal className="apple-reveal text-[17px] text-[#9a9a9f] leading-[1.8]">
                UC Environmental Stewards runs two certification courses (California Naturalist and Climate Stewards) through UC Agriculture & Natural Resources. We're talking 40+ hours of classroom and field learning with 70+ partner orgs. The program's been going for 13 years and recently expanded to Oregon, Washington, and Pennsylvania.
              </p>
              <p data-reveal className="apple-reveal text-[17px] text-[#9a9a9f] leading-[1.8]">
                In April 2024 they created a brand-new "Community of Practice Educator" position. That tells you how seriously they took the gap. Ali stepped into that role with real ambition but no framework. No playbook. Just 9,000 alumni and a blank whiteboard.
              </p>
              <p data-reveal className="apple-reveal text-[17px] text-[#9a9a9f] leading-[1.8]">
                I'd just finished my Climate Stewards certification through Columbia College, so on August 28 I emailed the director and proposed a collab with my grad program's Design Thinking cohort. He connected me with Ali the same day. September 6, first working session.
              </p>
            </div>

            <div data-reveal className="apple-reveal">
              <div className="rounded-2xl border border-white/[0.06] overflow-hidden bg-[#111] glow-border">
                <div className="px-6 py-4 border-b border-white/[0.06]">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#9a9a9f]">The organization</p>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {[
                    { role: 'Academic Director', name: 'Gregory C. Ira', detail: 'Program strategy' },
                    { role: 'CoP Educator', name: 'Ali Stefancich', detail: 'New role, April 2024' },
                    { role: 'Regional Specialists', name: '5 across California', detail: 'Community education' },
                    { role: 'Total Staff', name: '8 people', detail: '9,000+ alumni statewide' },
                  ].map((row) => (
                    <div key={row.role} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <span className="text-[13px] font-semibold text-[#24A2A7] w-40 shrink-0">{row.role}</span>
                      <div>
                        <p className="text-[15px] text-white/90">{row.name}</p>
                        <p className="text-[13px] text-[#9a9a9f]">{row.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          THE CHALLENGE (big quote + tilt cards + glow borders)
         ════════════════════════════════════════ */}
      <section id="calnat-challenge" className="scroll-mt-20 py-20 md:py-28 bg-[#0a0a0a] px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <Overline>The Challenge</Overline>

          <div data-reveal className="apple-reveal mb-14">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              "I graduated this course...
            </h2>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-[#24A2A7] to-[#7DD3D7] bg-clip-text text-transparent">
              now what?"
            </h2>
          </div>

          <div data-reveal className="apple-reveal mb-14">
            <p className="text-[17px] text-[#9a9a9f] leading-[1.8] max-w-3xl">
              People invest $1,500-$2,000 and 40+ hours into these courses, then basically <span data-reveal className="highlight-reveal">graduate into silence</span>. No follow-up. No community. No next step. That phrase kept showing up in every interview we did.
            </p>
          </div>

          {/* Barrier cards with 3D tilt + glow border */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { barrier: 'Geographic dispersion', impact: '9,000 alumni scattered across 58 counties with no way to find each other.' },
              { barrier: 'Diverse demographics', impact: 'College students to retirees. Wildly different comfort levels with tech.' },
              { barrier: 'Broken volunteer tracking', impact: 'The volunteer portal was so painful that people just stopped logging hours.' },
              { barrier: 'Minimal staffing', impact: '8 staff members. Statewide. Everyone already had a full plate.' },
              { barrier: 'No engagement framework', impact: 'Ali\'s role was brand new. No precedent, no playbook, no budget.' },
            ].map((item, i) => (
              <TiltCard key={item.barrier}>
                <div data-reveal className="apple-reveal rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 glow-border hover:border-white/[0.1] transition-[border-color] duration-500 h-full" style={{ transitionDelay: `${i * 80}ms` }}>
                  <p className="text-[15px] font-semibold text-white mb-2">{item.barrier}</p>
                  <p className="text-[14px] text-[#9a9a9f] leading-relaxed">{item.impact}</p>
                </div>
              </TiltCard>
            ))}
          </div>

          {/* Design question - full-bleed divider moment */}
          <div data-reveal className="apple-reveal mt-20 py-14 border-t border-b border-white/[0.06]">
            <p className="text-2xl md:text-3xl text-[#f5f5f7] leading-[1.5] font-light text-center max-w-3xl mx-auto">
              <span data-reveal className="highlight-reveal">How might we create a system</span> that keeps alumni, staff, and partner organizations consistently engaged after certification?
            </p>
            <p className="text-[12px] text-[#9a9a9f] text-center mt-6 tracking-wide">Our design challenge</p>
          </div>
        </div>
      </section>

      {/* ── Nature moment: Aerial forest canopy ── */}
      <NatureMoment
        src="/case-study/calnat/nature-2.webp"
        alt="Aerial view of a dense green forest canopy"
        className="h-[50vh]"
      />

      {/* ════════════════════════════════════════
          RESEARCH (staggered image reveals + glow borders)
         ════════════════════════════════════════ */}
      <section id="calnat-research" className="scroll-mt-20 py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <Overline>Research</Overline>

          <div data-reveal className="apple-reveal mb-14">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              1,302 survey responses.
            </h2>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#9a9a9f]">
              A few honest conversations.
            </h2>
          </div>

          {/* Interviews */}
          <div data-reveal className="apple-reveal mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Stakeholder interviews</h3>
            <p className="text-[17px] text-[#9a9a9f] leading-[1.8] max-w-3xl mb-10">
              We ran 15-minute ethnographic listening sessions with alumni we recruited through the program newsletter. I drafted the recruitment blurb and handled client communication throughout the engagement. Three conversations stood out:
            </p>
          </div>

          <div className="space-y-4 mb-16">
            {[
              {
                who: 'Early graduate, active community member',
                insight: 'Already deeply engaged through nature journaling, hiking groups, and local government. Mentioned a 2022 statewide conference as "absolutely excellent" and wanted it revived. Of hundreds of alumni in her region, she was the only one showing up to events.',
              },
              {
                who: 'Prospective student, grassroots organizer',
                insight: 'Founded a community garden. Active in Monarch Fellowship and Wild Ones. Wanted the certification for professional legitimacy, not knowledge. Preferred Zoom and roundtables but acknowledged attendance drops off quickly.',
              },
              {
                who: 'Retired alumna, early adopter',
                insight: 'Pointed out that a 2024 Facebook group had just 17 members. Recommended nature journaling and themed hiking events as low-friction engagement models. Volunteered to help brainstorm, which said a lot about the untapped willingness in the alumni base.',
              },
            ].map((person, i) => (
              <TiltCard key={i}>
                <div data-reveal className="apple-reveal rounded-2xl border border-white/[0.06] bg-[#111] p-6 md:p-8 glow-border" style={{ transitionDelay: `${i * 100}ms` }}>
                  <p className="text-[13px] font-semibold text-[#24A2A7] tracking-wide mb-3">{person.who}</p>
                  <p className="text-[15px] text-[#9a9a9f] leading-[1.7]">{person.insight}</p>
                </div>
              </TiltCard>
            ))}
          </div>

          {/* Survey */}
          <div data-reveal className="apple-reveal mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Alumni impact survey</h3>
            <p className="text-[17px] text-[#9a9a9f] leading-[1.8] max-w-3xl mb-10">
              Ali shared survey data from 1,302 respondents. This gave us the quantitative backbone to pair with what we'd been hearing in interviews.
            </p>
          </div>

          {/* Survey charts — built from real survey data (1,302 respondents) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

            {/* Chart 1: Enrollment by Year */}
            <div data-reveal className="reveal-left rounded-2xl border border-white/[0.06] bg-[#111] p-6 glow-border">
              <p className="text-[13px] font-semibold uppercase tracking-[0.15em] text-[#24A2A7] mb-1">Enrollment by Year</p>
              <p className="text-[12px] text-[#9a9a9f] mb-5">California Naturalist course · 1,101 responses</p>
              <svg viewBox="0 0 420 180" className="w-full h-auto" role="img" aria-label="Bar chart showing California Naturalist enrollment by year from 2011 to 2024">
                {[
                  { year: '11', val: 15 }, { year: '12', val: 11 }, { year: '13', val: 16 },
                  { year: '14', val: 35 }, { year: '15', val: 48 }, { year: '16', val: 60 },
                  { year: '17', val: 49 }, { year: '18', val: 70 }, { year: '19', val: 80 },
                  { year: '20', val: 104 }, { year: '21', val: 127 }, { year: '22', val: 135 },
                  { year: '23', val: 154 }, { year: '24', val: 197 },
                ].map((d, i) => {
                  const maxVal = 197;
                  const barH = (d.val / maxVal) * 130;
                  const x = 10 + i * 30;
                  return (
                    <g key={d.year}>
                      <rect x={x} y={150 - barH} width="20" height={barH} rx="3" fill={d.year === '24' ? '#24A2A7' : 'rgba(36,162,167,0.35)'} />
                      {(d.year === '11' || d.year === '16' || d.year === '20' || d.year === '24') && (
                        <text x={x + 10} y={150 - barH - 5} textAnchor="middle" fill="#f5f5f7" fontSize="9" fontWeight="600">{d.val}</text>
                      )}
                      <text x={x + 10} y={168} textAnchor="middle" fill="#555" fontSize="8" fontFamily="system-ui">'{d.year}</text>
                    </g>
                  );
                })}
                <line x1="5" y1="150" x2="430" y2="150" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              </svg>
            </div>

            {/* Chart 2: Course Satisfaction */}
            <div data-reveal className="reveal-right rounded-2xl border border-white/[0.06] bg-[#111] p-6 glow-border">
              <p className="text-[13px] font-semibold uppercase tracking-[0.15em] text-[#24A2A7] mb-1">Course Satisfaction</p>
              <p className="text-[12px] text-[#9a9a9f] mb-5">1,252 responses</p>
              <div className="space-y-3">
                {[
                  { label: 'Satisfied', val: 1010, pct: 80.7 },
                  { label: 'Somewhat satisfied', val: 194, pct: 15.5 },
                  { label: 'Neutral', val: 23, pct: 1.8 },
                  { label: 'Somewhat dissatisfied', val: 18, pct: 1.4 },
                  { label: 'Not satisfied', val: 7, pct: 0.6 },
                ].map((d) => (
                  <div key={d.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] text-[#9a9a9f]">{d.label}</span>
                      <span className="text-[12px] font-semibold text-white/80">{d.val.toLocaleString()}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${d.pct}%`, backgroundColor: d.pct > 50 ? '#24A2A7' : d.pct > 10 ? 'rgba(36,162,167,0.5)' : 'rgba(36,162,167,0.25)' }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[#555] mt-4 text-right">96.2% somewhat or fully satisfied</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">

            {/* Chart 3: Capstone Project Impact */}
            <div data-reveal className="reveal-left rounded-2xl border border-white/[0.06] bg-[#111] p-6 glow-border">
              <p className="text-[13px] font-semibold uppercase tracking-[0.15em] text-[#24A2A7] mb-1">Capstone Project Still Having Impact?</p>
              <p className="text-[12px] text-[#9a9a9f] mb-5">1,231 responses</p>
              <div className="flex items-center gap-6">
                <svg width="120" height="120" viewBox="0 0 120 120" className="shrink-0" role="img" aria-label="Donut chart showing 59% of capstone projects still having impact">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="12" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#24A2A7" strokeWidth="12"
                    strokeDasharray={`${0.594 * 314.16} ${314.16}`}
                    strokeLinecap="round" transform="rotate(-90 60 60)" />
                  <text x="60" y="56" textAnchor="middle" fill="#f5f5f7" fontSize="24" fontWeight="700">59%</text>
                  <text x="60" y="72" textAnchor="middle" fill="#9a9a9f" fontSize="10">Yes</text>
                </svg>
                <div className="space-y-2 text-[13px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#24A2A7]" />
                    <span className="text-white/80">Yes — <span className="text-[#9a9a9f]">731</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/[0.12]" />
                    <span className="text-white/80">No — <span className="text-[#9a9a9f]">450</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/[0.06]" />
                    <span className="text-white/80">Don't remember — <span className="text-[#9a9a9f]">50</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart 4: Volunteer Portal Recording */}
            <div data-reveal className="reveal-right rounded-2xl border border-white/[0.06] bg-[#111] p-6 glow-border">
              <p className="text-[13px] font-semibold uppercase tracking-[0.15em] text-[#24A2A7] mb-1">Volunteer Portal Usage</p>
              <p className="text-[12px] text-[#9a9a9f] mb-5">Of those who volunteer · 443 responses</p>
              <div className="space-y-3">
                {[
                  { label: 'Record 0-25%', val: 162, pct: 36.6 },
                  { label: 'Record 26-50%', val: 83, pct: 18.7 },
                  { label: 'Record 51-75%', val: 60, pct: 13.5 },
                  { label: 'Record 76-100%', val: 51, pct: 11.5 },
                  { label: "Don't record at all", val: 87, pct: 19.6 },
                ].map((d) => (
                  <div key={d.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] text-[#9a9a9f]">{d.label}</span>
                      <span className="text-[12px] font-semibold text-white/80">{d.val}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${d.pct}%`, backgroundColor: d.label.includes("Don't") ? '#ef4444' : 'rgba(36,162,167,0.45)' }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[#ef4444]/60 mt-4 text-right">56% record less than half their hours</p>
            </div>
          </div>

          {/* Survey stats with rings + glow borders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { pct: 80, label: 'Course satisfaction', desc: 'Satisfied with what they learned' },
              { pct: 73, label: 'Post-course engagement', desc: 'Volunteered after certification' },
              { pct: 59, label: 'Lasting stewardship', desc: 'Capstone project still having impact' },
              { pct: 66, label: 'Volunteer capacity', desc: 'Improved their ability to contribute' },
              { pct: 25, label: 'Career impact', desc: 'Changed academic or career direction' },
              { pct: 37, label: 'Volunteering more', desc: 'Increased their volunteer hours' },
            ].map((item, i) => (
              <div key={item.label} data-reveal className="apple-reveal flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 glow-border" style={{ transitionDelay: `${i * 60}ms` }}>
                <StatRing percent={item.pct} />
                <div>
                  <p className="text-2xl font-bold text-white">{item.pct}%</p>
                  <p className="text-[13px] font-semibold text-[#24A2A7] mb-0.5">{item.label}</p>
                  <p className="text-[12px] text-[#9a9a9f]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          USER NEEDS (tilt cards + glow borders)
         ════════════════════════════════════════ */}
      <section id="calnat-needs" className="scroll-mt-20 py-20 md:py-28 bg-[#0a0a0a] px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <Overline>User Needs</Overline>

          <div data-reveal className="apple-reveal mb-14">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Four types of need.
            </h2>
            <p className="text-[17px] text-[#9a9a9f] leading-[1.8] max-w-3xl">
              We mapped the interview and survey data into four categories. Each one pointed toward different design requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {[
              { title: 'Functional', desc: 'A platform that actually works. Resource libraries, event calendars, job boards. The basic infrastructure.', color: '#24A2A7' },
              { title: 'Emotional', desc: 'Feeling like you belong to something after graduation. Getting recognized for the work you do.', color: '#2BB8BD' },
              { title: 'Psychological', desc: 'Staying current. Continuing to learn. Feeling confident that your knowledge isn\'t going stale.', color: '#7DD3D7' },
              { title: 'Social', desc: 'Connecting with other alumni regardless of where they are. Finding people to work on projects with.', color: '#A0E5E8' },
            ].map((need, i) => (
              <TiltCard key={need.title}>
                <div data-reveal className="apple-reveal rounded-2xl border border-white/[0.06] bg-black p-8 glow-border hover:border-white/[0.1] transition-[border-color] duration-500 h-full" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="w-3 h-3 rounded-full mb-4" style={{ backgroundColor: need.color }} />
                  <h4 className="text-lg font-bold text-white mb-3">{need.title}</h4>
                  <p className="text-[15px] text-[#9a9a9f] leading-relaxed">{need.desc}</p>
                </div>
              </TiltCard>
            ))}
          </div>

          {/* Prioritized requirements */}
          <div data-reveal className="apple-reveal">
            <h3 className="text-lg font-bold text-white mb-6">What we prioritized</h3>
            <div className="space-y-0 rounded-2xl border border-white/[0.06] overflow-hidden glow-border">
              {[
                'Social engagement platforms',
                'Simplified volunteer tracking',
                'Access to educational materials',
                'Volunteer opportunity discovery',
                'Alumni story sharing',
                'Direct staff accessibility',
              ].map((req, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                  <span className="text-[13px] font-bold text-[#24A2A7] w-6">{i + 1}</span>
                  <span className="text-[15px] text-[#f5f5f7]">{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          IDEATION (tilt cards + glow borders)
         ════════════════════════════════════════ */}
      <section id="calnat-ideation" className="scroll-mt-20 py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <Overline>Ideation</Overline>

          <div data-reveal className="apple-reveal mb-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              15 ideas in. <span className="text-[#9a9a9f]">3 out.</span>
            </h2>
            <p className="text-[17px] text-[#9a9a9f] leading-[1.8] max-w-3xl">
              We threw everything at the wall. Digital platforms, community structures, incentive programs. A few ideas I personally pushed hard for (Geo-Leaders, reviving the statewide conference, geographic hub groups) made it into the final pitch set.
            </p>
          </div>

          {/* Concept pills */}
          <div data-reveal className="apple-reveal flex flex-wrap gap-2 mb-14">
            {[
              { name: 'SharePoint Hub', hl: false }, { name: 'Official Sponsorships', hl: false },
              { name: 'Geo-Leaders', hl: true }, { name: 'Virtual Classrooms', hl: false },
              { name: 'MarketBooths', hl: false }, { name: 'Swag Program', hl: false },
              { name: 'Revamped Incentives', hl: false }, { name: 'Chat Bot', hl: false },
              { name: 'Text Alerts', hl: false }, { name: 'Alumni Showcasing', hl: false },
              { name: '"What\'s Next?" Training', hl: true }, { name: 'Feedback Loops', hl: false },
              { name: 'Alumni Website Tab', hl: true }, { name: 'Virtual Classroom', hl: false },
              { name: 'Mentorship Connect', hl: true },
            ].map((c) => (
              <span key={c.name} className={`px-4 py-2 rounded-full text-[13px] font-medium transition-[color,background-color,border-color] duration-300 ${c.hl ? 'bg-[#24A2A7]/15 text-[#24A2A7] border border-[#24A2A7]/30' : 'bg-white/[0.04] text-[#9a9a9f] border border-white/[0.06]'}`}>
                {c.name}
              </span>
            ))}
          </div>

          <div data-reveal className="apple-reveal mb-12">
            <p className="text-[17px] text-[#9a9a9f] leading-[1.8] max-w-3xl">
              Ali narrowed us to four finalists. The Alumni Tab and SharePoint concepts overlapped enough that we merged them into one "Digital Resource Platform" idea and moved forward with two distinct prototypes.
            </p>
          </div>

          {/* Top picks with tilt + glow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { pick: '"What\'s Next?" Training', why: 'Attacks the post-graduation void directly, at the partner org level.' },
              { pick: 'Digital Resource Platform', why: 'Merged Alumni Tab + SharePoint into one centralized hub concept.' },
              { pick: 'Mentorship Connect', why: 'Bridges generational gaps. Connects newer alumni with experienced stewards.' },
            ].map((item, i) => (
              <TiltCard key={item.pick}>
                <div data-reveal className="apple-reveal rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6 glow-border hover:border-[#24A2A7]/20 transition-[border-color] duration-500 h-full" style={{ transitionDelay: `${i * 100}ms` }}>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#24A2A7] mb-3">Client pick</p>
                  <p className="text-[17px] font-bold text-white mb-2">{item.pick}</p>
                  <p className="text-[14px] text-[#9a9a9f] leading-relaxed">{item.why}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Nature moment: Giant sequoia ── */}
      <NatureMoment
        src="/case-study/calnat/nature-3.webp"
        alt="A giant sequoia tree towering in Sequoia National Park, California"
        className="h-[70vh]"
      >
        <p className="text-2xl md:text-4xl font-bold text-white/90 tracking-tight">
          From ideas to prototypes.
        </p>
      </NatureMoment>

      {/* ════════════════════════════════════════
          PROTOTYPES (staggered image reveals)
         ════════════════════════════════════════ */}
      <section id="calnat-prototypes" className="scroll-mt-20 py-20 md:py-28 bg-[#0a0a0a] px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <Overline>Prototypes</Overline>

          <div data-reveal className="apple-reveal mb-14">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Two paths. <span className="text-[#9a9a9f]">One recommendation.</span>
            </h2>
            <p className="text-[17px] text-[#9a9a9f] leading-[1.8] max-w-3xl">
              We built both prototypes as functional demos, not mockups. Each one evaluated against accessibility, maintenance burden, and whether it would actually foster real community engagement.
            </p>
          </div>

          {/* Discord */}
          <div className="mb-20 relative">
            {/* Floating Clyde — positioned off to the right on desktop */}
            <div className="hidden lg:block absolute -right-20 xl:-right-28 top-0" data-reveal>
              <DiscordClyde3D />
            </div>

            <div data-reveal className="apple-reveal flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-[#5865F2]" />
              <h3 className="text-2xl md:text-3xl font-bold text-white">Discord</h3>
              <span className="ml-2 text-[11px] font-semibold uppercase tracking-wider text-[#24A2A7] bg-[#24A2A7]/10 px-3 py-1 rounded-full">Recommended</span>
            </div>

            <p data-reveal className="apple-reveal text-[17px] text-[#9a9a9f] leading-[1.8] max-w-3xl mb-8">
              A fully configured server with regional channels for Northern, Central, Southern, and Desert California. Program-specific channels for Alumni Spotlight, Mentorship Connect, and Geo-Leaders. We seeded it with canned responses showing actual use cases.
            </p>

            <div data-reveal className="apple-reveal mb-8">
              <Img src="/case-study/calnat-discord.webp" alt="Discord server prototype for UC Environmental Stewards" caption="Live Discord prototype with regional channels and program features" onOpen={setLightbox} />
            </div>

            <div data-reveal className="apple-reveal grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-[#5865F2]/20 bg-[#5865F2]/[0.04] p-6 glow-border">
                <p className="text-[13px] font-semibold text-[#5865F2] mb-4 uppercase tracking-wider">Why it won</p>
                <ul className="space-y-2 text-[14px] text-[#9a9a9f]">
                  <li>Free at base level</li>
                  <li>Real-time text, voice, and video</li>
                  <li>Channel structure maps perfectly to regions</li>
                  <li>Self-sustaining once community takes hold</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 glow-border">
                <p className="text-[13px] font-semibold text-[#9a9a9f] mb-4 uppercase tracking-wider">Trade-offs</p>
                <ul className="space-y-2 text-[14px] text-[#9a9a9f]">
                  <li>Limited file storage</li>
                  <li>Learning curve for less technical users</li>
                  <li>Needs active moderation at launch</li>
                  <li>Not enterprise-grade security</li>
                </ul>
              </div>
            </div>
          </div>

          {/* SharePoint — staggered image reveals */}
          <div>
            <div data-reveal className="apple-reveal flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-[#0078D4]" />
              <h3 className="text-2xl md:text-3xl font-bold text-white">SharePoint</h3>
            </div>
            <p data-reveal className="apple-reveal text-[17px] text-[#9a9a9f] leading-[1.8] max-w-3xl mb-8">
              A comprehensive SharePoint site with document management, alumni directories, event calendars, engagement analytics, and granular access controls. All built on existing Microsoft 365 infrastructure the university already pays for.
            </p>

            {/* Staggered left/right SharePoint mockups (privacy-safe recreations) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div data-reveal className="reveal-left">
                <SharePointMockup variant="home" />
                <p className="text-[12px] text-[#9a9a9f] mt-3 tracking-wide">Community portal home page</p>
              </div>
              <div data-reveal className="reveal-right">
                <SharePointMockup variant="calendar" />
                <p className="text-[12px] text-[#9a9a9f] mt-3 tracking-wide">Event calendar integration</p>
              </div>
            </div>

            <div data-reveal className="apple-reveal grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-[#0078D4]/20 bg-[#0078D4]/[0.04] p-6 glow-border">
                <p className="text-[13px] font-semibold text-[#0078D4] mb-4 uppercase tracking-wider">Strengths</p>
                <ul className="space-y-2 text-[14px] text-[#9a9a9f]">
                  <li>Enterprise-grade document management</li>
                  <li>Robust security and permissions</li>
                  <li>Microsoft 365 integration</li>
                  <li>Workflow automation</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 glow-border">
                <p className="text-[13px] font-semibold text-[#9a9a9f] mb-4 uppercase tracking-wider">Trade-offs</p>
                <ul className="space-y-2 text-[14px] text-[#9a9a9f]">
                  <li>Requires paid subscription</li>
                  <li>Complex setup (needs IT knowledge)</li>
                  <li>Less social and interactive</li>
                  <li>Steeper learning curve</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          OUTCOME (horizontal scroll deliverables)
         ════════════════════════════════════════ */}
      <section id="calnat-outcome" className="scroll-mt-20">
        <div className="pt-20 md:pt-28 pb-6 md:pb-8 px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            <Overline>Outcome</Overline>

            <div data-reveal className="apple-reveal mb-10">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
                One platform. <span className="text-[#9a9a9f]">A real path forward.</span>
              </h2>
              <p className="text-[17px] text-[#9a9a9f] leading-[1.8] max-w-3xl mt-6">
                On December 5, 2024, we delivered a Learning Guide recommending <strong className="text-white font-semibold">Discord</strong> as the primary community platform. The logic: it's free, low-maintenance, and becomes <span data-reveal className="highlight-reveal">self-sustaining</span> once a critical mass of members starts engaging. That matters when you have 8 staff members and 9,000 alumni.
              </p>
            </div>

            <div data-reveal className="apple-reveal mb-8">
              <h3 className="text-lg font-bold text-white">What we delivered</h3>
            </div>
          </div>
        </div>

        {/* Horizontal scroll showcase (desktop) / stacked grid (mobile) */}
        <HorizontalShowcase>
          {[
            { title: 'Learning Guide', desc: 'Implementation roadmap with assumptions, test plan, and resource needs', num: '01' },
            { title: 'Discord Server', desc: 'Live prototype with channels, roles, and demo content', num: '02' },
            { title: 'SharePoint Deck', desc: 'Enterprise alternative with full capabilities breakdown', num: '03' },
            { title: 'Design Criteria', desc: 'User needs analysis, SWOT, prioritized requirements', num: '04' },
            { title: 'Research Package', desc: 'Interview data, survey analysis, design brief, concept pitches', num: '05' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-8 glow-border flex flex-col justify-between h-full">
              <div>
                <span className="text-[48px] font-bold text-[#24A2A7]/15 leading-none block mb-4">{item.num}</span>
                <p className="text-[17px] font-bold text-white mb-3">{item.title}</p>
                <p className="text-[14px] text-[#9a9a9f] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </HorizontalShowcase>

        {/* Roadmap */}
        <div className="py-16 px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            <div data-reveal className="apple-reveal">
              <h3 className="text-lg font-bold text-white mb-8">Implementation roadmap</h3>
              <div className="space-y-0">
                {[
                  'Survey alumni on Discord familiarity and willingness to join',
                  'Beta test with a small group before rolling it out',
                  'Train admins and establish a social media use agreement',
                  'Iterate with transparent communication during the build period',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-6 py-5 border-b border-white/[0.04] last:border-0">
                    <span className="text-4xl md:text-5xl font-bold text-[#24A2A7]/20 leading-none w-12 shrink-0">{i + 1}</span>
                    <p className="text-[16px] text-[#f5f5f7] leading-relaxed pt-2">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Nature moment: Golden sunrise mountains ── */}
      <NatureMoment
        src="/case-study/calnat/nature-4.webp"
        alt="Golden sunrise illuminating a foggy California mountain landscape"
        className="h-[50vh]"
      />

      {/* ════════════════════════════════════════
          WHAT I LEARNED
         ════════════════════════════════════════ */}
      <section id="calnat-learnings" className="scroll-mt-20 py-20 md:py-28 bg-[#0a0a0a] px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <Overline>What I learned</Overline>

          <div className="space-y-14">
            {[
              {
                title: 'Being the insider changes everything.',
                body: 'I took the same course these alumni took. I know what the fieldwork feels like, what the certification means, and what the silence afterward feels like. That made every interview more honest and every design decision more grounded than anything desk research could have produced.',
              },
              {
                title: 'Design for the people who maintain it.',
                body: 'An 8-person team can\'t manage a high-maintenance platform for 9,000 users. Discord won partly because it can become self-sustaining. The best design acknowledges operational reality, not just user desires.',
              },
              {
                title: 'Geography is a design variable.',
                body: '58 counties across a state the size of California means no single engagement model works everywhere. Regional channels and Geo-Leaders weren\'t nice-to-haves. They were the architecture.',
              },
              {
                title: 'The real deliverable was momentum.',
                body: 'We handed over prototypes and a guide. But the bigger thing was showing Ali\'s team that they could start small, iterate quickly, and build without waiting for a massive budget or a new hire.',
              },
            ].map((item, i) => (
              <div key={i} data-reveal className="apple-reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-[17px] text-[#9a9a9f] leading-[1.8]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          MY ROLE & TIMELINE
         ════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            <div>
              <Overline>My role</Overline>
              <div data-reveal className="apple-reveal space-y-6">
                {[
                  { role: 'Project originator', desc: 'Sourced the client through my own Climate Stewards certification' },
                  { role: 'Client relationship lead', desc: 'Primary point of contact with Ali throughout the engagement' },
                  { role: 'Subject matter expert', desc: 'Brought firsthand experience as a certified Climate Steward' },
                  { role: 'Ideation lead', desc: 'Pushed Geo-Leaders, statewide conference revival, and hub group concepts' },
                  { role: 'Research coordinator', desc: 'Drafted alumni recruitment materials and coordinated listening sessions' },
                  { role: 'Deliverable author', desc: 'Co-authored the Design Brief, Design Criteria, Prototype Report, and Learning Guide' },
                ].map((item) => (
                  <div key={item.role}>
                    <p className="text-[14px] font-semibold text-[#24A2A7] mb-1">{item.role}</p>
                    <p className="text-[15px] text-[#9a9a9f] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Overline>Timeline</Overline>
              <div data-reveal className="apple-reveal space-y-0">
                {[
                  { date: 'Aug 28', event: 'Emailed program director. Connected with Ali same day.' },
                  { date: 'Sep 6', event: 'First team working session with Ali (virtual).' },
                  { date: 'Sep 22', event: 'Design Brief v2.0 delivered.' },
                  { date: 'Oct 18', event: 'Newsletter out. First alumni listening sessions.' },
                  { date: 'Oct 28', event: 'Design Criteria document issued.' },
                  { date: 'Nov 22', event: 'Discord and SharePoint prototypes presented.' },
                  { date: 'Dec 5', event: 'Learning Guide delivered. Engagement complete.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 py-4 border-b border-white/[0.04] last:border-0">
                    <span className="text-[13px] font-mono font-semibold text-[#24A2A7] w-16 shrink-0 pt-0.5">{item.date}</span>
                    <p className="text-[14px] text-[#9a9a9f] leading-relaxed">{item.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-24 text-center border-t border-white/5">
        <span className="text-[10px] font-black text-[#24A2A7] uppercase tracking-[0.5em] block mb-4">GET IN TOUCH</span>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6">Like what you see?</h2>
        <p className="text-[#9a9a9f] text-[17px] leading-[1.8] max-w-lg mx-auto mb-10">
          I'm always open to discussing new opportunities, creative projects, or just nerding out about design and technology.
        </p>
        <ConnectButton className="group px-10 py-5 bg-[#24A2A7] text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-full hover:brightness-110 transition-[filter,transform] shadow-xl active:scale-95 inline-flex items-center gap-3" />
      </section>

      {/* ════════════════════════════════════════
          FOOTER
         ════════════════════════════════════════ */}
      <section data-reveal className="apple-reveal pt-20 md:pt-28 pb-32 md:pb-36 text-center px-6">
        <p className="text-[14px] text-[#9a9a9f] mb-8">
          Graduate Design Thinking Engagement &middot; Fall 2024
        </p>
        <button onClick={() => navigate('/projects')} className="inline-flex items-center gap-2 text-white font-medium text-sm hover:text-[#24A2A7] transition-colors duration-300">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </button>
      </section>

    </div>
  );
};

export default CalNatCaseStudy;
