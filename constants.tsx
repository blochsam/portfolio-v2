
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

export const CONTENT_MAP: Record<SplineObjectId, PortfolioContent> = {
  'c68e2fe7-80a1-4fd0-a1f2-5e058ad6ef74': {
    id: 'macbook',
    title: 'Trust & Safety Operations',
    subtitle: 'YouTube/Google',
    description: `Why I’m Obsessed with Trust

Let’s be real: Trust and Safety is often seen as the "brakes" of the tech world. But I see it differently. I view my work at Google as the performance engineering that allows the vehicle to go faster. You can’t drive at 200mph if you don’t trust your steering.

I live at the intersection of high-stakes policy and the "immune system" of global platforms. It’s about more than just setting rules; it’s about architecting a digital environment where billions of people can interact safely without the tech getting in the way.

How I Approach the Chaos

• Systems at Scale: I’m fascinated by the "immune system" logic—how do we protect a global community while staying agile? I design the program frameworks that keep quality high when the volume is even higher.

• The Human Element: Thanks to my background in HCI, I’m always asking: How does this feel for the user? Safety shouldn't feel like a barrier; it should feel like a foundation.

• Proactive, Not Reactive: I don't just wait for things to break. I use my "system-builder" brain to move safety upstream, making sure integrity is baked into the product's DNA from day one.

The Big Picture

"In a world where AI is moving at lightspeed, 'Trust' is a moving target. I thrive in that turbulence—building the structures that keep us grounded while we innovate into the unknown."`,
    tags: ['Policy Enforcement', 'Ops Strategy', 'Scale Management']
  },
  'a62f5de6-1324-4edf-813a-58e7e0a602f2': {
    id: 'monitors',
    title: 'AI & Systems Innovation',
    subtitle: 'Process Optimization',
    description: `Why I’m Energized by AI Solutions

We are living through a "once-in-a-generation" technological explosion, and I find the turbulence of it incredibly exciting. To me, AI isn’t just a buzzword; it’s a force multiplier. I’m driven by the challenge of taking these raw, cutting-edge capabilities and turning them into tangible, scalable frameworks that solve "unsolvable" problems and give people their time back.

How I Approach Incorporating AI

• Operationalizing the Hype: I specialize in building the "bridges" between AI potential and real-world program architecture. This means moving beyond the "cool" and into the "critical"—designing tools that actually move the needle on efficiency at Google scale.

• Human-Centric Automation: I use my HCI background to ensure AI doesn't become a black box. I build systems where AI handles the heavy lifting of manual bottlenecks, empowering human teams to focus on high-level strategy and creativity.

• Getting Creative with Tools: I’m not just using AI to automate problems away; I’m using it to build faster and smarter. Whether it’s rapid-prototyping new internal tools or brainstorming complex ideas, I leverage AI to shorten the distance between "What if?" and a finished solution that supports my team.

My Philosophy

"AI is the engine, but human-centric architecture is the steering. I thrive in the space between the two—building the systems that allow us to harness the speed of the AI explosion without losing our direction or our soul."`,
    tags: ['GenAI', 'Process Automation', 'Innovation Frameworks']
  },
  '604c4f41-f2eb-416f-a43a-ad5ae143d2e2': {
    id: 'books',
    title: 'Leadership & Mentorship',
    subtitle: 'THE BALCONY VIEW',
    description: `Why I Love Empowering Others

I believe that the most complex system on the planet isn't a codebase—it's a team. For students entering today's workforce, the barriers to entry are higher than ever. They are competing with senior talent in a "cool" hiring period and navigating a world where a degree is no longer a guaranteed ticket to a high-paying job. I feel a deep responsibility to help students navigate these complex times by building the tangible strategies and professional artifacts they need to break through the noise. For me, leadership isn't about having all the answers; it’s about architecting an environment where the next generation of builders feels equipped to find them.

How I Approach "Leadership"

• Adaptive Leadership: My first priority is to clear the path. I focus on identifying the institutional and technical friction that holds people back, then building the support structures that allow them to do their best work with autonomy and confidence.

• Getting on the Balcony: To lead effectively, you have to know when to step off the "dance floor" of daily tasks. I teach and practice the ability to zoom out, identify the high-level patterns of a project, and ensure the team’s energy is aligned with the bigger picture.

• Mentorship as a Curriculum: Through my "Level Up" course at Quinnipiac and my work with my three alma maters, I don’t just offer advice—I provide a toolkit. I focus on career readiness, navigating complex organizational cultures, and developing the systems-thinking mindset needed to thrive in tech.

My Philosophy

"A leader is a gardener, not a mechanic. You don’t fix people; you build the environment, provide the nutrients, and ensure the system is designed for them to grow. When the environment is right, the innovation happens naturally."`,
    tags: ['Leadership', 'Org Design', 'Mentorship']
  },
  'c6919b4f-4a09-456a-8f9f-d1004b8094ea': {
    id: 'fountain',
    title: 'Consulting',
    subtitle: 'Strategic Advisory',
    description: `Decoding the Resource Trap

I am fascinated by the "Resource Trap"—that systemic stasis where an organization has a bold mission but lacks the budget or bandwidth to reach it. I find deep satisfaction in stepping into these complex environments, identifying the hidden patterns, and architecting the specific "pivots" that unlock growth without requiring a massive overhaul of resources.

How I Approach Solving Complex Problems

• Process Consulting & Partnership: I don't just hand over a report; I work as a collaborative partner. I specialize in turning tactical requests (like "we need a new website") into strategic transformations (like "we need a new business model"). I ensure the final strategy is one the client truly "owns" and can execute long after the engagement ends.

• Systems-Level Facilitation: I specialize in leading groups through "derailed" processes to reach creative consensus. Whether it’s resolving systemic conflicts in creative production or helping non-profits navigate financial barriers, I build the frameworks that help communities find their voice and move toward a shared goal.

• Adaptive Intentionality: Every organization is a living, breathing system. I use human-centric design and the Cynefin framework to sense the unique needs of a system—legal, ethical, or operational—and pivot strategy in real-time to meet them.

My Philosophy

"Effective consulting isn't about adhering to a pre-defined routine; it’s about 'Adaptive Intentionality'—the ability to sense the unique needs of a system and pivot your strategy in real-time to meet them."`,
    tags: ['Consulting', 'Strategic Planning', 'Risk Mitigation']
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
    image: '/sesame.jpg',
    description: 'Meet Sesame, the real power behind the workstation. Often found photobombing high-stakes video calls, Sesame ensures that morale remains high and treats are dispensed regularly.',
    tags: ['CMO', 'Cat', 'Professional Nap Expert']
  }
};

export const LOGO = (
  <svg viewBox="0 0 400 100" className="h-12 md:h-16">
    <text x="0" y="70" style={{ fill: '#FFFFFF', fontWeight: 800, fontSize: '64px', letterSpacing: '-2px' }}>SAM</text>
    <text x="150" y="70" style={{ fill: COLORS.teal, fontWeight: 800, fontSize: '64px', letterSpacing: '-2px' }}>BLOCH</text>
  </svg>
);
