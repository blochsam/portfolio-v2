import React, { useState, useEffect, useRef } from 'react';
import { Linkedin, Github, Mail, Check } from 'lucide-react';
import { COLORS } from '../constants';

interface FooterProps {
  className?: string;
  /** When true, renders as a static inline footer instead of fixed */
  isInline?: boolean;
}

const Footer: React.FC<FooterProps> = ({ className = "", isInline = false }) => {
  const [copied, setCopied] = useState(false);
  const copiedTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) window.clearTimeout(copiedTimeoutRef.current);
    };
  }, []);

  const handleSecureMail = (e: React.MouseEvent) => {
    e.preventDefault();
    const user = 'sam';
    const domain = 'sam-bloch.com';
    const at = '@';
    const address = `${user}${at}${domain}`;
    // mailto silently no-ops for visitors without a mail client configured,
    // so also copy the address and confirm visibly.
    navigator.clipboard?.writeText(address).then(() => {
      setCopied(true);
      if (copiedTimeoutRef.current) window.clearTimeout(copiedTimeoutRef.current);
      copiedTimeoutRef.current = window.setTimeout(() => setCopied(false), 2500);
    }).catch(() => { /* clipboard unavailable — mailto still fires */ });
    window.location.href = `mailto:${address}`;
  };

  const positionClasses = isInline
    ? 'relative w-full'
    : 'fixed bottom-0 left-0 w-full z-[100]';

  return (
    <footer id="site-footer" className={`${positionClasses} bg-[#121212]/[0.97] border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-10 text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-gray-400 ${className}`}>
      <div className="flex items-center gap-4">
        <span>Copyright © Sam Bloch 2026.</span>
      </div>

      <div className="flex items-center gap-8">
        <a
          href="https://www.linkedin.com/in/blochsam/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#24A2A7] transition-colors flex items-center justify-center gap-2 group min-w-[44px] min-h-[44px]"
          aria-label="LinkedIn"
        >
          <Linkedin className="w-4 h-4" strokeWidth={1.5} />
          <span className="hidden lg:inline opacity-80 group-hover:opacity-100 transition-opacity">LINKEDIN</span>
        </a>

        <a
          href="https://github.com/blochsam"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#24A2A7] transition-colors flex items-center justify-center gap-2 group min-w-[44px] min-h-[44px]"
          aria-label="GitHub"
        >
          <Github className="w-4 h-4" strokeWidth={1.5} />
          <span className="hidden lg:inline opacity-80 group-hover:opacity-100 transition-opacity">GITHUB</span>
        </a>

        <button
          onClick={handleSecureMail}
          className="relative hover:text-[#24A2A7] transition-colors flex items-center justify-center gap-2 group min-w-[44px] min-h-[44px]"
          aria-label="Email Sam — copies sam@sam-bloch.com to clipboard"
        >
          {copied && (
            <span
              role="status"
              className="absolute bottom-full mb-2 right-0 whitespace-nowrap normal-case tracking-normal text-[11px] font-bold text-[#121212] bg-[#24A2A7] px-3 py-1.5 rounded-full shadow-xl flex items-center gap-1.5"
            >
              <Check className="w-3 h-3" strokeWidth={3} />
              sam@sam-bloch.com copied
            </span>
          )}
          <Mail className="w-4 h-4" strokeWidth={1.5} />
          <span className="hidden lg:inline opacity-80 group-hover:opacity-100 transition-opacity">{copied ? 'COPIED' : 'CONTACT'}</span>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
