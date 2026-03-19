import Link from "next/link";
import { cn } from "@/lib/utils";

export function SiteHeader({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-black/5 bg-[var(--surface)]/90 backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-[family-name:var(--font-surf)] text-xl text-[var(--brand-ink)] sm:text-2xl"
        >
          Surf Escape
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-4 text-sm">
          <a
            href="#how-it-works"
            className="hidden text-[var(--muted)] transition hover:text-[var(--brand-ink)] sm:inline"
          >
            How it works
          </a>
          <a
            href="#search"
            className="rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-95"
          >
            Find trips
          </a>
        </nav>
      </div>
    </header>
  );
}
