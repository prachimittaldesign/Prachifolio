/* global React, IsoCore */
const { useState, useEffect, useRef, useCallback } = React;
const { TILE_W, HALF_W, HALF_H, TILE_THICKNESS, gridToScreen, quadrant, BIOME_FILL, BIOME_SIDE, Glyphs } = IsoCore;

// Project data — graph coords (gx=complexity, gy=enterprise/consumer)
// Coords use multiples of 2 so odd cells in between are free for arterial roads.
// `scale` is a visual importance multiplier (assorted; tune later).
const PROJECTS = [
  // Enterprise + Complex (Q1, +x +y)
  { id: "impressio", gx: 2,  gy: 4,  scale: 1.30, label: "Impressio",     sub: "AEON ROBOT · 2024",      glyph: "robot",     desc: "End-to-end flows for casting MIAs on the Aeon humanoid robot — desktop and tablet — including the World AI Summit demo." , tags: ["B2B", "Tablet", "Robotics"] },
  { id: "izak",      gx: 6,  gy: 4,  scale: 1.50, label: "iZak",          sub: "3D · LIDAR",             glyph: "scanner",   desc: "UX research and design for a LiDAR + photogrammetry 3D scanning workflow. Most complex on the map.", tags: ["Spatial", "Research", "Mobile"] },
  { id: "paas",      gx: 4,  gy: 2,  scale: 1.20, label: "PaaS",          sub: "PROMPT LIBRARY",         glyph: "servers",   desc: "Prompt-as-a-service: library, version management, evaluation surfaces.", tags: ["B2B", "AI", "Dashboard"] },
  { id: "snap-cms",  gx: 2,  gy: 2,  scale: 1.00, label: "SnapLogic",     sub: "CMS · CONNECTORS",       glyph: "connector", desc: "CMS surfaces and connector configuration UI for SnapLogic's integration platform.", tags: ["B2B", "Enterprise"] },

  // Enterprise + Simple (Q2, -x +y)
  { id: "lms",       gx: -2, gy: 2,  scale: 0.90, label: "SnapLogic LMS", sub: "ACADEMY · 6 COURSES",    glyph: "book",      desc: "Redesign of 6 internal SnapLogic Academy course pages — weekly review cycles, prototype, handoff.", tags: ["B2B", "Education"] },
  { id: "holacracy", gx: -4, gy: 4,  scale: 1.15, label: "Holacracy",     sub: "INTERNAL TOOLING",       glyph: "circles",   desc: "Internal tooling for self-organizing teams — circles, roles, governance.", tags: ["B2B", "Internal"] },
  { id: "kya",       gx: -2, gy: 4,  scale: 1.05, label: "KYA",           sub: "DOCUMENT WORKFLOW",      glyph: "docs",      desc: "Know-your-anything document workflow surfaces.", tags: ["B2B", "Workflow"] },

  // Consumer + Complex (Q4, +x -y)
  { id: "amplyfund", gx: 2,  gy: -2, scale: 1.10, label: "Amplyfund",     sub: "TV · FUNDRAISING",       glyph: "tv",        desc: "TV UI redesign for a fundraising platform — addressed core usability and aligned with the design system.", tags: ["Consumer", "TV"] },
  { id: "voteiq",    gx: 4,  gy: -4, scale: 1.35, label: "Vote IQ",       sub: "TV + WEB · POLITICS",    glyph: "ballot",    desc: "TV and web design for civic engagement. Persona-based user flows; collaboration with Khushi and Cherry.", tags: ["Consumer", "TV", "Web"] },

  // Consumer + Simple (Q3, -x -y)
  { id: "mo",        gx: -2, gy: -2, scale: 1.00, label: "Mo",            sub: "MOBILE · HEALTHCARE",    glyph: "heart",     desc: "Information architecture and prototyping for a healthcare consumer app — internal pilot release.", tags: ["Consumer", "Mobile"] },
  { id: "clink",     gx: -4, gy: -2, scale: 0.85, label: "Clink",         sub: "UI REDESIGN",            glyph: "bubble",    desc: "UI redesign in collaboration with Moon and Ritesh — onboarding, polishing.", tags: ["Consumer", "Mobile"] },
  { id: "revee",     gx: -2, gy: -4, scale: 0.95, label: "Revee",         sub: "FLOWS · QA",             glyph: "sprout",    desc: "User flow mapping, prototyping, QA handoff and developer collaboration. Internal pilot launched.", tags: ["Consumer"] },

  // Architecture cottage (off-axis, far back)
  { id: "arch",      gx: 6,  gy: 6,  scale: 1.10, label: "Studio",        sub: "ARCHITECTURE · RES.",    glyph: "cottage",   desc: "Residential architectural practice — the other half of Prachi's work.", tags: ["Architecture", "Residential"] },
];

