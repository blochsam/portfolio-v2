import React from 'react';
import { Linkedin, Github, Mail } from 'lucide-react';
import { COLORS } from '../constants';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const handleSecureMail = (e: React.MouseEvent) => {
    e.preventDefault();
    const user = 'sam';
    const domain = 'sam-bloch.com';
    const at = '@';
    window.location.href = `mailto:${user}${at}${domain}`;
  };

  return (
    <footer className={`fixed bottom-0 left-0 w-full z-[100] bg-[#121212]/95 backdrop-blur-md border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-10 text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-gray-500 ${className}`}>
      <div className="flex items-center gap-4">
        <span>Copyright © Sam Bloch 2026.</span>
      </div>
      
      <div className="flex items-center gap-8">
        <a 
          href="https://www.linkedin.com/in/blochsam/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-[#24A2A7] transition-all flex items-center gap-2 group"
          aria-label="LinkedIn"
        >
          <Linkedin className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span className="hidden lg:inline opacity-80 group-hover:opacity-100 transition-opacity">LINKEDIN</span>
        </a>
        
        <a 
          href="#" 
          className="hover:text-[#24A2A7] transition-all opacity-30 cursor-not-allowed flex items-center gap-2"
          aria-label="GitHub"
          onClick={(e) => e.preventDefault()}
        >
          <span className="hidden lg:inline">GITHUB</span>
        </a>
        
        <button 
          onClick={handleSecureMail}
          className="hover:text-[#24A2A7] transition-all flex items-center gap-2 group"
          aria-label="Email"
        >
          <Mail className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span className="hidden lg:inline opacity-80 group-hover:opacity-100 transition-opacity">CONTACT</span>
        </button>
      </div>
    </footer>
  );
};

export default Footer;