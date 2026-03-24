// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { ROUTE_META, getCaseStudyMeta, BASE_URL } from '../data/routeMeta';
import { PROJECTS } from '../data/projects';

describe('routeMeta', () => {
  describe('ROUTE_META', () => {
    it('has metadata for all static routes', () => {
      const requiredRoutes = ['/', '/3d', '/resume', '/projects'];
      for (const route of requiredRoutes) {
        expect(ROUTE_META[route]).toBeDefined();
        expect(ROUTE_META[route].title).toBeTruthy();
        expect(ROUTE_META[route].description).toBeTruthy();
      }
    });

    it('all descriptions are non-empty and reasonable length', () => {
      for (const [route, meta] of Object.entries(ROUTE_META)) {
        expect(meta.description.length).toBeGreaterThan(20);
        expect(meta.description.length).toBeLessThan(300);
      }
    });

    it('all titles contain "Sam Bloch"', () => {
      for (const [route, meta] of Object.entries(ROUTE_META)) {
        expect(meta.title).toContain('Sam Bloch');
      }
    });

    it('all ogImage URLs are absolute', () => {
      for (const [route, meta] of Object.entries(ROUTE_META)) {
        if (meta.ogImage) {
          expect(meta.ogImage).toMatch(/^https:\/\//);
        }
      }
    });
  });

  describe('getCaseStudyMeta', () => {
    it('returns correct meta for known projects', () => {
      for (const project of PROJECTS) {
        const meta = getCaseStudyMeta(project.id);
        expect(meta.title).toBe(`${project.title} | Sam Bloch`);
        expect(meta.description).toBe(project.description);
      }
    });

    it('returns fallback meta for unknown project ID', () => {
      const meta = getCaseStudyMeta('nonexistent-project');
      expect(meta.title).toBe('Project | Sam Bloch');
      expect(meta.description).toBeTruthy();
    });

    it('ogImage is absolute URL for all projects', () => {
      for (const project of PROJECTS) {
        const meta = getCaseStudyMeta(project.id);
        if (meta.ogImage) {
          expect(meta.ogImage).toMatch(/^https:\/\//);
        }
      }
    });
  });

  describe('BASE_URL', () => {
    it('does not include www', () => {
      expect(BASE_URL).not.toContain('www.');
    });

    it('uses https', () => {
      expect(BASE_URL).toMatch(/^https:\/\//);
    });

    it('has no trailing slash', () => {
      expect(BASE_URL).not.toMatch(/\/$/);
    });
  });
});
