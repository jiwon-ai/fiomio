"use client";

/* Fiomio logo lockup — the cursive "f" mark (with its lime accent) + wordmark. */
export function Wordmark({
  className = "",
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <span
      className={`font-display font-semibold tracking-tight inline-flex items-center gap-[0.24em] ${
        onDark ? "text-cream" : "text-ink"
      } ${className}`}
      aria-label="Fiomio"
    >
      <svg
        viewBox="14 4 50 78"
        className="h-[1.05em] w-auto shrink-0 -translate-y-[0.04em]"
        fill="none"
        aria-hidden
      >
        <g
          stroke="currentColor"
          strokeWidth="8.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M55 29 C58 15 43 10 38 23 C35 32 43 36 43 47 C43 61 42 69 35 74 C31 77 26 76 23 72" />
          <path d="M27 47 C37 44 46 45 52 44" />
        </g>
        <circle cx="55" cy="44" r="4.3" fill="#cbef4d" />
      </svg>
      <span aria-hidden>fiomio</span>
    </span>
  );
}
