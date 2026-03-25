import React, { useRef, useEffect } from 'react';

/* ═══════════════════════════════════════════════════════════════════
   D-Cade Hero Animation — Pixel Art Storytelling Sequence

   Plays once on page load (~12s), then stays static forever.
   Story: Sam loads parts into mom's minivan → drives to the
   D-House → builds the D-Cade in a dust cloud → boots it up.
   ═══════════════════════════════════════════════════════════════════ */

// ─── Canvas ───
const W = 480;
const H = 270;
const GROUND_Y = 215;
const MAX_PARTICLES = 80;

// ─── Phase Timing (seconds) ───
const T = {
  // Phase 1: Loading parts into van (3 trips)
  trip1Start: 0.2,     // Sam walks in with part 1 (TV)
  trip1Load: 1.4,      // reaches van, loads
  trip2Start: 1.8,     // walks back left, returns with part 2 (Pi)
  trip2Load: 3.0,      // loads part 2
  trip3Start: 3.3,     // walks back, returns with part 3 (speakers)
  trip3Load: 4.4,      // loads part 3
  enterVan: 4.7,       // walks to driver side, gets in
  // Phase 2: Driving
  driveStart: 5.2,
  driveEnd: 7.8,
  vanStop: 8.2,
  // Phase 3: Arrival + unload
  samExit: 8.5,
  samAtHouse: 9.2,
  // Phase 4: Building (dust cloud + construction)
  buildStart: 9.4,
  buildEnd: 11.0,
  // Phase 5: Boot up
  bootStart: 11.2,
  bootEnd: 12.5,
};

// ─── Colors ───
const C = {
  teal: '#24A2A7',
  amber: '#FFB800',
  red: '#FF4444',
  skin: '#F4C794',
  skinDark: '#D4956B',
  hair: '#1a1a1a',
  hairLight: '#2d2d2d',
  eyes: '#3d3d3d',
  shirt: '#24A2A7',
  pants: '#3d5c8a',
  shoes: '#2d2d2d',
  vanBody: '#7A7A8A',
  vanDark: '#555560',
  vanWindow: '#1a2a3a',
  vanWheel: '#1a1a1a',
  vanHub: '#444444',
  headlight: '#FFEE88',
  brakeOn: '#FF4444',
  brakeOff: '#661111',
  roof: '#5C3A1A',
  roofLight: '#7B4F2A',
  wall: '#C49A6C',
  wallDark: '#A47E54',
  door: '#4A2A10',
  windowDark: '#1a2a3a',
  windowGlow: '#FFEE88',
  foundation: '#555555',
  cab: ['#0a0a0a', '#141414', '#1c1c1c', '#252525', '#333333', '#444444'],
  metal: ['#333333', '#555555', '#777777', '#999999'],
  screenGlass: '#0a1a1a',
  dust: ['#8B7355', '#A0926B', '#6B5B45', '#7A6B55'],
  smoke: ['#888888', '#999999', '#AAAAAA', '#777777', '#BBBBBB'],
  groundLine: 'rgba(36, 162, 167, 0.12)',
  groundDot: 'rgba(255, 255, 255, 0.03)',
};

// ─── Positions ───
const PARTS_X = -15;       // off-screen left where Sam picks up parts
const VAN_PARK_X = 100;    // where van starts parked
const HOUSE_X = 370;       // house position
const BUILD_X = 358;       // where building happens
const BUILD_Y = GROUND_Y - 16;
const CAB_FINAL_X = BUILD_X;
const CAB_FINAL_Y = GROUND_Y - 20;

// ─── Part labels (what Sam carries each trip) ───
const TRIP_PARTS = [
  { label: 'TV', color: '#555555' },
  { label: 'Pi', color: '#44AA44' },
  { label: 'SPK', color: '#8B6914' },
];

// ─── Types ───
interface Particle {
  active: boolean;
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number; color: string;
}

// ─── Pixel helper ───
function px(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(w), Math.ceil(h));
}

// ─── SPRITES ───

