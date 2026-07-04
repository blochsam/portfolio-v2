/**
 * Generates a standalone PDF document HTML for case studies.
 * Opens in a new window - designed to be visually resonant with the site
 * (dark theme, teal accents) as its own document, not a print of the page.
 */

import { track } from './track';

const TEAL = '#24A2A7';
const TEXT_DARK = '#111827';
const TEXT_MEDIUM = '#374151';
const TEXT_MUTED = '#6b7280';

export function generateCaseStudyPdfHtml(projectId: string, baseUrl: string): string {
  // Single choke point for every case-study PDF download
  track('pdf_download', { project: projectId });
  if (projectId === 'portfolio') {
    return generatePortfolioCaseStudyPdf(baseUrl);
  }
  if (projectId === 'dcade') {
    return generateDcadeCaseStudyPdf(baseUrl);
  }
  if (projectId === 'level-up') {
    return generateLevelUpCaseStudyPdf(baseUrl);
  }
  if (projectId === 'zoo-report') {
    return generateZooReportCaseStudyPdf(baseUrl);
  }
  if (projectId === 'uc-calnat') {
    return generateCalNatCaseStudyPdf(baseUrl);
  }
  if (projectId === 'smart-lockers') {
    return generateSmartLockersCaseStudyPdf(baseUrl);
  }
  if (projectId === 'fudge') {
    return generateFudgeCaseStudyPdf(baseUrl);
  }
  if (projectId === 'space-utilization') {
    return generateSpaceUtilizationCaseStudyPdf(baseUrl);
  }
  if (projectId === 'matinee') {
    return generateMatineeCaseStudyPdf(baseUrl);
  }
  if (projectId === 'operations') {
    return generateOperationsCaseStudyPdf(baseUrl);
  }
  if (projectId === 'michigan-speech') {
    return generateMichiganSpeechCaseStudyPdf(baseUrl);
  }
  return generateUnderConstructionPdf(baseUrl);
}

function generateSpaceUtilizationCaseStudyPdf(baseUrl: string): string {
  const origin = baseUrl.replace(/\/$/, '');
  const img = (path: string, alt: string, caption: string) =>
    `<div class="img-block"><img src="${origin}${path}" alt="${alt}"><p class="img-caption">${caption}</p></div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Pacific Medical School Space Evaluation — Sam Bloch</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #ffffff;
      color: ${TEXT_DARK};
      line-height: 1.6;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .doc { max-width: 700px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
    .header { border-bottom: 2px solid ${TEAL}; padding-bottom: 1rem; margin-bottom: 2rem; }
    .logo span:first-child { color: ${TEXT_DARK}; font-weight: 800; font-size: 1.75rem; letter-spacing: -1px; }
    .logo span:last-child { color: ${TEAL}; font-weight: 800; font-size: 1.75rem; letter-spacing: -1px; }
    .meta { color: ${TEAL}; font-size: 0.75rem; margin-top: 0.5rem; }
    h1 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0 0.5rem; color: ${TEXT_DARK}; }
    .subtitle { color: ${TEXT_MUTED}; font-size: 0.9rem; }
    section { margin-bottom: 2rem; page-break-inside: avoid; }
    .section-label { color: ${TEAL}; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
    p { color: ${TEXT_DARK}; font-size: 0.9rem; margin-bottom: 1rem; }
    .stats { display: flex; gap: 1.5rem; margin: 1rem 0; flex-wrap: wrap; }
    .stat { text-align: center; }
    .stat-num { font-size: 1.5rem; font-weight: 700; color: ${TEAL}; }
    .stat-label { font-size: 0.7rem; color: ${TEXT_MUTED}; }
    .img-block img { width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 0.5rem; }
    .img-caption { font-size: 0.65rem; color: ${TEXT_MUTED}; margin-top: 0.25rem; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.85rem; }
    th, td { border: 1px solid #e5e7eb; padding: 0.6rem 0.8rem; text-align: left; }
    th { background: #f3f4f6; color: ${TEXT_DARK}; font-weight: 600; }
    td { color: ${TEXT_DARK}; }
    td strong { color: ${TEAL}; }
    ul { margin: 0.5rem 0 1rem 1.5rem; color: ${TEXT_DARK}; font-size: 0.9rem; }
    li { margin-bottom: 0.25rem; }
    .quote-box { border-left: 3px solid ${TEAL}; padding-left: 1rem; margin: 1rem 0; }
    .role-item { margin-bottom: 0.75rem; }
    .role-title { font-size: 0.8rem; font-weight: 600; color: ${TEAL}; }
    .role-desc { font-size: 0.8rem; color: ${TEXT_MEDIUM}; }
    .footer {
      position: fixed; bottom: 0; left: 0; right: 0;
      padding: 0.75rem 1.5rem;
      border-top: 1px solid #e5e7eb;
      display: flex; justify-content: space-between;
      font-size: 0.7rem; color: ${TEXT_MUTED}; background: #ffffff;
    }
    .footer a { color: ${TEAL}; text-decoration: none; }
    @media print { .doc { padding-bottom: 3rem; } }
  </style>
</head>
<body>
  <div class="doc">
    <header class="header">
      <div class="logo"><span>SAM</span> <span>BLOCH</span></div>
      <p class="meta">Graduate Evaluation Project · LEAD 215 · 2026</p>
      <h1>Pacific Medical School Space Evaluation</h1>
      <p class="subtitle">University of the Pacific · Graduate Program Evaluation</p>
    </header>

    <section>
      <p>A graduate program-evaluation project examining whether University of the Pacific could launch a new medical school using its existing campus capacity, without building a single new classroom. Six semesters of utilization data across three buildings, three findings, one institutional decision.</p>
    </section>

    <div class="stats">
      <div class="stat"><div class="stat-num">4.35%</div><div class="stat-label">Bldg Efficiency</div></div>
      <div class="stat"><div class="stat-num">58/73</div><div class="stat-label">Rooms Unscheduled</div></div>
      <div class="stat"><div class="stat-num">3</div><div class="stat-label">Buildings Audited</div></div>
      <div class="stat"><div class="stat-num">6</div><div class="stat-label">Semesters Analyzed</div></div>
    </div>

    <section>
      <div class="section-label">THE BRIEF</div>
      <p>In early 2026, University of the Pacific was actively scoping the launch of a new medical school. The strategic question was not whether the program had demand. It was whether the existing campus footprint could absorb it.</p>
      <p>Our three-person graduate team took the question on as a course evaluation project. University Facilities was our point of contact; the Office of the President was the ultimate stakeholder for the decision. The brief was specific: stop guessing from anecdote, start measuring from data, and answer a single question with rigor. Could the existing Classroom Building, Chemistry Building, and Olson Hall hold a medical school program without new construction?</p>
      <p><strong>The cost difference between "yes" and "no" was eight figures.</strong></p>
    </section>

    <section>
      <div class="section-label">METHODOLOGY</div>
      <p>Cross-Reference Analysis: we layered scheduling data over physical asset data across six semesters, then built a composite Efficiency Score that combines seat-fill utilization (65% weight) and scheduled intensity (35% weight), normalized within space type.</p>
      <table>
        <tr><th>Data Stream</th><th>Source</th><th>Used For</th></tr>
        <tr><td><strong>Instructional Utilization</strong></td><td>Registrar / EMS</td><td>Peak occupancy and seat-fill rates</td></tr>
        <tr><td><strong>Space Classification</strong></td><td>Academic Affairs</td><td>Lab vs. lecture vs. office distinction</td></tr>
        <tr><td><strong>Administrative Load</strong></td><td>Dean's Office</td><td>Office density and admin footprint</td></tr>
      </table>
      <p>Grounded in Patton's utilization-focused evaluation framework and Russ-Eft &amp; Preskill's Chapter 14 and 16 communication models. Working sessions replaced slide-deck handoffs. Data compilation and analysis were assisted by AI tooling (Julius.AI); the report was drafted with AI support and reviewed by the team.</p>
    </section>

    ${img('/case-study/space-utilization/floor-2.webp', 'Classroom Building floor plan', 'Classroom Building, Floor 1 — color-coded by use (lecture / lab / office / research) with efficiency annotations')}

    <section>
      <div class="section-label">FINDINGS</div>
      <p><strong>Finding 1 — The capacity is already there.</strong> Of 73 classrooms in the Classroom Building, only 15 were scheduled in Spring 2026. Building-level efficiency clocked at 4.35%. Olson Hall ran at 3.55%, Chemistry at 6.67%. The space exists. It just isn't being used.</p>
      <p><strong>Finding 2 — Peak load lives in a narrow window.</strong> Heatmaps revealed that instruction concentrates on Monday through Thursday, 10 AM to 2 PM. The med school could occupy off-peak hours without displacing a single existing class.</p>
      <p><strong>Finding 3 — Power Rooms and Ghost Rooms in the same building.</strong> Olson Hall 120 ran at 48.7% efficiency. Olson Hall 100, the same building, same square footage, ran at 2.8%. The difference is scheduling decisions, not architecture.</p>
    </section>

    <section>
      <div class="section-label">RECOMMENDATIONS</div>
      <ul>
        <li><strong>Tier 1 — No capital investment.</strong> Consolidate repeated low-fill rooms (Olson 103, 105; Classroom 126, 235) and redistribute peak-period loads across underused weekday afternoons.</li>
        <li><strong>Tier 2 — Operational changes.</strong> Re-classify Ghost Rooms as flexible-use spaces available to the medical school program. Schedule the med school primarily in off-peak windows.</li>
        <li><strong>Tier 3 — Long-term renovation.</strong> If capital was eventually needed, target the lowest-efficiency square footage rather than expanding the campus footprint.</li>
      </ul>
    </section>

    <section>
      <div class="section-label">MY ROLE</div>
      <p>This was a three-person graduate project. I owned the analytical work: floor plan analysis, room-by-room data joins, and the recommendations modeling behind the findings and the final briefing.</p>
    </section>

    <section>
      <div class="section-label">THE OUTCOME</div>
      <p>Months later, University of the Pacific announced it would move forward with the medical school. This was a graduate course evaluation, not the board's own analysis, so I won't claim it drove the decision. What I can say is that it modeled the exact question the decision turned on: whether existing campus space could absorb the program without new construction.</p>
    </section>

    <section>
      <div class="section-label">REFLECTION</div>
      <p>I came into this project thinking of evaluation as an analytical discipline. I left thinking of it as a leadership one. The hardest part of the engagement was not running the numbers. It was designing the conversations around them.</p>
      <p>Patton's utilization principle kept us honest the whole way. Every methodological choice was tested against the same question: will this help the President decide, or is it just rigor for rigor's sake? Russ-Eft &amp; Preskill's chapters on facilitated reporting were the difference between findings that sat in a binder and findings that funded a medical school.</p>
    </section>
  </div>

  <div class="footer">
    <span>www.sam-bloch.com</span>
    <a href="https://www.linkedin.com/in/blochsam/">linkedin.com/in/blochsam</a>
    <a href="mailto:sam@sam-bloch.com">sam@sam-bloch.com</a>
  </div>

  <script>
    (function(){
      var imgs = document.querySelectorAll('img');
      var loaded = 0;
      function checkDone() {
        loaded++;
        if (loaded >= imgs.length) setTimeout(function(){ window.print(); }, 300);
      }
      imgs.forEach(function(img) {
        if (img.complete) checkDone();
        else img.onload = img.onerror = checkDone;
      });
      if (imgs.length === 0) setTimeout(function(){ window.print(); }, 500);
    })();
  </script>
</body>
</html>`;
}

function generateUnderConstructionPdf(baseUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Case Study — Sam Bloch</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #ffffff;
      color: ${TEXT_DARK};
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .logo { margin-bottom: 2rem; }
    .logo span:first-child { color: ${TEXT_DARK}; font-weight: 800; font-size: 2rem; letter-spacing: -1px; }
    .logo span:last-child { color: ${TEAL}; font-weight: 800; font-size: 2rem; letter-spacing: -1px; }
    h1 { font-size: 1.5rem; margin-bottom: 1rem; color: ${TEXT_DARK}; }
    p { color: ${TEXT_MEDIUM}; margin-bottom: 2rem; }
    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1rem 2rem;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: ${TEXT_MUTED};
      background: #ffffff;
    }
    .footer a { color: ${TEAL}; text-decoration: none; }
  </style>
</head>
<body>
  <div class="logo"><span>SAM</span> <span>BLOCH</span></div>
  <h1>Under Construction</h1>
  <p>Full case study for this artifact is currently being archived.</p>
  <div class="footer">
    <span>www.sam-bloch.com</span>
    <a href="https://www.linkedin.com/in/blochsam/">linkedin.com/in/blochsam</a>
    <a href="mailto:sam@sam-bloch.com">sam@sam-bloch.com</a>
  </div>
  <script>window.onload=function(){window.print();}</script>
