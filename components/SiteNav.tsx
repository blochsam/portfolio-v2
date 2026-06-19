import React from 'react';
import { Link } from 'react-router-dom';
import { COLORS } from '../constants';

/**
 * Slim persistent nav for subpages, so deep-linked visitors (e.g. from
 * LinkedIn straight into a case study) can reach the rest of the site
 * without hunting for a back button. Hidden on the home experiences,
 * which carry their own HUD navigation.
 */
const SiteNav: React.FC = () => {
  return (
    <nav
      aria-label="Site"
      className="fixed top-8 right-6 md:right-12 z-[60] flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-full border border-white/5 shadow-xl px-2 py-1 no-print"
    >
      <Link
        to="/"
        className="px-3 py-2 text-xs font-black uppercase tracking-widest leading-none whitespace-nowrap hover:opacity-80 transition-opacity"
      >
        <span className="text-white">SAM</span>{' '}
        <span style={{ color: COLORS.teal }}>BLOCH</span>
      </Link>
      <span className="hidden sm:block w-px h-4 bg-white/10" aria-hidden="true" />
      <Link
        to="/about"
        className="hidden sm:block px-3 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#24A2A7] transition-colors"
      >
        About
      </Link>
      <Link
        to="/projects"
        className="hidden sm:block px-3 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#24A2A7] transition-colors"
      >
        Projects
      </Link>
      <Link
        to="/resume"
        className="hidden sm:block px-3 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#24A2A7] transition-colors"
      >
        Resume
      </Link>
    </nav>
  );
};

export default SiteNav;
