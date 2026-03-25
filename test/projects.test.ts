import { describe, it, expect } from 'vitest';
import { PROJECTS, FEATURED_PROJECT_IDS } from '../data/projects';

describe('PROJECTS data', () => {
  it('has no duplicate IDs', () => {
    const ids = PROJECTS.map(p => p.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('every project has required fields', () => {
    for (const p of PROJECTS) {
      expect(p.id).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.category).toBeTruthy();
      expect(p.description).toBeTruthy();
      expect(p.tags.length).toBeGreaterThan(0);
      expect(p.date).toMatch(/^\d{4}$/);
    }
  });

  it('categories are valid enum values', () => {
    const validCategories = ['Operations', 'Design', 'AI', 'Leadership'];
    for (const p of PROJECTS) {
      expect(validCategories).toContain(p.category);
    }
  });

  it('image paths use .webp format when present', () => {
    for (const p of PROJECTS) {
      if (p.image) {
        expect(p.image).toMatch(/\.webp$/);
      }
    }
  });

  it('links are valid URLs when present', () => {
    for (const p of PROJECTS) {
      if (p.link) {
        expect(() => new URL(p.link!)).not.toThrow();
      }
      if (p.github) {
        expect(() => new URL(p.github!)).not.toThrow();
      }
    }
  });

  it('no external Unsplash URLs in image fields', () => {
    for (const p of PROJECTS) {
      if (p.image) {
        expect(p.image).not.toContain('unsplash.com');
      }
    }
  });
});

describe('FEATURED_PROJECT_IDS', () => {
  it('all featured IDs exist in PROJECTS', () => {
    const projectIds = new Set(PROJECTS.map(p => p.id));
    for (const id of FEATURED_PROJECT_IDS) {
      expect(projectIds.has(id)).toBe(true);
    }
  });

  it('has exactly 3 featured projects', () => {
    expect(FEATURED_PROJECT_IDS).toHaveLength(3);
  });
});
