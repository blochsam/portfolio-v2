import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { inject as injectAnalytics } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { router } from './routes';
import './index.css';

// Vercel Analytics — tracks page views automatically, zero-config on Vercel
injectAnalytics();
injectSpeedInsights();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const app = (
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If the root already has content (pre-rendered HTML), hydrate instead of
// full render so React can attach event listeners without re-creating the DOM.
if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, app);
} else {
  ReactDOM.createRoot(rootElement).render(app);
}
