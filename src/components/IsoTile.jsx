import { HALF_W, HALF_H, BIOME } from '../data/iso.js';
import { Glyphs } from './Glyphs.jsx';

const THICKNESS = 72;

// Lighten a hex color by mixing with white
function lighten(hex, amt) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lr = Math.round(r + (255 - r) * amt);
  const lg = Math.round(g + (255 - g) * amt);
  const lb = Math.round(b + (255 - b) * amt);
  return `rgb(${lr},${lg},${lb})`;
}

function TerrainTexture({ biome, W, H }) {
  if (biome === 'q1') {
    return (
      <g opacity="0.2" stroke="#1a3a52" strokeWidth="0.9">
        <line x1={-W * 0.5} y1={-H * 0.08} x2={W * 0.5} y2={-H * 0.08}/>
        <line x1={-W * 0.3} y1={H * 0.32}  x2={W * 0.3} y2={H * 0.32}/>
        <line x1={0}        y1={-H * 0.65} x2={0}       y2={H * 0.65}/>
        <line x1={-W * 0.4} y1={-H * 0.38} x2={W * 0.4} y2={H * 0.38}/>
      </g>
    );
  }
  if (biome === 'q2') {
    return (
      <g opacity="0.22">
        <ellipse cx={-28} cy={-14} rx={18} ry={10} fill="#2a6a22"/>
        <ellipse cx={22}  cy={6}   rx={22} ry={12} fill="#2a6a22"/>
        <ellipse cx={-8}  cy={20}  rx={12} ry={7}  fill="#1e5418"/>
      </g>
    );
  }
  if (biome === 'q3') {
    return (
      <g opacity="0.2" fill="#3a7a30">
        {[[-38,-10],[22,-20],[2,16],[-18,22],[36,2]].map(([cx,cy],i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={9} ry={6}/>
        ))}
      </g>
    );
  }
  if (biome === 'q4') {
    return (
      <g opacity="0.18" stroke="#7a5a20" strokeWidth="1.1" fill="none">
        <path d={`M${-W*.5},${-H*.08} q${W*.5},${-H*.22} ${W*.5},${-H*.08}`}/>
        <path d={`M${-W*.4},${H*.22}  q${W*.4},${-H*.18} ${W*.4},${H*.22}`}/>
        <path d={`M${-W*.3},${H*.48} q${W*.3},${-H*.14} ${W*.3},${H*.48}`}/>
      </g>
    );
  }
  return null;
}

function StrataLines({ face, W, H, T, count = 5 }) {
  const lines = [];
  for (let i = 1; i <= count; i++) {
    const f = i / (count + 1);
    const y = f * T;
    const op = 0.07 + (i % 2) * 0.07;
    if (face === 'left') {
      lines.push(<line key={i}
        x1={-W} y1={y} x2={0} y2={H + y}
        stroke={`rgba(0,0,0,${op})`} strokeWidth={i % 2 === 0 ? 1.3 : 0.7}
      />);
    } else {
      lines.push(<line key={i}
        x1={0} y1={H + y} x2={W} y2={y}
        stroke={`rgba(0,0,0,${op + 0.04})`} strokeWidth={i % 2 === 0 ? 1.3 : 0.7}
      />);
    }
  }
  return <>{lines}</>;
}

export default function IsoTile({ biome, glyph, size = 1, hovered = false }) {
  const W = HALF_W * size;
  const H = HALF_H * size;
  const T = THICKNESS * size;

  const { fill } = BIOME[biome] || { fill: '#e8e2d4' };

  const leftPts  = `${-W},0 0,${H} 0,${H+T} ${-W},${T}`;
  const rightPts = `${W},0 0,${H} 0,${H+T} ${W},${T}`;
  const topPts   = `0,${-H} ${W},0 0,${H} ${-W},0`;

  const leftFill  = '#b8ae9c';
  const rightFill = '#6e6456';

  const Glyph = glyph && Glyphs[glyph];

  return (
    <svg
      width={W * 2 + 4}
      height={H * 2 + T + 52}
      viewBox={`${-W - 2} ${-H - 44} ${W * 2 + 4} ${H * 2 + T + 52}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="lg-left" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.28"/>
          <stop offset="100%" stopColor="black" stopOpacity="0.18"/>
        </linearGradient>
        <linearGradient id="lg-right" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="black" stopOpacity="0.05"/>
          <stop offset="100%" stopColor="black" stopOpacity="0.32"/>
        </linearGradient>
        <linearGradient id="lg-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.45"/>
          <stop offset="60%" stopColor="white" stopOpacity="0.0"/>
        </linearGradient>
      </defs>

      {/* Ground shadow ellipse */}
      <ellipse
        cx={0} cy={H + T + 4}
        rx={W * 0.88} ry={(H + T) * 0.22}
        fill="rgba(30,24,18,0.18)"
      />

      {/* LEFT FACE (lit side) */}
      <polygon points={leftPts}
               fill={leftFill}
               stroke="#1e1a14" strokeWidth="1.5" strokeLinejoin="round"/>
      <polygon points={leftPts} fill="url(#lg-left)" opacity="0.45"/>
      <line x1={-W} y1={0} x2={0} y2={H}
            stroke="rgba(255,255,255,0.22)" strokeWidth="1.8"/>
      <StrataLines face="left" W={W} H={H} T={T}/>

      {/* RIGHT FACE (shadow side) */}
      <polygon points={rightPts}
               fill={rightFill}
               stroke="#1e1a14" strokeWidth="1.5" strokeLinejoin="round"/>
      <polygon points={rightPts} fill="url(#lg-right)" opacity="0.35"/>
      <StrataLines face="right" W={W} H={H} T={T}/>

      {/* TOP FACE */}
      <polygon points={topPts}
               fill={fill}
               stroke="#1a1610" strokeWidth="2" strokeLinejoin="round"/>
      <polygon points={topPts} fill="url(#lg-top)" opacity="0.28"/>

      <TerrainTexture biome={biome} W={W} H={H}/>

      {hovered && (
        <>
          <polygon points={topPts}
                   fill="rgba(255,255,255,0.18)"
                   stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinejoin="round"/>
          <line x1={-W} y1={0} x2={0} y2={H}
                stroke="rgba(255,255,255,0.45)" strokeWidth="2.5"/>
          <line x1={0} y1={-H} x2={-W} y2={0}
                stroke="rgba(255,255,255,0.45)" strokeWidth="2"/>
        </>
      )}

      {/* Ridge highlight lines on top face edges */}
      <line x1={0} y1={-H} x2={-W} y2={0}
            stroke="rgba(255,255,255,0.32)" strokeWidth="1.8"/>
      <line x1={0} y1={-H} x2={W}  y2={0}
            stroke="rgba(255,255,255,0.16)" strokeWidth="1.2"/>
      <line x1={-W} y1={T} x2={0} y2={H+T}
            stroke="rgba(255,255,255,0.10)" strokeWidth="1"/>

      {Glyph && (
        <g transform={`scale(${Math.min(1.35, 0.55 + size * 0.4)})`}>
          <Glyph/>
        </g>
      )}
    </svg>
  );
}
