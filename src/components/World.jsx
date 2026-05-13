import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { PROJECTS } from '../data/projects.js';
import { gridToScreen, quadrant, SPACING, HALF_W, HALF_H } from '../data/iso.js';
import IsoTile from './IsoTile.jsx';
import Hero from './Hero.jsx';
import AboutPanel from './AboutPanel.jsx';

const GROUND_T = 72;

const ROAD_SEGMENTS = [
  { type: 'h', gy:  0, gx1: -7, gx2:  7 },
  { type: 'v', gx:  0, gy1: -6, gy2:  6 },
  { type: 'h', gy:  2, gx1: -4, gx2:  6 },
  { type: 'h', gy: -2, gx1: -4, gx2:  4 },
  { type: 'h', gy:  4, gx1: -4, gx2:  5 },
  { type: 'h', gy: -4, gx1: -2, gx2:  4 },
  { type: 'v', gx:  2, gy1: -1, gy2:  4 },
  { type: 'v', gx: -2, gy1: -4, gy2:  4 },
  { type: 'v', gx:  4, gy1: -4, gy2:  3 },
  { type: 'v', gx:  6, gy1:  0, gy2:  6 },
  { type: 'v', gx: -4, gy1: -2, gy2:  5 },
];

function GroundTile() {
  const W = HALF_W, H = HALF_H;
  const leftPts  = `${-W},0 0,${H} 0,${H+GROUND_T} ${-W},${GROUND_T}`;
  const rightPts = `${W},0 0,${H} 0,${H+GROUND_T} ${W},${GROUND_T}`;
  const topPts   = `0,${-H} ${W},0 0,${H} ${-W},0`;
  return (
    <svg
      width={W*2+4} height={H*2+GROUND_T+8}
      viewBox={`${-W-2} ${-H-4} ${W*2+4} ${H*2+GROUND_T+8}`}
      style={{ overflow: 'visible' }}
    >
      <polygon points={leftPts} fill="#b2a894" stroke="#1c1812" strokeWidth="1"/>
      <polygon points={rightPts} fill="#6a6050" stroke="#1c1812" strokeWidth="1"/>
      <polygon points={topPts} fill="#d8d2c4" stroke="#1a1610" strokeWidth="1.2"/>
      <line x1={0} y1={-H} x2={-W} y2={0} stroke="rgba(255,255,255,0.18)" strokeWidth="1.2"/>
      <line x1={0} y1={-H} x2={W}  y2={0} stroke="rgba(255,255,255,0.09)" strokeWidth="0.8"/>
    </svg>
  );
}

