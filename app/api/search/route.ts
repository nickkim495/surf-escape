import { NextResponse } from "next/server";
import { DESTINATIONS } from "@/lib/destinations";
import { fetchFlightQuote } from "@/lib/amadeus";
import { fetchSwellSignal } from "@/lib/cdip";
import { fetchWindSignal } from "@/lib/weather";
import { computeSurfScore, rankDestinations } from "@/lib/scoring";
import type { SearchErrorBody, SearchRequestBody, SearchResponseBody } from "@/lib/types";
import { normalizeIata } from "@/lib/utils";

function isIsoDate(d: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(d);
}

export async function POST(req: Request) {
  let body: Partial<SearchRequestBody>;
  try {
    body = (await req.json()) as Partial<SearchRequestBody>;
  } catch {
    const err: SearchErrorBody = { ok: false, error: "Invalid JSON body." };
    return NextResponse.json(err, { status: 400 });
  }

  const origin = normalizeIata(typeof body.origin === "string" ? body.origin : "");
  const departureDate =
    typeof body.departureDate === "string" ? body.departureDate : "";
  const returnDate = typeof body.returnDate === "string" ? body.returnDate : "";

  if (!origin) {
    const err: SearchErrorBody = {
      ok: false,
      error: "Enter a valid 3-letter origin airport code (e.g. SFO).",
    };
    return NextResponse.json(err, { status: 400 });
  }
  if (!isIsoDate(departureDate) || !isIsoDate(returnDate)) {
    const err: SearchErrorBody = {
      ok: false,
      error: "Use ISO dates (YYYY-MM-DD) for departure and return.",
    };
    return NextResponse.json(err, { status: 400 });
  }
  if (departureDate >= returnDate) {
    const err: SearchErrorBody = {
      ok: false,
      error: "Return date must be after departure.",
    };
    return NextResponse.json(err, { status: 400 });
  }

  const rows = await Promise.all(
    DESTINATIONS.map(async (destination) => {
      const [flight, swell, wind] = await Promise.all([
        fetchFlightQuote({
          origin,
          destinationAirport: destination.airportIata,
          departureDate,
          returnDate,
        }),
        fetchSwellSignal({
          lat: destination.lat,
          lon: destination.lon,
          date: departureDate,
        }),
        fetchWindSignal({
          lat: destination.lat,
          lon: destination.lon,
          date: departureDate,
        }),
      ]);
      const surf = computeSurfScore(swell, wind);
      return { destination, surf, flight };
    }),
  );

  const results = rankDestinations(rows);
  const payload: SearchResponseBody = { ok: true, results };
  return NextResponse.json(payload);
}
