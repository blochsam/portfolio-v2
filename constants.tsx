
import React from 'react';
import { PortfolioContent, SplineObjectId } from './types';

export const COLORS = {
  teal: '#24A2A7',
  charcoal: '#121212',
  grey: '#1F1F1F',
  darkGrey: '#1a1a1a',
  accent: '#00D1FF'
};

// Alias for common usage
export const BRAND_COLORS = COLORS;

// NOTE: The `quote` entries below are PLACEHOLDER quotes written to show the
// format — replace each with a real, permission-granted quote from a colleague,
// student, or client before treating this content as final.
export const CONTENT_MAP: Record<SplineObjectId, PortfolioContent> = {
  'c68e2fe7-80a1-4fd0-a1f2-5e058ad6ef74': {
    id: 'macbook',
    title: 'Trust & Safety Operations',
    subtitle: 'YouTube · Program Manager',
    description: 'Trust & Safety is usually cast as the brakes of the tech world. I treat it as performance engineering — you can’t drive at 200mph if you don’t trust your steering. At YouTube, I build the program frameworks that let a global platform move fast safely.',
    hook: 'Trust & Safety is usually cast as the brakes of the tech world. I treat it as performance engineering — you can’t drive at 200mph if you don’t trust your steering. At YouTube, I build the program frameworks that let a global platform move fast safely.',
    receipts: [
      'Quality framework for child-safety moderation across 10 global sites and 800+ moderators',
      'Predictive SQL dashboards that improved vendor reporting efficiency by 20%',
      'Moving GenAI safety checks upstream in the moderation pipeline',
    ],
    approach: [
      { title: 'Systems at Scale', desc: 'Standards, escalation paths, and feedback loops designed to keep quality high when the volume gets higher — and to survive growth.' },
      { title: 'The Human Element', desc: 'My HCI background keeps one question on the table: how does this feel for the user? Safety should be a foundation, not a barrier.' },
      { title: 'Proactive, Not Reactive', desc: 'I’d rather move safety upstream than clean up downstream. Integrity gets designed in from day one.' },
    ],
    quote: {
      text: 'Sam builds the process before the problem shows up. By the time everyone else sees the fire, he’s already standing there with the extinguisher.',
      attribution: 'Colleague · YouTube Trust & Safety',
    },
    related: [
      { label: 'YouTube & Google on my resume', href: '/resume' },
    ],
    tags: ['Policy Enforcement', 'Program Management', 'SQL & Data Analysis']
  },
  'a62f5de6-1324-4edf-813a-58e7e0a602f2': {
    id: 'monitors',
    title: 'AI & Systems Innovation',
    subtitle: 'Google · AI Builder',
    description: 'We’re living through a once-in-a-generation technological explosion, and I find the turbulence genuinely exciting. AI is a force multiplier — my job is turning raw capability into scalable tools that solve “unsolvable” problems and give people their time back.',
    hook: 'We’re living through a once-in-a-generation technological explosion, and I find the turbulence genuinely exciting. AI is a force multiplier — my job is turning raw capability into scalable tools that solve “unsolvable” problems and give people their time back.',
    receipts: [
      'Error-management tool for Legal Ops that cut internal processing errors by 45%',
      'Level Up: a production LMS using Gemini for interview simulation and grading assistance',
      'This site and Fudge — shipped solo with AI as an engineering partner',
    ],
    approach: [
      { title: 'Operationalize the Hype', desc: 'Move past “cool” into “critical” — tools that measurably move the needle on efficiency at Google scale.' },
      { title: 'Human-Centric Automation', desc: 'AI handles the manual bottlenecks; humans keep the strategy and the creativity. No black boxes.' },
      { title: 'Build Faster, Smarter', desc: 'I use AI to shorten the distance between “what if?” and a working solution — rapid prototypes, internal tools, finished products.' },
    ],
    quote: {
      text: 'He’s the person who turns “wouldn’t it be cool if…” into a working tool by Friday.',
      attribution: 'Teammate · Google',
    },
    related: [
      { label: 'Level Up — AI-powered LMS', href: '/projects/level-up' },
      { label: 'Fudge — built with Claude', href: '/projects/fudge' },
      { label: 'This portfolio — The Samulation', href: '/projects/portfolio' },
    ],
    tags: ['GenAI', 'Process Automation', 'Rapid Prototyping']
  },
  '604c4f41-f2eb-416f-a43a-ad5ae143d2e2': {
    id: 'books',
    title: 'Leadership & Mentorship',
    subtitle: 'Quinnipiac · Adjunct Instructor',
    description: 'The most complex system on the planet isn’t a codebase — it’s a team. Whether I’m teaching, mentoring, or leading, my job is architecting an environment where the next generation of builders feels equipped to find answers, not handed them.',
    hook: 'The most complex system on the planet isn’t a codebase — it’s a team. Whether I’m teaching, mentoring, or leading, my job is architecting an environment where the next generation of builders feels equipped to find answers, not handed them.',
    receipts: [
      'Designed and teach Level Up: a 14-week, 3-credit career-readiness course for Quinnipiac in LA — custom LMS included',
      'Founded the largest competitive speech tournament infrastructure in Michigan',
      'Active mentor across my three alma maters',
    ],
    approach: [
      { title: 'Clear the Path', desc: 'Find the institutional and technical friction holding people back, then build the support structures that restore autonomy and confidence.' },
      { title: 'Get on the Balcony', desc: 'Step off the dance floor of daily tasks, read the patterns from above, and keep the team’s energy aligned with the bigger picture.' },
      { title: 'Mentorship as Curriculum', desc: 'Advice doesn’t scale; toolkits do. Career readiness, organizational navigation, and systems thinking students can reuse without me in the room.' },
    ],
    quote: {
      text: 'This was the first class that felt like training for my actual career instead of another assignment.',
      attribution: 'Student · Level Up, Quinnipiac in LA',
    },
    related: [
      { label: 'Level Up — the course & platform', href: '/projects/level-up' },
      { label: 'UC California Climate Stewards', href: '/projects/uc-calnat' },
    ],
    tags: ['Curriculum Design', 'Mentorship', 'Adaptive Leadership']
  },
  'c6919b4f-4a09-456a-8f9f-d1004b8094ea': {
    id: 'fountain',
    title: 'Consulting',
    subtitle: 'Independent · Strategic Advisory',
    description: 'I’m fascinated by the Resource Trap: that systemic stasis where an organization has a bold mission but lacks the budget or bandwidth to reach it. I step into those environments, find the hidden patterns, and architect the specific pivots that unlock growth without a massive overhaul.',
    hook: 'I’m fascinated by the Resource Trap: that systemic stasis where an organization has a bold mission but lacks the budget or bandwidth to reach it. I step into those environments, find the hidden patterns, and architect the specific pivots that unlock growth without a massive overhaul.',
    receipts: [
      'Scoped 128 rooms across 3 buildings and 6 semesters of data to inform University of the Pacific’s eight-figure medical school decision',
      'Designed a Community of Practice platform for 9,000+ UC environmental stewardship alumni',
    ],
    approach: [
      { title: 'Partnership Over Reports', desc: 'Tactical requests (“we need a new website”) become strategic transformations (“we need a new business model”) — and the client owns the strategy long after I leave.' },
      { title: 'Systems-Level Facilitation', desc: 'I lead groups through derailed processes to creative consensus, from creative-production conflicts to non-profit financial barriers.' },
      { title: 'Adaptive Intentionality', desc: 'Every organization is a living system. I read its needs — legal, ethical, operational — and pivot strategy in real time. Cynefin is a favorite lens.' },
    ],
    quote: {
      text: 'Sam didn’t hand us a deliverable and disappear. He left us owning a strategy we could actually run.',
      attribution: 'Engagement sponsor · University of the Pacific',
    },
    related: [
      { label: 'Pacific Medical School Space Evaluation', href: '/projects/space-utilization' },
      { label: 'UC California Climate Stewards', href: '/projects/uc-calnat' },
    ],
    tags: ['Strategic Planning', 'Facilitation', 'Program Evaluation']
  },
  '1ee647e1-3ee5-42f9-80bd-4829e0df1c52': {
    id: 'guitar',
    title: 'About Sam Bloch',
    subtitle: 'Innovation & Identity',
    description: `The Narrative

I’m a Michigan-born, California-based systems-thinker who lives for a good "unsolvable" problem. I spend my days at Google navigating the AI explosion and my evenings mentoring the next generation of leaders as a college educator. When I'm not architecting human-centric systems, I'm playing guitar, surfing, 3D printing, or meticulously cataloging my life through music and film.

Beyond the workstation, I am a perpetual "tinkerer" (people joke my hobby is having too many hobbies!). Whether I'm restoring vintage audio equipment, exploring the coast, or refining operational pipelines, I'm driven by a singular curiosity: How do we make things work better for people?

I truly love connecting with people and hearing their stories––especially when I get to share them with others. Both inside and outside the workplace, I turn a critical eye to all things in hopes of learning more about the world and the patterns that make it up.`,
    tags: ['Michigan State', 'HCI', 'GenAI', 'Surfing', 'Music']
  },
  '1dfa5782-8ffc-47dc-9562-db86cba5ee72': {
    id: 'sesame',
    title: 'Sesame',
    subtitle: 'Chief Morale Officer (CMO)',
    image: '/sesame.webp',
    description: 'Meet Sesame, the real power behind the workstation. Often found photobombing high-stakes video calls, Sesame ensures that morale remains high and treats are dispensed regularly.',
    tags: ['CMO', 'Cat', 'Professional Nap Expert']
  }
};

export const LOGO = (
  <svg viewBox="0 0 400 100" className="h-12 md:h-16" role="img" aria-label="Sam Bloch">
    <text x="0" y="70" style={{ fill: '#FFFFFF', fontWeight: 800, fontSize: '64px', letterSpacing: '-2px' }}>SAM</text>
    <text x="150" y="70" style={{ fill: COLORS.teal, fontWeight: 800, fontSize: '64px', letterSpacing: '-2px' }}>BLOCH</text>
  </svg>
);
