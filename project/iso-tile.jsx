/* global React, IsoCore */
const { TILE_W, HALF_W, HALF_H, TILE_THICKNESS, BIOME_FILL, BIOME_SIDE, Glyphs } = IsoCore;

function IsoTile({ kind, glyph, label, sub, isHub, fillOverride, sideOverride, flat, size = 1, axis }) {
  const fill = fillOverride || BIOME_FILL[kind] || "var(--paper)";
  const sideL = sideOverride || BIOME_SIDE[kind] || "#aaa";
  const sideR = sideL;
  const thickness = flat ? 0 : TILE_THICKNESS * size;

  const W = HALF_W * size;
  const H = HALF_H * size;

  const top = `0,${-H} ${W},0 0,${H} ${-W},0`;
  const left = `${-W},0 0,${H} 0,${H + thickness} ${-W},${thickness}`;
  const right = `${W},0 0,${H} 0,${H + thickness} ${W},${thickness}`;

  const Glyph = glyph && Glyphs[glyph];
  const isMainRoad = kind === "road";
  const isArtery = kind === "artery";

  return (
    <svg
      width={W * 2 + 4}
      height={H * 2 + thickness + 40}
      viewBox={`${-W - 2} ${-H - 38} ${W * 2 + 4} ${H * 2 + thickness + 40}`}
    >
      {!flat && (
        <>
          <polygon points={left} fill={sideL} stroke="var(--tile-stroke)" strokeWidth="1.5" strokeLinejoin="round"/>
          <polygon points={right} fill={sideR} stroke="var(--tile-stroke)" strokeWidth="1.5" strokeLinejoin="round" style={{ filter: "brightness(0.86)" }}/>
        </>
      )}
      <polygon points={top} fill={fill} stroke="var(--tile-stroke)" strokeWidth="1.5" strokeLinejoin="round"/>

      {/* Main road: thick double lane stripes */}
      {isMainRoad && (
        <g stroke="var(--ink-soft)" opacity="0.55">
          {axis === "x" ? (
            <>
              <line x1={-W * 0.85} y1={H * 0.18} x2={W * 0.85} y2={-H * 0.18} strokeWidth="1.5" strokeDasharray="0"/>
              <line x1={-W * 0.85} y1={-H * 0.18} x2={W * 0.85} y2={H * 0.18} strokeWidth="1.5" strokeDasharray="0"/>
              <line x1={-W * 0.7} y1="0" x2={W * 0.7} y2="0" strokeWidth="1.5" strokeDasharray="6 6"/>
            </>
          ) : (
            <>
              <line x1={-W * 0.18} y1={-H * 0.85} x2={W * 0.18} y2={H * 0.85} strokeWidth="1.5"/>
              <line x1={W * 0.18} y1={-H * 0.85} x2={-W * 0.18} y2={H * 0.85} strokeWidth="1.5"/>
              <line x1="0" y1={-H * 0.7} x2="0" y2={H * 0.7} strokeWidth="1.5" strokeDasharray="6 6"/>
            </>
          )}
        </g>
      )}

      {/* Artery: single dashed thin line */}
      {isArtery && (
        <g stroke="var(--ink-soft)" strokeWidth="1.2" strokeDasharray="4 5" opacity="0.4">
          {axis === "x" ? (
            <line x1={-W * 0.6} y1="0" x2={W * 0.6} y2="0"/>
          ) : axis === "y" ? (
            <line x1="0" y1={-H * 0.6} x2="0" y2={H * 0.6}/>
          ) : axis === "ne" ? (
            <line x1={-W * 0.6} y1={H * 0.3} x2={W * 0.6} y2={-H * 0.3}/>
          ) : (
            <line x1={-W * 0.6} y1={-H * 0.3} x2={W * 0.6} y2={H * 0.3}/>
          )}
        </g>
      )}

      {Glyph && <g transform={`scale(${Math.min(1.4, 0.7 + size * 0.4)})`}><Glyph/></g>}

      {isHub && (
        <g fontFamily="JetBrains Mono, monospace" fontSize="6" fontWeight="700" fill="var(--ink)">
          <text x="-15" y="-25" textAnchor="middle" letterSpacing="0.5">START</text>
        </g>
      )}
    </svg>
  );
}

window.IsoTile = IsoTile;
