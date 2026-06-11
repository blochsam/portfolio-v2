import { track as vercelTrack } from '@vercel/analytics';

type Props = Record<string, string | number | boolean>;

/**
 * Dual-write analytics: Vercel Web Analytics (dashboard) plus our own
 * /api/track -> Supabase pipeline (powers the monthly email report,
 * and records custom events even on the Vercel Hobby plan).
 *
 * Analytics must never break the site — every path swallows errors.
 */
export function track(name: string, props?: Props) {
  try {
    vercelTrack(name, props);
  } catch { /* noop */ }

  if (!import.meta.env.PROD) return;

  try {
    const payload = JSON.stringify({
      name,
      props: props ?? {},
      path: window.location.pathname,
      referrer: document.referrer || null,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', payload);
    } else {
      fetch('/api/track', { method: 'POST', body: payload, keepalive: true }).catch(() => {});
    }
  } catch { /* noop */ }
}
