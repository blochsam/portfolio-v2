/**
 * Generates a standalone PDF document HTML for case studies.
 * Opens in a new window - designed to be visually resonant with the site
 * (dark theme, teal accents) as its own document, not a print of the page.
 */

const TEAL = '#24A2A7';
const TEXT_DARK = '#111827';
const TEXT_MEDIUM = '#374151';
const TEXT_MUTED = '#6b7280';

export function generateCaseStudyPdfHtml(projectId: string, baseUrl: string): string {
  if (projectId === 'portfolio-v1') {
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
  return generateUnderConstructionPdf(baseUrl);
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

    <div class="img-block">${img('/case-study/zoo-report-mockup.png', 'Augmented Reality Detroit Zoo App — Explore, animal info, and Donate screens', 'App screens: Explore, Giraffe, Donate')}</div>

    <section>
      <p>The Augmented Reality Detroit Zoo App is a mobile app concept for the Detroit Zoo. Visitors can explore the park on a map, learn about animals with rich profiles and fun facts, engage with a social feed of visitor posts, and donate to support conservation. The project moved from research and paper prototyping to a clickable digital wireframe, with user testing at each stage.</p>
    </section>

    <section>
      <div class="section-label">CONTEXT & OPPORTUNITY</div>
      <p>The goal was to design an experience that helps zoo visitors navigate exhibits, connect with animal stories, and take action through donations. Key flows include exploration (map and search), animal profiles (facts, habitat, social content), and a streamlined donation path—all with a consistent, accessible mobile UI and purple accent branding.</p>
    </section>

    <div class="img-block">${img('/case-study/detroit-zoo-logo.png', 'Detroit Zoo Logo', 'Detroit Zoo')}</div>

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
      <p class="meta">The D-Cade · 2020</p>
      <h1>The D-Cade</h1>
      <p class="subtitle">Hardware Engineer, Carpenter & UI Customizer · Raspberry Pi, RetroPie, 3D Printing, A/V Signal Conversion</p>
    </header>

    <section>
      <p>A custom-built Sega Dreamcast cabinet—a relic of a previous era—sat broken and dormant. I gutted the failed internals and replaced them with a Raspberry Pi architecture, creating a refurbished, Linux-powered retro gaming hub with 35+ titles. The D-Cade now serves as primary entertainment for patients at a private medical practice.</p>
    </section>

    <div class="img-block">${img('/case-study/d-cade-hero.png', 'The D-Cade cabinet', 'The D-Cade arcade cabinet')}</div>

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

    <div class="img-block">${img('/case-study/d-cade-splash.png', 'Custom D-Cade splash screen', 'Custom D-Cade splash screen')}</div>

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
      <p>The D-Cade transitioned from a personal project to public infrastructure. It served as the focal point for social gatherings at the D-House and proved robust enough to be donated—now the primary entertainment for patients in a doctor's office waiting room.</p>
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
      <p class="meta">Level Up · 2025</p>
      <h1>Level Up</h1>
      <p class="subtitle">Course Designer, Full-Stack Developer & Adjunct Instructor · Next.js 14, PostgreSQL (Prisma), Gemini API, Google Cloud Run, Tailwind CSS</p>
    </header>

    <section>
      <p>As a Program Manager at Google and an adjunct instructor at Quinnipiac University, I saw a gap in how students transition from "academic theory" to "workplace impact." I designed Leveling Up—a 3-credit hybrid course for the Quinnipiac in LA program—to bridge this gap. Standard LMS platforms like Canvas or Blackboard are built for broad administration, not specialized pedagogy. I built Level Up, a custom production-ready Next.js application that powers the course's core activities, manages the student lifecycle, and uses generative AI for real-time feedback and grading assistance.</p>
    </section>

    <div class="img-block">${img('/case-study/level-up-dashboard.png', 'Level Up dashboard', 'Level Up dashboard')}</div>

    <section>
      <div class="section-label">THE COURSE: PEDAGOGICAL DESIGN</div>
      <p>The 14-week curriculum is built around four thematic arcs: Digital Brand (1–4), The Network (5–8), Workplace Impact (9–11), and The Start (12–14).</p>
      <table>
        <tr><th>Arc</th><th>Weeks</th><th>Key Deliverable</th></tr>
        <tr><td><strong>Digital Brand</strong></td><td>1–4</td><td>Narrative-driven LinkedIn bio & Identity Capital audit.</td></tr>
        <tr><td><strong>The Network</strong></td><td>5–8</td><td>30-minute Coffee Chat & "Unthought Known" reflection.</td></tr>
        <tr><td><strong>Workplace Impact</strong></td><td>9–11</td><td>Efficiency Project at Google Playa Vista.</td></tr>
        <tr><td><strong>The Start</strong></td><td>12–14</td><td>Personal Action Plan & AI-driven STAR method practice.</td></tr>
      </table>
    </section>

    <section>
      <div class="section-label">THE PLATFORM: SYSTEMS & ARCHITECTURE</div>
      <p><strong>AI-Driven Interview Practice:</strong> Students paste job postings; Gemini 2.5 Flash generates behavioral questions. Web Speech API for voice-to-text. AI evaluates STAR method structure.</p>
      <p><strong>AI-Assisted Grading:</strong> PDF submissions trigger automated analysis against assignment rubrics. Instructor receives content summary and suggested feedback.</p>
      <p><strong>LevelUpBot:</strong> Course-aware chatbot with strict system prompt for academic integrity—refuses to summarize readings or interpret content.</p>
    </section>

    <div class="img-block">${img('/case-study/level-up-interview.png', 'AI Interview Practice', 'AI Interview Practice')}</div>

    <section>
      <div class="section-label">ENGINEERING CHALLENGES</div>
      <p><strong>Timezone Integrity:</strong> Standardized database on UTC; React bridge converts datetime-local to ISO and re-localizes for student view.</p>
      <p><strong>Syllabus-to-Context Pipeline:</strong> Context Notebook architecture—bot's system prompt dynamically injected with Module, Assignment, and Material data from PostgreSQL.</p>
    </section>

    <section>
      <div class="section-label">DEVELOPMENT JOURNEY</div>
      <ul>
        <li><strong>Modeling:</strong> Prisma schema for Users (allowlist), Assignments, Submissions.</li>
        <li><strong>Deployment:</strong> Google Cloud Build + Cloud Run.</li>
        <li><strong>UI/UX:</strong> Tailwind CSS, "professional-noir" dashboard-first design.</li>
        <li><strong>Security:</strong> NextAuth.js with @quinnipiac.edu allowlist.</li>
      </ul>
    </section>

    <section>
      <div class="section-label">OUTCOMES</div>
      <p>Students present capstone projects at Google Playa Vista. Custom build reduced administrative overhead by 30%. The thesis: a well-scoped custom solution is superior to a generic one when pedagogy is specialized.</p>
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
      <h1>Personal Portfolio Redesign</h1>
      <p class="subtitle">UX Architect & Full-Stack Strategist · React, Spline, Gemini API</p>
    </header>

    <section>
      <p>I redesigned my portfolio from a static, text-heavy site into a dual-view experience that demonstrates systems thinking, technical capability, and inclusive design. The result—the Samulation—serves an accessible 2D editorial experience by default and an immersive 3D workstation for capable devices, with consistent navigation and content across both.</p>
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
      <div class="img-grid">${img('/case-study/before-home.png', 'Before: Home', 'Previous portfolio home')}${img('/case-study/before-about.png', 'Before: About', 'Previous portfolio about')}</div>
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
      <div class="img-block full">${img('/case-study/wireframe.png', 'Wireframe', 'Structure before build')}</div>
    </section>

    <section>
      <div class="section-label">SOLUTION OVERVIEW</div>
      <p><strong>The Samulation</strong> is a dual-layered portfolio: 2D editorial (accessible, default for mobile) and 3D workstation (Spline-powered, clickable objects). A toggle lets visitors switch at any time.</p>
      <div class="img-block full">${img('/case-study/3d-scene.png', '3D workstation', 'The Samulation')}</div>
      <div class="section-label" style="margin-top: 1rem;">PROCESS: SPLINE · MESHY.AI · REACT</div>
      <div class="img-grid img-grid-3">${img('/case-study/spline-workflow.png', 'Spline', 'Building Sam\'s Desk')}${img('/case-study/meshy-workflow.png', 'Meshy.ai', '3D asset generation')}${img('/case-study/code-screenshot.png', 'Code', 'index.html')}</div>
      <div class="section-label" style="margin-top: 1.5rem;">THE RESULT: LIVE SITE</div>
      <div class="img-grid">${img('/case-study/hero-desktop.png', 'Hero', 'New site')}${img('/case-study/resume-page.png', 'Resume', 'New site')}</div>
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
      <p class="meta">Design Thinking Engagement · Fall 2024</p>
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

    ${img('/case-study/calnat-age-distribution.webp', 'Alumni age distribution chart', 'Age distribution across the alumni base')}

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
