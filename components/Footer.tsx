import React from 'react';
import { Linkedin, Github, Mail } from 'lucide-react';
import { COLORS } from '../constants';

interface FooterProps {
  className?: string;
  /** When true, renders as a static inline footer instead of fixed */
  isInline?: boolean;
}

const Footer: React.FC<FooterProps> = ({ className = "", isInline = false }) => {
  const handleSecureMail = (e: React.MouseEvent) => {
    e.preventDefault();
    const user = 'sam';
    const domain = 'sam-bloch.com';
    const at = '@';
    window.location.href = `mailto:${user}${at}${domain}`;
  };

  const positionClasses = isInline
    ? 'relative w-full'
    : 'fixed bottom-0 left-0 w-full z-[100]';

  return (
    <footer id="site-footer" className={`${positionClasses} bg-[#121212]/95 backdrop-blur-md border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-10 text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-gray-400 ${className}`}>
      <div className="flex items-center gap-4">
        <span>Copyright © Sam Bloch 2026.</span>
      </div>

      <div className="flex items-center gap-8">
        <a
          href="https://www.linkedin.com/in/blochsam/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#24A2A7] transition-all flex items-center justify-center gap-2 group min-w-[44px] min-h-[44px]"
          aria-label="LinkedIn"
        >
          <Linkedin className="w-4 h-4" strokeWidth={1.5} />
          <span className="hidden lg:inline opacity-80 group-hover:opacity-100 transition-opacity">LINKEDIN</span>
        </a>

        <a
          href="#"
          className="hover:text-[#24A2A7] transition-all opacity-30 cursor-not-allowed flex items-center justify-center gap-2 min-w-[44px] min-h-[44px]"
          aria-label="GitHub"
          onClick={(e) => e.preventDefault()}
        >
          <span className="hidden lg:inline">GITHUB</span>
        </a>

        <button
          onClick={handleSecureMail}
          className="hover:text-[#24A2A7] transition-all flex items-center justify-center gap-2 group min-w-[44px] min-h-[44px]"
          aria-label="Email"
        >
          <Mail className="w-4 h-4" strokeWidth={1.5} />
          <span className="hidden lg:inline opacity-80 group-hover:opacity-100 transition-opacity">CONTACT</span>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
