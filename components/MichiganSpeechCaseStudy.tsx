import React, { useState, useEffect, useRef } from 'react';
import { useFooterAwareBottom } from '../utils/useFooterAwareBottom';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, X } from 'lucide-react';
import { useScrollReveal, CountUp, CaseStudyImage } from './CaseStudyShared';

/* Michigan Speech theme — ballot paper, ink, and a judge's red pen.
   Spartan green appears only in the founder chapter, where MSU enters the story. */
const PAPER = '#f2ecdd';
const CARD = '#fbf8f0';
const INK = '#2a2620';
const MUTED = '#6b6459';
const RED = '#b23628';
const SPARTAN = '#18453B';

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
  return <div ref={barRef} className="fixed top-0 left-0 h-[3px] z-[70]" style={{ width: '0%', background: RED }} />;
};

/* ─── Chapter overline, ballot style ─── */
const Overline: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p data-reveal className="ms-reveal text-[13px] font-semibold uppercase tracking-[0.2em] mb-6 font-mono" style={{ color: RED }}>
    {children}
  </p>
);

/* ─── Photo, ballot-paper framing ─── */
const PAPER_WRAPPER = 'overflow-hidden rounded-xl border border-[#2a2620]/15 shadow-[0_12px_40px_-18px_rgba(42,38,32,0.35)] transition-shadow duration-500 group-hover:shadow-[0_16px_48px_-16px_rgba(42,38,32,0.45)]';
const PAPER_CAPTION = 'text-[12px] mt-3 tracking-wide font-mono text-[#6b6459]';

/* ════════════════════════════════════════════════════════════════════════
   THREE SATURDAYS — the signature interaction.
   The Spartanvitational's three tournament days, with the real dates and
   the real growth. Each year re-animates the counts; the crowd of dots is
   drawn at 1 dot ≈ 10 students.
   ════════════════════════════════════════════════════════════════════════ */
const SATURDAYS = [
  {
    year: '2018',
    date: 'March 23, 2018',
    students: 250, studentsPrefix: '~', schools: 20, schoolsSuffix: '+',
    note: 'The first Spartanvitational. A lunch-table idea, ten months later: a registered club, a university grant, fifty classrooms, and nearly 250 high schoolers on campus.',
  },
  {
    year: '2019',
    date: 'February 23, 2019',
    students: 500, studentsPrefix: '', schools: 25, schoolsSuffix: '+',
    note: 'Year two doubled. Counting coaches, judges, and parents, about 800 people moved through the building — the largest tournament in the state of Michigan.',
  },
  {
    year: '2020',
    date: 'February 22, 2020',
    students: 600, studentsPrefix: '', schools: 35, schoolsSuffix: '+',
    note: 'The largest competitive public speaking competition in Michigan. Three weeks later, the world shut down. So the next tournament went online — and national.',
  },
];

const ThreeSaturdays: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const s = SATURDAYS[idx];
  const dots = Math.round(s.students / 10);
  return (
    <div className="rounded-2xl p-6 md:p-10" style={{ background: CARD, border: '1px solid rgba(42,38,32,0.12)', boxShadow: '0 12px 40px -18px rgba(42,38,32,0.25)' }}>
      {/* Year tabs, ballot-rank style */}
      <div className="flex gap-3 mb-8">
        {SATURDAYS.map((t, i) => (
          <button
            key={t.year}
            onClick={() => setIdx(i)}
            className="px-5 py-3 rounded-lg font-mono font-bold text-sm transition-colors border-2"
            style={i === idx
              ? { background: RED, color: CARD, borderColor: RED }
              : { background: 'transparent', color: MUTED, borderColor: 'rgba(42,38,32,0.15)' }}
            aria-pressed={i === idx}
          >
            {t.year}
          </button>
        ))}
      </div>

      <p className="font-mono text-[12px] uppercase tracking-[0.25em] mb-6" style={{ color: MUTED }}>{s.date} · East Lansing, MI</p>

      <div key={s.year} className="grid grid-cols-2 gap-8 mb-8 max-w-md">
        <div>
          <p className="text-5xl md:text-6xl font-black tabular-nums" style={{ color: INK }}>
            {s.studentsPrefix}<CountUp end={s.students} duration={1200} />
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] mt-2" style={{ color: MUTED }}>High school students</p>
        </div>
        <div>
          <p className="text-5xl md:text-6xl font-black tabular-nums" style={{ color: SPARTAN }}>
            <CountUp end={s.schools} duration={1200} />{s.schoolsSuffix}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] mt-2" style={{ color: MUTED }}>Schools</p>
        </div>
      </div>

      {/* The crowd — 1 dot ≈ 10 students */}
      <div className="flex flex-wrap gap-1.5 mb-3 max-w-lg" aria-hidden="true">
        {Array.from({ length: dots }, (_, i) => (
          <span key={`${s.year}-${i}`} className="w-2.5 h-2.5 rounded-full ms-dot"
            style={{ background: SPARTAN, animationDelay: `${i * 18}ms` }} />
        ))}
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-6" style={{ color: 'rgba(42,38,32,0.35)' }}>one dot ≈ ten students</p>

      <p className="text-[16px] leading-[1.8]" style={{ color: INK }}>{s.note}</p>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   MichiganSpeechCaseStudy — Main component
   ════════════════════════════════════════════════════════════════════════ */
