import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { quadrant, BIOME } from '../data/iso.js';

export default function ProjectOverlay({ tile, tileRect, onClose }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setTimeout(onClose, 650);
  };

  const q = quadrant(tile.gx, tile.gy);
  const { fill: accent, label: qLabel } = BIOME[q] || {};

  const overlayStyle = open
    ? { top: 0, left: 0, width: '100%', height: '100%', borderRadius: 0 }
    : {
        top: tileRect.top,
        left: tileRect.left,
        width: Math.max(tileRect.width, 80),
        height: Math.max(tileRect.height, 60),
        borderRadius: 14,
      };

  return createPortal(
    <>
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 45,
          background: open ? 'rgba(251,247,238,0.55)' : 'rgba(251,247,238,0)',
          backdropFilter: open ? 'blur(4px)' : 'none',
          transition: 'background 550ms, backdrop-filter 550ms',
          pointerEvents: open ? 'auto' : 'none',
        }}
        onClick={handleClose}
      />

      <div className="proj-overlay" style={overlayStyle}>
        <div className={`proj-accent-bar ${open ? 'visible' : ''}`} style={{ background: accent }}/>

        <div className={`proj-content ${open ? 'visible' : ''}`}>
          <div className="proj-eyebrow">{qLabel} · {tile.sub}</div>
          <div className="proj-title">{tile.label}</div>

          <div className="proj-divider"/>

          <div className="proj-body">
            <div>
              <div className="proj-desc">{tile.desc}</div>
            </div>
            <div className="proj-meta">
              <div className="proj-meta-row">
                <label>Disciplines</label>
                <div className="proj-tags">
                  {(tile.tags || []).map(t => (
                    <span key={t} className="proj-tag">{t}</span>
                  ))}
                </div>
              </div>
              <div className="proj-meta-row">
                <label>Quadrant</label>
                <div style={{ fontSize: 14, color: '#2a2622', lineHeight: 1.5 }}>{qLabel}</div>
              </div>
            </div>
          </div>

          <div className="proj-images single">
            <div className="proj-placeholder wide">↗&nbsp;&nbsp;Project screenshots</div>
          </div>
          <div className="proj-images" style={{ marginTop: 14 }}>
            <div className="proj-placeholder square">↗&nbsp; Flows</div>
            <div className="proj-placeholder square">↗&nbsp; Prototype</div>
          </div>
        </div>
      </div>

      <button className={`proj-close ${open ? 'visible' : ''}`} onClick={handleClose}>×</button>
    </>,
    document.body
  );
}
