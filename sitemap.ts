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
          description: 'Headline, tagline, headshot, logo strip',
        },
        {
          id: '2d-selected-work',
          label: 'Selected Work',
          type: 'section',
          description: 'Featured project cards with case study links',
        },
        {
          id: '2d-focus-areas',
          label: 'Focus Areas',
          type: 'section',
          description: 'Expandable accordions: Trust & Safety, AI & Systems, Leadership, Consulting',
        },
        {
          id: '2d-about',
          label: 'About Me',
          type: 'section',
          description: 'Bio snapshot with link to full overlay',
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
    {
      id: 'shared-pages',
      label: 'Shared Pages',
      type: 'section',
      description: 'Accessible from both 2D and 3D experiences',
      children: [
        {
          id: 'resume',
          label: 'Resume',
          type: 'page',
          description: 'Full resume with PDF download',
        },
        {
          id: 'about-overlay',
          label: 'About Overlay',
          type: 'overlay',
          description: 'Bio, education, photos',
        },
        {
          id: 'projects',
          label: 'Projects & Artifacts',
          type: 'page',
          description: 'Archive of all projects with category filters',
          children: [
            { id: 'cs-portfolio', label: 'My Portfolio Website', type: 'page', description: 'The Samulation case study' },
            { id: 'cs-level-up', label: 'Level Up', type: 'page', description: 'AI-driven LMS for Quinnipiac' },
            { id: 'cs-fudge', label: 'Fudge', type: 'page', description: 'Group trip coordinator PWA' },
            { id: 'cs-calnat', label: 'UC CalNat', type: 'page', description: 'Design Thinking engagement for UC ANR' },
            { id: 'cs-zoo', label: 'AR Zoo App', type: 'page', description: 'Augmented Reality Detroit Zoo concept' },
            { id: 'cs-dcade', label: 'The D-Cade', type: 'page', description: 'Custom Dreamcast arcade cabinet' },
            { id: 'cs-lockers', label: 'Smart Lockers', type: 'page', description: 'IoT locker system at Quicken Loans' },
          ],
        },
      ],
    },
  ],
};
