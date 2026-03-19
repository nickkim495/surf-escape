"use client";

import { useMemo, useState } from "react";
import { Hero } from "@/components/Hero";
import { SearchForm, type SearchFormValues } from "@/components/SearchForm";
import { ResultsGrid } from "@/components/ResultsGrid";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import type { RankedDestination } from "@/lib/types";
import { normalizeIata } from "@/lib/utils";

function defaultDates(): Pick<SearchFormValues, "departureDate" | "returnDate"> {
  const start = new Date();
  const day = start.getDay();
  const daysUntilSaturday = (6 - day + 7) % 7 || 7;
  const depart = new Date(start);
  depart.setDate(depart.getDate() + daysUntilSaturday);
  const ret = new Date(depart);
  ret.setDate(ret.getDate() + 2);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return { departureDate: iso(depart), returnDate: iso(ret) };
}

export default function Home() {
  const defaults = useMemo(() => defaultDates(), []);
  const [values, setValues] = useState<SearchFormValues>({
    origin: "",
    departureDate: defaults.departureDate,
    returnDate: defaults.returnDate,
  });
  const [results, setResults] = useState<RankedDestination[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  async function runSearch(payload: SearchFormValues) {
    setClientError(null);
    const origin = normalizeIata(payload.origin);
    if (!origin) return;

    setLoading(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin,
          departureDate: payload.departureDate,
          returnDate: payload.returnDate,
        }),
      });
      const data = (await res.json()) as
        | { ok: true; results: RankedDestination[] }
        | { ok: false; error: string };

      if (!res.ok || !data || typeof data !== "object" || !("ok" in data)) {
        setClientError("Something went wrong. Try again.");
        return;
      }
      if (!data.ok) {
        setClientError(data.error);
        return;
      }
      setResults(data.results);
    } catch {
      setClientError("Network error. Check your connection and retry.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--surface)] max-sm:bg-white">
      <Hero />
      <main
        id="main-content"
        className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-12 max-sm:[--brand:#0d9488] max-sm:[--brand-ink:#0f172a] max-sm:[--foreground:#0f172a] max-sm:[--muted:#64748b]"
      >
        <section
          id="how-it-works"
          className="mb-10 grid gap-6 rounded-2xl border border-black/6 bg-white/70 p-6 shadow-sm sm:grid-cols-3 sm:p-8"
          aria-labelledby="how-heading"
        >
          <div className="sm:col-span-3">
            <h2
              id="how-heading"
              className="text-sm font-semibold uppercase tracking-wide text-[var(--brand)]"
            >
              How it works
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
              Surf Escape is a fast weekend decision tool — not a spot-level
              forecast. We combine indicative flight pricing with Surf Score
              (public swell and wind proxies), then explain the tradeoffs in plain
              English.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--brand-ink)]">
              1. Set your airport
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Tell us where you&apos;re flying from — we only use it for this search.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--brand-ink)]">
              2. Pick a weekend
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              We rank a curated shortlist of intermediate-friendly regions.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--brand-ink)]">
              3. Compare ranked cards
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              See price, Surf Score, and a short rationale — no bookings here.
            </p>
          </div>
        </section>

        <SearchForm
          values={values}
          onChange={setValues}
          onSubmit={runSearch}
          disabled={loading}
          error={clientError}
        />

        {loading ? <LoadingState /> : null}
        {!loading && results === null ? <EmptyState /> : null}
        {!loading && results !== null ? (
          <ResultsGrid results={results} />
        ) : null}
      </main>
    </div>
  );
}
