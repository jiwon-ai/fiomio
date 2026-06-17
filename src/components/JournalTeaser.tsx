"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { Reveal } from "./ui/Reveal";

export function JournalTeaser() {
  const { t } = useLang();
  const j = t.journalTeaser;

  return (
    <section className="bg-paper py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-12">
        <Reveal>
          <div className="lab-frame flex flex-col gap-8 bg-cream p-10 sm:flex-row sm:items-center sm:justify-between sm:p-14">
            <div className="max-w-xl">
              <p className="eyebrow text-spring-deep">{j.eyebrow}</p>
              <h2
                className="font-display mt-4 font-semibold leading-tight tracking-tight text-ink"
                style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)" }}
              >
                {j.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-stone">
                {j.body}
              </p>
            </div>
            <Link
              href="/journal"
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5 sm:self-auto"
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
