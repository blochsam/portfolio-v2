import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { Project } from '../types';

const PROJECTS: Project[] = [
  {
    id: 'portfolio-v1',
    title: 'My Portfolio Website',
    category: 'Design',
    date: '2025',
    description: 'An immersive dual-view digital experience bridging 2D editorial storytelling and a 3D workstation environment powered by Gemini.',
    tags: ['React', 'Spline', 'Three.js', 'AI'],
    github: 'https://github.com/sam-bloch',
    image: '/case-study/3d-scene.webp'
  },
  {
    id: 'portfolio-v2',
    title: 'My Portfolio Website — Design B',
    category: 'Design',
    date: '2025',
    description: 'An immersive, full-bleed reimagining of the portfolio case study. Scroll-driven reveals, parallax imagery, and animated metrics tell the story of building The Samulation.',
    tags: ['React', 'Spline', 'Immersive Design', 'AI'],
    github: 'https://github.com/sam-bloch',
    image: '/case-study/3d-scene.webp'
  },
  {
    id: 'dcade',
    title: 'The D-Cade',
    category: 'Design',
    date: '2020',
    description: 'Resurrecting a custom Sega Dreamcast arcade cabinet through Raspberry Pi, 3D printing, and A/V signal conversion. Now serving patients at a private medical practice.',
    tags: ['Raspberry Pi', 'RetroPie', '3D Printing', 'Hardware'],
    image: '/case-study/d-cade-card.webp',
    imagePosition: '50% 80%'
  },
  {
    id: 'level-up',
    title: 'Level Up',
    category: 'Design',
    date: '2025',
    description: 'A custom production-ready LMS for AI-driven career development. Built for Quinnipiac in LA—powers the course, manages the student lifecycle, and uses Gemini for real-time feedback.',
    tags: ['Next.js', 'Prisma', 'Gemini API', 'Cloud Run'],
    image: '/case-study/level-up-card.webp',
    link: 'https://levelupqu.com'
  },
  {
    id: 'uc-calnat',
    title: 'UC California Climate Stewards',
    category: 'Leadership',
    date: '2024',
    description: 'Led a Design Thinking consulting engagement for UC Agriculture & Natural Resources, designing a Community of Practice platform for 9,000+ environmental stewardship alumni across California.',
    tags: ['Design Thinking', 'UX Research', 'Community Design', 'Stakeholder Interviews'],
    image: '/case-study/calnat-card.webp'
  },
  {
    id: 'zoo-report',
    title: 'Augmented Reality Detroit Zoo App',
    category: 'Design',
    date: '2020',
    description: 'A mobile app concept for zoo and wildlife parks—explore exhibits, learn about animals, and donate. Paper and digital wireframe prototypes from research to final UI.',
    tags: ['UX Research', 'Prototyping', 'Mobile', 'Adobe XD'],
    image: '/case-study/zoo-report-card.webp'
  },
  {
    id: 'smart-lockers',
    title: 'Smart Lockers',
    category: 'Design',
    date: '2019',
    description: 'Built a self-service smart locker system at Quicken Loans—a web portal, Raspberry Pi prototype with 3D-printed case, and a working API that earned a presentation to the SVP of Infrastructure.',
    tags: ['PHP', 'SQL', 'Python', 'Raspberry Pi', '3D Printing'],
    image: '/case-study/smart-lockers/lockerblock.png'
  },
  {
    id: 'yt-quality-global',
    title: 'YouTube Global Quality Framework',
    category: 'Operations',
    date: '2024',
    description: 'Developed a comprehensive quality standard for child safety content moderation across 10 global sites, managing 800+ moderators.',
    tags: ['Policy', 'Scale', 'YouTube']
  },
  {
    id: 'google-legal-ops',
    title: 'Legal Ops Workflow Automation',
    category: 'AI',
    date: '2023',
    description: 'Designed and implemented an error management tool for legal operations that reduced internal processing errors by 45%.',
    tags: ['Process Innovation', 'Google', 'Tooling']
  },
  {
    id: 'yt-sql-dashboards',
    title: 'Predictive SQL Performance Dashboards',
    category: 'Operations',
    date: '2024',
    description: 'Built custom SQL dashboards to visualize vendor performance bottlenecks, improving reporting efficiency by 20%.',
    tags: ['Data Analysis', 'SQL', 'Metrics']
  },
  {
    id: 'cube-ux-lead',
    title: 'the CUBE Publishing UX',
    category: 'Design',
    date: '2020',
    description: 'Led ethnographic research and UX design for an immersive web experience serving 8 academic journal partners.',
    tags: ['User Research', 'HCI', 'Academic']
  },
  {
    id: 'michigan-speech',
    title: 'Michigan Speech Coaches Platform',
    category: 'Leadership',
    date: '2019',
    description: 'Founded and scaled the largest competitive speech tournament infrastructure in Michigan.',
    tags: ['Community', 'Org Design', 'Leadership']
  },
  {
    id: 'ai-safety-upstream',
    title: 'Upstream AI Safety Protocols',
    category: 'AI',
    date: '2024',
    description: 'Integrating GenAI into moderation pipelines to move safety checks earlier in the product lifecycle.',
    tags: ['GenAI', 'Trust & Safety', 'Strategy']
  }
];

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Operations', 'Design', 'AI', 'Leadership'];

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter(p => {
      const matchesFilter = filter === 'All' || p.category === filter;
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                            p.description.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  return (
    <div className="min-h-screen bg-[#121212] pt-24 pb-40 px-6 md:px-12 flex flex-col items-center">
      {/* Back Button */}
      <button
        onClick={() => {
          const mode = sessionStorage.getItem('experienceMode');
          if (mode === '2d') {
            navigate('/', { state: { force2D: true } });
          } else {
            navigate('/');
          }
        }}
        className="fixed top-8 left-8 md:left-12 z-[60] flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-all bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/5 hover:border-[#24A2A7]/40 shadow-xl active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="max-w-6xl w-full">
        <header className="mb-16">
          <span className="text-[10px] font-black text-[#24A2A7] uppercase tracking-[0.5em] block mb-4">THE ARCHIVE</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">Projects & Artifacts</h1>
          
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center py-8 border-y border-white/5">
            {/* Filters */}
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  aria-pressed={filter === cat}
                  aria-label={`Filter by ${cat}`}
                  className={`px-5 py-3 min-h-[44px] rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    filter === cat
                    ? 'bg-[#24A2A7] border-[#24A2A7] text-black shadow-[0_0_20px_rgba(36,162,167,0.3)]'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-[#24A2A7]/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80 group">
              <label htmlFor="project-search" className="sr-only">Search projects</label>
              <ArrowLeft className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#24A2A7] transition-colors rotate-180" aria-hidden="true" />
              <input
                id="project-search"
                type="search"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-[#24A2A7] transition-all placeholder:text-gray-400"
              />
            </div>
          </div>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {filteredProjects.map(project => {
            const categoryGradient: Record<string, string> = {
              Design: 'from-[#24A2A7]/20 via-[#24A2A7]/5 to-transparent',
              Operations: 'from-blue-500/20 via-blue-500/5 to-transparent',
              AI: 'from-violet-500/20 via-violet-500/5 to-transparent',
              Leadership: 'from-amber-500/20 via-amber-500/5 to-transparent'
            };
            const gradient = categoryGradient[project.category] || 'from-white/10 via-white/5 to-transparent';

            return (
            <button
              key={project.id}
              type="button"
              onClick={() => navigate(`/projects/${project.id}`)}
              aria-label={`View case study: ${project.title}`}
              className="group relative bg-[#1a1a1a]/40 border border-white/5 rounded-3xl overflow-hidden hover:bg-[#202020] transition-all duration-500 flex flex-col h-full text-left cursor-pointer w-full"
            >
              {/* Header image */}
              <div className="relative w-full aspect-[16/10] overflow-hidden shrink-0">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    width={640}
                    height={400}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    style={{ objectPosition: project.imagePosition ?? 'center' }}
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">{project.category}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-60" />
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                  <span className="text-[11px] font-mono text-[#24A2A7] font-bold uppercase tracking-widest px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                    {project.category}
                  </span>
                  <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full">{project.date}</span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl md:text-2xl font-black tracking-tight mb-3 group-hover:text-[#24A2A7] transition-colors leading-tight">
                  {project.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 border border-white/5 px-2.5 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#24A2A7] group-hover:gap-4 transition-all">
                  View Case Study
                  <ArrowLeft className="w-3 h-3 rotate-180" strokeWidth={3} />
                </span>
              </div>

              <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#24A2A7]/5 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </button>
          );
          })}

          {filteredProjects.length === 0 && (
            <div className="col-span-full py-32 text-center border border-dashed border-white/10 rounded-3xl">
              <span className="text-gray-400 uppercase font-black tracking-widest text-xs">No artifacts found in this sector.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;