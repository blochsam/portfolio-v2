import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, X } from 'lucide-react';
import { COLORS } from '../constants';
import DcadeHeroAnimation from './DcadeHeroAnimation';

/* ─── Scroll reveal (same pattern as CalNat) ─── */
function useScrollReveal() {
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

/* ─── Scroll progress bar ─── */
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
      style={{ width: '0%', background: '#24A2A7' }}
    />
  );
};

/* ─── Overline label ─── */
const Overline: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p data-reveal className="arcade-reveal text-[13px] font-semibold uppercase tracking-[0.2em] text-[#24A2A7] mb-6 font-mono">
    {children}
  </p>
);

/* ─── Image with lightbox ─── */
const Img: React.FC<{
  src: string;
  alt: string;
  caption?: string;
  onOpen: (img: { src: string; alt: string }) => void;
  className?: string;
}> = ({ src, alt, caption, onOpen, className = '' }) => (
  <button
    type="button"
    onClick={() => onOpen({ src, alt })}
    className={`group block w-full text-left cursor-zoom-in ${className}`}
  >
    <div className="overflow-hidden rounded-lg border border-[#24A2A7]/20 glow-border transition-all duration-500 group-hover:shadow-lg group-hover:shadow-[#24A2A7]/10">
      <img src={src} alt={alt} className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]" loading="lazy" />
    </div>
    {caption && <p className="text-[12px] text-[#9a9a9f] mt-3 tracking-wide font-mono">{caption}</p>}
  </button>
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

/* ─── TiltCard (3D hover) ─── */
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
    <div ref={cardRef} onMouseMove={onMove} onMouseLeave={onLeave}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{ transformStyle: 'preserve-3d' }}>
      {children}
    </div>
  );
};

/* ─── Terminal typing effect ─── */
const TerminalText: React.FC<{ text: string; delay?: number; className?: string }> = ({ text, delay = 0, className = '' }) => {
  const [displayed, setDisplayed] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const started = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (started.current) return;
      started.current = true;
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setTimeout(() => setShowCursor(false), 2000);
        }
      }, 45);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return (
    <span className={`font-mono ${className}`}>
      {displayed}
      {showCursor && <span className="animate-pulse text-[#24A2A7]">_</span>}
    </span>
  );
};

/* ─── CRT scanline overlay ─── */
const CRTOverlay: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none z-[2]" aria-hidden="true"
    style={{
      background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
      mixBlendMode: 'multiply',
    }}
  />
);

/* ─── Pixel sprite renderer ─── */
type SpriteData = (string | null)[][];

const SPRITE_SAM: SpriteData = [
  [null,null,null,'#1a1a1a','#1a1a1a','#1a1a1a','#1a1a1a','#1a1a1a','#1a1a1a',null,null,null],
  [null,null,'#1a1a1a','#2d2d2d','#2d2d2d','#2d2d2d','#2d2d2d','#2d2d2d','#2d2d2d','#1a1a1a',null,null],
  [null,'#1a1a1a','#2d2d2d','#2d2d2d','#2d2d2d','#2d2d2d','#2d2d2d','#2d2d2d','#2d2d2d','#2d2d2d','#1a1a1a',null],
  [null,'#1a1a1a','#F4C794','#F4C794','#F4C794','#F4C794','#F4C794','#F4C794','#F4C794','#F4C794','#1a1a1a',null],
  [null,'#F4C794','#F4C794','#3d3d3d','#3d3d3d','#F4C794','#F4C794','#3d3d3d','#3d3d3d','#F4C794','#F4C794',null],
  [null,'#F4C794','#F4C794','#F4C794','#F4C794','#F4C794','#F4C794','#F4C794','#F4C794','#F4C794','#F4C794',null],
  [null,null,'#F4C794','#F4C794','#D4956B','#F4C794','#F4C794','#D4956B','#F4C794','#F4C794',null,null],
  [null,null,null,'#F4C794','#F4C794','#F4C794','#F4C794','#F4C794','#F4C794',null,null,null],
  [null,null,'#24A2A7','#24A2A7','#24A2A7','#24A2A7','#24A2A7','#24A2A7','#24A2A7','#24A2A7',null,null],
  [null,'#24A2A7','#24A2A7','#24A2A7','#24A2A7','#24A2A7','#24A2A7','#24A2A7','#24A2A7','#24A2A7','#24A2A7',null],
  ['#24A2A7','#24A2A7','#24A2A7','#F4C794','#24A2A7','#24A2A7','#24A2A7','#24A2A7','#F4C794','#24A2A7','#24A2A7','#24A2A7'],
  [null,null,null,'#F4C794','#24A2A7','#24A2A7','#24A2A7','#24A2A7','#F4C794',null,null,null],
  [null,null,null,null,'#3d5c8a','#3d5c8a','#3d5c8a','#3d5c8a',null,null,null,null],
  [null,null,null,'#3d5c8a','#3d5c8a',null,null,'#3d5c8a','#3d5c8a',null,null,null],
  [null,null,'#2d2d2d','#2d2d2d','#2d2d2d',null,null,'#2d2d2d','#2d2d2d','#2d2d2d',null,null],
];

