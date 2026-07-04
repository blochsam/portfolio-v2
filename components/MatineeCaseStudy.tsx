import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFooterAwareBottom } from '../utils/useFooterAwareBottom';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, X, RefreshCw } from 'lucide-react';
import { useScrollReveal, CountUp, CaseStudyImage } from './CaseStudyShared';

/* Matinee theme accent — "signal green" pulled from the PCB spec document */
const GREEN = '#3fb950';
const PAPER = '#e9e7de';

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
  return <div ref={barRef} className="fixed top-0 left-0 h-[3px] z-[70]" style={{ width: '0%', background: GREEN }} />;
};

/* ─── Overline (mono, spec-sheet style) ─── */
const Overline: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p data-reveal className="eink-reveal text-[13px] font-semibold uppercase tracking-[0.2em] mb-6 font-mono" style={{ color: GREEN }}>
    {children}
  </p>
);

/* ─── Terminal typing effect ─── */
const TerminalText: React.FC<{ text: string; delay?: number; className?: string }> = ({ text, delay = 0, className = '' }) => {
  const [displayed, setDisplayed] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const started = useRef(false);
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    const timeout = setTimeout(() => {
      if (started.current) return;
      started.current = true;
      let i = 0;
      intervalId = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(intervalId!);
          intervalId = null;
          setTimeout(() => setShowCursor(false), 2000);
        }
      }, 45);
    }, delay);
    return () => { clearTimeout(timeout); if (intervalId) clearInterval(intervalId); };
  }, [text, delay]);
  return (
    <span className={`font-mono ${className}`}>
      {displayed}
      {showCursor && <span className="animate-pulse" style={{ color: GREEN }}>_</span>}
    </span>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   E-INK PANEL — the signature interaction.
   A framed simulation of the 13.3" Spectra 6 display. Hitting "Refresh"
   plays the characteristic e-ink flash (invert → settle) and advances to
   the next frame. Frames live in /public/case-study/matinee/frames/.
   Frames are real Matinee output: frame-1 is a render straight from the
   pipeline; frame-2 is a photograph of the panel on the wall.
   ════════════════════════════════════════════════════════════════════════ */
const FRAMES = [
  '/case-study/matinee/frames/frame-1.webp',
  '/case-study/matinee/frames/frame-2.webp',
];

const EinkPanel: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const nextIndex = useRef(0);

  const refresh = useCallback(() => {
    if (refreshing) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    nextIndex.current = (index + 1) % FRAMES.length;
    if (reduce) { setIndex(nextIndex.current); return; }
    setRefreshing(true);
    // swap the underlying image at the midpoint of the flash, then clear
    window.setTimeout(() => setIndex(nextIndex.current), 430);
    window.setTimeout(() => setRefreshing(false), 900);
  }, [index, refreshing]);

  return (
    <div className="flex flex-col items-center">
      {/* Wall + wooden frame */}
      <div className="relative w-full max-w-2xl">
        <div
          className="relative rounded-[6px] p-3 md:p-4"
          style={{ background: 'linear-gradient(150deg,#5a4028,#3d2b1a)', boxShadow: '0 30px 60px -20px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.06)' }}
        >
          {/* The panel — 4:3, e-ink paper */}
          <div className="relative overflow-hidden rounded-[2px]" style={{ aspectRatio: '4 / 3', background: PAPER }}>
            <img
              src={FRAMES[index]}
              alt="Matinee display frame"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            {/* e-ink flash overlay */}
            <div className={`absolute inset-0 pointer-events-none ${refreshing ? 'eink-flash' : 'opacity-0'}`} aria-hidden="true" />
          </div>
        </div>
        {/* little status LED, nods to the board */}
        <div className="absolute -bottom-1 right-4 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-white/30">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: refreshing ? GREEN : 'rgba(255,255,255,0.25)', boxShadow: refreshing ? `0 0 8px ${GREEN}` : 'none' }} />
          {refreshing ? 'repainting' : 'idle'}
        </div>
      </div>

      {/* Refresh button — nod to SW2 on the PCB */}
      <button
        onClick={refresh}
        disabled={refreshing}
        className="mt-10 group inline-flex items-center gap-3 px-7 py-4 rounded-full font-mono text-[12px] font-bold uppercase tracking-[0.2em] transition-transform active:scale-95 disabled:opacity-60"
        style={{ background: GREEN, color: '#0a0a0a' }}
        aria-label="Refresh the display"
      >
        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : 'group-hover:rotate-90 transition-transform duration-300'}`} />
        {refreshing ? 'Refreshing' : 'Refresh'}
      </button>
      <p className="text-[12px] text-[#8a8a8f] mt-5 font-mono max-w-md text-center leading-relaxed">
        Real frames — one straight from the render pipeline, one photographed on my wall. The flash mimics how e-ink actually repaints.
      </p>
    </div>
  );
};

/* ─── Boot sequence step ─── */
const BootStep: React.FC<{ n: number; title: string; detail: string; last?: boolean }> = ({ n, title, detail, last }) => (
  <div data-reveal className="eink-reveal flex gap-5">
    <div className="flex flex-col items-center">
      <div className="w-9 h-9 rounded-full border flex items-center justify-center font-mono text-sm font-bold flex-shrink-0"
        style={{ borderColor: GREEN, color: GREEN }}>{n}</div>
      {!last && <div className="w-px flex-1 my-1" style={{ background: 'rgba(63,185,80,0.25)' }} />}
    </div>
    <div className="pb-8">
      <h4 className="text-white font-bold tracking-tight">{title}</h4>
      <p className="text-[15px] text-[#9a9a9f] leading-relaxed mt-1 font-mono">{detail}</p>
    </div>
  </div>
);

/* ════════════════════════════════════════════════════════════════════════
   MatineeCaseStudy — Main component
   ════════════════════════════════════════════════════════════════════════ */
const MatineeCaseStudy: React.FC = () => {
  const navigate = useNavigate();
  const fabBottom = useFooterAwareBottom();
  const containerRef = useScrollReveal();
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  const handleDownloadPDF = async () => {
    const { generateCaseStudyPdfHtml } = await import('../utils/generateCaseStudyPdf');
    const html = generateCaseStudyPdfHtml('matinee', window.location.origin);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank', 'width=900,height=700');
    if (win) { win.onload = () => URL.revokeObjectURL(url); } else { URL.revokeObjectURL(url); }
  };

  const PIPELINE = [
    { k: 'Letterboxd', v: 'RSS feed' },
    { k: 'Vercel', v: 'Python + PIL render' },
    { k: 'Supabase', v: '1600×1200 PNG' },
    { k: 'ESP32', v: 'polls via ETag' },
    { k: 'The panel', v: 'repaints' },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-clip" style={{ ['--sel' as any]: GREEN }}>
      <style>{`
        [data-reveal] { opacity: 0; transform: translateY(30px); transition: opacity .8s cubic-bezier(.25,.46,.45,.94), transform .8s cubic-bezier(.25,.46,.45,.94); }
        [data-reveal].revealed { opacity: 1; transform: none; }
        .matinee-sel ::selection { background: ${GREEN}4d; }
        @keyframes eink {
          0%   { background:#000; opacity:1; }
          22%  { background:#e9e7de; opacity:1; }
          40%  { background:#000; opacity:1; }
          60%  { background:#e9e7de; opacity:1; }
          100% { background:#000; opacity:0; }
        }
        .eink-flash { animation: eink .9s steps(1,end) forwards; }
        .grid-paper { background-image: linear-gradient(rgba(63,185,80,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(63,185,80,.05) 1px, transparent 1px); background-size: 28px 28px; }
        @media (prefers-reduced-motion: reduce) {
          [data-reveal] { transition: none !important; opacity: 1; transform: none; }
          .eink-flash { animation: none !important; opacity: 0; }
        }
      `}</style>

      <ScrollProgress />

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 md:p-12"
          onClick={() => setLightbox(null)} role="dialog" aria-label="Enlarged image">
          <button onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors z-[201]"
            aria-label="Close"><X className="w-5 h-5" /></button>
          <img src={lightbox.src} alt={lightbox.alt} className="max-w-full max-h-[85vh] rounded-2xl object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* Back button */}
      <button onClick={() => navigate('/projects')}
        className="fixed top-8 left-8 md:left-12 z-[60] flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/5 shadow-xl active:scale-95 no-print"
        aria-label="Back to projects">
        <ArrowLeft className="w-4 h-4" /> Back to Archive
      </button>

      {/* PDF FAB (shared teal for site consistency) */}
      <div className="fixed right-6 z-[70] no-print" style={{ bottom: fabBottom }}>
        <button onClick={handleDownloadPDF}
          className="h-14 px-5 rounded-full flex items-center justify-center gap-2 shadow-2xl transition-transform hover:scale-105 active:scale-95"
          style={{ backgroundColor: '#24A2A7', color: '#0a0a0a' }} aria-label="Download case study PDF">
          <Download className="w-6 h-6" />
          <span className="text-xs font-black uppercase tracking-widest">PDF</span>
        </button>
      </div>

      {/* ══ HERO ══ */}
      <header className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 grid-paper" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_35%,_#0a0a0a_100%)]" />
        <div className="relative z-10 max-w-4xl pt-24 pb-12">
          <div className="text-[13px] font-mono mb-8" style={{ color: `${GREEN}b3` }}>
            <TerminalText text="> BOOTING MATINEE.INK" delay={400} />
          </div>
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black leading-[0.85] tracking-tight mb-6 text-white">Matinee</h1>
          <p className="text-[13px] font-mono uppercase tracking-[0.3em] mb-8" style={{ color: `${GREEN}99` }}>
            A cloud-connected e-ink display · 2026
          </p>
          <p className="text-base md:text-lg text-white/40 max-w-xl mx-auto leading-relaxed">
            A movie review that hangs on your wall. It pulls what I&rsquo;ve watched and rated on Letterboxd,
            renders the whole frame in the cloud, and paints it onto a 13.3&Prime; e-ink panel that sips power
            and never asks for attention. No feed. No notifications. Just the last thing I loved, framed like it matters.
          </p>
        </div>
        {/* hero device image */}
        <div data-reveal className="eink-reveal relative z-10 w-full max-w-3xl px-2 pb-20">
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] shadow-2xl">
            <img src="/case-study/matinee/hero.webp" alt="The Matinee display framed on a wall, showing a five-star Forrest Gump review" className="w-full h-auto" />
          </div>
          <p className="text-[11px] text-white/25 mt-3 font-mono">On my wall right now — Forrest Gump, five stars.</p>
        </div>
      </header>

      {/* ══ STATS ══ */}
      <section className="py-14 md:py-20 px-6 border-y border-white/[0.05]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { end: 200, prefix: '', suffix: '', label: 'Unit Kickstarter run' },
            { end: 114, prefix: '$', suffix: '', label: 'Bill of materials, per unit' },
            { end: 6, prefix: '', suffix: '', label: 'Colors of e-ink (Spectra 6)' },
            { end: 1, prefix: '', suffix: '', label: 'Source, done right' },
          ].map((s, i) => (
            <div key={s.label} data-reveal className="eink-reveal" style={{ transitionDelay: `${i * 100}ms` }}>
              <p className="text-4xl md:text-5xl font-mono font-bold" style={{ color: GREEN }}>
                <CountUp end={s.end} prefix={s.prefix} suffix={s.suffix} />
              </p>
              <p className="text-[12px] font-mono text-[#8a8a8f] uppercase tracking-wider mt-3 leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ THE IDEA ══ */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-4xl mx-auto">
        <div data-reveal className="eink-reveal">
          <Overline>The Idea</Overline>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-8 leading-tight">
            I write real reviews. Then they vanish into a feed.
          </h2>
          <div className="space-y-5 text-[17px] text-[#9a9a9f] leading-[1.8]">
            <p>
              I&rsquo;ve logged hundreds of films on Letterboxd — half-star ratings, dumb little one-liners, the occasional
              review I&rsquo;m actually proud of. And all of it lives in an app I open, scroll, and forget. The stuff I think
              about the most has no place in the room I actually live in.
            </p>
            <p>
              So I built the room a screen. Matinee takes my latest Letterboxd entry and turns it into an object — poster,
              rating, my words — that just <em>sits there</em>, on the wall, being true. It&rsquo;s the opposite of a
              notification. You don&rsquo;t check it. You catch it out of the corner of your eye and remember you have taste.
            </p>
          </div>
        </div>
      </section>

      {/* ══ THE DISPLAY (signature interaction) ══ */}
      <section className="py-16 md:py-24 px-6 md:px-12 border-t border-white/[0.05] grid-paper">
        <div className="max-w-4xl mx-auto">
          <div data-reveal className="eink-reveal text-center mb-14">
            <Overline>Interactive</Overline>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">Go ahead. Hit refresh.</h2>
            <p className="text-[17px] text-[#9a9a9f] max-w-xl mx-auto leading-[1.8]">
              Press the button and watch it repaint, the way real e-ink does — a flash, an invert, then it settles into the next frame.
            </p>
          </div>
          <EinkPanel />
        </div>
      </section>

      {/* ══ THE OBJECT ══ */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-4xl mx-auto">
        <div data-reveal className="eink-reveal">
          <Overline>The Object</Overline>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-8 leading-tight">
            I wanted dumb hardware and a smart cloud.
          </h2>
          <div className="space-y-5 text-[17px] text-[#9a9a9f] leading-[1.8]">
            <p>
              The hardware does almost nothing on purpose. There&rsquo;s no processor grinding away, no app running on the
              device. An ESP32 wakes up, asks the cloud &ldquo;is there a new picture?&rdquo;, and if there is, it paints it and goes back to sleep. That&rsquo;s it.
            </p>
            <p>
              That decision is the whole design. Every hard problem — fetching from Letterboxd, laying out the frame, fitting
              a poster into six colors — happens on a server I can fix in seconds, not on 200 boards I&rsquo;d have to physically
              recall. The panel is e-ink because a movie poster shouldn&rsquo;t glow, shouldn&rsquo;t refresh, shouldn&rsquo;t cost power to
              keep showing. It holds its last image with the power off. <span style={{ color: GREEN }}>Like paper that changes its mind once a day.</span>
            </p>
          </div>
          <div data-reveal className="eink-reveal mt-10">
            <CaseStudyImage src="/case-study/matinee/object-detail.webp"
              alt="Close-up of the Matinee e-ink panel showing a review of The Bride"
              caption="The 13.3&Prime; Spectra 6 panel up close — six colors, no backlight, no glow." onOpen={setLightbox} />
          </div>
        </div>
      </section>

      {/* ══ THE BOARD ══ */}
      <section className="py-16 md:py-24 px-6 md:px-12 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div data-reveal className="eink-reveal mb-12">
            <Overline>The Board</Overline>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
              A two-layer board, a $4 brain, and a spec I could hand to a factory.
            </h2>
            <p className="text-[17px] text-[#9a9a9f] max-w-2xl leading-[1.8]">
              I designed the PCB to be almost boring — and that was the goal. One ESP32-S3, a power regulator, a USB-C port,
              two buttons, and a ribbon connector to the panel. Two layers. Under a dollar to assemble. The less that&rsquo;s on
              the board, the less that can fail across a 200-unit run.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Boot sequence */}
            <div data-reveal className="eink-reveal">
              <h3 className="text-[13px] font-mono font-bold uppercase tracking-widest mb-6" style={{ color: GREEN }}>Boot Sequence</h3>
              <div>
                <BootStep n={1} title="Power On" detail="ESP32 boots, checks for saved Wi-Fi." />
                <BootStep n={2} title="Wi-Fi Setup" detail="No network? Spin up a captive portal to configure." />
                <BootStep n={3} title="Register" detail="Phone home with the hardware serial." />
                <BootStep n={4} title="Pair" detail="Show a 6-digit code, claim it in the app." />
                <BootStep n={5} title="Loop" detail="Heartbeat every 5 min, poll for a new frame every 10s, sleep." last />
              </div>
            </div>
            {/* Spec images */}
            <div data-reveal className="eink-reveal space-y-6">
              <CaseStudyImage src="/case-study/matinee/pcb-spec.png" alt="Matinee PCB specification document cover"
                caption="Matinee Display — PCB Spec v2.0." onOpen={setLightbox} />
              <CaseStudyImage src="/case-study/matinee/pcb-bom.png" alt="Matinee bill of materials"
                caption="The whole BOM fits on one page — ~$114 per unit at 200 qty." onOpen={setLightbox} />
            </div>
          </div>
        </div>
      </section>

      {/* ══ THE PIPELINE ══ */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-5xl mx-auto">
        <div data-reveal className="eink-reveal">
          <Overline>The Pipeline</Overline>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-10 leading-tight">
            From my Letterboxd to my wall, in five hops.
          </h2>
        </div>
        <div data-reveal className="eink-reveal flex flex-col md:flex-row md:items-stretch gap-3 mb-10">
          {PIPELINE.map((node, i) => (
            <React.Fragment key={node.k}>
              <div className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 text-center">
                <p className="font-mono font-bold text-white text-sm">{node.k}</p>
                <p className="font-mono text-[12px] text-[#8a8a8f] mt-1">{node.v}</p>
              </div>
              {i < PIPELINE.length - 1 && (
                <div className="flex items-center justify-center font-mono text-lg md:rotate-0 rotate-90" style={{ color: GREEN }}>→</div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div data-reveal className="eink-reveal">
          <p className="text-[17px] text-[#9a9a9f] max-w-2xl leading-[1.8]">
            The ETag trick is the part I&rsquo;m quietest-proud of: the device asks &ldquo;has the picture changed?&rdquo; and 99% of the
            time the answer is &ldquo;no,&rdquo; so it downloads nothing and goes back to sleep. It&rsquo;s the difference between a wall
            ornament and a power bill.
          </p>
        </div>
      </section>

      {/* ══ THE COMPANION ══ */}
      <section className="py-16 md:py-24 px-6 md:px-12 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div data-reveal className="eink-reveal mb-12">
            <Overline>The Companion</Overline>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
              The wall is the output. The app is the control room.
            </h2>
            <p className="text-[17px] text-[#9a9a9f] max-w-2xl leading-[1.8]">
              Pairing, what&rsquo;s on the wall, the whole review feed — it all lives in a Next.js PWA I run off my phone.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div data-reveal className="eink-reveal">
              <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02] p-6 flex justify-center">
                <img src="/case-study/matinee/app-home.webp" alt="Matinee companion app — Now Displaying home screen"
                  className="w-auto max-h-[560px] rounded-xl cursor-zoom-in"
                  onClick={() => setLightbox({ src: '/case-study/matinee/app-home.webp', alt: 'Matinee companion app home screen' })} loading="lazy" />
              </div>
              <h4 className="text-white font-bold mt-5 mb-2">Now Displaying</h4>
              <p className="text-[15px] text-[#9a9a9f] leading-relaxed">
                The home screen mirrors the wall: what&rsquo;s showing, whether the device is online, and how often it repaints. It&rsquo;s
                also where I set the sprite — my house critic, <span style={{ color: GREEN }}>Spike</span> — and watch the counter tick past 350 reviews.
              </p>
            </div>
            <div data-reveal className="eink-reveal" style={{ transitionDelay: '100ms' }}>
              <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02] p-6 flex justify-center">
                <img src="/case-study/matinee/app-feed.webp" alt="Matinee companion app — the review feed"
                  className="w-auto max-h-[560px] rounded-xl cursor-zoom-in"
                  onClick={() => setLightbox({ src: '/case-study/matinee/app-feed.webp', alt: 'Matinee companion app review feed' })} loading="lazy" />
              </div>
              <h4 className="text-white font-bold mt-5 mb-2">The Feed</h4>
              <p className="text-[15px] text-[#9a9a9f] leading-relaxed">
                Every review the household logs, flowing into a feed the wall pulls from. It started as a way to show off my
                Letterboxd and turned into a small, honest record of what we actually watch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ THE SCOPE DECISION (honesty beat) ══ */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-4xl mx-auto">
        <div data-reveal className="eink-reveal">
          <Overline>The Hard Part</Overline>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-8 leading-tight">
            I designed it for everything. I shipped it for one thing.
          </h2>
          <div className="space-y-5 text-[17px] text-[#9a9a9f] leading-[1.8]">
            <p>
              The original spec was greedy. Matinee was going to surface my whole taste — Letterboxd <em>and</em> Untappd,
              concerts I&rsquo;d been to, books, the works. I built the architecture to handle all of it, sources as plug-ins.
            </p>
            <p>
              Then I ran the honest math on a 200-unit Kickstarter and made the call I&rsquo;d make again:
              <span className="text-white font-semibold"> one source, flawless, beats five, flaky.</span> Every extra integration
              was another feed to babysit, another way for a stranger&rsquo;s wall to show a broken frame. So I cut. Letterboxd
              only — the one I actually use every day.
            </p>
          </div>
          <div data-reveal className="eink-reveal mt-10">
            <p className="text-[11px] font-mono uppercase tracking-widest text-white/30 mb-4">Designed for · not shipped</p>
            <div className="flex flex-wrap gap-3">
              {['Untappd', 'Concert Archives', 'Belli', 'Books'].map((chip) => (
                <span key={chip} className="px-4 py-2 rounded-full border border-dashed border-white/15 text-white/30 font-mono text-[13px] line-through">
                  {chip}
                </span>
              ))}
            </div>
            <p className="text-[15px] text-[#9a9a9f] mt-5 italic">Designed for. Deliberately not shipped. That&rsquo;s the point.</p>
          </div>
        </div>
      </section>

      {/* ══ REFLECTION ══ */}
      <section className="py-16 md:py-24 px-6 md:px-12 border-t border-white/[0.05]">
        <div data-reveal className="eink-reveal max-w-3xl mx-auto text-center">
          <Overline>Reflection</Overline>
          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-8 leading-tight">
            What building a physical product taught me that software never did.
          </h2>
          <div className="space-y-5 text-[17px] text-[#9a9a9f] leading-[1.8] text-left md:text-center">
            <p>
              Software forgives you. Ship a bug, push a fix, nobody remembers. Hardware doesn&rsquo;t — every choice gets soldered
              into 200 copies you can&rsquo;t take back. That pressure made me a better editor of my own ideas.
            </p>
            <p>
              The scope cut, the dumb-hardware bet, the boring two-layer board — all of it was me learning to design for the
              version that ships and survives, not the version that demos.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-4 max-w-xl mx-auto">
            <div data-reveal className="eink-reveal">
              <h4 className="text-[12px] font-mono font-bold uppercase tracking-widest mb-3" style={{ color: GREEN }}>Technical</h4>
              <ul className="space-y-2 text-left">
                {['PCB Design (KiCad)', 'ESP32 / Embedded C', 'E-Ink & SPI', 'Python / PIL Rendering', 'Next.js + Supabase', 'Vercel Serverless'].map((s, i) => (
                  <li key={s} data-reveal className="eink-reveal text-[13px] text-[#9a9a9f] flex items-center gap-2" style={{ transitionDelay: `${i * 50}ms` }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: GREEN }} />{s}
                  </li>
                ))}
              </ul>
            </div>
            <div data-reveal className="eink-reveal" style={{ transitionDelay: '100ms' }}>
              <h4 className="text-[12px] font-mono font-bold uppercase tracking-widest mb-3 text-white/70">Judgment</h4>
              <ul className="space-y-2 text-left">
                {['Scoping & Cutting', 'Design for Manufacture', 'Cost Engineering', 'Systems Thinking', 'Product Ownership', 'Shipping Physical'].map((s, i) => (
                  <li key={s} data-reveal className="eink-reveal text-[13px] text-[#9a9a9f] flex items-center gap-2" style={{ transitionDelay: `${(i * 50) + 100}ms` }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-white/40" />{s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CONTACT CTA ══ */}
      <section className="py-16 md:py-24 text-center border-t border-white/5">
        <span className="text-[10px] font-black uppercase tracking-[0.5em] block mb-4" style={{ color: GREEN }}>GET IN TOUCH</span>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6">Want one on your wall?</h2>
        <p className="text-[#9a9a9f] text-[17px] leading-[1.8] max-w-lg mx-auto mb-10">
          Matinee&rsquo;s heading to Kickstarter. If you want to talk hardware, taste, or how a $4 chip ends up being furniture — I&rsquo;m around.
        </p>
        <button
          onClick={() => { window.location.href = `mailto:sam@sam-bloch.com`; }}
          className="group px-10 py-5 font-black uppercase text-[10px] tracking-[0.2em] rounded-full hover:brightness-110 transition-[filter,transform] shadow-xl active:scale-95 inline-flex items-center gap-3"
          style={{ background: GREEN, color: '#0a0a0a' }}
        >
          Let&rsquo;s Connect
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </section>

      {/* Footer */}
      <section className="pt-14 pb-32 text-center px-6 border-t border-white/[0.05]">
        <p className="text-[13px] font-mono text-white/30 mb-6">A cloud-connected e-ink display · matinee.ink · 2026</p>
        <button onClick={() => navigate('/projects')} className="inline-flex items-center gap-2 text-white font-medium text-sm hover:text-white/70 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </button>
      </section>
    </div>
  );
};

export default MatineeCaseStudy;
