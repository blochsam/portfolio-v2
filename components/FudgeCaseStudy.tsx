import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFooterAwareBottom } from '../utils/useFooterAwareBottom';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, X } from 'lucide-react';
import { COLORS } from '../constants';
import {useScrollReveal, Overline as SharedOverline, CaseStudyImage as Img, CountUp, AtAGlance } from './CaseStudyShared';
import ConnectButton from './ConnectButton';

/* ─── Dorothy Draper / Camellia Rose palette ─── */
const FUDGE = {
  teal: '#24A2A7',       // site-wide UI accent (inherited)
  tealLight: '#7DD3D7',  // gradient endpoint
  rose: '#C41E63',       // Dorothy Draper decorative accent
  softPink: '#E88EAC',
  green: '#2D5016',
  copper: '#B8860B',
  copperLight: '#D4A848',
  cream: '#FFF8F0',
  dark: '#0A0A0A',
};

/* ─── Overline (Fudge theme — uses teal from palette) ─── */
const Overline: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SharedOverline style={{ color: FUDGE.teal }}>{children}</SharedOverline>
);

/* ─── Full-bleed botanical parallax section ─── */
const BotanicalMoment: React.FC<{
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
    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.55), rgba(196,30,99,0.06), rgba(10,10,10,0.55))' }} />
    {children && (
      <div data-reveal className="apple-reveal relative z-10 text-center px-6 max-w-3xl mx-auto">
        {children}
      </div>
    )}
  </section>
);

/* ─── Falling rose petals ─── */
const FallingRoses: React.FC<{ count?: number }> = ({ count = 14 }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {Array.from({ length: count }, (_, i) => {
      const size = 14 + Math.random() * 18;
      const duration = 12 + Math.random() * 16;
      const delay = Math.random() * 22;
      const drift = -60 + Math.random() * 120;
      const driftEnd = -40 + Math.random() * 80;
      const opacity = 0.25 + Math.random() * 0.45;
      const scale = 0.5 + Math.random() * 0.7;
      return (
        <div
          key={i}
          className="absolute falling-petal"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${size}px`,
            width: `${size}px`,
            height: `${size}px`,
            '--petal-dur': `${duration}s`,
            '--petal-del': `${delay}s`,
            '--petal-drift': `${drift}px`,
            '--petal-drift-end': `${driftEnd}px`,
            '--petal-opacity': String(opacity),
            '--petal-scale': String(scale),
          } as React.CSSProperties}
        >
          <svg viewBox="0 0 24 28" fill="none" className="w-full h-full">
            <path
              d="M12 1C7 1 2 6 2 12c0 4 2.5 7.5 5 10 1.8 1.8 3.5 3 5 4 1.5-1 3.2-2.2 5-4 2.5-2.5 5-6 5-10 0-6-5-11-10-11z"
              fill={FUDGE.rose}
              fillOpacity={0.55}
            />
            <path
              d="M12 4c-3 0-5 3-5 6s1.5 5.5 3.5 7.5c1 1 2 2 1.5 3 .5-.5 1.5-2 1.5-3C15 16 17 14 17 10s-2-6-5-6z"
              fill={FUDGE.softPink}
              fillOpacity={0.4}
            />
          </svg>
        </div>
      );
    })}
  </div>
);

/* ─── Floating rose particles ─── */
const FloatingParticles: React.FC<{ count?: number }> = ({ count = 12 }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className="absolute rounded-full floating-particle"
        style={{
          width: `${3 + Math.random() * 5}px`,
          height: `${3 + Math.random() * 5}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          backgroundColor: i % 3 === 0 ? FUDGE.rose : i % 3 === 1 ? FUDGE.softPink : FUDGE.copperLight,
          opacity: 0,
          '--fp-dur': `${8 + Math.random() * 14}s`,
          '--fp-del': `${Math.random() * 10}s`,
        } as React.CSSProperties}
      />
    ))}
  </div>
);

/* ─── Scroll progress bar ─── */
const ScrollProgress: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (barRef.current) barRef.current.style.width = `${pct}%`;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[80] no-print">
      <div ref={barRef} className="h-full" style={{ width: '0%', background: `linear-gradient(90deg, ${FUDGE.teal}, ${FUDGE.tealLight})` }} />
    </div>
  );
};

