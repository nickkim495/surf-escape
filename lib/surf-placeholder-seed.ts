/**
 * Deterministic pseudo-random unit in [0, 1) from a stable seed + channel name.
 * Same inputs always produce the same output (no Date.now, no Math.random).
 */
export function stableUnit(seed: string, channel: string): number {
  const s = `${seed}\0${channel}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}

/** Canonical key: same destination + date range → same surf placeholder signals. */
export function surfPlaceholderKey(input: {
  destinationSlug: string;
  departureDate: string;
  returnDate: string;
}): string {
  return `${input.destinationSlug}|${input.departureDate}|${input.returnDate}`;
}
