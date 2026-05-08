/* global React */
// Isometric tile primitives + project data
// Coords: graph-X (complexity, +right), graph-Y (enterprise, +up).
// Screen mapping: sx = (gx - gy) * HALF_W, sy = -(gx + gy) * HALF_H

const TILE_W = 200;          // tile width on screen
const HALF_W = TILE_W / 2;
const HALF_H = TILE_W / 4;   // 2:1 isometric depth
const TILE_THICKNESS = 28;
// Grid spacing > tile size so tiles float with a default gap (jigsaw feel).
// Hover still adds extra radial separation on top of this.
const SPACING = 1.18;
const STEP_X = HALF_W * SPACING;
const STEP_Y = HALF_H * SPACING;

// Map graph coord -> screen offset (from camera origin)
function gridToScreen(gx, gy, spacing) {
  const s = spacing || SPACING;
  return {
    sx: (gx - gy) * (HALF_W * s),
    sy: -(gx + gy) * (HALF_H * s),
  };
}

// Quadrant biome lookup
function quadrant(gx, gy) {
  if (gx === 0 && gy === 0) return "hub";
  if (gx === 0 || gy === 0) return "road";
  if (gx > 0 && gy > 0) return "q1";   // enterprise + complex
  if (gx < 0 && gy > 0) return "q2";   // enterprise + simple
  if (gx < 0 && gy < 0) return "q3";   // consumer + simple
  return "q4";                          // consumer + complex
}

const BIOME_FILL = {
  q1: "var(--tech-q1)",
  q2: "var(--grass-q2)",
  q3: "var(--grass-q3)",
  q4: "var(--sand-q4)",
  road: "var(--road)",
  artery: "var(--road)",
  hub: "var(--paper)",
};
const BIOME_SIDE = {
  q1: "var(--tech-q1-side)",
  q2: "var(--grass-q2-side)",
  q3: "var(--grass-q3-side)",
  q4: "var(--sand-q4-side)",
  road: "var(--road-edge)",
  artery: "var(--road-edge)",
  hub: "#d8d2c2",
};

