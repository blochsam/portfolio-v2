import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, X, ExternalLink, FileText, Mic, Bot, Shield, Clock, Database, Cloud, Palette, GraduationCap, Lightbulb, Users, Zap, BookOpen, Code, Coffee, MapPin, MessageSquare, Calendar } from 'lucide-react';
import { useScrollReveal } from './CaseStudyShared';

/* ═══════════════════════════════════════════════════════════════════
   HAND-DRAWN DESIGN SYSTEM
   ═══════════════════════════════════════════════════════════════════ */

const TEAL = '#24A2A7';
const TEAL_LIGHT = '#7DD3D7';
const TEAL_DARK = '#1B7A7E';
const INK = '#2d2d2d';
const PAPER = '#faf8f3';
const PAPER_DARK = '#f0ede4';
const PENCIL = '#6b6560';

// Wobbly border-radius presets for hand-drawn feel
const WOBBLY = {
  sm: '255px 15px 225px 15px / 15px 225px 15px 255px',
  md: '15px 255px 15px 225px / 255px 15px 225px 15px',
  lg: '225px 15px 255px 15px / 15px 255px 15px 225px',
  card: '30px 255px 15px 225px / 255px 15px 225px 30px',
  btn: '255px 25px 225px 25px / 25px 225px 25px 255px',
  circle: '60% 40% 55% 45% / 45% 55% 40% 60%',
  tag: '15px 225px 15px 255px / 255px 15px 225px 15px',
};

/* ─── Hand-drawn underline SVG path ─── */
const HandDrawnUnderline: React.FC<{ visible: boolean; color?: string; delay?: number }> = ({
  visible,
  color = TEAL,
  delay = 0,
}) => (
  <svg
    viewBox="0 0 200 12"
    preserveAspectRatio="none"
    className="absolute left-0 -bottom-1 w-full h-[8px] pointer-events-none"
    style={{ overflow: 'visible' }}
  >
    <path
      d="M2 8 C30 3, 45 10, 75 6 S120 2, 150 7 S180 4, 198 6"
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="200"
      strokeDashoffset={visible ? '0' : '200'}
      style={{
        transition: `stroke-dashoffset 0.8s cubic-bezier(0.65, 0, 0.35, 1) ${delay}s`,
      }}
    />
    <path
      d="M5 10 C35 6, 50 11, 80 8 S125 5, 155 9 S185 6, 196 8"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="200"
      strokeDashoffset={visible ? '0' : '200'}
      opacity="0.4"
      style={{
        transition: `stroke-dashoffset 0.9s cubic-bezier(0.65, 0, 0.35, 1) ${delay + 0.15}s`,
      }}
    />
  </svg>
);

/* ─── Keyword with hand-drawn underline on scroll ─── */
const Keyword: React.FC<{ children: React.ReactNode; color?: string; delay?: number }> = ({
  children,
  color = TEAL,
  delay = 0,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.6, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <span ref={ref} className="relative inline-block" style={{ fontWeight: 700, color }}>
      {children}
      <HandDrawnUnderline visible={visible} color={color} delay={delay} />
    </span>
  );
};

/* ─── ScrollProgress (teal ink line) ─── */
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
    <div className="fixed top-0 left-0 w-full h-[4px] z-[80] no-print" style={{ background: 'transparent' }}>
      <div
        ref={barRef}
        className="h-full"
        style={{
          width: '0%',
          background: `repeating-linear-gradient(90deg, ${TEAL} 0px, ${TEAL} 6px, transparent 6px, transparent 9px)`,
        }}
      />
    </div>
  );
};

/* ─── Sticky-note section label ─── */
const StickyLabel: React.FC<{ children: React.ReactNode; rotate?: number }> = ({ children, rotate = -1.5 }) => (
  <div
    data-reveal
    className="sketch-reveal inline-block px-5 py-2 mb-6 border-2 border-dashed"
    style={{
      borderRadius: WOBBLY.tag,
      borderColor: TEAL,
      background: `${TEAL}18`,
      transform: `rotate(${rotate}deg)`,
      fontWeight: 700,
      fontSize: '0.8rem',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      color: TEAL,
    }}
  >
    {children}
  </div>
);

/* ─── Hand-drawn card ─── */
const SketchCard: React.FC<{
  children: React.ReactNode;
  rotate?: number;
  className?: string;
  accent?: boolean;
}> = ({ children, rotate = 0, className = '', accent = false }) => (
  <div
    data-reveal
    className={`sketch-reveal relative p-6 md:p-8 border-[3px] transition-transform duration-100 hover:rotate-0 ${className}`}
    style={{
      borderRadius: WOBBLY.card,
      borderColor: accent ? TEAL : INK,
      background: accent ? `${TEAL}0D` : PAPER,
      boxShadow: `4px 4px 0px 0px ${accent ? TEAL : INK}`,
      transform: `rotate(${rotate}deg)`,
      color: INK,
    }}
  >
    {children}
  </div>
);

/* ─── Thumbtack decoration ─── */
const Thumbtack: React.FC<{ color?: string; top?: string; left?: string }> = ({
  color = TEAL,
  top = '-8px',
  left = '20px',
}) => (
  <div
    className="absolute w-4 h-4 rounded-full border-2 border-white z-10"
    style={{ background: color, top, left, boxShadow: '1px 1px 2px rgba(0,0,0,0.25)' }}
  />
);

/* ─── Hand-drawn arrow SVG ─── */
const SketchArrow: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 100 40" className={`w-16 h-8 ${className}`} fill="none">
    <path d="M5 20 C20 18, 40 22, 60 19 S80 16, 92 20" stroke={TEAL} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M82 14 L93 20 L83 27" stroke={TEAL} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

