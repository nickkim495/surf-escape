import { cn } from "@/lib/utils";

export function LoadingState({ className }: { className?: string }) {
  return (
    <div
      className={cn("mt-10", className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <p className="sr-only">Loading trip results</p>
      <div className="mb-4 h-6 w-48 animate-pulse rounded-md bg-slate-200" />
      <ul className="flex list-none flex-col gap-5 p-0">
        {Array.from({ length: 9 }).map((_, i) => (
          <li
            key={i}
            className="h-72 rounded-2xl border border-black/5 bg-slate-100/80 p-5"
          >
            <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-slate-200" />
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="h-20 animate-pulse rounded-xl bg-slate-200" />
              <div className="h-20 animate-pulse rounded-xl bg-slate-200" />
            </div>
            <div className="mt-6 space-y-2">
              <div className="h-3 animate-pulse rounded bg-slate-200" />
              <div className="h-3 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-slate-200" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
