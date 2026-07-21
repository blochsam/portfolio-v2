import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { track } from '../utils/track';

interface AboutContentProps {
  /** 'modal' shows a "return to the site" link that calls onClose; 'page' omits it. */
  variant?: 'page' | 'modal';
  onClose?: () => void;
}

const SCHOOLS = [
  { name: 'Michigan State University', degree: 'B.A. Experience Architecture, 2020', logo: '/msu.webp' },
  { name: 'Quinnipiac University', degree: 'M.S. Interactive Media, 2023', logo: '/quinni.webp' },
  { name: 'University of the Pacific', degree: 'M.A. Leadership, Innovation & Change, 2026', logo: '/uop.webp' },
];

const HOBBIES = [
  { title: 'IoT & Tinkering', text: 'Home automation, 3D printing, whatever new tech catches my eye.' },
  { title: 'Music', text: 'Guitar, vinyl, concerts.', link: 'https://www.concertarchives.org/sam-bloch', linkText: 'Archive' },
  { title: 'Surfing & Hiking', text: "Terrified of the ocean for years. Now I can't stay out of it." },
  { title: 'Film', text: 'LA theater culture and its community.', link: 'https://letterboxd.com/sam5927tde/', linkText: 'Letterboxd' },
];

/**
 * The bio itself, container-agnostic. Rendered both as the standalone /about
 * page (variant="page") and inside the 3D-scene modal (variant="modal").
 * One source of truth so the two surfaces never drift.
 */
