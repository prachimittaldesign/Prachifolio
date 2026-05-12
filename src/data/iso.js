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
  q1: { fill: '#8fb6d0', label: 'Enterprise · Complex' },
  q2: { fill: '#6fae6a', label: 'Enterprise · Simple' },
  q3: { fill: '#b9d68a', label: 'Consumer · Simple' },
  q4: { fill: '#e6c389', label: 'Consumer · Complex' },
};

// Blueprint palette — monochromatic cool blues
export const BIOME_BLUEPRINT = {
  q1: { fill: '#87b3c8' },
  q2: { fill: '#a8c8d8' },
  q3: { fill: '#c2d8e4' },
  q4: { fill: '#b0c8d8' },
};
