"use client";

/* Horizontal wordmark — "fiomio" + lime dot (echoes the f-mark's accent).
   The cursive "f" mark itself is the symbol, reserved for square contexts
   (favicon, app icon, avatar) so the "f" is never repeated next to the word. */
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
        className="mb-[0.14em] ml-[0.07em] size-[0.17em] rounded-full bg-spring"
      />
    </span>
  );
}