const MichiganSpeechCaseStudy: React.FC = () => {
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
    const html = generateCaseStudyPdfHtml('michigan-speech', window.location.origin);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank', 'width=900,height=700');
    if (win) { win.onload = () => URL.revokeObjectURL(url); } else { URL.revokeObjectURL(url); }
  };

  return (
    <div ref={containerRef} className="min-h-screen font-sans overflow-x-clip" style={{ background: PAPER, color: INK }}>
      <style>{`
        [data-reveal] { opacity: 0; transform: translateY(30px); transition: opacity .8s cubic-bezier(.25,.46,.45,.94), transform .8s cubic-bezier(.25,.46,.45,.94); }
        [data-reveal].revealed { opacity: 1; transform: none; }
        .ms-rule { background-image: repeating-linear-gradient(transparent, transparent 33px, rgba(42,38,32,0.05) 33px, rgba(42,38,32,0.05) 34px); }
        @keyframes ms-dot-in { from { opacity: 0; transform: scale(0.3); } to { opacity: 1; transform: scale(1); } }
        .ms-dot { animation: ms-dot-in .4s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          [data-reveal] { transition: none !important; opacity: 1; transform: none; }
          .ms-dot { animation: none !important; }
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
        className="fixed top-8 left-8 md:left-12 z-[60] flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-white transition-colors bg-black/70 backdrop-blur-md px-6 py-3 rounded-full border border-white/5 shadow-xl active:scale-95 no-print"
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

      {/* ══ HERO — the ballot ══ */}
      <header className="relative min-h-screen flex items-center justify-center px-6 ms-rule">
        <div className="max-w-3xl w-full text-center py-28">
          <p className="font-mono text-[12px] uppercase tracking-[0.3em] mb-8" style={{ color: MUTED }}>
            Event: Storytelling · Entry: Sam Bloch
          </p>
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black leading-[0.9] tracking-tight mb-4" style={{ color: INK }}>
            Michigan<br />Speech
          </h1>
          <div className="w-40 h-1 mx-auto mb-10 rounded-full" style={{ background: RED, transform: 'rotate(-1deg)' }} />
          <p className="text-lg md:text-xl leading-relaxed max-w-xl mx-auto" style={{ color: MUTED }}>
            Fourteen years in Michigan&rsquo;s speech and debate community — as a competitor, a coach, a founder,
            and, most Saturdays that matter, the guy in the tab room. Storytelling was my event.
            So here&rsquo;s the story, told in four chapters.
          </p>
        </div>
      </header>

      {/* ══ STATS ══ */}
      <section className="py-14 md:py-20 px-6" style={{ borderTop: '1px solid rgba(42,38,32,0.1)', borderBottom: '1px solid rgba(42,38,32,0.1)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { end: 2, suffix: 'x', label: 'MIFA state champion, Storytelling' },
            { end: 10, suffix: '+', label: 'State finalists coached' },
            { end: 600, suffix: '+', label: 'Competitors hosted in one day' },
            { end: 14, suffix: '', label: 'Years in the community' },
          ].map((s, i) => (
            <div key={s.label} data-reveal className="ms-reveal" style={{ transitionDelay: `${i * 100}ms` }}>
              <p className="text-4xl md:text-5xl font-black tabular-nums" style={{ color: RED }}>
                <CountUp end={s.end} suffix={s.suffix} />
              </p>
              <p className="font-mono text-[11px] uppercase tracking-wider mt-3 leading-snug" style={{ color: MUTED }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CHAPTER I — THE COMPETITOR ══ */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-4xl mx-auto">
        <div data-reveal className="ms-reveal">
          <Overline>Chapter I · The Competitor</Overline>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-8 leading-tight" style={{ color: INK }}>
            I learned early that a story can win a room.
          </h2>
          <div className="space-y-5 text-[17px] leading-[1.8]" style={{ color: '#4a443c' }}>
            <p>
              I grew up in this activity. Storytelling was my event — stand alone in front of a judge with nothing
              but a folktale and your own nerve — and through the Michigan Interscholastic Forensic Association I
              became a <span className="font-bold" style={{ color: INK }}>two-time state champion</span>, a four-time
              state finalist, and, for a while, a record-holder. At the MSCI tournament on Mackinac Island I won the
              championship three times in four years.
            </p>
            <p>
              None of it happens without my coach, <span className="font-bold" style={{ color: INK }}>Doug &ldquo;Bev&rdquo; Bevier</span> —
              the first person who made me believe a story could win a room, and the reason I&rsquo;ve spent every year
              since trying to pay that belief forward.
            </p>
          </div>
          <div className="mt-10">
            <CaseStudyImage src="/case-study/michigan-speech/sam-and-bev.webp"
              alt="A young Sam Bloch with coach Doug 'Bev' Bevier, both holding trophies at the MSCI Mackinac tournament"
              caption="Mackinac Island, 2013 — me and Bev, with the hardware to show for it."
              onOpen={setLightbox} wrapperClassName={PAPER_WRAPPER} captionClassName={PAPER_CAPTION} />
          </div>
        </div>
      </section>

      {/* ══ CHAPTER II — THE COACH ══ */}
      <section className="py-16 md:py-24 px-6 md:px-12" style={{ borderTop: '1px solid rgba(42,38,32,0.1)' }}>
        <div data-reveal className="ms-reveal max-w-4xl mx-auto">
          <Overline>Chapter II · The Coach</Overline>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-8 leading-tight" style={{ color: INK }}>
            Then I found out the wins mean more from the judge&rsquo;s table.
          </h2>
          <div className="space-y-5 text-[17px] leading-[1.8]" style={{ color: '#4a443c' }}>
            <p>
              Through college and into my early career I coached forensics at Okemos and at my alma mater,
              Walled Lake Western — four and a half years of Tuesday-night practices, weekend tournaments, and
              helping teenagers find pieces of literature that fit voices they didn&rsquo;t know they had yet.
            </p>
            <p>
              My students went further than I did: <span className="font-bold" style={{ color: INK }}>ten-plus state
              finalists, two state champions, and a national champion</span>. Coaching taught me the thing that
              every job since has confirmed — building the person who performs beats performing, every time.
            </p>
          </div>
          <div className="mt-10">
            <CaseStudyImage src="/case-study/michigan-speech/wlw-team.webp"
              alt="The Walled Lake Western Forensics team dressed up at the Grand Hotel"
              caption="Walled Lake Western Forensics — where I competed, then coached."
              onOpen={setLightbox} wrapperClassName={PAPER_WRAPPER} captionClassName={PAPER_CAPTION} />
          </div>
        </div>
      </section>

      {/* ══ CHAPTER III — THE FOUNDER ══ */}
      <section className="py-16 md:py-24 px-6 md:px-12" style={{ borderTop: '1px solid rgba(42,38,32,0.1)', background: 'rgba(24,69,59,0.035)' }}>
        <div className="max-w-4xl mx-auto">
          <div data-reveal className="ms-reveal mb-12">
            <Overline>Chapter III · The Founder</Overline>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-8 leading-tight" style={{ color: INK }}>
              It started as a lunch conversation at Michigan State.
            </h2>
            <div className="space-y-5 text-[17px] leading-[1.8]" style={{ color: '#4a443c' }}>
              <p>
                After I aged out of competing, I missed the activity enough to do something unreasonable about it.
                Over lunch with a friend, it clicked: MSU had everything a high school tournament needs — space,
                students, energy. What it didn&rsquo;t have was anyone willing to organize it.
              </p>
              <p>
                The road was genuinely intimidating. I&rsquo;d need to convince enough Spartans to charter a registered
                student organization (<span className="font-bold" style={{ color: SPARTAN }}>Spartan Speech</span>),
                secure a performance hall plus fifty classrooms for a Saturday, and persuade high school coaches
                across the state to trust a brand-new tournament with their kids. Then we did it — and a university
                grant covered the whole thing: the largest building on campus, awards for the champions, and lunch
                for every coach and judge who gives their weekends to this activity.
              </p>
            </div>
          </div>

          <div data-reveal className="ms-reveal mb-10">
            <ThreeSaturdays />
          </div>

          <div data-reveal className="ms-reveal space-y-5 text-[17px] leading-[1.8]" style={{ color: '#4a443c' }}>
            <p>
              By 2020 the club was 50+ members strong, recognized by student government, and running the
              <span className="font-bold" style={{ color: INK }}> largest competitive public speaking competition in
              Michigan</span>. When COVID took away the building, we ran a national tournament online instead.
              And when I graduated, I did the hardest, best thing you can do with something you built:
              <span className="font-bold" style={{ color: INK }}> I handed it to the next generation of Spartans.</span>
            </p>
            <p>
              The Spartanvitational turns ten in 2027. It doesn&rsquo;t need me anymore. That&rsquo;s the whole point.
            </p>
          </div>

          {/* The awards-ceremony film */}
          <figure data-reveal className="ms-reveal mt-12">
            <div className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(42,38,32,0.15)', boxShadow: '0 12px 40px -18px rgba(42,38,32,0.3)', background: '#000' }}>
              <iframe
                src="https://www.youtube-nocookie.com/embed/ANkVF8trF0I"
                title="Spartan Speech — the club film played at each year's awards ceremony"
                className="w-full border-0"
                style={{ aspectRatio: '16 / 9' }}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <figcaption className="text-[12px] mt-3 tracking-wide font-mono" style={{ color: MUTED }}>
              The club film I produced to close every awards ceremony — Spartan Speech, in its own voice.
            </figcaption>
          </figure>

          <div className="mt-10 grid md:grid-cols-2 gap-8 items-start">
            <CaseStudyImage src="/case-study/michigan-speech/tournament-day.webp"
              alt="A packed auditorium of high school competitors at the Spartanvitational"
              caption="Tournament day — a full house of blazers, binders, and nerves."
              onOpen={setLightbox} wrapperClassName={PAPER_WRAPPER} captionClassName={PAPER_CAPTION} />
            <CaseStudyImage src="/case-study/michigan-speech/spartan-speech-team.webp"
              alt="The Spartan Speech club posing together in matching shirts"
              caption="Spartan Speech — the Spartans who made it happen."
              onOpen={setLightbox} wrapperClassName={PAPER_WRAPPER} captionClassName={PAPER_CAPTION} />
          </div>
        </div>
      </section>

      {/* ══ CHAPTER IV — THE STEWARD ══ */}
      <section className="py-16 md:py-24 px-6 md:px-12" style={{ borderTop: '1px solid rgba(42,38,32,0.1)' }}>
        <div data-reveal className="ms-reveal max-w-4xl mx-auto">
          <Overline>Chapter IV · The Steward</Overline>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-8 leading-tight" style={{ color: INK }}>
            These days I give back from the tab room.
          </h2>
          <div className="space-y-5 text-[17px] leading-[1.8]" style={{ color: '#4a443c' }}>
            <p>
              Every May I&rsquo;m back on Mackinac Island with Michigan Speech Coaches Inc. — eleven conferences and
              counting. I spend the Saturday in the tabulation room keeping the tournament running, volunteer-coach
              my alma mater when they&rsquo;ll have me, and eat my body weight in fudge, which I consider a
              membership obligation.
            </p>
            <p>
              Lately, stewardship has started to look like my day job: at the most recent conference I gave a
              professional development talk at the Grand Hotel on what AI can quietly take off a coach&rsquo;s plate —
              building live on stage to show how approachable it&rsquo;s become. Not to hand anyone a finished product,
              but to put real capability in the hands of people who&rsquo;d never call themselves technical. The kid
              this community built grew up and came back with tools.
            </p>
          </div>
          <div className="mt-10 max-w-md mx-auto">
            <CaseStudyImage src="/case-study/michigan-speech/grand-hotel-talk.webp"
              alt="Sam Bloch and Brando Socarras beside a screen reading 'Making Coaching Easier with Google AI Studio' at the Grand Hotel"
              caption="The Grand Hotel, 2026 — teaching coaches to build with AI, alongside Brando Socarras."
              onOpen={setLightbox} wrapperClassName={PAPER_WRAPPER} captionClassName={PAPER_CAPTION} />
          </div>
        </div>
      </section>

      {/* ══ REFLECTION ══ */}
      <section className="py-16 md:py-24 px-6 md:px-12" style={{ borderTop: '1px solid rgba(42,38,32,0.1)' }}>
        <div data-reveal className="ms-reveal max-w-3xl mx-auto text-center">
          <Overline>The Last Round</Overline>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-8 leading-tight" style={{ color: INK }}>
            Everything I do professionally, I did here first.
          </h2>
          <div className="space-y-5 text-[17px] leading-[1.8] text-left md:text-center" style={{ color: '#4a443c' }}>
            <p>
              Standing up in front of strangers and holding the room. Coaching someone to a result you&rsquo;ll never
              get credit for. Founding an organization out of nothing but a lunch conversation and stubbornness.
              Running an 800-person operation out of a tab room. Teaching people that the intimidating tool is
              actually within their reach.
            </p>
            <p>
              I&rsquo;ve been rehearsing my entire career since I was fourteen. This community was the stage.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-4 max-w-xl mx-auto">
            <div data-reveal className="ms-reveal">
              <h4 className="text-[12px] font-mono font-bold uppercase tracking-widest mb-3" style={{ color: RED }}>On Stage</h4>
              <ul className="space-y-2 text-left">
                {['Public Speaking', 'Storytelling', 'Performance Coaching', 'Judging & Tabulation', 'Mentorship', 'Teaching'].map((s, i) => (
                  <li key={s} data-reveal className="ms-reveal text-[13px] flex items-center gap-2" style={{ color: MUTED, transitionDelay: `${i * 50}ms` }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: RED }} />{s}
                  </li>
                ))}
              </ul>
            </div>
            <div data-reveal className="ms-reveal" style={{ transitionDelay: '100ms' }}>
              <h4 className="text-[12px] font-mono font-bold uppercase tracking-widest mb-3" style={{ color: SPARTAN }}>Behind the Curtain</h4>
              <ul className="space-y-2 text-left">
                {['Founding Organizations', 'Event Operations', 'Grant Funding', 'Volunteer Leadership', 'Community Stewardship', 'Succession Planning'].map((s, i) => (
                  <li key={s} data-reveal className="ms-reveal text-[13px] flex items-center gap-2" style={{ color: MUTED, transitionDelay: `${(i * 50) + 100}ms` }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: SPARTAN }} />{s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CONTACT CTA ══ */}
      <section className="py-16 md:py-24 text-center px-6" style={{ borderTop: '1px solid rgba(42,38,32,0.1)' }}>
        <span className="text-[10px] font-black uppercase tracking-[0.5em] block mb-4" style={{ color: RED }}>GET IN TOUCH</span>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6" style={{ color: INK }}>Got a room that needs winning?</h2>
        <p className="text-[17px] leading-[1.8] max-w-lg mx-auto mb-10" style={{ color: MUTED }}>
          I&rsquo;m always up for talking speech, coaching, community-building — or why Storytelling is
          objectively the best event. Fudge opinions also welcome.
        </p>
        <button
          onClick={() => { window.location.href = `mailto:sam@sam-bloch.com`; }}
          className="group px-10 py-5 font-black uppercase text-[10px] tracking-[0.2em] rounded-full hover:brightness-110 transition-[filter,transform] shadow-xl active:scale-95 inline-flex items-center gap-3"
          style={{ background: RED, color: CARD }}
        >
          Let&rsquo;s Connect
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </section>

      {/* Footer */}
      <section className="pt-14 pb-32 text-center px-6" style={{ borderTop: '1px solid rgba(42,38,32,0.1)' }}>
        <p className="font-mono text-[13px] mb-6" style={{ color: 'rgba(42,38,32,0.4)' }}>Michigan Speech · MIFA · MSCI · 14 years and counting</p>
        <button onClick={() => navigate('/projects')} className="inline-flex items-center gap-2 font-medium text-sm transition-colors hover:opacity-70" style={{ color: INK }}>
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </button>
      </section>
    </div>
  );
};

export default MichiganSpeechCaseStudy;
