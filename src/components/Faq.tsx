"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { Reveal } from "./ui/Reveal";

export function Faq() {
  const { t } = useLang();
  const f = t.faq;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-paper-2 py-24 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal className="text-center">
          <p className="eyebrow">{f.eyebrow}</p>
          <h2 className="font-display mt-4 text-3xl font-medium leading-tight tracking-tight text-ink sm:text-[2.4rem]">
            {f.title}
          </h2>
        </Reveal>

        <Reveal className="mt-10">
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-cream">
            {f.items.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-7 sm:py-5"
                  >
                    <span className="font-medium text-ink">{item.q}</span>
                    <span
                      className={`grid size-6 shrink-0 place-items-center rounded-full border border-line text-stone transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                      aria-hidden
                    >
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                        <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-[var(--ease-out-expo)] ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-[0.95rem] leading-relaxed text-stone sm:px-7">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
