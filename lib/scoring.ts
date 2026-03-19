import type {
  Destination,
  FlightQuote,
  RankedDestination,
  SurfScore,
  SwellSignal,
  WeatherWindSignal,
} from "@/lib/types";

/**
 * Combines public-style swell + wind proxies into a 0–100 Surf Score and a full breakdown.
 */
export function computeSurfScore(
  swell: SwellSignal,
  wind: WeatherWindSignal,
): SurfScore {
  const periodFactor = Math.min(1, swell.dominantPeriodSeconds / 14);
  const swellEnergyPoints = (swell.energy / 100) * 55;
  const swellPeriodPoints = periodFactor * 20;
  const windOffshorePoints = (wind.offshoreScore / 100) * 25;
  const raw = swellEnergyPoints + swellPeriodPoints + windOffshorePoints;
  const score = Math.round(Math.min(100, Math.max(0, raw)));

  let summary = "Mixed signals for the weekend window.";
  if (score >= 75) summary = "Strong swell quality with cooperative winds.";
  else if (score >= 55) summary = "Decent energy; conditions depend on tide and spot choice.";
  else summary = "Marginal weekend — worth watching closer to your departure.";

  return {
    score,
    summary,
    breakdown: {
      swellEnergyPoints,
      swellPeriodPoints,
      windOffshorePoints,
      swellEnergy: swell.energy,
      dominantPeriodSeconds: swell.dominantPeriodSeconds,
      windSpeedMph: wind.speedMph,
      offshoreScore: wind.offshoreScore,
      swellSource: swell.source,
      windSource: wind.source,
    },
  };
}

function priceScoreFromQuote(quote: FlightQuote): number {
  if (quote.priceUsd == null) return 45;
  const p = quote.priceUsd;
  if (p <= 280) return 95;
  if (p <= 420) return 82;
  if (p <= 560) return 68;
  if (p <= 720) return 52;
  return 36;
}

function buildExplanation(input: {
  dest: Destination;
  surf: SurfScore;
  flight: FlightQuote;
  priceScore: number;
}): string {
  const priceBit =
    input.flight.priceUsd != null
      ? `Round-trip quotes land near ${input.flight.priceUsd.toFixed(0)} USD (${input.flight.source}).`
      : "Flight pricing is still approximate for this preview.";
  return `${input.dest.name} earns a Surf Score of ${input.surf.score}/100 from our public swell and wind signals — ${input.surf.summary.toLowerCase()} ${priceBit} Overall value score: ${input.priceScore}/100 on price.`;
}

export function rankDestinations(
  rows: Array<{
    destination: Destination;
    surf: SurfScore;
    flight: FlightQuote;
  }>,
): RankedDestination[] {
  const scored = rows.map((row) => {
    const priceScore = priceScoreFromQuote(row.flight);
    const tripScore = Math.round(row.surf.score * 0.58 + priceScore * 0.42);
    return {
      destination: row.destination,
      surf: row.surf,
      flight: row.flight,
      tripScore,
      explanation: buildExplanation({
        dest: row.destination,
        surf: row.surf,
        flight: row.flight,
        priceScore,
      }),
    };
  });
  return scored.sort((a, b) => b.tripScore - a.tripScore);
}
