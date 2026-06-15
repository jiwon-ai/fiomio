"use client";

import { useLang } from "@/lib/i18n";
import { buildAffiliateLink } from "@/lib/affiliates";
import type { ProductInfo, Photo } from "@/lib/articles";

function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating / 2); // rating is out of 10 → 0..5
  return (
    <span className="inline-flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 20 20">
          <path
            d="M10 1.6l2.47 5.18 5.68.72-4.18 3.9 1.08 5.62L10 14.3l-5.05 2.72 1.08-5.62-4.18-3.9 5.68-.72z"
            fill={i < filled ? "var(--color-spring-deep)" : "var(--color-line)"}
          />
        </svg>
      ))}
    </span>
  );
}

export function ProductCard({ product }: { product: ProductInfo }) {
  const { t } = useLang();
  const r = t.journal.review;

  return (
    <aside className="lab-frame my-8 rounded-2xl bg-cream p-6 sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {product.brand && (
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-spring-deep">
              {product.brand}
            </p>
          )}
          <h3 className="font-display mt-1.5 text-2xl font-semibold leading-tight text-ink">
            {product.name}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.category && (
              <span className="rounded-full bg-spring/12 px-2.5 py-0.5 text-[0.72rem] font-medium text-moss">
                {product.category}
              </span>
            )}
            {product.price && (
              <span className="rounded-full border border-line px-2.5 py-0.5 text-[0.72rem] font-medium text-stone">
                {product.price}
              </span>
            )}
          </div>
        </div>

        {typeof product.rating === "number" && (
          <div className="shrink-0 text-left sm:text-right">
            <div className="font-display text-3xl font-semibold leading-none text-ink">
              {product.rating.toFixed(1)}
              <span className="text-base text-stone-2">/10</span>
            </div>
            <div className="mt-1.5 sm:flex sm:justify-end">
              <Stars rating={product.rating} />
            </div>
          </div>
        )}
      </div>

      {product.verdict && (
        <p className="mt-4 border-t border-line pt-4 font-display text-[1.05rem] font-medium italic text-ink/85">
          “{product.verdict}”
        </p>
      )}

      {product.url && (
        <a
          href={buildAffiliateLink(product.url)}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className="spring-glow mt-5 inline-flex items-center gap-2 rounded-full bg-spring px-5 py-3 text-sm font-semibold text-spring-ink transition-transform hover:-translate-y-0.5"
        >
          {r.buy}
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M5 3h8v8M13 3L3 13"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      )}
    </aside>
  );
}

export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const { t } = useLang();
  if (!photos.length) return null;

  return (
    <div className="my-8 grid gap-3 sm:grid-cols-2">
      {photos.map((p, i) => (
        <figure key={i} className="m-0">
          {p.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.src}
              alt={p.alt ?? p.label ?? ""}
              loading="lazy"
              className="aspect-[4/5] w-full rounded-xl border border-line object-cover"
            />
          ) : (
            <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-cream text-stone-2">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
                <circle cx="8.5" cy="10" r="1.6" fill="currentColor" />
                <path d="M5 17l4.5-4 3 2.5L16 12l3 3" stroke="currentColor" strokeWidth="1.4" fill="none" />
              </svg>
              <span className="text-xs">{t.journal.review.photoPlaceholder}</span>
            </div>
          )}
          {p.label && (
            <figcaption className="mt-2 text-center font-mono text-[0.7rem] uppercase tracking-widest text-stone-2">
              {p.label}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

export function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  const { t } = useLang();
  const r = t.journal.review;
  if (!pros.length && !cons.length) return null;

  return (
    <div className="my-8 grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-spring-deep/25 bg-spring/8 p-5">
        <p className="font-mono text-[0.7rem] uppercase tracking-widest text-spring-deep">
          {r.pros}
        </p>
        <ul className="mt-3 space-y-2">
          {pros.map((p, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[0.9rem] leading-relaxed text-ink/85">
              <span className="mt-0.5 shrink-0 text-spring-deep" aria-hidden>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8.5l3 3 7-7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-line bg-cream p-5">
        <p className="font-mono text-[0.7rem] uppercase tracking-widest text-stone-2">
          {r.cons}
        </p>
        <ul className="mt-3 space-y-2">
          {cons.map((c, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[0.9rem] leading-relaxed text-ink/75">
              <span className="mt-0.5 shrink-0 text-stone-2" aria-hidden>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path d="M4 8h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