function drawSam(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, facingRight: boolean, carrying: boolean) {
  const ox = facingRight ? x : x + 11;
  const p = (px_: number, py: number, pw: number, ph: number, c: string) => {
    const drawX = facingRight ? ox + px_ : ox - px_ - pw;
    px(ctx, drawX, y + py, pw, ph, c);
  };

  // Hair (rows 0-2)
  p(3, 0, 6, 1, C.hair);
  p(2, 1, 7, 1, C.hairLight);
  p(1, 2, 9, 1, C.hairLight);

  // Face (rows 3-7)
  p(1, 3, 9, 1, C.skin);
  p(1, 4, 1, 1, C.skin); p(2, 4, 1, 1, C.eyes); p(3, 4, 2, 1, C.skin);
  p(5, 4, 1, 1, C.skin); p(6, 4, 1, 1, C.eyes); p(7, 4, 2, 1, C.skin);
  p(9, 4, 1, 1, C.skin);
  p(1, 5, 9, 1, C.skin);
  p(2, 6, 7, 1, C.skin); p(3, 6, 1, 1, C.skinDark); p(6, 6, 1, 1, C.skinDark);
  p(3, 7, 5, 1, C.skin);

  // Shirt (rows 8-11)
  p(2, 8, 7, 1, C.shirt);
  p(1, 9, 9, 1, C.shirt);

  if (carrying) {
    p(0, 8, 1, 2, C.shirt); p(10, 8, 1, 2, C.shirt);
    p(0, 7, 1, 1, C.skin); p(10, 7, 1, 1, C.skin);
  } else {
    p(0, 10, 1, 1, C.shirt); p(10, 10, 1, 1, C.shirt);
    p(3, 10, 1, 1, C.skin); p(7, 10, 1, 1, C.skin);
    p(1, 10, 9, 1, C.shirt);
  }
  p(3, 11, 5, 1, C.shirt);

  // Pants + shoes with walk animation
  const legOff = frame === 1 ? 1 : frame === 2 ? -1 : 0;
  p(4, 12, 3, 1, C.pants);
  p(3 + legOff, 13, 2, 1, C.pants);
  p(6 - legOff, 13, 2, 1, C.pants);
  p(2 + legOff, 14, 3, 1, C.shoes);
  p(6 - legOff, 14, 3, 1, C.shoes);
}

function drawCarryItem(ctx: CanvasRenderingContext2D, x: number, y: number, partIndex: number) {
  // Small item carried above Sam's head
  const part = TRIP_PARTS[partIndex];
  if (partIndex === 0) {
    // TV: boxy CRT monitor shape
    px(ctx, x, y, 8, 6, '#444');
    px(ctx, x + 1, y + 1, 6, 4, '#1a2a3a');
    px(ctx, x + 2, y + 2, 4, 2, '#0a1a2a');
  } else if (partIndex === 1) {
    // Raspberry Pi: small green board
    px(ctx, x + 1, y + 1, 6, 4, '#227722');
    px(ctx, x + 2, y + 2, 1, 1, '#44CC44');
    px(ctx, x + 4, y + 2, 2, 1, '#888');
    px(ctx, x + 2, y + 3, 3, 1, '#999');
  } else {
    // Speakers: two circles-ish
    px(ctx, x, y, 8, 5, '#6B4423');
    px(ctx, x + 1, y + 1, 2, 3, '#333');
    px(ctx, x + 5, y + 1, 2, 3, '#333');
    px(ctx, x + 2, y + 2, 1, 1, '#666');
    px(ctx, x + 6, y + 2, 1, 1, '#666');
  }
}

