import { useState } from 'react';
import World from './components/World.jsx';
import ProjectOverlay from './components/ProjectOverlay.jsx';

export default function App() {
  const [overlay, setOverlay] = useState(null);
  return (
    <div style={{ height: '100%' }}>
      <World onSelect={(tile, rect) => setOverlay({ tile, rect })}/>
      {overlay && (
        <ProjectOverlay
          tile={overlay.tile}
          tileRect={overlay.rect}
          onClose={() => setOverlay(null)}
        />
      )}
    </div>
  );
}
