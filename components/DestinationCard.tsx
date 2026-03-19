import type { RankedDestination } from "@/lib/types";
import { formatUsd } from "@/lib/utils";
import { ScoreBadge } from "@/components/ScoreBadge";
import { SurfScorePanel } from "@/components/SurfScorePanel";

type DestinationCardProps = {
  result: RankedDestination;
  /** 1-based position in the ranked list (best = 1). */
  rank?: number;
};

export function DestinationCard({ result, rank }: DestinationCardProps) {
  const { destination, surf, flight, tripScore, explanation } = result;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-black/8 bg-white p-5 shadow-sm transition hover:border-[var(--brand)]/25 hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {rank != null ? (
            <span
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold tabular-nums text-[var(--brand-ink)] ring-1 ring-black/5"
              aria-label={`Rank ${rank}`}
            >
              {rank}
            </span>
          ) : null}
          <div className="min-w-0">
            <h3 className="text-lg font-semibold tracking-tight text-[var(--brand-ink)]">
              {destination.name}
            </h3>
            <p className="text-sm text-[var(--muted)]">
              {destination.region} · {destination.country}
            </p>
          </div>
        </div>
        <ScoreBadge label="Trip Score" score={tripScore} />
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-[var(--brand-ink)]/85">
        {destination.tagline}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <dl className="rounded-xl bg-slate-50 p-3">
          <dt className="text-xs font-medium uppercase tracking-wide text-black/45">
            Est. round trip
          </dt>
          <dd className="mt-1 text-base font-semibold tabular-nums text-[var(--brand-ink)]">
            {formatUsd(flight.priceUsd)}
          </dd>
          <dd className="text-[0.7rem] text-[var(--muted)]">
            via {flight.source === "amadeus" ? "live quote" : "placeholder"}
          </dd>
        </dl>
        <SurfScorePanel surf={surf} className="min-h-[4.5rem]" />
      </div>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--muted)]">
        {explanation}
      </p>

      <p className="mt-4 text-xs text-black/40">
        {destination.airportIata} · {flight.origin} round trip · Not a booking.
      </p>
    </article>
  );
}
