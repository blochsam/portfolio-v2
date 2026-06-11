
import React, { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, X, ArrowRight } from 'lucide-react';
import { track } from '../utils/track';

interface AboutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutOverlay: React.FC<AboutOverlayProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus trap + Escape key + focus restoration
  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Focus the close button on open
    const closeBtn = dialogRef.current?.querySelector<HTMLElement>('button[aria-label="Close"]');
    closeBtn?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  // Scroll-triggered reveal for overlay sections
  const revealSections = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const sections = scrollContainerRef.current.querySelectorAll<HTMLElement>('.about-reveal');
    sections.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const containerRect = scrollContainerRef.current!.getBoundingClientRect();
      const relativeTop = rect.top - containerRect.top;
      if (relativeTop < containerRect.height * 0.85) {
        el.classList.add('about-visible');
      }
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    // Initial check after entrance animation
    const timer = setTimeout(revealSections, 400);
    container.addEventListener('scroll', revealSections, { passive: true });

    return () => {
      clearTimeout(timer);
      container.removeEventListener('scroll', revealSections);
    };
  }, [isOpen, revealSections]);

  if (!isOpen) return null;

  const handleSecureMail = (e: React.MouseEvent) => {
    e.preventDefault();
    track('contact_click', { source: 'about_overlay' });
    const user = 'sam';
    const domain = 'sam-bloch.com';
    const at = '@';
    window.location.href = `mailto:${user}${at}${domain}`;
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-300 ease-out"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-overlay-title"
      ref={dialogRef}
    >
      <div
        className="relative bg-[#141414] border border-white/10 rounded-[2.5rem] max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] snappy-entrance"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 md:top-8 md:right-8 text-gray-400 hover:text-white transition-[color,background-color,transform] min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/5 rounded-full active:scale-90 z-[120]"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Scrollable content area — inset so scrollbar sits inside rounded container */}
        <div
          ref={scrollContainerRef}
          className="overflow-y-auto overflow-x-hidden max-h-[90vh] overlay-content overlay-scroll-inset"
        >
          <div className="p-8 md:p-12 lg:p-16">

            {/* ── Hero Section ── */}
            <section className="about-reveal mb-16 md:mb-24">
              <div className="mb-8 md:mb-10">
                <p className="text-xs font-black text-[#24A2A7] uppercase tracking-[0.4em] mb-4">Walled Lake, MI &rarr; Los Angeles, CA</p>
                <h2 id="about-overlay-title" className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-4 text-white">Sam Bloch</h2>
                <p className="text-base md:text-xl font-bold text-gray-300 tracking-tight">Program Manager at Google &middot; AI Builder &middot; College Educator</p>
              </div>

              <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center">
                <div className="space-y-7">
                  <p className="text-lg md:text-2xl font-medium leading-tight text-gray-300">
                    I grew up in Walled Lake, Michigan, where &ldquo;how does this work?&rdquo; usually ended with a disassembled radio or a messy art project on the kitchen table.
                  </p>
                  <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                    I graduated from Michigan State in 2020 with a degree in Experience Architecture and walked straight into a world that had just been forced to go fully digital overnight.
                  </p>
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                    Today &mdash; after stops at Rocket Mortgage and MSCI &mdash; I&rsquo;m a Program Manager at YouTube working on Trust &amp; Safety. Evenings, I teach my course Level Up at Quinnipiac, and I&rsquo;m finishing my M.A. in Leadership at University of the Pacific (Class of 2026).
                  </p>
                </div>
                <div className="aspect-[4/5] bg-[#1a1a1a] rounded-[2rem] overflow-hidden border border-white/5 relative">
                  <img
                    src="/about-1.webp"
                    alt="Sam Origins"
                    width={400}
                    height={500}
                    className="w-full h-full object-cover grayscale"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
              </div>
            </section>

            {/* ── Conviction Line ── */}
            <section className="about-reveal mb-16 md:mb-24">
              <div className="relative py-8 md:py-10 px-2">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#24A2A7] via-[#24A2A7]/50 to-transparent rounded-full" />
                <p className="text-[10px] font-black text-[#24A2A7] uppercase tracking-[0.4em] pl-8 md:pl-12 mb-3">A line I live by</p>
                <p className="text-xl md:text-3xl font-bold leading-snug tracking-tight text-white pl-8 md:pl-12">
                  Technology is only as good as the human connection it makes possible.
                </p>
              </div>
            </section>

            {/* ── Education Section ── */}
            <section className="about-reveal mb-16 md:mb-24">
              <div className="mb-10">
                <h3 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6">I Can&rsquo;t Stop Learning</h3>
                <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl">
                  One degree wasn&rsquo;t enough. I think the best program managers are <span className="text-white font-bold">part people-person, part systems-thinker,</span> so I kept going:
                </p>
              </div>

              <ul className="grid md:grid-cols-2 gap-8 text-gray-300 mb-14">
                <li className="p-8 bg-white/5 rounded-3xl border border-white/5 space-y-4 hover:border-[#24A2A7]/20 transition-colors">
                  <div className="w-10 h-10 bg-[#24A2A7]/20 rounded-xl flex items-center justify-center">
                    <span className="text-[#24A2A7] font-black">1</span>
                  </div>
                  <h4 className="text-xl font-bold">M.S. in HCI</h4>
                  <p className="text-gray-400">Understanding the friction between humans and machines, and how to reduce it.</p>
                </li>
                <li className="p-8 bg-white/5 rounded-3xl border border-white/5 space-y-4 hover:border-[#24A2A7]/20 transition-colors">
                  <div className="w-10 h-10 bg-[#24A2A7]/20 rounded-xl flex items-center justify-center">
                    <span className="text-[#24A2A7] font-black">2</span>
                  </div>
                  <h4 className="text-xl font-bold">M.A. in Leadership</h4>
                  <p className="text-gray-400">Finishing my second graduate degree (Class of 2026). The focus: leading teams through the AI shift without losing the human element.</p>
                </li>
              </ul>

              <div className="pt-10 border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {[
                    { name: 'Michigan State University', degree: 'B.A. Experience Architecture, 2020', focus: 'Digital storytelling & user research', logo: '/msu.webp' },
                    { name: 'Quinnipiac University', degree: 'M.S. Interactive Media, 2023', focus: 'Human-computer interaction & prototyping', logo: '/quinni.webp' },
                    { name: 'University of the Pacific', degree: 'M.A. Leadership, Innovation & Change, 2026', focus: 'Organizational leadership in AI era', logo: '/uop.webp' }
                  ].map((school) => (
                    <div key={school.name} className="flex flex-col items-center text-center group">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5 transition-[transform,border-color] group-hover:scale-110 group-hover:border-[#24A2A7]/40 relative">
                        {/* Tooltip with school name */}
                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[#24A2A7] text-black text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-20 shadow-xl">
                          {school.name}
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#24A2A7] rotate-45"></div>
                        </div>

                        <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                          <img
                            src={school.logo}
                            alt={school.name}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            decoding="async"
                          />
                        </div>
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight group-hover:text-[#24A2A7] transition-colors">{school.degree}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── Teaching Section ── */}
            <section className="about-reveal mb-16 md:mb-24">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className="order-2 lg:order-1 aspect-[16/10] bg-[#1a1a1a] rounded-[2rem] overflow-hidden border border-white/5 relative">
                  <img
                    src="/about-2.webp"
                    alt="Sam Teaching"
                    width={640}
                    height={400}
                    className="w-full h-full object-cover grayscale"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="space-y-6 order-1 lg:order-2">
                  <h3 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">Why I Teach: <br /> &ldquo;Level Up&rdquo;</h3>
                  <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                    I designed and teach a course called Level Up at Quinnipiac University. The idea is simple: give students the career playbook nobody gave me.
                  </p>
                  <p className="text-gray-400 text-base leading-relaxed">
                    It runs on a platform I built myself &mdash; a custom LMS with AI interview simulation and real-time feedback. The course and the code are both mine.
                  </p>
                  <Link
                    to="/projects/level-up"
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#24A2A7] hover:text-white transition-colors group"
                  >
                    Read the Level Up case study
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                  </Link>
                </div>
              </div>
            </section>

            {/* ── Sandbox Section — borderless list, no card chrome ── */}
            <section className="about-reveal mb-16 md:mb-20">
              <div className="max-w-2xl mb-8">
                <h3 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6">A Sandbox Kid</h3>
                <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                  Give me a free weekend and I&rsquo;ll disappear into a project. The problem-solving I use at Google is the same muscle I use to troubleshoot a 3D printer or find the right chord progression on guitar &mdash; and the same energy that ships side projects like{' '}
                  <Link to="/projects/fudge" className="text-[#24A2A7] font-bold hover:underline">Fudge</Link>,{' '}
                  <Link to="/projects/level-up" className="text-[#24A2A7] font-bold hover:underline">Level Up</Link>, and{' '}
                  <Link to="/projects/portfolio" className="text-[#24A2A7] font-bold hover:underline">this site</Link>.
                </p>
              </div>

              <div className="grid md:grid-cols-[1fr_0.85fr] gap-10 items-center">
                <ul className="space-y-5">
                  {[
                    { title: "IoT & Tinkering", text: "Home automation, 3D printing, whatever new tech catches my eye." },
                    { title: "Music", text: "Guitar, vinyl, concerts.", link: "https://www.concertarchives.org/sam-bloch", linkText: "Archive" },
                    { title: "Surfing & Hiking", text: "Terrified of the ocean for years. Now I can't stay out of it." },
                    { title: "Film", text: "LA theater culture and its community.", link: "https://letterboxd.com/sam5927tde/", linkText: "Letterboxd" }
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-4">
                      <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-[#24A2A7] shrink-0" aria-hidden="true" />
                      <p className="text-sm md:text-base leading-relaxed">
                        <span className="text-white font-bold">{item.title}</span>
                        <span className="text-gray-500"> &mdash; {item.text}</span>
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#24A2A7] font-semibold hover:underline ml-2 align-baseline">
                            {item.linkText} <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="aspect-[4/5] bg-[#1a1a1a] rounded-[2rem] overflow-hidden border border-white/5">
                  <img
                    src="/about-3.webp"
                    alt="Sam Passions"
                    width={400}
                    height={500}
                    className="w-full h-full object-cover grayscale"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </section>

            {/* ── Action Band ── */}
            <div className="pt-10 border-t border-white/5">
              <p className="text-xs font-black text-[#24A2A7] uppercase tracking-[0.4em] mb-6">That&rsquo;s the story &mdash; here&rsquo;s the proof</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/resume"
                  className="px-7 py-4 min-h-[44px] rounded-full bg-[#24A2A7] text-[#121212] font-black uppercase text-xs tracking-widest hover:brightness-110 transition-[filter,transform] active:scale-95 flex items-center gap-2"
                >
                  View Resume
                </Link>
                <Link
                  to="/projects"
                  className="px-7 py-4 min-h-[44px] rounded-full border border-white/10 text-gray-300 hover:text-white hover:border-[#24A2A7]/40 font-black uppercase text-xs tracking-widest transition-[color,border-color,transform] active:scale-95 flex items-center gap-2"
                >
                  Browse Projects
                </Link>
                <button
                  onClick={handleSecureMail}
                  className="px-7 py-4 min-h-[44px] rounded-full border border-white/10 text-gray-300 hover:text-white hover:border-[#24A2A7]/40 font-black uppercase text-xs tracking-widest transition-[color,border-color,transform] active:scale-95 flex items-center gap-2"
                >
                  Email Me
                </button>
              </div>
              <button
                onClick={onClose}
                className="mt-6 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
              >
                &larr; or return to the site
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutOverlay;
