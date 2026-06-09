import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, X, ExternalLink } from 'lucide-react';
import { useScrollReveal, CountUp, CaseStudyImage as Img } from './CaseStudyShared';

/* ─── Blueprint paper texture background ───
   A subtle architectural drafting overlay that runs behind the
   entire case study. Fine teal grid lines + corner ruler tics +
   a faint compass mark in the bottom-right corner.
   ─────────────────────────────────────────── */
const BlueprintBackground: React.FC = () => (
  <div
    aria-hidden="true"
    className="fixed inset-0 pointer-events-none z-0 opacity-[0.06]"
    style={{
      backgroundImage:
        'linear-gradient(rgba(36, 162, 167, 0.5) 1px, transparent 1px), ' +
        'linear-gradient(90deg, rgba(36, 162, 167, 0.5) 1px, transparent 1px)',
      backgroundSize: '40px 40px',
    }}
  />
);

/* ─── Drafting overline (architectural-note styled section label) ─── */
const DraftingOverline: React.FC<{ sheet: string; children: React.ReactNode }> = ({ sheet, children }) => (
  <p data-reveal className="apple-reveal text-[11px] font-mono uppercase tracking-[0.3em] text-[#24A2A7] mb-6 flex items-center gap-3">
    <span className="text-[#24A2A7]/50">{sheet}</span>
    <span className="h-px flex-1 bg-[#24A2A7]/20 max-w-[60px]" />
    <span>{children}</span>
  </p>
);

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
      className="fixed top-0 left-0 h-[2px] z-[70]"
      style={{ width: '0%', background: '#24A2A7' }}
    />
  );
};

/* ─── Stat ring with count-up (Power Room vs Ghost Room) ─── */
const RoomStatRing: React.FC<{ percent: number; size?: number; muted?: boolean }> = ({
  percent,
  size = 88,
  muted = false,
}) => {
  const [animated, setAnimated] = useState(0);
  const ref = useRef<SVGSVGElement>(null);
  const started = useRef(false);
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (animated / 100) * circ;
  const color = muted ? '#5a5a60' : '#24A2A7';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - t0) / 1400, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimated(eased * percent);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [percent]);

  return (
    <svg ref={ref} width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x={size / 2} y={size / 2 + 1} textAnchor="middle" dominantBaseline="middle" className="fill-white font-black" fontSize="18">
        {Math.round(animated)}
      </text>
      <text x={size / 2} y={size / 2 + 18} textAnchor="middle" dominantBaseline="middle" className="fill-white/40" fontSize="10">
        %
      </text>
    </svg>
  );
};

/* ─── Floor plan viewer with building tabs ─── */
const FLOOR_PLANS = [
  {
    id: 'classroom',
    label: 'Classroom Building',
    img: '/case-study/space-utilization/floor-2.webp',
    img2: '/case-study/space-utilization/floor-3.webp',
    stats: { rooms: 73, scheduled: 15, efficiency: 4.35 },
  },
  {
    id: 'olson',
    label: 'Olson Hall',
    img: '/case-study/space-utilization/floor-1.webp',
    stats: { rooms: 31, scheduled: 4, efficiency: 3.55 },
  },
  {
    id: 'chemistry',
    label: 'Chemistry Building',
    img: '/case-study/space-utilization/floor-4.webp',
    img2: '/case-study/space-utilization/floor-5.webp',
    stats: { rooms: 24, scheduled: 9, efficiency: 6.67 },
  },
];

