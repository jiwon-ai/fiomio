import { SiteChrome } from "@/components/SiteChrome";

export default function FrLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome lang="fr">{children}</SiteChrome>;
}
