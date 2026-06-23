"use client";

import { useState } from "react";
import type { Messages } from "@/lib/locale";
import { Reveal } from "./ui/Reveal";

export function Faq({ t }: { t: Messages }) {
  const f = t.faq;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-paper-2 py-24 sm:py-28">
      <div className="mx-auto max-w-3xl px-6 sm:px-12">
        <Reveal className="mb-10">
          <p className="eyebrow text-spring-deep">{f.eyebrow}</p>
          <h2
            className="font-display mt-4 font-semibold leading-tight tracking-tight text-ink"
            style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)" }}
          >
            {f.title}
          </h2>
        </Reveal>

        <Reveal>
          <ul className="divide-y divide-line overflow-hidden border border-line bg-cream">
            {f.items.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left transition-colors hover:bg-white"
                  >
                    <span className="text-lg font-medium leading-snug text-ink">{item.q}</span>
                    <span
                      className={`grid size-6 shrink-0 place-items-center text-spring-deep transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                      aria-hidden
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M8 3v10M3 8h10"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-[var(--ease-out-expo)] ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-base leading-relaxed text-stone">
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
