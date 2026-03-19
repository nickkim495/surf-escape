import type { SwellSignal } from "@/lib/types";

/**
 * Swell proxy. Real CDIP / NOAA feeds can be wired here; for MVP we emit stable synthetic energy.
 */
export async function fetchSwellSignal(input: {
  lat: number;
  lon: number;
  date: string;
}): Promise<SwellSignal> {
  void input.date;
  await Promise.resolve();
  const energy = 40 + (Math.abs(Math.sin(input.lat) * 100 + Math.cos(input.lon) * 100) % 45);
  const dominantPeriodSeconds = 10 + (Math.abs(input.lat * 3) % 6);
  return {
    energy,
    dominantPeriodSeconds,
    source: "placeholder",
  };
}
