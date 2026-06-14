"use client";

/** Fiomio wordmark — the dots of the two i's become spring-green data nodes. */
export function Wordmark({
  className = "",
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <span
      className={`font-display font-semibold tracking-tight inline-flex items-baseline ${
        onDark ? "text-cream" : "text-ink"
      } ${className}`}
      aria-label="Fiomio"
    >
      <span aria-hidden>f</span>
      <span aria-hidden className="relative">
        ı
        <span className="absolute -top-[0.06em] left-1/2 -translate-x-1/2 size-[0.16em] rounded-full bg-spring-deep" />
      </span>
      <span aria-hidden>om</span>
      <span aria-hidden className="relative">
        ı
        <span className="absolute -top-[0.06em] left-1/2 -translate-x-1/2 size-[0.16em] rounded-full bg-spring-deep" />
      </span>
      <span aria-hidden>o</span>
    </span>
  );
}
