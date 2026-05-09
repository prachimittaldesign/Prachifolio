import { HALF_W, HALF_H, BIOME } from '../data/iso.js';
import { Glyphs } from './Glyphs.jsx';

export default function IsoTile({ biome, glyph, size = 1 }) {
  const W = HALF_W * size;
  const H = HALF_H * size;
  const { fill } = BIOME[biome] || { fill: '#fbf7ee' };
  const top = `0,${-H} ${W},0 0,${H} ${-W},0`;
  const Glyph = glyph && Glyphs[glyph];
  return (
    <svg
      width={W * 2 + 4}
      height={H * 2 + 40}
      viewBox={`${-W - 2} ${-H - 38} ${W * 2 + 4} ${H * 2 + 40}`}
    >
      <polygon points={top} fill={fill} stroke="#2a2622" strokeWidth="1.5" strokeLinejoin="round"/>
      {Glyph && (
        <g transform={`scale(${Math.min(1.3, 0.55 + size * 0.4)})`}>
          <Glyph/>
        </g>
      )}
    </svg>
  );
}
