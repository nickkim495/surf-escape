import type { RankedDestination } from "@/lib/types";
import { DestinationCard } from "@/components/DestinationCard";
import { cn } from "@/lib/utils";

type ResultsGridProps = {
  results: RankedDestination[];
  className?: string;
};

export function ResultsGrid({ results, className }: ResultsGridProps) {
  if (results.length === 0) return null;

  const ordered = [...results].sort((a, b) => b.tripScore - a.tripScore);

  return (
    <section
      className={cn("mt-10", className)}
      aria-label="Ranked destinations"
    >
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-[var(--brand-ink)]">
          Ranked destinations
        </h2>
        <p className="text-sm text-[var(--muted)]">
          Best match first — Surf Score + indicative flight cost.
        </p>
      </div>
      <ol
        className="flex list-none flex-col gap-5 p-0"
        aria-label="Destinations ranked best match first"
      >
        {ordered.map((r, i) => (
          <li key={r.destination.id}>
            <DestinationCard result={r} rank={i + 1} />
          </li>
        ))}
      </ol>
    </section>
  );
}
