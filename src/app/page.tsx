import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Problem } from "@/components/Problem";
import { Solution } from "@/components/Solution";
import { Diagnostic } from "@/components/Diagnostic";
import { WhyDifferent } from "@/components/WhyDifferent";
import { JournalTeaser } from "@/components/JournalTeaser";
import { Waitlist } from "@/components/Waitlist";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Marquee />
      <Problem />
      <Solution />
      <Diagnostic />
      <WhyDifferent />
      <JournalTeaser />
      <Waitlist />
    </main>
  );
}
