import { PROJECTS } from './projects';

export interface PageMeta {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: string;
}

const BASE_URL = 'https://sam-bloch.com';

export const ROUTE_META: Record<string, PageMeta> = {
  '/': {
    title: 'Sam Bloch | Program Manager & Builder',
    description:
      'Program Manager at YouTube/Google who ships production software. ' +
      'Trust & Safety operations, AI-enabled building, and systems design. ' +
      'Explore the portfolio in 2D editorial or 3D immersive.',
    ogImage: `${BASE_URL}/og-image.webp`,
  },
  '/3d': {
    title: 'Sam Bloch | 3D Immersive Experience',
    description:
      'Explore Sam Bloch\'s interactive 3D workstation. ' +
      'Click objects on the desk to discover projects, skills, and case studies.',
    ogImage: `${BASE_URL}/og-image.webp`,
  },
  '/resume': {
    title: 'Resume | Sam Bloch',
    description:
      'Program Manager at YouTube/Google with expertise in Trust & Safety, ' +
      'AI innovation, and full-stack development. View experience, skills, and education.',
    ogImage: `${BASE_URL}/og-image.webp`,
  },
  '/projects': {
    title: 'Projects & Artifacts | Sam Bloch',
    description:
      'A collection of projects spanning software, hardware, operations, and design. ' +
      'From production web apps to IoT prototypes to global quality frameworks.',
    ogImage: `${BASE_URL}/og-image.webp`,
  },
  '/privacy-policy': {
    title: 'Privacy Policy | Sam Bloch',
    description: 'Privacy policy for sam-bloch.com. No cookies, no personal data collection, cookieless analytics only.',
  },
};

/**
 * Derive page meta from project data for case study routes.
 * Falls back to generic meta if the project ID is not found.
 */
export function getCaseStudyMeta(projectId: string): PageMeta {
  const project = PROJECTS.find((p) => p.id === projectId);

  if (!project) {
    return {
      title: 'Project | Sam Bloch',
      description: 'A case study by Sam Bloch.',
      ogImage: `${BASE_URL}/og-image.webp`,
    };
  }

  const ogImage = project.image
    ? `${BASE_URL}${project.image}`
    : `${BASE_URL}/og-image.webp`;

  return {
    title: `${project.title} | Sam Bloch`,
    description: project.description,
    ogImage,
  };
}

export { BASE_URL };