const FloorPlanViewer: React.FC<{ onOpen: (img: { src: string; alt: string }) => void }> = ({ onOpen }) => {
  const [active, setActive] = useState(FLOOR_PLANS[0].id);
  const current = FLOOR_PLANS.find((f) => f.id === active)!;

  return (
    <div data-reveal className="apple-reveal">
      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-6 border-b border-white/[0.06] pb-4">
        {FLOOR_PLANS.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(p.id)}
            className={`px-4 py-2 text-[12px] font-mono uppercase tracking-[0.2em] transition-colors rounded-md ${
              active === p.id
                ? 'bg-[#24A2A7]/10 text-[#24A2A7] border border-[#24A2A7]/30'
                : 'text-white/50 hover:text-white/80 border border-transparent'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Building stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-2">Total Rooms</div>
          <div className="text-3xl font-black text-white">
            <CountUp end={current.stats.rooms} />
          </div>
        </div>
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-2">Scheduled</div>
          <div className="text-3xl font-black text-white">
            <CountUp end={current.stats.scheduled} />
            <span className="text-base font-normal text-white/40 ml-2">of {current.stats.rooms}</span>
          </div>
        </div>
        <div className="bg-[#24A2A7]/[0.06] border border-[#24A2A7]/20 rounded-lg p-4">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#24A2A7] mb-2">Bldg Efficiency</div>
          <div className="text-3xl font-black text-[#24A2A7]">
            <CountUp end={Math.round(current.stats.efficiency)} suffix="%" />
            <span className="text-base font-normal text-[#24A2A7]/60 ml-2">of 100%</span>
          </div>
        </div>
      </div>

      {/* Floor plan images */}
      <div className="space-y-4">
        <Img
          src={current.img}
          alt={`${current.label} floor plan with utilization color-coding`}
          caption={`${current.label} — color-coded by use (lecture, lab, office, research). Annotated efficiency scores reflect the proportion of available room-hours actually scheduled.`}
          onOpen={onOpen}
        />
        {current.img2 && (
          <Img
            src={current.img2}
            alt={`${current.label} second floor plan`}
            caption={`${current.label} — additional floor.`}
            onOpen={onOpen}
          />
        )}
      </div>
    </div>
  );
};

/* ─── YouTube embed (lazy-loaded with poster) ─── */
const YouTubeEmbed: React.FC<{ videoId: string; title: string }> = ({ videoId, title }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[#24A2A7]/20 bg-black">
      {loaded ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="group absolute inset-0 w-full h-full flex items-center justify-center"
          aria-label={`Play: ${title}`}
        >
          <img
            src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-[#24A2A7] flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl shadow-[#24A2A7]/30">
              <svg className="w-8 h-8 fill-black translate-x-[2px]" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/80">Play Decision Reveal</span>
          </div>
        </button>
      )}
    </div>
  );
};

/* ─── Lightbox ─── */
const Lightbox: React.FC<{
  image: { src: string; alt: string } | null;
  onClose: () => void;
}> = ({ image, onClose }) => {
  useEffect(() => {
    if (!image) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handle);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handle);
      document.body.style.overflow = '';
    };
  }, [image, onClose]);

  if (!image) return null;
  return (
    <div
      className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-6 cursor-zoom-out animate-in fade-in duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-[color,background-color] z-[201]"
        aria-label="Close"
      >
        <X size={20} />
      </button>
      <img
        src={image.src}
        alt={image.alt}
        className="max-w-full max-h-full object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN CASE STUDY COMPONENT
   ═══════════════════════════════════════════════════════════ */
const SpaceUtilizationCaseStudy: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useScrollReveal();
  const [enlargedImage, setEnlargedImage] = useState<{ src: string; alt: string } | null>(null);

  const downloadReport = () => {
    const link = document.createElement('a');
    link.href = '/SpaceUtilization_Final_Report.pdf';
    link.download = 'Space_Utilization_Evaluation_UoP.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#24A2A7]/30 font-sans overflow-x-clip relative">
      <BlueprintBackground />
      <ScrollProgress />
      <Lightbox image={enlargedImage} onClose={() => setEnlargedImage(null)} />

      {/* Back to archive */}
      <button
        onClick={() => navigate('/projects')}
        className="fixed top-8 left-8 md:left-12 z-[60] flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#24A2A7] transition-[color,border-color,transform] bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/5 hover:border-[#24A2A7]/40 shadow-xl active:scale-95 no-print"
      >
        <ArrowLeft size={14} />
        Back to Archive
      </button>

      {/* Download FAB */}
      <button
        onClick={downloadReport}
        className="fixed bottom-8 right-8 z-[60] flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-black bg-[#24A2A7] hover:brightness-110 transition-[filter,transform] px-6 py-4 rounded-full shadow-xl active:scale-95 no-print"
        title="Download the Final Report PDF"
      >
        <Download size={14} />
        <span className="hidden sm:inline">Full Report PDF</span>
        <span className="sm:hidden">PDF</span>
      </button>

      <main className="relative z-10">

        {/* ════════════════════════════════════════
            SECTION 1 — HERO
           ════════════════════════════════════════ */}
        <section className="min-h-screen flex items-center justify-center px-6 md:px-12 py-32 relative">
          <div className="max-w-5xl mx-auto w-full">
            <p data-reveal className="apple-reveal text-[11px] font-mono uppercase tracking-[0.4em] text-[#24A2A7]/80 mb-8">
              Project · 2026 · University of the Pacific
            </p>
            <h1 data-reveal className="apple-reveal text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
              Space<br />
              <span className="text-[#24A2A7]">Utilization</span><br />
              Evaluation.
            </h1>
            <p data-reveal className="apple-reveal text-xl md:text-2xl text-gray-400 leading-relaxed max-w-3xl mb-10">
              A strategic consulting engagement that gave University of the Pacific the data it needed to launch
              a new medical school using existing campus capacity, without building a single new classroom.
            </p>

            {/* Project meta strip */}
            <div data-reveal className="apple-reveal grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/[0.06]">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-2">Sponsor</div>
                <div className="text-sm text-white">President Callahan</div>
                <div className="text-xs text-white/50">Physical Plant</div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-2">Scope</div>
                <div className="text-sm text-white">Classroom Bldg</div>
                <div className="text-sm text-white">Chemistry Bldg</div>
                <div className="text-sm text-white">Olson Hall</div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-2">Data Range</div>
                <div className="text-sm text-white">Fall 2023</div>
                <div className="text-sm text-white">through Spring 2026</div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-2">Course</div>
                <div className="text-sm text-white">LEAD 259</div>
                <div className="text-xs text-white/50">Evaluation in Organizations</div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 2 — THE BRIEF
           ════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-24 relative">
          <div className="max-w-4xl mx-auto">
            <DraftingOverline sheet="Sheet 01 / 06">The Brief</DraftingOverline>
            <h2 data-reveal className="apple-reveal text-3xl md:text-5xl font-black tracking-tighter mb-10">
              "Can we launch a medical school without building one?"
            </h2>
            <div data-reveal className="apple-reveal space-y-6 text-lg text-gray-300 leading-relaxed">
              <p>
                In early 2026, University of the Pacific was actively scoping the launch of a new medical school.
                The strategic question was not whether the program had demand. It was whether the existing
                campus footprint could absorb it.
              </p>
              <p>
                President Callahan's office and the Physical Plant team asked our three-person consulting team
                to find out. The brief was specific: stop guessing from anecdote, start measuring from data,
                and answer a single question with rigor. Could the existing Classroom Building, Chemistry
                Building, and Olson Hall hold a medical school program without new construction?
              </p>
              <p className="text-[#24A2A7] font-medium">
                The cost difference between "yes" and "no" was eight figures.
              </p>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 3 — THE METHOD
           ════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-24 bg-white/[0.015] border-y border-white/[0.04] relative">
          <div className="max-w-5xl mx-auto">
            <DraftingOverline sheet="Sheet 02 / 06">Methodology</DraftingOverline>
            <h2 data-reveal className="apple-reveal text-3xl md:text-5xl font-black tracking-tighter mb-10">
              Cross-Reference Analysis.
            </h2>
            <p data-reveal className="apple-reveal text-lg text-gray-300 mb-12 max-w-3xl leading-relaxed">
              We layered scheduling data over physical asset data across six semesters, then built a composite
              Efficiency Score that combines seat-fill utilization (65% weight) and scheduled intensity (35% weight),
              normalized within space type so labs are compared to labs and lecture rooms to lecture rooms.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '01', title: 'Instructional Utilization', body: 'Registrar / EMS feeds: room assignments, scheduled days and times, enrollment counts. Used to derive peak occupancy and seat-fill rates.' },
                { num: '02', title: 'Space Classification', body: 'Registrar + Academic Affairs: lab vs. lecture vs. office vs. research designations. Distinguishes specialized from general-purpose inventory.' },
                { num: '03', title: 'Administrative Load', body: 'Dean\'s Office + Department Chairs: faculty and staff room assignments. Assesses office density and the administrative footprint of each building.' },
              ].map((s) => (
                <div data-reveal key={s.num} className="apple-reveal bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 transition-colors hover:border-[#24A2A7]/20">
                  <div className="text-[10px] font-mono text-[#24A2A7] mb-3 tracking-[0.3em]">{s.num} · DATA STREAM</div>
                  <div className="text-lg font-bold text-white mb-3">{s.title}</div>
                  <p className="text-sm text-gray-400 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>

            <div data-reveal className="apple-reveal mt-12 p-6 border-l-2 border-[#24A2A7]/40 bg-[#24A2A7]/[0.03]">
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#24A2A7] mb-3">Framework Grounding</div>
              <p className="text-base text-gray-300 leading-relaxed">
                The evaluation followed Patton's <em>utilization-focused</em> model (Patton, 1997). Every methodological
                choice was anchored to the specific decision President Callahan needed to make: build, retrofit, or
                reschedule. Engagement structure drew from Russ-Eft &amp; Preskill's Chapter 14 and 16 communication
                frameworks, replacing slide-deck handoffs with two facilitated working sessions.
              </p>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 4 — THE FLOOR PLAN
           ════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-24 relative">
          <div className="max-w-6xl mx-auto">
            <DraftingOverline sheet="Sheet 03 / 06">The Centerpiece</DraftingOverline>
            <h2 data-reveal className="apple-reveal text-3xl md:text-5xl font-black tracking-tighter mb-6">
              The floor plan,<br /><span className="text-[#24A2A7]">color-coded by truth.</span>
            </h2>
            <p data-reveal className="apple-reveal text-lg text-gray-400 mb-12 max-w-3xl leading-relaxed">
              We annotated every room across three buildings by function (lecture, lab, office, research) and overlaid
              its efficiency score. The pattern surfaced immediately. The campus was not full. It was scheduled into a
              narrow corridor of rooms.
            </p>

            <FloorPlanViewer onOpen={setEnlargedImage} />
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 5 — THE THREE FINDINGS
           ════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-24 bg-white/[0.015] border-y border-white/[0.04] relative">
          <div className="max-w-6xl mx-auto">
            <DraftingOverline sheet="Sheet 04 / 06">Findings</DraftingOverline>
            <h2 data-reveal className="apple-reveal text-3xl md:text-5xl font-black tracking-tighter mb-16">
              Three findings that<br />reframed the question.
            </h2>

            <div className="space-y-16">
              {/* Finding 1 — Capacity exists */}
              <div data-reveal className="apple-reveal grid md:grid-cols-[200px_1fr] gap-10 items-start">
                <div className="flex flex-col items-start gap-2">
                  <RoomStatRing percent={4} />
                  <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#24A2A7]/70">Bldg Efficiency</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#24A2A7] mb-3">Finding 01</div>
                  <h3 className="text-2xl md:text-3xl font-black mb-4 leading-tight">
                    The capacity is already there.
                  </h3>
                  <p className="text-lg text-gray-300 leading-relaxed mb-3">
                    Of <CountUp end={73} /> classrooms in the Classroom Building, only <CountUp end={15} /> were
                    scheduled in Spring 2026. Building-level efficiency clocked at <span className="text-[#24A2A7] font-bold">4.35%</span>.
                    Olson Hall ran at 3.55%, Chemistry at 6.67%. The space exists. It just isn't being used.
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    The medical school did not require new construction. It required a different allocation of the
                    space the university already had.
                  </p>
                </div>
              </div>

              {/* Finding 2 — Peak window */}
              <div data-reveal className="apple-reveal grid md:grid-cols-[200px_1fr] gap-10 items-start">
                <div className="flex flex-col items-start gap-2">
                  <div className="w-[88px] h-[88px] rounded-lg border border-[#24A2A7]/30 bg-[#24A2A7]/[0.05] flex flex-col items-center justify-center">
                    <div className="text-2xl font-black text-[#24A2A7]">M-Th</div>
                    <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#24A2A7]/70 mt-1">10a-2p</div>
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#24A2A7]/70">Peak Window</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#24A2A7] mb-3">Finding 02</div>
                  <h3 className="text-2xl md:text-3xl font-black mb-4 leading-tight">
                    Peak load lives in a narrow window.
                  </h3>
                  <p className="text-lg text-gray-300 leading-relaxed mb-3">
                    Day-of-week by hour heatmaps revealed that instruction concentrates on Monday through Thursday,
                    10 AM to 2 PM. Outside that window, even the workhorse rooms sit largely empty. The med school
                    could occupy the off-peak hours without displacing a single existing class.
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Any swing-space plan needed to absorb the peak window specifically, not just match total weekly
                    hours in aggregate.
                  </p>
                </div>
              </div>

              {/* Finding 3 — Power Rooms vs Ghost Rooms */}
              <div data-reveal className="apple-reveal">
                <div className="grid md:grid-cols-[200px_1fr] gap-10 items-start mb-10">
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex gap-2">
                      <RoomStatRing percent={49} size={64} />
                      <RoomStatRing percent={3} size={64} muted />
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#24A2A7]/70">Power vs Ghost</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#24A2A7] mb-3">Finding 03</div>
                    <h3 className="text-2xl md:text-3xl font-black mb-4 leading-tight">
                      Power Rooms and Ghost Rooms,<br />in the same building.
                    </h3>
                    <p className="text-lg text-gray-300 leading-relaxed mb-3">
                      Olson Hall 120 ran at 48.7% efficiency, hosting 25.75 hours of weekly instruction. Olson Hall 100,
                      the same building, same square footage, ran at <span className="text-white font-bold">2.8%</span>. One meeting. A 0.15
                      seat-fill. The difference is not architecture. It's scheduling decisions.
                    </p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Empty rooms are a leadership problem, not a real estate problem.
                    </p>
                  </div>
                </div>

                {/* Room comparison grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
                  {/* Power Rooms */}
                  <div className="col-span-2 md:col-span-2">
                    <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#24A2A7] mb-3">Power Rooms · Top 4</div>
                    <div className="space-y-2">
                      {[
                        { room: 'Olson Hall 120', eff: 48.7, hrs: 25.75 },
                        { room: 'Classroom 104', eff: 45.6, hrs: 25.75 },
                        { room: 'Classroom 203', eff: 44.8, hrs: 29.25 },
                        { room: 'Olson Hall 114', eff: 42.0, hrs: 23.83 },
                      ].map((r) => (
                        <div key={r.room} className="flex items-center justify-between bg-[#24A2A7]/[0.04] border border-[#24A2A7]/15 rounded-md px-4 py-3">
                          <div>
                            <div className="text-sm font-bold text-white">{r.room}</div>
                            <div className="text-[11px] text-white/50">{r.hrs} hrs/wk</div>
                          </div>
                          <div className="text-xl font-black text-[#24A2A7]">{r.eff}%</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ghost Rooms */}
                  <div className="col-span-2 md:col-span-2">
                    <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40 mb-3">Ghost Rooms · Bottom 4</div>
                    <div className="space-y-2">
                      {[
                        { room: 'Olson Hall 100', eff: 2.8, hrs: 0.5 },
                        { room: 'Classroom 115', eff: 6.3, hrs: 1.5 },
                        { room: 'Classroom 201', eff: 26.9, hrs: 3.0 },
                        { room: 'Classroom 232', eff: 32.7, hrs: 4.5 },
                      ].map((r) => (
                        <div key={r.room} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.06] rounded-md px-4 py-3">
                          <div>
                            <div className="text-sm font-bold text-white/80">{r.room}</div>
                            <div className="text-[11px] text-white/40">{r.hrs} hrs/wk</div>
                          </div>
                          <div className="text-xl font-black text-white/60">{r.eff}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 6 — FROM SPREADSHEET TO STORY
           ════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-24 relative">
          <div className="max-w-5xl mx-auto">
            <DraftingOverline sheet="Sheet 05 / 06">The Analytical Journey</DraftingOverline>
            <h2 data-reveal className="apple-reveal text-3xl md:text-5xl font-black tracking-tighter mb-6">
              From spreadsheet<br />to story.
            </h2>
            <p data-reveal className="apple-reveal text-lg text-gray-400 mb-12 max-w-3xl leading-relaxed">
              Three semesters of registrar data. Tens of thousands of section records. The path from a raw export
              to a finding the President's office could act on ran through three stages.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                { stage: '01', title: 'Raw Data', body: '14,000+ section records across six semesters, joined to physical asset data by room code and building.', meta: 'Registrar · EMS · Banner' },
                { stage: '02', title: 'Cleaned & Joined', body: 'Composite Efficiency Score per room (65% seat-fill + 35% scheduled intensity), normalized within space type.', meta: 'Cross-Reference Analysis' },
                { stage: '03', title: 'Story', body: 'Three findings, three actions, one institutional decision: the medical school can launch using existing space.', meta: 'Findings · Recommendations' },
              ].map((s) => (
                <div data-reveal key={s.stage} className="apple-reveal bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
                  <div className="text-4xl font-black text-[#24A2A7] mb-4">{s.stage}</div>
                  <div className="text-lg font-bold text-white mb-3">{s.title}</div>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">{s.body}</p>
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#24A2A7]/60">{s.meta}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 7 — THE TEAM
           ════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-24 bg-white/[0.015] border-y border-white/[0.04] relative">
          <div className="max-w-5xl mx-auto">
            <DraftingOverline sheet="Sheet 06 / 06">The Team</DraftingOverline>
            <h2 data-reveal className="apple-reveal text-3xl md:text-5xl font-black tracking-tighter mb-12">
              Three consultants.
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Sam Bloch',
                  role: 'Consultant',
                  bio: 'Owned project framing, stakeholder management, and the synthesis of findings into the President\'s briefing.',
                  highlight: true,
                },
                {
                  name: 'Samuel Cogo',
                  role: 'Consultant',
                  bio: 'Owned the floor plan analysis, room-by-room data joins, and the recommendations modeling.',
                },
                {
                  name: 'Veronica Henderson',
                  role: 'Consultant',
                  bio: 'Led stakeholder interviews, ran the facilitated working sessions, and synthesized qualitative themes.',
                },
              ].map((p) => (
                <div data-reveal key={p.name}
                  className={`apple-reveal rounded-xl p-6 border ${
                    p.highlight
                      ? 'bg-[#24A2A7]/[0.05] border-[#24A2A7]/30'
                      : 'bg-white/[0.02] border-white/[0.06]'
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#24A2A7] mb-3">{p.role}</div>
                  <div className="text-2xl font-black text-white mb-3">{p.name}</div>
                  <p className="text-sm text-gray-400 leading-relaxed">{p.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 8 — THE DECISION (YOUTUBE)
           ════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-24 relative">
          <div className="max-w-5xl mx-auto">
            <DraftingOverline sheet="Outcome">The Decision</DraftingOverline>
            <h2 data-reveal className="apple-reveal text-3xl md:text-5xl font-black tracking-tighter mb-6">
              And then,<br /><span className="text-[#24A2A7]">they did it.</span>
            </h2>
            <p data-reveal className="apple-reveal text-lg text-gray-400 mb-10 max-w-3xl leading-relaxed">
              In the months after our final briefing, University of the Pacific moved forward with the medical school.
              The space evaluation didn't make the decision alone, but it gave the board the evidence base it needed
              to say yes without a capital expansion.
            </p>

            <div data-reveal className="apple-reveal">
              <YouTubeEmbed
                videoId="eCsCif0z2mM"
                title="University of the Pacific announces medical school"
              />
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 9 — REFLECTION
           ════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-24 bg-white/[0.015] border-t border-white/[0.04] relative">
          <div className="max-w-3xl mx-auto">
            <DraftingOverline sheet="Reflection">What this taught me</DraftingOverline>
            <h2 data-reveal className="apple-reveal text-3xl md:text-5xl font-black tracking-tighter mb-10">
              Evaluation as a leadership skill.
            </h2>
            <div data-reveal className="apple-reveal space-y-6 text-lg text-gray-300 leading-relaxed">
              <p>
                I came into this project thinking of evaluation as an analytical discipline. I left thinking of it
                as a leadership one. The hardest part of the engagement was not running the numbers. It was
                designing the conversations around them.
              </p>
              <p>
                Patton's utilization principle kept us honest the whole way. Every methodological choice we made
                was tested against the same question: will this help the President decide, or is it just rigor for
                rigor's sake? Most analyses I had done before this one failed that test silently. This one couldn't.
              </p>
              <p>
                The other thing I learned, and the thing I will carry into the rest of my career, is that data
                only matters when the people who own the decision feel like they discovered it themselves.
                Russ-Eft &amp; Preskill's chapters on facilitated reporting (rather than slide-deck handoffs) were
                the difference between findings that sat in a binder and findings that funded a medical school.
              </p>
            </div>

            <div data-reveal className="apple-reveal mt-12 pt-8 border-t border-white/[0.06]">
              <p className="text-sm text-white/40 italic">
                Pacific Medical School Space Utilization Evaluation · LEAD 259 · University of the Pacific · 2026.
                Conducted under the supervision of the LEAD 259 instructional team and in collaboration with the
                Office of the President and University Physical Plant.
              </p>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            CLOSING CTA
           ════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-24 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 data-reveal className="apple-reveal text-3xl md:text-4xl font-black tracking-tighter mb-8">
              Want the full report?
            </h2>
            <p data-reveal className="apple-reveal text-gray-400 mb-10">
              The complete 60-page final report with methodology, findings, recommendations, and the
              annotated floor plans for all three buildings.
            </p>
            <button
              onClick={downloadReport}
              className="group inline-flex items-center gap-3 px-10 py-5 bg-[#24A2A7] text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-full hover:brightness-110 transition-[filter,transform] shadow-xl active:scale-95"
            >
              <Download size={14} />
              Download Final Report
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <div className="mt-12">
              <button
                onClick={() => navigate('/projects')}
                className="inline-flex items-center gap-2 text-white font-medium text-sm hover:text-[#24A2A7] transition-colors duration-300"
              >
                <ArrowLeft size={14} /> Back to all projects
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SpaceUtilizationCaseStudy;