function drawFullCabinet(ctx: CanvasRenderingContext2D, x: number, y: number, bootProgress: number) {
  const bx = x, by = y;

  // Shadow
  px(ctx, bx + 1, by + 19, 10, 1, 'rgba(0,0,0,0.3)');
  // Base/feet
  px(ctx, bx + 1, by + 18, 10, 2, C.cab[0]);
  // Main body
  px(ctx, bx + 2, by + 3, 8, 15, C.cab[1]);
  px(ctx, bx + 2, by + 3, 8, 1, C.cab[3]);

  // Speakers at top
  px(ctx, bx + 2, by, 8, 3, C.cab[2]);
  px(ctx, bx + 2, by, 8, 1, C.cab[4]);
  for (let col = 0; col < 3; col++) {
    px(ctx, bx + 3 + col * 2, by + 1, 1, 1, C.cab[4]);
    px(ctx, bx + 4 + col * 2, by + 1, 1, 1, C.cab[1]);
    px(ctx, bx + 3 + col * 2, by + 2, 1, 1, C.cab[1]);
    px(ctx, bx + 4 + col * 2, by + 2, 1, 1, C.cab[4]);
  }

  // Screen area
  px(ctx, bx + 3, by + 4, 6, 6, '#050505');
  px(ctx, bx + 3, by + 4, 6, 6, C.screenGlass);

  // Boot animation
  if (bootProgress > 0) {
    if (bootProgress < 0.15) {
      const flicker = Math.sin(bootProgress * 80) > 0.3;
      if (flicker) { ctx.globalAlpha = 0.7; px(ctx, bx + 3, by + 4, 6, 6, '#ffffff'); ctx.globalAlpha = 1; }
    } else if (bootProgress < 0.4) {
      const sweep = (bootProgress - 0.15) / 0.25;
      const sweepH = Math.floor(sweep * 6);
      px(ctx, bx + 3, by + 4, 6, sweepH, C.teal);
      ctx.globalAlpha = 0.4; px(ctx, bx + 3, by + 4, 6, sweepH, '#000'); ctx.globalAlpha = 1;
    } else if (bootProgress < 0.6) {
      px(ctx, bx + 3, by + 4, 6, 6, '#0a2020');
      px(ctx, bx + 5, by + 6, 2, 2, C.teal);
    } else {
      px(ctx, bx + 3, by + 4, 6, 6, '#0a2020');
      px(ctx, bx + 4, by + 6, 4, 1, C.teal);
      ctx.globalAlpha = 0.1 + Math.sin(bootProgress * 6) * 0.05;
      px(ctx, bx + 2, by + 3, 8, 8, C.teal);
      ctx.globalAlpha = 1;
    }
  }

  px(ctx, bx + 3, by + 4, 1, 1, C.cab[3]);

  // Control panel
  px(ctx, bx + 3, by + 11, 6, 3, C.metal[0]);
  px(ctx, bx + 3, by + 11, 6, 1, C.metal[2]);
  px(ctx, bx + 4, by + 12, 1, 2, C.cab[0]);
  px(ctx, bx + 4, by + 12, 1, 1, C.red);
  px(ctx, bx + 6, by + 12, 1, 1, '#44AA44');
  px(ctx, bx + 7, by + 12, 1, 1, '#4444CC');
  px(ctx, bx + 8, by + 13, 1, 1, C.amber);

  // Lower body
  px(ctx, bx + 2, by + 14, 8, 4, C.cab[2]);
  if (bootProgress > 0.5) {
    px(ctx, bx + 8, by + 15, 1, 1, C.teal);
    px(ctx, bx + 8, by + 16, 1, 1, C.red);
  }

  // Glow halo when booted
  if (bootProgress >= 1) {
    ctx.globalAlpha = 0.06 + Math.sin(Date.now() / 500) * 0.02;
    const grd = ctx.createRadialGradient(bx + 6, by + 10, 2, bx + 6, by + 10, 18);
    grd.addColorStop(0, C.teal);
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(bx - 10, by - 8, 32, 36);
    ctx.globalAlpha = 1;
  }
}

