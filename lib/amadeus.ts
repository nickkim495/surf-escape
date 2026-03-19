import type { FlightQuote } from "@/lib/types";

type AmadeusToken = { access_token: string; expires_in: number };

/**
 * Amadeus API host (no trailing slash).
 * - Test/sandbox keys: https://test.api.amadeus.com (default)
 * - Production keys: https://api.amadeus.com
 */
function amadeusBaseUrl(): string {
  const raw = process.env.AMADEUS_API_BASE?.trim();
  if (raw) return raw.replace(/\/$/, "");
  return "https://test.api.amadeus.com";
}

/**
 * Placeholder pricing when API keys are absent.
 * Deterministic from route + dates so results feel stable while developing.
 */
function placeholderPriceUsd(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  const positive = Math.abs(h);
  return 220 + (positive % 560);
}

async function getAccessToken(): Promise<string | null> {
  const id = process.env.AMADEUS_CLIENT_ID;
  const secret = process.env.AMADEUS_CLIENT_SECRET;
  if (!id || !secret) return null;

  const base = amadeusBaseUrl();
  const res = await fetch(`${base}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: id,
      client_secret: secret,
    }),
    next: { revalidate: 0 },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as AmadeusToken;
  return data.access_token;
}

/**
 * Cheapest round-trip summary. Falls back to placeholder when Amadeus is unavailable.
 */
export async function fetchFlightQuote(input: {
  origin: string;
  destinationAirport: string;
  departureDate: string;
  returnDate: string;
}): Promise<FlightQuote> {
  const base: FlightQuote = {
    origin: input.origin,
    destinationAirport: input.destinationAirport,
    departureDate: input.departureDate,
    returnDate: input.returnDate,
    priceUsd: null,
    source: "placeholder",
  };

  const token = await getAccessToken();
  if (!token) {
    return {
      ...base,
      priceUsd: placeholderPriceUsd(
        `${input.origin}-${input.destinationAirport}-${input.departureDate}-${input.returnDate}`,
      ),
      source: "placeholder",
    };
  }

  try {
    const params = new URLSearchParams({
      originLocationCode: input.origin,
      destinationLocationCode: input.destinationAirport,
      departureDate: input.departureDate,
      returnDate: input.returnDate,
      adults: "1",
      currencyCode: "USD",
      max: "5",
    });
    const url = `${amadeusBaseUrl()}/v2/shopping/flight-offers?${params}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      return {
        ...base,
        priceUsd: placeholderPriceUsd(
          `${input.origin}-${input.destinationAirport}-${input.departureDate}`,
        ),
        source: "placeholder",
      };
    }
    const json = (await res.json()) as {
      data?: Array<{ price: { grandTotal: string } }>;
    };
    const first = json.data?.[0];
    const raw = first?.price?.grandTotal;
    const n = raw != null ? Number.parseFloat(raw) : NaN;
    if (!Number.isFinite(n)) {
      return {
        ...base,
        priceUsd: placeholderPriceUsd(input.origin + input.destinationAirport),
        source: "placeholder",
      };
    }
    return { ...base, priceUsd: n, source: "amadeus" };
  } catch {
    return {
      ...base,
      priceUsd: placeholderPriceUsd(input.origin + input.destinationAirport),
      source: "placeholder",
    };
  }
}
