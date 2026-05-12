import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { quadrant, BIOME } from '../data/iso.js';

const BIOME_BG = {
  q1: 'linear-gradient(135deg, #deeaf0 0%, #eef6f8 100%)',
  q2: 'linear-gradient(135deg, #d4e8d0 0%, #edf5ea 100%)',
  q3: 'linear-gradient(135deg, #e2efd6 0%, #f2f8eb 100%)',
  q4: 'linear-gradient(135deg, #f0e2c8 0%, #f8f1e4 100%)',
};

function BackButton({ onClick }) {
  return (
    <button className="cs-back" onClick={onClick} aria-label="Back to world">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span>Back to world</span>
    </button>
  );
}

function MetaChip({ label, value }) {
  return (
    <div className="cs-meta-chip">
      <span className="cs-meta-label">{label}</span>
      <span className="cs-meta-value">{value}</span>
    </div>
  );
}

function Section({ heading, body, index }) {
  return (
    <div className="cs-section" style={{ animationDelay: `${400 + index * 80}ms` }}>
      <div className="cs-section-number">0{index + 1}</div>
      <div className="cs-section-content">
        <h3 className="cs-section-heading">{heading}</h3>
        <p className="cs-section-body">{body}</p>
      </div>
    </div>
  );
}

function PlaceholderImage({ aspect, label }) {
  return (
    <div className="cs-img-placeholder" style={{ aspectRatio: aspect }}>
      <div className="cs-img-inner">
        <div className="cs-img-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="cs-img-label">{label}</span>
      </div>
    </div>
  );
}

export default function ProjectOverlay({ tile, tileRect, onClose }) {
  const [phase, setPhase] = useState('closed'); // closed → expanding → open → closing
  const scrollRef = useRef(null);

  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setPhase('expanding'))
    );
    const id2 = setTimeout(() => setPhase('open'), 660);
    return () => { cancelAnimationFrame(id); clearTimeout(id2); };
  }, []);

  const handleClose = () => {
    setPhase('closing');
    setTimeout(onClose, 680);
  };

  // Escape key to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const q = quadrant(tile.gx, tile.gy);
  const { fill: accent, label: qLabel } = BIOME[q] || {};
  const biomeBg = BIOME_BG[q] || BIOME_BG.q1;
  const isOpen = phase === 'open';
  const isClosing = phase === 'closing';

  const overlayStyle = (phase === 'closed' || isClosing)
    ? {
        top: tileRect.top,
        left: tileRect.left,
        width: Math.max(tileRect.width, 80),
        height: Math.max(tileRect.height, 60),
        borderRadius: 18,
      }
    : { top: 0, left: 0, width: '100%', height: '100%', borderRadius: 0 };

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`cs-backdrop ${isOpen ? 'open' : ''} ${isClosing ? 'closing' : ''}`}
        onClick={handleClose}
      />

      {/* Expanding panel */}
      <div
        className={`cs-panel ${isOpen ? 'open' : ''} ${isClosing ? 'closing' : ''}`}
        style={{ ...overlayStyle, background: biomeBg }}
      >
        {/* Accent top bar */}
        <div
          className={`cs-accent-bar ${isOpen ? 'visible' : ''}`}
          style={{ background: accent }}
        />

        {/* Back button — always visible once open */}
        <div className={`cs-back-wrap ${isOpen ? 'visible' : ''}`}>
          <BackButton onClick={handleClose}/>
        </div>

        {/* Scrollable case study content */}
        <div
          ref={scrollRef}
          className={`cs-scroll ${isOpen ? 'visible' : ''}`}
        >
          <div className="cs-inner">

            {/* Eyebrow */}
            <div className="cs-eyebrow">
              <span className="cs-eyebrow-quad">{qLabel}</span>
              <span className="cs-eyebrow-dot">·</span>
              <span className="cs-eyebrow-sub">{tile.sub}</span>
            </div>

            {/* Title */}
            <h1 className="cs-title">{tile.label}</h1>

            {/* Meta strip */}
            <div className="cs-meta-strip">
              <MetaChip label="Role" value={tile.role || 'Product Designer'}/>
              <MetaChip label="Year" value={tile.year || '—'}/>
              <MetaChip label="Duration" value={tile.duration || '—'}/>
              <MetaChip label="Team" value={tile.team || 'Solo'}/>
            </div>

            {/* Tags */}
            <div className="cs-tags">
              {(tile.tags || []).map(t => (
                <span key={t} className="cs-tag">{t}</span>
              ))}
            </div>

            <div className="cs-divider"/>

            {/* Overview */}
            <div className="cs-overview-block">
              <div className="cs-block-label">Overview</div>
              <p className="cs-overview-text">{tile.overview || tile.desc}</p>
            </div>

            {/* Hero image placeholder */}
            <div className="cs-hero-img">
              <PlaceholderImage aspect="16/7" label="Hero visual — key screens or artefact"/>
            </div>

            {/* Two-column: Challenge + Process */}
            <div className="cs-two-col">
              <div>
                <div className="cs-block-label">Challenge</div>
                <p className="cs-body-text">{tile.challenge || '—'}</p>
              </div>
              <div>
                <div className="cs-block-label">Process</div>
                <p className="cs-body-text">{tile.process || '—'}</p>
              </div>
            </div>

            <div className="cs-divider"/>

            {/* Sections */}
            {(tile.sections || []).length > 0 && (
              <>
                <div className="cs-block-label" style={{ marginBottom: 32 }}>Deep Dive</div>
                <div className="cs-sections-grid">
                  {tile.sections.map((s, i) => (
                    <Section key={s.heading} heading={s.heading} body={s.body} index={i}/>
                  ))}
                </div>
              </>
            )}

            {/* Image grid */}
            <div className="cs-divider"/>
            <div className="cs-block-label" style={{ marginBottom: 20 }}>Artefacts</div>
            <div className="cs-img-grid">
              <PlaceholderImage aspect="4/3" label="Wireframes"/>
              <PlaceholderImage aspect="4/3" label="High-fidelity screens"/>
              <PlaceholderImage aspect="4/3" label="Prototype flows"/>
              <PlaceholderImage aspect="4/3" label="Handoff documentation"/>
            </div>

            {/* Outcome */}
            <div className="cs-outcome-block">
              <div className="cs-block-label">Outcome</div>
              <p className="cs-outcome-text">{tile.outcome || '—'}</p>
            </div>

            {/* Footer back button */}
            <div className="cs-footer">
              <button className="cs-footer-back" onClick={handleClose}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to world map
              </button>
            </div>

          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