function drawVan(ctx: CanvasRenderingContext2D, x: number, y: number, opts: {
  headlights?: boolean; brakelights?: boolean; samInside?: boolean;
  bouncing?: boolean; partsLoaded?: number; // 0-3 parts loaded
}) {
  const bounce = opts.bouncing ? 1 : 0;

  // Shadow
  ctx.globalAlpha = 0.2; px(ctx, x + 2, y - 1, 32, 2, '#000'); ctx.globalAlpha = 1;

  // Wheels
  px(ctx, x + 4, y - 3, 4, 3, C.vanWheel); px(ctx, x + 5, y - 2, 2, 1, C.vanHub);
  px(ctx, x + 26, y - 3, 4, 3, C.vanWheel); px(ctx, x + 27, y - 2, 2, 1, C.vanHub);

  // Undercarriage + body
  px(ctx, x + 2, y - 5 - bounce, 32, 3, C.vanDark);
  px(ctx, x + 1, y - 12 - bounce, 34, 7, C.vanBody);
  px(ctx, x + 1, y - 6 - bounce, 34, 1, C.vanDark);

  // Roof
  px(ctx, x + 3, y - 15 - bounce, 28, 3, C.vanBody);
  px(ctx, x + 5, y - 16 - bounce, 24, 1, '#8A8A9A');

  // Windows
  px(ctx, x + 5, y - 14 - bounce, 5, 4, C.vanWindow);
  px(ctx, x + 11, y - 14 - bounce, 5, 4, C.vanWindow);
  px(ctx, x + 17, y - 14 - bounce, 7, 4, C.vanWindow);
  px(ctx, x + 24, y - 13 - bounce, 2, 3, C.vanWindow);

  // Sam in driver seat
  if (opts.samInside) {
    px(ctx, x + 19, y - 14 - bounce, 3, 2, C.hair);
    px(ctx, x + 19, y - 12 - bounce, 3, 1, C.skin);
    px(ctx, x + 19, y - 11 - bounce, 3, 1, C.shirt);
  }

  // Parts visible in rear (stacked)
  const parts = opts.partsLoaded || 0;
  if (parts >= 1) { px(ctx, x + 5, y - 12 - bounce, 4, 3, '#444'); px(ctx, x + 6, y - 11 - bounce, 2, 1, '#1a2a3a'); }
  if (parts >= 2) { px(ctx, x + 9, y - 11 - bounce, 3, 2, '#227722'); px(ctx, x + 10, y - 11 - bounce, 1, 1, '#44CC44'); }
  if (parts >= 3) { px(ctx, x + 5, y - 14 - bounce, 3, 2, '#6B4423'); px(ctx, x + 6, y - 14 - bounce, 1, 1, '#333'); }

  // Bumpers
  px(ctx, x + 33, y - 8 - bounce, 2, 3, C.vanDark);
  px(ctx, x, y - 8 - bounce, 2, 3, C.vanDark);

  // Headlights
  if (opts.headlights) {
    px(ctx, x + 34, y - 9 - bounce, 1, 2, C.headlight);
    ctx.globalAlpha = 0.04; px(ctx, x + 35, y - 12 - bounce, 15, 6, C.headlight); ctx.globalAlpha = 1;
  }

  // Brake lights
  px(ctx, x, y - 9 - bounce, 1, 2, opts.brakelights ? C.brakeOn : C.brakeOff);
}

function drawHouse(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Foundation
  px(ctx, x + 2, y - 3, 34, 3, C.foundation);
  // Walls
  px(ctx, x + 3, y - 20, 32, 17, C.wall);
  px(ctx, x + 3, y - 20, 1, 17, C.wallDark);
  px(ctx, x + 34, y - 20, 1, 17, C.wallDark);
  // Roof
  px(ctx, x, y - 24, 38, 2, C.roof);
  px(ctx, x + 1, y - 26, 36, 2, C.roof);
  px(ctx, x + 2, y - 28, 34, 2, C.roof);
  px(ctx, x + 3, y - 30, 32, 2, C.roofLight);
  px(ctx, x + 5, y - 32, 28, 2, C.roofLight);
  px(ctx, x, y - 24, 38, 1, C.roofLight);
  // Door
  px(ctx, x + 15, y - 14, 7, 11, C.door);
  px(ctx, x + 15, y - 14, 7, 1, '#6B4423');
  px(ctx, x + 20, y - 9, 1, 1, C.amber);
  // "D" on door
  px(ctx, x + 17, y - 12, 1, 3, C.teal);
  px(ctx, x + 18, y - 13, 1, 1, C.teal);
  px(ctx, x + 18, y - 9, 1, 1, C.teal);
  px(ctx, x + 19, y - 12, 1, 3, C.teal);
  // Windows with warm glow
  px(ctx, x + 6, y - 17, 6, 5, C.windowDark);
  px(ctx, x + 7, y - 16, 4, 3, C.windowGlow);
  ctx.globalAlpha = 0.15; px(ctx, x + 7, y - 16, 4, 3, '#fff'); ctx.globalAlpha = 1;
  px(ctx, x + 26, y - 17, 6, 5, C.windowDark);
  px(ctx, x + 27, y - 16, 4, 3, C.windowGlow);
  ctx.globalAlpha = 0.15; px(ctx, x + 27, y - 16, 4, 3, '#fff'); ctx.globalAlpha = 1;
}

