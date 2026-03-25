import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { PageMeta } from '../data/routeMeta';
import { BASE_URL } from '../data/routeMeta';

/**
 * Set all SEO-relevant head tags for the current page.
 *
 * Updates document.title, meta description, Open Graph tags,
 * Twitter Card tags, and the canonical URL. On unmount, restores
 * the previous document.title.
 *
 * Relies on placeholder tags in index.html that are updated via
 * querySelector (no DOM element creation needed).
 */
export function usePageMeta(meta: PageMeta) {
  const { pathname } = useLocation();

  useEffect(() => {
    const prevTitle = document.title;

    // Title
    document.title = meta.title;

    // Canonical URL (strip trailing slash, no www)
    const canonical = pathname === '/'
      ? BASE_URL
      : `${BASE_URL}${pathname.replace(/\/+$/, '')}`;

    // Helper to set a meta tag's content attribute
    const setMeta = (selector: string, value: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute('content', value);
    };

    // Helper to set a link tag's href attribute
    const setLink = (selector: string, value: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute('href', value);
    };

    // Meta description
    setMeta('meta[name="description"]', meta.description);

    // Open Graph
    setMeta('meta[property="og:title"]', meta.title);
    setMeta('meta[property="og:description"]', meta.description);
    setMeta('meta[property="og:url"]', canonical);
    setMeta('meta[property="og:type"]', meta.ogType || 'website');
    if (meta.ogImage) {
      setMeta('meta[property="og:image"]', meta.ogImage);
    }

    // Twitter Card
    setMeta('meta[name="twitter:title"]', meta.title);
    setMeta('meta[name="twitter:description"]', meta.description);
    if (meta.ogImage) {
      setMeta('meta[name="twitter:image"]', meta.ogImage);
    }

    // Canonical link
    setLink('link[rel="canonical"]', canonical);

    return () => {
      document.title = prevTitle;
    };
  }, [meta.title, meta.description, meta.ogImage, meta.ogType, pathname]);
}
