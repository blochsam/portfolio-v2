import { describe, it, expect } from 'vitest';
import { COLORS, BRAND_COLORS, CONTENT_MAP, LOGO } from '../constants';

describe('COLORS', () => {
  it('has all required brand colors', () => {
    expect(COLORS.teal).toBe('#24A2A7');
    expect(COLORS.charcoal).toBe('#121212');
    expect(COLORS.grey).toBeTruthy();
    expect(COLORS.darkGrey).toBeTruthy();
    expect(COLORS.accent).toBeTruthy();
  });

  it('BRAND_COLORS is an alias for COLORS', () => {
    expect(BRAND_COLORS).toBe(COLORS);
  });

  it('all color values are valid hex codes', () => {
    for (const [, value] of Object.entries(COLORS)) {
      expect(value).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});

describe('CONTENT_MAP', () => {
  it('has exactly 6 Spline object entries', () => {
    expect(Object.keys(CONTENT_MAP)).toHaveLength(6);
  });

  it('every entry has required fields', () => {
    for (const [key, content] of Object.entries(CONTENT_MAP)) {
      expect(content.id).toBeTruthy();
      expect(content.title).toBeTruthy();
      expect(content.subtitle).toBeTruthy();
      expect(content.description).toBeTruthy();
      expect(content.tags).toBeInstanceOf(Array);
      expect(content.tags.length).toBeGreaterThan(0);
      // Keys should be UUIDs
      expect(key).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    }
  });

  it('has all expected content IDs', () => {
    const ids = Object.values(CONTENT_MAP).map(c => c.id);
    expect(ids).toContain('macbook');
    expect(ids).toContain('monitors');
    expect(ids).toContain('books');
    expect(ids).toContain('fountain');
    expect(ids).toContain('guitar');
    expect(ids).toContain('sesame');
  });

  it('no duplicate content IDs', () => {
    const ids = Object.values(CONTENT_MAP).map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('LOGO', () => {
  it('is a valid React element', () => {
    expect(LOGO).toBeTruthy();
    expect(LOGO.type).toBe('svg');
  });
});
