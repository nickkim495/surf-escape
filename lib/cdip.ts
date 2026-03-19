import type { SwellSignal } from "@/lib/types";
import { surfPlaceholderKey, stableUnit } from "@/lib/surf-placeholder-seed";

/**
 * Swell proxy. When using placeholder data, values are deterministic from
 * destination + trip dates so Surf Scores repeat for the same search window.
 * Wire real CDIP / NOAA here when `source` becomes `"cdip"`.
 */
export async function fetchSwellSignal(input: {
  lat: number;
  lon: number;
  date: string;
  destinationSlug: string;
  departureDate: string;
  returnDate: string;
}): Promise<SwellSignal> {
  void input.lat;
  void input.lon;
  void input.date;
  await Promise.resolve();

  const seed = surfPlaceholderKey({
    destinationSlug: input.destinationSlug,
    departureDate: input.departureDate,
    returnDate: input.returnDate,
  });

  const energy = 40 + Math.floor(stableUnit(seed, "swell-energy") * 46);
  const dominantPeriodSeconds =
    10 + Math.floor(stableUnit(seed, "swell-period") * 6);

  return {
    energy,
    dominantPeriodSeconds,
    source: "placeholder",
  };
}
