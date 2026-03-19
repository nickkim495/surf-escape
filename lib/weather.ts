import type { WeatherWindSignal } from "@/lib/types";

/**
 * Wind / offshore heuristic. Replace with Open-Meteo (or similar) fetch using lat/lon + dates.
 */
export async function fetchWindSignal(input: {
  lat: number;
  lon: number;
  /** ISO date yyyy-mm-dd (for future real API windowing). */
  date: string;
}): Promise<WeatherWindSignal> {
  void input;
  await Promise.resolve();
  return {
    speedMph: 6 + (Math.abs((input.lat + input.lon) * 10) % 9),
    offshoreScore: 55 + (Math.abs(input.lat * 7) % 35),
    source: "placeholder",
  };
}
