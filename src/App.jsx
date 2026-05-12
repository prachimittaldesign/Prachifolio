import { useState } from 'react';
import World from './components/World.jsx';
import ProjectOverlay from './components/ProjectOverlay.jsx';

function VariantToggle({ variant, onChange }) {
  const isBlueprint = variant === 'blueprint';
  return (
    <button
      onClick={() => onChange(isBlueprint ? 'bright' : 'blueprint')}
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 100,
        padding: '8px 16px',
        border: `1px solid ${isBlueprint ? 'rgba(13,32,48,0.2)' : 'rgba(0,0,0,0.13)'}`,
        borderRadius: 999,
        background: isBlueprint ? 'rgba(238,246,248,0.88)' : 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        cursor: 'pointer',
        fontSize: 11,
        fontWeight: 600,
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: isBlueprint ? '#0d2030' : '#1b1b1b',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'background 300ms, color 300ms, border-color 300ms, box-shadow 180ms, transform 180ms',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.14)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
    >
      {isBlueprint ? '← Bright' : 'Blueprint →'}
    </button>
  );
}

export default function App() {
  const [overlay, setOverlay] = useState(null);
  const [variant, setVariant] = useState('bright');

  return (
    <div style={{ height: '100%' }}>
      <World
        variant={variant}
        onSelect={(tile, rect) => setOverlay({ tile, rect })}
      />
      {overlay && (
        <ProjectOverlay
          tile={overlay.tile}
          tileRect={overlay.rect}
          onClose={() => setOverlay(null)}
        />
      )}
      <VariantToggle variant={variant} onChange={setVariant} />
    </div>
  );
}
