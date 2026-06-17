"use client";

import { useLang } from "@/lib/i18n";

export function Marquee() {
  const { t } = useLang();
  const items = t.marquee;
  const loop = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-line-void bg-void py-5 select-none">
      <div className="flex w-max animate-marquee">
        {loop.map((label, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="mx-8 h-3 w-px bg-cream/15" aria-hidden />
            <span className="font-editorial text-xl font-light italic text-cream/55 tracking-wide">
              {label}
            </span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-void to-transparent" />
    </div>
  );
}
