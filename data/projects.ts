import { Project } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'space-utilization',
    title: 'Pacific Medical School Space Evaluation',
    category: 'Consulting',
    date: '2026',
    description: 'Gave University of the Pacific the data to launch a new medical school within its existing campus capacity, without a single new building.',
    tags: ['Leadership', 'Evaluation', 'Data Analysis', 'Julius.AI'],
    image: '/case-study/space-utilization/projects-card-tower.webp',
    imagePosition: 'center'
  },
  {
    id: 'portfolio',
    title: 'My Portfolio Website',
    category: 'Design',
    date: '2025',
    description: 'An immersive, full-bleed portfolio: scroll-driven reveals, parallax, and animated metrics telling the story of building The Samulation.',
    tags: ['React', 'Spline', 'Immersive Design', 'AI'],
    github: 'https://github.com/blochsam',
    image: '/case-study/3d-scene.webp'
  },
  {
    id: 'dcade',
    title: 'The D-Cade',
    category: 'Design',
    date: '2020',
    description: 'Resurrecting a custom Sega Dreamcast arcade cabinet with Raspberry Pi, 3D printing, and A/V conversion. Now serving a medical waiting room.',
    tags: ['Raspberry Pi', 'RetroPie', '3D Printing', 'Hardware'],
    image: '/case-study/d-cade-card.webp',
    imagePosition: '50% 80%'
  },
  {
    id: 'level-up',
    title: 'Level Up',
    category: 'Design',
    date: '2025',
    description: 'A production LMS for AI-driven career development, built for Quinnipiac in LA. Powers the course and uses Gemini for real-time feedback.',
    tags: ['Next.js', 'Prisma', 'Gemini API', 'Cloud Run'],
    image: '/case-study/level-up-card.webp',
    link: 'https://levelupqu.com'
  },
  {
    id: 'uc-calnat',
    title: 'UC California Climate Stewards',
    category: 'Leadership',
    date: '2024',
    description: 'A Design Thinking engagement for UC Agriculture & Natural Resources: a Community of Practice platform for 9,000+ stewardship alumni.',
    tags: ['Design Thinking', 'UX Research', 'Community Design', 'Stakeholder Interviews'],
    image: '/case-study/calnat-card.webp'
  },
  {
    id: 'zoo-report',
    title: 'Augmented Reality Detroit Zoo App',
    category: 'Design',
    date: '2020',
    description: 'A mobile app concept for zoos: explore exhibits, learn about animals, donate. Wireframe prototypes from research to final UI.',
    tags: ['UX Research', 'Prototyping', 'Mobile', 'Adobe XD'],
    image: '/case-study/zoo-report-card.webp'
  },
  {
    id: 'fudge',
    title: 'Fudge',
    category: 'Design',
    date: '2026',
    description: 'A progressive web app coordinating a 16-person trip to Mackinac Island: magic-link auth, itinerary, room assignments. Built solo with Claude.',
    tags: ['Next.js 15', 'React 19', 'Supabase', 'PWA', 'AI'],
    image: '/case-study/fudge/fudge-card.webp',
    link: 'https://fudge.sam-bloch.com'
  },
  {
    id: 'smart-lockers',
    title: 'Smart Lockers',
    category: 'Design',
    date: '2019',
    description: 'A self-service smart-locker system at Quicken Loans: web portal, Raspberry Pi prototype, and an API that reached the SVP of Infrastructure.',
    tags: ['PHP', 'SQL', 'Python', 'Raspberry Pi', '3D Printing'],
    image: '/case-study/smart-lockers/lockerblock.webp'
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

/** IDs of projects featured on the homepage */
export const FEATURED_PROJECT_IDS = ['portfolio', 'fudge', 'level-up'];

/** Projects with a full immersive case study, in display order.
    Everything else renders as a non-clickable archive card. */
export const CASE_STUDY_IDS = [
  'space-utilization',
  'portfolio',
  'dcade',
  'level-up',
  'uc-calnat',
  'zoo-report',
  'fudge',
  'smart-lockers',
];

/** The three works spotlighted at full size and color at the top of the
    projects grid (matches the homepage featured trio). */
export const SPOTLIGHT_PROJECT_IDS = ['portfolio', 'level-up', 'fudge'];
