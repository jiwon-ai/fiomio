import type { Messages } from "@/lib/locale";

export function Marquee({ t }: { t: Messages }) {
  const items = t.marquee;
  const loop = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-line bg-paper-2 py-4 select-none">
      <div className="flex w-max animate-marquee">
        {loop.map((label, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="mx-7 size-1 rounded-full bg-spring-deep/30" aria-hidden />
            <span className="font-display text-base font-medium text-stone">
              {label}
            </span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-paper-2 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-paper-2 to-transparent" />
    </div>
  );
}
