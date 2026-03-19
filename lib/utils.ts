/**
 * Join class names, skipping falsey values.
 * Keeps Tailwind composition simple without extra deps.
 */
export function cn(
  ...parts: Array<string | undefined | null | false>
): string {
  return parts.filter(Boolean).join(" ");
}

/** Uppercase IATA; empty if invalid shape. */
export function normalizeIata(raw: string): string {
  const t = raw.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(t)) return "";
  return t;
}

export function formatUsd(amount: number | null): string {
  if (amount == null || Number.isNaN(amount)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