</body>
</html>`;
}

function generateZooReportCaseStudyPdf(baseUrl: string): string {
  const origin = baseUrl.replace(/\/$/, '');
  const img = (path: string, alt: string, caption: string) =>
    `<div class="img-block"><img src="${origin}${path}" alt="${alt}"><p class="img-caption">${caption}</p></div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Augmented Reality Detroit Zoo App — Sam Bloch</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #ffffff;
      color: ${TEXT_DARK};
      line-height: 1.6;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .doc { max-width: 700px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
    .header {
      border-bottom: 2px solid ${TEAL};
      padding-bottom: 1rem;
      margin-bottom: 2rem;
    }
    .logo span:first-child { color: ${TEXT_DARK}; font-weight: 800; font-size: 1.75rem; letter-spacing: -1px; }
    .logo span:last-child { color: ${TEAL}; font-weight: 800; font-size: 1.75rem; letter-spacing: -1px; }
    .meta { color: ${TEAL}; font-size: 0.75rem; margin-top: 0.5rem; }
    h1 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0 0.5rem; color: ${TEXT_DARK}; }
    .subtitle { color: ${TEXT_MUTED}; font-size: 0.9rem; }
    section { margin-bottom: 2rem; page-break-inside: avoid; }
    .section-label { color: ${TEAL}; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
    p { color: ${TEXT_DARK}; font-size: 0.9rem; margin-bottom: 1rem; }
    .img-block img { width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 0.5rem; }
    .img-caption { font-size: 0.65rem; color: ${TEXT_MUTED}; margin-top: 0.25rem; }
    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0.75rem 1.5rem;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
      color: ${TEXT_MUTED};
      background: #ffffff;
    }
    .footer a { color: ${TEAL}; text-decoration: none; }
    @media print { .doc { padding-bottom: 3rem; } }
  </style>
</head>
<body>
  <div class="doc">
    <header class="header">
      <div class="logo"><span>SAM</span> <span>BLOCH</span></div>
      <p class="meta">Augmented Reality Detroit Zoo App · 2020</p>
      <h1>Augmented Reality Detroit Zoo App</h1>
      <p class="subtitle">UX Research & Mobile Prototyping · Paper Prototypes, Figma Wireframes</p>
    </header>

    <div class="img-block">${img('/case-study/zoo-report-mockup.webp', 'Augmented Reality Detroit Zoo App — Explore, animal info, and Donate screens', 'App screens: Explore, Giraffe, Donate')}</div>

    <section>
      <p>The Augmented Reality Detroit Zoo App is a mobile app concept for the Detroit Zoo. Visitors can explore the park on a map, learn about animals with rich profiles and fun facts, engage with a social feed of visitor posts, and donate to support conservation. The project moved from research and paper prototyping to a clickable digital wireframe, with user testing at each stage.</p>
    </section>

    <section>
      <div class="section-label">CONTEXT & OPPORTUNITY</div>
      <p>The goal was to design an experience that helps zoo visitors navigate exhibits, connect with animal stories, and take action through donations. Key flows include exploration (map and search), animal profiles (facts, habitat, social content), and a streamlined donation path—all with a consistent, accessible mobile UI and purple accent branding.</p>
    </section>

    <div class="img-block">${img('/case-study/detroit-zoo-logo.webp', 'Detroit Zoo Logo', 'Detroit Zoo')}</div>

    <section>
      <div class="section-label">PAPER PROTOTYPE DEMO</div>
      <p>Early concepts were tested with a paper prototype to validate structure and flows before moving into digital design. A video walkthrough of the paper prototype is available on the full case study page.</p>
    </section>

    <section>
      <div class="section-label">DESIGN</div>
      <p>The app centers on three main areas: <strong>Explore</strong> (map with animal icons and locations), <strong>Animal profiles</strong> (name, birthday, habitat, fun facts, and a "Learn More" CTA plus social feed), and <strong>Donate</strong> (quick amounts, card fields, saved payments, and process payment). The visual design uses a clean white background, purple accents, and clear hierarchy.</p>
    </section>

    <section>
      <div class="section-label">FINAL WIREFRAME PROTOTYPE DEMO</div>
      <p>The final interactive wireframe brings the flows together in a single prototype for usability testing and stakeholder review. A video demo of the wireframe is available on the full case study page.</p>
    </section>

    <section>
      <div class="section-label">KEY DECISIONS</div>
      <p>Paper prototyping allowed fast iteration on navigation and content priority before committing to screens. The wireframe then refined layout, copy, and interaction details—keeping the donation flow simple and the animal profile informative and social without clutter.</p>
    </section>
  </div>

  <div class="footer">
    <span>www.sam-bloch.com</span>
    <a href="https://www.linkedin.com/in/blochsam/">linkedin.com/in/blochsam</a>
    <a href="mailto:sam@sam-bloch.com">sam@sam-bloch.com</a>
  </div>

  <script>
    (function(){
      var imgs = document.querySelectorAll('img');
      var loaded = 0;
      function checkDone() {
        loaded++;
        if (loaded >= imgs.length) setTimeout(function(){ window.print(); }, 300);
      }
      imgs.forEach(function(img) {
        if (img.complete) checkDone();
        else img.onload = img.onerror = checkDone;
      });
      if (imgs.length === 0) setTimeout(function(){ window.print(); }, 500);
    })();
  </script>