const SPRITE_FRIEND1: SpriteData = [
  [null,null,null,'#4a2a1a','#4a2a1a','#4a2a1a','#4a2a1a','#4a2a1a','#4a2a1a',null,null,null],
  [null,null,'#4a2a1a','#5c3a2a','#5c3a2a','#5c3a2a','#5c3a2a','#5c3a2a','#5c3a2a','#4a2a1a',null,null],
  [null,'#4a2a1a','#5c3a2a','#5c3a2a','#5c3a2a','#5c3a2a','#5c3a2a','#5c3a2a','#5c3a2a','#5c3a2a','#4a2a1a',null],
  [null,'#4a2a1a','#E8B87A','#E8B87A','#E8B87A','#E8B87A','#E8B87A','#E8B87A','#E8B87A','#E8B87A','#4a2a1a',null],
  [null,'#E8B87A','#E8B87A','#1a1a1a','#1a1a1a','#E8B87A','#E8B87A','#1a1a1a','#1a1a1a','#E8B87A','#E8B87A',null],
  [null,'#E8B87A','#E8B87A','#E8B87A','#E8B87A','#E8B87A','#E8B87A','#E8B87A','#E8B87A','#E8B87A','#E8B87A',null],
  [null,null,'#E8B87A','#E8B87A','#C08050','#E8B87A','#E8B87A','#C08050','#E8B87A','#E8B87A',null,null],
  [null,null,null,'#E8B87A','#E8B87A','#E8B87A','#E8B87A','#E8B87A','#E8B87A',null,null,null],
  [null,null,'#7B2D8B','#7B2D8B','#7B2D8B','#7B2D8B','#7B2D8B','#7B2D8B','#7B2D8B','#7B2D8B',null,null],
  [null,'#7B2D8B','#7B2D8B','#7B2D8B','#7B2D8B','#7B2D8B','#7B2D8B','#7B2D8B','#7B2D8B','#7B2D8B','#7B2D8B',null],
  ['#7B2D8B','#7B2D8B','#7B2D8B','#E8B87A','#7B2D8B','#7B2D8B','#7B2D8B','#7B2D8B','#E8B87A','#7B2D8B','#7B2D8B','#7B2D8B'],
  [null,null,null,'#E8B87A','#7B2D8B','#7B2D8B','#7B2D8B','#7B2D8B','#E8B87A',null,null,null],
  [null,null,null,null,'#3d3d5c','#3d3d5c','#3d3d5c','#3d3d5c',null,null,null,null],
  [null,null,null,'#3d3d5c','#3d3d5c',null,null,'#3d3d5c','#3d3d5c',null,null,null],
  [null,null,'#2d2d2d','#2d2d2d','#2d2d2d',null,null,'#2d2d2d','#2d2d2d','#2d2d2d',null,null],
];

const SPRITE_FRIEND2: SpriteData = [
  [null,null,null,'#8B4513','#8B4513','#8B4513','#8B4513','#8B4513','#8B4513',null,null,null],
  [null,null,'#8B4513','#A0522D','#A0522D','#A0522D','#A0522D','#A0522D','#A0522D','#8B4513',null,null],
  [null,'#8B4513','#A0522D','#A0522D','#A0522D','#A0522D','#A0522D','#A0522D','#A0522D','#A0522D','#8B4513',null],
  [null,'#8B4513','#DEB887','#DEB887','#DEB887','#DEB887','#DEB887','#DEB887','#DEB887','#DEB887','#8B4513',null],
  [null,'#DEB887','#DEB887','#1a1a1a','#1a1a1a','#DEB887','#DEB887','#1a1a1a','#1a1a1a','#DEB887','#DEB887',null],
  [null,'#DEB887','#DEB887','#DEB887','#DEB887','#DEB887','#DEB887','#DEB887','#DEB887','#DEB887','#DEB887',null],
  [null,null,'#DEB887','#DEB887','#C4956A','#DEB887','#DEB887','#C4956A','#DEB887','#DEB887',null,null],
  [null,null,null,'#DEB887','#DEB887','#DEB887','#DEB887','#DEB887','#DEB887',null,null,null],
  [null,null,'#2E8B57','#2E8B57','#2E8B57','#2E8B57','#2E8B57','#2E8B57','#2E8B57','#2E8B57',null,null],
  [null,'#2E8B57','#2E8B57','#2E8B57','#2E8B57','#2E8B57','#2E8B57','#2E8B57','#2E8B57','#2E8B57','#2E8B57',null],
  ['#2E8B57','#2E8B57','#2E8B57','#DEB887','#2E8B57','#2E8B57','#2E8B57','#2E8B57','#DEB887','#2E8B57','#2E8B57','#2E8B57'],
  [null,null,null,'#DEB887','#2E8B57','#2E8B57','#2E8B57','#2E8B57','#DEB887',null,null,null],
  [null,null,null,null,'#4a4a3a','#4a4a3a','#4a4a3a','#4a4a3a',null,null,null,null],
  [null,null,null,'#4a4a3a','#4a4a3a',null,null,'#4a4a3a','#4a4a3a',null,null,null],
  [null,null,'#2d2d2d','#2d2d2d','#2d2d2d',null,null,'#2d2d2d','#2d2d2d','#2d2d2d',null,null],
];

