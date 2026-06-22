import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Problem } from "@/components/Problem";
import { Solution } from "@/components/Solution";
import { Diagnostic } from "@/components/Diagnostic";
import { WhyDifferent } from "@/components/WhyDifferent";
import { Engagement } from "@/components/Engagement";
import { JournalTeaser } from "@/components/JournalTeaser";
import { Faq } from "@/components/Faq";
import { Waitlist } from "@/components/Waitlist";
import { FaqJsonLd } from "@/components/JsonLd";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Marquee />
      <Problem />
      <Solution />
      <Diagnostic />
      <WhyDifferent />
      <Engagement />
      <JournalTeaser />
      <Faq />
      <Waitlist />
      <FaqJsonLd />
    </main>
  );
}
