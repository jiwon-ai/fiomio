"use client";

/* Fiomio wordmark — geometric "fiomio" followed by the lime brand square
   (the period reimagined as a "pixel of intelligence"). Mirrors the logo. */
export function Wordmark({
  className = "",
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <span
      className={`font-display font-semibold tracking-tight inline-flex items-end leading-none ${
        onDark ? "text-cream" : "text-ink"
      } ${className}`}
      aria-label="Fiomio"
    >
      <span aria-hidden>fiomio</span>
      <span
        aria-hidden
        className="ml-[0.12em] mb-[0.04em] inline-block size-[0.32em] rounded-[0.08em] bg-spring"
      />
    </span>
  );
}
