import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, X } from 'lucide-react';
import { COLORS } from '../constants';

/* ─── Scroll reveal with staggered delays ─── */
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

/* ─── Overline label ─── */
const Overline: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p data-reveal className="apple-reveal text-[13px] font-semibold uppercase tracking-[0.2em] text-[#24A2A7] mb-6">
    {children}
  </p>
);

/* ─── Image w/ lightbox ─── */
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
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] glow-border transition-all duration-700 group-hover:border-white/[0.12] group-hover:shadow-2xl group-hover:shadow-[#24A2A7]/5">
      <img src={src} alt={alt} className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]" loading="lazy" />
    </div>
    {caption && <p className="text-[12px] text-[#9a9a9f] mt-3 tracking-wide">{caption}</p>}
  </button>
);

/* ─── Full-bleed nature image section (parallax) ─── */
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

/* ─── Process step connector ─── */
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

/* ─── Sticky scroll progress bar ─── */
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

/* ─── Horizontal scroll showcase ─── */
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


/* ════════════════════════════════════════════════════════════════════════════
   ZooReportCaseStudy — Immersive "Design B" matching CalNat pattern
   ════════════════════════════════════════════════════════════════════════════ */

const ZooReportCaseStudy: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useScrollReveal();
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);

  /* Hero parallax — scale-on-scroll */
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
    const html = generateCaseStudyPdfHtml('zoo-report', window.location.origin);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank', 'width=900,height=700');
    if (win) {
      win.onload = () => URL.revokeObjectURL(url);
    } else {
      URL.revokeObjectURL(url);
    }
  };

  const openImg = (img: { src: string; alt: string }) => setLightbox(img);

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white selection:bg-[#24A2A7]/30 font-sans overflow-x-clip">

      {/* Sticky scroll progress bar */}
      <ScrollProgress />

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-300" onClick={() => setLightbox(null)} role="dialog" aria-label="Enlarged image">
          <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all z-[101]" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
          <img src={lightbox.src} alt={lightbox.alt} className="max-w-full max-h-[85vh] rounded-2xl object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* Back */}
      <button onClick={() => navigate('/projects')} className="fixed top-8 left-8 md:left-12 z-[60] flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-all bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/5 hover:border-[#24A2A7]/40 shadow-xl active:scale-95 no-print" aria-label="Back to projects">
        <ArrowLeft className="w-4 h-4" />
        Back to Archive
      </button>

      {/* Floating PDF Download */}
      <div className="fixed bottom-28 md:bottom-24 right-6 z-[70] no-print">
        <button
          onClick={handleDownloadPDF}
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-90 group"
          style={{ backgroundColor: COLORS.teal, color: COLORS.charcoal }}
          title="Download Case Study PDF"
        >
          <Download className="w-8 h-8" />
        </button>
      </div>

      {/* ════════════════════════════════════════
          HERO (scale-on-scroll + floating particles)
         ════════════════════════════════════════ */}
      <header className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <img
          ref={heroImgRef}
          src="https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=1920&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover transition-none will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black pointer-events-none" />

        <FloatingParticles count={6} />

        <div ref={heroTextRef} className="relative z-10 transition-opacity duration-100">
          <p className="text-[13px] font-semibold uppercase tracking-[0.3em] text-[#24A2A7] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Interaction Design &middot; University of Michigan &middot; 2020
          </p>
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-bold leading-[0.9] tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5), 0 4px 40px rgba(0,0,0,0.3)' }}>
            <span className="block text-white">Detroit Zoo</span>
            <span className="block bg-gradient-to-r from-[#24A2A7] via-[#2BB8BD] to-[#7DD3D7] bg-clip-text text-transparent" style={{ textShadow: 'none', filter: 'drop-shadow(0 2px 12px rgba(36,162,167,0.3))' }}>
              AR Explorer
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
            A mobile experience designed during COVID-19 to connect people with zoo animals—whether at the zoo or from home.
          </p>
        </div>

        <div className="absolute bottom-12 animate-in fade-in duration-1000 delay-1000">
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-[#24A2A7]/40 to-transparent mx-auto" />
        </div>
      </header>

      {/* ════════════════════════════════════════
          IMPACT NUMBERS
         ════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 bg-[#0a0a0a]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#24A2A7]/[0.03] blur-[120px] pointer-events-none" />
        <FloatingParticles count={4} />

        <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
          <div data-reveal className="apple-reveal mb-14 text-center">
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#24A2A7] mb-4">Project scope</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              From concept to clickable prototype.
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {[
              { end: 5, suffix: '', label: 'Nav Sections', sub: 'Explore, Info, Donate, Scrapbook, Prizes' },
              { end: 4, suffix: '', label: 'Team Members', sub: 'University of Michigan' },
              { end: 2, suffix: '', label: 'Game Modes', sub: 'at-zoo & from-home' },
              { end: 3, suffix: '', label: 'Prototype Rounds', sub: 'paper → wireframe → polished' },
            ].map((s, i) => (
              <div key={s.label} data-reveal className="apple-reveal text-center" style={{ transitionDelay: `${i * 120}ms` }}>
                <p className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent mb-2 whitespace-nowrap overflow-visible">
                  <CountUp end={s.end} suffix={s.suffix} />
                </p>
                <p className="text-sm font-semibold text-white/90 mb-1">{s.label}</p>
                <p className="text-[12px] text-[#9a9a9f]">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Nature moment: Elephants in the wild ── */}
      <NatureMoment
        src="https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1920&q=80"
        alt="African elephant walking across the savanna at golden hour"
      />

      {/* ════════════════════════════════════════
          THE STORY (exec summary with highlight reveals)
         ════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <div data-reveal className="apple-reveal">
            <p className="text-xl md:text-2xl lg:text-[1.75rem] text-[#f5f5f7] leading-[1.7] font-light">
              The pandemic had changed everything about how people connect with animals. Zoo visits plummeted, pet ownership surged, and the Detroit Zoo needed a way to <span data-reveal className="highlight-reveal">break the physical barrier</span> between visitors and the animals they love—whether at the zoo or stuck at home.
            </p>
          </div>
          <div data-reveal className="apple-reveal mt-10">
            <p className="text-xl md:text-2xl lg:text-[1.75rem] text-[#9a9a9f] leading-[1.7] font-light">
              As a team of four at the University of Michigan, we designed a mobile experience that goes beyond a static map—incorporating a photo scrapbook game with real prizes, live animal cams, a "Message Zookeeper" feature, and donation tools. From paper prototypes to a polished Adobe XD prototype, every screen was <span data-reveal className="highlight-reveal">tested and iterated with real users</span>.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          DESIGN PROCESS
         ════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-[#0a0a0a] px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div data-reveal className="apple-reveal text-center mb-12">
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#24A2A7] mb-4">Process</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Research → Prototype → Test → Refine.</h2>
          </div>
          <div data-reveal className="apple-reveal">
            <ProcessFlow steps={['Interviews & Personas', 'Sketches & Paper Prototype', 'Adobe XD Wireframe', 'Usability Testing', 'Final Prototype']} />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CONTEXT & OPPORTUNITY
         ════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <Overline>Context</Overline>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7">
              <div data-reveal className="apple-reveal">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-6 leading-tight">
                  A pandemic changed everything. <span className="text-[#9a9a9f]">The zoo needed to adapt.</span>
                </h2>
                <div className="space-y-5 text-[17px] text-[#9a9a9f] leading-[1.8]">
                  <p>
                    COVID-19 drastically reduced zoo visits while pet ownership surged. People still craved connection with animals—they just couldn't always get there in person. The Detroit Zoo needed a mobile experience that <span data-reveal className="highlight-reveal">broke the physical barrier</span> between visitors and the animals they love.
                  </p>
                  <p>
                    Our team of four set out to design an app that works both at the zoo and from home—turning casual visits into adventures with a scrapbook photo game, live animal cams, and an easy path to donate during a time when the zoo needed support most.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div data-reveal className="apple-reveal" style={{ transitionDelay: '150ms' }}>
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8">
                  <Img src="/case-study/detroit-zoo-logo.webp" alt="Detroit Zoo Logo" caption="Detroit Zoo — Royal Oak, Michigan" onOpen={openImg} />
                  <div className="mt-6 pt-6 border-t border-white/[0.06] space-y-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#24A2A7] mb-1">Type</p>
                      <p className="text-[14px] text-[#9a9a9f]">Interaction Design — Class Consulting Project</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#24A2A7] mb-1">Client</p>
                      <p className="text-[14px] text-[#9a9a9f]">Detroit Zoological Society</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#24A2A7] mb-1">Tools</p>
                      <p className="text-[14px] text-[#9a9a9f]">Adobe XD, Paper, Pen, Post-Its</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Nature moment: Underwater world ── */}
      <NatureMoment
        src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920&q=80"
        alt="Ethereal underwater scene with light filtering through the ocean"
      />

      {/* ════════════════════════════════════════
          THE CHALLENGE
         ════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <Overline>The Challenge</Overline>

          <div data-reveal className="apple-reveal mb-10">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Four problems. <span className="text-[#9a9a9f]">One app to solve them.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '🦠', title: 'Pandemic killed foot traffic', desc: 'COVID drastically reduced zoo visits. People still wanted to connect with animals, but couldn\'t always get there in person.' },
              { icon: '🗺️', title: 'Navigation is guesswork', desc: 'Once at the zoo, visitors rely on printed maps and sparse signage. They miss exhibits they came to see.' },
              { icon: '📱', title: 'No reason to stay engaged', desc: 'There\'s nothing interactive to capture visitors\' attention—no games, no incentives to explore more, no digital layer on the experience.' },
              { icon: '💚', title: 'No easy path to donate', desc: 'During a pandemic, the zoo needed support more than ever, but there was no frictionless way for visitors to contribute.' },
            ].map((card, i) => (
              <TiltCard key={card.title}>
                <div data-reveal className="apple-reveal rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 h-full" style={{ transitionDelay: `${i * 100}ms` }}>
                  <span className="text-3xl mb-4 block">{card.icon}</span>
                  <h3 className="text-lg font-bold text-white mb-3">{card.title}</h3>
                  <p className="text-[15px] text-[#9a9a9f] leading-relaxed">{card.desc}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          PAPER PROTOTYPING + VIDEO
         ════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#0a0a0a] px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <Overline>Paper Prototype</Overline>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div data-reveal className="apple-reveal">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-6 leading-tight">
                  Sketched first. <span className="text-[#9a9a9f]">Tested fast.</span>
                </h2>
                <div className="space-y-5 text-[17px] text-[#9a9a9f] leading-[1.8]">
                  <p>
                    Before opening Adobe XD, we drew every screen by hand on paper. Navigation tabs, animal profile cards, the scrapbook game, the donation flow—all rough, all functional. Then we recruited test participants and walked them through real tasks.
                  </p>
                  <p>
                    The paper prototype caught problems we never anticipated: our game originally only worked from home, but <span data-reveal className="highlight-reveal">users wanted at-zoo enhancements too</span>—which led us to design two distinct game modes. The physical touchpoint concept also emerged from these early tests.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div data-reveal className="apple-reveal" style={{ transitionDelay: '200ms' }}>
                <div className="rounded-2xl overflow-hidden border border-white/[0.06] glow-border aspect-video bg-black/40">
                  <iframe
                    title="Paper Prototype Demo — Augmented Reality Detroit Zoo App"
                    src="https://www.youtube.com/embed/Q-XG6lF5fgk"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <p className="text-[12px] text-[#9a9a9f] mt-3 tracking-wide">Paper prototype walkthrough — testing core flows with real users</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Nature moment: Tropical wildlife ── */}
      <NatureMoment
        src="https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=1920&q=80"
        alt="Vibrant scarlet macaw in tropical rainforest setting"
      >
        <p className="text-2xl md:text-4xl font-bold text-white mb-4" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.6)' }}>
          "The zoo is a sanctuary for both animals <em className="not-italic text-[#7DD3D7]">and humans</em>."
        </p>
      </NatureMoment>

      {/* ════════════════════════════════════════
          APP DESIGN + MOCKUP
         ════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <Overline>Design</Overline>

          <div data-reveal className="apple-reveal mb-10">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Five sections. <span className="text-[#9a9a9f]">Two modes. One experience.</span>
            </h2>
            <p className="text-[17px] text-[#9a9a9f] leading-[1.8] max-w-3xl mt-6">
              The app is organized around five navigation sections: <strong className="text-white font-semibold">Explore</strong> (interactive map with animal icons and wayfinding), <strong className="text-white font-semibold">Info</strong> (hours, events, zoo details), <strong className="text-white font-semibold">Donate</strong> ($1–$10 quick-select donations), <strong className="text-white font-semibold">Scrapbook</strong> (a photo collection game with prizes for every 5 photos), and <strong className="text-white font-semibold">My Prizes</strong> (earned rewards redeemable in-person or online). A persistent toolbox provides quick access to Camera, Physical Waypoint, Message Zookeeper, and Search.
            </p>
          </div>

          {/* App mockup */}
          <div data-reveal className="apple-reveal" style={{ transitionDelay: '150ms' }}>
            <Img
              src="/case-study/zoo-report-mockup.webp"
              alt="Detroit Zoo AR App — Explore, Giraffe profile, and Donate screens"
              caption="Final UI — Explore map, animal profile, and donation flow"
              onOpen={openImg}
            />
          </div>

          {/* Design pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            {[
              { title: 'At-Zoo & From-Home', desc: 'The scrapbook game has two modes with different rules and prizes—in-person visits unlock better rewards, but anyone can play from home with live cams.' },
              { title: 'Gamified Exploration', desc: 'Every 5 photos collected wins a prize. Physical touchpoints at exhibits and a camera feature turn a zoo visit into an interactive adventure.' },
              { title: 'Low-Barrier Giving', desc: '$1–$10 quick-select donations with saved payments make it effortless to support animals during the pandemic—from care to "I care" in two taps.' },
            ].map((pillar, i) => (
              <TiltCard key={pillar.title}>
                <div data-reveal className="apple-reveal rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 h-full" style={{ transitionDelay: `${i * 100}ms` }}>
                  <span className="text-[48px] font-bold text-[#24A2A7]/15 leading-none block mb-4">0{i + 1}</span>
                  <h3 className="text-lg font-bold text-white mb-3">{pillar.title}</h3>
                  <p className="text-[15px] text-[#9a9a9f] leading-relaxed">{pillar.desc}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FINAL WIREFRAME + VIDEO
         ════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#0a0a0a] px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <Overline>Final Prototype</Overline>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div data-reveal className="apple-reveal">
                <div className="rounded-2xl overflow-hidden border border-white/[0.06] glow-border aspect-video bg-black/40">
                  <iframe
                    title="Final Wireframe Prototype — Augmented Reality Detroit Zoo App"
                    src="https://www.youtube.com/embed/LjizOoWZ6T8"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <p className="text-[12px] text-[#9a9a9f] mt-3 tracking-wide">Final interactive wireframe — all flows connected and tested</p>
              </div>
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2">
              <div data-reveal className="apple-reveal" style={{ transitionDelay: '150ms' }}>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-6 leading-tight">
                  Everything connected. <span className="text-[#9a9a9f]">Ready to test.</span>
                </h2>
                <div className="space-y-5 text-[17px] text-[#9a9a9f] leading-[1.8]">
                  <p>
                    The final Adobe XD prototype brought all five navigation sections together into a single interactive experience. Users could explore the map, browse animal profiles with live cams and social posts, play the scrapbook game, message a zookeeper, and complete a donation—all connected.
                  </p>
                  <p>
                    We chose Adobe XD for its real-time collaboration, cross-platform compatibility, and smooth path from low to high fidelity. Usability testing validated the structure: the two game modes felt intuitive, and the donate flow was <span data-reveal className="highlight-reveal">surprisingly frictionless</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Nature moment: Sunset silhouettes ── */}
      <NatureMoment
        src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1920&q=80"
        alt="Elephants silhouetted against a golden African sunset"
        className="h-[50vh]"
      />

      {/* ════════════════════════════════════════
          KEY DECISIONS (horizontal showcase)
         ════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div className="pt-0 pb-6 md:pb-8 px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            <Overline>Key Decisions</Overline>

            <div data-reveal className="apple-reveal mb-10">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
                What shaped the design.
              </h2>
            </div>
          </div>
        </div>

        <HorizontalShowcase>
          {[
            { num: '01', title: 'Two Game Modes', desc: 'Usability testing revealed users wanted at-zoo enhancements, not just a from-home game. We designed two scrapbook modes with different rules and better prizes for in-person visits.' },
            { num: '02', title: 'Physical Touchpoints', desc: 'Scanning physical markers near animal exhibits became a core game mechanic—turning a walk through the zoo into an interactive scavenger hunt.' },
            { num: '03', title: 'Message Zookeeper', desc: 'Users cared deeply about animal well-being. We elevated "Ask a Zookeeper" to the persistent toolbox, making expert access always one tap away.' },
            { num: '04', title: 'Low-Threshold Donations', desc: '$1–$10 shortcuts with saved payments. During a pandemic, making it effortless to give meant the zoo could reach a wider audience.' },
            { num: '05', title: 'Built on the Existing App', desc: 'Rather than starting from scratch, we modeled our design on the existing Detroit Zoo app to reduce user learning curve and increase adoption.' },
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
      </section>

      {/* ════════════════════════════════════════
          WHAT I LEARNED
         ════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#0a0a0a] px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <Overline>What I learned</Overline>

          <div className="space-y-14">
            {[
              {
                title: 'Usability testing reshapes entire features.',
                body: 'Our scrapbook game started as from-home only. Testing revealed users were excited about at-zoo enhancements too—so we designed two game modes. A single round of testing fundamentally changed the product.',
              },
              {
                title: 'Users surface what you can\'t see.',
                body: 'We didn\'t anticipate how much users cared about animal well-being. Their feedback led us to elevate "Message Zookeeper" from a buried feature to a persistent toolbox item, always visible and one tap away.',
              },
              {
                title: 'Pandemic constraints shape design constraints.',
                body: 'We couldn\'t test with children—one of our main target users—due to COVID. Task-based prompts may have primed understanding. These limitations taught us to design with humility about what we don\'t know.',
              },
              {
                title: 'Don\'t build from scratch when you don\'t have to.',
                body: 'Modeling our design on the existing Detroit Zoo app reduced the learning curve and let us focus on what was truly new: the game, the touchpoints, and the pandemic-era donation flow.',
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

      {/* ── Nature moment: Aerial tropical canopy ── */}
      <NatureMoment
        src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1920&q=80"
        alt="Sunlight streaming through a lush green forest canopy"
        className="h-[50vh]"
      />

      {/* ════════════════════════════════════════
          MY ROLE & TIMELINE
         ════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            <div>
              <Overline>My role</Overline>
              <div data-reveal className="apple-reveal space-y-6">
                <div>
                  <p className="text-[14px] font-semibold text-[#24A2A7] mb-1">Team</p>
                  <p className="text-[15px] text-[#9a9a9f] leading-relaxed">Sam Bloch, Dolapo Raji, Angel Tang, Gloria Zhong — University of Michigan</p>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#24A2A7] mb-3">Sam's Contributions</p>
                  <div className="space-y-3">
                    {[
                      'Refined and completed the scrapbook game, physical touchpoint, camera, and physical map search in Adobe XD',
                      'Co-authored the early User Flow Diagram with Dolapo',
                      'Fixed all errors in the final prototype',
                      'Produced the final video demo walkthrough',
                    ].map((item, i) => (
                      <p key={i} className="text-[15px] text-[#9a9a9f] leading-relaxed flex gap-3">
                        <span className="text-[#24A2A7] shrink-0">→</span> {item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Overline>Timeline</Overline>
              <div data-reveal className="apple-reveal space-y-0">
                {[
                  { date: 'Phase 1', event: 'User interviews, personas, and competitive analysis. Identified pandemic pain points and user demographics.' },
                  { date: 'Phase 2', event: 'Sketches, storyboards, and paper prototypes. Tested core flows with participants.' },
                  { date: 'Phase 3', event: 'User Flow Diagrams and initial Adobe XD wireframes. Translated paper insights into digital screens.' },
                  { date: 'Phase 4', event: 'Usability testing rounds. Discovered two game modes, elevated Message Zookeeper, refined physical touchpoints.' },
                  { date: 'Final', event: 'Polished Adobe XD prototype, final video demo, report, and presentation. All errors fixed and flows connected.' },
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

      {/* ════════════════════════════════════════
          FOOTER
         ════════════════════════════════════════ */}
      <section data-reveal className="apple-reveal pt-20 md:pt-28 pb-32 md:pb-36 text-center px-6">
        <p className="text-[14px] text-[#9a9a9f] mb-8">
          Interaction Design &middot; University of Michigan &middot; 2020
        </p>
        <button onClick={() => navigate('/projects')} className="inline-flex items-center gap-2 text-white font-medium text-sm hover:text-[#24A2A7] transition-colors duration-300">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </button>
      </section>

    </div>
  );
};

export default ZooReportCaseStudy;