// ─── Build cloud: smoke cloud with construction icons popping out ───
function drawBuildCloud(ctx: CanvasRenderingContext2D, x: number, y: number, progress: number, gameTime: number) {
  // progress: 0→1 over build phase
  // Cloud grows then shrinks to reveal cabinet

  const cloudSize = progress < 0.6
    ? lerp(0, 1, progress / 0.6)           // grow
    : lerp(1, 0, (progress - 0.6) / 0.4);  // shrink

  if (cloudSize <= 0.01) return;

  const cx = x + 6;
  const cy = y + 8;
  const r = cloudSize * 22;

  // Main dust cloud — overlapping circles
  ctx.globalAlpha = cloudSize * 0.7;
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + gameTime * 2;
    const dx = Math.cos(angle) * r * 0.4;
    const dy = Math.sin(angle) * r * 0.3;
    const cr = r * (0.5 + Math.sin(gameTime * 4 + i) * 0.15);
    ctx.fillStyle = C.smoke[i % C.smoke.length];
    ctx.beginPath();
    ctx.arc(cx + dx, cy + dy, cr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Construction icons flying out of cloud
  if (progress > 0.1 && progress < 0.8) {
    const iconPhase = (gameTime * 3) % 4;

    ctx.globalAlpha = cloudSize * 0.9;

    // Hammer icon (rotating)
    if (iconPhase < 1 || iconPhase > 3) {
      const hx = cx - r * 0.7 + Math.sin(gameTime * 5) * 4;
      const hy = cy - r * 0.5 + Math.cos(gameTime * 3) * 3;
      // Handle
      px(ctx, hx, hy + 1, 1, 4, '#8B6914');
      // Head
      px(ctx, hx - 1, hy, 3, 2, '#888');
    }

    // Wrench icon
    if (iconPhase > 0.5 && iconPhase < 2.5) {
      const wx = cx + r * 0.6 + Math.cos(gameTime * 4) * 3;
      const wy = cy - r * 0.4 + Math.sin(gameTime * 5) * 4;
      px(ctx, wx, wy, 1, 5, '#999');
      px(ctx, wx - 1, wy, 3, 1, '#999');
      px(ctx, wx - 1, wy + 4, 3, 1, '#999');
    }

    // Sparks / stars
    if (iconPhase > 1.5 && iconPhase < 3.5) {
      const sx = cx + Math.sin(gameTime * 6) * r * 0.8;
      const sy = cy - r * 0.6 + Math.cos(gameTime * 4) * 3;
      // Star cross
      px(ctx, sx, sy - 1, 1, 3, C.amber);
      px(ctx, sx - 1, sy, 3, 1, C.amber);
    }

    // Nail icon
    if (iconPhase > 2) {
      const nx = cx - r * 0.5 + Math.cos(gameTime * 3) * 5;
      const ny = cy + r * 0.3 + Math.sin(gameTime * 6) * 2;
      px(ctx, nx, ny, 1, 4, '#AAA');
      px(ctx, nx - 1, ny, 3, 1, '#AAA');
    }

    // Screw icon
    const scrX = cx + Math.cos(gameTime * 2.5) * r * 0.5;
    const scrY = cy + Math.sin(gameTime * 3.5) * r * 0.4;
    px(ctx, scrX, scrY, 1, 3, '#777');
    px(ctx, scrX - 1, scrY, 3, 1, '#777');

    ctx.globalAlpha = 1;
  }

  // Motion lines around cloud
  if (progress > 0.05 && progress < 0.7) {
    ctx.globalAlpha = cloudSize * 0.3;
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + gameTime;
      const lx = cx + Math.cos(angle) * (r + 4);
      const ly = cy + Math.sin(angle) * (r * 0.7 + 3);
      const len = 3 + Math.sin(gameTime * 5 + i) * 2;
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);
      px(ctx, lx, ly, len * dx + 0.5, 1, '#CCC');
      px(ctx, lx, ly, 1, len * dy + 0.5, '#CCC');
    }
    ctx.globalAlpha = 1;
  }
}

// ─── Particle system ───
function spawnDust(particles: Particle[], x: number, y: number) {
  for (const p of particles) {
    if (!p.active) {
      p.active = true;
      p.x = x + Math.random() * 4;
      p.y = y - 1 - Math.random() * 2;
      p.vx = -(15 + Math.random() * 25);
      p.vy = -(4 + Math.random() * 12);
      p.life = p.maxLife = 0.3 + Math.random() * 0.4;
      p.size = 1 + Math.floor(Math.random() * 1.5);
      p.color = C.dust[Math.floor(Math.random() * C.dust.length)];
      return;
    }
  }
}

