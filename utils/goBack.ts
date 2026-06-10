import type { NavigateFunction } from 'react-router-dom';

/**
 * Navigate back through in-app history when it exists, so the site's
 * Back buttons agree with the browser's. Falls back to a destination
 * for visitors who deep-linked straight into the page.
 */
export function goBack(navigate: NavigateFunction, fallback: string) {
  const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
  if (idx > 0) {
    navigate(-1);
  } else {
    navigate(fallback);
  }
}