</body>
</html>`;
}

function generateDcadeCaseStudyPdf(baseUrl: string): string {
  const origin = baseUrl.replace(/\/$/, '');
  const img = (path: string, alt: string, caption: string) =>
    `<div class="img-block"><img src="${origin}${path}" alt="${alt}"><p class="img-caption">${caption}</p></div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The D-Cade — Sam Bloch</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #ffffff;
      color: ${TEXT_DARK};
      line-height: 1.6;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .doc { max-width: 700px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
    .header {
      border-bottom: 2px solid ${TEAL};
      padding-bottom: 1rem;
      margin-bottom: 2rem;
    }
    .logo span:first-child { color: ${TEXT_DARK}; font-weight: 800; font-size: 1.75rem; letter-spacing: -1px; }
    .logo span:last-child { color: ${TEAL}; font-weight: 800; font-size: 1.75rem; letter-spacing: -1px; }
    .meta { color: ${TEAL}; font-size: 0.75rem; margin-top: 0.5rem; }
    h1 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0 0.5rem; color: ${TEXT_DARK}; }
    .subtitle { color: ${TEXT_MUTED}; font-size: 0.9rem; }
    section { margin-bottom: 2rem; page-break-inside: avoid; }
    .section-label { color: ${TEAL}; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
    p { color: ${TEXT_DARK}; font-size: 0.9rem; margin-bottom: 1rem; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.85rem; }
    th, td { border: 1px solid #e5e7eb; padding: 0.6rem 0.8rem; text-align: left; }
    th { background: #f3f4f6; color: ${TEXT_DARK}; font-weight: 600; }
    td { color: ${TEXT_DARK}; }
    td strong { color: ${TEAL}; }
    .img-block img { width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 0.5rem; }
    .img-caption { font-size: 0.65rem; color: ${TEXT_MUTED}; margin-top: 0.25rem; }
    ul { margin: 0.5rem 0 1rem 1.5rem; color: ${TEXT_DARK}; font-size: 0.9rem; }
    li { margin-bottom: 0.25rem; }
    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0.75rem 1.5rem;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
      color: ${TEXT_MUTED};
      background: #ffffff;
    }
    .footer a { color: ${TEAL}; text-decoration: none; }
    @media print { .doc { padding-bottom: 3rem; } }
  </style>
</head>
<body>
  <div class="doc">
    <header class="header">
      <div class="logo"><span>SAM</span> <span>BLOCH</span></div>
      <p class="meta">A Raspberry Pi Arcade · 2020</p>
      <h1>The D-Cade</h1>
      <p class="subtitle">A busted Sega Dreamcast. A $35 computer. 200+ hours of soldering, printing, and coding.</p>
    </header>

    <section>
      <p>A custom-built Sega Dreamcast cabinet sat broken and dormant. I gutted the failed internals and replaced them with a Raspberry Pi architecture, creating a refurbished, Linux-powered retro gaming hub with 35+ titles. The D-Cade now serves as primary entertainment for patients at a private medical practice in South Lyon, Michigan.</p>
      <table>
        <tr><th>35+ Retro Games</th><th>1 Raspberry Pi</th><th>200+ Build Hours</th></tr>
        <tr><td>Curated ROM library</td><td>$35 core computer</td><td>Soldering, printing, coding</td></tr>
      </table>
    </section>

    <div class="img-block">${img('/case-study/d-cade-hero.webp', 'The D-Cade cabinet', 'The D-Cade arcade cabinet')}</div>

    <section>
      <div class="section-label">CONTEXT & CHALLENGE</div>
      <p>The cabinet was "dead tech"—sentimental but lacking modern utility. The goal: bridge decade-old analog hardware and modern digital emulation, transforming a heavy, broken wooden shell into a reliable, plug-and-play entertainment system for high-traffic social environments (the "D-House").</p>
    </section>

    <section>
      <div class="section-label">THE SOLUTION</div>
      <p>The D-Cade—a refurbished, Linux-powered retro gaming hub. By gutting the failed Dreamcast internals and replacing them with a custom Raspberry Pi architecture, I created a scalable library of 35+ titles housed in a modernized, 3D-printed, and custom-branded chassis.</p>
    </section>

    <section>
      <div class="section-label">TECHNICAL METHODOLOGY: THE REFURBISHMENT STACK</div>
      <table>
        <tr><th>Phase</th><th>Technical Action</th><th>UX & Operational Goal</th></tr>
        <tr><td><strong>Gutting & Retrofit</strong></td><td>Replaced Sega Dreamcast with Raspberry Pi (RetroPie).</td><td>Stability: Moving from failing optical drives to solid-state SD storage.</td></tr>
        <tr><td><strong>Signal Processing</strong></td><td>Integrated A/V converters and a custom soundboard.</td><td>Atmosphere: Boosting 2000s-era speaker output to modern "social gathering" volumes.</td></tr>
        <tr><td><strong>Custom Fabrication</strong></td><td>3D printed internal mounts and cable management brackets.</td><td>Organization: Creating a "clean" interior for easy maintenance and cooling.</td></tr>
        <tr><td><strong>UI Customization</strong></td><td>Developed custom Linux splash screens and ROM overlays.</td><td>Branding: Ensuring the "D-Cade" felt like a bespoke product, not a generic emulator.</td></tr>
      </table>
    </section>

    <section>
      <div class="section-label">ENGINEERING HIGHLIGHTS</div>
      <p><strong>The 3D-Printed Infrastructure:</strong> Standard Raspberry Pi cases didn't fit the vintage drawer dimensions. I designed and 3D-printed custom mounting brackets that allowed the Pi to sit securely in a sliding drawer—easy access for software updates while keeping the exterior aesthetic period-accurate and cord-free.</p>
      <p><strong>Analog-to-Digital Audio Bridge:</strong> To preserve the "thump" of the original cabinet's vintage speakers, I routed the signal through a dedicated soundboard and soldering-iron-modified connections—resulting in high-fidelity audio that could cut through the noise of an a cappella house rehearsal.</p>
    </section>

    <div class="img-block">${img('/case-study/d-cade-splash.webp', 'Custom D-Cade splash screen', 'Custom D-Cade splash screen')}</div>

    <section>
      <div class="section-label">DESIGN DECISIONS: WHY "D-CADE"?</div>
      <p>The cabinet was designed for members of my a cappella group, the Dischords, and their guests. I created custom "D-Cade" splash screens—when the cabinet boots, it shows house branding, not Linux code. In a house full of students, the system had to be "drunk-proof": I installed a new access door and simplified the power-on sequence so anyone could start a game without a technical manual.</p>
    </section>

    <section>
      <div class="section-label">PROCESS & CRAFTMANSHIP</div>
      <ul>
        <li><strong>Auditing the shell</strong> — Stripped the original wood and assessed structural integrity.</li>
        <li><strong>Hardware selection</strong> — Raspberry Pi (Raspbian/RetroPie) for low power draw and high customizability.</li>
        <li><strong>Fabrication</strong> — Soldered new A/V paths and 3D printed the internal layout.</li>
        <li><strong>Content curation</strong> — Manually imported and tested 35+ ROMs for joystick-to-GPIO compatibility.</li>
      </ul>
    </section>

    <section>
      <div class="section-label">OUTCOMES & LEGACY</div>
      <p>The D-Cade transitioned from a personal project to public infrastructure. It served as the focal point for social gatherings at the D-House for two years and proved robust enough to be donated—now the primary entertainment for patients in a doctor's office waiting room in South Lyon, Michigan.</p>
    </section>

    <section>
      <div class="section-label">THE CREW</div>
      <table>
        <tr><th>Name</th><th>Role</th></tr>
        <tr><td><strong>Sam</strong></td><td>Chief Architect — hardware, software, fabrication</td></tr>
        <tr><td><strong>Alec "Milk"</strong></td><td>Gameplay Tester</td></tr>
        <tr><td><strong>Logan</strong></td><td>Gameplay Tester</td></tr>
        <tr><td><strong>Ethan</strong></td><td>Gameplay Tester</td></tr>
      </table>
    </section>

    <section>
      <div class="section-label">SKILLS</div>
      <p><strong>Technical:</strong> Raspberry Pi, RetroPie/Linux, 3D Printing (Tinkercad), Soldering & A/V Wiring, GPIO Configuration, ROM Management</p>
      <p><strong>Soft:</strong> Self-directed learning, resourcefulness, problem-solving under constraint, documentation</p>
    </section>
  </div>

  <div class="footer">
    <span>www.sam-bloch.com</span>
    <a href="https://www.linkedin.com/in/blochsam/">linkedin.com/in/blochsam</a>
    <a href="mailto:sam@sam-bloch.com">sam@sam-bloch.com</a>
  </div>

  <script>
    (function(){
      var imgs = document.querySelectorAll('img');
      var loaded = 0;
      function checkDone() {
        loaded++;
        if (loaded >= imgs.length) setTimeout(function(){ window.print(); }, 300);
      }
      imgs.forEach(function(img) {
        if (img.complete) checkDone();
        else img.onload = img.onerror = checkDone;
      });
      if (imgs.length === 0) setTimeout(function(){ window.print(); }, 500);
    })();
  </script>
</body>
</html>`;
}

function generateLevelUpCaseStudyPdf(baseUrl: string): string {
  const origin = baseUrl.replace(/\/$/, '');
  const img = (path: string, alt: string, caption: string) =>
    `<div class="img-block"><img src="${origin}${path}" alt="${alt}"><p class="img-caption">${caption}</p></div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Level Up — Sam Bloch</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #ffffff;
      color: ${TEXT_DARK};
      line-height: 1.6;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .doc { max-width: 700px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
    .header {
      border-bottom: 2px solid ${TEAL};
      padding-bottom: 1rem;
      margin-bottom: 2rem;
    }
    .logo span:first-child { color: ${TEXT_DARK}; font-weight: 800; font-size: 1.75rem; letter-spacing: -1px; }
    .logo span:last-child { color: ${TEAL}; font-weight: 800; font-size: 1.75rem; letter-spacing: -1px; }
    .meta { color: ${TEAL}; font-size: 0.75rem; margin-top: 0.5rem; }
    h1 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0 0.5rem; color: ${TEXT_DARK}; }
    .subtitle { color: ${TEXT_MUTED}; font-size: 0.9rem; }
    section { margin-bottom: 2rem; page-break-inside: avoid; }
    .section-label { color: ${TEAL}; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
    p { color: ${TEXT_DARK}; font-size: 0.9rem; margin-bottom: 1rem; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.85rem; }
    th, td { border: 1px solid #e5e7eb; padding: 0.6rem 0.8rem; text-align: left; }
    th { background: #f3f4f6; color: ${TEXT_DARK}; font-weight: 600; }
    td { color: ${TEXT_DARK}; }
    td strong { color: ${TEAL}; }
    .img-block img { width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 0.5rem; }
    .img-caption { font-size: 0.65rem; color: ${TEXT_MUTED}; margin-top: 0.25rem; }
    ul { margin: 0.5rem 0 1rem 1.5rem; color: ${TEXT_DARK}; font-size: 0.9rem; }
    li { margin-bottom: 0.25rem; }
    .stats { display: flex; gap: 1.5rem; margin: 1rem 0; flex-wrap: wrap; }
    .stat { text-align: center; }
    .stat-num { font-size: 1.5rem; font-weight: 700; color: ${TEAL}; }
    .stat-label { font-size: 0.7rem; color: ${TEXT_MUTED}; }
    blockquote { border-left: 3px solid ${TEAL}; padding-left: 1rem; margin: 1rem 0; font-style: italic; color: ${TEXT_MEDIUM}; font-size: 0.85rem; }
    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0.75rem 1.5rem;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
      color: ${TEXT_MUTED};
      background: #ffffff;
    }
    .footer a { color: ${TEAL}; text-decoration: none; }
    @media print { .doc { padding-bottom: 3rem; } }
  </style>
</head>
<body>
  <div class="doc">
    <header class="header">
      <div class="logo"><span>SAM</span> <span>BLOCH</span></div>
      <p class="meta">Course Design, Full-Stack Development & Instruction · 2023–2026</p>
      <h1>Level Up</h1>
      <p class="subtitle">How a campus tour at Google turned into a custom-built LMS, a four-week intensive on career readiness, and my first time at the front of a classroom.</p>
    </header>

    <div class="stats">
      <div class="stat"><div class="stat-num">4</div><div class="stat-label">Students, 4 Weeks</div></div>
      <div class="stat"><div class="stat-num">5</div><div class="stat-label">Google Panelists</div></div>
      <div class="stat"><div class="stat-num">1</div><div class="stat-label">Custom LMS from Scratch</div></div>
    </div>

    ${img('/case-study/level-up/qu-google-tour-2023.webp', 'QU in LA students at Google campus, summer 2023', 'Summer 2023 — QU in LA students at Google&#39;s Spruce Goose hangar')}

    <section>
      <div class="section-label">THE SPARK</div>
      <p>In the summer of 2023, Quinnipiac's "QU in LA" program brought a group of students to Los Angeles. I'd just finished my MS at Quinnipiac and volunteered to host them at Google's Playa Vista campus. I put together two panels, got Krista Phillip (a QU alum and Google product lead) to join, and toured them through the Spruce Goose hangar.</p>
      <p>The students were sharp, full of questions I remembered asking myself not that long ago. But I kept noticing a gap: they were smart and motivated, but nobody had taught them the practical, strategic work of actually building a career.</p>
    </section>

    <section>
      <div class="section-label">THE PARTNERSHIP</div>
      <p>Over the next year, I stayed in touch with Andres Rosende, the program coordinator at Quinnipiac's School of Communications. We kept circling back to the same problem: students were graduating with strong academic credentials but limited practical tools for actually landing a job.</p>
      <p>What if I designed an entire course? Andres and the school gave me the green light. I would design the curriculum, build the platform, and teach it myself as an adjunct professor during the Spring 2026 QU in LA cohort.</p>
    </section>

    <section>
      <div class="section-label">THE COURSE: FOUR WEEKS, FOUR MODULES</div>
      <p>I built the course around two books: Meg Jay's <em>The Defining Decade</em> and Robert Cialdini's <em>Pre-Suasion</em>. Four weeks. Each module built on the last. Every part had readings, written reflections, and assignments that forced students to actually do the thing, not just learn about it.</p>
      <table>
        <tr><th>Module</th><th>Week</th><th>Key Activities</th></tr>
        <tr><td><strong>Building Your Brand</strong></td><td>1</td><td>LinkedIn bio, identity capital audit, professional headshot, resume update. Posted to discussion board for peer review.</td></tr>
        <tr><td><strong>Building Your Network</strong></td><td>2</td><td>Weak ties, coffee chat openers, 3 real LinkedIn outreach messages, a 30-minute networking meeting, handwritten thank-you letter.</td></tr>
        <tr><td><strong>Building Your Impact</strong></td><td>3</td><td>Head-up vs. head-down work, pre-suasion, 12-minute efficiency presentation at Google with live feedback from five engineers.</td></tr>
        <tr><td><strong>Building Your Start</strong></td><td>4</td><td>AI-driven interview practice (STAR method), creative application strategies, comprehensive Personal Action Plan.</td></tr>
      </table>
      <p>The final deliverable was a Personal Action Plan: top 10 target companies, springboard job listings with overqualification justifications, a professional bio, 5 STAR interview stories, a cover letter template, references, and an accountability reflection.</p>
    </section>

    ${img('/case-study/level-up-dashboard.webp', 'Level Up LMS dashboard', 'The student dashboard — assignments, deadlines, and course materials in one view')}

    <section>
      <div class="section-label">THE PLATFORM</div>
      <p>I could have used Canvas or Blackboard. But those platforms are built for broad university administration, not for a four-student intensive with AI-driven interview practice and automated assignment analysis. So I built <strong>levelupqu.com</strong> — a production Next.js application running on Cloud Run, storing data in PostgreSQL via Prisma, and integrating Gemini for real-time AI features.</p>
      <p><strong>AI Interview Practice:</strong> Students paste a real job posting, and the system generates behavioral questions. They respond out loud using the Web Speech API, and Gemini evaluates their answers for STAR method structure.</p>
      <p><strong>AI-Assisted Grading:</strong> When a student uploads a reflection PDF, Gemini analyzes it against the assignment rubric. I still read everything myself, but the AI gives me a content summary and suggested feedback points.</p>
      <p><strong>LevelUpBot:</strong> A course-aware chatbot for logistics ("When is the residency?" or "What's the PAP due date?"). Engineered the system prompt to refuse anything academic — it won't summarize readings or interpret course concepts.</p>
    </section>

    ${img('/case-study/level-up-interview.webp', 'AI Interview Practice interface', 'AI Interview Practice — voice-to-text with real-time STAR method feedback')}

    <section>
      <div class="section-label">THE CLASSROOM</div>
      <p>February 4, 2026. Four students. In my welcome email, I told them straight: "To be totally candid: this is my first time teaching, and I couldn't have asked for a better inaugural cohort." We met Wednesday evenings at 6:30. By week two, they were sending real LinkedIn messages to professionals they'd never met. By week three, they were practicing pre-suasion techniques and building a pitch presentation.</p>
    </section>

    <section>
      <div class="section-label">THE RESIDENCY: FEBRUARY 27 AT GOOGLE</div>
      <p>Google's Playa Vista campus. 8:30 AM to 5 PM. A full-day residency I'd been building toward since the first class session. I recruited five Google colleagues to run three panel blocks: early career insights, leadership perspectives, and a judging panel where the students would pitch their capstone project and get live feedback on their logic, ROI math, and presentation skills.</p>
      <p>The students presented "Stop Sleeping Your Day Away" — a process improvement pitch for an app called Sheep Counter. They came in with real data: 56% of people hit snooze, their group loses about 2 hours every morning getting ready. They built a working prototype, scaled their ROI math to Google's 187,000 employees, and calculated over a million minutes of productivity gains.</p>
    </section>

    <section>
      <div class="section-label">IN THEIR WORDS</div>
      <blockquote>"No shade to anyone, but we took a class at Quinnipiac that was meant to give us similar tools, but this class was handled much more effectively." — Post-residency survey</blockquote>
      <blockquote>"It's crazy to think this course was only four weeks long, and yet, I feel like I've learned an entire semester's worth of important knowledge and skills." — Post-residency survey</blockquote>
      <blockquote>"It is probably the most I've felt like an 'adult' in my life and showed me things I didn't know I was capable of." — On the Google residency</blockquote>
      <blockquote>"I have never felt more prepared to begin building my career in the way I have always desired." — Personal Action Plan</blockquote>
    </section>

    <section>
      <div class="section-label">ENGINEERING CHALLENGES</div>
      <p><strong>Timezone Integrity:</strong> Due dates stored as "11:59 PM" kept mismatching between the server (UTC) and students' local time in LA. Fixed by standardizing the database on UTC and building a React bridge that converts datetime-local values to ISO on submission and re-localizes them for the student view.</p>
      <p><strong>Syllabus-to-Context Pipeline:</strong> The chatbot needed to stay current as I tweaked the course week-to-week. Built a "Context Notebook" architecture where the bot's system prompt gets dynamically injected with the latest data from the Module, Assignment, and Material tables in PostgreSQL.</p>
    </section>

    <section>
      <div class="section-label">TECH STACK</div>
      <table>
        <tr><th>Technology</th><th>Role</th></tr>
        <tr><td><strong>Next.js 14</strong></td><td>Full-stack framework (App Router)</td></tr>
        <tr><td><strong>PostgreSQL + Prisma</strong></td><td>Database and ORM</td></tr>
        <tr><td><strong>Gemini API</strong></td><td>Interview practice, grading assistance, chatbot</td></tr>
        <tr><td><strong>Google Cloud Run</strong></td><td>Containerized deployment</td></tr>
        <tr><td><strong>Tailwind CSS</strong></td><td>UI styling</td></tr>
        <tr><td><strong>NextAuth.js</strong></td><td>Authentication (@quinnipiac.edu allowlist)</td></tr>
        <tr><td><strong>Web Speech API</strong></td><td>Voice-to-text for interview practice</td></tr>
      </table>
    </section>

    <section>
      <div class="section-label">LOOKING BACK</div>
      <p>I posted about the experience on LinkedIn. One of the Google volunteers commented: "Rewarding experience to interact with brilliant peers and students."</p>
      <p>This project sits at the intersection of everything I care about: building software that solves real problems, teaching people things that matter, and doing it all while holding down the day job. The LMS is production code. The curriculum is mine. The students are real people with real careers ahead of them.</p>
    </section>
  </div>

  <div class="footer">
    <span>www.sam-bloch.com</span>
    <a href="https://levelupqu.com">levelupqu.com</a>
    <a href="https://www.linkedin.com/in/blochsam/">linkedin.com/in/blochsam</a>
    <a href="mailto:sam@sam-bloch.com">sam@sam-bloch.com</a>
  </div>

  <script>
    (function(){
      var imgs = document.querySelectorAll('img');
      var loaded = 0;
      function checkDone() {
        loaded++;
        if (loaded >= imgs.length) setTimeout(function(){ window.print(); }, 300);
      }
      imgs.forEach(function(img) {
        if (img.complete) checkDone();
        else img.onload = img.onerror = checkDone;
      });
      if (imgs.length === 0) setTimeout(function(){ window.print(); }, 500);
    })();
  </script>
</body>
</html>`;
}

function generatePortfolioCaseStudyPdf(baseUrl: string): string {
  const origin = baseUrl.replace(/\/$/, '');
  const img = (path: string, alt: string, caption: string) =>
    `<div class="img-block"><img src="${origin}${path}" alt="${alt}"><p class="img-caption">${caption}</p></div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Personal Portfolio Redesign — Sam Bloch</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #ffffff;
      color: ${TEXT_DARK};
      line-height: 1.6;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .doc { max-width: 700px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
    .header {
      border-bottom: 2px solid ${TEAL};
      padding-bottom: 1rem;
      margin-bottom: 2rem;
    }
    .logo span:first-child { color: ${TEXT_DARK}; font-weight: 800; font-size: 1.75rem; letter-spacing: -1px; }
    .logo span:last-child { color: ${TEAL}; font-weight: 800; font-size: 1.75rem; letter-spacing: -1px; }
    .meta { color: ${TEAL}; font-size: 0.75rem; margin-top: 0.5rem; }
    h1 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0 0.5rem; color: ${TEXT_DARK}; }
    .subtitle { color: ${TEXT_MUTED}; font-size: 0.9rem; }
    section { margin-bottom: 2rem; page-break-inside: avoid; }
    .section-label { color: ${TEAL}; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
    p { color: ${TEXT_DARK}; font-size: 0.9rem; margin-bottom: 1rem; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.85rem; }
    th, td { border: 1px solid #e5e7eb; padding: 0.6rem 0.8rem; text-align: left; }
    th { background: #f3f4f6; color: ${TEXT_DARK}; font-weight: 600; }
    td { color: ${TEXT_DARK}; }
    td strong { color: ${TEAL}; }
    .img-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0; }
    .img-grid-3 { grid-template-columns: repeat(3, 1fr); }
    .img-block img { width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 0.5rem; }
    .img-caption { font-size: 0.65rem; color: ${TEXT_MUTED}; margin-top: 0.25rem; }
    .img-block.full img { width: 100%; }
    ul { margin: 0.5rem 0 1rem 1.5rem; color: ${TEXT_DARK}; font-size: 0.9rem; }
    li { margin-bottom: 0.25rem; }
    code { color: ${TEAL}; font-size: 0.85em; }
    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0.75rem 1.5rem;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
      color: ${TEXT_MUTED};
      background: #ffffff;
    }
    .footer a { color: ${TEAL}; text-decoration: none; }
    @media print { .doc { padding-bottom: 3rem; } }
  </style>
</head>
<body>
  <div class="doc">
    <header class="header">
      <div class="logo"><span>SAM</span> <span>BLOCH</span></div>
      <p class="meta">Portfolio Redesign · 2025</p>
      <h1>The Samulation</h1>
      <p class="subtitle">A dual-view portfolio — 2D editorial site and interactive 3D workstation, one React codebase</p>
    </header>

    <section>
      <p>I rebuilt my portfolio from scratch as a dual-view experience — a 2D editorial site and an interactive 3D workstation, running from one React codebase. The 2D side reads like a magazine. The 3D side lets you explore my desk, click objects, and discover content spatially.</p>
      <table>
        <tr><th>2 Parallel Experiences</th><th>5+ Case Studies</th><th>6 Interactive Objects</th><th>Zero Templates</th></tr>
        <tr><td>2D editorial + 3D workstation</td><td>Immersive, scroll-driven</td><td>Guitar, monitors, desk</td><td>Built from scratch</td></tr>
      </table>
    </section>

    <section>
      <div class="section-label">CONTEXT & OPPORTUNITY</div>
      <p>My previous site had been running for years—essentially unchanged since undergraduate graduation. It was clean and functional but no longer reflected what I could do. The opportunity was clear. I wanted to:</p>
      <table>
        <tr><th>Goal</th><th>Description</th></tr>
        <tr><td><strong>Explore AI tooling</strong></td><td>Integrate generative AI in a meaningful way</td></tr>
        <tr><td><strong>Advance web development</strong></td><td>Move from static HTML/CSS to React</td></tr>
        <tr><td><strong>Integrate 3D design</strong></td><td>Use Spline and meshy.ai for spatial experience</td></tr>
        <tr><td><strong>Ship something that proves the thesis</strong></td><td>A portfolio that demonstrates the skills it describes</td></tr>
      </table>
      <div class="img-grid">${img('/case-study/before-home.webp', 'Before: Home', 'Previous portfolio home')}${img('/case-study/before-about.webp', 'Before: About', 'Previous portfolio about')}</div>
    </section>

    <section>
      <div class="section-label">THE CHALLENGE</div>
      <p>The core challenge wasn't aesthetics—it was <em>demonstration</em>. I needed a site that could show (not tell), meet visitors where they are, stay accessible, and feel built—not templated.</p>
      <table>
        <tr><th>Requirement</th><th>Description</th></tr>
        <tr><td><strong>Show, not tell</strong></td><td>Prove I can think in systems and ship product</td></tr>
        <tr><td><strong>Meet visitors where they are</strong></td><td>Different devices, contexts, needs</td></tr>
        <tr><td><strong>Stay accessible</strong></td><td>No broken pages or unusable experiences</td></tr>
        <tr><td><strong>Feel built, not templated</strong></td><td>Distinct and aligned with my identity</td></tr>
      </table>
    </section>

    <section>
      <div class="section-label">DESIGN APPROACH</div>
      <p>Three design pillars guided every decision:</p>
      <table>
        <tr><th>Pillar</th><th>Description</th></tr>
        <tr><td><strong>Tech-Noir aesthetics</strong></td><td>Teal-on-charcoal palette, sharp typography. Professional without corporate.</td></tr>
        <tr><td><strong>Editorial minimalism</strong></td><td>Let content breathe. Scannable hierarchy.</td></tr>
        <tr><td><strong>Human integrity</strong></td><td>SamBot—AI companion powered by Gemini—converses in my voice.</td></tr>
      </table>
      <div class="img-block full">${img('/case-study/wireframe.webp', 'Wireframe', 'Structure before build')}</div>
    </section>

    <section>
      <div class="section-label">SOLUTION OVERVIEW</div>
      <p><strong>The Samulation</strong> is a dual-layered portfolio: 2D editorial (accessible, default for mobile) and 3D workstation (Spline-powered, clickable objects). A toggle lets visitors switch at any time.</p>
      <div class="img-block full">${img('/case-study/3d-scene.webp', '3D workstation', 'The Samulation')}</div>
      <div class="section-label" style="margin-top: 1rem;">PROCESS: SPLINE · MESHY.AI · REACT</div>
      <div class="img-grid img-grid-3">${img('/case-study/spline-workflow.webp', 'Spline', 'Building Sam\'s Desk')}${img('/case-study/meshy-workflow.webp', 'Meshy.ai', '3D asset generation')}${img('/case-study/code-screenshot.webp', 'Code', 'index.html')}</div>
      <div class="section-label" style="margin-top: 1.5rem;">THE RESULT: LIVE SITE</div>
      <div class="img-grid">${img('/case-study/hero-desktop.webp', 'Hero', 'New site')}${img('/case-study/resume-page.webp', 'Resume', 'New site')}</div>
    </section>

    <section>
      <div class="section-label">KEY DESIGN DECISIONS</div>
      <p><strong>Why Dual-View?</strong> Not every device runs 3D smoothly. The architecture serves the right experience based on context.</p>
      <p><strong>Why This Design?</strong> Memorable (distinct), demonstrative (shows 3D/WebGL skills), scalable (new content as new objects).</p>
    </section>

    <section>
      <div class="section-label">ACCESSIBILITY</div>
      <p>Device capability (uplink fallback), user preference (toggle), reduced motion (removed backdrop-blur for performance), consistent navigation across 2D and 3D.</p>
    </section>

    <section>
      <div class="section-label">WHAT I LEARNED</div>
      <ul>
        <li><strong>Accessibility is design</strong> — Toggles and fallbacks are better products.</li>
        <li><strong>Performance is UX</strong> — Removing backdrop-blur fixed overlay lag.</li>
        <li><strong>The user is you (until it isn't)</strong> — Listening to my own experience surfaced issues.</li>
        <li><strong>Ship, then refine</strong> — Iteration is the process.</li>
      </ul>
    </section>
  </div>

  <div class="footer">
    <span>www.sam-bloch.com</span>
    <a href="https://www.linkedin.com/in/blochsam/">linkedin.com/in/blochsam</a>
    <a href="mailto:sam@sam-bloch.com">sam@sam-bloch.com</a>
  </div>

  <script>
    (function(){
      var imgs = document.querySelectorAll('img');
      var loaded = 0;
      function checkDone() {
        loaded++;
        if (loaded >= imgs.length) setTimeout(function(){ window.print(); }, 300);
      }
      imgs.forEach(function(img) {
        if (img.complete) checkDone();
        else img.onload = img.onerror = checkDone;
      });
      if (imgs.length === 0) setTimeout(function(){ window.print(); }, 500);
    })();
  </script>
</body>
</html>`;
}

function generateCalNatCaseStudyPdf(baseUrl: string): string {
  const origin = baseUrl.replace(/\/$/, '');
  const img = (path: string, alt: string, caption: string) =>
    `<div class="img-block"><img src="${origin}${path}" alt="${alt}"><p class="img-caption">${caption}</p></div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>UC California Climate Stewards — Sam Bloch</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #ffffff;
      color: ${TEXT_DARK};
      line-height: 1.6;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .doc { max-width: 700px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
    .header { border-bottom: 2px solid ${TEAL}; padding-bottom: 1rem; margin-bottom: 2rem; }
    .logo span:first-child { color: ${TEXT_DARK}; font-weight: 800; font-size: 1.75rem; letter-spacing: -1px; }
    .logo span:last-child { color: ${TEAL}; font-weight: 800; font-size: 1.75rem; letter-spacing: -1px; }
    .meta { color: ${TEAL}; font-size: 0.75rem; margin-top: 0.5rem; }
    h1 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0 0.5rem; color: ${TEXT_DARK}; }
    .subtitle { color: ${TEXT_MUTED}; font-size: 0.9rem; }
    section { margin-bottom: 2rem; page-break-inside: avoid; }
    .section-label { color: ${TEAL}; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
    p { color: ${TEXT_DARK}; font-size: 0.9rem; margin-bottom: 1rem; }
    .stats { display: flex; gap: 1.5rem; margin: 1rem 0; flex-wrap: wrap; }
    .stat { text-align: center; }
    .stat-num { font-size: 1.5rem; font-weight: 700; color: ${TEAL}; }
    .stat-label { font-size: 0.7rem; color: ${TEXT_MUTED}; }
    .img-block img { width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 0.5rem; }
    .img-caption { font-size: 0.65rem; color: ${TEXT_MUTED}; margin-top: 0.25rem; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.85rem; }
    th, td { border: 1px solid #e5e7eb; padding: 0.6rem 0.8rem; text-align: left; }
    th { background: #f3f4f6; color: ${TEXT_DARK}; font-weight: 600; }
    td { color: ${TEXT_DARK}; }
    td strong { color: ${TEAL}; }
    ul { margin: 0.5rem 0 1rem 1.5rem; color: ${TEXT_DARK}; font-size: 0.9rem; }
    li { margin-bottom: 0.25rem; }
    .deliverables { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin: 1rem 0; }
    .deliverable { border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 0.75rem; }
    .deliverable strong { font-size: 0.8rem; display: block; margin-bottom: 0.25rem; }
    .deliverable span { font-size: 0.75rem; color: ${TEXT_MUTED}; }
    .role-item { margin-bottom: 0.75rem; }
    .role-title { font-size: 0.8rem; font-weight: 600; color: ${TEAL}; }
    .role-desc { font-size: 0.8rem; color: ${TEXT_MEDIUM}; }
    .timeline-item { display: flex; gap: 1rem; margin-bottom: 0.5rem; border-bottom: 1px solid #f3f4f6; padding-bottom: 0.5rem; }
    .timeline-date { font-size: 0.75rem; font-weight: 600; color: ${TEAL}; width: 60px; flex-shrink: 0; }
    .timeline-event { font-size: 0.8rem; color: ${TEXT_MEDIUM}; }
    .footer {
      position: fixed; bottom: 0; left: 0; right: 0;
      padding: 0.75rem 1.5rem;
      border-top: 1px solid #e5e7eb;
      display: flex; justify-content: space-between;
      font-size: 0.7rem; color: ${TEXT_MUTED}; background: #ffffff;
    }
    .footer a { color: ${TEAL}; text-decoration: none; }
    @media print { .doc { padding-bottom: 3rem; } }
  </style>
</head>
<body>
  <div class="doc">
    <header class="header">
      <div class="logo"><span>SAM</span> <span>BLOCH</span></div>
      <p class="meta">Design Thinking · Fall 2024</p>
      <h1>UC California Climate Stewards</h1>
      <p class="subtitle">Community Platform Design · Stakeholder Research · Prototyping</p>
    </header>

    <section>
      <p>As a certified Climate Steward, I sourced and led a four-month Design Thinking engagement to build a community platform for UC Environmental Stewards — a program with 9,000+ alumni across 58 California counties and zero post-graduation connective tissue. Our five-person team ran stakeholder interviews, analyzed survey data from 1,302 alumni, and delivered two functioning prototypes alongside a comprehensive implementation guide.</p>
    </section>

    <div class="stats">
      <div class="stat"><div class="stat-num">9,000+</div><div class="stat-label">Certified Alumni</div></div>
      <div class="stat"><div class="stat-num">240K+</div><div class="stat-label">Volunteer Hours</div></div>
      <div class="stat"><div class="stat-num">58</div><div class="stat-label">Counties Served</div></div>
      <div class="stat"><div class="stat-num">$6M+</div><div class="stat-label">Impact Value</div></div>
    </div>

    <section>
      <div class="section-label">CONTEXT</div>
      <p>UC Environmental Stewards runs two certification courses (California Naturalist and Climate Stewards) through UC Agriculture & Natural Resources. The program has been running for 13 years across 70+ partner organizations. In April 2024 they created a brand-new "Community of Practice Educator" role to address the alumni engagement gap. I emailed the director on August 28, 2024 and proposed a collaboration with my graduate program's Design Thinking cohort. By September 6 we had our first working session.</p>
      <table>
        <tr><th>Role</th><th>Person</th><th>Detail</th></tr>
        <tr><td><strong>Academic Director</strong></td><td>Gregory C. Ira</td><td>Program strategy</td></tr>
        <tr><td><strong>CoP Educator</strong></td><td>Ali Stefancich</td><td>New role, April 2024</td></tr>
        <tr><td><strong>Regional Specialists</strong></td><td>5 across California</td><td>Community education</td></tr>
        <tr><td><strong>Total Staff</strong></td><td>8 people</td><td>9,000+ alumni statewide</td></tr>
      </table>
    </section>

    <section>
      <div class="section-label">THE CHALLENGE</div>
      <p>Alumni were investing $1,500–$2,000 and 40+ hours into certification courses, then graduating into silence. No follow-up resources, no community, no clear next step.</p>
      <table>
        <tr><th>Barrier</th><th>Impact</th></tr>
        <tr><td><strong>Geographic dispersion</strong></td><td>9,000 alumni scattered across 58 counties</td></tr>
        <tr><td><strong>Diverse demographics</strong></td><td>College students to retirees with varying tech comfort</td></tr>
        <tr><td><strong>Broken volunteer tracking</strong></td><td>Portal so painful that hours went unreported</td></tr>
        <tr><td><strong>Minimal staffing</strong></td><td>8 staff members statewide, all with full workloads</td></tr>
        <tr><td><strong>No engagement framework</strong></td><td>CoP Educator role was brand new—no precedent</td></tr>
      </table>
    </section>

    <section>
      <div class="section-label">RESEARCH</div>
      <p>We ran 15-minute ethnographic listening sessions with alumni recruited through the program newsletter. Three conversations stood out, alongside survey data from 1,302 respondents:</p>
      <ul>
        <li><strong>Early graduate:</strong> Only person showing up to events in her region. Wanted the 2022 statewide conference revived.</li>
        <li><strong>Prospective student:</strong> Wanted certification for professional legitimacy. Acknowledged attendance drops off quickly.</li>
        <li><strong>Retired alumna:</strong> Pointed out a Facebook group had just 17 members. Volunteered to help brainstorm.</li>
      </ul>
      <p>Key survey findings: 80% satisfied with course content, 73% volunteered after certification, 59% said their capstone project still has impact, and 25% changed career direction as a result.</p>
    </section>

    <section>
      <div class="section-label">USER NEEDS</div>
      <p>We mapped interview and survey data into four categories:</p>
      <table>
        <tr><th>Category</th><th>Description</th></tr>
        <tr><td><strong>Functional</strong></td><td>Resource libraries, event calendars, job boards — basic infrastructure</td></tr>
        <tr><td><strong>Emotional</strong></td><td>Feeling like you belong to something after graduation</td></tr>
        <tr><td><strong>Psychological</strong></td><td>Staying current, continuing to learn, avoiding knowledge decay</td></tr>
        <tr><td><strong>Social</strong></td><td>Connecting with other alumni regardless of location</td></tr>
      </table>
      <p>Prioritized requirements: (1) Social engagement platforms, (2) Simplified volunteer tracking, (3) Access to educational materials, (4) Volunteer opportunity discovery, (5) Alumni story sharing, (6) Direct staff accessibility.</p>
    </section>

    <section>
      <div class="section-label">IDEATION</div>
      <p>We generated 15 concepts including SharePoint Hub, Geo-Leaders, Virtual Classrooms, Swag Programs, and Mentorship Connect. Ali narrowed us to four finalists. We merged overlapping concepts into a "Digital Resource Platform" idea and moved to two distinct prototypes.</p>
      <p><strong>Client picks:</strong> "What's Next?" Training (attacks post-graduation void), Digital Resource Platform (centralized hub), and Mentorship Connect (bridges generational gaps).</p>
    </section>

    ${img('/case-study/calnat-discord.webp', 'Discord server prototype', 'Live Discord prototype with regional channels and program features')}

    <section>
      <div class="section-label">PROTOTYPES</div>
      <p><strong>Discord (Recommended):</strong> A fully configured server with regional channels for Northern, Central, Southern, and Desert California. Program-specific channels for Alumni Spotlight, Mentorship Connect, and Geo-Leaders. Free at base level, real-time communication, and self-sustaining once community takes hold.</p>
      <p><strong>SharePoint:</strong> A comprehensive site with document management, alumni directories, event calendars, and engagement analytics. Enterprise-grade security built on existing Microsoft 365 infrastructure, but requires paid subscription and IT expertise.</p>
    </section>

    <section>
      <div class="section-label">OUTCOME</div>
      <p>On December 5, 2024, we delivered a Learning Guide recommending Discord as the primary community platform. The logic: it's free, low-maintenance, and becomes self-sustaining once a critical mass of members starts engaging. That matters when you have 8 staff members and 9,000 alumni.</p>
    </section>

    <section>
      <div class="section-label">DELIVERABLES</div>
      <div class="deliverables">
        <div class="deliverable"><strong>Learning Guide</strong><span>Implementation roadmap with assumptions, test plan, and resource needs</span></div>
        <div class="deliverable"><strong>Discord Server</strong><span>Live prototype with channels, roles, and demo content</span></div>
        <div class="deliverable"><strong>SharePoint Deck</strong><span>Enterprise alternative with full capabilities breakdown</span></div>
        <div class="deliverable"><strong>Design Criteria</strong><span>User needs analysis, SWOT, prioritized requirements</span></div>
        <div class="deliverable"><strong>Research Package</strong><span>Interview data, survey analysis, design brief, concept pitches</span></div>
      </div>
    </section>

    <section>
      <div class="section-label">WHAT I LEARNED</div>
      <ul>
        <li><strong>Being the insider changes everything.</strong> I took the same course these alumni took. That made every interview more honest and every design decision more grounded.</li>
        <li><strong>Design for the people who maintain it.</strong> Discord won partly because it can become self-sustaining. The best design acknowledges operational reality.</li>
        <li><strong>Geography is a design variable.</strong> 58 counties means no single engagement model works everywhere. Regional channels were the architecture.</li>
        <li><strong>The real deliverable was momentum.</strong> We showed Ali's team they could start small, iterate quickly, and build without waiting for a massive budget.</li>
      </ul>
    </section>

    <section>
      <div class="section-label">MY ROLE</div>
      <div class="role-item"><span class="role-title">Project originator</span><br><span class="role-desc">Sourced the client through my own Climate Stewards certification</span></div>
      <div class="role-item"><span class="role-title">Client relationship lead</span><br><span class="role-desc">Primary point of contact with Ali throughout the engagement</span></div>
      <div class="role-item"><span class="role-title">Subject matter expert</span><br><span class="role-desc">Brought firsthand experience as a certified Climate Steward</span></div>
      <div class="role-item"><span class="role-title">Ideation lead</span><br><span class="role-desc">Pushed Geo-Leaders, statewide conference revival, and hub group concepts</span></div>
      <div class="role-item"><span class="role-title">Research coordinator</span><br><span class="role-desc">Drafted alumni recruitment materials and coordinated listening sessions</span></div>
      <div class="role-item"><span class="role-title">Deliverable author</span><br><span class="role-desc">Co-authored the Design Brief, Design Criteria, Prototype Report, and Learning Guide</span></div>
    </section>

    <section>
      <div class="section-label">TIMELINE</div>
      <div class="timeline-item"><span class="timeline-date">Aug 28</span><span class="timeline-event">Emailed program director. Connected with Ali same day.</span></div>
      <div class="timeline-item"><span class="timeline-date">Sep 6</span><span class="timeline-event">First team working session with Ali (virtual).</span></div>
      <div class="timeline-item"><span class="timeline-date">Sep 22</span><span class="timeline-event">Design Brief v2.0 delivered.</span></div>
      <div class="timeline-item"><span class="timeline-date">Oct 18</span><span class="timeline-event">Newsletter out. First alumni listening sessions.</span></div>
      <div class="timeline-item"><span class="timeline-date">Oct 28</span><span class="timeline-event">Design Criteria document issued.</span></div>
      <div class="timeline-item"><span class="timeline-date">Nov 22</span><span class="timeline-event">Discord and SharePoint prototypes presented.</span></div>
      <div class="timeline-item"><span class="timeline-date">Dec 5</span><span class="timeline-event">Learning Guide delivered. Engagement complete.</span></div>
    </section>
  </div>

  <div class="footer">
    <span>www.sam-bloch.com</span>
    <a href="https://www.linkedin.com/in/blochsam/">linkedin.com/in/blochsam</a>
    <a href="mailto:sam@sam-bloch.com">sam@sam-bloch.com</a>
  </div>

  <script>
    (function(){
      var imgs = document.querySelectorAll('img');
      var loaded = 0;
      function checkDone() {
        loaded++;
        if (loaded >= imgs.length) setTimeout(function(){ window.print(); }, 300);
      }
      imgs.forEach(function(img) {
        if (img.complete) checkDone();
        else img.onload = img.onerror = checkDone;
      });
      if (imgs.length === 0) setTimeout(function(){ window.print(); }, 500);
    })();
  </script>
</body>
</html>`;
}

function generateSmartLockersCaseStudyPdf(baseUrl: string): string {
  const origin = baseUrl.replace(/\/$/, '');
  const img = (path: string, alt: string, caption: string) =>
    `<div class="img-block"><img src="${origin}${path}" alt="${alt}"><p class="img-caption">${caption}</p></div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Smart Lockers — Sam Bloch</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #ffffff;
      color: ${TEXT_DARK};
      line-height: 1.6;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .doc { max-width: 700px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
    .header {
      border-bottom: 2px solid ${TEAL};
      padding-bottom: 1rem;
      margin-bottom: 2rem;
    }
    .logo span:first-child { color: ${TEXT_DARK}; font-weight: 800; font-size: 1.75rem; letter-spacing: -1px; }
    .logo span:last-child { color: ${TEAL}; font-weight: 800; font-size: 1.75rem; letter-spacing: -1px; }
    .meta { color: ${TEAL}; font-size: 0.75rem; margin-top: 0.5rem; }
    h1 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0 0.5rem; color: ${TEXT_DARK}; }
    .subtitle { color: ${TEXT_MUTED}; font-size: 0.9rem; }
    section { margin-bottom: 2rem; page-break-inside: avoid; }
    .section-label { color: ${TEAL}; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
    p { color: ${TEXT_DARK}; font-size: 0.9rem; margin-bottom: 1rem; }
    ul { margin: 0.5rem 0 1rem 1.5rem; color: ${TEXT_DARK}; font-size: 0.9rem; }
    li { margin-bottom: 0.25rem; }
    .img-block img { width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 0.5rem; }
    .img-caption { font-size: 0.65rem; color: ${TEXT_MUTED}; margin-top: 0.25rem; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0; }
    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0.75rem 1.5rem;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
      color: ${TEXT_MUTED};
      background: #ffffff;
    }
    .footer a { color: ${TEAL}; text-decoration: none; }
    @media print { .doc { padding-bottom: 3rem; } }
  </style>
</head>
<body>
  <div class="doc">
    <header class="header">
      <div class="logo"><span>SAM</span> <span>BLOCH</span></div>
      <p class="meta">Systems Engineering · Quicken Loans · 2019</p>
      <h1>Smart Lockers</h1>
      <p class="subtitle">A self-service tech distribution system — web portal, Raspberry Pi prototype, and 3D-printed hardware — built by two interns and presented to the SVP.</p>
    </header>

    <div class="two-col">
      ${img('/case-study/smart-lockers/welcome-hero.avif', 'Welcome screen', 'Welcome screen')}
      ${img('/case-study/smart-lockers/request-form.avif', 'Request form', 'Request form')}
    </div>

    <section>
      <table>
        <tr><th>2 Interns</th><th>1 Working Prototype</th><th>4 Device Types</th><th>1 SVP Presentation</th></tr>
        <tr><td>Sam & Matthew</td><td>Raspberry Pi + 3D print</td><td>Laptops, mice, keyboards, monitors</td><td>Infrastructure & Operations</td></tr>
      </table>
    </section>

    <section>
      <div class="section-label">THE PROBLEM</div>
      <p>Quicken Loans distributed loaner tech — laptops, peripherals, monitors — manually through IT staff. Employees submitted tickets, waited for assignment, then tracked down the right person. With the company growing fast, the manual process that worked for 500 people wouldn't scale to 5,000.</p>
    </section>

    <section>
      <div class="section-label">THE SOLUTION</div>
      <p>We designed and built a self-service smart locker system. Employees browse available tech through a web portal, submit a request, and receive a PIN code tied to a specific locker on their floor. Walk up, enter the PIN, grab the device. No tickets, no waiting, no IT bottleneck.</p>
    </section>

    <section>
      <div class="section-label">THE WEB PORTAL</div>
      <p>Built with PHP, SQL, and Bootstrap. The portal guides users through a four-step flow: browse available devices, select what they need, submit a request, and receive a confirmation with their floor, locker number, and PIN code. The backend manages inventory, tracks assignments, and handles returns automatically.</p>
    </section>

    <div class="two-col">
      ${img('/case-study/smart-lockers/laptops-page.avif', 'Loaner laptops screen', 'Browse available devices')}
      ${img('/case-study/smart-lockers/confirmation.avif', 'Confirmation screen', 'PIN and locker assignment')}
    </div>

    <section>
      <div class="section-label">THE ARCHITECTURE</div>
      <p>Three layers working together: a PHP/SQL web application for user-facing requests, a Python REST API for locker control logic, and a Raspberry Pi kiosk with touchscreen and badge scanner for physical interaction. Each layer was developed in parallel by the two-person team.</p>
    </section>

    <section>
      <div class="section-label">THE HARDWARE</div>
      <p>The physical prototype included a Raspberry Pi with a touchscreen display and badge scanner, housed in a custom 3D-printed enclosure. We designed and printed the mounting brackets ourselves when off-the-shelf cases didn't fit the kiosk form factor. The prototype proved the concept was viable and could be manufactured at scale.</p>
    </section>

    ${img('/case-study/smart-lockers/hackweek.avif', 'Hack Week presentation', 'Hack Week — presenting to the tech department')}

    <section>
      <div class="section-label">THE IMPACT</div>
      <p>What started as two interns noticing a problem became a working prototype presented at Hack Week, then to the SVP of Infrastructure & Operations. The system demonstrated measurable improvements: faster device distribution, automated accountability tracking, and reduced IT overhead for routine equipment requests.</p>
    </section>

    <section>
      <div class="section-label">TEAM & ROLES</div>
      <p><strong>Sam Bloch</strong> — Built the entire web application (PHP, SQL, HTML/CSS/JS with Bootstrap). Designed the user flow. Helped transfer the Python script onto the Raspberry Pi. 3D-modeled and printed the custom kiosk enclosure. Co-presented at Hack Week and to the SVP.</p>
      <p><strong>Matthew Brown</strong> — Developed the Python application controlling locker logic and device inventory. Built the REST API connecting the web portal to the physical hardware. Taught Sam Python fundamentals throughout the project.</p>
    </section>

    <section>
      <div class="section-label">TIMELINE</div>
      <ul>
        <li><strong>Early Summer:</strong> Identified the problem. Pitched the concept. Got the green light.</li>
        <li><strong>Weeks 1–3:</strong> Built the web portal and API in parallel with daily syncs.</li>
        <li><strong>Weeks 4–5:</strong> Connected web app to API. Built the Raspberry Pi kiosk.</li>
        <li><strong>Week 6:</strong> 3D-printed enclosure. Integrated all components.</li>
        <li><strong>Hack Week:</strong> Presented to the tech department. Landed an SVP meeting.</li>
      </ul>
    </section>

    <section>
      <div class="section-label">KEY TAKEAWAYS</div>
      <ul>
        <li><strong>Hardware forces you to think differently</strong> — Bugs mean re-soldering, not redeploying. Physical systems punish sloppy logic.</li>
        <li><strong>Complementary skills multiply output</strong> — Sam handled web/3D, Matthew handled Python/API. Different strengths, shared ownership.</li>
        <li><strong>A demo is worth a thousand decks</strong> — Walking up to a locker and entering a PIN convinced leadership faster than any slide deck.</li>
        <li><strong>Intern projects can have real impact</strong> — When driven by initiative rather than assignment, even interns can land an SVP meeting.</li>
      </ul>
    </section>

    <section>
      <div class="section-label">KEY DECISIONS</div>
      <ul>
        <li><strong>PHP + SQL for the web portal</strong> — Matched our skillset and the company's existing stack.</li>
        <li><strong>RFID + PIN dual authentication</strong> — Two-factor security without IT overhead.</li>
        <li><strong>Raspberry Pi over a full PC</strong> — $35, low power, and GPIO access for badge readers.</li>
        <li><strong>3D-printed enclosure</strong> — Off-the-shelf didn't fit the kiosk form factor.</li>
        <li><strong>Hack Week as launch pad</strong> — Built-in audience of the entire tech department.</li>
      </ul>
    </section>
  </div>

  <div class="footer">
    <span>www.sam-bloch.com</span>
    <a href="https://www.linkedin.com/in/blochsam/">linkedin.com/in/blochsam</a>
    <a href="mailto:sam@sam-bloch.com">sam@sam-bloch.com</a>
  </div>

  <script>
    (function(){
      var imgs = document.querySelectorAll('img');
      var loaded = 0;
      function checkDone() {
        loaded++;
        if (loaded >= imgs.length) setTimeout(function(){ window.print(); }, 300);
      }
      imgs.forEach(function(img) {
        if (img.complete) checkDone();
        else img.onload = img.onerror = checkDone;
      });
      if (imgs.length === 0) setTimeout(function(){ window.print(); }, 500);
    })();
  </script>
</body>
</html>`;
}

function generateFudgeCaseStudyPdf(baseUrl: string): string {
  const origin = baseUrl.replace(/\/$/, '');
  const img = (path: string, alt: string, caption: string) =>
    `<div class="img-block"><img src="${origin}${path}" alt="${alt}"><p class="img-caption">${caption}</p></div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Fudge — Sam Bloch</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #ffffff;
      color: ${TEXT_DARK};
      line-height: 1.6;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .doc { max-width: 700px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
    .header { border-bottom: 2px solid ${TEAL}; padding-bottom: 1rem; margin-bottom: 2rem; }
    .logo span:first-child { color: ${TEXT_DARK}; font-weight: 800; font-size: 1.75rem; letter-spacing: -1px; }
    .logo span:last-child { color: ${TEAL}; font-weight: 800; font-size: 1.75rem; letter-spacing: -1px; }
    .meta { color: ${TEAL}; font-size: 0.75rem; margin-top: 0.5rem; }
    h1 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0 0.5rem; color: ${TEXT_DARK}; }
    .subtitle { color: ${TEXT_MUTED}; font-size: 0.9rem; }
    section { margin-bottom: 2rem; page-break-inside: avoid; }
    .section-label { color: ${TEAL}; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
    p { color: ${TEXT_DARK}; font-size: 0.9rem; margin-bottom: 1rem; }
    .stats { display: flex; gap: 1.5rem; margin: 1rem 0; flex-wrap: wrap; }
    .stat { text-align: center; }
    .stat-num { font-size: 1.5rem; font-weight: 700; color: ${TEAL}; }
    .stat-label { font-size: 0.7rem; color: ${TEXT_MUTED}; }
    .img-block { margin: 1rem 0; page-break-inside: avoid; }
    .img-block img { width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 0.5rem; }
    .img-caption { font-size: 0.65rem; color: ${TEXT_MUTED}; margin-top: 0.25rem; }
    .screenshots { display: flex; gap: 0.75rem; justify-content: center; margin: 1rem 0; flex-wrap: wrap; }
    .screenshots img { width: 130px; border-radius: 0.75rem; border: 1px solid #e5e7eb; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.85rem; }
    th, td { border: 1px solid #e5e7eb; padding: 0.6rem 0.8rem; text-align: left; }
    th { background: #f3f4f6; color: ${TEXT_DARK}; font-weight: 600; }
    td { color: ${TEXT_DARK}; }
    td strong { color: ${TEAL}; }
    ul { margin: 0.5rem 0 1rem 1.5rem; color: ${TEXT_DARK}; font-size: 0.9rem; }
    li { margin-bottom: 0.25rem; }
    .role-item { margin-bottom: 0.75rem; }
    .role-title { font-size: 0.8rem; font-weight: 600; color: ${TEAL}; }
    .role-desc { font-size: 0.8rem; color: ${TEXT_MEDIUM}; }
    .timeline-item { display: flex; gap: 1rem; margin-bottom: 0.5rem; border-bottom: 1px solid #f3f4f6; padding-bottom: 0.5rem; }
    .timeline-date { font-size: 0.75rem; font-weight: 600; color: ${TEAL}; width: 80px; flex-shrink: 0; }
    .timeline-event { font-size: 0.8rem; color: ${TEXT_MEDIUM}; }
    .footer {
      position: fixed; bottom: 0; left: 0; right: 0;
      padding: 0.75rem 1.5rem;
      border-top: 1px solid #e5e7eb;
      display: flex; justify-content: space-between;
      font-size: 0.7rem; color: ${TEXT_MUTED}; background: #ffffff;
    }
    .footer a { color: ${TEAL}; text-decoration: none; }
    @media print { .doc { padding-bottom: 3rem; } }
  </style>
</head>
<body>
  <div class="doc">
    <header class="header">
      <div class="logo"><span>SAM</span> <span>BLOCH</span></div>
      <p class="meta">Full-Stack PWA · Spring 2026</p>
      <h1>Fudge</h1>
      <p class="subtitle">A Progressive Web App for Group Trip Coordination</p>
    </header>

    <section>
      <p>Fudge is a full-featured progressive web app built to coordinate a 16-person group trip to Mackinac Island, Michigan for the 2026 MSCI Spring Conference. The app replaced scattered Google Sheets, group texts, and Venmo requests with a single hub for itinerary management, room assignments, travel logistics, and island recommendations — built solo with Claude as an AI engineering partner.</p>
    </section>

    <div class="stats">
      <div class="stat"><div class="stat-num">16</div><div class="stat-label">Trip Members</div></div>
      <div class="stat"><div class="stat-num">7</div><div class="stat-label">Core Pages</div></div>
      <div class="stat"><div class="stat-num">10+</div><div class="stat-label">Features</div></div>
      <div class="stat"><div class="stat-num">1</div><div class="stat-label">Developer</div></div>
    </div>

    <section>
      <div class="section-label">THE PROBLEM</div>
      <p>Coordinating 16 people across multiple days meant logistics scattered across group texts, Google Docs, and verbal reminders. Key information got buried, people missed events, and one person always ended up as the unpaid project manager fielding every question.</p>
      <table>
        <tr><th>Pain Point</th><th>Impact</th></tr>
        <tr><td><strong>Spreadsheet trap</strong></td><td>Logistics scattered across 5+ platforms nobody consistently checks</td></tr>
        <tr><td><strong>Payment chaos</strong></td><td>Venmo requests lost in the noise, no tracking</td></tr>
        <tr><td><strong>Decision paralysis</strong></td><td>16 opinions, no single source of truth</td></tr>
        <tr><td><strong>Organizer burden</strong></td><td>One person fielding every question constantly</td></tr>
        <tr><td><strong>Information decay</strong></td><td>Ferry schedules, drive times buried in old messages</td></tr>
      </table>
    </section>

    <section>
      <div class="section-label">FEATURE WALKTHROUGH</div>
      <div class="screenshots">
        <img src="${origin}/case-study/fudge/fudge-splash.webp" alt="Splash" />
        <img src="${origin}/case-study/fudge/fudge-login.webp" alt="Login" />
        <img src="${origin}/case-study/fudge/fudge-itinerary.webp" alt="Itinerary" />
        <img src="${origin}/case-study/fudge/fudge-explore.webp" alt="Explore" />
      </div>
      <ul>
        <li><strong>Passwordless Auth:</strong> Magic link login with identity claiming system — 16 profiles pre-seeded by admin</li>
        <li><strong>Dynamic Itinerary:</strong> Day-by-day schedule with role-based filtering, auto-advances to current day</li>
        <li><strong>Room Assignments:</strong> Visual cards with profile photos and tappable phone numbers</li>
        <li><strong>Travel Coordinator:</strong> Booking guidelines, driving logistics, ferry info, and travel advisory</li>
        <li><strong>Explore Mackinac:</strong> Curated island guide with veteran picks, cost estimates, and directions</li>
        <li><strong>Resource Hub:</strong> Group playlist, packing list, judging guides, and professional development</li>
      </ul>
    </section>

    <section>
      <div class="section-label">TECHNICAL ARCHITECTURE</div>
      <table>
        <tr><th>Technology</th><th>Role</th></tr>
        <tr><td><strong>Next.js 15</strong></td><td>App Router & Server Components</td></tr>
        <tr><td><strong>React 19</strong></td><td>Component-based UI framework</td></tr>
        <tr><td><strong>Supabase</strong></td><td>Auth, PostgreSQL database, Storage</td></tr>
        <tr><td><strong>Tailwind CSS</strong></td><td>Utility-first styling</td></tr>
        <tr><td><strong>Vercel</strong></td><td>Edge deployment & CI/CD</td></tr>
        <tr><td><strong>Sharp</strong></td><td>Server-side image compression</td></tr>
      </table>
      <p><strong>Key decisions:</strong> Identity claiming system (pre-populated user rows with UUID migration on signup), server-side image compression (256x256 JPEG Q75, 188KB total for 16 avatars), position: fixed header with ResizeObserver spacer, PWA-first architecture with service worker and install tutorial.</p>
    </section>

    <section>
      <div class="section-label">BUILDING WITH CLAUDE</div>
      <p>Claude served as a full engineering partner — implementing features across React, API routes, and SQL while I directed architecture, design decisions, and quality control. Every feature started with my product specification and ended with my manual testing.</p>
      <table>
        <tr><th>My Role</th><th>Claude's Role</th></tr>
        <tr><td>Defined features from real trip pain points</td><td>Implemented across React, API routes, SQL</td></tr>
        <tr><td>Chose Dorothy Draper visual direction</td><td>Generated responsive layouts from descriptions</td></tr>
        <tr><td>Selected tech stack and architecture</td><td>Built database schemas and Row Level Security</td></tr>
        <tr><td>Tested every flow, caught edge cases</td><td>Debugged cross-browser CSS and auth issues</td></tr>
        <tr><td>Deployed with custom domain + SSL</td><td>Iterated rapidly based on feedback</td></tr>
      </table>
    </section>

    <section>
      <div class="section-label">KEY TAKEAWAYS</div>
      <ul>
        <li><strong>AI pair programming is a skill, not a shortcut.</strong> Directing Claude required clear communication, technical literacy, and the judgment to know when something was right.</li>
        <li><strong>Ship for your users, not your resume.</strong> Every feature was weighed against a simple question: does this reduce confusion for 16 people?</li>
        <li><strong>PWAs are underrated.</strong> No app store, no downloads, no updates to push. Just a URL, a service worker, and a manifest.</li>
        <li><strong>Scope is the real enemy.</strong> The trip date was a hard deadline — if it wasn't essential, it didn't ship.</li>
      </ul>
    </section>

    <section>
      <div class="section-label">TIMELINE</div>
      <div class="timeline-item"><div class="timeline-date">Feb 2026</div><div class="timeline-event">Architecture & authentication system</div></div>
      <div class="timeline-item"><div class="timeline-date">Feb 2026</div><div class="timeline-event">Core pages — itinerary, rooms, travel</div></div>
      <div class="timeline-item"><div class="timeline-date">Mar 2026</div><div class="timeline-event">Admin dashboard, payment tracking</div></div>
      <div class="timeline-item"><div class="timeline-date">Mar 2026</div><div class="timeline-event">Explore, resources, PWA polish</div></div>
      <div class="timeline-item"><div class="timeline-date">Mar 2026</div><div class="timeline-event">Production deployment to fudge.sam-bloch.com</div></div>
      <div class="timeline-item"><div class="timeline-date">May 2026</div><div class="timeline-event">Trip day — the real test</div></div>
    </section>

    <section>
      <div class="section-label">MY ROLES</div>
      <div class="role-item"><div class="role-title">Product Manager</div><div class="role-desc">Defined every feature from real group trip pain points</div></div>
      <div class="role-item"><div class="role-title">Designer (UX + Visual)</div><div class="role-desc">Dorothy Draper-inspired mobile-first design system</div></div>
      <div class="role-item"><div class="role-title">Technical Architect</div><div class="role-desc">Selected stack, designed database schema and auth flow</div></div>
      <div class="role-item"><div class="role-title">AI Collaborator & Director</div><div class="role-desc">Directed Claude as a full engineering partner</div></div>
      <div class="role-item"><div class="role-title">QA & Deployment</div><div class="role-desc">Tested every flow, deployed with custom domain + SSL</div></div>
    </section>
  </div>

  <div class="footer">
    <span>www.sam-bloch.com</span>
    <a href="https://www.linkedin.com/in/blochsam/">linkedin.com/in/blochsam</a>
    <a href="mailto:sam@sam-bloch.com">sam@sam-bloch.com</a>
  </div>

  <script>
    (function() {
      var imgs = Array.from(document.querySelectorAll('img'));
      var loaded = 0;
      function checkDone() { loaded++; if (loaded >= imgs.length) setTimeout(function(){ window.print(); }, 600); }
      imgs.forEach(function(img) { if (img.complete) checkDone(); else img.onload = img.onerror = checkDone; });
      if (imgs.length === 0) setTimeout(function(){ window.print(); }, 500);
    })();
  </script>
</body>
</html>`;
}

function generateMatineeCaseStudyPdf(baseUrl: string): string {
  const origin = baseUrl.replace(/\/$/, '');
  const img = (path: string, alt: string, caption: string) =>
    `<div class="img-block"><img src="${origin}${path}" alt="${alt}"><p class="img-caption">${caption}</p></div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Matinee — Sam Bloch</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #ffffff; color: ${TEXT_DARK}; line-height: 1.6; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .doc { max-width: 700px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
    .header { border-bottom: 2px solid ${TEAL}; padding-bottom: 1rem; margin-bottom: 2rem; }
    .logo span:first-child { color: ${TEXT_DARK}; font-weight: 800; font-size: 1.75rem; letter-spacing: -1px; }
    .logo span:last-child { color: ${TEAL}; font-weight: 800; font-size: 1.75rem; letter-spacing: -1px; }
    .meta { color: ${TEAL}; font-size: 0.75rem; margin-top: 0.5rem; }
    h1 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0 0.5rem; color: ${TEXT_DARK}; }
    .subtitle { color: ${TEXT_MUTED}; font-size: 0.9rem; }
    section { margin-bottom: 2rem; page-break-inside: avoid; }
    .section-label { color: ${TEAL}; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; margin-bottom: 0.5rem; text-transform: uppercase; }
    h2 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; color: ${TEXT_DARK}; }
    p { color: ${TEXT_DARK}; font-size: 0.9rem; margin-bottom: 1rem; }
    .stats { display: flex; gap: 1.5rem; margin: 1rem 0; flex-wrap: wrap; }
    .stat { text-align: center; }
    .stat-num { font-size: 1.5rem; font-weight: 700; color: ${TEAL}; }
    .stat-label { font-size: 0.7rem; color: ${TEXT_MUTED}; }
    .img-block { margin: 1rem 0; }
    .img-block img { width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 0.5rem; }
    .img-caption { font-size: 0.65rem; color: ${TEXT_MUTED}; margin-top: 0.25rem; }
    .app-shots { display: flex; gap: 1rem; justify-content: center; margin: 1rem 0; }
    .app-shots > div { flex: 0 1 auto; text-align: center; }
    .app-shots img { max-height: 440px; width: auto; border: 1px solid #e5e7eb; border-radius: 0.5rem; }
    .chips { color: ${TEXT_MUTED}; font-size: 0.85rem; }
    .footer { position: fixed; bottom: 0; left: 0; right: 0; padding: 0.75rem 1.5rem; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 0.7rem; color: ${TEXT_MUTED}; background: #ffffff; }
    .footer a { color: ${TEAL}; text-decoration: none; }
    @media print { .doc { padding-bottom: 3rem; } }
  </style>
</head>
<body>
  <div class="doc">
    <header class="header">
      <div class="logo"><span>SAM</span> <span>BLOCH</span></div>
      <p class="meta">A cloud-connected e-ink display · matinee.ink · 2026</p>
      <h1>Matinee</h1>
      <p class="subtitle">A movie review that hangs on your wall — hardware, cloud, and product judgment.</p>
    </header>

    <section>
      <p>Matinee is a cloud-connected e-ink display that turns my Letterboxd reviews into a physical object. It pulls what I've watched and rated, renders the whole frame in the cloud, and paints it onto a 13.3&Prime; six-color e-ink panel that sips power and holds its image with the power off — a movie poster that changes its mind once a day.</p>
      ${img('/case-study/matinee/hero.webp', 'Matinee framed on a wall showing a Forrest Gump review', 'Matinee on the wall — a five-star Forrest Gump review, rendered to e-ink.')}
    </section>

    <div class="stats">
      <div class="stat"><div class="stat-num">200</div><div class="stat-label">Unit Kickstarter run</div></div>
      <div class="stat"><div class="stat-num">$114</div><div class="stat-label">BOM per unit</div></div>
      <div class="stat"><div class="stat-num">6</div><div class="stat-label">Colors of e-ink</div></div>
      <div class="stat"><div class="stat-num">1</div><div class="stat-label">Source, done right</div></div>
    </div>

    <section>
      <p class="section-label">The Idea</p>
      <p>I've logged hundreds of films on Letterboxd — ratings, one-liners, the occasional review I'm proud of — and all of it lives in an app I open, scroll, and forget. So I built the room a screen. Matinee turns my latest entry into an object that just sits on the wall, being true. It's the opposite of a notification.</p>
    </section>

    <section>
      <p class="section-label">The Object</p>
      <p>The hardware does almost nothing on purpose. An ESP32 wakes up, asks the cloud "is there a new picture?", paints it if so, and goes back to sleep. Every hard problem — fetching, layout, fitting a poster into six colors — happens on a server I can fix in seconds, not on 200 boards I'd have to physically recall.</p>
      ${img('/case-study/matinee/object-detail.webp', 'Close-up of the Matinee e-ink panel', 'The 13.3&Prime; Spectra 6 panel up close — six colors, no backlight, no glow.')}
    </section>

    <section>
      <p class="section-label">The Board</p>
      <p>I designed the PCB to be almost boring, and that was the goal: one ESP32-S3, a regulator, a USB-C port, two buttons, a ribbon to the panel. Two layers. Under a dollar to assemble. The less on the board, the less that can fail across a 200-unit run.</p>
      ${img('/case-study/matinee/pcb-bom.png', 'Matinee bill of materials', 'The whole BOM fits on one page — ~$114 per unit at 200 qty.')}
    </section>

    <section>
      <p class="section-label">The Pipeline</p>
      <p>Letterboxd RSS → a Vercel Python function renders the frame with PIL → a 1600×1200 PNG lands in Supabase Storage → the ESP32 polls via ETag (only downloading if it actually changed) → the panel repaints. That ETag trick is the difference between a wall ornament and a power bill.</p>
    </section>

    <section>
      <p class="section-label">The Companion</p>
      <p>The wall is the output; the app is the control room. Pairing, what's on the wall, and the whole review feed live in a Next.js PWA I run off my phone — including my house critic, Spike.</p>
      <div class="app-shots">
        <div><img src="${origin}/case-study/matinee/app-home.webp" alt="Matinee app home screen"><p class="img-caption">Now Displaying — the wall's status and Spike.</p></div>
        <div><img src="${origin}/case-study/matinee/app-feed.webp" alt="Matinee app review feed"><p class="img-caption">The feed the wall pulls from.</p></div>
      </div>
    </section>

    <section>
      <p class="section-label">The Hard Part</p>
      <h2>I designed it for everything. I shipped it for one thing.</h2>
      <p>The original spec was greedy — Letterboxd plus Untappd, concerts, books, sources as plug-ins. Then I ran the honest math on a 200-unit Kickstarter and made the call I'd make again: one source, flawless, beats five, flaky. So I cut to Letterboxd only — the one I actually use every day.</p>
      <p class="chips"><strong>Designed for, deliberately not shipped:</strong> Untappd · Concert Archives · Belli · Books.</p>
    </section>

    <section>
      <p class="section-label">Reflection</p>
      <p>Software forgives you; hardware doesn't — every choice gets soldered into 200 copies you can't take back. That pressure made me a better editor of my own ideas. The scope cut, the dumb-hardware bet, the boring two-layer board: all of it was designing for the version that ships and survives, not the version that demos.</p>
    </section>
  </div>
  <div class="footer">
    <span>Matinee · Sam Bloch</span>
    <a href="${origin}">sam-bloch.com</a>
  </div>
  <script>
    (function() {
      var imgs = Array.from(document.querySelectorAll('img'));
      var loaded = 0;
      function checkDone() { loaded++; if (loaded >= imgs.length) setTimeout(function(){ window.print(); }, 600); }
      imgs.forEach(function(img) { if (img.complete) checkDone(); else img.onload = img.onerror = checkDone; });
      if (imgs.length === 0) setTimeout(function(){ window.print(); }, 500);
    })();
  </script>
</body>
</html>`;
}

function generateOperationsCaseStudyPdf(baseUrl: string): string {
  const origin = baseUrl.replace(/\/$/, '');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Operations at Scale — Sam Bloch</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #ffffff; color: ${TEXT_DARK}; line-height: 1.6; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .doc { max-width: 700px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
    .header { border-bottom: 2px solid ${TEAL}; padding-bottom: 1rem; margin-bottom: 2rem; }
    .logo span:first-child { color: ${TEXT_DARK}; font-weight: 800; font-size: 1.75rem; letter-spacing: -1px; }
    .logo span:last-child { color: ${TEAL}; font-weight: 800; font-size: 1.75rem; letter-spacing: -1px; }
    .meta { color: ${TEAL}; font-size: 0.75rem; margin-top: 0.5rem; }
    h1 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0 0.5rem; color: ${TEXT_DARK}; }
    .subtitle { color: ${TEXT_MUTED}; font-size: 0.9rem; }
    section { margin-bottom: 2rem; page-break-inside: avoid; }
    .section-label { color: ${TEAL}; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; margin-bottom: 0.5rem; text-transform: uppercase; }
    h2 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; color: ${TEXT_DARK}; }
    p { color: ${TEXT_DARK}; font-size: 0.9rem; margin-bottom: 1rem; }
    .statement { font-size: 1.05rem; font-weight: 700; color: ${TEXT_DARK}; border-left: 3px solid ${TEAL}; padding-left: 1rem; margin: 1rem 0 1.5rem; }
    .stats { display: flex; gap: 1.5rem; margin: 1rem 0; flex-wrap: wrap; }
    .stat { text-align: center; }
    .stat-num { font-size: 1.5rem; font-weight: 700; color: ${TEAL}; }
    .stat-label { font-size: 0.7rem; color: ${TEXT_MUTED}; }
    .note { font-size: 0.75rem; color: ${TEXT_MUTED}; font-style: italic; }
    .footer { position: fixed; bottom: 0; left: 0; right: 0; padding: 0.75rem 1.5rem; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 0.7rem; color: ${TEXT_MUTED}; background: #ffffff; }
    .footer a { color: ${TEAL}; text-decoration: none; }
    @media print { .doc { padding-bottom: 3rem; } }
  </style>
</head>
<body>
  <div class="doc">
    <header class="header">
      <div class="logo"><span>SAM</span> <span>BLOCH</span></div>
      <p class="meta">Operations at Scale · Trust &amp; Safety · YouTube (Google)</p>
      <h1>Operations at Scale</h1>
      <p class="subtitle">An essay on the craft of running very large operations, told at the altitude discretion allows.</p>
    </header>

    <section>
      <p class="statement">The specifics of this work are confidential, and keeping them that way is part of the job.</p>
      <p>This is an essay about operations craft: quality frameworks, calibration, metric design, and changing systems that can't stop running. The specifics stay inside. The thinking is mine to share.</p>
    </section>

    <div class="stats">
      <div class="stat"><div class="stat-num">10</div><div class="stat-label">Global sites, one standard</div></div>
      <div class="stat"><div class="stat-num">800+</div><div class="stat-label">Moderators in scope</div></div>
      <div class="stat"><div class="stat-num">45%</div><div class="stat-label">Fewer processing errors (Legal Ops)</div></div>
      <div class="stat"><div class="stat-num">20%</div><div class="stat-label">Reporting efficiency gained</div></div>
    </div>

    <section>
      <p class="section-label">Why Operations</p>
      <p>I landed in operations sideways, then discovered it's where my favorite kind of problem lives: systems design with people inside it. An operation is hundreds of humans across ten sites, a policy that keeps evolving, and a queue that never sleeps — and it still has to produce one consistent, defensible answer, every time. When it's done well, nobody notices, which is exactly the point.</p>
    </section>

    <section>
      <p class="section-label">The Craft · 01 — Human Tools</p>
      <p>Most operational tooling is designed around the process and inflicted on the humans. I work the other way: watch where people actually stumble, then design the tool around the stumble. The clearest proof I can share: I rebuilt an error-management workflow for legal operations, and internal processing errors fell 45%. The insight wasn't a clever algorithm — it was refusing to blame people for a process that made errors easy.</p>
    </section>

    <section>
      <p class="section-label">The Craft · 02 — Calibration</p>
      <p>A standard is not what's written in the document. It's what hundreds of different people, in different countries, actually do with the document at 3 a.m. their time. Every policy is written with clarity as the intent — and still turns out to be interpretable in the hands of everyone applying it. That gap opens the moment the ink dries. Calibration is the discipline of pulling it closed, continuously, without ever being in the room. (The web version of this page includes an interactive exercise that lets you feel that drift in thirty seconds.)</p>
    </section>

    <section>
      <p class="section-label">The Craft · 03 — Metrics</p>
      <p>Metrics are steering wheels, not report cards. Designing a quality metric is designing behavior. I build the instruments too: custom SQL dashboards that surface where performance actually bottlenecks — one rebuild improved reporting efficiency by 20%, which in an operation means decisions land a day earlier, every day.</p>
    </section>

    <section>
      <p class="section-label">The Craft · 04 — Change</p>
      <p>The queue doesn't pause for your rollout. Every improvement ships into a system already running at full speed, so change becomes a craft of sequencing: pilot small, calibrate the pilots, scale what survives contact with reality. Across ten sites, a change isn't one change; it's ten local changes wearing one name. The newest chapter is moving safety upstream — integrating generative AI into moderation pipelines so problems get caught earlier instead of cleaned up after the fact.</p>
    </section>

    <section>
      <p class="section-label">Reflection</p>
      <p>Builders get to show the thing. Operators get to show the absence of disasters — which looks, from the outside, like nothing. I've made peace with that trade. Quiet is what a healthy operation sounds like, and building toward quiet — fewer surprises, fewer heroics, fewer 3 a.m. escalations — turns out to be some of the most demanding design work there is. Discretion isn't a limitation on this portfolio. It's a qualification in it.</p>
    </section>
  </div>
  <div class="footer">
    <span>Operations at Scale · Sam Bloch</span>
    <a href="${origin}">sam-bloch.com</a>
  </div>
  <script>
    setTimeout(function(){ window.print(); }, 500);
  </script>
</body>
</html>`;
}

function generateMichiganSpeechCaseStudyPdf(baseUrl: string): string {
  const origin = baseUrl.replace(/\/$/, '');
  const img = (path: string, alt: string, caption: string) =>
    `<div class="img-block"><img src="${origin}${path}" alt="${alt}"><p class="img-caption">${caption}</p></div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Michigan Speech — Sam Bloch</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #ffffff; color: ${TEXT_DARK}; line-height: 1.6; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .doc { max-width: 700px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
    .header { border-bottom: 2px solid ${TEAL}; padding-bottom: 1rem; margin-bottom: 2rem; }
    .logo span:first-child { color: ${TEXT_DARK}; font-weight: 800; font-size: 1.75rem; letter-spacing: -1px; }
    .logo span:last-child { color: ${TEAL}; font-weight: 800; font-size: 1.75rem; letter-spacing: -1px; }
    .meta { color: ${TEAL}; font-size: 0.75rem; margin-top: 0.5rem; }
    h1 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0 0.5rem; color: ${TEXT_DARK}; }
    .subtitle { color: ${TEXT_MUTED}; font-size: 0.9rem; }
    section { margin-bottom: 2rem; page-break-inside: avoid; }
    .section-label { color: ${TEAL}; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; margin-bottom: 0.5rem; text-transform: uppercase; }
    p { color: ${TEXT_DARK}; font-size: 0.9rem; margin-bottom: 1rem; }
    .stats { display: flex; gap: 1.5rem; margin: 1rem 0; flex-wrap: wrap; }
    .stat { text-align: center; }
    .stat-num { font-size: 1.5rem; font-weight: 700; color: ${TEAL}; }
    .stat-label { font-size: 0.7rem; color: ${TEXT_MUTED}; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.85rem; }
    th, td { border: 1px solid #e5e7eb; padding: 0.6rem 0.8rem; text-align: left; }
    th { background: #f3f4f6; color: ${TEXT_DARK}; font-weight: 600; }
    td { color: ${TEXT_DARK}; }
    td strong { color: ${TEAL}; }
    .img-block { margin: 1rem 0; }
    .img-block img { width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 0.5rem; }
    .img-block img.portrait { width: auto; max-height: 420px; display: block; margin: 0 auto; }
    .img-caption { font-size: 0.65rem; color: ${TEXT_MUTED}; margin-top: 0.25rem; }
    .footer { position: fixed; bottom: 0; left: 0; right: 0; padding: 0.75rem 1.5rem; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 0.7rem; color: ${TEXT_MUTED}; background: #ffffff; }
    .footer a { color: ${TEAL}; text-decoration: none; }
    @media print { .doc { padding-bottom: 3rem; } }
  </style>
</head>
<body>
  <div class="doc">
    <header class="header">
      <div class="logo"><span>SAM</span> <span>BLOCH</span></div>
      <p class="meta">Michigan Speech · MIFA · MSCI · 14 years and counting</p>
      <h1>Michigan Speech</h1>
      <p class="subtitle">Fourteen years in Michigan's speech and debate community — competitor, coach, founder, steward.</p>
    </header>

    <div class="stats">
      <div class="stat"><div class="stat-num">2x</div><div class="stat-label">MIFA state champion, Storytelling</div></div>
      <div class="stat"><div class="stat-num">10+</div><div class="stat-label">State finalists coached</div></div>
      <div class="stat"><div class="stat-num">600+</div><div class="stat-label">Competitors hosted in one day</div></div>
      <div class="stat"><div class="stat-num">14</div><div class="stat-label">Years in the community</div></div>
    </div>

    <section>
      <p class="section-label">Chapter I — The Competitor</p>
      <p>Storytelling was my event. Through the Michigan Interscholastic Forensic Association I became a two-time state champion, a four-time state finalist, and, for a while, a record-holder — plus three MSCI championships on Mackinac Island in four years. None of it happens without my coach, Doug "Bev" Bevier, the first person who made me believe a story could win a room.</p>
      ${img('/case-study/michigan-speech/sam-and-bev.webp', 'Sam Bloch and coach Doug Bevier with trophies on Mackinac Island', 'Mackinac Island, 2013 — me and Bev, with the hardware to show for it.')}
    </section>

    <section>
      <p class="section-label">Chapter II — The Coach</p>
      <p>Through college and my early career I coached forensics at Okemos and my alma mater, Walled Lake Western — four and a half years of practices, tournaments, and helping teenagers find voices they didn't know they had. My students went further than I did: ten-plus state finalists, two state champions, and a national champion.</p>
      ${img('/case-study/michigan-speech/wlw-team.webp', 'The Walled Lake Western Forensics team', 'Walled Lake Western Forensics — where I competed, then coached.')}
    </section>

    <section>
      <p class="section-label">Chapter III — The Founder</p>
      <p>After aging out, I missed the activity enough to do something unreasonable: I chartered Spartan Speech at Michigan State and founded the Spartanvitational, securing a university grant, a performance hall, and fifty classrooms for a Saturday.</p>
      <table>
        <tr><th>Date</th><th>Students</th><th>Schools</th><th>Note</th></tr>
        <tr><td>March 23, 2018</td><td><strong>~250</strong></td><td>20+</td><td>The first Spartanvitational</td></tr>
        <tr><td>February 23, 2019</td><td><strong>500+</strong></td><td>25+</td><td>~800 people — largest tournament in Michigan</td></tr>
        <tr><td>February 22, 2020</td><td><strong>600+</strong></td><td>35+</td><td>Largest competitive public speaking competition in the state</td></tr>
      </table>
      <p>When COVID took the building, we ran a national tournament online. When I graduated, I handed the tournament to the next generation of Spartans. It turns ten in 2027. It doesn't need me anymore — that's the whole point.</p>
      ${img('/case-study/michigan-speech/tournament-day.webp', 'A packed auditorium at the Spartanvitational', 'Tournament day — a full house of blazers, binders, and nerves.')}
      ${img('/case-study/michigan-speech/spartan-speech-team.webp', 'The Spartan Speech club', 'Spartan Speech — the Spartans who made it happen.')}
    </section>

    <section>
      <p class="section-label">Chapter IV — The Steward</p>
      <p>Every May I'm back on Mackinac Island with Michigan Speech Coaches Inc. — eleven conferences and counting — tabulating tournaments, volunteer-coaching my alma mater, and most recently giving a professional development talk at the Grand Hotel on what AI can quietly take off a coach's plate. The kid this community built grew up and came back with tools.</p>
      <div class="img-block"><img class="portrait" src="${origin}/case-study/michigan-speech/grand-hotel-talk.webp" alt="Sam Bloch and Brando Socarras presenting at the Grand Hotel"><p class="img-caption">The Grand Hotel, 2026 — teaching coaches to build with AI, alongside Brando Socarras.</p></div>
    </section>

    <section>
      <p class="section-label">The Last Round</p>
      <p>Holding a room. Coaching someone to a result you'll never get credit for. Founding an organization from a lunch conversation. Running an 800-person operation out of a tab room. I've been rehearsing my entire career since I was fourteen — this community was the stage.</p>
    </section>
  </div>
  <div class="footer">
    <span>Michigan Speech · Sam Bloch</span>
    <a href="${origin}">sam-bloch.com</a>
  </div>
  <script>
    (function() {
      var imgs = Array.from(document.querySelectorAll('img'));
      var loaded = 0;
      function checkDone() { loaded++; if (loaded >= imgs.length) setTimeout(function(){ window.print(); }, 600); }
      imgs.forEach(function(img) { if (img.complete) checkDone(); else img.onload = img.onerror = checkDone; });
      if (imgs.length === 0) setTimeout(function(){ window.print(); }, 500);
    })();
  </script>
</body>
</html>`;
}
