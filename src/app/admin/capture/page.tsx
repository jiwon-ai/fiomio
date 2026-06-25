import type { Metadata } from "next";
import { CaptureTool } from "@/components/CaptureTool";

export const metadata: Metadata = {
  title: "Fiomio Jiwon",
  robots: { index: false, follow: false },
};

export default function CapturePage() {
  return <CaptureTool />;
}
