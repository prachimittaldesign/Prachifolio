export const HALF_W = 100;
export const HALF_H = 50;
export const SPACING = 1.45;

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
  q1: { fill: '#8fb6d0', side: '#6f96b0', label: 'Enterprise · Complex' },
  q2: { fill: '#6fae6a', side: '#5a8e57', label: 'Enterprise · Simple' },
  q3: { fill: '#b9d68a', side: '#8eb46a', label: 'Consumer · Simple' },
  q4: { fill: '#e6c389', side: '#c69e64', label: 'Consumer · Complex' },
};
