/** Hand-tuned line icons (24px grid, 1.6 stroke) — no emoji, consistent weight. */
import type { ReactNode, SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 24, children, ...rest }: P & { children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {children}
    </svg>
  );
}

export const IconLeaf = (p: P) => <Base {...p}><path d="M5 19c0-8 5-13 14-14-.5 9-6 14-14 14Z" /><path d="M5 19c3-4 6-7 10-9" /></Base>;
export const IconGauge = (p: P) => <Base {...p}><path d="M4 16a8 8 0 1 1 16 0" /><path d="m12 16 4-5" /><circle cx="12" cy="16" r="1.2" /></Base>;
export const IconSpark = (p: P) => <Base {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></Base>;
export const IconGlobe = (p: P) => <Base {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z" /></Base>;
export const IconTrophy = (p: P) => <Base {...p}><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" /><path d="M8 6H5v1a3 3 0 0 0 3 3M16 6h3v1a3 3 0 0 1-3 3M12 13v4M9 20h6M10 17h4" /></Base>;
export const IconMedal = (p: P) => <Base {...p}><circle cx="12" cy="15" r="5" /><path d="m9 10-3-7h4l2 4 2-4h4l-3 7" /><path d="m12 13 .8 1.6 1.7.2-1.2 1.2.3 1.7-1.6-.8-1.6.8.3-1.7-1.2-1.2 1.7-.2Z" /></Base>;
export const IconMic = (p: P) => <Base {...p}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></Base>;
export const IconBook = (p: P) => <Base {...p}><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z" /><path d="M4 19a2 2 0 0 1 2-2h13" /></Base>;
export const IconStar = (p: P) => <Base {...p}><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z" /></Base>;
export const IconRocket = (p: P) => <Base {...p}><path d="M5 15c-1.5 1.5-2 4-2 6 2 0 4.5-.5 6-2M9 17l-2-2c1-4 4-9 12-12-3 8-8 11-12 12" /><circle cx="14.5" cy="9.5" r="1.5" /></Base>;
export const IconPlay = (p: P) => <Base {...p}><circle cx="12" cy="12" r="9" /><path d="m10 8.5 5 3.5-5 3.5Z" fill="currentColor" /></Base>;
export const IconMail = (p: P) => <Base {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></Base>;
export const IconCopy = (p: P) => <Base {...p}><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></Base>;
export const IconCheck = (p: P) => <Base {...p}><path d="m5 12 4.5 4.5L19 7" /></Base>;
export const IconX = (p: P) => <Base {...p}><path d="M7 7l10 10M17 7 7 17" /></Base>;
export const IconSun = (p: P) => <Base {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></Base>;
export const IconMoon = (p: P) => <Base {...p}><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" /></Base>;
export const IconCar = (p: P) => <Base {...p}><path d="M5 16V11l2-5h10l2 5v5M3 16h18v2H3zM7 16v2M17 16v2" /><circle cx="7.5" cy="13" r=".8" /><circle cx="16.5" cy="13" r=".8" /></Base>;
export const IconPlane = (p: P) => <Base {...p}><path d="M10 13 3 11l1-2 7 1 4-6h2l-2 7 5 1 1-2h2l-1 4-1 4h-2l-1-2-5 1 2 7h-2l-4-6Z" /></Base>;
export const IconHome = (p: P) => <Base {...p}><path d="M4 11 12 4l8 7v9H4z" /><path d="M10 20v-5h4v5" /></Base>;
export const IconFood = (p: P) => <Base {...p}><path d="M4 11h16a8 8 0 0 1-16 0Z" /><path d="M9 7c0-1.5 1-1.5 1-3M13 7c0-1.5 1-1.5 1-3" /></Base>;
export const IconBag = (p: P) => <Base {...p}><path d="M5 8h14l-1 12H6Z" /><path d="M9 8a3 3 0 0 1 6 0" /></Base>;
export const IconRecycle = (p: P) => <Base {...p}><path d="M7 19H4l2.5-4.5M17 19h3l-2.5-4.5M9.5 5l2.5-2 2.5 2M12 3v5M6.5 14.5 9 10M17.5 14.5 15 10M8 19h8" /></Base>;
export const IconHandshake = (p: P) => <Base {...p}><path d="m3 11 4-4 5 2 5-2 4 4-7 7a2 2 0 0 1-3 0l-4-4M12 9l-3 3a1.5 1.5 0 0 0 2 2l3-3" /></Base>;
export const IconStore = (p: P) => <Base {...p}><path d="M4 9 5.5 4h13L20 9M4 9h16v11H4zM4 9a3 3 0 0 0 5 1 3 3 0 0 0 6 0 3 3 0 0 0 5-1" /><path d="M10 20v-5h4v5" /></Base>;
export const IconHeart = (p: P) => <Base {...p}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /></Base>;
export const IconUsers = (p: P) => <Base {...p}><circle cx="9" cy="8" r="3.5" /><path d="M3 20a6 6 0 0 1 12 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3 5.5" /></Base>;
export const IconArrow = (p: P) => <Base {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Base>;