// ─── Roads ────────────────────────────────────────────────────────────────
// Two MAIN roads (the axes) + a few arterial branches running parallel.
// All road cells live on coords that don't collide with PROJECTS above
// (projects are on even coords; arterials use odd-cell paths).

const _roads = [];

// Main X axis: gy=0, every integer cell from -7 to +7
for (let gx = -7; gx <= 7; gx++) {
  if (gx === 0) continue;
  _roads.push({ gx, gy: 0, kind: "road", axis: "x", main: true });
}
// Main Y axis: gx=0, every integer cell from -6 to +6
for (let gy = -6; gy <= 6; gy++) {
  if (gy === 0) continue;
  _roads.push({ gx: 0, gy, kind: "road", axis: "y", main: true });
}

// Arterial — east row (gy=2): connects snap-cms→paas→izak via odd cells
[1, 3, 5].forEach(gx => _roads.push({ gx, gy: 2, kind: "road", axis: "x" }));
// Arterial — east row (gy=-2): connects amplyfund area
[1, 3].forEach(gx => _roads.push({ gx, gy: -2, kind: "road", axis: "x" }));
// Arterial — west row (gy=2): kya/holacracy area
[-1, -3].forEach(gx => _roads.push({ gx, gy: 2, kind: "road", axis: "x" }));
// Arterial — west row (gy=-2): mo/clink area
[-1, -3].forEach(gx => _roads.push({ gx, gy: -2, kind: "road", axis: "x" }));

// Arterial vertical (gx=2): up to impressio
[1, 3].forEach(gy => _roads.push({ gx: 2, gy, kind: "road", axis: "y" }));
// Arterial vertical (gx=-2): up to kya
[1, 3].forEach(gy => _roads.push({ gx: -2, gy, kind: "road", axis: "y" }));
// Arterial vertical (gx=2): down to amplyfund
[-1].forEach(gy => _roads.push({ gx: 2, gy, kind: "road", axis: "y" }));
// Arterial vertical (gx=-2): down to mo / revee
[-1, -3].forEach(gy => _roads.push({ gx: -2, gy, kind: "road", axis: "y" }));
// Arterial vertical (gx=4): up to paas, down to voteiq
[1, 3, -1, -3].forEach(gy => _roads.push({ gx: 4, gy, kind: "road", axis: "y" }));
// Arterial vertical (gx=6): up to izak / arch
[1, 3, 5].forEach(gy => _roads.push({ gx: 6, gy, kind: "road", axis: "y" }));

const ROAD_TILES = _roads;

// Empty grass / decorative filler tiles to round out the world
const FILLER = [
  { gx: -6, gy: 2,  glyph: "trees" },
  { gx: -6, gy: 4,  glyph: "rocks" },
  { gx: -6, gy: -2, glyph: "trees" },
  { gx: -6, gy: -4, glyph: "trees" },
  { gx: 4,  gy: 6,  glyph: "trees" },
  { gx: -4, gy: 6,  glyph: "rocks" },
  { gx: 6,  gy: -6, glyph: "trees" },
  { gx: 4,  gy: -6, glyph: "rocks" },
  { gx: -4, gy: -6, glyph: "trees" },
  { gx: 5,  gy: 5,  glyph: "trees" },
];

window.PROJECTS = PROJECTS;
window.ROAD_TILES = ROAD_TILES;
window.FILLER = FILLER;
