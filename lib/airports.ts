/** Major gateways surf travelers often depart from — extend as needed. */
export type AirportOption = {
  iata: string;
  city: string;
  /** Airport or metro name for display. */
  name: string;
};

export const ORIGIN_AIRPORTS: AirportOption[] = [
  { iata: "ATL", city: "Atlanta", name: "Hartsfield-Jackson" },
  { iata: "AUS", city: "Austin", name: "Austin-Bergstrom" },
  { iata: "BNA", city: "Nashville", name: "Nashville International" },
  { iata: "BOS", city: "Boston", name: "Logan International" },
  { iata: "BUR", city: "Burbank", name: "Hollywood Burbank" },
  { iata: "BWI", city: "Baltimore", name: "BWI Marshall" },
  { iata: "CLT", city: "Charlotte", name: "Douglas International" },
  { iata: "DCA", city: "Washington", name: "Reagan National" },
  { iata: "DEN", city: "Denver", name: "Denver International" },
  { iata: "DFW", city: "Dallas", name: "Dallas/Fort Worth" },
  { iata: "DTW", city: "Detroit", name: "Metro Wayne County" },
  { iata: "EWR", city: "Newark", name: "Newark Liberty" },
  { iata: "FLL", city: "Fort Lauderdale", name: "Hollywood International" },
  { iata: "HNL", city: "Honolulu", name: "Daniel K. Inouye" },
  { iata: "IAD", city: "Washington", name: "Dulles International" },
  { iata: "IAH", city: "Houston", name: "George Bush Intercontinental" },
  { iata: "JFK", city: "New York", name: "John F. Kennedy" },
  { iata: "LAS", city: "Las Vegas", name: "Harry Reid International" },
  { iata: "LAX", city: "Los Angeles", name: "Los Angeles International" },
  { iata: "LGA", city: "New York", name: "LaGuardia" },
  { iata: "MIA", city: "Miami", name: "Miami International" },
  { iata: "MSP", city: "Minneapolis", name: "St. Paul International" },
  { iata: "OAK", city: "Oakland", name: "Oakland International" },
  { iata: "ORD", city: "Chicago", name: "O'Hare International" },
  { iata: "PDX", city: "Portland", name: "Portland International" },
  { iata: "PHX", city: "Phoenix", name: "Sky Harbor International" },
  { iata: "SAN", city: "San Diego", name: "San Diego International" },
  { iata: "SEA", city: "Seattle", name: "Seattle-Tacoma International" },
  { iata: "SFO", city: "San Francisco", name: "San Francisco International" },
  { iata: "SJC", city: "San Jose", name: "Norman Y. Mineta" },
  { iata: "SLC", city: "Salt Lake City", name: "Salt Lake City International" },
  { iata: "SMF", city: "Sacramento", name: "Sacramento International" },
  { iata: "SNA", city: "Orange County", name: "John Wayne" },
  { iata: "STL", city: "St. Louis", name: "Lambert International" },
  { iata: "TPA", city: "Tampa", name: "Tampa International" },
  { iata: "YYC", city: "Calgary", name: "Calgary International" },
  { iata: "YUL", city: "Montreal", name: "Trudeau International" },
  { iata: "YYZ", city: "Toronto", name: "Pearson International" },
  { iata: "YVR", city: "Vancouver", name: "Vancouver International" },
  { iata: "CUN", city: "Cancún", name: "Cancún International" },
  { iata: "GDL", city: "Guadalajara", name: "Miguel Hidalgo" },
  { iata: "MEX", city: "Mexico City", name: "Benito Juárez International" },
  { iata: "LHR", city: "London", name: "Heathrow" },
  { iata: "LGW", city: "London", name: "Gatwick" },
  { iata: "CDG", city: "Paris", name: "Charles de Gaulle" },
  { iata: "AMS", city: "Amsterdam", name: "Schiphol" },
  { iata: "FRA", city: "Frankfurt", name: "Frankfurt Airport" },
  { iata: "MAD", city: "Madrid", name: "Adolfo Suárez" },
  { iata: "BCN", city: "Barcelona", name: "El Prat" },
  { iata: "LIS", city: "Lisbon", name: "Humberto Delgado" },
  { iata: "DUB", city: "Dublin", name: "Dublin Airport" },
  { iata: "SYD", city: "Sydney", name: "Kingsford Smith" },
  { iata: "MEL", city: "Melbourne", name: "Tullamarine" },
  { iata: "AKL", city: "Auckland", name: "Auckland Airport" },
  { iata: "NRT", city: "Tokyo", name: "Narita" },
  { iata: "HND", city: "Tokyo", name: "Haneda" },
  { iata: "SIN", city: "Singapore", name: "Changi" },
].sort((a, b) => a.city.localeCompare(b.city) || a.iata.localeCompare(b.iata));

export function filterAirports(query: string): AirportOption[] {
  const q = query.trim().toUpperCase();
  if (!q) return ORIGIN_AIRPORTS;
  return ORIGIN_AIRPORTS.filter((a) => {
    const city = a.city.toUpperCase();
    const name = a.name.toUpperCase();
    return a.iata.includes(q) || city.includes(q) || name.includes(q);
  });
}