const SPRITE_FRIEND3: SpriteData = [
  [null,null,null,'#D4A574','#D4A574','#D4A574','#D4A574','#D4A574','#D4A574',null,null,null],
  [null,null,'#D4A574','#E0BB8A','#E0BB8A','#E0BB8A','#E0BB8A','#E0BB8A','#E0BB8A','#D4A574',null,null],
  [null,'#D4A574','#E0BB8A','#E0BB8A','#E0BB8A','#E0BB8A','#E0BB8A','#E0BB8A','#E0BB8A','#E0BB8A','#D4A574',null],
  [null,'#D4A574','#F5D5A8','#F5D5A8','#F5D5A8','#F5D5A8','#F5D5A8','#F5D5A8','#F5D5A8','#F5D5A8','#D4A574',null],
  [null,'#F5D5A8','#F5D5A8','#1a1a1a','#1a1a1a','#F5D5A8','#F5D5A8','#1a1a1a','#1a1a1a','#F5D5A8','#F5D5A8',null],
  [null,'#F5D5A8','#F5D5A8','#F5D5A8','#F5D5A8','#F5D5A8','#F5D5A8','#F5D5A8','#F5D5A8','#F5D5A8','#F5D5A8',null],
  [null,null,'#F5D5A8','#F5D5A8','#D4A574','#F5D5A8','#F5D5A8','#D4A574','#F5D5A8','#F5D5A8',null,null],
  [null,null,null,'#F5D5A8','#F5D5A8','#F5D5A8','#F5D5A8','#F5D5A8','#F5D5A8',null,null,null],
  [null,null,'#E8850C','#E8850C','#E8850C','#E8850C','#E8850C','#E8850C','#E8850C','#E8850C',null,null],
  [null,'#E8850C','#E8850C','#E8850C','#E8850C','#E8850C','#E8850C','#E8850C','#E8850C','#E8850C','#E8850C',null],
  ['#E8850C','#E8850C','#E8850C','#F5D5A8','#E8850C','#E8850C','#E8850C','#E8850C','#F5D5A8','#E8850C','#E8850C','#E8850C'],
  [null,null,null,'#F5D5A8','#E8850C','#E8850C','#E8850C','#E8850C','#F5D5A8',null,null,null],
  [null,null,null,null,'#5c4a3a','#5c4a3a','#5c4a3a','#5c4a3a',null,null,null,null],
  [null,null,null,'#5c4a3a','#5c4a3a',null,null,'#5c4a3a','#5c4a3a',null,null,null],
  [null,null,'#2d2d2d','#2d2d2d','#2d2d2d',null,null,'#2d2d2d','#2d2d2d','#2d2d2d',null,null],
];

const PixelSprite: React.FC<{ data: SpriteData; scale?: number; className?: string }> = ({ data, scale = 4, className = '' }) => (
  <div className={`inline-block ${className}`} style={{ imageRendering: 'pixelated' as any }}>
    {data.map((row, y) => (
      <div key={y} className="flex">
        {row.map((color, x) => (
          <div key={`${y}-${x}`} style={{
            width: scale,
            height: scale,
            backgroundColor: color || 'transparent',
          }} />
        ))}
      </div>
    ))}
  </div>
);

