import type { Lang } from "@/lib/locale";
import { getDictionary } from "@/lib/locale";
import { Hero } from "./Hero";
import { Marquee } from "./Marquee";
import { Problem } from "./Problem";
import { Solution } from "./Solution";
import { Diagnostic } from "./Diagnostic";
import { WhyDifferent } from "./WhyDifferent";
import { Engagement } from "./Engagement";
import { JournalTeaser } from "./JournalTeaser";
import { Faq } from "./Faq";
import { Waitlist } from "./Waitlist";
import { FaqJsonLd } from "./JsonLd";

export function HomeSections({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);

  return (
    <main className="flex-1">
      <Hero lang={lang} t={t} />
      <Marquee t={t} />
      <Problem t={t} />
      <Solution t={t} />
      <Diagnostic lang={lang} t={t} />
      <WhyDifferent t={t} />
      <Engagement t={t} />
      <JournalTeaser lang={lang} t={t} />
      <Faq t={t} />
      <Waitlist lang={lang} t={t} />
      <FaqJsonLd lang={lang} />
    </main>
  );
}
