import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONTENT_MAP, COLORS, LOGO } from '../constants';
import { SplineObjectId, PortfolioContent } from '../types';
import { Menu, X } from 'lucide-react';


interface Experience2DProps {
  setSelectedContent: (content: PortfolioContent | null) => void;
  openAbout: () => void;
}

const Experience2D: React.FC<Experience2DProps> = ({ setSelectedContent, openAbout }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Filter out Sesame and About from the focus areas grid on 2D
  const sections = (Object.keys(CONTENT_MAP) as SplineObjectId[]).filter(
    id => id !== '1dfa5782-8ffc-47dc-9562-db86cba5ee72' && id !== '1ee647e1-3ee5-42f9-80bd-4829e0df1c52'
  );

  const isDesktop = !window.matchMedia('(pointer: coarse)').matches && window.innerWidth >= 768;

  // Helper to render Google with brand colors (used in hero only now)
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

  return (
    <div className="min-h-screen bg-[#121212] text-white selection:bg-[#24A2A7]/30 overflow-x-hidden">
      {/* Editorial Navigation */}
      <header className="fixed top-0 w-full z-50 bg-[#121212]/95 backdrop-blur-md border-b border-white/5 p-4 md:p-6 md:px-12 flex justify-between items-center">
        <div className="transition-transform scale-75 md:scale-100 origin-left">
          {LOGO}
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-10 items-center font-black text-[10px] uppercase tracking-[0.4em]">
          <button
            onClick={() => navigate('/resume')}
            className="text-gray-400 hover:text-white transition-colors uppercase"
          >
            Resume
          </button>
          <button
            onClick={() => navigate('/projects')}
            className="text-gray-400 hover:text-[#24A2A7] transition-colors uppercase"
          >
            Projects & Artifacts
          </button>
          <button
            onClick={() => navigate('/3d')}
            className="px-5 py-2.5 rounded-full border border-[#24A2A7]/30 text-[#24A2A7] hover:bg-[#24A2A7]/10 transition-all active:scale-95 whitespace-nowrap uppercase"
          >
            Enter Immersive 3D
          </button>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(true)} 
            className="p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Open Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[120] bg-[#121212] flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-8 right-8 p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Close Menu"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="flex flex-col gap-10 text-center">
            <button 
              onClick={() => {
                setIsMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-3xl font-black uppercase tracking-tighter hover:text-[#24A2A7] transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                navigate('/3d');
              }}
              className="text-3xl font-black uppercase tracking-tighter hover:text-[#24A2A7] transition-colors"
            >
              3D Experience
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                navigate('/projects');
              }}
              className="text-3xl font-black uppercase tracking-tighter hover:text-[#24A2A7] transition-colors"
            >
              Projects & Artifacts
            </button>
            <a 
              href="/SBloch_Resume.pdf" 
              download="SBloch_Resume.pdf"
              onClick={() => setIsMenuOpen(false)}
              className="text-3xl font-black uppercase tracking-tighter hover:text-[#24A2A7] transition-colors"
            >
              Resume
            </a>
          </div>
          
          <div className="mt-20 opacity-20 scale-75">
            {LOGO}
          </div>
        </div>
      )}

      <main className="relative overflow-hidden">
        {/* Editorial Hero Section - Grid layout keeps headshot tethered at any zoom */}
        <section className="relative min-h-screen grid grid-cols-1 md:grid-cols-[1fr_auto] md:items-center gap-8 md:gap-12 px-6 md:px-12 max-w-7xl mx-auto pt-20 md:pt-32 pb-20 overflow-visible">
          <div className="relative z-20 max-w-4xl">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] md:leading-[0.9] mb-8 md:mb-12 animate-in fade-in duration-1000">
              Architecting <br />
              <span className="text-[#24A2A7]">Human-Centric</span><br />
              Systems.
            </h1>
            
            <p className="max-w-xl text-gray-400 text-base md:text-xl leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              Seasoned operations leader specializing in Trust & Safety, AI innovation, and organizational leadership. Building the future of digital safety at <GoogleColorized />.
            </p>
          </div>

          {/* Headshot: below hero text on mobile, right of text on desktop */}
          <div className="flex items-center justify-center md:justify-end pr-0 md:pr-4 lg:pr-8 order-2 md:order-none">
            <div 
              className="relative w-[min(280px,85vw)] md:w-[min(560px,48vw)] rounded-2xl md:rounded-l-2xl overflow-hidden shrink-0"
              style={{ aspectRatio: '4/5' }}
            >
              <img 
                src="/headshot.jpg" 
                alt="Sam Bloch"
                className="w-full h-full object-cover object-center grayscale"
              />
              {/* Top fade - hides JPEG top edge on all viewports */}
              <div 
                className="absolute inset-x-0 top-0 h-1/4 pointer-events-none"
                style={{ background: 'linear-gradient(to bottom, #121212 0%, transparent 100%)' }}
              />
              {/* Left fade - blends into text area */}
              <div 
                className="absolute inset-y-0 left-0 w-1/3 pointer-events-none"
                style={{ background: 'linear-gradient(to right, #121212 0%, transparent 100%)' }}
              />
              {/* Right fade - blends into edge */}
              <div 
                className="absolute inset-y-0 right-0 w-1/4 pointer-events-none"
                style={{ background: 'linear-gradient(to left, #121212 0%, transparent 100%)' }}
              />
              {/* Bottom fade - stronger on mobile for seamless blend */}
              <div 
                className="absolute inset-x-0 bottom-0 h-1/3 md:h-1/3 pointer-events-none"
                style={{ background: 'linear-gradient(to top, #121212 0%, transparent 100%)' }}
              />
            </div>
          </div>
          
          {/* Subtle scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-30 animate-pulse pointer-events-none">
            <div className="w-px h-10 bg-white/40"></div>
          </div>
        </section>

        {/* Focus Area Grid */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto mb-24 relative z-20">
          <div className="flex items-end justify-between mb-8 md:mb-10 border-b border-white/5 pb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-lg md:text-xl font-black tracking-tighter uppercase">Focus Areas</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {sections.map((id, index) => {
              const content = CONTENT_MAP[id];
              return (
                <button 
                  key={id} 
                  onClick={() => setSelectedContent(content)}
                  className="group relative flex flex-col items-start p-8 md:p-10 bg-[#1a1a1a]/40 border border-white/5 hover:bg-[#202020] transition-all duration-300 text-left active:scale-[0.98]"
                >
                  <span className="text-[9px] md:text-[10px] font-mono text-gray-600 mb-6 md:mb-8 group-hover:text-[#24A2A7] transition-colors">0{index + 1}</span>
                  <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white mb-2 leading-tight">
                    {content.title}
                  </h3>
                  <div className="absolute top-0 left-0 w-0.5 h-0 bg-[#24A2A7] group-hover:h-full transition-all duration-500"></div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Integrated About Section */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto mb-24 md:mb-32 relative z-20">
          <div className="bg-[#1a1a1a]/40 border border-white/5 rounded-[2rem] p-8 md:p-16 lg:p-24 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none hidden md:block">
              <svg width="400" height="400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              <div>
                <span className="text-[10px] font-black text-[#24A2A7] uppercase tracking-[0.5em] block mb-4">BEHIND THE SCREEN</span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 leading-tight">
                  ABOUT ME: <br />
                  <span className="text-white/40">Innovation & Identity</span>
                </h2>
                <div className="w-12 h-1.5 bg-[#24A2A7] mb-8 md:mb-0"></div>
              </div>

              <div className="space-y-8">
                <p className="text-lg md:text-2xl text-gray-300 leading-relaxed font-medium">
                  I’m a Michigan-born, California-based systems-thinker who lives for a good "unsolvable" problem. I spend my days at Google navigating the AI explosion and my evenings mentoring the next generation of leaders as a college educator. 
                </p>
                <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                  When I'm not architecting human-centric systems, I'm playing guitar, surfing, 3D printing, or meticulously cataloging my life through <a href="https://www.concertarchives.org/sam-bloch" target="_blank" rel="noopener noreferrer" className="text-[#24A2A7] hover:underline decoration-2 underline-offset-4">music</a> and <a href="https://letterboxd.com/sam5927tde/" target="_blank" rel="noopener noreferrer" className="text-[#24A2A7] hover:underline decoration-2 underline-offset-4">film</a>.
                </p>
                <div className="pt-4">
                  <button
                    onClick={openAbout}
                    className="group flex items-center gap-4 px-8 py-4 bg-white text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-full hover:bg-[#24A2A7] hover:text-white transition-all shadow-xl active:scale-95"
                  >
                    Learn More
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Narrative Sections */}
        <section className="px-6 md:px-12 max-w-5xl mx-auto space-y-16 md:space-y-20 relative z-20">
          {/* Section 01 */}
          <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-start">
            <div>
              <span className="text-[9px] md:text-[10px] font-black text-[#24A2A7] uppercase tracking-[0.4em] block mb-4 md:mb-6">01 // THE PHILOSOPHY</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none mb-6 md:mb-8">Engineering Integrity at Global Scale.</h2>
            </div>
            <div className="text-gray-400 text-base md:text-xl leading-relaxed space-y-6 md:space-y-8">
              <p>
                In a digital landscape that evolves at the speed of light, Trust & Safety isn't just about rules; it's about building the immune system of the internet. I focus on creating frameworks that protect users without stifling innovation.
              </p>
              <p>
                As a Program Manager at <span className="text-[#EA4335] font-semibold">YouTube</span>, I specialize in high-stakes operational protocols. My approach combines data-driven system building with a deep understanding of human behavior.
              </p>
            </div>
          </div>

          {/* Section 02 */}
          <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-start">
            <div className="md:order-2">
              <span className="text-[9px] md:text-[10px] font-black text-[#24A2A7] uppercase tracking-[0.4em] block mb-4 md:mb-6">02 // STRATEGIC IMPACT</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none mb-6 md:mb-8">AI Integration & Process Innovation.</h2>
            </div>
            <div className="text-gray-400 text-base md:text-xl leading-relaxed space-y-6 md:space-y-8 md:order-1">
              <p>
                Leveraging Large Language Models to transform operational bottlenecks into high-efficiency pipelines. My work focuses on the proactive application of AI to move safety "upstream."
              </p>
              <p>
                By integrating GenAI into moderation workflows, we've seen significant reductions in latency while maintaining—and often exceeding—legacy integrity standards. It is about working smarter.
              </p>
            </div>
          </div>

          {/* Archive / CTA Section - LARGER BOTTOM PADDING FOR MOBILE VIEW */}
          <div className="text-center pt-12 pb-48 md:pb-24 border-t border-white/5 mt-12">
            <h3 className="text-5xl sm:text-6xl md:text-[8rem] font-black tracking-tighter mb-8 md:mb-12 uppercase leading-none opacity-10 md:opacity-20">The Archive.</h3>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 md:gap-8">
              <button
                onClick={() => navigate('/projects')}
                className="w-full sm:w-auto px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-full hover:bg-[#24A2A7] hover:text-white transition-all shadow-2xl active:scale-95 text-[10px]"
              >
                Projects & Artifacts
              </button>

              {/* MOBILE ACTION: GOES TO RESUME DOWNLOAD INSTEAD OF PAGE */}
              {isDesktop ? (
                <button
                  onClick={() => navigate('/resume')}
                  className="text-gray-500 font-bold uppercase tracking-widest text-[9px] hover:text-white transition-colors py-4"
                >
                  View Full Resume
                </button>
              ) : (
                <a 
                  href="/SBloch_Resume.pdf" 
                  download="SBloch_Resume.pdf"
                  className="text-gray-500 font-bold uppercase tracking-widest text-[9px] hover:text-white transition-colors py-4 flex items-center justify-center gap-2"
                >
                  Download Resume
                </a>
              )}
            </div>
          </div>
        </section>
      </main>

    </div>
  );
};

export default Experience2D;