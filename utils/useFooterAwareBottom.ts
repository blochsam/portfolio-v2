import { useEffect, useState } from 'react';

const DEFAULT_BOTTOM = 24; // px — resting offset, matches the audio toggle
const GAP = 16; // px — breathing room kept above the footer

// One set of listeners feeds every consumer (deduplicated global listeners),
// so the audio toggle and the PDF FAB always read the same offset.
const subscribers = new Set<(value: number) => void>();
let current = DEFAULT_BOTTOM;
let rafId: number | null = null;
let resizeObserver: ResizeObserver | null = null;

function measure(): number {
  const footer = document.getElementById('site-footer');
  if (!footer) return DEFAULT_BOTTOM;
  const rect = footer.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  // Footer scrolled into view — lift corner UI above it
  if (rect.top < viewportHeight) {
    return Math.max(DEFAULT_BOTTOM, viewportHeight - rect.top + GAP);
  }
  return DEFAULT_BOTTOM;
}

function recompute() {
  rafId = null;
  const next = measure();
  if (next !== current) {
    current = next;
    subscribers.forEach((notify) => notify(current));
  }
}

function schedule() {
  if (rafId != null) return;
  rafId = requestAnimationFrame(recompute);
}

function attach() {
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  // Catch layout shifts (lazy images, route changes) that move the footer
  // without firing a scroll event.
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(document.documentElement);
  }
}

function detach() {
  window.removeEventListener('scroll', schedule);
  window.removeEventListener('resize', schedule);
  resizeObserver?.disconnect();
  resizeObserver = null;
  if (rafId != null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  current = DEFAULT_BOTTOM;
}

/**
 * Shared bottom offset (px) for fixed bottom-corner UI — the audio toggle
 * and the PDF download FAB. Rests at DEFAULT_BOTTOM and rises above the
 * inline footer as it scrolls into view, so both corners track the same
 * line and neither overlaps the footer.
 */
export function useFooterAwareBottom(): number {
  const [bottom, setBottom] = useState(current);

  useEffect(() => {
    if (subscribers.size === 0) attach();
    subscribers.add(setBottom);
    schedule(); // sync to the current route/layout on mount
    setBottom(current);

    return () => {
      subscribers.delete(setBottom);
      if (subscribers.size === 0) detach();
    };
  }, []);

  return bottom;
}
