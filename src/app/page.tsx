import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Problem } from "@/components/Problem";
import { Solution } from "@/components/Solution";
import { Diagnostic } from "@/components/Diagnostic";
import { Market } from "@/components/Market";
import { Positioning } from "@/components/Positioning";
import { Waitlist } from "@/components/Waitlist";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <Problem />
        <Solution />
        <Diagnostic />
        <Market />
        <Positioning />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
