import type { ReactNode } from "react";
import type { Lang } from "@/lib/locale";
import { getDictionary } from "@/lib/locale";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

export function SiteChrome({
  lang,
  children,
}: {
  lang: Lang;
  children: ReactNode;
}) {
  const t = getDictionary(lang);

  return (
    <>
      <Nav lang={lang} t={t} />
      <div id="main-content">{children}</div>
      <Footer lang={lang} t={t} />
    </>
  );
}
