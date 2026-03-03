# The Samulation: A Portfolio Redesign Case Study

**Role:** UX Architect & Full-Stack Strategist  
**Platform:** React, Spline, Gemini API  
**Year:** 2025

---

## Executive Summary

I redesigned my portfolio from a static, text-heavy site into a dual-view experience that demonstrates systems thinking, technical capability, and inclusive design. The result—the Samulation—serves an accessible 2D editorial experience by default and an immersive 3D workstation for capable devices, with consistent navigation and content across both. The project was an opportunity to explore AI tooling, advance my web development skills, and integrate 3D design using Spline and meshy.ai—all while ensuring no visitor receives a broken or inaccessible experience.

---

## Context & Opportunity

My previous site had been running for years—essentially unchanged since undergraduate graduation. It was clean and functional: white background, teal accent, left-aligned navigation (home, about, project management, web development, ux & design, research & writing, video, personal projects), hero imagery with overlays, and sections for "my story" and "services." It communicated who I was, but it no longer reflected what I could do.

The opportunity was clear. I wanted to:

- **Explore AI tooling** — Integrate generative AI in a meaningful way, not as a gimmick
- **Advance web development** — Move from static HTML/CSS to a modern React architecture
- **Integrate 3D design** — Use Spline and meshy.ai to create an immersive, spatial experience
- **Ship something that proves the thesis** — A portfolio that demonstrates the skills it describes

React became the foundation. It offered component-based architecture, strong ecosystem support for Spline and AI APIs, and the flexibility to build a dual-view system that could adapt to device capability.

---

## The Challenge

The core challenge wasn't aesthetics—it was *demonstration*. Standard portfolios list skills; they rarely show them. I needed a site that could:

1. **Show, not tell** — Prove I can think in systems, ship product, and care about performance
2. **Meet visitors where they are** — Different devices, different contexts, different needs
3. **Stay accessible** — No one should hit a broken page or an experience they can't use
4. **Feel built, not templated** — Distinct, memorable, and aligned with my professional identity

The previous site was competent but forgettable. The new one had to be both ambitious and responsible.

---

## Design Approach

I established three design pillars that guided every decision:

**Tech-Noir aesthetics** — Teal-on-charcoal palette, sharp typography, subtle gradients. Professional without feeling corporate. A deliberate shift from the white, airy predecessor to a more distinctive visual language.

**Editorial minimalism** — Let content breathe. No clutter. Scannable hierarchy. The 2D experience had to feel like a well-designed editorial site, not a brochure.

**Human integrity** — The site should feel personal, not sterile. SamBot—an AI companion powered by Gemini—lives in the corner of the 3D view. Visitors can ask questions; it responds in my voice. The site doesn't just present me; it *converses*.

---

## Solution Overview

**The Samulation** is a dual-layered portfolio:

**Layer one: 2D editorial** — A clean, accessible site with resume, projects, and about. This is the default experience for mobile and lower-spec devices. Navigation is straightforward: back, forward, clear hierarchy. Content is readable, scannable, and works everywhere.

**Layer two: 3D workstation** — A Spline-powered environment where visitors stand at my desk. They can orbit the camera, click objects (MacBook, monitors, books, fountain pen), and surface rich content in overlays. Each object maps to a theme: Trust & Safety, AI & Systems, Leadership, Consulting. The guitar opens the About story. Sesame, my cat, has her own card.

A toggle lets visitors switch between 2D and 3D at any time. Navigation stays consistent across both views—the same menu items, the same content, different presentation.

---

## Key Design Decisions

### Why Dual-View?

Not every device can run a 3D WebGL scene smoothly. Not every visitor wants one. Forcing a single experience would either exclude capable users from the immersive experience or deliver a broken, laggy experience to others.

The dual-view architecture solves this: serve the right experience based on context. Mobile and lower-spec devices get the 2D editorial view by default. Desktop users can opt into the 3D Samulation. Both paths lead to the same content—resume, projects, about—so no one misses information.

### Why Accessibility Mattered: Toggles and Views

Accessibility wasn't an afterthought; it was a design constraint from the start.

**Device capability** — 3D rendering is GPU-intensive. On older hardware or mobile, the experience can stutter or fail. I implemented an "uplink" fallback: detect capability, serve 2D when 3D would perform poorly. No one gets a broken page.

**User preference** — Some visitors prefer a simple, linear experience. The toggle lets them switch from 3D to 2D (and back) at any time. The choice is theirs, not the device's.

**Reduced motion and performance** — I avoided heavy effects that could cause discomfort or lag. For example, I removed `backdrop-blur` over the WebGL canvas when overlays opened—it was causing noticeable jank. A solid `bg-black/70` dimmed the scene without the performance cost. Small decisions compound.

**Consistent navigation** — Whether in 2D or 3D, the same menu items (About, Projects, Resume) are available. Content overlays use the same interaction pattern: click to open, click outside or "Return" to close. Predictability reduces cognitive load.

### Why This Design?

The 3D workstation metaphor—a desk with clickable objects—was chosen for three reasons:

1. **Memorable** — It's distinct. Visitors remember "the site with the desk" more than "the site with the resume."
2. **Demonstrative** — It shows I can integrate 3D, handle WebGL performance, and design for spatial interfaces.
3. **Scalable** — New content can be added as new objects. The architecture supports growth without redesign.

---

## Process

**Discovery** — I audited 50+ high-end portfolios. The gap was clear: "flashy visuals" vs. "functional utility." I wanted both—a site that looked ambitious but worked everywhere.

**Definition** — Three pillars emerged. The Teal-on-Charcoal palette, the dual-view architecture, and the need for a persistent AI companion. All flowed from user research and my own constraints.

**Design** — I created wireframes and a prototype mockup to validate the structure before development. The wireframe captured the layout: logo, nav, 3D workstation placeholder, footer. The prototype refined the visual language. Both informed the build.

**Prototyping** — High-fidelity flows validated the interaction model. Click object → overlay. Click menu → same. Toggle between 2D and 3D. No surprises.

**Test & Iterate** — Mobile stress testing revealed 3D latency. I added the uplink fallback. Overlay testing revealed blur-induced jank; I removed it. Each iteration improved performance and accessibility.

**Develop** — Modular React. Spline for 3D. Gemini for SamBot. Howler for ambient audio. Everything composable and maintainable.

**Deliver** — Launched as a living artifact. It simplifies my message and lets visitors understand my impact in seconds.

---

## Outcomes & Reflection

The Samulation ships. It demonstrates what it describes: systems thinking, attention to performance, and a willingness to build something that feels *made*, not templated.

**What I learned:**

- **Accessibility is design** — Toggles and fallbacks aren't compromises; they're better products. Designing for the edges improves the center.
- **Performance is UX** — Removing `backdrop-blur` fixed overlay lag. Users feel the difference even if they can't name it.
- **The user is you (until it isn't)** — I was the primary user during development. Listening to my own experience—where I got stuck, what felt slow—surfaced issues that would have affected visitors.
- **Ship, then refine** — The case study page evolved from header-heavy to prose-first. The wireframe preceded the prototype. Iteration is the process.

---

*[View the open source repository](https://github.com/sam-bloch)*
