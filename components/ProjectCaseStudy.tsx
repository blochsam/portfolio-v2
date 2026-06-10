import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Download, Github, X } from 'lucide-react';
import { COLORS } from '../constants';
import InteractiveSitemap from './InteractiveSitemap';
import { SITEMAP } from '../sitemap';
import { usePageMeta } from '../utils/usePageMeta';
import { getCaseStudyMeta } from '../data/routeMeta';
import NextProject from './NextProject';

const PROJECT_TITLES: Record<string, string> = {
  'portfolio': 'My Portfolio Website',
  'dcade': 'The D-Cade',
  'level-up': 'Level Up',
  'uc-calnat': 'UC California Climate Stewards',
  'zoo-report': 'Augmented Reality Detroit Zoo App',
  'fudge': 'Fudge',
  'smart-lockers': 'Smart Lockers',
  'space-utilization': 'Pacific Medical School Space Evaluation',
  'yt-quality-global': 'YouTube Global Quality Framework',
  'google-legal-ops': 'Legal Ops Workflow Automation',
  'yt-sql-dashboards': 'Predictive SQL Performance Dashboards',
  'cube-ux-lead': 'the CUBE Publishing UX',
  'michigan-speech': 'Michigan Speech Coaches Platform',
  'ai-safety-upstream': 'Upstream AI Safety Protocols',
};