/* ─── TiltCard ─── */
const TiltCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const handleMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card || window.matchMedia('(hover: none)').matches) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale3d(1.03, 1.03, 1.03)`;
  }, []);
  const handleLeave = useCallback(() => {
    if (cardRef.current) cardRef.current.style.transform = '';
  }, []);
  return (
    <div ref={cardRef} onMouseMove={handleMove} onMouseLeave={handleLeave} className={`transition-transform duration-300 ease-out ${className}`}>
      {children}
    </div>
  );
};

/* ─── ProcessFlow ─── */
const ProcessFlow: React.FC<{ steps: string[] }> = ({ steps }) => (
  <div data-reveal className="apple-reveal flex items-center justify-center gap-0 overflow-x-auto py-4 px-2" style={{ transitionDelay: '200ms' }}>
    {steps.map((step, i) => (
      <React.Fragment key={step}>
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold border-2"
               style={{ borderColor: FUDGE.teal, color: FUDGE.teal }}>
            {i + 1}
          </div>
          <span className="text-[11px] text-[#9a9a9f] text-center max-w-[80px]">{step}</span>
        </div>
        {i < steps.length - 1 && (
          <div className="w-8 md:w-12 h-[2px] shrink-0 mt-[-18px]" style={{ background: `linear-gradient(90deg, ${FUDGE.teal}, ${FUDGE.tealLight})` }} />
        )}
      </React.Fragment>
    ))}
  </div>
);

/* ─── PhoneFrame for app screenshots ─── */
const PhoneFrame: React.FC<{
  src: string;
  alt: string;
  caption?: string;
  onOpen: (img: { src: string; alt: string }) => void;
}> = ({ src, alt, caption, onOpen }) => (
  <button
    type="button"
    onClick={() => onOpen({ src, alt })}
    className="group cursor-zoom-in mx-auto block"
  >
    <div className="relative mx-auto w-[220px] md:w-[260px]">
      <div className="rounded-[2.5rem] border-[6px] border-[#2a2a2a] bg-black p-[3px] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
           style={{ boxShadow: `0 20px 60px rgba(196, 30, 99, 0.12), 0 8px 20px rgba(0,0,0,0.4)` }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-[20px] bg-[#2a2a2a] rounded-b-2xl z-10" />
        <div className="rounded-[2rem] overflow-hidden bg-white">
          <img src={src} alt={alt} className="w-full h-auto" loading="lazy" />
        </div>
      </div>
    </div>
    {caption && <p className="text-[12px] text-[#9a9a9f] mt-4 tracking-wide text-center">{caption}</p>}
  </button>
);

/* ─── Horizontal scroll showcase ─── */
const HorizontalShowcase: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="overflow-x-auto scrollbar-thin -mx-6 px-6 pb-4" style={{ WebkitOverflowScrolling: 'touch' }}>
    <div className="flex gap-6">
      {children}
    </div>
  </div>
);

/* ════════════════════════════════════════════════════════════════════════════
   FudgeCaseStudy — Dorothy Draper / Camellia Rose
   ════════════════════════════════════════════════════════════════════════════ */

const FudgeCaseStudy: React.FC = () => {
  const navigate = useNavigate();
  const fabBottom = useFooterAwareBottom();
  const containerRef = useScrollReveal();
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);

  /* Hero parallax */
  useEffect(() => {
    const heroImg = heroImgRef.current;
    const heroText = heroTextRef.current;
    if (!heroImg || !heroText) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const vh = window.innerHeight;
        heroImg.style.opacity = String(1 - Math.min(y / (vh * 0.6), 1));
        heroImg.style.transform = `scale(${1 + Math.min(y / (vh * 2), 0.2)})`;
        heroText.style.opacity = String(1 - Math.min(y / (vh * 0.45), 1));
        heroText.style.transform = `translateY(${Math.min(y * 0.25, 80)}px)`;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Escape to close lightbox */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  /* PDF download */
  const handleDownloadPDF = async () => {
    const { generateCaseStudyPdfHtml } = await import('../utils/generateCaseStudyPdf');
    const html = generateCaseStudyPdfHtml('fudge', window.location.origin);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank', 'width=900,height=700');
    if (win) { win.onload = () => URL.revokeObjectURL(url); }
    else { URL.revokeObjectURL(url); }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white selection:bg-[#C41E63]/30 font-sans overflow-x-clip">
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

      {/* Back button */}
      <button onClick={() => navigate('/projects')} className="fixed top-8 left-8 md:left-12 z-[60] flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-[color,border-color,transform] bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/5 hover:border-[#24A2A7]/40 shadow-xl active:scale-95 no-print" aria-label="Back to projects">
        <ArrowLeft className="w-4 h-4" />
        Back to Archive
      </button>

      {/* PDF download FAB */}
      <div className="fixed right-6 z-[70] no-print" style={{ bottom: fabBottom }}>
        <button onClick={handleDownloadPDF} className="h-14 px-5 rounded-full flex items-center justify-center gap-2 shadow-2xl transition-transform hover:scale-105 active:scale-95 group" style={{ backgroundColor: FUDGE.teal, color: 'white' }} aria-label="Download case study PDF">
          <Download className="w-6 h-6" />
          <span className="text-xs font-black uppercase tracking-widest">PDF</span>
        </button>
      </div>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <header className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div ref={heroImgRef} className="absolute inset-0">
          <img
            src="/case-study/fudge/fudge-hero.webp"
            alt="The Grand Hotel on Mackinac Island with spring daffodils"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/65" />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(196,30,99,0.12) 0%, transparent 70%)' }} />
        </div>

        <FallingRoses count={14} />
        <FloatingParticles count={6} />

        <div ref={heroTextRef} className="relative z-10 max-w-3xl">
          <p className="text-[13px] font-semibold uppercase tracking-[0.25em] text-[#E88EAC] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 fill-mode-both">
            Full-Stack PWA · Spring 2026
          </p>
          <h1
            className="text-6xl md:text-8xl font-black mb-6 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500 fill-mode-both"
            style={{
              fontFamily: "'Playfair Display', serif",
              backgroundImage: `linear-gradient(135deg, ${FUDGE.copper}, ${FUDGE.copperLight}, ${FUDGE.copper})`,
              textShadow: '0 4px 30px rgba(184,134,11,0.3)',
            }}
          >
            Fudge
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000 fill-mode-both">
            Coordinating 16 people. One island. Zero spreadsheets.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-in fade-in duration-1000 delay-[1500ms] fill-mode-both">
          <div className="w-[1px] h-10 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
        </div>
      </header>

      <AtAGlance accent="#C41E63" items={[
        { label: "What", value: "A PWA that coordinated a 16-person Mackinac Island trip" },
        { label: "My role", value: "One developer, one AI partner" },
        { label: "Outcome", value: "Shipped, installed, and used for the real trip" },
        { label: "Stack", value: "Next.js 15 · React 19 · Supabase · PWA" }
      ]} />


      {/* ═══════════════════ IMPACT NUMBERS ═══════════════════ */}
      <section className="relative py-24 md:py-32 px-6 overflow-hidden" style={{ background: FUDGE.dark }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(196,30,99,0.06) 0%, transparent 70%)` }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 data-reveal className="apple-reveal text-2xl md:text-3xl font-bold text-[#f5f5f7] mb-16">
            Built for real people, by one.
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { end: 16, suffix: '', label: 'Trip Members' },
              { end: 7, suffix: '', label: 'Core Pages' },
              { end: 10, suffix: '+', label: 'Features' },
              { end: 1, suffix: '', label: 'Developer' },
            ].map((stat, i) => (
              <div key={stat.label} data-reveal className="apple-reveal text-center" style={{ transitionDelay: `${i * 120}ms` }}>
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                  <CountUp end={stat.end} suffix={stat.suffix} />
                </p>
                <p className="text-[12px] text-[#9a9a9f] uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ BOTANICAL MOMENT 1 ═══════════════════ */}
      <BotanicalMoment
        src="/case-study/fudge/island-1.webp"
        alt="Mackinac Island harbor with historic buildings"
        className="h-[50vh]"
      />

      {/* ═══════════════════ THE STORY ═══════════════════ */}
      <section className="py-24 md:py-32 px-6" style={{ background: FUDGE.dark }}>
        <div className="max-w-3xl mx-auto">
          <Overline>The Story</Overline>
          <p data-reveal className="apple-reveal text-xl md:text-2xl text-[#f5f5f7] leading-[1.7] mb-8" style={{ transitionDelay: '100ms' }}>
            Every year, the same group of friends heads to{' '}
            <span data-reveal className="highlight-reveal-rose">Mackinac Island</span>{' '}
            for a three-day conference at The Grand Hotel. Sixteen people, scattered flights, complicated room assignments, and one group text that nobody can keep up with.
          </p>
          <p data-reveal className="apple-reveal text-[17px] text-[#9a9a9f] leading-[1.8] mb-8" style={{ transitionDelay: '200ms' }}>
            In past years, trip logistics lived in a Google Sheet nobody updated, a group iMessage that buried important details under memes, and a flurry of Venmo requests that nobody could track. People missed events. Nobody knew their room assignment. Someone always asked about the ferry schedule for the hundredth time.
          </p>
          <p data-reveal className="apple-reveal text-[17px] text-[#9a9a9f] leading-[1.8]" style={{ transitionDelay: '300ms' }}>
            So for 2026, I decided to{' '}
            <span data-reveal className="highlight-reveal-rose">build the app myself</span>.
            Not as a side project for my portfolio, but because my friends genuinely needed it. The app had to feel native on everyone's phone, require zero downloads, and handle everything from room assignments to restaurant recommendations. And it had to be done fast.
          </p>
        </div>
      </section>

      {/* ═══════════════════ THE PROBLEM ═══════════════════ */}
      <section className="py-24 md:py-32 px-6 bg-black">
        <div className="max-w-5xl mx-auto">
          <Overline>The Problem</Overline>
          <h2 data-reveal className="apple-reveal text-3xl md:text-5xl font-bold text-[#f5f5f7] mb-6">
            Group trips are chaos.<br />
            <span className="text-[#9a9a9f]">Everyone knows it.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12">
            {[
              { title: 'The Spreadsheet Trap', desc: 'Google Sheets, iMessages, emails — logistics scattered across five-plus platforms that nobody consistently checks.' },
              { title: 'Payment Headaches', desc: 'Who paid the hotel deposit? Who owes what for dinner? Venmo requests lost in the noise.' },
              { title: 'Decision Paralysis', desc: 'Sixteen opinions on rooms, travel plans, and activities. No single source of truth to cut through the back-and-forth.' },
              { title: 'The Organizer Burden', desc: 'One person ends up fielding every question, tracking every detail, and repeating themselves constantly.' },
              { title: 'Information Decay', desc: 'Important details buried in old messages. Drive times, ferry schedules, packing lists — all gone when you need them.' },
            ].map((item, i) => (
              <TiltCard key={item.title}>
                <div data-reveal className="apple-reveal rounded-2xl border border-white/[0.06] glow-border p-6 bg-white/[0.02] h-full" style={{ transitionDelay: `${i * 100}ms` }}>
                  <h3 className="text-[15px] font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-[14px] text-[#9a9a9f] leading-relaxed">{item.desc}</p>
                </div>
              </TiltCard>
            ))}
          </div>

          {/* Design question */}
          <div data-reveal className="apple-reveal mt-16 text-center" style={{ transitionDelay: '500ms' }}>
            <div className="w-16 h-[1px] mx-auto mb-6" style={{ background: FUDGE.teal }} />
            <p className="text-lg md:text-xl text-[#f5f5f7] italic max-w-lg mx-auto" style={{ fontFamily: "'Playfair Display', serif" }}>
              "How do you turn trip chaos into something that actually works — for everyone?"
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════ BOTANICAL MOMENT 2 ═══════════════════ */}
      <BotanicalMoment
        src="/case-study/fudge/island-2.webp"
        alt="Colorful gardens on Mackinac Island"
        className="h-[45vh]"
      />

      {/* ═══════════════════ BUILDING WITH CLAUDE ═══════════════════ */}
      <section className="py-24 md:py-32 px-6" style={{ background: FUDGE.dark }}>
        <div className="max-w-5xl mx-auto">
          <Overline>The Build</Overline>
          <h2 data-reveal className="apple-reveal text-3xl md:text-5xl font-bold text-[#f5f5f7] mb-4">
            One developer. One AI partner.<br />
            <span className="text-[#9a9a9f]">Full-stack in weeks.</span>
          </h2>
          <p data-reveal className="apple-reveal text-[17px] text-[#9a9a9f] leading-[1.8] max-w-3xl mb-10" style={{ transitionDelay: '100ms' }}>
            I didn't use Claude as a code autocomplete tool. I used it as a full engineering partner — one that could implement complex features, debug production issues, and iterate on solutions while I focused on product decisions, design direction, and quality control.
          </p>

          <ProcessFlow steps={['Architecture', 'Auth & Data', 'Core Pages', 'Admin Tools', 'Polish & PWA']} />

          {/* Two-column roles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
            <div data-reveal className="reveal-left rounded-2xl border border-white/[0.06] glow-border p-6 bg-[#111]">
              <h3 className="text-[15px] font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: FUDGE.copper }} /> What I Did
              </h3>
              <ul className="space-y-2 text-[14px] text-[#9a9a9f] leading-relaxed">
                <li>• Defined every feature from real trip pain points</li>
                <li>• Chose the Dorothy Draper visual direction</li>
                <li>• Selected the full tech stack and architecture</li>
                <li>• Tested every flow, caught every edge case</li>
                <li>• Deployed to production with custom domain + SSL</li>
              </ul>
            </div>
            <div data-reveal className="reveal-right rounded-2xl border border-white/[0.06] glow-border p-6 bg-[#111]">
              <h3 className="text-[15px] font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: FUDGE.rose }} /> What Claude Did
              </h3>
              <ul className="space-y-2 text-[14px] text-[#9a9a9f] leading-relaxed">
                <li>• Implemented features across React, API routes, SQL</li>
                <li>• Debugged cross-browser CSS and auth edge cases</li>
                <li>• Built database schemas and Row Level Security</li>
                <li>• Generated responsive layouts from my descriptions</li>
                <li>• Iterated rapidly based on my feedback</li>
              </ul>
            </div>
          </div>

          {/* Pull quote */}
          <div data-reveal className="apple-reveal mt-14 text-center" style={{ transitionDelay: '200ms' }}>
            <blockquote className="text-lg md:text-xl text-[#f5f5f7] italic max-w-2xl mx-auto" style={{ fontFamily: "'Playfair Display', serif" }}>
              "The skill isn't in writing the code — it's in knowing what to build, how to direct the build, and when the result is good enough to ship."
            </blockquote>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FEATURE WALKTHROUGH ═══════════════════ */}
      <section className="py-24 md:py-32 px-6 bg-black">
        <div className="max-w-5xl mx-auto">
          <Overline>Features</Overline>
          <h2 data-reveal className="apple-reveal text-3xl md:text-5xl font-bold text-[#f5f5f7] mb-4">
            Seven pages. Ten-plus features.<br />
            <span className="text-[#9a9a9f]">One cohesive experience.</span>
          </h2>
          <p data-reveal className="apple-reveal text-[17px] text-[#9a9a9f] leading-[1.8] max-w-3xl mb-16" style={{ transitionDelay: '100ms' }}>
            Every screen was designed mobile-first with a Dorothy Draper-inspired aesthetic — bold botanicals, rich greens, and warm copper accents echoing The Grand Hotel's iconic interior.
          </p>

          {/* Feature 1: Splash + Login side by side */}
          <div data-reveal className="apple-reveal grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24" style={{ transitionDelay: '200ms' }}>
            <div className="flex gap-6 justify-center">
              <PhoneFrame src="/case-study/fudge/fudge-splash.webp" alt="Fudge splash screen with camellia roses" onOpen={setLightbox} caption="Splash screen" />
              <PhoneFrame src="/case-study/fudge/fudge-login.webp" alt="Magic link login page" onOpen={setLightbox} caption="Magic link login" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Passwordless Authentication</h3>
              <p className="text-[15px] text-[#9a9a9f] leading-relaxed">
                No passwords to remember or reset. Users enter their email, tap a magic link, and they're in. After signing in, they claim their pre-created profile from a list of trip members. The organizer pre-seeds all 16 profiles with room assignments, roles, and travel details — so the app works before anyone even signs up.
              </p>
            </div>
          </div>

          {/* Feature 2: Itinerary */}
          <div data-reveal className="apple-reveal grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24" style={{ transitionDelay: '100ms' }}>
            <div className="order-2 md:order-1">
              <h3 className="text-xl font-bold text-white mb-3">Dynamic Itinerary</h3>
              <p className="text-[15px] text-[#9a9a9f] leading-relaxed">
                The heart of the app. A day-by-day schedule that auto-advances to the current day during the trip. Events are filterable by role — judges see their obligations, non-judges see theirs. The admin edits the schedule in real time, and changes appear instantly for all users.
              </p>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <PhoneFrame src="/case-study/fudge/fudge-itinerary.webp" alt="Itinerary page with day tabs and role filters" onOpen={setLightbox} caption="Itinerary with day tabs and role filters" />
            </div>
          </div>

          {/* Feature 3: Rooms + Travel side by side */}
          <div data-reveal className="apple-reveal grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24" style={{ transitionDelay: '100ms' }}>
            <div className="flex gap-6 justify-center">
              <PhoneFrame src="/case-study/fudge/fudge-rooms.webp" alt="Room assignments page" onOpen={setLightbox} caption="Room assignments" />
              <PhoneFrame src="/case-study/fudge/fudge-travel.webp" alt="Travel coordinator with booking guidelines" onOpen={setLightbox} caption="Travel coordinator" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Rooms & Travel</h3>
              <p className="text-[15px] text-[#9a9a9f] leading-relaxed">
                Room assignments show who's staying where with profile photos and tappable phone numbers. The travel coordinator surfaces booking guidelines, driving logistics, and ferry info — with a dismissable (but re-accessible) travel advisory for first-time visitors covering drive times, flight recommendations, and airport pickup coordination.
              </p>
            </div>
          </div>

          {/* Feature 4: Explore + Resources side by side */}
          <div data-reveal className="apple-reveal grid grid-cols-1 md:grid-cols-2 gap-12 items-center" style={{ transitionDelay: '100ms' }}>
            <div className="order-2 md:order-1">
              <h3 className="text-xl font-bold text-white mb-3">Explore & Resources</h3>
              <p className="text-[15px] text-[#9a9a9f] leading-relaxed">
                A curated island guide with activities, restaurants, nightlife, and a map — complete with cost estimates, time commitments, and direct links to directions. Veteran trip-goers' picks are highlighted. The resource hub centralizes everything from the group playlist to packing lists, judging guides, and professional development info.
              </p>
            </div>
            <div className="order-1 md:order-2 flex gap-6 justify-center">
              <PhoneFrame src="/case-study/fudge/fudge-explore.webp" alt="Explore Mackinac guide with curated picks" onOpen={setLightbox} caption="Explore Mackinac" />
              <PhoneFrame src="/case-study/fudge/fudge-resources.webp" alt="Resource hub with quick links" onOpen={setLightbox} caption="Resource hub" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ BOTANICAL MOMENT 3 ═══════════════════ */}
      <BotanicalMoment
        src="/case-study/fudge/island-3.webp"
        alt="Mackinac Island hillside with Victorian homes"
        className="h-[50vh]"
      >
        <p className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}>
          From architecture to polish.
        </p>
      </BotanicalMoment>

      {/* ═══════════════════ TECHNICAL ARCHITECTURE ═══════════════════ */}
      <section className="py-24 md:py-32 px-6" style={{ background: FUDGE.dark }}>
        <div className="max-w-5xl mx-auto">
          <Overline>Architecture</Overline>
          <h2 data-reveal className="apple-reveal text-3xl md:text-5xl font-bold text-[#f5f5f7] mb-12">
            The stack behind the scenes.
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
            {[
              { icon: '⚡', name: 'Next.js 15', role: 'App Router & Server Components' },
              { icon: '⚛️', name: 'React 19', role: 'Component-based UI' },
              { icon: '🗄️', name: 'Supabase', role: 'Auth, PostgreSQL, Storage' },
              { icon: '🎨', name: 'Tailwind CSS', role: 'Utility-first styling' },
              { icon: '▲', name: 'Vercel', role: 'Edge deployment & CI/CD' },
              { icon: '🖼️', name: 'Sharp', role: 'Server-side image compression' },
            ].map((tech, i) => (
              <TiltCard key={tech.name}>
                <div data-reveal className="apple-reveal rounded-2xl border border-white/[0.06] glow-border p-5 bg-white/[0.02] text-center h-full" style={{ transitionDelay: `${i * 80}ms` }}>
                  <span className="text-2xl block mb-3">{tech.icon}</span>
                  <p className="text-[15px] font-semibold text-white mb-1">{tech.name}</p>
                  <p className="text-[12px] text-[#9a9a9f]">{tech.role}</p>
                </div>
              </TiltCard>
            ))}
          </div>

          <h3 data-reveal className="apple-reveal text-xl font-bold text-[#f5f5f7] mb-6">Key Architecture Decisions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { title: 'Identity Claiming System', desc: 'Pre-populated all 16 user rows. When someone signs up via magic link, they select their name and "claim" their profile — migrating all foreign key references to their authenticated UUID.' },
              { title: 'Server-Side Image Compression', desc: 'Profile photos compressed on upload using Sharp (256×256, JPEG Q75). The 16 pre-loaded avatars total just 188KB — keeping the app fast even on spotty island Wi-Fi.' },
              { title: 'Fixed Header with ResizeObserver', desc: 'CSS position: sticky silently fails when any ancestor has overflow: hidden. After two failed attempts, landed on position: fixed with a dynamic spacer that adjusts to the header\'s rendered height.' },
              { title: 'PWA-First Architecture', desc: 'Service worker, web app manifest, and Add to Home Screen tutorial built in from the start. Most users don\'t know PWAs can be installed — the app teaches them on first login.' },
            ].map((item, i) => (
              <div key={item.title} data-reveal className="apple-reveal rounded-2xl border border-white/[0.06] glow-border p-6 bg-[#111]" style={{ transitionDelay: `${i * 100}ms` }}>
                <h4 className="text-[15px] font-semibold text-white mb-2">{item.title}</h4>
                <p className="text-[14px] text-[#9a9a9f] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CHALLENGES ═══════════════════ */}
      <section className="py-24 md:py-32 px-6 bg-black">
        <div className="max-w-5xl mx-auto">
          <Overline>Challenges</Overline>
          <h2 data-reveal className="apple-reveal text-3xl md:text-5xl font-bold text-[#f5f5f7] mb-6">
            The bugs that taught me something.
          </h2>
          <p data-reveal className="apple-reveal text-[17px] text-[#9a9a9f] leading-[1.8] max-w-3xl mb-12" style={{ transitionDelay: '100ms' }}>
            No real project ships without hitting walls. Every debugging session reinforced the same lesson: understanding your own codebase matters, even when AI writes the code.
          </p>

          <div className="space-y-6">
            {[
              {
                title: 'The Phantom Events Problem',
                desc: 'The itinerary page showed events that didn\'t exist in the database. The culprit? A fallback mechanism that displayed hardcoded seed data when the database returned zero events. Simple fix, but finding it required tracing the data flow from query to render.',
              },
              {
                title: 'Registration Tracker False Positives',
                desc: 'The admin dashboard said everyone had already "joined" the app — before anyone signed up. The logic checked for an @ symbol in the email field, but all pre-created rows had real email addresses. Fix: add a claimed_at timestamp column that only gets set when someone actually completes the identity claiming flow.',
              },
              {
                title: 'Git Push Size Limits',
                desc: 'Sixteen profile photos at original resolution totaled 2MB, causing GitHub to reject the push. Batch-compressed all avatars to 256×256 JPEG Q75 using ImageMagick, dropping from 2MB to 188KB. Then implemented Sharp for server-side compression on future uploads.',
              },
            ].map((item, i) => (
              <TiltCard key={item.title}>
                <div data-reveal className="apple-reveal rounded-2xl border border-white/[0.06] glow-border p-6 bg-white/[0.02]" style={{ transitionDelay: `${i * 120}ms` }}>
                  <h3 className="text-[15px] font-semibold text-white mb-3 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: FUDGE.teal }} />
                    {item.title}
                  </h3>
                  <p className="text-[14px] text-[#9a9a9f] leading-relaxed">{item.desc}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ BOTANICAL MOMENT 4 ═══════════════════ */}
      <BotanicalMoment
        src="/case-study/fudge/island-4.webp"
        alt="Mackinac Island waterfront with Victorian architecture"
        className="h-[50vh]"
      />

      {/* ═══════════════════ SKILLS & REFLECTIONS ═══════════════════ */}
      <section className="py-24 md:py-32 px-6" style={{ background: FUDGE.dark }}>
        <div className="max-w-5xl mx-auto">
          <Overline>Reflections</Overline>
          <h2 data-reveal className="apple-reveal text-3xl md:text-5xl font-bold text-[#f5f5f7] mb-12">
            What building Fudge taught me.
          </h2>

          <div className="space-y-8 max-w-3xl mb-16">
            {[
              {
                title: 'AI pair programming is a skill, not a shortcut.',
                body: 'Directing Claude effectively required clear communication, strong technical literacy, and the judgment to know when something was right. Every bug needed me to describe the symptom accurately. Every design decision needed me to think about 16 different users.',
              },
              {
                title: 'Ship for your users, not your resume.',
                body: 'The hardest product decisions were about what to leave out. Payment tracking is admin-only. The judging schedule is separate from the main itinerary. Resources live in a hub, not scattered across tabs. Every feature was weighed against a simple question: does this reduce confusion?',
              },
              {
                title: 'PWAs are underrated.',
                body: 'Most users don\'t know progressive web apps exist. But once they install Fudge on their home screen, it feels native. No app store, no downloads, no updates to push. Just a URL, a service worker, and a manifest file.',
              },
              {
                title: 'Scope is the real enemy.',
                body: 'Feature creep almost killed the timeline twice. The breakthrough was treating the trip date as a hard deadline — if it wasn\'t essential for the trip, it didn\'t ship. Constraints breed focus.',
              },
            ].map((item, i) => (
              <div key={item.title} data-reveal className="apple-reveal" style={{ transitionDelay: `${i * 120}ms` }}>
                <h3 className="text-[17px] font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-[15px] text-[#9a9a9f] leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          {/* Skills pills */}
          <div data-reveal className="apple-reveal mb-16" style={{ transitionDelay: '200ms' }}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#9a9a9f] mb-4">Skills Demonstrated</h3>
            <div className="flex flex-wrap gap-2">
              {[
                'Full-Stack Development', 'AI-Augmented Engineering', 'Product Management',
                'UX Design', 'Database Architecture', 'Authentication Systems',
                'PWA Development', 'Image Optimization', 'Stakeholder Management',
                'DevOps & Deployment'
              ].map((skill) => (
                <span key={skill} className="px-3 py-1.5 text-[12px] rounded-full border border-white/[0.08] text-[#9a9a9f] bg-white/[0.02]">{skill}</span>
              ))}
            </div>
          </div>

          {/* Role & Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div data-reveal className="reveal-left">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#9a9a9f] mb-4">My Roles</h3>
              <ul className="space-y-2 text-[15px] text-[#f5f5f7]">
                <li>Product Manager</li>
                <li>Designer (UX + Visual)</li>
                <li>Technical Architect</li>
                <li>AI Collaborator & Director</li>
                <li>Stakeholder Manager</li>
                <li>QA & Deployment</li>
              </ul>
            </div>
            <div data-reveal className="reveal-right">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#9a9a9f] mb-4">Timeline</h3>
              <ul className="space-y-2 text-[15px] text-[#f5f5f7]">
                <li>Feb 2026 — Architecture & auth system</li>
                <li>Feb 2026 — Core pages (itinerary, rooms, travel)</li>
                <li>Mar 2026 — Admin dashboard, payment tracking</li>
                <li>Mar 2026 — Explore, resources, PWA polish</li>
                <li>Mar 2026 — Production deployment</li>
                <li>May 2026 — Trip day (the real test)</li>
              </ul>
            </div>
          </div>

          {/* Closing quote */}
          <div data-reveal className="apple-reveal text-center pt-8 border-t border-white/5" style={{ transitionDelay: '200ms' }}>
            <blockquote className="text-xl md:text-2xl text-[#f5f5f7] italic max-w-2xl mx-auto mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              "I didn't just build an app. I managed a product, led an AI-powered engineering effort, and shipped something real that 16 people will rely on."
            </blockquote>
          </div>
        </div>
      </section>

      {/* ═══════════════════ CONTACT CTA ═══════════════════ */}
      <section className="py-20 px-6 text-center border-t border-white/5 bg-black">
        <Overline>Get in Touch</Overline>
        <h2 data-reveal className="apple-reveal text-2xl md:text-3xl font-bold text-[#f5f5f7] mb-8" style={{ transitionDelay: '100ms' }}>
          Like what you see?
        </h2>
        <div data-reveal className="apple-reveal flex flex-col sm:flex-row gap-4 justify-center" style={{ transitionDelay: '200ms' }}>
          <ConnectButton
            label="Say Hello"
            source="fudge"
            className="group inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full font-semibold text-white text-sm transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: FUDGE.teal }}
          />
          <a
            href="https://fudge.sam-bloch.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full font-semibold text-sm border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-[color,border-color,transform] hover:scale-105 active:scale-95"
          >
            Visit Fudge ↗
          </a>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="pt-12 pb-32 px-6 text-center border-t border-white/5 bg-black">
        <p className="text-[12px] text-[#555] mb-4">Full-Stack PWA Development · Spring 2026</p>
        <button
          onClick={() => navigate('/projects')}
          className="text-[13px] font-medium transition-colors hover:text-white"
          style={{ color: FUDGE.teal }}
        >
          ← Back to Projects
        </button>
      </footer>
    </div>
  );
};

export default FudgeCaseStudy;
