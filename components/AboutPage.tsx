import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { usePageMeta } from '../utils/usePageMeta';
import { ROUTE_META } from '../data/routeMeta';
import { goBack } from '../utils/goBack';
import AboutContent from './AboutContent';

/**
 * Standalone /about page. Shares its body with the 3D-scene modal via
 * <AboutContent>. This is the indexable, linkable surface the 2D site points
 * at; the 3D experience keeps the floating modal.
 */
const AboutPage: React.FC = () => {
  usePageMeta(ROUTE_META['/about']);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#121212] pt-24 pb-24 px-4 md:px-8 flex flex-col items-center">
      <button
        onClick={() => goBack(navigate, '/')}
        aria-label="Back"
        className="fixed top-8 left-8 md:left-12 z-[60] flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-[color,border-color,transform] bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/5 hover:border-[#24A2A7]/40 shadow-xl active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="max-w-5xl w-full">
        <AboutContent variant="page" />
      </div>
    </div>
  );
};

export default AboutPage;