// Tile decorations: tiny SVG glyphs drawn on top of the diamond
// Each is a function returning JSX, drawn within local coords (-100..100, -50..50)
const Glyphs = {
  // Trees
  trees: () => (
    <g>
      <ellipse cx="-40" cy="-10" rx="14" ry="10" fill="var(--grass-q2-side)" stroke="var(--tile-stroke)" strokeWidth="1.5"/>
      <ellipse cx="-40" cy="-16" rx="10" ry="8" fill="var(--grass-q2)" stroke="var(--tile-stroke)" strokeWidth="1.5"/>
      <ellipse cx="30" cy="0" rx="18" ry="13" fill="var(--grass-q2-side)" stroke="var(--tile-stroke)" strokeWidth="1.5"/>
      <ellipse cx="30" cy="-8" rx="13" ry="10" fill="var(--grass-q2)" stroke="var(--tile-stroke)" strokeWidth="1.5"/>
    </g>
  ),
  // Rocks
  rocks: () => (
    <g fill="#9a9282" stroke="var(--tile-stroke)" strokeWidth="1.5">
      <path d="M -30 5 q -10 -14 6 -16 q 16 -2 16 12 q -10 6 -22 4 z"/>
      <path d="M 20 8 q -6 -12 8 -14 q 14 0 12 12 q -10 4 -20 2 z" fill="#aea596"/>
    </g>
  ),
  // Building (small)
  smallBldg: () => (
    <g stroke="var(--tile-stroke)" strokeWidth="1.5" strokeLinejoin="round">
      <polygon points="-20,-10 0,-22 20,-10 0,2" fill="#e2c89c"/>
      <polygon points="-20,-10 0,2 0,18 -20,8" fill="#c8a875"/>
      <polygon points="20,-10 0,2 0,18 20,8" fill="#a88a5c"/>
      <polygon points="-20,-10 0,-22 0,2" fill="#f0d8b0" opacity="0.7"/>
    </g>
  ),
  // Tower / studio
  tower: () => (
    <g stroke="var(--tile-stroke)" strokeWidth="1.5" strokeLinejoin="round">
      <polygon points="-12,-8 0,-16 12,-8 0,0" fill="#e8e3d3"/>
      <polygon points="-12,-8 0,0 0,28 -12,20" fill="#c8c2b0"/>
      <polygon points="12,-8 0,0 0,28 12,20" fill="#a8a290"/>
      <polygon points="-18,-26 0,-36 18,-26 0,-16" fill="#d96a4a"/>
      <polygon points="-18,-26 0,-16 0,-8 -12,-12" fill="#b04e34"/>
      <polygon points="18,-26 0,-16 0,-8 12,-12" fill="#8e3a26"/>
    </g>
  ),
  // Robot (Impressio)
  robot: () => (
    <g stroke="var(--tile-stroke)" strokeWidth="1.5" strokeLinejoin="round">
      <polygon points="-14,4 0,12 14,4 0,-4" fill="#e0e6ec"/>
      <polygon points="-14,4 0,-4 0,18 -14,26" fill="#b8c2cc"/>
      <polygon points="14,4 0,-4 0,18 14,26" fill="#90a0b0"/>
      <rect x="-10" y="-22" width="20" height="20" rx="4" fill="#3b6e8f" stroke="var(--tile-stroke)" strokeWidth="1.5"/>
      <circle cx="-3" cy="-14" r="2.5" fill="#ffd56a"/>
      <circle cx="5" cy="-14" r="2.5" fill="#ffd56a"/>
    </g>
  ),
  // Lighthouse / scanner (iZak)
  scanner: () => (
    <g stroke="var(--tile-stroke)" strokeWidth="1.5" strokeLinejoin="round">
      <polygon points="-10,-2 0,4 10,-2 0,-8" fill="#d8d2c2"/>
      <polygon points="-10,-2 0,-8 0,18 -10,24" fill="#a8a292" opacity="0.9"/>
      <polygon points="10,-2 0,-8 0,18 10,24" fill="#807a6a"/>
      <rect x="-3" y="-30" width="6" height="24" fill="#e87b5a" stroke="var(--tile-stroke)" strokeWidth="1.5"/>
      <circle cx="0" cy="-32" r="5" fill="#ffd56a" stroke="var(--tile-stroke)" strokeWidth="1.5"/>
      <path d="M 0 -32 L -28 -20 M 0 -32 L 28 -20 M 0 -32 L -34 -8" stroke="#ffd56a" strokeWidth="1" opacity="0.6"/>
    </g>
  ),
  // Server stack
  servers: () => (
    <g stroke="var(--tile-stroke)" strokeWidth="1.5" strokeLinejoin="round">
      <polygon points="-16,-2 0,6 16,-2 0,-10" fill="#3a4a5c"/>
      <polygon points="-16,-2 0,-10 0,16 -16,24" fill="#2a3848"/>
      <polygon points="16,-2 0,-10 0,16 16,24" fill="#1c2734"/>
      <rect x="-13" y="-3" width="26" height="3" fill="#7ad0a5" opacity="0.8"/>
      <rect x="-13" y="3" width="26" height="3" fill="#ffd56a" opacity="0.8"/>
      <rect x="-13" y="9" width="26" height="3" fill="#7ad0a5" opacity="0.8"/>
    </g>
  ),
  // Plug / connector
  connector: () => (
    <g stroke="var(--tile-stroke)" strokeWidth="1.5" strokeLinejoin="round">
      <polygon points="-18,0 0,10 18,0 0,-10" fill="#f0d4a4"/>
      <circle cx="-8" cy="-2" r="5" fill="#3b6e8f" stroke="var(--tile-stroke)"/>
      <circle cx="8" cy="2" r="5" fill="#d96a4a" stroke="var(--tile-stroke)"/>
      <path d="M -3 0 L 3 0" stroke="var(--tile-stroke)" strokeWidth="2"/>
    </g>
  ),
  // Book / LMS
  book: () => (
    <g stroke="var(--tile-stroke)" strokeWidth="1.5" strokeLinejoin="round">
      <polygon points="-20,2 0,12 20,2 0,-8" fill="#f6efde"/>
      <polygon points="-14,-2 0,5 14,-2 0,-9" fill="#d96a4a"/>
      <line x1="-8" y1="0" x2="0" y2="4" stroke="var(--tile-stroke)" strokeWidth="1"/>
      <line x1="8" y1="0" x2="0" y2="4" stroke="var(--tile-stroke)" strokeWidth="1"/>
    </g>
  ),
  // TV (Vote IQ, Amplyfund)
  tv: () => (
    <g stroke="var(--tile-stroke)" strokeWidth="1.5" strokeLinejoin="round">
      <rect x="-22" y="-18" width="44" height="28" rx="3" fill="#2a2a2a"/>
      <rect x="-19" y="-15" width="38" height="22" rx="1" fill="#7ab9d8"/>
      <line x1="-12" y1="14" x2="12" y2="14" stroke="var(--tile-stroke)" strokeWidth="2"/>
      <line x1="0" y1="10" x2="0" y2="14" stroke="var(--tile-stroke)" strokeWidth="2"/>
    </g>
  ),
  // Heart (Mo)
  heart: () => (
    <g stroke="var(--tile-stroke)" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M 0 8 C -16 -2 -14 -16 -4 -14 C 0 -13 0 -10 0 -8 C 0 -10 0 -13 4 -14 C 14 -16 16 -2 0 8 Z" fill="#e87b5a"/>
    </g>
  ),
  // Chat bubble (Clink)
  bubble: () => (
    <g stroke="var(--tile-stroke)" strokeWidth="1.5" strokeLinejoin="round">
      <rect x="-22" y="-14" width="40" height="22" rx="6" fill="#a8d1e8"/>
      <polygon points="-8,8 -2,14 2,8" fill="#a8d1e8" stroke="var(--tile-stroke)" strokeWidth="1.5"/>
      <circle cx="-10" cy="-3" r="2" fill="var(--tile-stroke)"/>
      <circle cx="-2" cy="-3" r="2" fill="var(--tile-stroke)"/>
      <circle cx="6" cy="-3" r="2" fill="var(--tile-stroke)"/>
    </g>
  ),
  // Ballot (Vote IQ)
  ballot: () => (
    <g stroke="var(--tile-stroke)" strokeWidth="1.5" strokeLinejoin="round">
      <polygon points="-18,-4 -18,12 0,22 18,12 18,-4 0,-14" fill="#e8e3d3"/>
      <rect x="-3" y="-18" width="6" height="6" fill="#d96a4a" stroke="var(--tile-stroke)" strokeWidth="1.5"/>
      <path d="M -8 4 L -3 8 L 6 -2" stroke="var(--tile-stroke)" strokeWidth="2" fill="none"/>
    </g>
  ),
  // Sprout / Revee
  sprout: () => (
    <g stroke="var(--tile-stroke)" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M 0 14 L 0 -8" stroke="var(--tile-stroke)" strokeWidth="2"/>
      <path d="M 0 -2 Q -16 -2 -16 -16 Q -2 -14 0 -2" fill="#7ad0a5"/>
      <path d="M 0 -8 Q 14 -10 16 -22 Q 4 -22 0 -8" fill="#7ad0a5"/>
    </g>
  ),
  // Holacracy circles
  circles: () => (
    <g stroke="var(--tile-stroke)" strokeWidth="1.5" fill="none">
      <circle cx="0" cy="0" r="20" stroke="#3b6e8f" strokeWidth="2"/>
      <circle cx="-8" cy="-4" r="7" fill="#e87b5a"/>
      <circle cx="9" cy="2" r="6" fill="#7ad0a5"/>
      <circle cx="2" cy="10" r="5" fill="#ffd56a"/>
    </g>
  ),
  // Document stack (CMS / KYA)
  docs: () => (
    <g stroke="var(--tile-stroke)" strokeWidth="1.5" strokeLinejoin="round">
      <rect x="-16" y="-12" width="22" height="28" rx="2" fill="#fbf7ee"/>
      <rect x="-12" y="-16" width="22" height="28" rx="2" fill="#f6efde"/>
      <line x1="-8" y1="-10" x2="6" y2="-10" stroke="var(--tile-stroke)"/>
      <line x1="-8" y1="-5" x2="6" y2="-5" stroke="var(--tile-stroke)"/>
      <line x1="-8" y1="0" x2="2" y2="0" stroke="var(--tile-stroke)"/>
    </g>
  ),
  // Cottage (architecture hidden tile)
  cottage: () => (
    <g stroke="var(--tile-stroke)" strokeWidth="1.5" strokeLinejoin="round">
      <polygon points="-22,-2 0,8 22,-2 0,-12" fill="#f0e2c4"/>
      <polygon points="-22,-2 0,8 0,24 -22,14" fill="#d4c290"/>
      <polygon points="22,-2 0,8 0,24 22,14" fill="#a89060"/>
      <polygon points="-18,-12 0,-24 18,-12 0,-2" fill="#d96a4a"/>
      <polygon points="-18,-12 0,-2 0,4 -10,0" fill="#a04a30"/>
      <polygon points="18,-12 0,-2 0,4 10,0" fill="#7a3622"/>
      <rect x="-3" y="2" width="6" height="10" fill="#5c3820"/>
    </g>
  ),
  // Sign for hub
  sign: () => (
    <g stroke="var(--tile-stroke)" strokeWidth="1.5" strokeLinejoin="round">
      <rect x="-2" y="-32" width="4" height="32" fill="#8a6a44"/>
      <rect x="-26" y="-30" width="22" height="10" rx="2" fill="#fbf7ee"/>
      <rect x="4" y="-22" width="22" height="10" rx="2" fill="#fbf7ee"/>
    </g>
  ),
};

window.IsoCore = { TILE_W, HALF_W, HALF_H, TILE_THICKNESS, STEP_X, STEP_Y, gridToScreen, quadrant, BIOME_FILL, BIOME_SIDE, Glyphs };