const AboutContent: React.FC<AboutContentProps> = ({ variant = 'page', onClose }) => {
  const handleSecureMail = (e: React.MouseEvent) => {
    e.preventDefault();
    track('contact_click', { source: `about_${variant}` });
    const user = 'sam';
    const domain = 'sam-bloch.com';
    const address = `${user}@${domain}`;
    // Copy first: mailto silently no-ops without a configured mail client
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(address).catch(() => {});
    window.location.href = `mailto:${address}`;
  };

  const reveal = 'motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700';

  return (
    <div className="p-8 md:p-12 lg:p-16">
      {/* ── Hero ── */}
      <section className={`${reveal} mb-16 md:mb-24`}>
        <div className="mb-8 md:mb-10">
          <p className="text-xs font-black text-[#24A2A7] uppercase tracking-[0.4em] mb-4">Walled Lake, MI &rarr; Los Angeles, CA</p>
          <h1 id="about-title" className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-4 text-white">Sam Bloch</h1>
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
              Today, I&rsquo;m a Program Manager at YouTube (part of Google), working on Trust &amp; Safety. Evenings, I teach my course Level Up at Quinnipiac, and I recently completed my M.A. in Leadership at University of the Pacific (Class of 2026).
            </p>
          </div>
          <div className="aspect-[4/5] bg-[#1a1a1a] rounded-[2rem] overflow-hidden border border-white/5 relative">
            <img src="/about-1.webp" alt="Sam Bloch" width={400} height={500} className="w-full h-full object-cover grayscale" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
        </div>
      </section>

      {/* ── Conviction line ── */}
      <section className={`${reveal} mb-16 md:mb-24`}>
        <div className="relative py-8 md:py-10 px-2">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#24A2A7] via-[#24A2A7]/50 to-transparent rounded-full" />
          <p className="text-xl md:text-3xl font-bold leading-snug tracking-tight text-white pl-8 md:pl-12">
            Technology is only as good as the human connection it makes possible.
          </p>
        </div>
      </section>

      {/* ── Education ── */}
      <section className={`${reveal} mb-16 md:mb-24`}>
        <div className="mb-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6">I Can&rsquo;t Stop Learning</h2>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl">
            One degree wasn&rsquo;t enough. I think the best program managers are <span className="text-white font-bold">part people-person, part systems-thinker,</span> so I kept going:
          </p>
        </div>

        {/* Graduate focus — editorial, no card chrome */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-14 border-t border-white/5 pt-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">M.S. in HCI</h3>
            <p className="text-gray-400 leading-relaxed">Understanding the friction between humans and machines, and how to reduce it.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">M.A. in Leadership</h3>
            <p className="text-gray-400 leading-relaxed">My second graduate degree (Class of 2026). The focus: leading teams through the AI shift without losing the human element.</p>
          </div>
        </div>

        {/* Three schools (kept as-is) */}
        <div className="pt-10 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {SCHOOLS.map((school) => (
              <div key={school.name} className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5 transition-[transform,border-color] group-hover:scale-110 group-hover:border-[#24A2A7]/40 relative">
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[#24A2A7] text-black text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-20 shadow-xl">
                    {school.name}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#24A2A7] rotate-45"></div>
                  </div>
                  <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                    <img src={school.logo} alt={school.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" decoding="async" />
                  </div>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight group-hover:text-[#24A2A7] transition-colors">{school.degree}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Teaching ── */}
      <section className={`${reveal} mb-16 md:mb-24`}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1 aspect-[16/10] bg-[#1a1a1a] rounded-[2rem] overflow-hidden border border-white/5 relative">
            <img src="/about-2.webp" alt="Sam teaching the Level Up course" width={640} height={400} className="w-full h-full object-cover grayscale" loading="lazy" decoding="async" />
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">Why I Teach: <br /> &ldquo;Level Up&rdquo;</h2>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed">
              I designed and teach a course called Level Up at Quinnipiac University. The idea is simple: give students the career playbook nobody gave me.
            </p>
            <p className="text-gray-400 text-base leading-relaxed">
              It runs on a platform I built myself: a custom LMS with AI interview simulation and real-time feedback. The course and the code are both mine.
            </p>
            <Link to="/projects/level-up" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#24A2A7] hover:text-white transition-colors group">
              Read the Level Up case study
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Off the clock ── */}
      <section className={`${reveal} mb-16 md:mb-20`}>
        <div className="max-w-2xl mb-8">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6">A Sandbox Kid</h2>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed">
            Give me a free weekend and I&rsquo;ll disappear into a project. The problem-solving I use at Google is the same muscle I use to troubleshoot a 3D printer or find the right chord progression on guitar. It&rsquo;s the same energy that ships side projects like{' '}
            <Link to="/projects/fudge" className="text-[#24A2A7] font-bold hover:underline">Fudge</Link>,{' '}
            <Link to="/projects/level-up" className="text-[#24A2A7] font-bold hover:underline">Level Up</Link>, and{' '}
            <Link to="/projects/portfolio" className="text-[#24A2A7] font-bold hover:underline">this site</Link>.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_0.85fr] gap-10 items-center">
          <ul className="space-y-5">
            {HOBBIES.map((item) => (
              <li key={item.title} className="flex items-start gap-4">
                <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-[#24A2A7] shrink-0" aria-hidden="true" />
                <p className="text-sm md:text-base leading-relaxed">
                  <span className="text-white font-bold">{item.title}.</span>{' '}
                  <span className="text-gray-500">{item.text}</span>
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
            <img src="/about-3.webp" alt="Sam off the clock" width={400} height={500} className="w-full h-full object-cover grayscale" loading="lazy" decoding="async" />
          </div>
        </div>
      </section>

      {/* ── Action band ── */}
      <div className="pt-10 border-t border-white/5">
        <p className="text-xs font-black text-[#24A2A7] uppercase tracking-[0.4em] mb-6">Where to next</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/resume" className="px-7 py-4 min-h-[44px] rounded-full bg-[#24A2A7] text-[#121212] font-black uppercase text-xs tracking-widest hover:brightness-110 transition-[filter,transform] active:scale-95 flex items-center gap-2">
            View Resume
          </Link>
          <Link to="/projects" className="px-7 py-4 min-h-[44px] rounded-full border border-white/10 text-gray-300 hover:text-white hover:border-[#24A2A7]/40 font-black uppercase text-xs tracking-widest transition-[color,border-color,transform] active:scale-95 flex items-center gap-2">
            Browse Projects
          </Link>
          <button onClick={handleSecureMail} className="px-7 py-4 min-h-[44px] rounded-full border border-white/10 text-gray-300 hover:text-white hover:border-[#24A2A7]/40 font-black uppercase text-xs tracking-widest transition-[color,border-color,transform] active:scale-95 flex items-center gap-2">
            Let&apos;s Connect
          </button>
        </div>
        {variant === 'modal' && onClose && (
          <button onClick={onClose} className="mt-6 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
            &larr; or return to the site
          </button>
        )}
      </div>
    </div>
  );
};

export default AboutContent;
