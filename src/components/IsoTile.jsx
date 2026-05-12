import { HALF_W, HALF_H, BIOME, BIOME_BLUEPRINT } from '../data/iso.js';
import { Glyphs } from './Glyphs.jsx';

const THICKNESS = 42; // stone side depth

function StrataLines({ face, W, H, T, count = 4 }) {
  const lines = [];
  for (let i = 1; i <= count; i++) {
    const f = i / (count + 1);
    const y = f * T;
    const opacity = 0.08 + (i % 2) * 0.06;
    if (face === 'left') {
      lines.push(
        <line key={i}
          x1={-W} y1={y}
          x2={0}  y2={H + y}
          stroke={`rgba(0,0,0,${opacity})`} strokeWidth={i % 2 === 0 ? 1.2 : 0.7}
        />
      );
    } else {
      lines.push(
        <line key={i}
          x1={0} y1={H + y}
          x2={W} y2={y}
          stroke={`rgba(0,0,0,${opacity + 0.04})`} strokeWidth={i % 2 === 0 ? 1.2 : 0.7}
        />
      );
    }
  }
  return <>{lines}</>;
}

function Fissure({ face, W, H, T }) {
  if (face === 'left') {
    const mx = -W * 0.55, my = T * 0.15;
    const ex = -W * 0.35, ey = H * 0.55 + T * 0.35;
    return (
      <path
        d={`M${mx},${my} q${(ex - mx) * 0.4},${(ey - my) * 0.3} ${ex},${ey}`}
        fill="none" stroke="rgba(0,0,0,0.09)" strokeWidth="1.4" strokeLinecap="round"
      />
    );
  }
  const mx = W * 0.5, my = T * 0.18;
  const ex = W * 0.28, ey = H * 0.6 + T * 0.38;
  return (
    <path
      d={`M${mx},${my} q${(ex - mx) * 0.4},${(ey - my) * 0.3} ${ex},${ey}`}
      fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1.4" strokeLinecap="round"
    />
  );
}

function TerrainTexture({ biome, W, H }) {
  if (biome === 'q1') {
    return (
      <g opacity="0.18" stroke="#0d2030" strokeWidth="0.8">
        <line x1={-W * 0.5} y1={-H * 0.1} x2={W * 0.5} y2={-H * 0.1}/>
        <line x1={-W * 0.3} y1={H * 0.3}  x2={W * 0.3} y2={H * 0.3}/>
        <line x1={0} y1={-H * 0.6} x2={0} y2={H * 0.6}/>
        <line x1={-W * 0.4} y1={-H * 0.35} x2={W * 0.4} y2={H * 0.35}/>
      </g>
    );
  }
  if (biome === 'q2') {
    return (
      <g opacity="0.2">
        <ellipse cx={-30} cy={-12} rx={16} ry={9} fill="#3a7a32"/>
        <ellipse cx={20}  cy={8}   rx={20} ry={11} fill="#3a7a32"/>
        <ellipse cx={-10} cy={18}  rx={10} ry={6}  fill="#2e6428"/>
      </g>
    );
  }
  if (biome === 'q3') {
    return (
      <g opacity="0.18" fill="#4a8a40">
        {[[-40,-8],[20,-18],[0,14],[-20,20],[35,4]].map(([cx,cy],i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={8} ry={5}/>
        ))}
      </g>
    );
  }
  if (biome === 'q4') {
    return (
      <g opacity="0.15" stroke="#8a6a30" strokeWidth="1" fill="none">
        <path d={`M${-W*0.5},${-H*0.1} q${W*0.5},${-H*0.2} ${W*0.5},${-H*0.1}`}/>
        <path d={`M${-W*0.4},${H*0.2}  q${W*0.4},${-H*0.15} ${W*0.4},${H*0.2}`}/>
        <path d={`M${-W*0.3},${H*0.45} q${W*0.3},${-H*0.12} ${W*0.3},${H*0.45}`}/>
      </g>
    );
  }
  return null;
}

export default function IsoTile({ biome, glyph, size = 1, hovered = false, variant = 'bright' }) {
  const W = HALF_W * size;
  const H = HALF_H * size;
  const T = THICKNESS * size;

  const isBlueprint = variant === 'blueprint';
  const palette = isBlueprint ? BIOME_BLUEPRINT : BIOME;
  const { fill } = palette[biome] || { fill: isBlueprint ? '#c2d8e4' : '#fbf7ee' };

  // Stone side colours shift to cool blue-grey in blueprint mode
  const stoneL = isBlueprint ? '#8aaabb' : '#9e9688';
  const stoneR = isBlueprint ? '#6a8a9a' : '#766e60';
  const strokeCol = isBlueprint ? '#0d2030' : '#2e2a24';
  const topStroke = isBlueprint ? '#0d2030' : '#2a2622';

  const leftPts  = `${-W},0 0,${H} 0,${H+T} ${-W},${T}`;
  const rightPts = `${W},0 0,${H} 0,${H+T} ${W},${T}`;
  const topPts   = `0,${-H} ${W},0 0,${H} ${-W},0`;

  const Glyph = glyph && Glyphs[glyph];

  return (
    <svg
      width={W * 2 + 4}
      height={H * 2 + T + 44}
      viewBox={`${-W - 2} ${-H - 38} ${W * 2 + 4} ${H * 2 + T + 44}`}
      style={{ overflow: 'visible' }}
    >
      {/* Left stone face */}
      <polygon points={leftPts}
               fill={stoneL}
               stroke={strokeCol} strokeWidth="1.2" strokeLinejoin="round"/>
      <line x1={-W} y1={0} x2={0} y2={H}
            stroke="rgba(255,255,255,0.14)" strokeWidth="1.5"/>
      <StrataLines face="left" W={W} H={H} T={T}/>
      {!isBlueprint && <Fissure face="left" W={W} H={H} T={T}/>}

      {/* Right stone face (darker) */}
      <polygon points={rightPts}
               fill={stoneR}
               stroke={strokeCol} strokeWidth="1.2" strokeLinejoin="round"/>
      <StrataLines face="right" W={W} H={H} T={T}/>
      {!isBlueprint && <Fissure face="right" W={W} H={H} T={T}/>}

      {/* Top face */}
      <polygon points={topPts}
               fill={fill}
               stroke={topStroke} strokeWidth="1.5" strokeLinejoin="round"/>

      <TerrainTexture biome={biome} W={W} H={H}/>

      {hovered && (
        <polygon points={topPts}
                 fill="rgba(255,255,255,0.12)"
                 stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" strokeLinejoin="round"/>
      )}

      {Glyph && (
        <g transform={`scale(${Math.min(1.3, 0.55 + size * 0.4)})`}>
          <Glyph/>
        </g>
      )}
    </svg>
  );
}
