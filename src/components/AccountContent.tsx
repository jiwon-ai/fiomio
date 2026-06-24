"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import type { Lang } from "@/lib/locale";
import { getDictionary, localePath } from "@/lib/locale";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

type Saved = {
  id: string;
  result: {
    city?: string | null;
    season?: string | null;
    topActive?: string | null;
    actives?: string | null;
  };
  created_at: string;
};

type CheckIn = {
  id: string;
  date: string;
  hydration: number | null;
  comfort: number | null;
  breakouts: number | null;
  sensitivity: number | null;
  note: string | null;
};

const METRICS = ["hydration", "comfort", "breakouts", "sensitivity"] as const;
type Metric = (typeof METRICS)[number];

export function AccountContent({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const a = t.account;
  const sb = getSupabaseBrowser();

  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [saved, setSaved] = useState<Saved[]>([]);
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [form, setForm] = useState({
    hydration: 3,
    comfort: 3,
    breakouts: 3,
    sensitivity: 3,
    note: "",
  });
  const [checkSaved, setCheckSaved] = useState(false);

  const loadData = useCallback(async () => {
    if (!sb) return;
    const { data: s } = await sb
      .from("saved_diagnostics")
      .select("id,result,created_at")
      .order("created_at", { ascending: false });
    setSaved((s as Saved[]) ?? []);
    const { data: c } = await sb
      .from("skin_checkins")
      .select("id,date,hydration,comfort,breakouts,sensitivity,note")
      .order("date", { ascending: false })
      .limit(60);
    setCheckins((c as CheckIn[]) ?? []);
  }, [sb]);

  useEffect(() => {
    if (!sb) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReady(true);
      return;
    }
    let active = true;
    sb.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, sess) => {
      setSession(sess);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [sb]);

  useEffect(() => {
    if (!sb || !session) return;
    (async () => {
      try {
        const pending = localStorage.getItem("fiomio:pendingSave");
        if (pending) {
          const obj = JSON.parse(pending);
          await sb
            .from("saved_diagnostics")
            .insert({ result: obj.result, lang: obj.lang ?? lang });
          localStorage.removeItem("fiomio:pendingSave");
        }
      } catch {
        /* ignore */
      }
      loadData();
    })();
  }, [sb, session, lang, loadData]);

  const sendMagic = async () => {
    if (!sb || !email) return;
    await sb.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + localePath(lang, "/compte"),
      },
    });
    setSent(true);
  };

  const oauth = async (provider: "google" | "apple") => {
    if (!sb) return;
    await sb.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + localePath(lang, "/compte"),
      },
    });
  };

  const signOut = async () => {
    if (!sb) return;
    await sb.auth.signOut();
    setSaved([]);
    setCheckins([]);
  };

  const submitCheckIn = async () => {
    if (!sb || !session) return;
    await sb.from("skin_checkins").insert({
      hydration: form.hydration,
      comfort: form.comfort,
      breakouts: form.breakouts,
      sensitivity: form.sensitivity,
      note: form.note || null,
    });
    setForm({ hydration: 3, comfort: 3, breakouts: 3, sensitivity: 3, note: "" });
    setCheckSaved(true);
    setTimeout(() => setCheckSaved(false), 1800);
    loadData();
  };

  const metricLabel: Record<Metric, string> = {
    hydration: a.mHydration,
    comfort: a.mComfort,
    breakouts: a.mBreakouts,
    sensitivity: a.mSensitivity,
  };

  const shell = (children: ReactNode) => (
    <main className="mx-auto min-h-screen max-w-2xl px-6 pb-24 pt-28 sm:px-8">
      {children}
    </main>
  );

  if (!ready) {
    return shell(<p className="text-stone">{a.loading}</p>);
  }

  if (!sb) {
    return shell(
      <>
        <h1 className="font-display text-3xl font-semibold text-ink">{a.title}</h1>
        <p className="mt-3 text-stone">{a.notConfigured}</p>
      </>,
    );
  }

  if (!session) {
    return shell(
      <>
        <h1 className="font-display text-3xl font-semibold text-ink">{a.title}</h1>
        <p className="mt-2 max-w-md text-stone">{a.subtitle}</p>

        <div className="mt-8 rounded-2xl border border-line bg-white p-6">
          <label className="block text-sm font-medium text-ink" htmlFor="acc-email">
            {a.emailLabel}
          </label>
          <input
            id="acc-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={a.emailPlaceholder}
            className="mt-2 w-full rounded-lg border border-line bg-cream px-4 py-3 text-ink outline-none focus:border-spring-deep"
          />
          <button
            type="button"
            onClick={sendMagic}
            className="mt-3 w-full rounded-full bg-spring-deep px-5 py-3 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5"
          >
            {a.sendLink}
          </button>
          {sent && <p className="mt-3 text-sm text-spring-deep">{a.linkSent}</p>}

          <p className="mt-6 text-center text-xs uppercase tracking-widest text-stone-2">
            {a.orContinue}
          </p>
          <div className="mt-3 grid gap-2">
            <button
              type="button"
              onClick={() => oauth("google")}
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/30"
            >
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" /><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.6-3.1-11.3-7.5l-6.5 5C9.6 39.6 16.2 44 24 44z" /><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C40.9 36.6 44 30.9 44 24c0-1.3-.1-2.3-.4-3.5z" /></svg>
              {a.google}
            </button>
          </div>
        </div>
      </>,
    );
  }

  return shell(
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">{a.title}</h1>
          <p className="mt-1 text-sm text-stone">
            {a.loggedAs}
            {session.user.email ? ` · ${session.user.email}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="shrink-0 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-stone transition-colors hover:border-ink/30 hover:text-ink"
        >
          {a.signOut}
        </button>
      </div>

      {/* skin tracking */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-ink">{a.trackTitle}</h2>
        <p className="mt-1 text-sm text-stone">{a.trackIntro}</p>

        <div className="mt-5 rounded-2xl border border-spring-deep/20 bg-spring/8 p-6">
          <p className="font-mono text-[0.65rem] uppercase tracking-widest text-spring-deep">
            {a.checkInTitle}
          </p>
          <div className="mt-4 space-y-4">
            {METRICS.map((mk) => (
              <div key={mk}>
                <p className="text-sm font-medium text-ink">{metricLabel[mk]}</p>
                <div className="mt-1.5 flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      type="button"
                      aria-label={`${metricLabel[mk]} ${v}`}
                      onClick={() => setForm((f) => ({ ...f, [mk]: v }))}
                      className={`h-9 flex-1 rounded-lg border text-sm transition-colors ${
                        form[mk] === v
                          ? "border-spring-deep bg-spring-deep text-cream"
                          : "border-line bg-white text-stone hover:border-ink/30"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <textarea
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            placeholder={a.notePlaceholder}
            rows={2}
            className="mt-4 w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-spring-deep"
          />
          <button
            type="button"
            onClick={submitCheckIn}
            className="mt-3 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5"
          >
            {checkSaved ? a.checkInSaved : a.saveCheckIn}
          </button>
        </div>

        {/* timeline */}
        <h3 className="mt-8 font-mono text-[0.65rem] uppercase tracking-widest text-stone-2">
          {a.timelineTitle}
        </h3>
        {checkins.length === 0 ? (
          <p className="mt-2 text-sm text-stone">{a.noCheckins}</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {checkins.map((c) => (
              <li key={c.id} className="rounded-xl border border-line bg-white p-4">
                <p className="text-xs font-medium text-stone-2">{c.date}</p>
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
                  {METRICS.map((mk) => {
                    const val = (c[mk] ?? 0) as number;
                    return (
                      <div key={mk}>
                        <p className="text-[0.7rem] text-stone-2">{metricLabel[mk]}</p>
                        <div className="mt-1 h-1.5 w-full rounded-full bg-ink/8">
                          <div
                            className="h-1.5 rounded-full bg-spring-deep"
                            style={{ width: `${(val / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                {c.note && <p className="mt-3 text-sm text-ink/80">{c.note}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* saved results */}
      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-ink">{a.savedTitle}</h2>
        {saved.length === 0 ? (
          <p className="mt-2 text-sm text-stone">
            {a.noSaved}{" "}
            <a
              href={localePath(lang, "/#diagnostic")}
              className="font-medium text-spring-deep underline"
            >
              {a.doDiagnostic}
            </a>
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {saved.map((s) => (
              <li key={s.id} className="rounded-xl border border-line bg-white p-4">
                <p className="text-xs font-medium text-stone-2">
                  {new Date(s.created_at).toLocaleDateString()}
                  {s.result.city ? ` · ${s.result.city}` : ""}
                  {s.result.season ? ` · ${s.result.season}` : ""}
                </p>
                {s.result.topActive && (
                  <p className="mt-1.5 text-ink">
                    <span className="text-stone-2">{a.savedTop}: </span>
                    <span className="font-semibold">{s.result.topActive}</span>
                  </p>
                )}
                {s.result.actives && (
                  <p className="mt-1 text-sm text-stone">{s.result.actives}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>,
  );
}
