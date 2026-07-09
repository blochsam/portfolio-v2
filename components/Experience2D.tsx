import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { track } from '../utils/track';
import { CONTENT_MAP, COLORS, LOGO } from '../constants';
import { SplineObjectId, PortfolioContent } from '../types';
import { Menu, X, ChevronDown } from 'lucide-react';
import { usePageMeta } from '../utils/usePageMeta';
import { ROUTE_META } from '../data/routeMeta';
import { PROJECTS, FEATURED_PROJECT_IDS } from '../data/projects';

/* ─── Hook: observe .scroll-reveal and add .revealed (#10 reduced-motion guard) ─── */
function useScrollReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const container = containerRef.current;
    if (!container) return;
    const targets = container.querySelectorAll('.scroll-reveal, .scroll-reveal-stagger');
    if (targets.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return containerRef;
}


interface Experience2DProps {
  setSelectedContent: (content: PortfolioContent | null) => void;
  /** Kept for API parity with the 3D experience; the 2D site links to /about instead. */
  openAbout?: () => void;
}

const Experience2D: React.FC<Experience2DProps> = ({ setSelectedContent }) => {
  usePageMeta(ROUTE_META['/']);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [expandedFocus, setExpandedFocus] = useState<string | null>(null);
  const scrollRef = useScrollReveal();

  // Close mobile menu on Escape
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // Filter out Sesame and About from the focus areas
  const sections = (Object.keys(CONTENT_MAP) as SplineObjectId[]).filter(
    id => id !== '1dfa5782-8ffc-47dc-9562-db86cba5ee72' && id !== '1ee647e1-3ee5-42f9-80bd-4829e0df1c52'
  );

  const featured = PROJECTS.filter(p => FEATURED_PROJECT_IDS.includes(p.id));

  // Google colorized helper
  const GoogleColorized = () => (
    <span className="inline-flex font-bold">
      <span className="text-[#4285F4]">G</span>
      <span className="text-[#EA4335]">o</span>
      <span className="text-[#FBBC05]">o</span>
      <span className="text-[#4285F4]">g</span>
      <span className="text-[#34A853]">l</span>
      <span className="text-[#EA4335]">e</span>
    </span>
  );

  const handleSecureMail = () => {
    track('contact_click', { source: 'home_hero' });
    const user = 'sam';
    const domain = 'sam-bloch.com';
    const address = `${user}@${domain}`;
    // Copy first: mailto silently no-ops without a configured mail client
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(address).catch(() => {});
    window.location.href = `mailto:${address}`;
  };

  return (
    <div ref={scrollRef} className="min-h-screen bg-[#121212] text-white selection:bg-[#24A2A7]/30 overflow-x-hidden">
      {/* Editorial Navigation */}
      <header className="fixed top-0 w-full z-50 bg-[#121212]/[0.97] border-b border-white/5 p-4 md:p-6 md:px-12 flex justify-between items-center">
        <div className="transition-transform scale-75 md:scale-100 origin-left">
          {LOGO}
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 lg:gap-10 items-center">
          {[
            { id: 'resume', label: 'Resume', to: '/resume' },
            { id: 'projects', label: 'Projects', to: '/projects' },
          ].map(item => (
            <Link
              key={item.id}
              to={item.to}
              onMouseEnter={() => setHoveredNav(item.id)}
              onMouseLeave={() => setHoveredNav(null)}
              className={`text-xs font-black uppercase tracking-[0.3em] transition-[color,transform] duration-300 relative py-2 whitespace-nowrap
                ${hoveredNav === item.id ? 'text-[#24A2A7] scale-110' : 'text-gray-400 hover:text-white'}`}
              style={hoveredNav === item.id ? { textShadow: '0 0 12px rgba(36, 162, 167, 0.6)' } : undefined}
            >
              {item.label}
              <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#24A2A7] transition-[width,box-shadow] duration-500
                ${hoveredNav === item.id ? 'w-full shadow-[0_0_8px_rgba(36,162,167,0.5)]' : 'w-0'}`}>
              </span>
            </Link>
          ))}
          <Link
            to="/3d"
            onMouseEnter={() => setHoveredNav('3d')}
            onMouseLeave={() => setHoveredNav(null)}
            className={`px-5 py-2.5 rounded-full border text-xs font-black uppercase tracking-[0.3em] transition-[color,border-color,background-color,transform] duration-300 active:scale-95 whitespace-nowrap
              ${hoveredNav === '3d' ? 'border-[#24A2A7] text-[#24A2A7] bg-[#24A2A7]/10 scale-105' : 'border-[#24A2A7]/30 text-[#24A2A7] hover:bg-[#24A2A7]/10'}`}
            style={hoveredNav === '3d' ? { boxShadow: '0 0 16px rgba(36, 162, 167, 0.3)' } : undefined}
          >
            Enter Immersive 3D
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            aria-label="Open Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay — portalled to body to escape stacking context from animate-in wrapper */}
      {isMenuOpen && createPortal(
        <div className="fixed top-0 left-0 w-full h-[100dvh] z-[9999] overflow-y-auto bg-[#121212] flex flex-col items-center justify-center p-8 motion-safe:animate-in motion-safe:fade-in duration-300" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-8 right-8 p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            aria-label="Close Menu"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="flex flex-col gap-10 text-center">
            <button
              onClick={() => { setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-3xl font-black uppercase tracking-tighter hover:text-[#24A2A7] transition-colors"
            >Home</button>
            <Link to="/3d" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black uppercase tracking-tighter hover:text-[#24A2A7] transition-colors">3D Experience</Link>
            <Link to="/projects" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black uppercase tracking-tighter hover:text-[#24A2A7] transition-colors">Projects & Artifacts</Link>
            <a href="/SBloch_Resume.pdf" download="SBloch_Resume.pdf" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black uppercase tracking-tighter hover:text-[#24A2A7] transition-colors">Resume</a>
          </div>

          <div className="mt-20 opacity-20 scale-75">{LOGO}</div>
        </div>,
        document.body
      )}

      <main className="relative overflow-hidden">

        {/* ════════════════════════════════════════
            SECTION 1 — HERO
           ════════════════════════════════════════ */}
        <section className="relative md:min-h-screen grid grid-cols-1 md:grid-cols-[1fr_auto] md:items-center gap-4 md:gap-12 px-6 md:px-12 lg:px-[6%] xl:px-[8%] mx-auto pt-28 md:pt-32 pb-12 overflow-visible">
          <div className="relative z-20">
            {/* Line-by-line kinetic reveal — the signature moment for visitors
                who never see the 3D scene (mobile + reduced-motion stays static).
                Mobile tucks a small faded portrait into the empty space right of
                the stacked headline; desktop keeps the full portrait column. */}
            <div className="relative">
              <div
                className="md:hidden absolute right-0 top-0 z-0 w-[clamp(100px,28vw,150px)] rounded-xl overflow-hidden motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700"
                style={{ aspectRatio: '4/5' }}
                aria-hidden="false"
              >
                <img
                  src="/about-portrait.webp"
                  alt="Sam Bloch"
                  width={150}
                  height={188}
                  fetchPriority="high"
                  className="w-full h-full object-cover object-center grayscale"
                />
                {/* Same vignette fade as the desktop portrait, scaled to size —
                    the faded edge is what lets the headline meet it gracefully */}
                <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 30px 24px -8px #121212, inset 0 -34px 28px -8px #121212, inset 26px 0 18px -8px #121212, inset -24px 0 16px -8px #121212' }} />
              </div>
              <h1 className="relative z-10 text-4xl sm:text-5xl md:text-7xl lg:text-8xl 2xl:text-[9rem] font-black tracking-tighter leading-[0.95] md:leading-[0.9] mb-8 md:mb-12">
                <span className="block motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">Architecting</span>
                <span className="block text-[#24A2A7] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 motion-safe:delay-150">Human-Centric</span>
                <span className="block motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 motion-safe:delay-300">Systems.</span>
              </h1>
            </div>

            <p className="whitespace-nowrap text-gray-400 text-[clamp(0.7rem,2.8vw,1.25rem)] 2xl:text-xl leading-relaxed motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 duration-1000 delay-300">
              Show me a pain point and I'll show you what I built to solve it.
            </p>
            <p className="mt-3 text-gray-500 text-sm md:text-base 2xl:text-lg tracking-wide motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 duration-1000 delay-400">
              Program Manager at <GoogleColorized /> · AI Builder · College Educator
            </p>

            <div className="mt-8 md:mt-10 2xl:mt-12 flex flex-wrap gap-4 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 duration-1000 delay-500">
              <button
                onClick={handleSecureMail}
                className="group px-8 py-4 2xl:px-10 2xl:py-5 bg-[#24A2A7] text-black font-black uppercase text-[10px] 2xl:text-xs tracking-[0.2em] rounded-full hover:brightness-110 transition-[filter,transform] shadow-xl active:scale-95 flex items-center gap-3"
              >
                Let's Connect
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <Link
                to="/projects"
                className="px-8 py-4 2xl:px-10 2xl:py-5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 font-black uppercase text-xs tracking-[0.2em] rounded-full transition-[color,border-color,transform] active:scale-95"
              >
                View Work
              </Link>
            </div>

            {/* Logo strip */}
            <div className="mt-10 flex items-center justify-center md:justify-start gap-5 md:gap-8 opacity-20 hover:opacity-35 transition-opacity duration-500 motion-safe:animate-in motion-safe:fade-in duration-1000 delay-700">
              {/* Google wordmark */}
              <svg className="h-[18px] md:h-[22px] 2xl:h-[28px] shrink-0" viewBox="0 0 272 92" fill="currentColor"><path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/><path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C119.25 34.32 129.24 25 141.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/><path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/><path d="M225 3v65h-9.5V3h9.5z"/><path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.96 0-11.84 4.37-11.59 12.93z"/><path d="M35.29 41.19V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49-.21z"/></svg>
              {/* YouTube full wordmark */}
              <img src="/youtube-logo.svg" alt="YouTube" className="h-[22px] md:h-[28px] 2xl:h-[34px] shrink-0 brightness-0 invert" />
              {/* Rocket Mortgage full wordmark */}
              <img src="/rocket-logo.svg" alt="Rocket Mortgage" className="h-[20px] md:h-[24px] 2xl:h-[30px] shrink-0 brightness-0 invert" />
              {/* MSCI full wordmark */}
              <img src="/msci-logo.svg" alt="MSCI" className="h-[24px] md:h-[30px] 2xl:h-[36px] shrink-0 brightness-0 invert" />
            </div>
          </div>

          {/* Headshot */}
          <div className="hidden md:flex items-center justify-center md:justify-end pr-0 md:pr-4 lg:pr-8 -mt-2 md:mt-0 order-2 md:order-none">
            <div
              className="relative w-[min(300px,85vw)] md:w-[min(440px,40vw)] xl:w-[min(480px,35vw)] 2xl:w-[min(600px,28vw)] rounded-2xl overflow-hidden shrink-0"
              style={{ aspectRatio: '4/5' }}
            >
              <img
                src="/about-portrait.webp"
                alt="Sam Bloch"
                width={440}
                height={550}
                fetchPriority="high"
                className="w-full h-full object-cover object-center grayscale"
              />
              {/* Vignette fade — single element combining all edges */}
              <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 80px 60px -20px #121212, inset 0 -100px 80px -20px #121212, inset 60px 0 40px -20px #121212, inset -60px 0 40px -20px #121212' }} />
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 2 — FEATURED WORK (#2)
           ════════════════════════════════════════ */}
        <section className="scroll-reveal content-auto px-6 md:px-12 max-w-7xl mx-auto mb-24 relative z-20">
          <div className="flex items-end justify-between mb-8 md:mb-10 border-b border-white/5 pb-6">
            <h2 className="text-lg md:text-xl font-black tracking-tighter uppercase">Selected Work</h2>
            <Link
              to="/projects"
              className="text-xs font-bold uppercase tracking-widest text-[#24A2A7] hover:text-white transition-colors flex items-center gap-2"
            >
              See All
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>

          <div className="scroll-reveal-stagger grid grid-cols-1 md:grid-cols-3 gap-4">
            {featured.map((project, i) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group relative block bg-[#1a1a1a]/40 border border-white/5 rounded-2xl overflow-hidden hover:bg-[#202020] transition-[background-color] duration-500 text-left"
                style={{ transitionDelay: `${i * 100}ms` }}
                aria-label={`View case study: ${project.title}`}
              >
                {project.image && (
                  <div className="relative w-full aspect-[16/10] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      width={640}
                      height={400}
                      loading="lazy"
                      className="w-full h-full object-cover md:[@media(hover:hover)]:grayscale group-hover:grayscale-0 group-hover:scale-105 transition-[filter,transform] duration-500"
                      style={{ objectPosition: project.imagePosition ?? 'center' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-60" />
                  </div>
                )}
                <div className="p-5 md:p-6">
                  <h3 className="text-lg font-black tracking-tight mb-2 group-hover:text-[#24A2A7] transition-colors leading-tight">{project.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4">{project.description}</p>
                  <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#24A2A7] group-hover:gap-4 transition-[gap]">
                    View Case Study
                    <svg className="w-3 h-3 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 3 — FOCUS AREAS (inline expandable, #1 + #8)
           ════════════════════════════════════════ */}
        <section className="scroll-reveal content-auto px-6 md:px-12 max-w-7xl mx-auto mb-24 relative z-20">
          <div className="flex items-end justify-between mb-8 md:mb-10 border-b border-white/5 pb-6">
            <h2 className="text-lg md:text-xl font-black tracking-tighter uppercase">Focus Areas</h2>
          </div>

          <div className="space-y-3">
            {sections.map((id, index) => {
              const content = CONTENT_MAP[id];
              const isOpen = expandedFocus === id;

              return (
                <div
                  key={id}
                  className={`rounded-2xl overflow-hidden transition-colors duration-500 border ${isOpen ? 'border-[#24A2A7]/20 bg-[#161616]' : 'border-white/5 hover:border-white/10 bg-transparent'}`}
                >
                  <button
                    onClick={() => {
                      if (!isOpen) track('focus_area_open', { area: content.id, surface: '2d' });
                      setExpandedFocus(isOpen ? null : id);
                    }}
                    className="w-full flex items-center justify-between p-5 md:p-7 text-left group cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${isOpen ? 'bg-[#24A2A7]/15' : 'bg-white/[0.04]'}`}>
                        <span className={`text-[11px] font-mono font-bold transition-colors duration-300 ${isOpen ? 'text-[#24A2A7]' : 'text-gray-500 group-hover:text-[#24A2A7]'}`}>0{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-base md:text-lg font-black uppercase tracking-tight text-white leading-tight">{content.title}</h3>
                        <p className="text-gray-500 text-[13px] mt-1 hidden md:block">{content.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden lg:flex gap-2 flex-wrap justify-end">
                        {content.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-gray-500 border border-white/5 px-2.5 py-1 rounded-md">{tag}</span>
                        ))}
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-[background-color,transform] duration-300 ${isOpen ? 'bg-[#24A2A7]/10 rotate-180' : 'bg-white/[0.03]'}`}>
                        <ChevronDown className={`w-4 h-4 transition-colors duration-300 ${isOpen ? 'text-[#24A2A7]' : 'text-gray-500'}`} />
                      </div>
                    </div>
                  </button>

                  {/* Expandable content — always in DOM for SEO (#8).
                      grid-rows animation sizes to content, so nothing clips on mobile */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                    <div className="overflow-hidden">
                    <div className="px-5 md:px-7 pb-7 md:pb-9">
                      {/* Divider */}
                      <div className="h-px w-full bg-white/5 mb-6" />

                      {/* Hook */}
                      <p className="text-gray-300 text-[15px] md:text-base leading-[1.8] mb-7 max-w-4xl">
                        {content.hook ?? content.description}
                      </p>

                      {/* Proof points */}
                      {content.receipts && content.receipts.length > 0 && (
                        <ul className="space-y-2 mb-8">
                          {content.receipts.map((r) => (
                            <li key={r} className="flex items-start gap-3">
                              <span className="mt-[8px] w-1.5 h-1.5 rounded-full bg-[#24A2A7] shrink-0" aria-hidden="true" />
                              <span className="text-gray-400 text-[14px] md:text-[15px] leading-relaxed">{r}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Approach — editorial list, no nested cards */}
                      {content.approach && content.approach.length > 0 && (
                        <div className="mb-8 border-t border-white/5 divide-y divide-white/5">
                          {content.approach.map((b) => (
                            <div key={b.title} className="py-4">
                              <h4 className="text-white font-bold text-sm mb-1">{b.title}</h4>
                              <p className="text-gray-500 text-[13px] leading-[1.7] max-w-2xl">{b.desc}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Quote with attribution */}
                      {content.quote && (
                        <figure className="border-l-2 border-[#24A2A7]/30 pl-5 py-1 mb-8">
                          <blockquote className="text-gray-300/70 text-[14px] italic leading-relaxed">&ldquo;{content.quote.text}&rdquo;</blockquote>
                          <figcaption className="mt-2 text-[11px] uppercase tracking-widest font-bold text-gray-500">— {content.quote.attribution}</figcaption>
                        </figure>
                      )}

                      {/* Related work */}
                      {content.related && content.related.length > 0 && (
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#24A2A7]">See It In Practice</span>
                          {content.related.map((link) => (
                            <Link
                              key={link.href}
                              to={link.href}
                              className="group flex items-center gap-2 text-[13px] font-bold text-white hover:text-[#24A2A7] transition-colors"
                            >
                              {link.label}
                              <svg className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#24A2A7] group-hover:translate-x-1 transition-[color,transform]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Tags — visible on mobile here since the row chips are lg-only */}
                      <div className="lg:hidden flex flex-wrap gap-2 mt-7">
                        {content.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-gray-500 border border-white/5 px-2.5 py-1 rounded-md">{tag}</span>
                        ))}
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 4 — ABOUT (condensed)
           ════════════════════════════════════════ */}
        <section className="scroll-reveal content-auto px-6 md:px-12 max-w-5xl mx-auto mb-24 relative z-20">
          <div className="bg-[#1a1a1a]/40 border border-white/5 rounded-[2rem] p-8 md:p-14 lg:p-20 overflow-hidden relative">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-6 leading-tight">
                  About Me
                </h2>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-medium mb-4">
                  Michigan-born, California-based. I spend my days at Google figuring out how to keep people safe online, and my evenings teaching the next generation of leaders at Quinnipiac.
                </p>
                <p className="text-gray-400 text-base leading-relaxed mb-8">
                  Three degrees. Two grad programs (HCI + Leadership). One obsession: making systems work better for people.
                </p>
                <Link
                  to="/about"
                  className="group inline-flex items-center gap-4 px-8 py-4 bg-transparent text-[#24A2A7] border-2 border-[#24A2A7] font-black uppercase text-xs tracking-[0.2em] rounded-full hover:bg-[#24A2A7] hover:text-[#121212] transition-[color,background-color,transform] shadow-xl active:scale-95"
                >
                  Full Bio
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              {/* Portrait */}
              <div className="aspect-[4/5] rounded-[1.5rem] overflow-hidden border border-white/5 relative group">
                <img
                  src="/headshot.webp"
                  alt="Sam Bloch"
                  className="w-full h-full object-cover object-center md:[@media(hover:hover)]:grayscale group-hover:grayscale-0 transition-[filter] duration-700"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/50 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Bottom spacer for fixed footer clearance */}
        <div className="h-20" />

      </main>
    </div>
  );
};

export default Experience2D;
