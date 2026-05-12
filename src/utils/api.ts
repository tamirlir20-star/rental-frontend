import type { ListingsResponse, CityOption, NeighborhoodOption } from "../types/listing";

const BASE = import.meta.env.VITE_API_URL ?? "https://rental-scraper-q8t.onrender.com";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function get<T>(path: string, params?: Record<string, string | number | boolean | null | undefined>): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== null && v !== undefined && v !== "") {
        url.searchParams.set(k, String(v));
      }
    }
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new ApiError(res.status, `API error ${res.status}`);
  return res.json();
}

export interface ListingFilters {
  city?: string | null;
  neighborhood?: string | null;
  rooms_min?: number | null;
  rooms_max?: number | null;
  price_min?: number | null;
  price_max?: number | null;
  size_min?: number | null;
  size_max?: number | null;
  has_parking?: boolean | null;
  has_balcony?: boolean | null;
  pets_allowed?: boolean | null;
  furnished?: boolean | null;
  source?: string | null;
  sort_by?: string;
  sort_dir?: string;
  page?: number;
  page_size?: number;
}

export async function fetchListings(filters: ListingFilters): Promise<ListingsResponse> {
  return get("/listings", filters as Record<string, string | number | boolean | null>);
}

export async function fetchListing(id: number) {
  return get(`/listings/${id}`);
}

export async function fetchCities(): Promise<CityOption[]> {
  return get("/listings/cities");
}

export async function fetchNeighborhoods(city: string): Promise<NeighborhoodOption[]> {
  return get("/listings/neighborhoods", { city });
}

export async function fetchStats() {
  return get("/stats");
}
