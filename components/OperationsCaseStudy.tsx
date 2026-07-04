import React, { useState, useEffect, useRef } from 'react';
import { useFooterAwareBottom } from '../utils/useFooterAwareBottom';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, RotateCcw } from 'lucide-react';
import { useScrollReveal, CountUp } from './CaseStudyShared';

/* Operations theme — "mission control" status green, calmer than Matinee's signal green */
const GREEN = '#4cc38a';

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

/* ─── Overline ─── */
const Overline: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p data-reveal className="ops-reveal text-[13px] font-semibold uppercase tracking-[0.2em] mb-6 font-mono" style={{ color: GREEN }}>
    {children}
  </p>
);

/* ════════════════════════════════════════════════════════════════════════
   SITE CLOCKS — decorative strip of ten unnamed sites.
   Deliberately fictional: no city names, and the offsets are arbitrary
   minute values that do not map to real time zones. "10 global sites" is
   public; which ten is not, and this strip must never imply otherwise.
   ════════════════════════════════════════════════════════════════════════ */
const FAKE_OFFSETS_MIN = [173, -412, 641, -88, 322, -257, 509, 47, -531, 218];

const SiteClocks: React.FC = () => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setNow(Date.now()), 10_000);
    return () => clearInterval(id);
  }, []);
  const fmt = (offsetMin: number) => {
    const d = new Date(now + offsetMin * 60_000);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };
  return (
    <div aria-hidden="true" className="w-full overflow-x-auto no-scrollbar border-b border-white/[0.05]">
      <div className="flex gap-6 md:gap-8 px-6 py-3 min-w-max mx-auto justify-center">
        {FAKE_OFFSETS_MIN.map((off, i) => (
          <div key={i} className="flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] text-white/30 whitespace-nowrap">
            <span>SITE {String(i + 1).padStart(2, '0')}</span>
            <span className="text-white/50 tabular-nums">{fmt(off)}</span>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN, boxShadow: `0 0 6px ${GREEN}66` }} />
            <span style={{ color: `${GREEN}99` }}>NOMINAL</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   THE CALIBRATION EXERCISE — the signature interaction.
   The visitor rates four deliberately ambiguous color swatches against a
   short rubric, then sees how far they drifted from the calibrated
   standard. Zero Trust & Safety content by design: the point is the
   feeling of drift, not the subject matter.
   ════════════════════════════════════════════════════════════════════════ */
const SWATCHES = [
  { color: '#2563eb', name: 'Swatch A', standard: 5, note: 'Cobalt. The rubric calls this blue-blue.' },
  { color: '#14b8a6', name: 'Swatch B', standard: 2, note: 'Teal leans green — rule 2 caps it, and the lean is strong.' },
  { color: '#8b5cf6', name: 'Swatch C', standard: 2, note: 'Violet. Rule 3 says subtract for purple — this one leans hard.' },
  { color: '#60a5fa', name: 'Swatch D', standard: 4, note: 'Light, but unmistakably blue. Pale is not a penalty in the rubric.' },
];

const CalibrationExercise: React.FC = () => {
  const [ratings, setRatings] = useState<(number | null)[]>([null, null, null, null]);
  const [revealed, setRevealed] = useState(false);
  const complete = ratings.every((r) => r !== null);

  const drift = revealed
    ? ratings.reduce((sum: number, r, i) => sum + Math.abs((r ?? 0) - SWATCHES[i].standard), 0)
    : 0;

  const verdict =
    drift === 0
      ? 'Zero drift. Perfectly calibrated — and genuinely rare.'
      : drift <= 3
        ? `You drifted ${drift} point${drift === 1 ? '' : 's'} across four items. Small — until you multiply it by 800 raters, ten sites, and every day of the year. That multiplication is why calibration programs exist.`
        : `You drifted ${drift} points across four items — with a three-rule rubric and no time pressure. That drift is completely normal. It is also the entire problem.`;

  const reset = () => { setRatings([null, null, null, null]); setRevealed(false); };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-10">
      {/* The rubric */}
      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] mb-3" style={{ color: GREEN }}>Rating Rubric v1.0</p>
        <p className="text-white font-bold mb-3">Rate each swatch: how blue is it? (1 = not blue, 5 = fully blue)</p>
        <ol className="space-y-1 text-[15px] text-[#9a9a9f] font-mono list-decimal list-inside">
          <li>Blue means blue-blue: sky, cobalt, navy.</li>
          <li>If it leans green, it caps at 3.</li>
          <li>If it leans purple, subtract at least 1.</li>
        </ol>
      </div>

      {/* The swatches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {SWATCHES.map((s, i) => (
          <div key={s.name} className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl flex-shrink-0 border border-white/10" style={{ background: s.color }} />
            <div className="flex-1">
              <p className="text-[12px] font-mono text-white/50 mb-2">{s.name}</p>
              <div className="flex gap-1.5" role="group" aria-label={`Rate ${s.name}`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => { if (!revealed) setRatings((r) => r.map((v, j) => (j === i ? n : v))); }}
                    disabled={revealed}
                    className="w-9 h-9 rounded-lg font-mono text-sm font-bold border transition-colors disabled:cursor-default"
                    style={ratings[i] === n
                      ? { background: GREEN, color: '#0b0d10', borderColor: GREEN }
                      : { background: 'transparent', color: 'rgba(255,255,255,0.45)', borderColor: 'rgba(255,255,255,0.12)' }}
                    aria-pressed={ratings[i] === n}
                  >
                    {n}
                  </button>
                ))}
              </div>
              {revealed && (
                <p className="text-[12px] text-[#9a9a9f] mt-2 font-mono">
                  <span style={{ color: GREEN }}>Standard: {SWATCHES[i].standard}</span>
                  {ratings[i] !== SWATCHES[i].standard && <span className="text-amber-400/80"> · you said {ratings[i]}</span>}
                  {' — '}{s.note}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reveal / verdict */}
      {!revealed ? (
        <button
          onClick={() => complete && setRevealed(true)}
          disabled={!complete}
          className="px-7 py-4 rounded-full font-mono text-[12px] font-bold uppercase tracking-[0.2em] transition-transform active:scale-95 disabled:opacity-40"
          style={{ background: GREEN, color: '#0b0d10' }}
        >
          {complete ? 'Compare to the standard' : 'Rate all four to continue'}
        </button>
      ) : (
        <div className="border-t border-white/[0.08] pt-6">
          <p className="text-lg md:text-xl text-white font-bold leading-relaxed mb-3">{verdict}</p>
          <p className="text-[15px] text-[#9a9a9f] leading-relaxed mb-5">
            Notice what just happened: the rubric felt clear until you had to apply it. That gap — between a
            standard as written and a standard as applied — is where quality programs live. My job is closing it,
            at scale, without ever meeting most of the people doing the rating.
          </p>
          <button onClick={reset} className="inline-flex items-center gap-2 text-[12px] font-mono uppercase tracking-widest text-white/50 hover:text-white transition-colors">
            <RotateCcw className="w-3.5 h-3.5" /> Run it again
          </button>
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   OperationsCaseStudy — Main component
   ════════════════════════════════════════════════════════════════════════ */
const OperationsCaseStudy: React.FC = () => {
  const navigate = useNavigate();
  const fabBottom = useFooterAwareBottom();
  const containerRef = useScrollReveal();

  const handleDownloadPDF = async () => {
    const { generateCaseStudyPdfHtml } = await import('../utils/generateCaseStudyPdf');
    const html = generateCaseStudyPdfHtml('operations', window.location.origin);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank', 'width=900,height=700');
    if (win) { win.onload = () => URL.revokeObjectURL(url); } else { URL.revokeObjectURL(url); }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0b0d10] text-white font-sans overflow-x-clip">
      <style>{`
        [data-reveal] { opacity: 0; transform: translateY(30px); transition: opacity .8s cubic-bezier(.25,.46,.45,.94), transform .8s cubic-bezier(.25,.46,.45,.94); }
        [data-reveal].revealed { opacity: 1; transform: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
        .ops-grid { background-image: linear-gradient(rgba(76,195,138,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(76,195,138,.04) 1px, transparent 1px); background-size: 40px 40px; }
        @media (prefers-reduced-motion: reduce) {
          [data-reveal] { transition: none !important; opacity: 1; transform: none; }
        }
      `}</style>

      <ScrollProgress />

      {/* Back button */}
      <button onClick={() => navigate('/projects')}
        className="fixed top-8 left-8 md:left-12 z-[60] flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/5 shadow-xl active:scale-95 no-print"
        aria-label="Back to projects">
        <ArrowLeft className="w-4 h-4" /> Back to Archive
      </button>

      {/* PDF FAB */}
      <div className="fixed right-6 z-[70] no-print" style={{ bottom: fabBottom }}>
        <button onClick={handleDownloadPDF}
          className="h-14 px-5 rounded-full flex items-center justify-center gap-2 shadow-2xl transition-transform hover:scale-105 active:scale-95"
          style={{ backgroundColor: '#24A2A7', color: '#0a0a0a' }} aria-label="Download case study PDF">
          <Download className="w-6 h-6" />
          <span className="text-xs font-black uppercase tracking-widest">PDF</span>
        </button>
      </div>

      {/* ══ HERO ══ */}
      <header className="relative min-h-screen flex flex-col overflow-hidden">
        <div className="pt-28 md:pt-24">
          <SiteClocks />
        </div>
        <div className="relative flex-1 flex flex-col items-center justify-center text-center px-6 ops-grid">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_#0b0d10_100%)]" />
          <div className="relative z-10 max-w-4xl py-16">
            <p className="text-[13px] font-mono uppercase tracking-[0.3em] mb-6" style={{ color: `${GREEN}99` }}>
              Operations Console · Access Level: Public
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[0.9] tracking-tight mb-10 text-white">
              Operations at Scale
            </h1>
            <p className="text-2xl md:text-4xl font-bold leading-snug tracking-tight max-w-3xl mx-auto text-white/90">
              The specifics of this work are confidential, and <span style={{ color: GREEN }}>keeping them that way is part of the job.</span>
            </p>
            <p className="text-base md:text-lg text-white/40 max-w-xl mx-auto leading-relaxed mt-8">
              An essay on the craft of running very large operations — Trust &amp; Safety at YouTube (Google) —
              told at the altitude discretion allows. The specifics stay inside. The thinking is mine to share.
            </p>
          </div>
        </div>
        <div className="pb-12 flex justify-center">
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent to-transparent" style={{ backgroundImage: `linear-gradient(to bottom, transparent, ${GREEN}4d, transparent)` }} />
        </div>
      </header>

      {/* ══ STATS WALL ══ */}
      <section className="py-14 md:py-20 px-6 border-y border-white/[0.05]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { end: 10, suffix: '', label: 'Global sites, one standard' },
            { end: 800, suffix: '+', label: 'Moderators in scope' },
            { end: 45, suffix: '%', label: 'Fewer processing errors (Legal Ops)' },
            { end: 20, suffix: '%', label: 'Reporting efficiency gained' },
          ].map((s, i) => (
            <div key={s.label} data-reveal className="ops-reveal" style={{ transitionDelay: `${i * 100}ms` }}>
              <p className="text-4xl md:text-5xl font-mono font-bold tabular-nums" style={{ color: GREEN }}>
                <CountUp end={s.end} suffix={s.suffix} />
              </p>
              <p className="text-[12px] font-mono text-[#8a8a8f] uppercase tracking-wider mt-3 leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-[11px] font-mono text-white/25 mt-8 max-w-lg mx-auto">
          Every number on this page is already public on my resume. That is the rule this page is built on.
        </p>
      </section>

      {/* ══ WHY OPS ══ */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-4xl mx-auto">
        <div data-reveal className="ops-reveal">
          <Overline>Why Operations</Overline>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-8 leading-tight">
            I fell into operations. I stayed on purpose.
          </h2>
          <div className="space-y-5 text-[17px] text-[#9a9a9f] leading-[1.8]">
            <p>
              Nobody grows up dreaming about quality frameworks. I landed in operations sideways — and then discovered
              it's where my favorite kind of problem lives: <span className="text-white">systems design with people inside it</span>.
              Code does what you tell it. An operation is hundreds of humans across ten sites, a policy that keeps evolving,
              and a queue that never sleeps — and it still has to produce one consistent, defensible answer, every time.
            </p>
            <p>
              Making that happen quietly is a craft. When it's done well, nobody notices, which is exactly the point —
              the best compliment an operation can get is silence. This page is about that craft: the parts I can show,
              from the work I mostly can't.
            </p>
          </div>
        </div>
      </section>

      {/* ══ HUMAN TOOLS ══ */}
      <section className="py-16 md:py-24 px-6 md:px-12 border-t border-white/[0.05]">
        <div data-reveal className="ops-reveal max-w-4xl mx-auto">
          <Overline>The Craft · 01</Overline>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-8 leading-tight">
            The tools people actually use are designed around the people.
          </h2>
          <div className="space-y-5 text-[17px] text-[#9a9a9f] leading-[1.8]">
            <p>
              Most operational tooling is designed around the process and inflicted on the humans. I work the other way:
              watch where people actually stumble, then design the tool around the stumble. It's design thinking applied
              somewhere unglamorous — not a product launch, a workflow — and that's precisely where it pays off, because
              a small amount of friction multiplied by hundreds of people and thousands of repetitions is not small.
            </p>
            <p>
              The clearest proof I can share: I rebuilt an error-management workflow for legal operations, and internal
              processing errors fell <span className="font-bold" style={{ color: GREEN }}>45%</span>. The insight wasn't
              a clever algorithm. It was sitting with how errors actually happened and refusing to blame the people for
              a process that made errors easy.
            </p>
          </div>
        </div>
      </section>

      {/* ══ CALIBRATION + EXERCISE ══ */}
      <section className="py-16 md:py-24 px-6 md:px-12 border-t border-white/[0.05] ops-grid">
        <div className="max-w-4xl mx-auto">
          <div data-reveal className="ops-reveal mb-12">
            <Overline>The Craft · 02</Overline>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-8 leading-tight">
              One standard is easy. One standard across ten sites is the job.
            </h2>
            <div className="space-y-5 text-[17px] text-[#9a9a9f] leading-[1.8]">
              <p>
                Here's the uncomfortable truth of quality work: a standard is not what's written in the document.
                It's what hundreds of different people, in different countries, with different first languages,
                actually do with the document at 3 a.m. their time. Those two things drift apart the moment the
                ink dries — and the drift compounds. Calibration is the discipline of pulling them back together,
                continuously, without ever being in the room.
              </p>
              <p>
                It sounds abstract until you feel it. So feel it — takes about thirty seconds:
              </p>
            </div>
          </div>
          <div data-reveal className="ops-reveal">
            <CalibrationExercise />
          </div>
        </div>
      </section>

      {/* ══ METRICS ══ */}
      <section className="py-16 md:py-24 px-6 md:px-12 border-t border-white/[0.05]">
        <div data-reveal className="ops-reveal max-w-4xl mx-auto">
          <Overline>The Craft · 03</Overline>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-8 leading-tight">
            You get exactly what you measure. Choose carefully.
          </h2>
          <div className="space-y-5 text-[17px] text-[#9a9a9f] leading-[1.8]">
            <p>
              Metrics are steering wheels, not report cards. Measure speed alone and quality quietly erodes; measure
              quality alone and the queue grows; measure both without context and people optimize the number instead
              of the outcome. Designing a quality metric is designing behavior — which means the metric designer holds
              more influence over the operation than almost anyone in it, and had better take that seriously.
            </p>
            <p>
              I build the instruments too: custom SQL dashboards that surface where performance actually bottlenecks,
              built to answer questions instead of decorating slides. One rebuild improved reporting efficiency by{' '}
              <span className="font-bold" style={{ color: GREEN }}>20%</span> — which, in an operation, means decisions
              land a day earlier, every day, forever.
            </p>
          </div>
        </div>
      </section>

      {/* ══ CHANGE ══ */}
      <section className="py-16 md:py-24 px-6 md:px-12 border-t border-white/[0.05]">
        <div data-reveal className="ops-reveal max-w-4xl mx-auto">
          <Overline>The Craft · 04</Overline>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-8 leading-tight">
            The system can't stop while you change it.
          </h2>
          <div className="space-y-5 text-[17px] text-[#9a9a9f] leading-[1.8]">
            <p>
              Operational change has a constraint most change frameworks politely ignore: the queue doesn't pause for
              your rollout. Every improvement ships into a system that is already running at full speed, staffed by
              people who have a job to do today. So change becomes a craft of sequencing — pilot small, calibrate the
              pilots, absorb the lessons, then scale the version that survived contact with reality. Rolled out across
              ten sites, a change isn't one change; it's ten local changes wearing one name, and each site's context
              has to be respected for the standard to hold.
            </p>
            <p>
              The newest chapter of that work is moving safety upstream — integrating generative AI into moderation
              pipelines so problems get caught earlier in the product lifecycle instead of cleaned up after the fact.
              Same craft, new instrument: the hard part still isn't the technology. It's changing a running system
              without dropping what it carries.
            </p>
          </div>
        </div>
      </section>

      {/* ══ REFLECTION ══ */}
      <section className="py-16 md:py-24 px-6 md:px-12 border-t border-white/[0.05]">
        <div data-reveal className="ops-reveal max-w-3xl mx-auto text-center">
          <Overline>Reflection</Overline>
          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-8 leading-tight">
            The best operations work is invisible. That's the point — and the price.
          </h2>
          <div className="space-y-5 text-[17px] text-[#9a9a9f] leading-[1.8] text-left md:text-center">
            <p>
              Builders get to show the thing. Operators get to show the absence of disasters — which looks, from the
              outside, like nothing. I've made peace with that trade, because the discipline it buys shows up everywhere
              else I work: it's why Matinee shipped scoped instead of sprawling, why Level Up's course ran on
              infrastructure that never made the syllabus, and why this page can be honest without being specific.
            </p>
            <p>
              Discretion isn't a limitation on this portfolio. It's a qualification in it.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-4 max-w-xl mx-auto">
            <div data-reveal className="ops-reveal">
              <h4 className="text-[12px] font-mono font-bold uppercase tracking-widest mb-3" style={{ color: GREEN }}>Instruments</h4>
              <ul className="space-y-2 text-left">
                {['Quality Frameworks', 'Calibration & Consistency', 'Metric Design', 'SQL & Dashboards', 'Process Design', 'GenAI in Workflows'].map((s, i) => (
                  <li key={s} data-reveal className="ops-reveal text-[13px] text-[#9a9a9f] flex items-center gap-2" style={{ transitionDelay: `${i * 50}ms` }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: GREEN }} />{s}
                  </li>
                ))}
              </ul>
            </div>
            <div data-reveal className="ops-reveal" style={{ transitionDelay: '100ms' }}>
              <h4 className="text-[12px] font-mono font-bold uppercase tracking-widest mb-3 text-white/70">Judgment</h4>
              <ul className="space-y-2 text-left">
                {['Change at Scale', 'Influence Without Authority', 'Design Thinking in Ops', 'Cross-Cultural Leadership', 'Discretion', 'Systems Thinking'].map((s, i) => (
                  <li key={s} data-reveal className="ops-reveal text-[13px] text-[#9a9a9f] flex items-center gap-2" style={{ transitionDelay: `${(i * 50) + 100}ms` }}>
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
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6">Want to talk shop?</h2>
        <p className="text-[#9a9a9f] text-[17px] leading-[1.8] max-w-lg mx-auto mb-10">
          I can't tell you the specifics. I can absolutely talk craft — quality systems, calibration,
          and how to change an operation without dropping what it carries.
        </p>
        <button
          onClick={() => { window.location.href = `mailto:sam@sam-bloch.com`; }}
          className="group px-10 py-5 font-black uppercase text-[10px] tracking-[0.2em] rounded-full hover:brightness-110 transition-[filter,transform] shadow-xl active:scale-95 inline-flex items-center gap-3"
          style={{ background: GREEN, color: '#0b0d10' }}
        >
          Let's Connect
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </section>

      {/* Footer */}
      <section className="pt-14 pb-32 text-center px-6 border-t border-white/[0.05]">
        <p className="text-[13px] font-mono text-white/30 mb-6">Operations at Scale · Trust &amp; Safety · YouTube (Google)</p>
        <button onClick={() => navigate('/projects')} className="inline-flex items-center gap-2 text-white font-medium text-sm hover:text-white/70 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </button>
      </section>
    </div>
  );
};

export default OperationsCaseStudy;
