import type { ReactElement } from "react";

/* Tasteful, abstract single-color line/duotone icons for the diagnostic.
   All use currentColor and a shared 32x32 viewBox so they tint with the
   surrounding tile. Keyed by option `key`. */

const S = {
  width: 32,
  height: 32,
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ICONS: Record<string, ReactElement> = {
  /* ---- skin types ---- */
  dry: (
    <svg {...S}>
      <path d="M16 5c4 5 6 8 6 11a6 6 0 1 1-12 0c0-3 2-6 6-11Z" />
      <path d="M9 22c1.5 1 3 1 4.5 0M18.5 22c1.5 1 3 1 4.5 0" opacity={0.5} />
    </svg>
  ),
  combination: (
    <svg {...S}>
      <circle cx="16" cy="16" r="11" />
      <path d="M16 5v22" opacity={0.5} />
      <path d="M11 11c1.4-1 3.6-1 5 0" opacity={0.6} />
    </svg>
  ),
  oily: (
    <svg {...S}>
      <path d="M16 4c4.5 5.5 7 9 7 12.5a7 7 0 1 1-14 0C9 13 11.5 9.5 16 4Z" />
      <path d="M13 16.5a3 3 0 0 0 3 3" opacity={0.6} />
    </svg>
  ),
  normal: (
    <svg {...S}>
      <circle cx="16" cy="16" r="11" />
      <path d="M11.5 18c2.5 2.5 6.5 2.5 9 0" opacity={0.7} />
      <circle cx="12.5" cy="13" r="0.4" fill="currentColor" />
      <circle cx="19.5" cy="13" r="0.4" fill="currentColor" />
    </svg>
  ),

  /* ---- sensitivity (booleans → "true"/"false") ---- */
  true: (
    <svg {...S}>
      <path d="M16 6c4.5 4 7 7.5 7 11a7 7 0 1 1-14 0c0-3.5 2.5-7 7-11Z" />
      <path d="M12.5 18c1 2 5 2 6 0" opacity={0.5} />
      <path d="M13 13l-1.5-1.5M19 13l1.5-1.5" opacity={0.7} />
    </svg>
  ),
  false: (
    <svg {...S}>
      <circle cx="16" cy="16" r="11" />
      <path d="M11 17.5c2.5 2 7.5 2 10 0" opacity={0.7} />
    </svg>
  ),

  /* ---- concerns ---- */
  redness: (
    <svg {...S}>
      <circle cx="16" cy="16" r="10" />
      <path d="M11 14c2-1.5 3-1.5 5 0M16 16c2-1.5 3-1.5 5 0" opacity={0.7} />
    </svg>
  ),
  dehydration: (
    <svg {...S}>
      <path d="M16 4c5 6 8 9.5 8 13.5a8 8 0 1 1-16 0C8 13.5 11 10 16 4Z" />
    </svg>
  ),
  dullness: (
    <svg {...S}>
      <circle cx="16" cy="16" r="6" />
      <path d="M16 4v3M16 25v3M4 16h3M25 16h3M7.8 7.8l2.1 2.1M22.1 22.1l2.1 2.1M24.2 7.8l-2.1 2.1M9.9 22.1l-2.1 2.1" />
    </svg>
  ),
  aging: (
    <svg {...S}>
      <path d="M7 11c3-2 7-2 10 0M7 16c3-2 7-2 10 0M7 21c3-2 7-2 10 0" />
      <path d="M21 9c2 4 2 10 0 14" opacity={0.5} />
    </svg>
  ),
  acne: (
    <svg {...S}>
      <circle cx="16" cy="16" r="10" />
      <circle cx="13" cy="13" r="1.4" fill="currentColor" />
      <circle cx="20" cy="15" r="1" fill="currentColor" />
      <circle cx="15" cy="20" r="1.2" fill="currentColor" />
    </svg>
  ),
  pores: (
    <svg {...S}>
      <circle cx="11" cy="11" r="1.3" />
      <circle cx="17" cy="12" r="1.3" />
      <circle cx="22" cy="14" r="1.3" />
      <circle cx="12" cy="17" r="1.3" />
      <circle cx="18" cy="18" r="1.3" />
      <circle cx="14" cy="22" r="1.3" />
      <circle cx="21" cy="21" r="1.3" />
    </svg>
  ),
  barrier: (
    <svg {...S}>
      <path d="M16 4l9 3.5v6c0 6-4 10.5-9 12.5-5-2-9-6.5-9-12.5v-6L16 4Z" />
      <path d="M12.5 16l2.5 2.5 4.5-5" opacity={0.7} />
    </svg>
  ),
  pigmentation: (
    <svg {...S}>
      <circle cx="16" cy="16" r="10" />
      <path d="M12 12a2.5 2.5 0 1 0 0.01 0Z" fill="currentColor" opacity={0.55} />
      <circle cx="20" cy="19" r="1.6" fill="currentColor" opacity={0.4} />
    </svg>
  ),

  /* ---- actives ---- */
  retinoid: (
    <svg {...S}>
      <path d="M16 6v20M16 16l6-4M16 20l-6-4M16 12l-5-3M16 22l5-3" opacity={0.85} />
    </svg>
  ),
  exfoliant: (
    <svg {...S}>
      <path d="M16 5l2.6 7.8 7.8.2-6.2 4.8 2.2 7.6L16 22.4 9.6 25.2l2.2-7.6-6.2-4.8 7.8-.2L16 5Z" />
    </svg>
  ),
  vitc: (
    <svg {...S}>
      <circle cx="16" cy="16" r="10" />
      <path d="M13 11.5l-3 4.5 3 4.5M19 11.5l3 4.5-3 4.5" opacity={0.6} />
      <path d="M16 11v10" opacity={0.45} />
    </svg>
  ),
  none: (
    <svg {...S}>
      <circle cx="16" cy="16" r="10" />
      <path d="M10 16h12" />
    </svg>
  ),

  /* ---- age ranges ---- */
  u25: (
    <svg {...S}>
      <circle cx="16" cy="11" r="5" />
      <path d="M7 26c1.5-5 5-7.5 9-7.5s7.5 2.5 9 7.5" />
    </svg>
  ),
  a25_34: (
    <svg {...S}>
      <circle cx="16" cy="11" r="5" />
      <path d="M7 26c1.5-5 5-7.5 9-7.5s7.5 2.5 9 7.5" />
      <path d="M12 9.5c1.5-1.5 6.5-1.5 8 0" opacity={0.5} />
    </svg>
  ),
  a35_44: (
    <svg {...S}>
      <circle cx="16" cy="11" r="5" />
      <path d="M7 26c1.5-5 5-7.5 9-7.5s7.5 2.5 9 7.5" />
      <path d="M13 12c1-1 5-1 6 0" opacity={0.55} />
    </svg>
  ),
  a45p: (
    <svg {...S}>
      <circle cx="16" cy="11" r="5" />
      <path d="M7 26c1.5-5 5-7.5 9-7.5s7.5 2.5 9 7.5" />
      <path d="M12.5 10.5c1.5-1 5.5-1 7 0M13 13c1-0.8 5-0.8 6 0" opacity={0.5} />
    </svg>
  ),

  /* ---- gender ---- */
  female: (
    <svg {...S}>
      <circle cx="16" cy="12" r="6" />
      <path d="M16 18v8M12 23h8" />
    </svg>
  ),
  male: (
    <svg {...S}>
      <circle cx="13" cy="19" r="6" />
      <path d="M17.5 14.5L25 7M20 7h5v5" />
    </svg>
  ),
  other: (
    <svg {...S}>
      <circle cx="16" cy="14" r="5.5" />
      <path d="M16 19.5V27M12.5 23.5h7M16 8.5L13 5.5M16 8.5L19 5.5" opacity={0.85} />
    </svg>
  ),

  /* ---- pregnancy ---- */
  pregnant: (
    <svg {...S}>
      <circle cx="14" cy="7.5" r="3" />
      <path d="M14 10.5c-2 1-3 3-3 6 0 0 0 3 2 3" />
      <path d="M13 16.5c4-1 6 1.5 6 4.5s-2 5-5 5" />
      <path d="M11 25h0" />
    </svg>
  ),
  trying: (
    <svg {...S}>
      <path d="M16 25C9 20 5 16 5 11.5A5 5 0 0 1 16 9a5 5 0 0 1 11 2.5C27 16 23 20 16 25Z" />
    </svg>
  ),
};

export function DiagIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const icon = ICONS[name];
  if (!icon) return null;
  return (
    <span className={className} aria-hidden="true">
      {icon}
    </span>
  );
}
