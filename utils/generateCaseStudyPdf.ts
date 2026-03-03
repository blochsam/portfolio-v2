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
