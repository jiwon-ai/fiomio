"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { Reveal } from "./ui/Reveal";

export function JournalTeaser() {
  const { t } = useLang();
  const j = t.journalTeaser;

  return (
    <section className="bg-void py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-12">
        <Reveal>
          <div className="lab-frame-dark flex flex-col gap-8 p-10 sm:flex-row sm:items-center sm:justify-between sm:p-14">
            <div className="max-w-xl">
              <p className="eyebrow">{j.eyebrow}</p>
              <h2
                className="font-editorial mt-4 font-light leading-tight tracking-tight text-cream"
                style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
              >
                {j.title}
              </h2>
              <p className="mt-3 text-sm font-light leading-relaxed text-cream/42">
                {j.body}
              </p>
            </div>
            <Link
              href="/journal"
              className="inline-flex shrink-0 items-center gap-3 self-start font-mono text-[0.65rem] uppercase tracking-[0.22em] text-spring transition-colors hover:text-cream sm:self-auto"
            >
              {j.cta}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
