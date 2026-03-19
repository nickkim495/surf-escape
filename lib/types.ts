/** Curated destination row used by catalog + API ranking. */
export type Destination = {
  id: string;
  slug: string;
  name: string;
  country: string;
  airportIata: string;
  region: string;
  lat: number;
  lon: number;
  /** Short blurb for cards / SEO. */
  tagline: string;
};

/** Normalized flight quote for ranking (placeholder until Amadeus is wired). */
export type FlightQuote = {
  origin: string;
  destinationAirport: string;
  departureDate: string;
  returnDate: string;
  /** Total round-trip in USD when known. */
  priceUsd: number | null;
  source: "amadeus" | "placeholder";
};

export type SwellSignal = {
  /** Unitless energy proxy 0–100 from CDIP-style feeds (placeholder). */
  energy: number;
  dominantPeriodSeconds: number;
  source: "cdip" | "placeholder";
};

export type WeatherWindSignal = {
  /** Sustained wind speed, mph. */
  speedMph: number;
  /** 0 = dead onshore nightmare, 100 = ideal offshore for typical beach break. */
  offshoreScore: number;
  source: "open-meteo" | "placeholder";
};

/** Point contributions that sum (before final clamp) to the Surf Score. */
export type SurfScoreBreakdown = {
  /** Points from swell energy proxy (max 55). */
  swellEnergyPoints: number;
  /** Points from dominant swell period vs ~14s reference (max 20). */
  swellPeriodPoints: number;
  /** Points from offshore-favorability heuristic (max 25). */
  windOffshorePoints: number;
  /** Raw inputs for transparency. */
  swellEnergy: number;
  dominantPeriodSeconds: number;
  windSpeedMph: number;
  offshoreScore: number;
  swellSource: SwellSignal["source"];
  windSource: WeatherWindSignal["source"];
};

export type SurfScore = {
  score: number;
  summary: string;
  breakdown: SurfScoreBreakdown;
};

/** One ranked row returned to the client. */
export type RankedDestination = {
  destination: Destination;
  surf: SurfScore;
  flight: FlightQuote;
  /** 0–100 overall fit for “cheap + surfable weekend”. */
  tripScore: number;
  explanation: string;
};

export type SearchRequestBody = {
  origin: string;
  departureDate: string;
  returnDate: string;
};

export type SearchResponseBody = {
  ok: true;
  results: RankedDestination[];
};

export type SearchErrorBody = {
  ok: false;
  error: string;
};