function spawnBuildPuff(particles: Particle[], x: number, y: number) {
  for (let i = 0; i < 3; i++) {
    for (const p of particles) {
      if (!p.active) {
        p.active = true;
        p.x = x + Math.random() * 16 - 8;
        p.y = y + Math.random() * 10 - 5;
        p.vx = (Math.random() - 0.5) * 30;
        p.vy = -(8 + Math.random() * 20);
        p.life = p.maxLife = 0.4 + Math.random() * 0.5;
        p.size = 2 + Math.floor(Math.random() * 2);
        p.color = C.smoke[Math.floor(Math.random() * C.smoke.length)];
        break;
      }
    }
  }
}

function updateParticles(particles: Particle[], dt: number) {
  for (const p of particles) {
    if (!p.active) continue;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 30 * dt;
    p.life -= dt;
    if (p.life <= 0) p.active = false;
  }
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    if (!p.active) continue;
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife) * 0.6;
    px(ctx, p.x, p.y, p.size, p.size, p.color);
  }
  ctx.globalAlpha = 1;
}

// ─── Ground ───
function drawGround(ctx: CanvasRenderingContext2D) {
  px(ctx, 0, GROUND_Y, W, 1, C.groundLine);
  for (let dx = 10; dx < W; dx += 12) {
    px(ctx, dx, GROUND_Y + 2, 4, 1, C.groundDot);
  }
}