/* ─── Pixel confetti burst ─── */
const PixelConfetti: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return null;
  const colors = ['#24A2A7', '#FFB800', '#FF4444', '#7B2D8B', '#ffffff'];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10" aria-hidden="true">
      {Array.from({ length: 30 }, (_, i) => (
        <div key={i} className="absolute pixel-confetti"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${30 + Math.random() * 40}%`,
            width: `${4 + Math.random() * 6}px`,
            height: `${4 + Math.random() * 6}px`,
            backgroundColor: colors[i % colors.length],
            '--confetti-x': `${(Math.random() - 0.5) * 300}px`,
            '--confetti-y': `${-200 - Math.random() * 200}px`,
            '--confetti-r': `${Math.random() * 720}deg`,
            animationDelay: `${Math.random() * 0.3}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

/* ─── Spec card for technical build ─── */
const SpecCard: React.FC<{
  icon: string;
  title: string;
  description: string;
  color?: string;
}> = ({ icon, title, description, color = '#24A2A7' }) => (
  <TiltCard className="h-full">
    <div className="h-full rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 glow-border transition-colors">
      <div className="text-3xl mb-4" style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}>{icon}</div>
      <h4 className="text-base font-bold text-white mb-2 tracking-tight">{title}</h4>
      <p className="text-[14px] text-[#9a9a9f] leading-relaxed">{description}</p>
    </div>
  </TiltCard>
);

/* ════════════════════════════════════════════════════════════════════════
   D-CADE TYCOON — Standalone HTML5 game embedded via iframe
   See /public/games/dcade-tycoon.html
   ════════════════════════════════════════════════════════════════════════ */


/* ════════════════════════════════════════════════════════════════════════
   DcadeCaseStudy — Main component
   ════════════════════════════════════════════════════════════════════════ */

const DcadeCaseStudy: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useScrollReveal();
  const pixelGridRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const [activeCrew, setActiveCrew] = useState<string | null>(null);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  /* Subtle parallax on hero pixel-grid background */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (pixelGridRef.current) {
            pixelGridRef.current.style.transform = `translateY(${window.scrollY * 0.15}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleDownloadPDF = async () => {
    const { generateCaseStudyPdfHtml } = await import('../utils/generateCaseStudyPdf');
    const html = generateCaseStudyPdfHtml('dcade', window.location.origin);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank', 'width=900,height=700');
    if (win) { win.onload = () => URL.revokeObjectURL(url); } else { URL.revokeObjectURL(url); }
  };

  const CREW = [
    { name: 'Sam', title: 'Chief Architect', quote: 'If it takes more than one button, it\'s broken.', sprite: SPRITE_SAM },
    { name: 'Alec "Milk"', title: 'Gameplay Tester', quote: 'I just kept mashing start until something happened.', sprite: SPRITE_FRIEND1 },
    { name: 'Logan', title: 'Gameplay Tester', quote: 'Best two out of three. No, best three out of five.', sprite: SPRITE_FRIEND2 },
    { name: 'Ethan', title: 'Gameplay Tester', quote: 'I tested every single ROM. Twice. For science.', sprite: SPRITE_FRIEND3 },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#24A2A7]/30 font-sans overflow-x-clip">

      {/* ─── Global styles ─── */}
      <style>{`
        .arcade-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .revealed.arcade-reveal,
        .revealed .arcade-reveal {
          opacity: 1;
          transform: translateY(0);
        }
        [data-reveal] {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        [data-reveal].revealed {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes pixel-confetti {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--confetti-x), var(--confetti-y)) rotate(var(--confetti-r)); opacity: 0; }
        }
        .pixel-confetti {
          animation: pixel-confetti 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-4px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        @keyframes crt-flicker {
          0% { opacity: 0.97; }
          5% { opacity: 1; }
          10% { opacity: 0.98; }
          15% { opacity: 1; }
          50% { opacity: 0.99; }
          100% { opacity: 1; }
        }
        .crt-flicker { animation: crt-flicker 4s infinite; }
        @keyframes glow-pulse {
          0%, 100% { text-shadow: 0 0 20px rgba(36,162,167,0.3), 0 0 40px rgba(36,162,167,0.1); }
          50% { text-shadow: 0 0 30px rgba(36,162,167,0.5), 0 0 60px rgba(36,162,167,0.2); }
        }
        .glow-pulse { animation: glow-pulse 3s ease-in-out infinite; }
        .pixel-grid {
          background-image: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        @keyframes float-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .float-bob { animation: float-bob 3s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .arcade-reveal, [data-reveal] { transition: none !important; opacity: 1; transform: none; }
          .pixel-confetti, .crt-flicker, .glow-pulse, .float-bob { animation: none !important; }
        }
      `}</style>

      <ScrollProgress />

      {/* ─── Lightbox ─── */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 md:p-12"
          onClick={() => setLightbox(null)} role="dialog" aria-label="Enlarged image">
          <button onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all z-[101]"
            aria-label="Close">
            <X className="w-5 h-5" />
          </button>
          <img src={lightbox.src} alt={lightbox.alt}
            className="max-w-full max-h-[85vh] rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* ─── Back button ─── */}
      <button onClick={() => navigate('/projects')}
        className="fixed top-8 left-8 md:left-12 z-[60] flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#24A2A7] transition-all bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/5 hover:border-[#24A2A7]/40 shadow-xl active:scale-95 no-print"
        aria-label="Back to projects">
        <ArrowLeft className="w-4 h-4" />
        Back to Archive
      </button>

      {/* ─── PDF Download FAB ─── */}
      <div className="fixed bottom-32 md:bottom-24 right-6 z-[70] no-print">
        <button onClick={handleDownloadPDF}
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-90 group"
          style={{ backgroundColor: '#24A2A7', color: '#0a0a0a' }}
          title="Download Case Study PDF">
          <Download className="w-8 h-8" />
        </button>
      </div>

      {/* ════════════════════════════════════════
          HERO — Boot Sequence
         ════════════════════════════════════════ */}
      <header className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden crt-flicker">
        {/* Pixel grid background */}
        <div ref={pixelGridRef} className="absolute inset-0 pixel-grid" />
        {/* Scanlines */}
        <CRTOverlay />
        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_#0a0a0a_100%)]" />

        {/* Pixel art storytelling animation */}
        <DcadeHeroAnimation className="z-[1]" />

        <div className="relative z-10">
          <div className="text-[14px] font-mono text-[#24A2A7]/70 mb-6 mt-8">
            <TerminalText text="> LOADING D-CADE.EXE..." delay={500} />
          </div>
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[8rem] font-black leading-[0.85] tracking-tight mb-6">
            <span className="block text-white glow-pulse" style={{
              textShadow: '0 0 40px rgba(36,162,167,0.2), 0 0 80px rgba(36,162,167,0.15)',
            }}>
              The D-Cade
            </span>
          </h1>
          <p className="text-[13px] font-mono uppercase tracking-[0.3em] text-[#24A2A7]/60 mb-4">
            A Raspberry Pi Arcade &middot; 2020
          </p>
          <p className="text-base md:text-lg text-white/30 max-w-lg mx-auto leading-relaxed">
            A busted Sega Dreamcast. A $35 computer. 200+ hours of soldering, printing, and coding.
            One very loud a cappella house.
          </p>
        </div>

        <div className="absolute bottom-12">
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-[#24A2A7]/30 to-transparent mx-auto" />
        </div>
      </header>

      {/* ════════════════════════════════════════
          IMPACT STATS
         ════════════════════════════════════════ */}
      <section className="py-14 md:py-20 px-6 border-y border-white/[0.04]">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { end: 35, suffix: '+', label: 'Retro Games' },
            { end: 1, suffix: '', label: 'Raspberry Pi' },
            { end: 200, suffix: '+', label: 'Build Hours' },
          ].map((stat, i) => (
            <div key={stat.label} data-reveal className="arcade-reveal" style={{ transitionDelay: `${i * 120}ms` }}>
              <p className="text-3xl md:text-4xl font-mono font-bold text-[#24A2A7]">
                <CountUp end={stat.end} suffix={stat.suffix} />
              </p>
              <p className="text-[12px] font-mono text-[#9a9a9f] uppercase tracking-wider mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          THE ORIGIN STORY
         ════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-4xl mx-auto">
        <div data-reveal>
          <Overline>The Origin Story</Overline>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-8 leading-tight">
            My dad brought home an arcade cabinet when I was a kid. I broke it. <span data-reveal className="highlight-reveal">Then I fixed it.</span>
          </h2>
          <div className="space-y-5 text-[17px] text-[#9a9a9f] leading-[1.8]">
            <p>
              When I was little, my dad came home with this custom arcade cabinet he found on Craigslist. It had a Sega
              Dreamcast inside loaded with games my siblings and I couldn't get enough of — Power Stone, Double Dragon,
              Sega Bass Fishing, House of the Dead, Joust, and a bunch more. That thing was the center of our basement
              for years.
            </p>
            <p>
              After enough abuse at the hands of myself, my siblings, and a rotating cast of little cousins, the Dreamcast
              inside finally died. The cabinet sat dormant in our basement for years after that. Just furniture.
            </p>
            <p>
              Fast forward to senior year of college. Winter break. I was home staring at this dead cabinet and decided
              I was going to bring it back to life. The plan: rip out the broken Dreamcast and replace it with a Raspberry
              Pi running RetroPie. Modernize the whole thing. Build something I could bring back to our college house —
              the D-House, home to my a cappella group, the Dischords.
            </p>
          </div>
        </div>

        <div data-reveal className="mt-8">
          <Img
            src="/case-study/d-cade-hero.webp"
            alt="The D-Cade arcade cabinet"
            caption="The D-Cade cabinet, fully restored"
            onOpen={setLightbox}
          />
        </div>
      </section>

      {/* ════════════════════════════════════════
          THE CHALLENGE — Terminal diagnostic
         ════════════════════════════════════════ */}
      <section className="py-14 md:py-20 px-6 md:px-12">
        <div data-reveal className="max-w-3xl mx-auto">
          <Overline>System Diagnostic</Overline>
          <div className="rounded-xl border border-[#24A2A7]/20 bg-[#0d1117] p-6 md:p-8 font-mono text-sm glow-border">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#24A2A7]/10">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="text-[11px] text-white/20 ml-2">diagnostic.sh</span>
            </div>
            <div className="space-y-2 text-white/50">
              <p><span className="text-red-400">[FAIL]</span> Sega Dreamcast ........ dead optical drive</p>
              <p><span className="text-red-400">[FAIL]</span> Dreamcast BIOS ....... corrupted</p>
              <p><span className="text-red-400">[FAIL]</span> A/V output ........... TV has coax only</p>
              <p><span className="text-yellow-400">[WARN]</span> Speaker system ........ blown, needs replacing</p>
              <p><span className="text-yellow-400">[WARN]</span> Controller panel ...... Dreamcast USB only</p>
              <p><span className="text-[#00FF41]">[&nbsp;OK&nbsp;]</span> Cabinet shell ......... structurally sound</p>
              <p><span className="text-[#00FF41]">[&nbsp;OK&nbsp;]</span> CRT television ........ functional (coax)</p>
              <p className="pt-4 text-white/30">---</p>
              <p className="text-[#00FF41]">VERDICT: Dead tech. Great bones. Time to rebuild.</p>
            </div>
          </div>
          <p className="text-[17px] text-[#9a9a9f] mt-6 leading-[1.8]">
            First step was tearing the whole thing apart and figuring out what still worked. The cabinet
            shell and CRT were fine — everything else needed replacing or adapting. This diagnostic became
            my project plan: what's dead, what's salvageable, and what I'd need to buy or build from scratch.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════
          BUILD YOUR OWN D-CADE (Interactive)
         ════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 md:px-12 pixel-grid">
        <div data-reveal className="max-w-5xl mx-auto">
          <Overline>Interactive</Overline>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
            D-Cade Tycoon: Junkyard Edition
          </h2>
          <p className="text-[17px] text-[#9a9a9f] mb-6 max-w-xl leading-[1.8]">
            Dig through piles of college house junk to find the five components you need, then click
            to place them into the cabinet and rebuild the D-Cade from scratch.
          </p>
          <div className="relative rounded-xl overflow-hidden border border-[#24A2A7]/20 bg-[#0d1117] glow-border"
            style={{ boxShadow: '0 0 40px rgba(36,162,167,0.06), 0 4px 32px rgba(0,0,0,0.5)' }}>
            <iframe
              src="/games/dcade-tycoon.html"
              title="D-Cade Tycoon: Junkyard Edition"
              className="w-full border-0"
              style={{ aspectRatio: '4 / 3', maxHeight: 'min(80vh, 820px)', colorScheme: 'dark' }}
              loading="lazy"
              allow="autoplay"
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          THE TECHNICAL BUILD — Spec cards
         ════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 md:px-12 border-t border-white/[0.04]">
        <div data-reveal className="max-w-5xl mx-auto">
          <Overline>The Build</Overline>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
            No guide. No manual. Just a plan and a soldering iron.
          </h2>
          <p className="text-[17px] text-[#9a9a9f] mb-8 max-w-xl leading-[1.8]">
            First I tore the whole thing apart to see what I was working with: an old box TV with only a coax port,
            a blown speaker system, a dead Sega Dreamcast, and a custom joystick panel made from old Dreamcast controllers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '🔧', title: 'Gutting & Retrofit', description: 'Swapped out the dead Dreamcast for a Raspberry Pi running RetroPie. Bought HDMI-to-A/V converters, routed through an RF modulator into the coax-only TV, and got Dreamcast-to-USB adapters so the original controllers would work.', color: '#24A2A7' },
              { icon: '🔊', title: 'Speaker Replacement', description: 'The original speakers were blown. Bought new retro arcade cabinet speakers, installed them, and wired everything through a management board connected to the Pi. The D-House needed volume.', color: '#FFB800' },
              { icon: '🖨️', title: '3D Printing & Mounts', description: "Off-the-shelf Pi cases didn't fit the vintage drawer dimensions. Designed and 3D-printed custom mounting brackets so the Pi slid into a drawer for easy access. Installed a new door for cable management.", color: '#24A2A7' },
              { icon: '🎮', title: 'Software & Customization', description: 'Loaded 35+ ROMs, built custom splash screens so it boots to D-Cade branding, set up SSH for remote management, and configured save states so people could pick up where they left off.', color: '#FF4444' },
            ].map((spec, i) => (
              <div key={spec.title} data-reveal className={i % 2 === 0 ? 'reveal-left' : 'reveal-right'} style={{ transitionDelay: `${i * 100}ms` }}>
                <SpecCard {...spec} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          ENGINEERING DEEP-DIVE
         ════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-4xl mx-auto">
        <div data-reveal>
          <Overline>Engineering Details</Overline>
          <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-6 leading-tight">
            The signal chain from hell (and other fun problems)
          </h3>

          <div className="space-y-10">
            <div data-reveal className="reveal-left">
              <h4 className="text-lg font-bold text-[#FFB800] mb-3">Coax-Only TV, Meet HDMI</h4>
              <p className="text-[17px] text-[#9a9a9f] leading-[1.8]">
                The TV inside the cabinet had no A/V ports. Just coax. So I had to chain together an HDMI-to-A/V
                converter, then run that through an RF modulator to get the signal into the TV. It took a few tries
                to get the picture clean — lots of static, lots of swearing — but once it clicked, the CRT gave
                everything that warm, slightly curved retro look that an LCD just can't replicate.
              </p>
            </div>

            <div data-reveal className="reveal-right" style={{ transitionDelay: '120ms' }}>
              <h4 className="text-lg font-bold text-[#24A2A7] mb-3">3D-Printed Custom Mounts</h4>
              <p className="text-[17px] text-[#9a9a9f] leading-[1.8]">
                The Dreamcast used to sit in this internal drawer, but the Pi is tiny by comparison. Nothing fit.
                I designed and 3D-printed custom mounting brackets so the Pi slid into the drawer neatly, with all
                the cables organized. Installed a new access door too, so I could swap SD cards or troubleshoot
                without tearing the whole cabinet apart.
              </p>
            </div>
          </div>
        </div>

        <div data-reveal className="mt-8">
          <Img
            src="/case-study/d-cade-splash.webp"
            alt="Custom D-Cade splash screen"
            caption="Custom splash screen — boots to D-Cade branding, not a Linux terminal"
            onOpen={setLightbox}
          />
        </div>
      </section>

      {/* ════════════════════════════════════════
          THE "DRUNK-PROOF" DESIGN
         ════════════════════════════════════════ */}
      <section className="py-14 md:py-20 px-6 md:px-12 border-t border-white/[0.04]">
        <div data-reveal className="max-w-4xl mx-auto">
          <Overline>UX Philosophy</Overline>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-8 leading-tight">
            The "D-House Party" Test
          </h2>
          <div className="space-y-5 text-[17px] text-[#9a9a9f] leading-[1.8]">
            <p>
              This thing was going to live in a college house. People would walk up to it at midnight, mid-party,
              and they needed to go from standing in front of a black box to <span data-reveal className="highlight-reveal">playing a game in under ten seconds</span>.
              No instructions. No help menus.
            </p>
            <p>
              So everything was designed around that. Custom splash screens boot straight into the game browser — no
              Linux terminal in sight. I pre-tested every ROM to make sure it worked with the original joystick and
              button mapping. I set up SSH so I could manage the Pi from my laptop without ever opening the cabinet.
              Save states meant people could pick up where someone else left off. The magnetic latch on the access
              door kept curious hands away from the cables.
            </p>
            <p>
              The real validation came at our first house party after install. People just walked up and started
              playing. Nobody asked how it worked. That was the whole point.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          THE CREW — Pixel sprites
         ════════════════════════════════════════ */}
      <section className="py-14 md:py-20 px-6 md:px-12 pixel-grid">
        <div className="max-w-4xl mx-auto text-center">
          <div data-reveal>
            <Overline>The Crew</Overline>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
              It took a house.
            </h2>
            <p className="text-[17px] text-[#9a9a9f] mb-10 max-w-lg mx-auto leading-[1.8]">
              The D-Cade was my project, but these guys put in serious hours testing every ROM, breaking things I
              thought were unbreakable, and making sure it held up at house parties.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
            {CREW.map((member, i) => (
              <div
                key={member.name}
                data-reveal
                className="arcade-reveal group relative cursor-pointer"
                style={{ transitionDelay: `${i * 120}ms` }}
                onClick={() => setActiveCrew(activeCrew === member.name ? null : member.name)}
              >
                <div className="flex flex-col items-center">
                  <div className={`mb-4 transition-transform duration-300 ${activeCrew === member.name ? '-translate-y-2' : 'group-hover:-translate-y-2'}`}>
                    <PixelSprite data={member.sprite} scale={5} />
                  </div>
                  <p className="text-sm font-bold text-white mb-1">{member.name}</p>
                  <p className="text-[10px] font-mono text-[#24A2A7] uppercase tracking-wider">{member.title}</p>
                </div>
                {/* Speech bubble on hover/tap */}
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 -translate-y-full transition-all duration-300 pointer-events-none z-10 ${activeCrew === member.name ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <div className="bg-white text-[#0a0a0a] text-[11px] font-medium px-3 py-2 rounded-lg shadow-lg w-max max-w-[180px] text-center">
                    &ldquo;{member.quote}&rdquo;
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          LEGACY
         ════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 md:px-12 border-t border-white/[0.04]">
        <div data-reveal className="max-w-4xl mx-auto">
          <Overline>Legacy</Overline>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-8 leading-tight">
            From the D-House to a doctor's office in South Lyon.
          </h2>
          <div className="space-y-5 text-[17px] text-[#9a9a9f] leading-[1.8]">
            <p>
              The D-Cade lived in the D-House for two years. It survived house parties, a cappella rehearsals,
              and the kind of aggressive love that only college students can give a piece of electronics. When we
              graduated, I didn't want it collecting dust in another basement.
            </p>
            <p>
              It now sits in the waiting room of a popular doctor's office in South Lyon, Michigan. <span data-reveal className="highlight-reveal">Fully operational</span>.
              Still running the same 35+ games. Kids play it while they wait for appointments. I joke that it's my
              greatest contribution to public health.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          REFLECTION
         ════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 md:px-12">
        <div data-reveal className="max-w-3xl mx-auto text-center">
          <Overline>Reflection</Overline>
          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-8 leading-tight">
            What I took away from the build
          </h2>
          <div className="space-y-5 text-[17px] text-[#9a9a9f] leading-[1.8] text-left md:text-center">
            <p>
              This was a winter break project. Nobody assigned it. There was no deadline, no grade, no client. I just
              couldn't look at that dead cabinet anymore. That kind of motivation — the <span data-reveal className="highlight-reveal">"I have to fix this"</span> kind —
              taught me more about project management than any class did.
            </p>
            <p>
              Loading it into my mom's minivan, driving it an hour to East Lansing, and rebuilding it in the D-House
              over a weekend gave me a real sense of what it takes to ship something physical. A/V wiring, 3D printing,
              soldering, SSH configuration — none of these were in my major. I just learned them because the project
              needed them.
            </p>
            <p>
              The moment it stopped being my project and became the house's arcade, every decision got sharper. The
              people playing it didn't care how the signal chain worked. They just wanted to press start.
            </p>
          </div>

          {/* Skills used */}
          <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-4 max-w-xl mx-auto">
            <div data-reveal className="arcade-reveal">
              <h4 className="text-[11px] font-mono font-bold text-[#24A2A7] uppercase tracking-widest mb-3">Technical</h4>
              <ul className="space-y-2 text-left">
                {['Raspberry Pi / Linux', 'A/V Signal Routing', '3D Printing & CAD', 'Soldering & Wiring', 'SSH & Networking', 'RetroPie Configuration'].map((skill, i) => (
                  <li key={skill} data-reveal className="arcade-reveal text-[13px] text-[#9a9a9f] flex items-center gap-2" style={{ transitionDelay: `${i * 60}ms` }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#24A2A7] flex-shrink-0" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
            <div data-reveal className="arcade-reveal" style={{ transitionDelay: '100ms' }}>
              <h4 className="text-[11px] font-mono font-bold text-[#FFB800] uppercase tracking-widest mb-3">Soft Skills</h4>
              <ul className="space-y-2 text-left">
                {['Self-Directed Learning', 'Project Scoping', 'User-Centered Design', 'Creative Problem Solving', 'Resourcefulness', 'Physical Prototyping'].map((skill, i) => (
                  <li key={skill} data-reveal className="arcade-reveal text-[13px] text-[#9a9a9f] flex items-center gap-2" style={{ transitionDelay: `${(i * 60) + 100}ms` }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] flex-shrink-0" />
                    {skill}
                  </li>
                ))}
              </ul>
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

      {/* ─── Footer ─── */}
      <section className="pt-14 pb-24 text-center px-6 border-t border-white/[0.04]">
        <p className="text-[13px] font-mono text-white/30 mb-6">A Raspberry Pi Arcade &middot; 2020</p>
        <button onClick={() => navigate('/projects')} className="inline-flex items-center gap-2 text-white font-medium text-sm hover:text-[#24A2A7] transition-colors duration-300">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </button>
      </section>
    </div>
  );
};

export default DcadeCaseStudy;
