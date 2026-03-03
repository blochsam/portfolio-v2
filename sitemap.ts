/**
 * Site map data structure for Sam Bloch Portfolio (The Samulation)
 * Used for documentation and the interactive sitemap component.
 */

export interface SitemapNode {
  id: string;
  label: string;
  type: 'page' | 'view' | 'overlay' | 'modal' | 'section';
  children?: SitemapNode[];
  description?: string;
}

export const SITEMAP: SitemapNode = {
  id: 'root',
  label: 'The Samulation',
  type: 'page',
  description: 'Sam Bloch Portfolio',
  children: [
    {
      id: '2d',
      label: '2D Editorial View',
      type: 'view',
      description: 'Static editorial experience with hero, navigation, and content',
      children: [
        {
          id: '2d-hero',
          label: 'Hero',
          type: 'section',
          description: 'Headline, bio, headshot',
        },
        {
          id: '2d-resume',
          label: 'Resume',
          type: 'page',
          description: 'Full resume with download',
        },
        {
          id: '2d-projects',
          label: 'Projects & Artifacts',
          type: 'page',
          description: 'Archive of projects with filters and search',
          children: [
            {
              id: 'case-study',
              label: 'Case Study',
              type: 'page',
              description: 'Personal Portfolio Redesign (portfolio-v1)',
            },
          ],
        },
        {
          id: '2d-about',
          label: 'About',
          type: 'overlay',
          description: 'Bio, education, photos',
        },
        {
          id: '2d-switch',
          label: 'Enter Immersive 3D',
          type: 'view',
          description: 'Toggle to 3D workstation',
        },
      ],
    },
    {
      id: '3d',
      label: '3D Immersive View',
      type: 'view',
      description: 'Interactive Spline workstation environment',
      children: [
        {
          id: '3d-resume',
          label: 'Resume',
          type: 'page',
          description: 'Full resume with download',
        },
        {
          id: '3d-projects',
          label: 'Projects & Artifacts',
          type: 'page',
          description: 'Archive of projects',
          children: [
            {
              id: '3d-case-study',
              label: 'Case Study',
              type: 'page',
              description: 'Personal Portfolio Redesign',
            },
          ],
        },
        {
          id: '3d-about',
          label: 'About',
          type: 'overlay',
          description: 'Bio, education, photos',
        },
        {
          id: '3d-switch',
          label: 'Switch to Static Site',
          type: 'view',
          description: 'Toggle to 2D editorial',
        },
        {
          id: '3d-objects',
          label: 'Interactive Objects',
          type: 'section',
          description: 'Clickable workstation elements',
          children: [
            { id: 'macbook', label: 'Trust & Safety Operations', type: 'modal' },
            { id: 'monitors', label: 'AI & Systems Innovation', type: 'modal' },
            { id: 'books', label: 'Leadership & Mentorship', type: 'modal' },
            { id: 'fountain', label: 'Consulting', type: 'modal' },
            { id: 'guitar', label: 'About Sam Bloch', type: 'modal' },
            { id: 'sesame', label: 'Sesame (CMO)', type: 'modal' },
          ],
        },
      ],
    },
  ],
};
