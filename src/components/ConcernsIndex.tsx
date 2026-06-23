import Link from "next/link";
import type { Lang } from "@/lib/locale";
import { localePath } from "@/lib/locale";
import type { ConcernKey } from "@/lib/ingredients";
import { CONCERN_TITLE, CONCERN_INTRO, CONCERN_SLUG } from "@/lib/concerns";

export function ConcernsIndex({ lang }: { lang: Lang }) {
  const L = (fr: string, en: string) => (lang === "fr" ? fr : en);
  const keys = Object.keys(CONCERN_TITLE) as ConcernKey[];
  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-6 sm:px-10">
        <p className="eyebrow text-spring-deep">{L("Par préoccupation", "By concern")}</p>
        <h1 className="font-display mt-3 font-semibold leading-tight tracking-tight text-ink" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
          {L("Quel est votre objectif peau ?", "What's your skin goal?")}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone">
          {L("Choisissez une préoccupation pour voir les actifs K-beauty qui la ciblent, et les produits qui les contiennent.", "Pick a concern to see the K-beauty actives that target it, and the products that contain them.")}
        </p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {keys.map((k) => (
            <Link key={k} href={localePath(lang, `/concerns/${CONCERN_SLUG[k]}`)} className="lab-frame flex flex-col rounded-xl bg-paper p-5 transition-colors hover:border-spring-deep/40">
              <span className="font-display text-lg font-semibold text-ink">{CONCERN_TITLE[k][lang]}</span>
              <span className="mt-1.5 text-sm leading-relaxed text-stone-2">{CONCERN_INTRO[k][lang]}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
