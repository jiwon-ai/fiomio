import type { Metadata } from "next";
import { AccountContent } from "@/components/AccountContent";

export const metadata: Metadata = {
  title: "My space · Fiomio",
  description:
    "Sign in to save your results and track your skin over time.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <AccountContent lang="en" />;
}
