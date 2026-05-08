/* global React, IsoCore, IsoTile, PROJECTS, ROAD_TILES, FILLER */
const { useState, useEffect, useRef, useMemo, useCallback } = React;
const { TILE_W, HALF_W, HALF_H, gridToScreen } = IsoCore;

function buildTiles() {
  const out = [];
  out.push({ id: "hub", gx: 0, gy: 0, kind: "hub", isHub: true, glyph: "sign", size: 1 });
  ROAD_TILES.forEach(t => out.push({ ...t, id: `road-${t.gx}-${t.gy}`, size: 1 }));
  PROJECTS.forEach(p => out.push({ ...p, kind: undefined }));
  FILLER.forEach((f, i) => out.push({ ...f, id: `filler-${i}`, size: 0.8 }));
  return out;
}

function tileKindFor(t) {
  if (t.kind) return t.kind;
  if (t.gx === 0 && t.gy === 0) return "hub";
  if (t.gx === 0 || t.gy === 0) return "road";
  if (t.gx > 0 && t.gy > 0) return "q1";
  if (t.gx < 0 && t.gy > 0) return "q2";
  if (t.gx < 0 && t.gy < 0) return "q3";
  return "q4";
}

function IsometricWorld({ variant = "bright", onSelect, selectedId, spacing = 1.45, flat = true, hoverPush = 22 }) {
  const stageRef = useRef(null);
  const cameraRef = useRef(null);
  const tileRefs = useRef({});
  const tiles = useMemo(() => buildTiles(), []);
  const [hovered, setHovered] = useState(null);

  // Pan state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragState = useRef({ active: false, startX: 0, startY: 0, originX: 0, originY: 0, moved: false });
  const [dragging, setDragging] = useState(false);

  // Painter's algorithm: tiles further back drawn first
  const sortedTiles = useMemo(() => {
    return [...tiles].sort((a, b) => (b.gx + b.gy) - (a.gx + a.gy));
  }, [tiles]);

  const updateSeparations = useCallback((mx, my) => {
    sortedTiles.forEach(t => {
      const el = tileRefs.current[t.id];
      if (!el) return;
      const { sx, sy } = gridToScreen(t.gx, t.gy, spacing);
      const distFromOrigin = Math.hypot(t.gx, t.gy) || 1;
      const radX = (t.gx - t.gy) / Math.max(0.5, distFromOrigin);
      const radY = -(t.gx + t.gy) / (2 * Math.max(0.5, distFromOrigin));
      const dx = sx - mx;
      const dy = sy - my;
      const d = Math.hypot(dx, dy);
      const falloff = Math.max(0, 1 - d / 320);
      const sep = 4 + falloff * hoverPush;
      el.style.setProperty("--ox", `${radX * sep}px`);
      el.style.setProperty("--oy", `${radY * sep}px`);
    });
  }, [sortedTiles, spacing, hoverPush]);

  // Pointer handlers — combined drag + hover separation
  const onPointerDown = useCallback((e) => {
    if (e.button !== 0 && e.pointerType !== "touch") return;
    dragState.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      originX: pan.x,
      originY: pan.y,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [pan]);

  const onPointerMove = useCallback((e) => {
    const stage = stageRef.current;
    if (!stage) return;
    const ds = dragState.current;
    if (ds.active) {
      const dx = e.clientX - ds.startX;
      const dy = e.clientY - ds.startY;
      if (!ds.moved && Math.hypot(dx, dy) > 4) {
        ds.moved = true;
        setDragging(true);
      }
      if (ds.moved) {
        setPan({ x: ds.originX + dx, y: ds.originY + dy });
      }
    } else {
      // Hover-driven jigsaw push
      const rect = stage.getBoundingClientRect();
      const cx = rect.width / 2 + pan.x;
      const cy = rect.height / 2 + pan.y;
      const mx = e.clientX - rect.left - cx;
      const my = e.clientY - rect.top - cy;
      updateSeparations(mx, my);
    }
  }, [pan, updateSeparations]);

  const onPointerUp = useCallback((e) => {
    const ds = dragState.current;
    ds.active = false;
    if (ds.moved) {
      setDragging(false);
      // swallow the click
      setTimeout(() => { ds.moved = false; }, 0);
    }
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) {}
  }, []);

  const onPointerLeave = useCallback(() => {
    setHovered(null);
    Object.values(tileRefs.current).forEach(el => {
      if (!el) return;
      el.style.setProperty("--ox", "0px");
      el.style.setProperty("--oy", "0px");
    });
  }, []);

  // Reset pan on double-click
  const onDoubleClick = useCallback(() => {
    setPan({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={stageRef}
      className={`world-stage ${variant === "blueprint" ? "blueprint" : ""} ${dragging ? "dragging" : ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={onPointerLeave}
      onDoubleClick={onDoubleClick}
    >
      <div className="clouds">
        <div className="cloud" style={{ top: "12%", animationDelay: "-10s", animationDuration: "70s" }}/>
        <div className="cloud" style={{ top: "22%", left: "-300px", animationDelay: "-30s", animationDuration: "90s", opacity: 0.6 }}/>
        <div className="cloud" style={{ top: "65%", animationDelay: "-50s", animationDuration: "110s", opacity: 0.4 }}/>
      </div>

      <div
        ref={cameraRef}
        className="camera"
        style={{ transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px)` }}
      >
        {sortedTiles.map(t => {
          const kind = tileKindFor(t);
          const { sx, sy } = gridToScreen(t.gx, t.gy, spacing);
          const isProject = !!t.label && t.id !== "hub";
          const lift = hovered === t.id ? 26 : 0;
          const size = t.scale || t.size || 1;
          return (
            <div
              key={t.id}
              ref={el => (tileRefs.current[t.id] = el)}
              className={`tile ${t.id === "hub" ? "hub" : ""}`}
              style={{
                "--sx": `${sx}px`,
                "--sy": `${sy}px`,
                "--lift": `${lift}px`,
                zIndex: Math.round(-(t.gx + t.gy) * 10 + 500 + (isProject ? 1 : 0)),
              }}
              onPointerEnter={() => isProject && !dragState.current.active && setHovered(t.id)}
              onPointerLeave={() => setHovered(null)}
              onClick={(e) => {
                if (dragState.current.moved) { e.stopPropagation(); return; }
                if (isProject && onSelect) onSelect(t);
              }}
            >
              <div className="shadow" style={{ opacity: hovered === t.id ? 0.5 : 0.3, transform: `translate(-50%, -50%) translateY(20px) scale(${0.85 * size})` }}/>
              <IsoTile
                kind={kind}
                glyph={t.glyph}
                label={t.label}
                sub={t.sub}
                isHub={t.isHub}
                flat={flat}
                size={size}
                axis={t.axis}
              />
              {isProject && (
                <div className="tile-label" style={{ fontSize: `${10 + size * 2}px` }}>
                  {t.label}
                  <span className="tile-sub">{t.sub}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="axis-label tl"><span className="arrow">↑</span> Enterprise</div>
      <div className="axis-label bl">Consumer <span className="arrow">↓</span></div>
      <div className="axis-label rt">Complex <span className="arrow">→</span></div>
      <div className="axis-label lt"><span className="arrow">←</span> Simple</div>

      <div className="hint">
        <span className="dot"/>
        Drag to pan · Double-click to recenter · Click a tile
      </div>
    </div>
  );
}

window.IsometricWorld = IsometricWorld;