// ─── Helpers ───
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// ─── React Component ───
const DcadeHeroAnimation: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const particles: Particle[] = Array.from({ length: MAX_PARTICLES }, () => ({
      active: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0, size: 1, color: '#000',
    }));

    let startTime = 0;
    let lastTime = 0;
    let walkFrame = 0;
    let walkTimer = 0;
    let dustTimer = 0;
    let buildPuffTimer = 0;
    let completed = false;

    function drawStaticFrame() {
      ctx!.clearRect(0, 0, W, H);
      drawGround(ctx!);
      drawHouse(ctx!, HOUSE_X, GROUND_Y);
      drawFullCabinet(ctx!, CAB_FINAL_X, CAB_FINAL_Y, 1);
      drawSam(ctx!, CAB_FINAL_X - 16, GROUND_Y - 15, 0, true, false);
    }

    if (prefersReduced) { drawStaticFrame(); return; }

    // ─── Helper: which loading trip are we on? ───
    function getTripState(t: number): { tripNum: number; samX: number; carrying: boolean; partIndex: number; partsInVan: number; atVan: boolean } {
      // Trip 1: walk in from left → van
      if (t < T.trip1Load) {
        const p = Math.max(0, (t - T.trip1Start) / (T.trip1Load - T.trip1Start));
        return { tripNum: 1, samX: lerp(PARTS_X, VAN_PARK_X - 8, easeInOut(p)), carrying: true, partIndex: 0, partsInVan: 0, atVan: p >= 0.95 };
      }
      // Between trip 1 and 2: walk back left then return
      if (t < T.trip2Load) {
        if (t < T.trip2Start) {
          // Loading pause
          return { tripNum: 1, samX: VAN_PARK_X - 8, carrying: false, partIndex: 0, partsInVan: 1, atVan: true };
        }
        // Walk back left then come back with part 2
        const totalDur = T.trip2Load - T.trip2Start;
        const p = (t - T.trip2Start) / totalDur;
        if (p < 0.4) {
          // Walking left (away)
          const backP = p / 0.4;
          return { tripNum: 2, samX: lerp(VAN_PARK_X - 8, PARTS_X + 20, easeInOut(backP)), carrying: false, partIndex: 1, partsInVan: 1, atVan: false };
        } else {
          // Walking right with part 2
          const fwdP = (p - 0.4) / 0.6;
          return { tripNum: 2, samX: lerp(PARTS_X + 20, VAN_PARK_X - 8, easeInOut(fwdP)), carrying: true, partIndex: 1, partsInVan: 1, atVan: fwdP >= 0.95 };
        }
      }
      // Between trip 2 and 3
      if (t < T.trip3Load) {
        if (t < T.trip3Start) {
          return { tripNum: 2, samX: VAN_PARK_X - 8, carrying: false, partIndex: 1, partsInVan: 2, atVan: true };
        }
        const totalDur = T.trip3Load - T.trip3Start;
        const p = (t - T.trip3Start) / totalDur;
        if (p < 0.35) {
          const backP = p / 0.35;
          return { tripNum: 3, samX: lerp(VAN_PARK_X - 8, PARTS_X + 25, easeInOut(backP)), carrying: false, partIndex: 2, partsInVan: 2, atVan: false };
        } else {
          const fwdP = (p - 0.35) / 0.65;
          return { tripNum: 3, samX: lerp(PARTS_X + 25, VAN_PARK_X - 8, easeInOut(fwdP)), carrying: true, partIndex: 2, partsInVan: 2, atVan: fwdP >= 0.95 };
        }
      }
      // After trip 3, before entering van
      return { tripNum: 3, samX: VAN_PARK_X - 8, carrying: false, partIndex: 2, partsInVan: 3, atVan: true };
    }

    // ─── Main loop ───
    function animate(timestamp: number) {
      if (completed) return;
      if (!startTime) { startTime = timestamp; lastTime = timestamp; }

      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;
      const t = (timestamp - startTime) / 1000;

      walkTimer += dt;
      if (walkTimer > 0.16) { walkTimer = 0; walkFrame = walkFrame === 1 ? 2 : 1; }

      ctx!.clearRect(0, 0, W, H);
      drawGround(ctx!);

      // ─── PHASE 1: LOADING PARTS (0 → enterVan) ───
      if (t < T.enterVan) {
        drawHouse(ctx!, HOUSE_X, GROUND_Y);
        const trip = getTripState(t);

        const bounce = trip.atVan && trip.carrying;
        drawVan(ctx!, VAN_PARK_X, GROUND_Y, {
          headlights: false, brakelights: false, samInside: false,
          bouncing: bounce, partsLoaded: trip.partsInVan + (trip.atVan && trip.carrying ? 1 : 0),
        });

        // Face right when carrying (walking to van), face left when walking back for more parts
        const isWalking = !(trip.atVan && !trip.carrying);
        let facingRight = trip.carrying; // carrying = walking right toward van
        // When at van and not carrying, just face right (idle)
        if (trip.atVan && !trip.carrying) facingRight = true;
        drawSam(ctx!, trip.samX, GROUND_Y - 15, isWalking ? walkFrame : 0, facingRight, trip.carrying);

        if (trip.carrying) {
          drawCarryItem(ctx!, trip.samX + 2, GROUND_Y - 15 - 7, trip.partIndex);
        }
      }
      // ─── PHASE 1b: ENTERING VAN (enterVan → driveStart) ───
      else if (t < T.driveStart) {
        drawHouse(ctx!, HOUSE_X, GROUND_Y);
        const enterP = (t - T.enterVan) / (T.driveStart - T.enterVan);

        drawVan(ctx!, VAN_PARK_X, GROUND_Y, {
          headlights: enterP > 0.7, brakelights: false,
          samInside: enterP > 0.5, partsLoaded: 3,
        });

        if (enterP < 0.5) {
          const samX = lerp(VAN_PARK_X - 8, VAN_PARK_X + 20, easeInOut(enterP * 2));
          drawSam(ctx!, samX, GROUND_Y - 15, walkFrame, true, false);
        }
      }
      // ─── PHASE 2: DRIVING (driveStart → vanStop) ───
      else if (t < T.vanStop) {
        drawHouse(ctx!, HOUSE_X, GROUND_Y);

        const driveP = (t - T.driveStart) / (T.driveEnd - T.driveStart);
        const decelP = t > T.driveEnd ? (t - T.driveEnd) / (T.vanStop - T.driveEnd) : 0;

        let vanX: number;
        if (t <= T.driveEnd) {
          vanX = lerp(VAN_PARK_X, HOUSE_X - 55, easeInOut(Math.min(1, driveP)));
        } else {
          vanX = lerp(HOUSE_X - 55, HOUSE_X - 48, easeInOut(decelP));
        }

        const braking = t > T.driveEnd;
        drawVan(ctx!, vanX, GROUND_Y, {
          headlights: !braking, brakelights: braking, samInside: true, partsLoaded: 3,
        });

        if (!braking) {
          dustTimer += dt;
          if (dustTimer > 0.05) {
            dustTimer = 0;
            spawnDust(particles, vanX + 2, GROUND_Y - 2);
            spawnDust(particles, vanX + 3, GROUND_Y - 1);
          }
        }

        updateParticles(particles, dt);
        drawParticles(ctx!, particles);
      }
      // ─── PHASE 3: ARRIVAL + WALK TO HOUSE (vanStop → buildStart) ───
      else if (t < T.buildStart) {
        drawHouse(ctx!, HOUSE_X, GROUND_Y);
        const vanFinalX = HOUSE_X - 48;

        if (t < T.samExit) {
          drawVan(ctx!, vanFinalX, GROUND_Y, { brakelights: true, samInside: true, partsLoaded: 3 });
        } else if (t < T.samAtHouse) {
          const exitP = (t - T.samExit) / (T.samAtHouse - T.samExit);
          drawVan(ctx!, vanFinalX, GROUND_Y, {
            brakelights: false, samInside: exitP < 0.15, partsLoaded: exitP < 0.3 ? 3 : 0,
          });
          if (exitP >= 0.15) {
            const samX = lerp(vanFinalX + 20, BUILD_X - 8, easeInOut((exitP - 0.15) / 0.85));
            drawSam(ctx!, samX, GROUND_Y - 15, walkFrame, true, exitP > 0.3);
            if (exitP > 0.3) {
              // Carrying an armload of parts
              drawCarryItem(ctx!, samX + 2, GROUND_Y - 15 - 7, 0);
            }
          }
        } else {
          // Sam arrived at build spot, van fading
          const fadeP = (t - T.samAtHouse) / (T.buildStart - T.samAtHouse);
          ctx!.globalAlpha = lerp(1, 0, fadeP);
          drawVan(ctx!, vanFinalX - fadeP * 40, GROUND_Y, { partsLoaded: 0 });
          ctx!.globalAlpha = 1;
          drawSam(ctx!, BUILD_X - 8, GROUND_Y - 15, 0, true, false);
        }

        updateParticles(particles, dt);
        drawParticles(ctx!, particles);
      }
      // ─── PHASE 4: BUILDING (dust cloud + construction) ───
      else if (t < T.buildEnd) {
        drawHouse(ctx!, HOUSE_X, GROUND_Y);
        const buildP = (t - T.buildStart) / (T.buildEnd - T.buildStart);

        // Spawn build puffs
        buildPuffTimer += dt;
        if (buildPuffTimer > 0.12 && buildP < 0.7) {
          buildPuffTimer = 0;
          spawnBuildPuff(particles, BUILD_X + 4, BUILD_Y + 8);
        }

        // Sam is hidden inside cloud during build
        if (buildP > 0.75) {
          // Sam emerges, cabinet revealed
          const revealP = (buildP - 0.75) / 0.25;
          drawFullCabinet(ctx!, CAB_FINAL_X, CAB_FINAL_Y, 0);
          ctx!.globalAlpha = revealP;
          drawSam(ctx!, CAB_FINAL_X - 16, GROUND_Y - 15, 0, true, false);
          ctx!.globalAlpha = 1;
        }

        // Draw the cloud on top
        drawBuildCloud(ctx!, BUILD_X, BUILD_Y, buildP, t);

        updateParticles(particles, dt);
        drawParticles(ctx!, particles);
      }
      // ─── PHASE 5: BOOT UP ───
      else if (t < T.bootEnd) {
        drawHouse(ctx!, HOUSE_X, GROUND_Y);
        const bootP = (t - T.bootStart) / (T.bootEnd - T.bootStart);

        drawFullCabinet(ctx!, CAB_FINAL_X, CAB_FINAL_Y, bootP);
        drawSam(ctx!, CAB_FINAL_X - 16, GROUND_Y - 15, 0, true, false);

        updateParticles(particles, dt);
        drawParticles(ctx!, particles);
      }
      // ─── PHASE 6: STATIC ───
      else {
        drawStaticFrame();
        completed = true;
        return;
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <div className={`absolute inset-0 flex items-end justify-center pointer-events-none overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="w-full"
        style={{
          imageRendering: 'pixelated',
          maxHeight: '70%',
          objectFit: 'contain',
          objectPosition: 'bottom center',
          marginBottom: '3%',
        } as React.CSSProperties}
        aria-hidden="true"
      />
    </div>
  );
};

export default DcadeHeroAnimation;
