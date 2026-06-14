"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { Reveal } from "./ui/Reveal";

export function JournalTeaser() {
  const { t } = useLang();
  const j = t.journalTeaser;

  return (
    <section className="bg-paper py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="lab-frame flex flex-col gap-6 rounded-2xl bg-cream p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12">
            <div className="max-w-xl">
              <p className="eyebrow">{j.eyebrow}</p>
              <h2 className="font-display mt-3 text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl">
                {j.title}
              </h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-stone">
                {j.body}
              </p>
            </div>
            <Link
              href="/journal"
              className="spring-glow inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5 sm:self-auto"
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