/* ─── Animated doodle element wrapper ─── */
const Doodle: React.FC<{
  children: React.ReactNode;
  animation?: 'wiggle' | 'float' | 'pop' | 'spin' | 'rock' | 'bounce';
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, animation = 'float', delay = 0, className = '', style = {} }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`pointer-events-none select-none ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0)',
        transition: `opacity 0.4s ease ${delay}s, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s`,
        animation: visible ? `doodle-${animation} ${animation === 'spin' ? '6s' : animation === 'float' ? '4s' : '3s'} ease-in-out ${delay + 0.5}s infinite` : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ─── SVG Doodle icons (hand-drawn style) ─── */
const DoodlePencil: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M8 32 L28 12 L32 16 L12 36 Z" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={`${TEAL}20`} />
    <path d="M28 12 L30 10 C31 9 33 9 34 10 L34 10 C35 11 35 13 34 14 L32 16" stroke={TEAL} strokeWidth="2" strokeLinecap="round" />
    <path d="M8 32 L6 38 L12 36" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={`${TEAL}15`} />
    <path d="M24 16 L28 20" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
  </svg>
);

const DoodleBook: React.FC<{ size?: number }> = ({ size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M6 8 C6 8 12 6 20 8 C28 6 34 8 34 8 L34 32 C34 32 28 30 20 32 C12 30 6 32 6 32 Z" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={`${TEAL}12`} />
    <path d="M20 8 L20 32" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    <path d="M10 14 L17 13" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    <path d="M10 18 L16 17" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    <path d="M23 13 L30 14" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
  </svg>
);

const DoodleCoffee: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M8 16 L10 34 C10 35 11 36 12 36 L24 36 C25 36 26 35 26 34 L28 16" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={`${TEAL}12`} />
    <path d="M28 20 C30 20 34 20 34 24 C34 28 30 28 28 28" stroke={TEAL} strokeWidth="2" strokeLinecap="round" />
    <path d="M6 16 L30 16" stroke={TEAL} strokeWidth="2" strokeLinecap="round" />
    <path d="M14 10 C14 8 16 6 16 6" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    <path d="M18 8 C18 6 20 4 20 4" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    <path d="M22 10 C22 8 24 6 24 6" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
  </svg>
);

const DoodleStar: React.FC<{ size?: number }> = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M20 4 L23 15 L34 15 L25 22 L28 34 L20 27 L12 34 L15 22 L6 15 L17 15 Z" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={`${TEAL}18`} />
  </svg>
);

const DoodlePaperPlane: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M4 20 L36 6 L26 36 L20 24 Z" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={`${TEAL}12`} />
    <path d="M20 24 L36 6" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    <path d="M4 20 L20 24" stroke={TEAL} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const DoodleBulb: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M20 4 C12 4 8 10 8 16 C8 22 14 24 14 28 L26 28 C26 24 32 22 32 16 C32 10 28 4 20 4 Z" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={`${TEAL}15`} />
    <path d="M14 32 L26 32" stroke={TEAL} strokeWidth="2" strokeLinecap="round" />
    <path d="M16 36 L24 36" stroke={TEAL} strokeWidth="2" strokeLinecap="round" />
    <path d="M20 12 L20 20 M16 16 L24 16" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
  </svg>
);

const DoodleBriefcase: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect x="4" y="14" width="32" height="22" rx="3" stroke={TEAL} strokeWidth="2" fill={`${TEAL}12`} />
    <path d="M14 14 L14 10 C14 8 16 6 18 6 L22 6 C24 6 26 8 26 10 L26 14" stroke={TEAL} strokeWidth="2" strokeLinecap="round" />
    <path d="M4 22 L18 22 L18 26 L22 26 L22 22 L36 22" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
  </svg>
);

const DoodleGradCap: React.FC<{ size?: number }> = ({ size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M4 16 L20 8 L36 16 L20 24 Z" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={`${TEAL}15`} />
    <path d="M10 20 L10 30 C10 30 14 34 20 34 C26 34 30 30 30 30 L30 20" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={`${TEAL}08`} />
    <path d="M36 16 L36 26" stroke={TEAL} strokeWidth="2" strokeLinecap="round" />
    <circle cx="36" cy="27" r="1.5" fill={TEAL} />
  </svg>
);

const DoodleRocket: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M20 4 C20 4 14 12 14 24 L26 24 C26 12 20 4 20 4 Z" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={`${TEAL}15`} />
    <path d="M14 24 L8 30 L14 28" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M26 24 L32 30 L26 28" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="20" cy="16" r="3" stroke={TEAL} strokeWidth="1.5" fill={`${TEAL}20`} />
    <path d="M17 32 C18 36 22 36 23 32" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
  </svg>
);

const DoodleApple: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M20 10 C12 10 6 18 6 26 C6 34 12 38 20 38 C28 38 34 34 34 26 C34 18 28 10 20 10 Z" stroke={TEAL} strokeWidth="2" strokeLinecap="round" fill={`${TEAL}15`} />
    <path d="M20 10 C20 10 22 4 26 4" stroke={TEAL} strokeWidth="2" strokeLinecap="round" />
    <path d="M18 6 C16 8 18 10 20 10" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" fill={`${TEAL}25`} />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

const LevelUpCaseStudy: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useScrollReveal();
  const [lightbox, setLightbox] = useState<string | null>(null);

  /* ─── PDF Download ─── */
  const handleDownloadPDF = useCallback(async () => {
    const { generateCaseStudyPdfHtml } = await import('../utils/generateCaseStudyPdf');
    const html = generateCaseStudyPdfHtml('level-up', window.location.origin);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank', 'width=900,height=700');
    if (win) win.onload = () => URL.revokeObjectURL(url);
    else URL.revokeObjectURL(url);
  }, []);

  /* ─── ESC to close lightbox ─── */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  /* ─── Clickable image helper ─── */
  const ClickableImg: React.FC<{ src: string; alt: string; caption?: string; className?: string }> = ({
    src, alt, caption, className = '',
  }) => (
    <button
      type="button"
      onClick={() => setLightbox(src)}
      className={`block w-full text-left cursor-zoom-in group ${className}`}
    >
      <div
        className="overflow-hidden border-[3px] transition-all duration-100 group-hover:shadow-[2px_2px_0px_0px_#2d2d2d] group-hover:translate-x-[1px] group-hover:translate-y-[1px]"
        style={{ borderRadius: WOBBLY.md, borderColor: INK, boxShadow: `4px 4px 0px 0px ${INK}` }}
      >
        <img src={src} alt={alt} className="w-full h-auto" loading="lazy" />
      </div>
      {caption && (
        <p className="mt-2 text-center text-sm italic" style={{ color: PENCIL }}>
          ↑ {caption} (click to enlarge)
        </p>
      )}
    </button>
  );

  /* ─── Icon in rough circle ─── */
  const IconBubble: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
    <div
      className="w-14 h-14 flex items-center justify-center border-[3px] shrink-0"
      style={{
        borderRadius: WOBBLY.circle,
        borderColor: TEAL,
        background: `${TEAL}15`,
        boxShadow: `3px 3px 0px 0px ${TEAL}`,
      }}
    >
      {icon}
    </div>
  );

  /* ─── Course module data ─── */
  const courseModules = [
    {
      name: 'Building Your Brand',
      week: 'Week 1',
      text: 'LinkedIn bio, identity capital audit, professional headshot, resume update. Everything posted to the class discussion board for peer review.',
      icon: <Users className="w-6 h-6" strokeWidth={2.5} style={{ color: TEAL }} />,
    },
    {
      name: 'Building Your Network',
      week: 'Week 2',
      text: 'Weak ties, coffee chat openers, 3 real LinkedIn outreach messages, a 30-minute networking meeting with a professional, and a handwritten thank-you letter.',
      icon: <Coffee className="w-6 h-6" strokeWidth={2.5} style={{ color: TEAL }} />,
    },
    {
      name: 'Building Your Impact',
      week: 'Week 3',
      text: 'Head-up vs. head-down work, pre-suasion, and a 12-minute efficiency presentation delivered at Google with live feedback from five engineers.',
      icon: <Zap className="w-6 h-6" strokeWidth={2.5} style={{ color: TEAL }} />,
    },
    {
      name: 'Building Your Start',
      week: 'Week 4',
      text: 'AI-driven interview practice using the STAR method, creative application strategies, and a comprehensive Personal Action Plan as their final deliverable.',
      icon: <GraduationCap className="w-6 h-6" strokeWidth={2.5} style={{ color: TEAL }} />,
    },
  ];

  /* ─── Platform features ─── */
  const features = [
    {
      title: 'AI Interview Practice',
      icon: <Mic className="w-6 h-6" strokeWidth={2.5} style={{ color: TEAL }} />,
      body: 'Students paste a real job posting, and the system generates behavioral questions. They respond out loud using the Web Speech API, and Gemini evaluates their answers for STAR method structure. A comparable commercial tool runs about $25/month.',
    },
    {
      title: 'AI-Assisted Grading',
      icon: <FileText className="w-6 h-6" strokeWidth={2.5} style={{ color: TEAL }} />,
      body: 'When a student uploads a reflection PDF, Gemini analyzes it against the assignment rubric. I still read everything myself, but the AI gives me a content summary and suggested feedback points. Useful when you\'re grading at midnight between meetings.',
    },
    {
      title: 'LevelUpBot',
      icon: <Bot className="w-6 h-6" strokeWidth={2.5} style={{ color: TEAL }} />,
      body: 'A course-aware chatbot for logistics: "When is the residency?" or "What\'s the PAP due date?" I engineered the system prompt to refuse anything academic. It won\'t summarize readings or interpret course concepts.',
    },
  ];

  /* ─── Student quotes from post-residency surveys and PAPs ─── */
  const studentQuotes = [
    {
      quote: 'No shade to anyone, but we took a class at Quinnipiac that was meant to give us similar tools, but this class was handled much more effectively.',
      context: 'Post-residency survey',
    },
    {
      quote: "It's crazy to think this course was only four weeks long, and yet, I feel like I've learned an entire semester's worth of important knowledge and skills.",
      context: 'Post-residency survey',
    },
    {
      quote: "It is probably the most I've felt like an 'adult' in my life and showed me things I didn't know I was capable of.",
      context: 'On the Google residency',
    },
    {
      quote: 'I have never felt more prepared to begin building my career in the way I have always desired.',
      context: 'Personal Action Plan',
    },
  ];

  /* ─── Engineering challenges ─── */
  const challenges = [
    {
      title: 'Timezone Integrity',
      icon: <Clock className="w-5 h-5" strokeWidth={2.5} style={{ color: TEAL }} />,
      problem: 'Due dates stored as "11:59 PM" kept mismatching between the server (UTC) and students\' local time in LA.',
      solution: 'Standardized the database on UTC. Built a React bridge that converts datetime-local values to ISO on submission and re-localizes them for the student view.',
    },
    {
      title: 'Syllabus-to-Context Pipeline',
      icon: <BookOpen className="w-5 h-5" strokeWidth={2.5} style={{ color: TEAL }} />,
      problem: 'The chatbot needed to stay current as I tweaked the course week-to-week.',
      solution: 'A "Context Notebook" architecture where the bot\'s system prompt gets dynamically injected with the latest data from the Module, Assignment, and Material tables in PostgreSQL.',
    },
  ];

  return (
    <div
      ref={containerRef}
      className="min-h-screen relative"
      style={{
        background: PAPER,
        backgroundImage: `radial-gradient(${PAPER_DARK} 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
        color: INK,
      }}
    >

      {/* ─── Custom styles ─── */}
      <style>{`
        .sketch-reveal {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .sketch-reveal.revealed {
          opacity: 1;
          transform: translateY(0) rotate(var(--reveal-rotate, 0deg));
        }
        @keyframes gentle-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-1deg); }
          50% { transform: rotate(1deg); }
        }
        .sketch-bounce {
          animation: gentle-bounce 3s ease-in-out infinite;
        }
        .tape-effect {
          position: relative;
        }
        .tape-effect::before {
          content: '';
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%) rotate(-3deg);
          width: 60px;
          height: 24px;
          background: rgba(36, 162, 167, 0.2);
          border: 1px solid rgba(36, 162, 167, 0.3);
          border-radius: 2px;
          z-index: 5;
        }
        .dashed-connector {
          border-left: 3px dashed ${TEAL}40;
        }
        .wobbly-hr {
          border: none;
          height: 3px;
          background: repeating-linear-gradient(
            90deg,
            ${TEAL}50 0px,
            ${TEAL}50 8px,
            transparent 8px,
            transparent 14px
          );
          margin: 2.5rem 0;
        }
        /* Doodle animations */
        @keyframes doodle-wiggle {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(6deg); }
        }
        @keyframes doodle-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-8px) rotate(3deg); }
          66% { transform: translateY(-4px) rotate(-2deg); }
        }
        @keyframes doodle-pop {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes doodle-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes doodle-rock {
          0%, 100% { transform: rotate(-8deg) translateY(0); }
          25% { transform: rotate(4deg) translateY(-3px); }
          75% { transform: rotate(-4deg) translateY(-3px); }
        }
        @keyframes doodle-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-10px) scale(1.05); }
          60% { transform: translateY(-4px) scale(0.98); }
        }
        @media (prefers-reduced-motion: reduce) {
          [class*="doodle-"] { animation: none !important; }
          .sketch-bounce { animation: none !important; }
        }
      `}</style>

      <ScrollProgress />

      {/* ═══════════════════ BACK BUTTON ═══════════════════ */}
      <button onClick={() => navigate('/projects')} className="fixed top-8 left-8 md:left-12 z-[60] flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-all bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/5 hover:border-[#24A2A7]/40 shadow-xl active:scale-95 no-print" aria-label="Back to projects">
        <ArrowLeft className="w-4 h-4" />
        Back to Archive
      </button>

      {/* ═══════════════════ PDF FAB ═══════════════════ */}
      <button
        onClick={handleDownloadPDF}
        className="fixed bottom-28 right-8 md:right-12 z-[50] w-16 h-16 flex items-center justify-center border-[3px] transition-all duration-100 no-print hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#1B7A7E] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
        style={{
          borderRadius: WOBBLY.circle,
          borderColor: TEAL_DARK,
          background: TEAL,
          boxShadow: `6px 6px 0px 0px ${TEAL_DARK}`,
          color: 'white',
        }}
        title="Download Case Study PDF"
      >
        <Download className="w-7 h-7" strokeWidth={2.5} />
      </button>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <header className="relative px-6 pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        <div
          className="absolute top-0 bottom-0 left-[72px] w-[2px] hidden md:block"
          style={{ background: `${TEAL}30` }}
        />

        <div className="max-w-4xl mx-auto relative">
          <div
            className="absolute -top-4 -right-8 w-20 h-20 border-[3px] border-dashed hidden md:flex items-center justify-center sketch-bounce"
            style={{ borderRadius: WOBBLY.circle, borderColor: TEAL }}
          >
            <GraduationCap className="w-8 h-8" style={{ color: TEAL }} strokeWidth={2} />
          </div>

          <div data-reveal className="sketch-reveal">
            <p
              className="text-sm font-bold uppercase tracking-[0.25em] mb-4"
              style={{ color: TEAL }}
            >
              Case Study · 2023–2026
            </p>
          </div>

          <div data-reveal className="sketch-reveal">
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6"
              style={{ color: INK }}
            >
              Level{' '}
              <span className="relative inline-block" style={{ color: TEAL }}>
                Up
                <svg
                  viewBox="0 0 100 100"
                  className="absolute -right-6 -top-3 w-10 h-10 hidden md:block"
                  style={{ transform: 'rotate(15deg)' }}
                >
                  <path d="M50 10 L55 40 L85 45 L55 50 L50 80 L45 50 L15 45 L45 40 Z" fill={TEAL} opacity="0.3" />
                </svg>
              </span>
            </h1>
          </div>

          <div data-reveal className="sketch-reveal">
            <p
              className="text-xl md:text-2xl leading-relaxed max-w-2xl mb-8"
              style={{ color: PENCIL }}
            >
              How a <Keyword>campus tour at Google</Keyword> turned into a custom-built LMS,
              a four-week intensive on career readiness, and my{' '}
              <Keyword delay={0.2}>first time at the front of a classroom</Keyword>.
            </p>
          </div>

          <div data-reveal className="sketch-reveal flex flex-wrap gap-3 mb-10">
            {['Next.js', 'Prisma', 'Gemini API', 'Cloud Run', 'Tailwind CSS', 'NextAuth'].map((tag, i) => (
              <span
                key={tag}
                className="px-4 py-1.5 border-2 text-sm"
                style={{
                  borderRadius: i % 2 === 0 ? WOBBLY.sm : WOBBLY.md,
                  borderColor: TEAL,
                  color: TEAL_DARK,
                  background: `${TEAL}10`,
                  transform: `rotate(${(i % 3 - 1) * 1.5}deg)`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <SketchArrow className="hidden md:block absolute -left-20 top-[110px] rotate-[-20deg] opacity-60" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6">

        {/* ═══════════════════ ORIGIN PHOTO ═══════════════════ */}
        <section data-reveal className="sketch-reveal mb-16 relative tape-effect">
          <ClickableImg
            src="/case-study/level-up/qu-google-tour-2023.webp"
            alt="Quinnipiac in LA students at Google's Playa Vista campus, summer 2023"
            caption="Summer 2023 — QU in LA students at Google's Spruce Goose hangar. The day that started it all."
          />
        </section>

        <hr className="wobbly-hr" />
        <div className="hidden md:flex justify-end pr-8 -mt-2 mb-2">
          <Doodle animation="wiggle" delay={0.1}><DoodlePencil size={32} /></Doodle>
        </div>

        {/* ═══════════════════ THE SPARK ═══════════════════ */}
        <section id="levelup-spark" className="scroll-mt-28 mb-16">
          <StickyLabel rotate={-1.2}>The Spark</StickyLabel>

          <div data-reveal className="sketch-reveal">
            <p className="text-lg md:text-xl leading-[1.8] mb-5" style={{ color: INK }}>
              In the summer of 2023, Quinnipiac&apos;s &quot;QU in LA&quot; program brought a group of
              students to Los Angeles. I&apos;d just finished my MS at Quinnipiac — most of it
              completed online, from my apartment in LA — and I volunteered to host them at
              Google&apos;s <Keyword>Playa Vista campus</Keyword>.
            </p>
          </div>

          <div data-reveal className="sketch-reveal">
            <p className="text-lg md:text-xl leading-[1.8] mb-5" style={{ color: INK }}>
              I put together two panels: one on early career alignment, one on leadership paths. Got
              Krista Phillip, a QU alum and product lead at Google, to join. Toured them through the
              Spruce Goose hangar, this old airplane manufacturing facility that Google turned into
              one of its most impressive offices.
            </p>
          </div>

          <div data-reveal className="sketch-reveal">
            <p className="text-lg md:text-xl leading-[1.8] mb-5" style={{ color: INK }}>
              I expected a nice afternoon. It turned out to be more than that. The students were
              sharp, full of questions I remembered asking myself not that long ago. One of them
              later called it &quot;one of the best parts of the summer.&quot;
            </p>
          </div>

          <SketchCard rotate={0.5} accent>
            <p className="text-lg md:text-xl leading-[1.8]">
              That day stuck with me. Not just because it went well, but because of a gap I kept
              noticing: these students were smart and motivated, but nobody had taught them the
              practical, strategic work of <Keyword>actually building a career</Keyword>.
            </p>
          </SketchCard>
        </section>

        <hr className="wobbly-hr" />
        <div className="hidden md:flex justify-start pl-6 -mt-2 mb-2">
          <Doodle animation="pop" delay={0.1}><DoodleBulb size={28} /></Doodle>
        </div>

        {/* ═══════════════════ THE PARTNERSHIP ═══════════════════ */}
        <section id="levelup-partnership" className="scroll-mt-28 mb-16">
          <StickyLabel rotate={1}>The Partnership</StickyLabel>

          <div data-reveal className="sketch-reveal mb-5">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: INK }}
            >
              From Tour Guide to Professor
            </h2>
          </div>

          <div data-reveal className="sketch-reveal">
            <p className="text-lg md:text-xl leading-[1.8] mb-5" style={{ color: INK }}>
              Over the next year, I kept in touch with Andres Rosende, the program coordinator
              at Quinnipiac&apos;s School of Communications. We kept circling back to the same
              problem: students were graduating with strong academic credentials but limited
              practical tools for <Keyword>actually landing a job</Keyword>. The messy, human,
              strategic work of building a career wasn&apos;t being covered.
            </p>
          </div>

          <div data-reveal className="sketch-reveal">
            <p className="text-lg md:text-xl leading-[1.8] mb-5" style={{ color: INK }}>
              What if I didn&apos;t just show students around Google for an afternoon? What if I
              designed an entire course?
            </p>
          </div>

          <div data-reveal className="sketch-reveal">
            <p className="text-lg md:text-xl leading-[1.8]" style={{ color: INK }}>
              Andres and the school gave me the green light. I would design the curriculum, build
              the platform, and teach it myself as an <Keyword delay={0.15}>adjunct professor</Keyword> during
              the Spring 2026 QU in LA cohort.
            </p>
          </div>
        </section>

        <hr className="wobbly-hr" />
        <div className="hidden md:flex justify-end pr-12 -mt-2 mb-2">
          <Doodle animation="rock" delay={0.15}><DoodleCoffee size={30} /></Doodle>
        </div>

        {/* ═══════════════════ THE COURSE ═══════════════════ */}
        <section id="levelup-course" className="scroll-mt-28 mb-16">
          <StickyLabel rotate={-0.8}>The Course</StickyLabel>

          <div data-reveal className="sketch-reveal mb-5">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: INK }}
            >
              Four Weeks, Four Modules
            </h2>
            <p className="text-lg md:text-xl leading-[1.8]" style={{ color: INK }}>
              I built the course around two books that changed how I think about careers:
              Meg Jay&apos;s <Keyword>The Defining Decade</Keyword> and Robert Cialdini&apos;s{' '}
              <Keyword delay={0.15}>Pre-Suasion</Keyword>. Four weeks. Each module built on
              the last. Every part had readings, written reflections, and assignments that
              forced students to actually do the thing, not just learn about it.
            </p>
          </div>

          <div data-reveal className="sketch-reveal mb-8">
            <ClickableImg
              src="/case-study/level-up/welcome-back.webp"
              alt="Quinnipiac Los Angeles x Google welcome slide"
              caption="The QU in LA x Google collaboration — projected at the first session"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {courseModules.map((mod, i) => (
              <SketchCard key={mod.name} rotate={(i % 2 === 0 ? -1 : 1) * (0.5 + i * 0.3)}>
                <Thumbtack color={TEAL} left={i % 2 === 0 ? '16px' : 'auto'} />
                <div className="flex items-start gap-4">
                  <IconBubble icon={mod.icon} />
                  <div>
                    <h3
                      className="text-xl font-bold mb-1"
                      style={{ color: TEAL_DARK }}
                    >
                      {mod.name}
                    </h3>
                    <p className="text-sm font-bold mb-2 uppercase tracking-widest" style={{ color: TEAL }}>
                      {mod.week}
                    </p>
                    <p className="text-base leading-[1.7]" style={{ color: PENCIL }}>
                      {mod.text}
                    </p>
                  </div>
                </div>
              </SketchCard>
            ))}
          </div>

          <div data-reveal className="sketch-reveal mt-8">
            <SketchCard rotate={-0.3} accent>
              <p className="text-base md:text-lg leading-[1.8]" style={{ color: INK }}>
                The final deliverable was a comprehensive <Keyword>Personal Action Plan</Keyword>:
                top 10 target companies, springboard job listings with overqualification justifications,
                a professional bio, 5 STAR interview stories, a cover letter template, references,
                and an accountability reflection. Not an academic exercise. A living career document.
              </p>
            </SketchCard>
          </div>
        </section>

        <hr className="wobbly-hr" />
        <div className="hidden md:flex justify-start pl-8 -mt-2 mb-2">
          <Doodle animation="float" delay={0.2}><DoodleBook size={34} /></Doodle>
        </div>

        {/* ═══════════════════ THE PLATFORM ═══════════════════ */}
        <section id="levelup-platform" className="scroll-mt-28 mb-16">
          <StickyLabel rotate={1.2}>The Platform</StickyLabel>

          <div data-reveal className="sketch-reveal mb-5">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: INK }}
            >
              Why I Built My Own LMS
            </h2>
            <p className="text-lg md:text-xl leading-[1.8] mb-5" style={{ color: INK }}>
              I could have used Canvas or Blackboard. But those platforms are built for broad
              university administration, not for a four-student intensive with{' '}
              <Keyword>AI-driven interview practice</Keyword> and automated assignment analysis.
              I needed something specific, so I built it.
            </p>
          </div>

          <div data-reveal className="sketch-reveal">
            <p className="text-lg md:text-xl leading-[1.8] mb-5" style={{ color: INK }}>
              <Keyword delay={0.1}>levelupqu.com</Keyword> is a production Next.js application
              I built from scratch. It runs on Cloud Run, stores data in PostgreSQL via Prisma,
              and integrates Gemini for real-time AI features. Three things it does that no
              off-the-shelf LMS could:
            </p>
          </div>

          <div data-reveal className="sketch-reveal mb-8">
            <ClickableImg
              src="/case-study/level-up-dashboard.webp"
              alt="Level Up LMS dashboard"
              caption="The student dashboard — assignments, deadlines, and course materials in one view"
            />
          </div>

          <div className="space-y-8">
            {features.map((feat, i) => (
              <div key={feat.title}>
                <SketchCard rotate={i % 2 === 0 ? -0.6 : 0.6} accent={i === 0}>
                  <div className="flex items-start gap-4">
                    <IconBubble icon={feat.icon} />
                    <div className="flex-1">
                      <h3
                        className="text-xl md:text-2xl font-bold mb-3"
                        style={{ color: INK }}
                      >
                        {feat.title}
                      </h3>
                      <p className="text-base md:text-lg leading-[1.7]" style={{ color: PENCIL }}>
                        {feat.body}
                      </p>
                    </div>
                  </div>
                </SketchCard>
                {i === 0 && (
                  <div data-reveal className="sketch-reveal mt-8">
                    <ClickableImg
                      src="/case-study/level-up-interview.webp"
                      alt="AI Interview Practice interface"
                      caption="The interview practice tool — voice-to-text with real-time STAR method feedback"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <hr className="wobbly-hr" />
        <div className="hidden md:flex justify-end pr-6 -mt-2 mb-2">
          <Doodle animation="bounce" delay={0.1}><DoodleApple size={28} /></Doodle>
        </div>

        {/* ═══════════════════ THE CLASSROOM ═══════════════════ */}
        <section id="levelup-classroom" className="scroll-mt-28 mb-16">
          <StickyLabel rotate={-1.5}>The Classroom</StickyLabel>

          <div data-reveal className="sketch-reveal mb-5">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: INK }}
            >
              First Day, First Cohort
            </h2>
          </div>

          <div data-reveal className="sketch-reveal">
            <p className="text-lg md:text-xl leading-[1.8] mb-5" style={{ color: INK }}>
              February 4, 2026. Four students.
            </p>
          </div>

          <div data-reveal className="sketch-reveal">
            <p className="text-lg md:text-xl leading-[1.8] mb-5" style={{ color: INK }}>
              In my welcome email, I told them straight: &quot;To be totally candid: this is my
              first time teaching, and I couldn&apos;t have asked for a better{' '}
              <Keyword>inaugural cohort</Keyword>.&quot;
            </p>
          </div>

          <div data-reveal className="sketch-reveal">
            <p className="text-lg md:text-xl leading-[1.8] mb-5" style={{ color: INK }}>
              We met Wednesday evenings at 6:30. Some weeks in person, some virtual — I was
              juggling my day job at Google and travel. I learned quickly why professors take
              forever to grade things. As I put it in one of my weekly emails:
              &quot;Life gets you fast.&quot;
            </p>
          </div>

          <div data-reveal className="sketch-reveal mb-8">
            <ClickableImg
              src="/case-study/level-up/workshop.webp"
              alt="Level Up class session in progress"
              caption="Wednesday evening session — working through career strategy in real time"
            />
          </div>

          <SketchCard rotate={0.4}>
            <p className="text-base md:text-lg leading-[1.8]" style={{ color: PENCIL }}>
              The first week, I assigned the preface and opening chapter of <em>The Defining
              Decade</em> — the one on &quot;Identity Capital.&quot; By week two, they were reading
              about weak ties and sending real LinkedIn messages to professionals they&apos;d never met.
              By week three, they were practicing pre-suasion techniques and building a pitch presentation.
              The pace was fast. That was the point.
            </p>
          </SketchCard>
        </section>

        <hr className="wobbly-hr" />
        <div className="hidden md:flex justify-start pl-10 -mt-2 mb-2">
          <Doodle animation="float" delay={0.2}><DoodleRocket size={32} /></Doodle>
        </div>

        {/* ═══════════════════ THE RESIDENCY ═══════════════════ */}
        <section id="levelup-residency" className="scroll-mt-28 mb-16">
          <StickyLabel rotate={0.8}>The Residency</StickyLabel>

          <div data-reveal className="sketch-reveal mb-5">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: INK }}
            >
              February 27 at Google
            </h2>
          </div>

          <div data-reveal className="sketch-reveal">
            <p className="text-lg md:text-xl leading-[1.8] mb-5" style={{ color: INK }}>
              <Keyword>Google&apos;s Playa Vista campus. 8:30 AM to 5 PM.</Keyword> A full-day
              residency I&apos;d been building toward since the first class session.
            </p>
          </div>

          <div data-reveal className="sketch-reveal">
            <p className="text-lg md:text-xl leading-[1.8] mb-5" style={{ color: INK }}>
              I recruited five Google colleagues to run three panel blocks. Early career insights.
              Leadership perspectives. And then the big one: a judging panel where the students would
              pitch their capstone project and get <Keyword delay={0.15}>live feedback</Keyword> on
              their logic, ROI math, and presentation skills.
            </p>
          </div>

          <div data-reveal className="sketch-reveal mb-8">
            <ClickableImg
              src="/case-study/level-up/panelists.webp"
              alt="Google panelist slide showing Sam Bloch presenting"
              caption="The panel lineup — Google engineers and journalists providing real-world feedback"
            />
          </div>

          <div data-reveal className="sketch-reveal">
            <p className="text-lg md:text-xl leading-[1.8] mb-5" style={{ color: INK }}>
              The students presented &quot;Stop Sleeping Your Day Away&quot; — a process improvement
              pitch for an app called Sheep Counter. They came in with real data: 56% of people
              hit snooze, their group loses about 2 hours every morning getting ready. They built
              a working prototype, scaled their ROI math to Google&apos;s 187,000 employees, and
              calculated over a million minutes of productivity gains.
            </p>
          </div>

          <SketchCard rotate={-0.5} accent>
            <p className="text-lg md:text-xl leading-[1.8]">
              Four weeks earlier, most of them hadn&apos;t heard of the <Keyword>STAR method</Keyword>.
              Now they were standing in a Google conference room, pitching to engineers, fielding
              questions about their data, and walking out with feedback they could actually use.
            </p>
          </SketchCard>
        </section>

        <hr className="wobbly-hr" />
        <div className="hidden md:flex justify-end pr-14 -mt-2 mb-2">
          <Doodle animation="pop" delay={0.15}><DoodleStar size={26} /></Doodle>
        </div>

        {/* ═══════════════════ WHAT THEY SAID ═══════════════════ */}
        <section id="levelup-impact" className="scroll-mt-28 mb-16">
          <StickyLabel rotate={-0.6}>In Their Words</StickyLabel>

          <div data-reveal className="sketch-reveal mb-5">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: INK }}
            >
              What They Took Away
            </h2>
            <p className="text-lg md:text-xl leading-[1.8]" style={{ color: INK }}>
              Right after the residency, I asked each student to fill out a reflection survey.
              These are their words, unedited.
            </p>
          </div>

          <div className="space-y-6">
            {studentQuotes.map((sq, i) => (
              <SketchCard key={i} rotate={(i % 2 === 0 ? -1 : 1) * 0.6}>
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 flex items-center justify-center border-[3px] shrink-0 mt-1"
                    style={{
                      borderRadius: WOBBLY.circle,
                      borderColor: TEAL,
                      background: `${TEAL}15`,
                    }}
                  >
                    <MessageSquare className="w-5 h-5" style={{ color: TEAL }} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-base md:text-lg leading-[1.8] mb-2 italic" style={{ color: INK }}>
                      &quot;{sq.quote}&quot;
                    </p>
                    <p className="text-sm font-bold" style={{ color: TEAL }}>
                      — {sq.context}
                    </p>
                  </div>
                </div>
              </SketchCard>
            ))}
          </div>

          <div data-reveal className="sketch-reveal mt-8">
            <ClickableImg
              src="/case-study/level-up/google-art.webp"
              alt="Students in front of Google art installation"
              caption="The cohort at Google's Playa Vista campus during the residency"
            />
          </div>
        </section>

        <hr className="wobbly-hr" />
        <div className="hidden md:flex justify-start pl-6 -mt-2 mb-2">
          <Doodle animation="wiggle" delay={0.1}><DoodleBriefcase size={30} /></Doodle>
        </div>

        {/* ═══════════════════ UNDER THE HOOD ═══════════════════ */}
        <section id="levelup-engineering" className="scroll-mt-28 mb-16">
          <StickyLabel rotate={1.2}>Under the Hood</StickyLabel>

          <div data-reveal className="sketch-reveal mb-5">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: INK }}
            >
              Engineering the LMS
            </h2>
            <p className="text-lg md:text-xl leading-[1.8]" style={{ color: INK }}>
              Two problems I ran into while building the platform, and how I solved them.
            </p>
          </div>

          <div className="space-y-6">
            {challenges.map((ch, i) => (
              <SketchCard key={ch.title} rotate={i === 0 ? -0.5 : 0.7}>
                <div className="flex items-start gap-4">
                  <IconBubble icon={ch.icon} />
                  <div className="flex-1">
                    <h3
                      className="text-xl font-bold mb-3"
                      style={{ color: INK }}
                    >
                      {ch.title}
                    </h3>
                    <div className="mb-3 p-3 border-2 border-dashed" style={{ borderRadius: WOBBLY.sm, borderColor: '#d4a848', background: '#fef3c720' }}>
                      <p className="text-base leading-[1.7]" style={{ color: PENCIL }}>
                        <span className="font-bold" style={{ color: '#b8860b' }}>Problem:</span>{' '}
                        {ch.problem}
                      </p>
                    </div>
                    <div className="p-3 border-2 border-dashed" style={{ borderRadius: WOBBLY.md, borderColor: TEAL, background: `${TEAL}08` }}>
                      <p className="text-base leading-[1.7]" style={{ color: PENCIL }}>
                        <span className="font-bold" style={{ color: TEAL_DARK }}>Solution:</span>{' '}
                        {ch.solution}
                      </p>
                    </div>
                  </div>
                </div>
              </SketchCard>
            ))}
          </div>
        </section>

        <hr className="wobbly-hr" />

        {/* ═══════════════════ TECH STACK ═══════════════════ */}
        <section className="mb-16">
          <StickyLabel rotate={-0.8}>Tech Stack</StickyLabel>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Next.js 14', icon: <Code className="w-5 h-5" strokeWidth={2.5} style={{ color: TEAL }} /> },
              { name: 'PostgreSQL', icon: <Database className="w-5 h-5" strokeWidth={2.5} style={{ color: TEAL }} /> },
              { name: 'Gemini API', icon: <Zap className="w-5 h-5" strokeWidth={2.5} style={{ color: TEAL }} /> },
              { name: 'Cloud Run', icon: <Cloud className="w-5 h-5" strokeWidth={2.5} style={{ color: TEAL }} /> },
              { name: 'Prisma ORM', icon: <Database className="w-5 h-5" strokeWidth={2.5} style={{ color: TEAL }} /> },
              { name: 'Tailwind CSS', icon: <Palette className="w-5 h-5" strokeWidth={2.5} style={{ color: TEAL }} /> },
              { name: 'NextAuth.js', icon: <Shield className="w-5 h-5" strokeWidth={2.5} style={{ color: TEAL }} /> },
              { name: 'Web Speech', icon: <Mic className="w-5 h-5" strokeWidth={2.5} style={{ color: TEAL }} /> },
            ].map((tech, i) => (
              <div
                key={tech.name}
                data-reveal
                className="sketch-reveal flex flex-col items-center gap-2 p-4 border-2 text-center transition-transform duration-100 hover:rotate-1"
                style={{
                  borderRadius: i % 2 === 0 ? WOBBLY.sm : WOBBLY.md,
                  borderColor: `${TEAL}60`,
                  background: `${TEAL}08`,
                  transform: `rotate(${(i % 3 - 1) * 1}deg)`,
                  boxShadow: `3px 3px 0px 0px ${TEAL}30`,
                }}
              >
                {tech.icon}
                <span className="text-sm font-bold" style={{ color: TEAL_DARK }}>
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        <hr className="wobbly-hr" />

        {/* ═══════════════════ BY THE NUMBERS ═══════════════════ */}
        <section id="levelup-outcomes" className="scroll-mt-28 mb-16">
          <StickyLabel rotate={0.6}>By the Numbers</StickyLabel>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { stat: '4', label: 'Students, 4 weeks' },
              { stat: '5', label: 'Google panelists' },
              { stat: '1', label: 'Custom LMS from scratch' },
            ].map((s, i) => (
              <div
                key={s.label}
                data-reveal
                className="sketch-reveal flex flex-col items-center justify-center p-6 border-[3px] text-center"
                style={{
                  borderRadius: WOBBLY.circle,
                  borderColor: TEAL,
                  background: `${TEAL}0D`,
                  boxShadow: `4px 4px 0px 0px ${TEAL}`,
                  transform: `rotate(${(i - 1) * 2}deg)`,
                }}
              >
                <span
                  className="text-4xl md:text-5xl font-bold block mb-1"
                  style={{ color: TEAL }}
                >
                  {s.stat}
                </span>
                <span className="text-sm" style={{ color: PENCIL }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <hr className="wobbly-hr" />
        <div className="hidden md:flex justify-end pr-10 -mt-2 mb-2">
          <Doodle animation="bounce" delay={0.2}><DoodleGradCap size={34} /></Doodle>
        </div>

        {/* ═══════════════════ LOOKING BACK ═══════════════════ */}
        <section id="levelup-reflection" className="scroll-mt-28 mb-16">
          <StickyLabel rotate={-1}>Looking Back</StickyLabel>

          <div data-reveal className="sketch-reveal mb-5">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: INK }}
            >
              What I Learned
            </h2>
          </div>

          <div data-reveal className="sketch-reveal">
            <p className="text-lg md:text-xl leading-[1.8] mb-5" style={{ color: INK }}>
              In my farewell email to the cohort, I wrote: &quot;You weren&apos;t just students
              to me; you were an inaugural cohort that taught me so much about how to lead, how
              to listen, and how to stay &apos;Head-Up&apos; even when the schedule gets busy.&quot;
            </p>
          </div>

          <div data-reveal className="sketch-reveal">
            <p className="text-lg md:text-xl leading-[1.8] mb-5" style={{ color: INK }}>
              I posted about the experience on LinkedIn. One of the Google volunteers
              commented: &quot;Rewarding experience to interact with brilliant peers
              and students.&quot;
            </p>
          </div>

          <div data-reveal className="sketch-reveal mb-8">
            <ClickableImg
              src="/case-study/level-up/team-photo.webp"
              alt="Sam with students at Google campus"
              caption="The inaugural cohort, Spruce Goose hangar"
            />
          </div>

          <SketchCard rotate={-0.3} accent>
            <p className="text-lg md:text-xl leading-[1.8] mb-4" style={{ color: INK }}>
              This project sits at the intersection of everything I care about: building software
              that solves real problems, teaching people things that matter, and doing it all while
              holding down the day job. The LMS is production code. The curriculum is mine. The
              students are real people with real careers ahead of them.
            </p>
            <p
              className="text-xl md:text-2xl leading-[1.7] font-bold"
              style={{ color: TEAL_DARK }}
            >
              The last thing I told them was from the book we&apos;d spent four weeks reading:
              &quot;<Keyword>It&apos;s up to you to define your decade.</Keyword>&quot;
            </p>
          </SketchCard>
        </section>

        <hr className="wobbly-hr" />
        <div className="hidden md:flex justify-start pl-12 -mt-2 mb-2">
          <Doodle animation="float" delay={0.15}><DoodlePaperPlane size={30} /></Doodle>
        </div>

        {/* ═══════════════════ CTAs ═══════════════════ */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="https://levelupqu.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border-[3px] text-lg transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1B7A7E] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none no-underline"
              style={{
                borderRadius: WOBBLY.btn,
                borderColor: TEAL_DARK,
                background: TEAL,
                boxShadow: `4px 4px 0px 0px ${TEAL_DARK}`,
                fontWeight: 700,
                color: 'white',
              }}
            >
              <ExternalLink className="w-5 h-5" strokeWidth={2.5} />
              Visit the Live Platform
            </a>
            <a
              href="/level-up-syllabus.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border-[3px] text-lg transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#2d2d2d] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none no-underline"
              style={{
                borderRadius: WOBBLY.btn,
                borderColor: INK,
                background: PAPER,
                boxShadow: `4px 4px 0px 0px ${INK}`,
                fontWeight: 700,
                color: INK,
              }}
            >
              <FileText className="w-5 h-5" strokeWidth={2.5} />
              View the Syllabus PDF
            </a>
          </div>
        </section>

        {/* ═══════════════════ FOOTER ═══════════════════ */}
        <footer
          className="pt-12 pb-32 text-center border-t-[3px] border-dashed"
          style={{ borderColor: `${TEAL}40` }}
        >
          <p className="text-sm mb-6" style={{ color: PENCIL }}>
            Course Design, Full-Stack Development & Instruction · 2023–2026
          </p>
          <button
            onClick={() => navigate('/projects')}
            className="inline-flex items-center gap-2 px-6 py-2 border-2 text-base transition-all duration-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#2d2d2d]"
            style={{
              borderRadius: WOBBLY.btn,
              borderColor: INK,
              background: PAPER,
              boxShadow: `3px 3px 0px 0px ${INK}`,
              fontWeight: 700,
              color: INK,
            }}
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            Back to Projects
          </button>
        </footer>
      </div>

      {/* ═══════════════════ LIGHTBOX ═══════════════════ */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-6"
          style={{ background: 'rgba(45, 45, 45, 0.9)', backdropFilter: 'blur(12px)' }}
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute top-6 right-6 z-[201] w-12 h-12 flex items-center justify-center border-[3px] transition-all duration-100 hover:rotate-6"
            style={{
              borderRadius: WOBBLY.circle,
              borderColor: 'white',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
            }}
            onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
            aria-label="Close"
          >
            <X className="w-6 h-6" strokeWidth={2.5} />
          </button>
          <img
            src={lightbox}
            alt=""
            className="max-w-full max-h-[90vh] object-contain"
            style={{ borderRadius: WOBBLY.md, border: '4px solid white', boxShadow: `8px 8px 0px 0px ${TEAL}` }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default LevelUpCaseStudy;
