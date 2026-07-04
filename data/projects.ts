import { Project } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'matinee',
    title: 'Matinee',
    category: 'Design',
    date: '2026',
    description: 'A cloud-connected e-ink display that turns my Letterboxd reviews into a movie poster for the wall. Custom PCB, ESP32, a cloud render pipeline, and the judgment to ship one source well.',
    tags: ['PCB Design', 'ESP32', 'E-Ink', 'Next.js', 'Supabase'],
    image: '/case-study/matinee/matinee-card.webp'
  },
  {
    id: 'operations',
    title: 'Operations at Scale',
    category: 'Operations',
    date: '2026',
    description: 'Running Trust & Safety operations: one quality standard across 10 global sites and 800+ moderators, calibration as a craft, and changing systems that can\'t stop running.',
    tags: ['Trust & Safety', 'Quality Systems', 'Change Management', 'SQL'],
    image: '/case-study/operations/operations-card.webp'
  },
  {
    id: 'michigan-speech',
    title: 'Michigan Speech',
    category: 'Leadership',
    date: '2018',
    description: 'Fourteen years in Michigan forensics: two state titles, a national champion coached, and founding the Spartanvitational, the largest speech tournament in the state.',
    tags: ['Community', 'Founding', 'Coaching', 'Leadership'],
    image: '/case-study/michigan-speech/michigan-speech-card.webp'
  },
  {
    id: 'space-utilization',
    title: 'Pacific Medical School Space Evaluation',
    category: 'Leadership',
    date: '2026',
    description: 'A graduate program-evaluation modeling whether University of the Pacific could launch a new medical school within its existing campus capacity, without a single new building.',
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
  }
];

/** IDs of projects featured on the homepage */
export const FEATURED_PROJECT_IDS = ['portfolio', 'fudge', 'level-up'];

/** Projects with a full immersive case study, in display order.
    Everything else renders as a non-clickable archive card. */
export const CASE_STUDY_IDS = [
  'matinee',
  'operations',
  'michigan-speech',
  'space-utilization',
  'portfolio',
  'dcade',
  'level-up',
  'uc-calnat',
  'zoo-report',
  'fudge',
  'smart-lockers'
];

/** The three works spotlighted at full size and color at the top of the
    projects grid (matches the homepage featured trio). */
export const SPOTLIGHT_PROJECT_IDS = ['portfolio', 'level-up', 'fudge'];
