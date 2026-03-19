import type { SurfScore } from "@/lib/types";
import { ScoreBadge } from "@/components/ScoreBadge";
import { cn } from "@/lib/utils";

function sourceLabel(
  kind: "swell" | "wind",
  source: SurfScore["breakdown"]["swellSource"] | SurfScore["breakdown"]["windSource"],
): string {
  if (kind === "swell") {
    return source === "cdip" ? "CDIP-style feed" : "Placeholder swell proxy";
  }
  return source === "open-meteo" ? "Open-Meteo (when wired)" : "Placeholder wind proxy";
}

function fmtPts(n: number) {
  return (Math.round(n * 10) / 10).toFixed(1);
}

type SurfScorePanelProps = {
  surf: SurfScore;
  className?: string;
};

export function SurfScorePanel({ surf, className }: SurfScorePanelProps) {
  const b = surf.breakdown;

  return (
    <details
      className={cn(
        "surf-score-panel rounded-xl bg-slate-50 ring-1 ring-black/5 open:shadow-sm",
        className,
      )}
    >
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center justify-between gap-2 rounded-xl p-3 outline-none transition",
          "[&::-webkit-details-marker]:hidden",
          "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        )}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-black/45">
            Surf Score
          </span>
          <ScoreBadge label="Surf score" score={surf.score} className="w-fit" />
        </div>
        <span
          className="surf-score-chevron shrink-0 text-black/35 transition-transform duration-200"
          aria-hidden
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </summary>

      <div className="border-t border-black/8 px-3 pb-3 pt-2">
        <p className="text-xs leading-relaxed text-[var(--muted)]">
          {surf.summary} The total is rounded to 0–100 after summing the parts
          below.
        </p>
        <dl className="mt-3 space-y-3 text-xs">
          <div className="rounded-lg bg-white/80 p-2.5 ring-1 ring-black/5">
            <dt className="font-semibold text-[var(--brand-ink)]">Swell energy</dt>
            <dd className="mt-1 text-[var(--muted)]">
              Public energy proxy{" "}
              <span className="tabular-nums font-medium text-[var(--brand-ink)]">
                {Math.round(b.swellEnergy)}
              </span>
              /100 →{" "}
              <span className="tabular-nums font-semibold text-[var(--brand-ink)]">
                {fmtPts(b.swellEnergyPoints)}
              </span>{" "}
              / 55 pts
            </dd>
          </div>
          <div className="rounded-lg bg-white/80 p-2.5 ring-1 ring-black/5">
            <dt className="font-semibold text-[var(--brand-ink)]">Swell period</dt>
            <dd className="mt-1 text-[var(--muted)]">
              Dominant period{" "}
              <span className="tabular-nums font-medium text-[var(--brand-ink)]">
                {b.dominantPeriodSeconds.toFixed(1)}s
              </span>{" "}
              vs 14s reference (capped at 100%) →{" "}
              <span className="tabular-nums font-semibold text-[var(--brand-ink)]">
                {fmtPts(b.swellPeriodPoints)}
              </span>{" "}
              / 20 pts
            </dd>
          </div>
          <div className="rounded-lg bg-white/80 p-2.5 ring-1 ring-black/5">
            <dt className="font-semibold text-[var(--brand-ink)]">
              Wind / offshore heuristic
            </dt>
            <dd className="mt-1 text-[var(--muted)]">
              Offshore favorability{" "}
              <span className="tabular-nums font-medium text-[var(--brand-ink)]">
                {Math.round(b.offshoreScore)}
              </span>
              /100, wind{" "}
              <span className="tabular-nums font-medium text-[var(--brand-ink)]">
                {Math.round(b.windSpeedMph)} mph
              </span>{" "}
              →{" "}
              <span className="tabular-nums font-semibold text-[var(--brand-ink)]">
                {fmtPts(b.windOffshorePoints)}
              </span>{" "}
              / 25 pts
            </dd>
          </div>
        </dl>
        <p className="mt-3 text-[0.65rem] leading-relaxed text-black/45">
          Data: swell — {sourceLabel("swell", b.swellSource)}; wind —{" "}
          {sourceLabel("wind", b.windSource)}.
        </p>
      </div>
    </details>
  );
}
