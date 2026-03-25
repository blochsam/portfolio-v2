# The Samulation

My personal portfolio site. Built with React, rendered in 3D (or 2D if your browser says no thanks).

**Live:** [sam-bloch.com](https://sam-bloch.com)

## What's in here

- **3D desk scene** powered by [Spline](https://spline.design/) — click around, find the cat
- **2D editorial fallback** that loads automatically on mobile or when WebGL gives up
- **7 case study pages** with scroll-reveal animations, interactive sitemaps, and PDF export
- **Pre-rendered HTML** for SEO (Playwright generates static pages at build time)
- **Per-route meta tags** so LinkedIn/Slack/iMessage show real previews, not blank cards

## Stack

| Layer | Tool |
|-------|------|
| Framework | React 19 + React Router v7 |
| Styling | Tailwind CSS v4 |
| 3D | Spline (WebGL) |
| Build | Vite 6 |
| Deploy | Vercel |
| Tests | Vitest + Testing Library |
| Pre-render | Playwright (headless) |

## Running locally

```bash
npm install
npm run dev        # localhost:3000
npm test           # 103 tests
npm run build      # production build + pre-render 10 routes
```

## License & Usage

This is my personal portfolio — the code, copy, case studies, and design are mine.

You're welcome to look around, learn from the architecture, or reference patterns for your own projects. That's why it's public. But please don't clone this repo and put your name on it. The case studies describe real work I did, and the 3D scene was hand-built in Spline over 200+ hours (the D-Cade alone took longer than some of my actual projects).

If something here helps you build your own portfolio, that's great. If you have questions about how something works, open an issue — I'm happy to explain.

**TL;DR:** Look, learn, get inspired. Don't copy-paste and deploy as your own.
