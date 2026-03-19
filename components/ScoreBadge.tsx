import { cn } from "@/lib/utils";

type ScoreBadgeProps = {
  label: string;
  score: number;
  className?: string;
};

export function ScoreBadge({ label, score, className }: ScoreBadgeProps) {
  const tone =
    score >= 75 ? "bg-emerald-50 text-emerald-800 ring-emerald-200" :
    score >= 55 ? "bg-amber-50 text-amber-900 ring-amber-200" :
    "bg-slate-100 text-slate-800 ring-slate-200";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
        tone,
        className,
      )}
    >
      <span className="text-[0.65rem] font-bold uppercase tracking-wide text-black/45">
        {label}
      </span>
      <span className="tabular-nums">{score}</span>
    </span>
  );
}
