import React, { useState, useEffect, useRef } from 'react';
import { useFooterAwareBottom } from '../utils/useFooterAwareBottom';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, X } from 'lucide-react';
import {useScrollReveal, CountUp, AtAGlance } from './CaseStudyShared';

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
      style={{ width: '0%', background: 'linear-gradient(90deg, #24A2A7, #7DD3D7)' }}
    />
  );
};

/* ─── Overline label (blueprint style) ─── */
const Overline: React.FC<{ children: React.ReactNode; tag?: string }> = ({ children, tag }) => (
  <p data-reveal className="blueprint-reveal text-[13px] font-semibold uppercase tracking-[0.2em] text-[#24A2A7] mb-6 font-mono">
    {tag && <span className="text-[#24A2A7]/70 mr-2">[{tag}]</span>}{children}
  </p>
);

/* ─── Image with lightbox ─── */
const Img: React.FC<{
  src: string;
  alt: string;
  caption?: string;
  onOpen: (img: { src: string; alt: string }) => void;
  className?: string;
  loading?: 'lazy' | 'eager';
}> = ({ src, alt, caption, onOpen, className = '', loading = 'lazy' }) => (
  <button
    type="button"
    onClick={() => onOpen({ src, alt })}
    className={`group block w-full text-left cursor-zoom-in ${className}`}
  >
    <div className="overflow-hidden rounded-lg border border-[#24A2A7]/20 transition-[border-color,box-shadow] duration-500 group-hover:shadow-lg group-hover:shadow-[#24A2A7]/10 group-hover:border-[#24A2A7]/40">
      <img src={src} alt={alt} className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]" loading={loading} />
    </div>
    {caption && <p className="text-[12px] text-[#9a9a9f] mt-3 tracking-wide font-mono">{caption}</p>}
  </button>
);

