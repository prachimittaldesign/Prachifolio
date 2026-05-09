import { gridToScreen, SPACING } from '../data/iso.js';

const ROAD_COLOR = '#d6cfbe';
const EDGE_COLOR = '#b8b0a0';
const DASH_COLOR = 'rgba(255,255,255,0.55)';
const MAIN_EDGE = 44;
const MAIN_FILL = 38;
const ART_EDGE  = 26;
const ART_FILL  = 22;

function pathD(gridPts) {
  return gridPts.map(([gx, gy], i) => {
    const { sx, sy } = gridToScreen(gx, gy, SPACING);
    return `${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
  }).join(' ');
}

const mainX = [[-7, 0], [7, 0]];
const mainY = [[0, -6], [0, 6]];

const arteries = [
  [[-4, 2], [6, 2]],
  [[-4, -2], [4, -2]],
  [[-4, 4], [5, 4]],
  [[-2, -4], [4, -4]],
  [[2, -1], [2, 4]],
  [[-2, -4], [-2, 4]],
  [[4, -4], [4, 3]],
  [[6, 0], [6, 6]],
  [[-4, -2], [-4, 5]],
];

export default function RoadLayer() {
  const { sx: ix, sy: iy } = gridToScreen(0, 0, SPACING);

  return (
    <svg
      width="1" height="1"
      style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 0 }}
    >
      {arteries.map((pts, i) => (
        <path key={`ae-${i}`} d={pathD(pts)} fill="none"
          stroke={EDGE_COLOR} strokeWidth={ART_EDGE} strokeLinecap="round" strokeLinejoin="round"/>
      ))}
      {arteries.map((pts, i) => (
        <path key={`af-${i}`} d={pathD(pts)} fill="none"
          stroke={ROAD_COLOR} strokeWidth={ART_FILL} strokeLinecap="round" strokeLinejoin="round"/>
      ))}
      {arteries.map((pts, i) => (
        <path key={`ad-${i}`} d={pathD(pts)} fill="none"
          stroke={DASH_COLOR} strokeWidth="1.2" strokeLinecap="round" strokeDasharray="5 9"/>
      ))}

      {[mainX, mainY].map((pts, i) => (
        <path key={`me-${i}`} d={pathD(pts)} fill="none"
          stroke={EDGE_COLOR} strokeWidth={MAIN_EDGE} strokeLinecap="round"/>
      ))}
      {[mainX, mainY].map((pts, i) => (
        <path key={`mf-${i}`} d={pathD(pts)} fill="none"
          stroke={ROAD_COLOR} strokeWidth={MAIN_FILL} strokeLinecap="round"/>
      ))}
      {[mainX, mainY].map((pts, i) => (
        <path key={`md-${i}`} d={pathD(pts)} fill="none"
          stroke={DASH_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="10 10"/>
      ))}

      <circle cx={ix} cy={iy} r={30} fill={EDGE_COLOR}/>
      <circle cx={ix} cy={iy} r={26} fill={ROAD_COLOR}/>
      <circle cx={ix} cy={iy} r={5}  fill={EDGE_COLOR}/>
    </svg>
  );
}
