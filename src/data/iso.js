export const HALF_W = 100;
export const HALF_H = 50;
export const SPACING = 1.0;

export function gridToScreen(gx, gy, s = SPACING) {
  return { sx: (gx - gy) * HALF_W * s, sy: -(gx + gy) * HALF_H * s };
}

export function quadrant(gx, gy) {
  if (gx > 0 && gy > 0) return 'q1';
  if (gx < 0 && gy > 0) return 'q2';
  if (gx < 0 && gy < 0) return 'q3';
  return 'q4';
}

export const BIOME = {
  q1: { fill: '#7ab0cc', side: '#5a90b2', label: 'Enterprise · Complex' },
  q2: { fill: '#5ca858', side: '#478844', label: 'Enterprise · Simple' },
  q3: { fill: '#a8cc6e', side: '#88aa50', label: 'Consumer · Simple' },
  q4: { fill: '#e0b46a', side: '#c09444', label: 'Consumer · Complex' },
};