/* ─── Industrial parallax moment ─── */
const IndustrialMoment: React.FC<{
  src: string;
  height?: string;
  children?: React.ReactNode;
}> = ({ src, height = '60vh', children }) => (
  <div
    data-reveal
    className="blueprint-reveal relative w-full overflow-hidden"
    style={{ height }}
  >
    <div
      className="absolute inset-0 industrial-parallax"
      style={{ backgroundImage: `url(${src})` }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1c]/90 via-[#0a0f1c]/75 to-[#0a0f1c]/90" />
    {children && (
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        {children}
      </div>
    )}
  </div>
);

/* ─── Process flow (blueprint style) ─── */
const ProcessFlow: React.FC<{ steps: string[] }> = ({ steps }) => (
  <div data-reveal className="blueprint-reveal flex flex-wrap items-center justify-center gap-3 my-10">
    {steps.map((step, i) => (
      <React.Fragment key={step}>
        <div className="px-4 py-2 border border-[#24A2A7]/30 rounded font-mono text-[13px] text-[#24A2A7] bg-[#24A2A7]/5 hover:bg-[#24A2A7]/10 transition-colors">
          <span className="text-[#24A2A7]/60 mr-1">{String(i + 1).padStart(2, '0')}.</span> {step}
        </div>
        {i < steps.length - 1 && <span className="text-[#24A2A7]/50 font-mono text-lg">→</span>}
      </React.Fragment>
    ))}
  </div>
);

/* ─── Spec card (technical detail card) ─── */
const SpecCard: React.FC<{ icon: string; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div data-reveal className="blueprint-reveal p-6 rounded-lg border border-[#24A2A7]/10 bg-[#24A2A7]/[0.03] hover:border-[#24A2A7]/25 transition-[border-color,box-shadow] duration-500 hover:shadow-lg hover:shadow-[#24A2A7]/5">
    <div className="text-2xl mb-3">{icon}</div>
    <h3 className="text-[16px] font-bold text-white mb-2 font-mono">{title}</h3>
    <p className="text-[15px] text-[#9a9a9f] leading-relaxed">{desc}</p>
  </div>
);

/* ─── TiltCard (3D hover) ─── */
const TiltCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const handleMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    el.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) scale(1.02)`;
  };
  const handleLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
  };
  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`transition-transform duration-300 ease-out ${className}`}
    >
      {children}
    </div>
  );
};

/* ─── Blueprint grid particles ─── */
const BlueprintGrid: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.04]"
    style={{
      backgroundImage: `
        linear-gradient(rgba(36,162,167,0.3) 1px, transparent 1px),
        linear-gradient(90deg, rgba(36,162,167,0.3) 1px, transparent 1px)
      `,
      backgroundSize: '60px 60px',
    }}
  />
);

/* ═══════════════════════════════════════════════════════════
   SMART LOCKERS CASE STUDY
   Theme: Blueprint / Engineering — dark navy + teal
   ═══════════════════════════════════════════════════════════ */
const SmartLockersCaseStudy: React.FC = () => {
  const navigate = useNavigate();
  const fabBottom = useFooterAwareBottom();
  const wrapRef = useScrollReveal();
  const heroRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  /* ─ Hero parallax ─ */
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (heroRef.current) {
            heroRef.current.style.transform = `scale(${1 + y * 0.0003}) translateY(${y * 0.15}px)`;
            heroRef.current.style.opacity = `${Math.max(1 - y / 800, 0)}`;
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
    const html = generateCaseStudyPdfHtml('smart-lockers', window.location.origin);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank', 'width=900,height=700');
    if (win) { win.onload = () => URL.revokeObjectURL(url); } else { URL.revokeObjectURL(url); }
  };

  const openLightbox = (img: { src: string; alt: string }) => setLightbox(img);

  return (
    <div ref={wrapRef} className="min-h-screen bg-[#0a0f1c] text-white selection:bg-[#24A2A7]/30 font-sans relative">
      <style>{`
        /* ─ Blueprint reveal animation ─ */
        .blueprint-reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: opacity, transform;
        }
        .revealed .blueprint-reveal,
        .blueprint-reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .highlight-reveal {
          color: #24A2A7;
          font-weight: 600;
        }
        /* ─ Industrial parallax ─ */
        .industrial-parallax {
          background-attachment: fixed;
          background-size: cover;
          background-position: center;
        }
        @media (max-width: 768px) {
          .industrial-parallax {
            background-attachment: scroll;
          }
        }
        /* ─ Blueprint glow ─ */
        .blueprint-glow {
          text-shadow: 0 0 30px rgba(36, 162, 167, 0.3), 0 0 60px rgba(36, 162, 167, 0.1);
        }
        /* ─ Teal gradient text ─ */
        .teal-gradient {
          background: linear-gradient(135deg, #24A2A7, #7DD3D7, #24A2A7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        /* ─ Grid crosshair on hero ─ */
        .crosshair-grid {
          background-image:
            linear-gradient(rgba(36,162,167,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(36,162,167,0.08) 1px, transparent 1px);
          background-size: 80px 80px;
        }
        /* ─ Reduced motion ─ */
        @media (prefers-reduced-motion: reduce) {
          .blueprint-reveal { transition: none !important; opacity: 1; transform: none; }
          .industrial-parallax { background-attachment: scroll; }
        }
      `}</style>

      <ScrollProgress />
      <BlueprintGrid />

      {/* ─── Lightbox ─── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition z-10">
            <X className="w-5 h-5" />
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* ─── Back button ─── */}
      <button
        onClick={() => navigate('/projects')}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white/70 bg-[#0a0f1c]/80 backdrop-blur-md border border-[#24A2A7]/10 rounded-full hover:text-[#24A2A7] hover:border-[#24A2A7]/30 transition-[color,border-color]"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Archive
      </button>

      {/* ─── PDF Download FAB ─── */}
      <div className="fixed right-6 z-[70] no-print" style={{ bottom: fabBottom }}>
        <button
          onClick={handleDownloadPDF}
          className="h-14 px-5 rounded-full bg-[#24A2A7] text-[#0a0f1c] flex items-center justify-center gap-2 shadow-2xl shadow-[#24A2A7]/20 hover:scale-105 active:scale-95 transition-transform"
          aria-label="Download case study PDF"
        >
          <Download className="w-6 h-6" />
          <span className="text-xs font-black uppercase tracking-widest">PDF</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════════ */}
      <section className="relative h-screen overflow-hidden crosshair-grid">
        {/* Background — server/tech Unsplash image */}
        <div
          ref={heroRef}
          className="absolute inset-0 will-change-transform"
        >
          <img
            src="/case-study/smart-lockers/tech-1.webp"
            alt="Server room"
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-[#0a0f1c]/75" />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(10,15,28,0.88) 0%, rgba(10,15,28,0.55) 70%, rgba(10,15,28,0.35) 100%)' }} />
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <p data-reveal className="blueprint-reveal text-[13px] font-mono uppercase tracking-[0.25em] text-[#24A2A7] mb-6">
            Systems Engineering · Quicken Loans · 2019
          </p>
          <h1 data-reveal className="blueprint-reveal text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.4)' }}>
            <span className="text-white">Smart</span>{' '}
            <span className="teal-gradient">Lockers</span>
          </h1>
          <p data-reveal className="blueprint-reveal text-lg md:text-xl text-[#c5c5ca] max-w-2xl leading-relaxed font-light" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.7)' }}>
            A self-service tech distribution system—web portal, Raspberry Pi prototype, and 3D-printed hardware—built by two interns and presented to the SVP.
          </p>
        </div>

        {/* Bottom vignette line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#24A2A7]/30 to-transparent" />
      </section>


      <AtAGlance className="-mt-44 md:-mt-64" items={[
        { label: "What", value: "A self-service smart-locker system for device distribution at Quicken Loans" },
        { label: "My role", value: "Intern — web portal, API, and the Raspberry Pi kiosk" },
        { label: "Outcome", value: "Prototype and pitch reached the SVP of Infrastructure" },
        { label: "Stack", value: "PHP · SQL · Python · Raspberry Pi · 3D printing" }
      ]} />

      {/* ══════════════════════════════════════════════════
          THE STORY
          ══════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-32">
        <Overline tag="BRIEF">The Story</Overline>
        <div data-reveal className="blueprint-reveal">
          <p className="text-xl md:text-2xl lg:text-[1.75rem] text-[#e5e5e7] leading-[1.7] font-light">
            It was my second summer as an IT intern at Quicken Loans. I wanted to do more than keep tickets moving—I wanted to <span data-reveal className="highlight-reveal">build something that didn't exist yet</span>.
          </p>
        </div>
        <div data-reveal className="blueprint-reveal mt-10">
          <p className="text-xl md:text-2xl lg:text-[1.75rem] text-[#9a9a9f] leading-[1.7] font-light">
            My fellow intern Matthew Brown and I saw the same problem every day: people needed a loaner laptop, a mouse, a headset—and the process was slow, manual, and required chasing down IT. We set out to automate the entire workflow with a self-serve smart locker system, from the web portal to the physical hardware.
          </p>
        </div>
      </section>

      {/* ─── Industrial moment 1 ─── */}
      <IndustrialMoment src="/case-study/smart-lockers/tech-2.webp">
        <p className="text-2xl md:text-4xl font-bold text-white mb-4 font-mono" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.4)' }}>
          "Why wait for IT <em className="not-italic text-[#24A2A7]">when you can serve yourself?</em>"
        </p>
      </IndustrialMoment>

      {/* ══════════════════════════════════════════════════
          IMPACT NUMBERS
          ══════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-28">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { end: 2, suffix: '', label: 'Interns', sub: 'Sam & Matthew' },
            { end: 1, suffix: '', label: 'Working Prototype', sub: 'Raspberry Pi + 3D print' },
            { end: 4, suffix: '', label: 'Device Types', sub: 'laptops, mice, keyboards, headsets' },
            { end: 1, suffix: '', label: 'SVP Presentation', sub: 'Infrastructure & Operations' },
          ].map((s, i) => (
            <div key={i} data-reveal className="blueprint-reveal" style={{ transitionDelay: `${i * 120}ms` }}>
              <p className="text-4xl md:text-5xl font-bold text-[#24A2A7] font-mono">
                <CountUp end={s.end} suffix={s.suffix} />
              </p>
              <p className="text-[14px] font-semibold text-white mt-2">{s.label}</p>
              <p className="text-[12px] text-[#9a9a9f] mt-1 font-mono">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Process flow ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
        <div className="text-center mb-2">
          <Overline tag="FLOW">Process</Overline>
        </div>
        <ProcessFlow steps={['Problem ID', 'Web Portal (PHP/SQL)', 'API + Server', 'Raspberry Pi Build', 'Hack Week Demo']} />
      </section>

      {/* ══════════════════════════════════════════════════
          CONTEXT SECTION
          ══════════════════════════════════════════════════ */}
      <section className="relative z-10 py-28 border-t border-[#24A2A7]/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-16">
            <div>
              <Overline tag="SPEC">Context</Overline>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-6 leading-tight">
                Manual device distribution. <span className="text-[#9a9a9f]">An intern's chance to fix it.</span>
              </h2>
              <div className="space-y-5 text-[17px] text-[#9a9a9f] leading-[1.8]">
                <p>
                  At Quicken Loans, if your laptop broke or you needed a loaner mouse, you'd submit a ticket and wait. Sometimes hours, sometimes a full day. For a company moving at startup speed, that friction added up fast.
                </p>
                <p>
                  Matthew and I saw the opportunity: a <span data-reveal className="highlight-reveal">self-service kiosk</span> where employees request tech through a web app, get a unique PIN tied to their company RFID badge, walk up to a locker, scan their badge, type the PIN, and walk away with exactly what they need—no tickets, no waiting.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.15em] text-[#24A2A7] mb-1 font-mono">[TYPE]</p>
                <p className="text-[15px] text-[#9a9a9f]">Internship — Process Automation</p>
              </div>
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.15em] text-[#24A2A7] mb-1 font-mono">[ORG]</p>
                <p className="text-[15px] text-[#9a9a9f]">Quicken Loans (now Rocket Mortgage)</p>
              </div>
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.15em] text-[#24A2A7] mb-1 font-mono">[TOOLS]</p>
                <p className="text-[15px] text-[#9a9a9f]">PHP, SQL, Python, HTML/CSS, Bootstrap, Raspberry Pi, Raspian, 3D Printing</p>
              </div>
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.15em] text-[#24A2A7] mb-1 font-mono">[YEAR]</p>
                <p className="text-[15px] text-[#9a9a9f]">Summer 2019</p>
              </div>
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.15em] text-[#24A2A7] mb-1 font-mono">[TEAM]</p>
                <p className="text-[15px] text-[#9a9a9f]">Sam Bloch & Matthew Brown</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          THE CHALLENGE
          ══════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-28">
        <div data-reveal className="blueprint-reveal mb-10">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 font-mono">
            The problem. <span className="text-[#9a9a9f]">Every IT department has it.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: '⏳', title: 'Slow manual distribution', desc: 'Requesting a loaner device meant submitting a ticket, waiting for assignment, then physically tracking down the right person. Hours wasted.' },
            { icon: '🔐', title: 'No accountability chain', desc: 'Once a device left the shelf, there was no automated way to track who had it, for how long, or whether it came back.' },
            { icon: '📋', title: 'IT bottleneck', desc: 'Every request required human intervention—even for simple peripherals like a mouse or headset. IT staff were overloaded with repetitive tasks.' },
            { icon: '🏢', title: 'Scale problem', desc: 'Quicken Loans was growing fast. The manual process that worked for 500 people wouldn\'t work for 5,000.' },
          ].map((card, i) => (
            <TiltCard key={i}>
              <SpecCard icon={card.icon} title={card.title} desc={card.desc} />
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ─── Industrial moment 2 ─── */}
      <IndustrialMoment src="/case-study/smart-lockers/locker-1.webp">
        <p className="text-xl md:text-2xl font-mono text-white" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.4)' }}>
          <span className="text-[#24A2A7]">[BUILD LOG]</span> From concept to working prototype in one summer.
        </p>
      </IndustrialMoment>

      {/* ══════════════════════════════════════════════════
          THE WEB PORTAL
          ══════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <Overline tag="BUILD">The Web Portal</Overline>
            <h2 data-reveal className="blueprint-reveal text-3xl md:text-4xl font-bold tracking-tight text-white mb-6">
              Request tech. Get a PIN. <span className="text-[#9a9a9f]">Walk up and go.</span>
            </h2>
            <div data-reveal className="blueprint-reveal space-y-5 text-[17px] text-[#9a9a9f] leading-[1.8]">
              <p>
                I built the front-facing web application using PHP and SQL to power an interactive database, with HTML, CSS, JavaScript, and Bootstrap for the UI. Employees could browse available devices by category—laptops, mice, keyboards, headsets—and submit a request in seconds.
              </p>
              <p>
                Upon submission, the system generated a <span data-reveal className="highlight-reveal">unique 4-digit PIN</span> tied to the user's company RFID badge. The confirmation screen told them exactly which floor, which locker side, and which locker number to visit.
              </p>
            </div>
          </div>
          <div>
            <Img
              src="/case-study/smart-lockers/welcome-hero.avif"
              alt="Desktop Locker Portal — welcome screen on iPad"
              caption="[01] Welcome screen — 'Seems Like You Need Tech!'"
              onOpen={openLightbox}
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* ── Portal screens gallery ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Img
            src="/case-study/smart-lockers/laptops-page.avif"
            alt="Loaner Laptops page"
            caption="[02] Loaner Laptops — browse & learn"
            onOpen={openLightbox}
          />
          <Img
            src="/case-study/smart-lockers/request-form.avif"
            alt="Make Your Request form"
            caption="[03] Request form — select device & quantity"
            onOpen={openLightbox}
          />
          <Img
            src="/case-study/smart-lockers/confirmation.avif"
            alt="Confirmation screen with locker assignment"
            caption="[04] Confirmation — floor, locker, & PIN code"
            onOpen={openLightbox}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          INTERACTIVE SYSTEM DIAGRAM
          ══════════════════════════════════════════════════ */}
      <section className="relative z-10 py-28 border-t border-[#24A2A7]/10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <Overline tag="ARCH">Interactive System Diagram</Overline>
            <h2 data-reveal className="blueprint-reveal text-3xl md:text-5xl font-bold tracking-tight text-white">
              Three layers. <span className="text-[#9a9a9f]">One seamless flow.</span>
            </h2>
          </div>

          <div data-reveal className="blueprint-reveal">
            <div className="rounded-xl overflow-hidden border border-[#24A2A7]/20">
              <iframe
                src="/games/smart-locker-diagram.html"
                title="Smart Locker System — Interactive Architecture Diagram"
                className="w-full border-0"
                style={{ minHeight: '680px' }}
                loading="lazy"
              />
            </div>
            <p className="text-[12px] text-[#9a9a9f] mt-4 text-center font-mono">[INTERACTIVE] Click components to inspect · Run simulation to trace the full request flow</p>
          </div>
        </div>
      </section>

      {/* ─── Industrial moment 3 ─── */}
      <IndustrialMoment src="/case-study/smart-lockers/locker-2.webp" height="50vh">
        <p className="text-xl md:text-2xl font-mono text-white" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.4)' }}>
          <span className="text-[#24A2A7]">[DEPLOY]</span> From proof-of-concept to physical prototype.
        </p>
      </IndustrialMoment>

      {/* ══════════════════════════════════════════════════
          THE HARDWARE
          ══════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div data-reveal className="blueprint-reveal">
              <img
                src="/case-study/smart-lockers/hackweek.avif"
                alt="Hack Week presentation of the Smart Locker prototype"
                className="w-full h-auto rounded-lg"
                loading="lazy"
              />
              <p className="text-[12px] text-[#9a9a9f] mt-3 tracking-wide font-mono">[05] Hack Week — presenting to the tech department</p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <Overline tag="HW">The Hardware</Overline>
            <h2 data-reveal className="blueprint-reveal text-3xl md:text-4xl font-bold tracking-tight text-white mb-6">
              Beyond proof-of-concept. <span className="text-[#9a9a9f]">A real, working prototype.</span>
            </h2>
            <div data-reveal className="blueprint-reveal space-y-5 text-[17px] text-[#9a9a9f] leading-[1.8]">
              <p>
                Matthew had built the Python application controlling the locker logic. To go beyond a laptop demo, I helped transfer the entire script onto a Raspberry Pi running Raspian, connected to a touchscreen display and an RFID badge scanner.
              </p>
              <p>
                Then we went further: I <span data-reveal className="highlight-reveal">3D-printed a custom enclosure</span> for the Raspberry Pi and scanner, turning a tangle of wires and boards into something that looked—and felt—like a real product. It was a kiosk you could actually walk up to and use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          VIDEO DEMO
          ══════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-28 border-t border-[#24A2A7]/10">
        <div className="text-center mb-12">
          <Overline tag="DEMO">Video Walkthrough</Overline>
          <h2 data-reveal className="blueprint-reveal text-3xl md:text-4xl font-bold tracking-tight text-white">
            See it in action.
          </h2>
        </div>
        <div data-reveal className="blueprint-reveal">
          <div className="rounded-xl overflow-hidden border border-[#24A2A7]/20 shadow-2xl shadow-[#24A2A7]/5">
            <iframe
              src="https://www.youtube.com/embed/ZFeLGKmZ5Ks"
              title="Smart Lockers Demo Video"
              className="w-full border-0"
              style={{ aspectRatio: '16 / 9' }}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="text-[12px] text-[#9a9a9f] mt-4 text-center font-mono">[VIDEO] Full prototype walkthrough — web portal to physical kiosk</p>
        </div>
      </section>

      {/* ─── Industrial moment 4 ─── */}
      <IndustrialMoment src="/case-study/smart-lockers/office-1.webp" height="50vh">
        <p className="text-2xl md:text-4xl font-bold text-white mb-4" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.4)' }}>
          "Two interns. One summer. <em className="not-italic text-[#24A2A7]">An SVP meeting.</em>"
        </p>
      </IndustrialMoment>

      {/* ══════════════════════════════════════════════════
          THE PRESENTATION
          ══════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-28">
        <Overline tag="SHIP">The Presentation</Overline>
        <div data-reveal className="blueprint-reveal">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-8">
            From hack week to the C-suite.
          </h2>
          <div className="space-y-5 text-[17px] text-[#9a9a9f] leading-[1.8]">
            <p>
              We presented the smart locker system to Quicken Loans' entire technology department during Hack Week—a company-wide event where teams demo passion projects and experimental builds.
            </p>
            <p>
              The reception was strong enough that we <span data-reveal className="highlight-reveal">landed a meeting with the Senior Vice President of Infrastructure and Operations</span> to present our work. For two summer interns, getting 30 minutes with the SVP to pitch a project we'd built from scratch was the validation that this wasn't just a cool demo—it was a real solution to a real problem.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          KEY DECISIONS
          ══════════════════════════════════════════════════ */}
      <section className="relative z-10 py-28 border-t border-[#24A2A7]/10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <Overline tag="LOG">Key Decisions</Overline>
          </div>

          {[
            { num: '01', title: 'PHP + SQL for the web portal', desc: 'PHP gave us rapid server-side rendering and SQL provided the relational database we needed to track devices, users, PINs, and locker assignments in real time.' },
            { num: '02', title: 'RFID + PIN dual authentication', desc: 'A badge scan alone isn\'t secure enough. Adding a unique PIN per request meant even if someone found a badge, they couldn\'t access the locker without the matching code.' },
            { num: '03', title: 'Raspberry Pi over a full PC', desc: 'Cost, size, and GPIO access. The Pi could run the Python script, drive a touchscreen, and interface with the badge scanner—all for under $50 in hardware.' },
            { num: '04', title: '3D-printed enclosure', desc: 'We wanted the prototype to feel real, not look like a science fair project. A custom 3D-printed case turned a bare circuit board into a credible kiosk.' },
            { num: '05', title: 'Hack Week as a launch pad', desc: 'We timed our build to align with Hack Week, giving us a built-in audience of the entire tech department—and a path to leadership visibility.' },
          ].map((item) => (
            <div key={item.num} data-reveal className="blueprint-reveal flex gap-6 mb-10 last:mb-0">
              <div className="shrink-0 w-12 h-12 rounded-lg border border-[#24A2A7]/20 bg-[#24A2A7]/5 flex items-center justify-center text-[#24A2A7] font-mono text-sm font-bold">
                {item.num}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-[17px] text-[#9a9a9f] leading-[1.8]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Industrial moment 5 ─── */}
      <IndustrialMoment src="/case-study/smart-lockers/tech-3.webp" height="50vh">
        <p className="text-xl md:text-2xl font-mono text-white" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.4)' }}>
          <span className="text-[#24A2A7]">[REFLECT]</span> What building real hardware taught me about building software.
        </p>
      </IndustrialMoment>

      {/* ══════════════════════════════════════════════════
          WHAT I LEARNED
          ══════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-28">
        <div className="text-center mb-16">
          <Overline tag="POST">What I Learned</Overline>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: 'Hardware forces you to think differently.',
              body: 'Software bugs are fixable with a deploy. Hardware bugs mean re-soldering, reprinting, or rewiring. Building a physical prototype taught me to plan more carefully and test earlier.',
            },
            {
              title: 'Complementary skills multiply output.',
              body: 'Matthew was strong in Python; I was strong in web development. Rather than both doing everything, we divided clearly and taught each other along the way. The project was better for it.',
            },
            {
              title: 'A demo is worth a thousand decks.',
              body: 'We could have pitched the concept with slides. Instead, we built a working prototype that people could touch. That\'s what got us from Hack Week to the SVP\'s office.',
            },
            {
              title: 'Intern projects can have real impact.',
              body: 'We weren\'t asked to build this. We identified the problem, proposed the solution, and built it ourselves. The best internship work comes from initiative, not assignment.',
            },
          ].map((item, i) => (
            <TiltCard key={i}>
              <div data-reveal className="blueprint-reveal h-full p-8 rounded-xl border border-[#24A2A7]/10 bg-[#24A2A7]/[0.02] hover:border-[#24A2A7]/25 transition-[border-color,box-shadow] duration-500">
                <h3 className="text-[17px] font-bold text-white mb-3">{item.title}</h3>
                <p className="text-[15px] text-[#9a9a9f] leading-[1.7]">{item.body}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          MY ROLE & TIMELINE
          ══════════════════════════════════════════════════ */}
      <section className="relative z-10 py-28 border-t border-[#24A2A7]/10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <Overline tag="ROLE">My Role</Overline>
              <div data-reveal className="blueprint-reveal space-y-6">
                <div>
                  <p className="text-[14px] font-semibold text-[#24A2A7] mb-1 font-mono">Team</p>
                  <p className="text-[17px] text-[#9a9a9f] leading-[1.8]">Sam Bloch & Matthew Brown — IT Interns, Quicken Loans</p>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#24A2A7] mb-3 font-mono">Sam's Contributions</p>
                  <div className="space-y-3">
                    {[
                      'Built the entire web application — PHP, SQL database, HTML/CSS/JS front-end with Bootstrap',
                      'Designed the user flow: browse → request → PIN generation → locker assignment',
                      'Helped transfer the Python script onto Raspberry Pi with touchscreen and badge scanner',
                      '3D-modeled and printed the custom enclosure for the kiosk hardware',
                      'Co-presented at Hack Week and to the SVP of Infrastructure & Operations',
                    ].map((item, i) => (
                      <p key={i} className="text-[17px] text-[#9a9a9f] leading-[1.8] flex gap-3">
                        <span className="text-[#24A2A7] shrink-0 font-mono">→</span> {item}
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#24A2A7] mb-3 font-mono">Matthew's Contributions</p>
                  <div className="space-y-3">
                    {[
                      'Developed the Python application controlling locker logic and device inventory',
                      'Built the REST API connecting the web portal to the physical hardware',
                      'Taught Sam Python fundamentals throughout the project',
                    ].map((item, i) => (
                      <p key={i} className="text-[17px] text-[#9a9a9f] leading-[1.8] flex gap-3">
                        <span className="text-[#24A2A7]/70 shrink-0 font-mono">→</span> {item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Overline tag="TIME">Timeline</Overline>
              <div data-reveal className="blueprint-reveal space-y-0">
                {[
                  { date: 'Early Summer', event: 'Identified the problem. Pitched the concept to our manager. Got the green light to build.' },
                  { date: 'Weeks 1–3', event: 'Built the web portal (PHP/SQL) and API (Python). Parallel development with daily syncs.' },
                  { date: 'Weeks 4–5', event: 'Connected the web app to the API. Built the Raspberry Pi kiosk with touchscreen and badge scanner.' },
                  { date: 'Week 6', event: '3D-printed the custom enclosure. Integrated all components into a working prototype.' },
                  { date: 'Hack Week', event: 'Presented to the entire technology department. Landed an SVP meeting to showcase the system.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 pb-8 last:pb-0 relative">
                    {i < 4 && <div className="absolute left-[7px] top-[20px] w-px h-full bg-[#24A2A7]/25" />}
                    <div className="shrink-0 w-[15px] h-[15px] mt-1 rounded-full border-2 border-[#24A2A7]/40 bg-[#0a0f1c] relative z-10" />
                    <div>
                      <p className="text-[13px] font-mono text-[#24A2A7] mb-1">{item.date}</p>
                      <p className="text-[17px] text-[#9a9a9f] leading-[1.8]">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════════ */}
      <footer className="relative z-10 text-center pt-20 pb-32 border-t border-[#24A2A7]/10">
        <p className="text-[13px] text-[#9a9a9f] tracking-wide font-mono">
          Systems Engineering &middot; Quicken Loans &middot; 2019
        </p>
      </footer>
    </div>
  );
};

export default SmartLockersCaseStudy;
