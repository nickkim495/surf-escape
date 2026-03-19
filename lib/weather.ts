import type { WeatherWindSignal } from "@/lib/types";
import { surfPlaceholderKey, stableUnit } from "@/lib/surf-placeholder-seed";

/**
 * Wind / offshore heuristic. Placeholder mode is deterministic from destination
 * + trip dates (matches swell placeholders). Replace with Open-Meteo (or similar)
 * when `source` becomes `"open-meteo"`.
 */
export async function fetchWindSignal(input: {
  lat: number;
  lon: number;
  date: string;
  destinationSlug: string;
  departureDate: string;
  returnDate: string;
}): Promise<WeatherWindSignal> {
  void input.lat;
  void input.lon;
  void input.date;
  await Promise.resolve();

  const seed = surfPlaceholderKey({
    destinationSlug: input.destinationSlug,
    departureDate: input.departureDate,
    returnDate: input.returnDate,
  });

  const speedMph = 6 + Math.floor(stableUnit(seed, "wind-mph") * 9);
  const offshoreScore =
    55 + Math.floor(stableUnit(seed, "wind-offshore") * 35);

  return {
    speedMph,
    offshoreScore,
    source: "placeholder",
  };
}