export default function World({ onSelect }) {
  const stageRef = useRef(null);
  const tileRefs = useRef({});
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [docked, setDocked] = useState(false);
  const drag = useRef({ active: false, startX: 0, startY: 0, ox: 0, oy: 0, moved: false, tileId: null });

  useEffect(() => {
    const t = setTimeout(() => setDocked(true), 2400);
    return () => clearTimeout(t);
  }, []);

  const allTiles = useMemo(() => {
    const projKeys = new Set(PROJECTS.map(t => `${t.gx},${t.gy}`));
    const tiles = [...PROJECTS.map(t => ({ ...t, isProject: true }))];
    const roadKeys = new Set();
    for (const seg of ROAD_SEGMENTS) {
      if (seg.type === 'h') {
        for (let gx = seg.gx1; gx <= seg.gx2; gx++) {
          const key = `${gx},${seg.gy}`;
          if (!projKeys.has(key) && !roadKeys.has(key)) {
            roadKeys.add(key);
            tiles.push({ id: `r${gx}_${seg.gy}`, gx, gy: seg.gy, isProject: false });
          }
        }
      } else {
        for (let gy = seg.gy1; gy <= seg.gy2; gy++) {
          const key = `${seg.gx},${gy}`;
          if (!projKeys.has(key) && !roadKeys.has(key)) {
            roadKeys.add(key);
            tiles.push({ id: `r${seg.gx}_${gy}`, gx: seg.gx, gy, isProject: false });
          }
        }
      }
    }
    return tiles.sort((a, b) => (b.gx + b.gy) - (a.gx + a.gy));
  }, []);

  const updateSep = useCallback((mx, my) => {
    PROJECTS.forEach(t => {
      const el = tileRefs.current[t.id];
      if (!el) return;
      const { sx, sy } = gridToScreen(t.gx, t.gy, SPACING);
      const dist = Math.hypot(t.gx, t.gy) || 1;
      const rx = (t.gx - t.gy) / Math.max(0.5, dist);
      const ry = -(t.gx + t.gy) / (2 * Math.max(0.5, dist));
      const d = Math.hypot(sx - mx, sy - my);
      const sep = 6 + Math.max(0, 1 - d / 300) * 34;
      el.style.setProperty('--ox', `${rx * sep}px`);
      el.style.setProperty('--oy', `${ry * sep}px`);
    });
  }, []);

  const resetSep = useCallback(() => {
    Object.values(tileRefs.current).forEach(el => {
      if (!el) return;
      el.style.setProperty('--ox', '0px');
      el.style.setProperty('--oy', '0px');
    });
  }, []);

  const onPointerDown = useCallback(e => {
    if (e.button !== 0 && e.pointerType !== 'touch') return;
    drag.current = { active: true, startX: e.clientX, startY: e.clientY, ox: pan.x, oy: pan.y, moved: false, tileId: hovered };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [pan, hovered]);

  const onPointerMove = useCallback(e => {
    const ds = drag.current;
    const stage = stageRef.current;
    if (!stage) return;
    if (ds.active) {
      const dx = e.clientX - ds.startX, dy = e.clientY - ds.startY;
      if (!ds.moved && Math.hypot(dx, dy) > 4) { ds.moved = true; setDragging(true); }
      if (ds.moved) setPan({ x: ds.ox + dx, y: ds.oy + dy });
    } else {
      const rect = stage.getBoundingClientRect();
      updateSep(
        (e.clientX - rect.left - rect.width / 2 - pan.x) / scale,
        (e.clientY - rect.top - rect.height / 2 - pan.y) / scale
      );
    }
  }, [pan, scale, updateSep]);

  const onPointerUp = useCallback(e => {
    const ds = drag.current;
    ds.active = false;
    if (ds.moved) {
      setDragging(false);
      setTimeout(() => { ds.moved = false; }, 0);
    } else if (ds.tileId) {
      const tile = PROJECTS.find(t => t.id === ds.tileId);
      if (tile) {
        const el = tileRefs.current[tile.id];
        if (el) onSelect(tile, el.getBoundingClientRect());
      }
    }
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) {}
  }, [onSelect]);

  // Scroll-to-zoom, anchored to cursor position (clamp 0.5–2×)
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const delta = e.deltaY < 0 ? 1.1 : 1 / 1.1;
      setScale(prevScale => {
        const next = Math.max(0.5, Math.min(2, prevScale * delta));
        const k = next / prevScale;
        setPan(prevPan => ({
          x: (1 - k) * (mx - cx) + k * prevPan.x,
          y: (1 - k) * (my - cy) + k * prevPan.y,
        }));
        return next;
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div
      ref={stageRef}
      className={`world-stage ${dragging ? 'dragging' : ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={() => { setHovered(null); resetSep(); }}
      onDoubleClick={() => { setPan({ x: 0, y: 0 }); setScale(1); }}
    >
      <div className="cloud" style={{ top: '11%', animationDuration: '74s', animationDelay: '-8s' }}/>
      <div className="cloud" style={{ top: '22%', left: '-280px', opacity: 0.55, animationDuration: '98s', animationDelay: '-34s' }}/>
      <div className="cloud" style={{ top: '68%', opacity: 0.38, animationDuration: '118s', animationDelay: '-56s' }}/>

      <div
        className="camera"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }}
      >
        {allTiles.map(tile => {
          const { sx, sy } = gridToScreen(tile.gx, tile.gy, SPACING);

          if (!tile.isProject) {
            return (
              <div
                key={tile.id}
                className="iso-tile ground-tile"
                style={{
                  '--sx': `${sx}px`,
                  '--sy': `${sy}px`,
                  '--lift': '0px',
                  zIndex: Math.round(-(tile.gx + tile.gy) * 10 + 490),
                  pointerEvents: 'none',
                }}
              >
                <GroundTile/>
              </div>
            );
          }

          const q = quadrant(tile.gx, tile.gy);
          const size = tile.scale || 1;
          const isHovered = hovered === tile.id;
          const lift = isHovered ? 44 : 0;
          return (
            <div
              key={tile.id}
              ref={el => { tileRefs.current[tile.id] = el; }}
              className={`iso-tile${isHovered ? ' is-hovered' : ''}`}
              style={{
                '--sx': `${sx}px`,
                '--sy': `${sy}px`,
                '--lift': `${lift}px`,
                zIndex: Math.round(-(tile.gx + tile.gy) * 10 + 520 + (isHovered ? 20 : 0)),
              }}
              onPointerEnter={() => { if (!drag.current.active) setHovered(tile.id); }}
              onPointerLeave={() => setHovered(null)}
            >
              <IsoTile biome={q} glyph={tile.glyph} size={size} hovered={isHovered}/>
              <div className="tile-label" style={{ fontSize: `${9 + size * 1.6}px` }}>
                {tile.label}
                <span className="tile-sub">{tile.sub}</span>
              </div>
            </div>
          );
        })}

        {/* START signpost at world origin */}
        <div className="start-marker">
          <svg width="72" height="92" viewBox="0 0 72 92">
            <rect x="33" y="38" width="6" height="54" fill="#8a7456" stroke="#3a2e1e" strokeWidth="1.2" rx="1"/>
            <rect x="33" y="38" width="2" height="54" fill="rgba(255,255,255,0.25)"/>
            <rect x="6" y="14" width="60" height="28" fill="#fdf9ee" stroke="#1b1b1b" strokeWidth="2" rx="3"/>
            <rect x="9" y="17" width="54" height="22" fill="none" stroke="#1b1b1b" strokeWidth="0.6" rx="1.5"/>
            <text x="36" y="33" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1b1b1b" fontFamily="JetBrains Mono, monospace" letterSpacing="0.1em">START</text>
            <path d="M 60 28 L 68 28 L 64 24 M 68 28 L 64 32" stroke="#1b1b1b" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <div className="axis-label tl"><span>↑</span> Enterprise</div>
      <div className="axis-label bl">Consumer <span>↓</span></div>
      <div className="axis-label rt">Complex <span>→</span></div>
      <div className="axis-label lt"><span>←</span> Simple</div>

      <Hero docked={docked}/>
      <AboutPanel/>

      <div className="hint">
        <span className="hint-dot"/>
        Drag to pan · Scroll to zoom · Double-click to recentre · Click a tile to explore
      </div>
    </div>
  );
}