const CalNatCaseStudy = lazy(() => import('./CalNatCaseStudy'));
const PortfolioCaseStudyB = lazy(() => import('./PortfolioCaseStudy'));
const DcadeCaseStudy = lazy(() => import('./DcadeCaseStudy'));
const ZooReportCaseStudy = lazy(() => import('./ZooReportCaseStudy'));
const SmartLockersCaseStudy = lazy(() => import('./SmartLockersCaseStudy'));
const FudgeCaseStudy = lazy(() => import('./FudgeCaseStudy'));
const LevelUpCaseStudy = lazy(() => import('./LevelUpCaseStudy'));
const SpaceUtilizationCaseStudy = lazy(() => import('./SpaceUtilizationCaseStudy'));
const ProjectCaseStudy: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const title = projectId ? (PROJECT_TITLES[projectId] || projectId) : 'Project';
  usePageMeta(getCaseStudyMeta(projectId || ''));
  const [enlargedImage, setEnlargedImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setEnlargedImage(null);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  if (!projectId) return <Navigate to="/projects" replace />;

  const handleDownloadPDF = async () => {
    const { generateCaseStudyPdfHtml } = await import('../utils/generateCaseStudyPdf');
    const html = generateCaseStudyPdfHtml(projectId, window.location.origin);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank', 'width=900,height=700');
    if (win) {
      win.onload = () => URL.revokeObjectURL(url);
    } else {
      URL.revokeObjectURL(url);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120; // Framing offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const isDcade = projectId === 'dcade';
  const isLevelUp = projectId === 'level-up';
  const isZooReport = projectId === 'zoo-report';
  const isCalNat = projectId === 'uc-calnat';
  const isPortfolio = projectId === 'portfolio';
  const isSmartLockers = projectId === 'smart-lockers';
  const isFudge = projectId === 'fudge';
  const isSpaceUtilization = projectId === 'space-utilization';

  // Immersive case studies get their own components
  if (isCalNat || isPortfolio || isDcade || isZooReport || isSmartLockers || isFudge || isLevelUp || isSpaceUtilization) {
    const Component = isCalNat ? CalNatCaseStudy
      : isDcade ? DcadeCaseStudy
      : isZooReport ? ZooReportCaseStudy
      : isSmartLockers ? SmartLockersCaseStudy
      : isFudge ? FudgeCaseStudy
      : isLevelUp ? LevelUpCaseStudy
      : isSpaceUtilization ? SpaceUtilizationCaseStudy
      : PortfolioCaseStudyB;
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
        </div>
      }>
        <Component />
        <NextProject currentId={projectId} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white selection:bg-[#24A2A7]/30 font-sans">
      <style>{`
        @media print {
          @page { margin: 2cm; }
          .no-print { display: none !important; }
          body, html { background: white !important; color: #1a1a1a !important; padding: 0 !important; margin: 0 !important; }
          body > div { background: white !important; }
          .bg-[#121212], .bg-[#1a1a1a], .bg-[#161616], .content-frame, .nav-frame { 
            background: white !important; 
            border: 1px solid #e5e5e5 !important; 
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .text-white, .text-gray-400, .text-gray-300 { color: #1a1a1a !important; }
          .text-gray-500 { color: #555 !important; }
          .text-[#24A2A7] { color: #24A2A7 !important; }
          .border-white\\/5, .border-white\\/10 { border-color: #e5e5e5 !important; }
          .sticky { position: relative !important; top: 0 !important; }
          .case-study-container { display: block !important; max-width: 100% !important; padding: 0 !important; }
          main.content-frame { display: block !important; width: 100% !important; padding: 1.5cm 0 !important; }
          section { page-break-after: always !important; page-break-inside: avoid !important; margin-bottom: 1.5cm !important; padding-top: 0.5cm !important; }
          section:last-child { page-break-after: auto !important; }
          h1 { font-size: 22pt !important; font-weight: 700 !important; color: #1a1a1a !important; }
          h2 { font-size: 18pt !important; }
          h3, h4 { font-size: 12pt !important; font-weight: 600 !important; }
          p { font-size: 10pt !important; line-height: 1.6 !important; color: #333 !important; }
          .aspect-video, .aspect-\\[16\\/9\\], .aspect-\\[4\\/3\\] { background: #f8f8f8 !important; border: 1px solid #e5e5e5 !important; }
          table { border-collapse: collapse !important; width: 100% !important; font-size: 10pt !important; }
          th, td { border: 1px solid #e5e5e5 !important; padding: 8px 10px !important; text-align: left !important; }
          th { background: #f5f5f5 !important; font-weight: 600 !important; color: #1a1a1a !important; }
          td { color: #333 !important; }
          button[type="button"] { border: 1px solid #e5e5e5 !important; }
          img { max-width: 100% !important; height: auto !important; }
        }
        .sidebar-link {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0.4;
          display: block;
          width: 100%;
          text-align: left;
        }
        .sidebar-link:hover {
          opacity: 1;
          color: #24A2A7;
          transform: translateX(4px);
        }
        .nav-frame {
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(22, 22, 22, 0.6);
          backdrop-filter: blur(12px);
        }
        .content-frame {
          background: rgba(22, 22, 22, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: 0 2px 24px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(8px);
        }
        .case-study-container {
          align-items: start;
        }
      `}</style>

      {/* Under Construction view */}
      {!isPortfolioCaseStudy && !isDcade && !isLevelUp && !isZooReport && (
        <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white p-12 print:bg-white print:text-black">
          <div className="text-center print:text-black">
            <h2 className="text-2xl font-black mb-4 print:text-black">Under Construction</h2>
            <p className="text-gray-500 mb-8 print:text-gray-700">Full case study for this artifact is currently being archived.</p>
            <button onClick={() => navigate('/projects')} className="text-[#24A2A7] font-bold uppercase tracking-widest text-xs no-print">Return to Archive</button>
          </div>
        </div>
      )}

      {/* Full case study view */}
      {(isPortfolioCaseStudy || isDcade || isLevelUp || isZooReport) && (
        <>
      {/* Floating Utility Actions */}
      <div className="fixed bottom-20 right-6 z-[70] flex items-center gap-4 no-print">
        <a 
          href="https://github.com/sam-bloch" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-16 h-16 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-2xl transition-[color,transform] hover:scale-110 active:scale-90 text-gray-400 hover:text-white"
          title="View GitHub Repository"
        >
          <Github className="w-8 h-8" />
        </a>
        <button
          onClick={handleDownloadPDF}
          className="h-14 px-5 rounded-full flex items-center justify-center gap-2 shadow-2xl transition-transform hover:scale-105 active:scale-95 group"
          style={{ backgroundColor: COLORS.teal, color: COLORS.charcoal }}
          aria-label="Download case study PDF"
        >
          <Download className="w-6 h-6" />
          <span className="text-xs font-black uppercase tracking-widest">PDF</span>
        </button>
      </div>

      {/* Global Navigation - Fixed Top */}
      <button
        onClick={() => navigate('/projects')}
        className="fixed top-8 left-8 md:left-12 z-[60] flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-[color,border-color,transform] bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/5 hover:border-[#24A2A7]/40 shadow-xl active:scale-95 no-print"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Archive
      </button>

      {/* Primary Grid: Slim Sidebar (Desktop) + Content */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-6 md:gap-10 px-5 md:px-10 pt-28 pb-32 relative case-study-container">
        
        {/* Slim Sticky Nav - Desktop */}
        <aside className="hidden lg:block lg:sticky lg:top-28 h-fit z-50 order-2 lg:order-1 no-print">
          <nav className="nav-frame rounded-2xl p-5 space-y-6 relative overflow-hidden">
            {isPortfolioCaseStudy ? (
              <div className="space-y-2">
                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#24A2A7]">OVERVIEW</h4>
                <ul className="space-y-1.5 text-[12px] font-semibold text-gray-500">
                  <li><button onClick={() => scrollToSection('problem')} className="sidebar-link">Context</button></li>
                  <li><button onClick={() => scrollToSection('challenge')} className="sidebar-link">Challenge</button></li>
                  <li><button onClick={() => scrollToSection('solution')} className="sidebar-link">Design</button></li>
                  <li><button onClick={() => scrollToSection('progress')} className="sidebar-link">Solution</button></li>
                  <li><button onClick={() => scrollToSection('sitemap')} className="sidebar-link">Site Map</button></li>
                  <li><button onClick={() => scrollToSection('decisions')} className="sidebar-link">Key Decisions</button></li>
                  <li><button onClick={() => scrollToSection('accessibility')} className="sidebar-link">Accessibility</button></li>
                </ul>
              </div>
            ) : isDcade ? (
              <div className="space-y-2">
                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#24A2A7]">OVERVIEW</h4>
                <ul className="space-y-1.5 text-[12px] font-semibold text-gray-500">
                  <li><button onClick={() => scrollToSection('dcade-problem')} className="sidebar-link">Context & Challenge</button></li>
                  <li><button onClick={() => scrollToSection('dcade-solution')} className="sidebar-link">Solution</button></li>
                  <li><button onClick={() => scrollToSection('dcade-methodology')} className="sidebar-link">Methodology</button></li>
                  <li><button onClick={() => scrollToSection('dcade-highlights')} className="sidebar-link">Highlights</button></li>
                  <li><button onClick={() => scrollToSection('dcade-design')} className="sidebar-link">Design Decisions</button></li>
                  <li><button onClick={() => scrollToSection('dcade-process')} className="sidebar-link">Process</button></li>
                  <li><button onClick={() => scrollToSection('dcade-outcomes')} className="sidebar-link">Outcomes</button></li>
                </ul>
              </div>
            ) : isZooReport ? (
              <div className="space-y-2">
                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#24A2A7]">OVERVIEW</h4>
                <ul className="space-y-1.5 text-[12px] font-semibold text-gray-500">
                  <li><button onClick={() => scrollToSection('zoo-context')} className="sidebar-link">Context</button></li>
                  <li><button onClick={() => scrollToSection('zoo-paper-demo')} className="sidebar-link">Paper Prototype Demo</button></li>
                  <li><button onClick={() => scrollToSection('zoo-design')} className="sidebar-link">Design</button></li>
                  <li><button onClick={() => scrollToSection('zoo-wireframe-demo')} className="sidebar-link">Final Wireframe Demo</button></li>
                  <li><button onClick={() => scrollToSection('zoo-decisions')} className="sidebar-link">Key Decisions</button></li>
                </ul>
              </div>
            ) : (
              <div className="space-y-2">
                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#24A2A7]">OVERVIEW</h4>
                <ul className="space-y-1.5 text-[12px] font-semibold text-gray-500">
                  <li><button onClick={() => scrollToSection('levelup-summary')} className="sidebar-link">Executive Summary</button></li>
                  <li><button onClick={() => scrollToSection('levelup-course')} className="sidebar-link">Pedagogical Design</button></li>
                  <li><button onClick={() => scrollToSection('levelup-platform')} className="sidebar-link">Platform & Architecture</button></li>
                  <li><button onClick={() => scrollToSection('levelup-challenges')} className="sidebar-link">Engineering Challenges</button></li>
                  <li><button onClick={() => scrollToSection('levelup-journey')} className="sidebar-link">Development Journey</button></li>
                  <li><button onClick={() => scrollToSection('levelup-outcomes')} className="sidebar-link">Outcomes</button></li>
                </ul>
              </div>
            )}
          </nav>
        </aside>

        {/* Content - Case study aligned with PDF */}
        <main className="content-frame rounded-2xl md:rounded-3xl p-6 md:p-12 lg:p-16 order-1 lg:order-2 max-w-3xl">
          
          {isPortfolioCaseStudy && (
            <>
          {/* Header */}
          <header className="mb-10 md:mb-12">
            <p className="text-xs text-[#24A2A7] font-medium mb-3">Portfolio Redesign · 2025</p>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-4">
              Personal Portfolio Redesign
            </h1>
            <p className="text-gray-500 text-[15px] leading-relaxed">
              Design, Development & 3D · React 19, TypeScript, Spline, Tailwind v4
            </p>
          </header>

          {/* Executive Summary */}
          <section className="mb-12">
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7]">
              My old portfolio was a static site I hadn't touched since college. It worked, but it didn't <em>do</em> anything. I rebuilt it from scratch as a dual-view experience I call the Samulation: a clean 2D editorial site for mobile and lower-spec devices, and an interactive 3D workstation (built in Spline) for desktops that can handle it. Both views share the same content and navigation. The whole thing runs on React 19 with TypeScript, Tailwind v4, and Vite 6. I used the project as an excuse to go deep on AI-assisted development, 3D web design, and the kind of performance work that most portfolio sites skip entirely.
            </p>
          </section>

          {/* Context & Before State */}
          <section id="problem" className="scroll-mt-28 mb-12">
            <span className="text-[11px] font-medium text-[#24A2A7]/90 mb-3 block">Context & Opportunity</span>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-6">
              My previous site had been running for years, basically untouched since I graduated from Michigan State. White background, teal accent, left-aligned nav with eight categories (home, about, project management, web development, ux & design, research & writing, video, personal projects), hero imagery with overlays, "my story" and "services" sections. It told people who I was, but it didn't show what I could actually build.
            </p>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-4">I had a few specific goals:</p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-[15px] border-collapse border border-white/10 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-white/5">
                    <th className="text-left py-3 px-4 font-semibold text-white border-b border-white/10">Goal</th>
                    <th className="text-left py-3 px-4 font-semibold text-white border-b border-white/10">Description</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">Actually use AI</td>
                    <td className="py-3 px-4">Not slap a chatbot on it. Use generative AI as a real part of the development workflow.</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">Level up technically</td>
                    <td className="py-3 px-4">Go from static HTML/CSS to a real React architecture with routing, state management, and component design</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">Build in 3D</td>
                    <td className="py-3 px-4">Use Spline and meshy.ai to create a spatial, explorable environment</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">Prove the thesis</td>
                    <td className="py-3 px-4">Make a portfolio that <em>demonstrates</em> the skills it describes, not just lists them</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-6">
              React made sense as the foundation. Component architecture meant I could build the 2D and 3D views as separate experiences that share the same content layer. The ecosystem already had solid Spline and AI API support, and React Router v7 gave me real URLs people can bookmark and share.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setEnlargedImage({ src: '/case-study/before-home.webp', alt: "Previous portfolio home page - hey, i'm sam" })}
                className="rounded-xl overflow-hidden border border-white/5 text-left hover:border-[#24A2A7]/40 transition-colors cursor-zoom-in group"
              >
                <img src="/case-study/before-home.webp" alt="Previous portfolio home page - hey, i'm sam" className="w-full h-auto group-hover:opacity-90 transition-opacity" loading="lazy" />
                <p className="text-[11px] text-gray-500 px-3 py-2 bg-white/[0.02]">Before: Home · Click to enlarge</p>
              </button>
              <button
                type="button"
                onClick={() => setEnlargedImage({ src: '/case-study/before-about.webp', alt: "Previous portfolio about page - my story and services" })}
                className="rounded-xl overflow-hidden border border-white/5 text-left hover:border-[#24A2A7]/40 transition-colors cursor-zoom-in group"
              >
                <img src="/case-study/before-about.webp" alt="Previous portfolio about page - my story and services" className="w-full h-auto group-hover:opacity-90 transition-opacity" loading="lazy" />
                <p className="text-[11px] text-gray-500 px-3 py-2 bg-white/[0.02]">Before: About · Click to enlarge</p>
              </button>
            </div>
          </section>

          {/* The Challenge */}
          <section id="challenge" className="scroll-mt-28 mb-12">
            <span className="text-[11px] font-medium text-[#24A2A7]/90 mb-3 block">The Challenge</span>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-4">
              The hard part wasn&apos;t making it look good. It was making it <em>prove something</em>. Most portfolios just list skills. I wanted mine to actually demonstrate them:
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-[15px] border-collapse border border-white/10 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-white/5">
                    <th className="text-left py-3 px-4 font-semibold text-white border-b border-white/10 w-1/4">Requirement</th>
                    <th className="text-left py-3 px-4 font-semibold text-white border-b border-white/10">Description</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">Show, don't tell</td>
                    <td className="py-3 px-4">If I say I think in systems, the site itself should prove it</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">Work for everyone</td>
                    <td className="py-3 px-4">Someone on a five-year-old phone and someone on a beefy desktop should both have a good experience</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">Never break</td>
                    <td className="py-3 px-4">No blank screens, no laggy WebGL on a phone, no dead ends</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">Feel handmade</td>
                    <td className="py-3 px-4">You should be able to tell a person built this, not a template</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7]">
              The old site was fine. Fine doesn't stick with people.
            </p>
          </section>

          {/* Design Approach & Wireframe */}
          <section id="solution" className="scroll-mt-28 mb-12">
            <span className="text-[11px] font-medium text-[#24A2A7]/90 mb-3 block">Design Approach</span>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-4">
              Three ideas guided every visual and interaction decision:
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-[15px] border-collapse border border-white/10 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-white/5">
                    <th className="text-left py-3 px-4 font-semibold text-white border-b border-white/10 w-1/4">Pillar</th>
                    <th className="text-left py-3 px-4 font-semibold text-white border-b border-white/10">Description</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">Tech-Noir aesthetics</td>
                    <td className="py-3 px-4">Teal on charcoal, sharp type, subtle gradients. Professional but not corporate. The old site was white and airy. This one has a point of view.</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">Editorial minimalism</td>
                    <td className="py-3 px-4">Let content breathe. No clutter. The 2D side should read like a magazine, not a brochure.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">Human touch</td>
                    <td className="py-3 px-4">Ambient audio, a cat with her own card, a guitar that opens my About page. The site should feel like it belongs to a real person, not a LinkedIn profile.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-6">
              I wireframed the structure before writing any code. Logo, nav, 3D workstation placeholder, footer. Getting the bones right first.
            </p>
            <button
              type="button"
              onClick={() => setEnlargedImage({ src: '/case-study/wireframe.webp', alt: "Portfolio wireframe - layout before development" })}
              className="rounded-xl overflow-hidden border border-white/5 mb-6 text-left hover:border-[#24A2A7]/40 transition-colors cursor-zoom-in group w-full"
            >
              <img src="/case-study/wireframe.webp" alt="Portfolio wireframe - layout before development" className="w-full h-auto group-hover:opacity-90 transition-opacity" loading="lazy" />
              <p className="text-[11px] text-gray-500 px-3 py-2 bg-white/[0.02]">Wireframe: Structure before build · Click to enlarge</p>
            </button>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7]">
              Even at this stage you can see the dual-view idea taking shape: two entry points, same destinations.
            </p>
          </section>

          {/* Solution: The 3D Scene */}
          <section id="progress" className="scroll-mt-28 mb-12">
            <span className="text-[11px] font-medium text-[#24A2A7]/90 mb-3 block">Solution Overview</span>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-4">
              <strong>The Samulation</strong> has two layers:
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-[15px] border-collapse border border-white/10 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-white/5">
                    <th className="text-left py-3 px-4 font-semibold text-white border-b border-white/10 w-1/4">Layer</th>
                    <th className="text-left py-3 px-4 font-semibold text-white border-b border-white/10">Description</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">2D editorial</td>
                    <td className="py-3 px-4">A clean, scrollable site with resume, projects, and about sections. This is what mobile visitors and lower-spec devices get by default. It reads well, loads fast, and doesn't require any GPU muscle.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">3D workstation</td>
                    <td className="py-3 px-4">A Spline-powered environment where you're standing at my desk. Orbit the camera, click the MacBook, monitors, books, fountain pen. Each object maps to a content theme: Trust & Safety, AI & Systems, Leadership, Consulting. The guitar opens my About story. Sesame (my cat) has her own card.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-6">
              A toggle lets you switch between 2D and 3D whenever you want. Same menu, same content, different wrapper.
            </p>
            <button
              type="button"
              onClick={() => setEnlargedImage({ src: '/case-study/3d-scene.webp', alt: "The Samulation - 3D workstation scene" })}
              className="rounded-xl overflow-hidden border border-white/5 text-left hover:border-[#24A2A7]/40 transition-colors cursor-zoom-in group w-full"
            >
              <img src="/case-study/3d-scene.webp" alt="The Samulation - 3D workstation scene" className="w-full h-auto group-hover:opacity-90 transition-opacity" loading="lazy" />
              <p className="text-[11px] text-gray-500 px-3 py-2 bg-white/[0.02]">The Samulation: 3D workstation · Click to enlarge</p>
            </button>

            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mt-8 mb-4">
              I built the scene in Spline and generated assets with Meshy.ai. The workflow bounced between spatial design, AI-powered 3D generation, and React development.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setEnlargedImage({ src: '/case-study/spline-workflow.webp', alt: "Spline workflow - Sam's Desk scene creation" })}
                className="rounded-xl overflow-hidden border border-white/5 text-left hover:border-[#24A2A7]/40 transition-colors cursor-zoom-in group"
              >
                <img src="/case-study/spline-workflow.webp" alt="Spline workflow - Sam's Desk scene creation" className="w-full h-auto group-hover:opacity-90 transition-opacity" loading="lazy" />
                <p className="text-[11px] text-gray-500 px-3 py-2 bg-white/[0.02]">Spline: Building Sam&apos;s Desk · Click to enlarge</p>
              </button>
              <button
                type="button"
                onClick={() => setEnlargedImage({ src: '/case-study/meshy-workflow.webp', alt: "Meshy.ai workflow - generating 3D assets" })}
                className="rounded-xl overflow-hidden border border-white/5 text-left hover:border-[#24A2A7]/40 transition-colors cursor-zoom-in group"
              >
                <img src="/case-study/meshy-workflow.webp" alt="Meshy.ai workflow - generating 3D assets" className="w-full h-auto group-hover:opacity-90 transition-opacity" loading="lazy" />
                <p className="text-[11px] text-gray-500 px-3 py-2 bg-white/[0.02]">Meshy.ai: Generating 3D assets · Click to enlarge</p>
              </button>
              <button
                type="button"
                onClick={() => setEnlargedImage({ src: '/case-study/code-screenshot.webp', alt: "Portfolio code - index.html" })}
                className="rounded-xl overflow-hidden border border-white/5 text-left hover:border-[#24A2A7]/40 transition-colors cursor-zoom-in group"
              >
                <img src="/case-study/code-screenshot.webp" alt="Portfolio code - index.html" className="w-full h-auto group-hover:opacity-90 transition-opacity" loading="lazy" />
                <p className="text-[11px] text-gray-500 px-3 py-2 bg-white/[0.02]">Code: index.html · Click to enlarge</p>
              </button>
            </div>

            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mt-10 mb-4">
              End result: a modular React codebase powering both the 2D and 3D experiences from a single source of truth.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setEnlargedImage({ src: '/case-study/hero-desktop.webp', alt: "New site - hero section desktop" })}
                className="rounded-xl overflow-hidden border border-white/5 text-left hover:border-[#24A2A7]/40 transition-colors cursor-zoom-in group"
              >
                <img src="/case-study/hero-desktop.webp" alt="New site - hero section desktop" className="w-full h-auto group-hover:opacity-90 transition-opacity" loading="lazy" />
                <p className="text-[11px] text-gray-500 px-3 py-2 bg-white/[0.02]">New site: Hero · Click to enlarge</p>
              </button>
              <button
                type="button"
                onClick={() => setEnlargedImage({ src: '/case-study/resume-page.webp', alt: "New site - resume page" })}
                className="rounded-xl overflow-hidden border border-white/5 text-left hover:border-[#24A2A7]/40 transition-colors cursor-zoom-in group"
              >
                <img src="/case-study/resume-page.webp" alt="New site - resume page" className="w-full h-auto group-hover:opacity-90 transition-opacity" loading="lazy" />
                <p className="text-[11px] text-gray-500 px-3 py-2 bg-white/[0.02]">New site: Resume · Click to enlarge</p>
              </button>
            </div>
          </section>

          {/* Site Map */}
          <section id="sitemap" className="scroll-mt-28 mb-12">
            <span className="text-[11px] font-medium text-[#24A2A7]/90 mb-3 block">Site Architecture</span>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-4">
              Here's how the dual-view structure maps out. Two entry points, shared navigation to Resume, Projects, and About.
            </p>
            <InteractiveSitemap data={SITEMAP} />
          </section>

          {/* Key Design Decisions */}
          <section id="decisions" className="scroll-mt-28 mb-12">
            <span className="text-[11px] font-medium text-[#24A2A7]/90 mb-3 block">Key Design Decisions</span>
            
            <h4 className="text-sm font-semibold text-white mt-6 mb-2">Why Dual-View?</h4>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-4">
              Not every device can run a WebGL scene. Not every visitor wants one. I'm not going to force a 3D experience on someone browsing on their phone at lunch.
            </p>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-6">
              So the site detects what you're working with and serves the right experience. Mobile and lower-spec devices get the 2D editorial view. Desktop users can opt into the 3D Samulation. Both paths have the same content, so nobody misses anything.
            </p>

            <h4 className="text-sm font-semibold text-white mt-6 mb-2">Why a Desk?</h4>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-4">
              The 3D workstation metaphor works for a few reasons:
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-[15px] border-collapse border border-white/10 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-white/5">
                    <th className="text-left py-3 px-4 font-semibold text-white border-b border-white/10 w-1/4">Reason</th>
                    <th className="text-left py-3 px-4 font-semibold text-white border-b border-white/10">Description</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">It sticks</td>
                    <td className="py-3 px-4">People remember "the site with the desk" way more than "the site with the resume"</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">It proves the work</td>
                    <td className="py-3 px-4">It shows I can ship 3D, manage WebGL performance, and think spatially</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">It grows</td>
                    <td className="py-3 px-4">New content = new desk object. The architecture supports it without a redesign.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Accessibility */}
          <section id="accessibility" className="scroll-mt-28 mb-12">
            <span className="text-[11px] font-medium text-[#24A2A7]/90 mb-3 block">Accessibility as a Design Constraint</span>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-4">
              I didn't bolt accessibility on at the end. It shaped the architecture from day one.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-[15px] border-collapse border border-white/10 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-white/5">
                    <th className="text-left py-3 px-4 font-semibold text-white border-b border-white/10 w-1/4">Consideration</th>
                    <th className="text-left py-3 px-4 font-semibold text-white border-b border-white/10">Approach</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">Device capability</td>
                    <td className="py-3 px-4">3D rendering is GPU-intensive. On older phones it'll stutter or fail. The site detects capability and falls back to 2D automatically. Nobody gets a broken page.</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">User choice</td>
                    <td className="py-3 px-4">Some people just want to read. The toggle lets you switch from 3D to 2D at any time. Your call, not the device's.</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">Performance details</td>
                    <td className="py-3 px-4">I killed <code className="text-[#24A2A7]/90">backdrop-blur</code> over the WebGL canvas when overlays open because it was causing visible jank. A solid <code className="text-[#24A2A7]/90">bg-black/70</code> dims the scene without the GPU hit. I also discovered that <code className="text-[#24A2A7]/90">overflow-x: hidden</code> silently creates a nested scrolling context (per CSS spec), which was making scroll feel "stuck" on one of my case study pages. Swapping to <code className="text-[#24A2A7]/90">overflow-x: clip</code> fixed it instantly. Small details like these compound.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">Consistent navigation</td>
                    <td className="py-3 px-4">2D or 3D, the same menu items are always there. Content overlays use the same pattern everywhere: click to open, click outside or "Return" to close. Predictability means people don't have to re-learn anything.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* What I Learned */}
          <section className="mb-12">
            <span className="text-[11px] font-medium text-[#24A2A7]/90 mb-3 block">What I Learned</span>
            <ul className="text-gray-300 text-[15px] md:text-base leading-[1.7] space-y-2">
              <li><strong>Accessibility is design, not charity</strong> — The dual-view system and fallbacks aren't compromises. They make the product better for everyone, including the people on the best hardware.</li>
              <li><strong>Performance is felt, not seen</strong> — Killing <code className="text-[#24A2A7]/90">backdrop-blur</code> over WebGL, replacing <code className="text-[#24A2A7]/90">useState</code> scroll handlers with direct DOM refs, swapping <code className="text-[#24A2A7]/90">overflow-x: hidden</code> for <code className="text-[#24A2A7]/90">clip</code> to eliminate nested scroll contexts. Visitors can't name what changed, but they feel it.</li>
              <li><strong>AI is a collaborator, not a replacement</strong> — I used Claude as a development partner throughout this build: debugging CSS spec behavior, iterating on scroll animations, tuning ambient particles across 14+ rounds of adjustment. The AI helped me move faster, but the creative decisions and the stubbornness to get things right were mine.</li>
              <li><strong>Ship, then obsess</strong> — The case study pages went from header-heavy to prose-first. The particles got tuned, re-tuned, and tuned again. The Discord Clyde logo went through half a dozen SVG iterations. Good work is a willingness to keep going.</li>
            </ul>
          </section>

          {/* CTA */}
          <div className="pt-10 mt-10 border-t border-white/5">
            <a href="https://github.com/sam-bloch" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#24A2A7] transition-colors text-sm">
              View open source repository →
            </a>
          </div>
            </>
          )}

          {isDcade && (
            <>
          {/* D-Cade Header */}
          <header className="mb-10 md:mb-12">
            <p className="text-xs text-[#24A2A7] font-medium mb-3">The D-Cade · 2020</p>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-4">
              The D-Cade
            </h1>
            <p className="text-gray-500 text-[15px] leading-relaxed">
              Hardware Engineer, Carpenter & UI Customizer · Raspberry Pi, RetroPie, 3D Printing, A/V Signal Conversion
            </p>
          </header>

          {/* Hero */}
          <div className="mb-10">
            <button
              type="button"
              onClick={() => setEnlargedImage({ src: '/case-study/d-cade-hero.webp', alt: 'The D-Cade arcade cabinet' })}
              className="rounded-xl overflow-hidden border border-white/5 text-left hover:border-[#24A2A7]/40 transition-colors cursor-zoom-in group w-full"
            >
              <img src="/case-study/d-cade-hero.webp" alt="The D-Cade arcade cabinet" className="w-full h-auto group-hover:opacity-90 transition-opacity" loading="lazy" />
              <p className="text-[11px] text-gray-500 px-3 py-2 bg-white/[0.02]">The D-Cade cabinet · Click to enlarge</p>
            </button>
          </div>

          {/* Executive Summary */}
          <section className="mb-12">
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7]">
              A custom-built Sega Dreamcast cabinet—a relic of a previous era—sat broken and dormant. I gutted the failed internals and replaced them with a Raspberry Pi architecture, creating a refurbished, Linux-powered retro gaming hub with 35+ titles. The D-Cade now serves as primary entertainment for patients at a private medical practice.
            </p>
          </section>

          {/* Context & Challenge */}
          <section id="dcade-problem" className="scroll-mt-28 mb-12">
            <span className="text-[11px] font-medium text-[#24A2A7]/90 mb-3 block">Context & Challenge</span>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-4">
              The cabinet was &quot;dead tech&quot;—sentimental but lacking modern utility. The goal: bridge decade-old analog hardware and modern digital emulation, transforming a heavy, broken wooden shell into a reliable, plug-and-play entertainment system for high-traffic social environments (the &quot;D-House&quot;).
            </p>
          </section>

          {/* Solution */}
          <section id="dcade-solution" className="scroll-mt-28 mb-12">
            <span className="text-[11px] font-medium text-[#24A2A7]/90 mb-3 block">The Solution</span>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7]">
              The D-Cade—a refurbished, Linux-powered retro gaming hub. By gutting the failed Dreamcast internals and replacing them with a custom Raspberry Pi architecture, I created a scalable library of 35+ titles housed in a modernized, 3D-printed, and custom-branded chassis.
            </p>
          </section>

          {/* Technical Methodology */}
          <section id="dcade-methodology" className="scroll-mt-28 mb-12">
            <span className="text-[11px] font-medium text-[#24A2A7]/90 mb-3 block">Technical Methodology: The Refurbishment Stack</span>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-[15px] border-collapse border border-white/10 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-white/5">
                    <th className="text-left py-3 px-4 font-semibold text-white border-b border-white/10 w-1/4">Phase</th>
                    <th className="text-left py-3 px-4 font-semibold text-white border-b border-white/10">Technical Action</th>
                    <th className="text-left py-3 px-4 font-semibold text-white border-b border-white/10">UX & Operational Goal</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">Gutting & Retrofit</td>
                    <td className="py-3 px-4">Replaced Sega Dreamcast with Raspberry Pi (RetroPie).</td>
                    <td className="py-3 px-4">Stability: Moving from failing optical drives to solid-state SD storage.</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">Signal Processing</td>
                    <td className="py-3 px-4">Integrated A/V converters and a custom soundboard.</td>
                    <td className="py-3 px-4">Atmosphere: Boosting 2000s-era speaker output to modern &quot;social gathering&quot; volumes.</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">Custom Fabrication</td>
                    <td className="py-3 px-4">3D printed internal mounts and cable management brackets.</td>
                    <td className="py-3 px-4">Organization: Creating a &quot;clean&quot; interior for easy maintenance and cooling.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">UI Customization</td>
                    <td className="py-3 px-4">Developed custom Linux splash screens and ROM overlays.</td>
                    <td className="py-3 px-4">Branding: Ensuring the &quot;D-Cade&quot; felt like a bespoke product, not a generic emulator.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Engineering Highlights */}
          <section id="dcade-highlights" className="scroll-mt-28 mb-12">
            <span className="text-[11px] font-medium text-[#24A2A7]/90 mb-3 block">Engineering Highlights</span>
            <h4 className="text-sm font-semibold text-white mt-6 mb-2">The 3D-Printed Infrastructure</h4>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-4">
              Standard Raspberry Pi cases didn&apos;t fit the vintage drawer dimensions. I designed and 3D-printed custom mounting brackets that allowed the Pi to sit securely in a sliding drawer—easy access for software updates while keeping the exterior aesthetic period-accurate and cord-free.
            </p>
            <h4 className="text-sm font-semibold text-white mt-6 mb-2">Analog-to-Digital Audio Bridge</h4>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7]">
              To preserve the &quot;thump&quot; of the original cabinet&apos;s vintage speakers, I routed the signal through a dedicated soundboard and soldering-iron-modified connections—resulting in high-fidelity audio that could cut through the noise of an a cappella house rehearsal.
            </p>
          </section>

          {/* Design Decisions */}
          <section id="dcade-design" className="scroll-mt-28 mb-12">
            <span className="text-[11px] font-medium text-[#24A2A7]/90 mb-3 block">Design Decisions: Why &quot;D-Cade&quot;?</span>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-4">
              The cabinet was designed for members of my a cappella group, the Dischords, and their guests. I created custom &quot;D-Cade&quot; splash screens—when the cabinet boots, it shows house branding, not Linux code. In a house full of students, the system had to be &quot;drunk-proof&quot;: I installed a new access door and simplified the power-on sequence so anyone could start a game without a technical manual.
            </p>
            <button
              type="button"
              onClick={() => setEnlargedImage({ src: '/case-study/d-cade-splash.webp', alt: 'Custom D-Cade splash screen' })}
              className="rounded-xl overflow-hidden border border-white/5 text-left hover:border-[#24A2A7]/40 transition-colors cursor-zoom-in group w-full"
            >
              <img src="/case-study/d-cade-splash.webp" alt="Custom D-Cade splash screen" className="w-full h-auto group-hover:opacity-90 transition-opacity" loading="lazy" />
              <p className="text-[11px] text-gray-500 px-3 py-2 bg-white/[0.02]">Custom D-Cade splash screen · Click to enlarge</p>
            </button>
          </section>

          {/* Process & Craftsmanship */}
          <section id="dcade-process" className="scroll-mt-28 mb-12">
            <span className="text-[11px] font-medium text-[#24A2A7]/90 mb-3 block">Process & Craftsmanship</span>
            <ul className="text-gray-300 text-[15px] md:text-base leading-[1.7] space-y-2">
              <li><strong>Auditing the shell</strong> — Stripped the original wood and assessed structural integrity.</li>
              <li><strong>Hardware selection</strong> — Raspberry Pi (Raspbian/RetroPie) for low power draw and high customizability.</li>
              <li><strong>Fabrication</strong> — Soldered new A/V paths and 3D printed the internal layout.</li>
              <li><strong>Content curation</strong> — Manually imported and tested 35+ ROMs for joystick-to-GPIO compatibility.</li>
            </ul>
          </section>

          {/* Outcomes & Legacy */}
          <section id="dcade-outcomes" className="scroll-mt-28 mb-12">
            <span className="text-[11px] font-medium text-[#24A2A7]/90 mb-3 block">Outcomes & Legacy</span>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-4">
              The D-Cade transitioned from a personal project to public infrastructure. It served as the focal point for social gatherings at the D-House and proved robust enough to be donated—now the primary entertainment for patients in a doctor&apos;s office waiting room.
            </p>
          </section>

          {/* CTA */}
          <div className="pt-10 mt-10 border-t border-white/5">
            <p className="text-gray-400 text-sm">Currently featured at a private medical practice.</p>
          </div>
            </>
          )}

          {isLevelUp && (
            <>
          {/* Level Up Header */}
          <header className="mb-10 md:mb-12">
            <p className="text-xs text-[#24A2A7] font-medium mb-3">Level Up · 2025</p>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-4">
              Level Up
            </h1>
            <p className="text-gray-500 text-[15px] leading-relaxed">
              Course Designer, Full-Stack Developer & Adjunct Instructor · Next.js 14, PostgreSQL (Prisma), Gemini API, Google Cloud Run, Tailwind CSS
            </p>
          </header>

          {/* Hero */}
          <div className="mb-10">
            <button
              type="button"
              onClick={() => setEnlargedImage({ src: '/case-study/level-up-dashboard.webp', alt: 'Level Up dashboard' })}
              className="rounded-xl overflow-hidden border border-white/5 text-left hover:border-[#24A2A7]/40 transition-colors cursor-zoom-in group w-full"
            >
              <img src="/case-study/level-up-dashboard.webp" alt="Level Up dashboard" className="w-full h-auto group-hover:opacity-90 transition-opacity" loading="lazy" />
              <p className="text-[11px] text-gray-500 px-3 py-2 bg-white/[0.02]">Level Up dashboard · Click to enlarge</p>
            </button>
          </div>

          {/* Executive Summary */}
          <section id="levelup-summary" className="scroll-mt-28 mb-12">
            <span className="text-[11px] font-medium text-[#24A2A7]/90 mb-3 block">Executive Summary</span>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-4">
              As a Program Manager at Google and an adjunct instructor at Quinnipiac University, I saw a gap in how students transition from &quot;academic theory&quot; to &quot;workplace impact.&quot; I designed Leveling Up—a 3-credit hybrid course for the Quinnipiac in LA program—to bridge this gap.
            </p>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-4">
              Standard LMS platforms like Canvas or Blackboard are built for broad administration, not specialized pedagogy. My course required unique features—AI interview simulations and automated assignment analysis—that off-the-shelf tools couldn&apos;t support.
            </p>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7]">
              I built Level Up, a custom production-ready Next.js application. It doesn&apos;t just host the syllabus; it powers the course&apos;s core activities, manages the student lifecycle, and uses generative AI to provide real-time feedback and grading assistance.
            </p>
          </section>

          {/* Pedagogical Design */}
          <section id="levelup-course" className="scroll-mt-28 mb-12">
            <span className="text-[11px] font-medium text-[#24A2A7]/90 mb-3 block">The Course: Pedagogical Design</span>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-4">
              The 14-week curriculum is built around four thematic arcs designed to turn students into &quot;High-Impact Professionals.&quot;
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-[15px] border-collapse border border-white/10 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-white/5">
                    <th className="text-left py-3 px-4 font-semibold text-white border-b border-white/10 w-1/4">Arc</th>
                    <th className="text-left py-3 px-4 font-semibold text-white border-b border-white/10">Weeks</th>
                    <th className="text-left py-3 px-4 font-semibold text-white border-b border-white/10">Key Deliverable</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">Digital Brand</td>
                    <td className="py-3 px-4">1–4</td>
                    <td className="py-3 px-4">Narrative-driven LinkedIn bio & Identity Capital audit.</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">The Network</td>
                    <td className="py-3 px-4">5–8</td>
                    <td className="py-3 px-4">30-minute Coffee Chat & &quot;Unthought Known&quot; reflection.</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">Workplace Impact</td>
                    <td className="py-3 px-4">9–11</td>
                    <td className="py-3 px-4">Efficiency Project: Presenting a &quot;Smarter/Faster&quot; solution at Google Playa Vista.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-[#24A2A7]/90">The Start</td>
                    <td className="py-3 px-4">12–14</td>
                    <td className="py-3 px-4">Personal Action Plan & AI-driven STAR method practice.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Platform & Architecture */}
          <section id="levelup-platform" className="scroll-mt-28 mb-12">
            <span className="text-[11px] font-medium text-[#24A2A7]/90 mb-3 block">The Platform: Systems & Architecture</span>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-6">
              Because I built the platform and the course concurrently, the technology reflects the teaching style: modular, fast, and AI-supported.
            </p>

            <h4 className="text-sm font-semibold text-white mt-6 mb-2">A. AI-Driven Interview Practice</h4>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-4">
              The /interview feature implements the Week 13 curriculum. Students paste a job posting, and the platform uses Gemini 2.5 Flash to generate behavioral questions. Students respond via the Web Speech API (voice-to-text). The AI evaluates responses for STAR method structure, offering immediate suggestions.
            </p>
            <button
              type="button"
              onClick={() => setEnlargedImage({ src: '/case-study/level-up-interview.webp', alt: 'AI Interview Practice' })}
              className="rounded-xl overflow-hidden border border-white/5 text-left hover:border-[#24A2A7]/40 transition-colors cursor-zoom-in group w-full mb-6"
            >
              <img src="/case-study/level-up-interview.webp" alt="AI Interview Practice" className="w-full h-auto group-hover:opacity-90 transition-opacity" loading="lazy" />
              <p className="text-[11px] text-gray-500 px-3 py-2 bg-white/[0.02]">AI Interview Practice · Click to enlarge</p>
            </button>

            <h4 className="text-sm font-semibold text-white mt-6 mb-2">B. AI-Assisted Grading & Analysis</h4>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-4">
              When a student submits a PDF, the system triggers automated analysis. The AI compares the submission against the assignment&apos;s specific rubric (e.g., checking for &quot;Identity Capital&quot; definitions). The instructor receives a content summary and suggested feedback points for faster, more consistent grading.
            </p>

            <h4 className="text-sm font-semibold text-white mt-6 mb-2">C. LevelUpBot: Guardrailed Support</h4>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7]">
              A course-aware chatbot answers logistical questions (&quot;When is the efficiency project due?&quot;). I engineered a strict system prompt to ensure academic integrity—the bot refuses to summarize readings or interpret course content, directing students back to the source material.
            </p>
          </section>

          {/* Engineering Challenges */}
          <section id="levelup-challenges" className="scroll-mt-28 mb-12">
            <span className="text-[11px] font-medium text-[#24A2A7]/90 mb-3 block">Engineering Challenges & Solutions</span>
            <h4 className="text-sm font-semibold text-white mt-6 mb-2">Timezone Integrity</h4>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-4">
              <strong>Problem:</strong> Storing &quot;11:59 PM&quot; due dates often resulted in mismatches between the server (UTC) and the student&apos;s local time. <strong>Solution:</strong> Standardized the database on UTC. Engineered a React bridge that converts datetime-local values to ISO strings on submission and re-localizes them for the student view.
            </p>
            <h4 className="text-sm font-semibold text-white mt-6 mb-2">The &quot;Syllabus-to-Context&quot; Pipeline</h4>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7]">
              <strong>Problem:</strong> How to keep the chatbot&apos;s knowledge base updated as the course evolves. <strong>Solution:</strong> Created a &quot;Context Notebook&quot; architecture. The bot&apos;s system prompt is dynamically injected with the latest data from the Module, Assignment, and Material tables in PostgreSQL, ensuring 100% accuracy in scheduling.
            </p>
          </section>

          {/* Development Journey */}
          <section id="levelup-journey" className="scroll-mt-28 mb-12">
            <span className="text-[11px] font-medium text-[#24A2A7]/90 mb-3 block">Development Journey: From Prisma to Production</span>
            <ul className="text-gray-300 text-[15px] md:text-base leading-[1.7] space-y-2">
              <li><strong>Modeling:</strong> Designed a relational schema for Users (allowlist-only), Assignments, and Submissions using Prisma.</li>
              <li><strong>Deployment:</strong> Containerized the app using Google Cloud Build and deployed to Cloud Run for scalable, serverless execution.</li>
              <li><strong>UI/UX:</strong> Built a high-contrast, &quot;professional-noir&quot; UI using Tailwind CSS, prioritizing a dashboard-first view for student task management.</li>
              <li><strong>Security:</strong> Implemented NextAuth.js with an allowlist-based restriction to ensure only @quinnipiac.edu emails can access the course materials.</li>
            </ul>
          </section>

          {/* Outcomes */}
          <section id="levelup-outcomes" className="scroll-mt-28 mb-12">
            <span className="text-[11px] font-medium text-[#24A2A7]/90 mb-3 block">Outcomes & Reflection</span>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-4">
              Level Up represents the convergence of my work as an educator and a developer. Students present their capstone projects at Google&apos;s Playa Vista residency, receiving feedback from industry pros while using a platform that mirrors the tools they&apos;ll use in tech. The custom build reduced administrative overhead by 30% through automated notifications and AI grading assistance.
            </p>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7]">
              <strong>The Thesis:</strong> A well-scoped custom solution is always superior to a generic one when the pedagogy is specialized. By owning the tool, I own the experience.
            </p>
          </section>

          {/* CTA */}
          <div className="pt-10 mt-10 border-t border-white/5 space-y-3">
            <a href="https://levelupqu.com" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-[#24A2A7] transition-colors text-sm">
              Access the Live Platform →
            </a>
            <a href="/level-up-syllabus.pdf" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-[#24A2A7] transition-colors text-sm">
              View the Syllabus PDF →
            </a>
          </div>
            </>
          )}

          {isZooReport && (
            <>
          {/* Header */}
          <header className="mb-10 md:mb-12">
            <p className="text-xs text-[#24A2A7] font-medium mb-3">Augmented Reality Detroit Zoo App · 2020</p>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-4">
              Augmented Reality Detroit Zoo App
            </h1>
            <p className="text-gray-500 text-[15px] leading-relaxed">
              UX Research & Mobile Prototyping · Paper Prototypes, Figma Wireframes
            </p>
          </header>

          {/* Hero image */}
          <div className="mb-10">
            <button
              type="button"
              onClick={() => setEnlargedImage({ src: '/case-study/zoo-report-mockup.webp', alt: 'Augmented Reality Detroit Zoo App — Explore, animal info, and Donate screens' })}
              className="rounded-xl overflow-hidden border border-white/5 text-left hover:border-[#24A2A7]/40 transition-colors cursor-zoom-in group w-full"
            >
              <img src="/case-study/zoo-report-mockup.webp" alt="Augmented Reality Detroit Zoo App — Explore, animal info, and Donate screens" className="w-full h-auto group-hover:opacity-90 transition-opacity" loading="lazy" />
              <p className="text-[11px] text-gray-500 px-3 py-2 bg-white/[0.02]">App screens: Explore, Giraffe, Donate · Click to enlarge</p>
            </button>
          </div>

          {/* Executive Summary */}
          <section className="mb-12">
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7]">
              The Augmented Reality Detroit Zoo App is a mobile app concept for the Detroit Zoo. Visitors can explore the park on a map, learn about animals with rich profiles and fun facts, engage with a social feed of visitor posts, and donate to support conservation. The project moved from research and paper prototyping to a clickable digital wireframe, with user testing at each stage.
            </p>
          </section>

          {/* Context */}
          <section id="zoo-context" className="scroll-mt-28 mb-12">
            <span className="text-[11px] font-medium text-[#24A2A7]/90 mb-3 block">Context & Opportunity</span>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-4">
              The goal was to design an experience that helps zoo visitors navigate exhibits, connect with animal stories, and take action through donations. Key flows include exploration (map and search), animal profiles (facts, habitat, social content), and a streamlined donation path—all with a consistent, accessible mobile UI and purple accent branding.
            </p>
          </section>

          {/* Detroit Zoo branding */}
          <div className="mb-10 flex justify-center">
            <button
              type="button"
              onClick={() => setEnlargedImage({ src: '/case-study/detroit-zoo-logo.webp', alt: 'Detroit Zoo Logo' })}
              className="rounded-xl overflow-hidden border border-white/5 text-left hover:border-[#24A2A7]/40 transition-colors cursor-zoom-in group max-w-md w-full"
            >
              <img src="/case-study/detroit-zoo-logo.webp" alt="Detroit Zoo Logo" className="w-full h-auto group-hover:opacity-90 transition-opacity" loading="lazy" />
              <p className="text-[11px] text-gray-500 px-3 py-2 bg-white/[0.02]">Detroit Zoo · Click to enlarge</p>
            </button>
          </div>

          {/* Paper Prototype Demo */}
          <section id="zoo-paper-demo" className="scroll-mt-28 mb-12">
            <span className="text-[11px] font-medium text-[#24A2A7]/90 mb-3 block">Paper Prototype Demo</span>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-4">
              Early concepts were tested with a paper prototype to validate structure and flows before moving into digital design.
            </p>
            <div className="rounded-xl overflow-hidden border border-white/5 aspect-video bg-black/40">
              <iframe
                title="Augmented Reality Detroit Zoo App — Paper prototype demo"
                src="https://www.youtube.com/embed/Q-XG6lF5fgk"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </section>

          {/* Design */}
          <section id="zoo-design" className="scroll-mt-28 mb-12">
            <span className="text-[11px] font-medium text-[#24A2A7]/90 mb-3 block">Design</span>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-4">
              The app centers on three main areas: <strong>Explore</strong> (map with animal icons and locations), <strong>Animal profiles</strong> (name, birthday, habitat, fun facts, and a &quot;Learn More&quot; CTA plus social feed), and <strong>Donate</strong> (quick amounts, card fields, saved payments, and process payment). The visual design uses a clean white background, purple accents, and clear hierarchy to keep the focus on content and actions.
            </p>
          </section>

          {/* Final Wireframe Demo */}
          <section id="zoo-wireframe-demo" className="scroll-mt-28 mb-12">
            <span className="text-[11px] font-medium text-[#24A2A7]/90 mb-3 block">Final Wireframe Prototype Demo</span>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-4">
              The final interactive wireframe brings the flows together in a single prototype for usability testing and stakeholder review.
            </p>
            <div className="rounded-xl overflow-hidden border border-white/5 aspect-video bg-black/40">
              <iframe
                title="Augmented Reality Detroit Zoo App — Final wireframe prototype demo"
                src="https://www.youtube.com/embed/LjizOoWZ6T8"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </section>

          {/* Key Decisions */}
          <section id="zoo-decisions" className="scroll-mt-28 mb-12">
            <span className="text-[11px] font-medium text-[#24A2A7]/90 mb-3 block">Key Decisions</span>
            <p className="text-gray-300 text-[15px] md:text-base leading-[1.7] mb-4">
              Paper prototyping allowed fast iteration on navigation and content priority before committing to screens. The wireframe then refined layout, copy, and interaction details—keeping the donation flow simple (e.g. $1 / $2 and card capture) and the animal profile informative and social without clutter.
            </p>
          </section>

          {/* CTA */}
          <div className="pt-10 mt-10 border-t border-white/5">
            <p className="text-gray-400 text-sm">Augmented Reality Detroit Zoo App — UX research and mobile prototyping.</p>
          </div>
            </>
          )}

        </main>
      </div>

      {/* Image lightbox */}
      {enlargedImage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 animate-in fade-in duration-200 no-print"
          onClick={() => setEnlargedImage(null)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setEnlargedImage(null)}
          aria-label="Close enlarged image"
        >
          <button
            onClick={() => setEnlargedImage(null)}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10 z-10"
            aria-label="Close"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={enlargedImage.src}
            alt={enlargedImage.alt}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default ProjectCaseStudy;