const S = '#2a2622';

export const Glyphs = {
  robot: () => (
    <g stroke={S} strokeWidth="1.5" strokeLinejoin="round">
      <polygon points="-14,4 0,12 14,4 0,-4" fill="#e0e6ec"/>
      <polygon points="-14,4 0,-4 0,18 -14,26" fill="#b8c2cc"/>
      <polygon points="14,4 0,-4 0,18 14,26" fill="#90a0b0"/>
      <rect x="-10" y="-22" width="20" height="20" rx="4" fill="#3b6e8f"/>
      <circle cx="-3" cy="-14" r="2.5" fill="#ffd56a"/>
      <circle cx="5" cy="-14" r="2.5" fill="#ffd56a"/>
    </g>
  ),
  scanner: () => (
    <g stroke={S} strokeWidth="1.5" strokeLinejoin="round">
      <polygon points="-10,-2 0,4 10,-2 0,-8" fill="#d8d2c2"/>
      <polygon points="-10,-2 0,-8 0,18 -10,24" fill="#a8a292"/>
      <polygon points="10,-2 0,-8 0,18 10,24" fill="#807a6a"/>
      <rect x="-3" y="-30" width="6" height="24" fill="#e87b5a"/>
      <circle cx="0" cy="-32" r="5" fill="#ffd56a"/>
      <path d="M0,-32 L-28,-18 M0,-32 L28,-18 M0,-32 L-34,-6" stroke="#ffd56a" strokeWidth="1" opacity="0.6"/>
    </g>
  ),
  servers: () => (
    <g stroke={S} strokeWidth="1.5" strokeLinejoin="round">
      <polygon points="-16,-2 0,6 16,-2 0,-10" fill="#3a4a5c"/>
      <polygon points="-16,-2 0,-10 0,16 -16,24" fill="#2a3848"/>
      <polygon points="16,-2 0,-10 0,16 16,24" fill="#1c2734"/>
      <rect x="-13" y="-3" width="26" height="3" fill="#7ad0a5" opacity="0.85"/>
      <rect x="-13" y="3" width="26" height="3" fill="#ffd56a" opacity="0.85"/>
      <rect x="-13" y="9" width="26" height="3" fill="#7ad0a5" opacity="0.6"/>
    </g>
  ),
  connector: () => (
    <g stroke={S} strokeWidth="1.5" strokeLinejoin="round">
      <polygon points="-18,0 0,10 18,0 0,-10" fill="#f0d4a4"/>
      <circle cx="-8" cy="-2" r="5" fill="#3b6e8f"/>
      <circle cx="8" cy="2" r="5" fill="#d96a4a"/>
      <path d="M-3,0 L3,0" stroke={S} strokeWidth="2"/>
    </g>
  ),
  book: () => (
    <g stroke={S} strokeWidth="1.5" strokeLinejoin="round">
      <polygon points="-20,2 0,12 20,2 0,-8" fill="#f6efde"/>
      <polygon points="-14,-2 0,5 14,-2 0,-9" fill="#d96a4a"/>
      <line x1="-8" y1="0" x2="0" y2="4" strokeWidth="1"/>
      <line x1="8" y1="0" x2="0" y2="4" strokeWidth="1"/>
    </g>
  ),
  tv: () => (
    <g stroke={S} strokeWidth="1.5" strokeLinejoin="round">
      <rect x="-22" y="-18" width="44" height="28" rx="3" fill="#2a2a2a"/>
      <rect x="-19" y="-15" width="38" height="22" rx="1" fill="#7ab9d8"/>
      <line x1="-12" y1="14" x2="12" y2="14" strokeWidth="2"/>
      <line x1="0" y1="10" x2="0" y2="14" strokeWidth="2"/>
    </g>
  ),
  heart: () => (
    <g stroke={S} strokeWidth="1.5">
      <path d="M0,8 C-16,-2 -14,-16 -4,-14 C0,-13 0,-10 0,-8 C0,-10 0,-13 4,-14 C14,-16 16,-2 0,8Z" fill="#e87b5a"/>
    </g>
  ),
  bubble: () => (
    <g stroke={S} strokeWidth="1.5" strokeLinejoin="round">
      <rect x="-22" y="-14" width="40" height="22" rx="6" fill="#a8d1e8"/>
      <polygon points="-8,8 -2,14 2,8" fill="#a8d1e8"/>
      <circle cx="-10" cy="-3" r="2" fill={S}/>
      <circle cx="-2" cy="-3" r="2" fill={S}/>
      <circle cx="6" cy="-3" r="2" fill={S}/>
    </g>
  ),
  ballot: () => (
    <g stroke={S} strokeWidth="1.5" strokeLinejoin="round">
      <polygon points="-18,-4 -18,12 0,22 18,12 18,-4 0,-14" fill="#e8e3d3"/>
      <rect x="-3" y="-18" width="6" height="6" fill="#d96a4a"/>
      <path d="M-8,4 L-3,8 L6,-2" strokeWidth="2" fill="none"/>
    </g>
  ),
  sprout: () => (
    <g stroke={S} strokeWidth="1.5">
      <path d="M0,14 L0,-8" strokeWidth="2"/>
      <path d="M0,-2 Q-16,-2 -16,-16 Q-2,-14 0,-2" fill="#7ad0a5"/>
      <path d="M0,-8 Q14,-10 16,-22 Q4,-22 0,-8" fill="#7ad0a5"/>
    </g>
  ),
  circles: () => (
    <g stroke={S} strokeWidth="1.5" fill="none">
      <circle cx="0" cy="0" r="20" stroke="#3b6e8f" strokeWidth="2"/>
      <circle cx="-8" cy="-4" r="7" fill="#e87b5a"/>
      <circle cx="9" cy="2" r="6" fill="#7ad0a5"/>
      <circle cx="2" cy="10" r="5" fill="#ffd56a"/>
    </g>
  ),
  docs: () => (
    <g stroke={S} strokeWidth="1.5" strokeLinejoin="round">
      <rect x="-16" y="-12" width="22" height="28" rx="2" fill="#fbf7ee"/>
      <rect x="-12" y="-16" width="22" height="28" rx="2" fill="#f6efde"/>
      <line x1="-8" y1="-10" x2="6" y2="-10"/>
      <line x1="-8" y1="-5" x2="6" y2="-5"/>
      <line x1="-8" y1="0" x2="2" y2="0"/>
    </g>
  ),
  cottage: () => (
    <g stroke={S} strokeWidth="1.5" strokeLinejoin="round">
      <polygon points="-22,-2 0,8 22,-2 0,-12" fill="#f0e2c4"/>
      <polygon points="-22,-2 0,8 0,24 -22,14" fill="#d4c290"/>
      <polygon points="22,-2 0,8 0,24 22,14" fill="#a89060"/>
      <polygon points="-18,-12 0,-24 18,-12 0,-2" fill="#d96a4a"/>
      <polygon points="-18,-12 0,-2 0,4 -10,0" fill="#a04a30"/>
      <polygon points="18,-12 0,-2 0,4 10,0" fill="#7a3622"/>
      <rect x="-3" y="2" width="6" height="10" fill="#5c3820"/>
    </g>
  ),
};
