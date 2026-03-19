import { cn } from "@/lib/utils";

export function EmptyState({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "mt-10 rounded-2xl border border-dashed border-black/15 bg-slate-50/80 px-6 py-12 text-center",
        className,
      )}
      aria-label="Getting started"
    >
      <h2 className="text-lg font-semibold text-[var(--brand-ink)]">
        Ready when you are
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--muted)]">
        Add your home airport and a weekend window. We&apos;ll compare a curated
        set of intermediate-friendly regions and rank them with Surf Score plus
        indicative flight pricing.
      </p>
    </section>
  );
}
