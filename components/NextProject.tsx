import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { track } from '../utils/track';
import { PROJECTS, CASE_STUDY_IDS } from '../data/projects';

interface NextProjectProps {
  currentId: string;
}

/**
 * Cross-link rendered at the bottom of every case study so visitors who
 * finish reading keep momentum instead of dead-ending back at the grid.
 */
const NextProject: React.FC<NextProjectProps> = ({ currentId }) => {
  const idx = CASE_STUDY_IDS.indexOf(currentId);
  if (idx === -1) return null;
  const nextId = CASE_STUDY_IDS[(idx + 1) % CASE_STUDY_IDS.length];
  const next = PROJECTS.find(p => p.id === nextId);
  if (!next) return null;

  return (
    <section className="bg-[#0e0e0e] border-t border-white/5 no-print">
      <Link
        to={`/projects/${next.id}`}
        onClick={() => track('next_project_click', { from: currentId, to: next.id })}
        className="group block max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-20"
      >
        <span className="block text-xs font-black uppercase tracking-[0.4em] text-[#24A2A7] mb-4">
          Next Project
        </span>
        <span className="flex items-center justify-between gap-6">
          <span className="text-3xl md:text-5xl font-black tracking-tighter text-white group-hover:text-[#24A2A7] transition-colors leading-tight">
            {next.title}
          </span>
          <ArrowRight className="w-8 h-8 md:w-10 md:h-10 shrink-0 text-gray-500 group-hover:text-[#24A2A7] group-hover:translate-x-2 transition-[color,transform]" />
        </span>
        <span className="block mt-4 text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl">
          {next.description}
        </span>
      </Link>
    </section>
  );
};

export default NextProject;
