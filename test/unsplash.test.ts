// @vitest-environment node
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const COMPONENTS_DIR = path.resolve(__dirname, '..', 'components');

describe('No external Unsplash URLs in components', () => {
  const componentFiles = fs.readdirSync(COMPONENTS_DIR).filter(f => f.endsWith('.tsx'));

  for (const file of componentFiles) {
    it(`${file} has no Unsplash URLs`, () => {
      const content = fs.readFileSync(path.join(COMPONENTS_DIR, file), 'utf-8');
      const matches = content.match(/https?:\/\/images\.unsplash\.com/g);
      expect(matches ?? []).toEqual([]);
    });
  }
});
