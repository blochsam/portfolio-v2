import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { track } from '../utils/track';
import { usePageMeta } from '../utils/usePageMeta';
import { ROUTE_META } from '../data/routeMeta';
import { PROJECTS, CASE_STUDY_IDS, SPOTLIGHT_PROJECT_IDS } from '../data/projects';
import { Project } from '../types';

/** Card for a project with a full case study — a real link. */
const CaseStudyCard: React.FC<{ project: Project; spotlight?: boolean }> = ({ project, spotlight = false }) => {
  return (
    <Link
      to={`/projects/${project.id}`}
      aria-label={`View case study: ${project.title}`}
      className="group relative bg-[#1a1a1a]/40 border border-white/5 rounded-3xl overflow-hidden hover:bg-[#202020] transition-[background-color] duration-500 flex flex-col h-full text-left cursor-pointer w-full"
    >
      <div className="relative w-full aspect-[16/10] overflow-hidden shrink-0">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            width={640}
            height={400}
            loading="lazy"
            className={`w-full h-full object-cover group-hover:scale-105 transition-[filter,transform] duration-500 ${spotlight ? '' : 'md:[@media(hover:hover)]:grayscale group-hover:grayscale-0'}`}
            style={{ objectPosition: project.imagePosition ?? 'center' }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-60" />
        <div className="absolute top-3 right-3">
          <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full">{project.date}</span>
        </div>
      </div>

      <div className={`flex flex-col flex-1 ${spotlight ? 'p-6 md:p-7' : 'p-5'}`}>
        <h3 className={`font-black tracking-tight mb-3 group-hover:text-[#24A2A7] transition-colors leading-tight ${spotlight ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
          {project.title}
        </h3>

        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          {project.description}
        </p>

        <div className="mt-auto">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(spotlight ? project.tags.slice(0, 4) : project.tags.slice(0, 3)).map(tag => (
              <span key={tag} className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500 border border-white/[0.06] px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>

          <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#24A2A7] group-hover:gap-4 transition-[gap]">
            View Case Study
            <ArrowLeft className="w-3 h-3 rotate-180" strokeWidth={3} />
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#24A2A7]/5 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </Link>
  );
};

/** Card for work without a published case study — honest, not a dead end. */
const ArchiveCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="relative bg-[#1a1a1a]/40 border border-white/5 rounded-3xl overflow-hidden flex flex-col h-full w-full">
      <div className="relative w-full aspect-[16/10] overflow-hidden shrink-0">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            width={640}
            height={400}
            loading="lazy"
            className="w-full h-full object-cover grayscale"
            style={{ objectPosition: project.imagePosition ?? 'center' }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-60" />
        <div className="absolute top-3 right-3">
          <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full">{project.date}</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-black tracking-tight mb-3 leading-tight">
          {project.title}
        </h3>

        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          {project.description}
        </p>

        <div className="mt-auto">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500 border border-white/[0.06] px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>

          <a
            href={`mailto:sam@sam-bloch.com?subject=${encodeURIComponent(`Write-up request: ${project.title}`)}`}
            onClick={() => track('writeup_request', { project: project.id })}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#24A2A7] transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            Write-up on request
          </a>
        </div>
      </div>
    </div>
  );
};

const ProjectsPage: React.FC = () => {
  usePageMeta(ROUTE_META['/projects']);
  const navigate = useNavigate();

  const spotlight = PROJECTS.filter(p => SPOTLIGHT_PROJECT_IDS.includes(p.id));
  const archive = PROJECTS.filter(p => !SPOTLIGHT_PROJECT_IDS.includes(p.id));

  const renderCard = (project: Project, spotlightCard = false) =>
    CASE_STUDY_IDS.includes(project.id)
      ? <CaseStudyCard key={project.id} project={project} spotlight={spotlightCard} />
      : <ArchiveCard key={project.id} project={project} />;

  return (
    <div className="min-h-screen bg-[#121212] pt-24 pb-24 px-6 md:px-12 flex flex-col items-center">
      {/* Back Button — always returns to the static homepage (transient, so it
          never locks a 3D visitor's session into 2D) */}
      <button
        onClick={() => navigate('/', { state: { force2D: true, transient: true } })}
        aria-label="Back to home"
        className="fixed top-8 left-8 md:left-12 z-[60] flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-[color,border-color,transform] bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/5 hover:border-[#24A2A7]/40 shadow-xl active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back
      </button>

      <div className="max-w-6xl w-full">
        <header className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">Projects & Artifacts</h1>
        </header>

        {/* Spotlight — most recent / most senior work, full color */}
        <section aria-label="Spotlight projects" className="mb-16">
          <span className="text-[10px] font-black text-[#24A2A7] uppercase tracking-[0.5em] block mb-6">SPOTLIGHT</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {spotlight.map(p => renderCard(p, true))}
          </div>
        </section>

        {/* Everything else, denser */}
        <section aria-label="All projects">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] block mb-6">THE FULL ARCHIVE</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {archive.map(p => renderCard(p))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectsPage;
