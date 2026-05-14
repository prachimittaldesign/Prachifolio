import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { PROJECTS } from '../data/projects.js';
import { gridToScreen, quadrant, SPACING } from '../data/iso.js';
import IsoTile from './IsoTile.jsx';
import RoadLayer from './RoadLayer.jsx';
import Hero from './Hero.jsx';
import AboutPanel from './AboutPanel.jsx';

export default function World({ onSelect }) {
  const stageRef = useRef(null);
  const tileRefs = useRef({});
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [docked, setDocked] = useState(false);
  const drag = useRef({ active: false, startX: 0, startY: 0, ox: 0, oy: 0, moved: false, tileId: null });

  useEffect(() => {
    const t = setTimeout(() => setDocked(true), 2400);
    return () => clearTimeout(t);
  }, []);

  const sorted = useMemo(
    () => [...PROJECTS].sort((a, b) => (b.gx + b.gy) - (a.gx + a.gy)),
    []
  );

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
        e.clientX - rect.left - rect.width / 2 - pan.x,
        e.clientY - rect.top - rect.height / 2 - pan.y
      );
    }
  }, [pan, updateSep]);

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

  return (
    <div
      ref={stageRef}
      className={`world-stage ${dragging ? 'dragging' : ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={() => { setHovered(null); resetSep(); }}
      onDoubleClick={() => setPan({ x: 0, y: 0 })}
    >
      <div className="cloud" style={{ top: '11%', animationDuration: '74s', animationDelay: '-8s' }}/>
      <div className="cloud" style={{ top: '22%', left: '-280px', opacity: 0.55, animationDuration: '98s', animationDelay: '-34s' }}/>
      <div className="cloud" style={{ top: '68%', opacity: 0.38, animationDuration: '118s', animationDelay: '-56s' }}/>

      <div
        className="camera"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
      >
        <RoadLayer/>

        {sorted.map(tile => {
          const { sx, sy } = gridToScreen(tile.gx, tile.gy, SPACING);
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
                zIndex: Math.round(-(tile.gx + tile.gy) * 10 + 500 + (isHovered ? 20 : 0)),
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
      </div>

      <div className="axis-label tl"><span>↑</span> Enterprise</div>
      <div className="axis-label bl">Consumer <span>↓</span></div>
      <div className="axis-label rt">Complex <span>→</span></div>
      <div className="axis-label lt"><span>←</span> Simple</div>

      <Hero docked={docked}/>
      <AboutPanel/>

      <div className="hint">
        <span className="hint-dot"/>
        Drag to pan · Double-click to recentre · Click a tile to explore
      </div>
    </div>
  );
}
