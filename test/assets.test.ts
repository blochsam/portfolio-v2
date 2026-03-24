// @vitest-environment node
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { PROJECTS } from '../data/projects';

const PUBLIC = path.resolve(__dirname, '..', 'public');

describe('Asset integrity', () => {
  it('all project card images exist on disk', () => {
    const missing: string[] = [];
    for (const p of PROJECTS) {
      if (p.image) {
        const fullPath = path.join(PUBLIC, p.image);
        if (!fs.existsSync(fullPath)) {
          missing.push(`${p.id}: ${p.image}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it('sitemap.xml exists in public/', () => {
    expect(fs.existsSync(path.join(PUBLIC, 'sitemap.xml'))).toBe(true);
  });

  it('robots.txt exists in public/', () => {
    expect(fs.existsSync(path.join(PUBLIC, 'robots.txt'))).toBe(true);
  });

  it('favicon exists in public/', () => {
    expect(fs.existsSync(path.join(PUBLIC, 'favicon.ico'))).toBe(true);
  });

  it('resume PDF exists in public/', () => {
    expect(fs.existsSync(path.join(PUBLIC, 'SBloch_Resume.pdf'))).toBe(true);
  });

  it('og-image.png exists for social sharing', () => {
    expect(fs.existsSync(path.join(PUBLIC, 'og-image.png'))).toBe(true);
  });

  it('no .png images referenced in PROJECTS (should all be .webp)', () => {
    for (const p of PROJECTS) {
      if (p.image) {
        expect(p.image).not.toMatch(/\.png$/);
      }
    }
  });
});

describe('Case study hero images', () => {
  const heroImages = [
    'case-study/calnat-hero.webp',
    'case-study/fudge/fudge-hero.webp',
    'case-study/zoo-hero.webp',
  ];

  for (const img of heroImages) {
    it(`${img} exists`, () => {
      expect(fs.existsSync(path.join(PUBLIC, img))).toBe(true);
    });
  }
});

describe('Image sizes', () => {
  it('hero images are under 1MB', () => {
    const heroes = [
      'case-study/calnat-hero.webp',
      'case-study/fudge/fudge-hero.webp',
      'case-study/zoo-hero.webp',
    ];
    const oversized: string[] = [];
    for (const img of heroes) {
      const fullPath = path.join(PUBLIC, img);
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        if (stats.size > 1_000_000) {
          oversized.push(`${img}: ${(stats.size / 1024).toFixed(0)}KB`);
        }
      }
    }
    expect(oversized).toEqual([]);
  });
});
