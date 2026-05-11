import { useState, useEffect, useRef } from "react";
import { fetchListings } from "../utils/api";
import type { ListingsResponse } from "../types/listing";
import type { FilterState } from "../store/filterStore";

export type FetchStatus = "idle" | "loading" | "refreshing" | "success" | "error";

export function useListings(filters: FilterState) {
  const [data, setData] = useState<ListingsResponse | null>(null);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setStatus(prev => (prev === "success" ? "refreshing" : "loading"));
    setError(null);

    const params = {
      city: filters.city,
      neighborhood: filters.neighborhood,
      rooms_min: filters.roomsMin,
      rooms_max: filters.roomsMax,
      price_min: filters.priceMin,
      price_max: filters.priceMax,
      size_min: filters.sizeMin,
      size_max: filters.sizeMax,
      has_parking: filters.hasParking,
      has_balcony: filters.hasBalcony,
      pets_allowed: filters.petsAllowed,
      furnished: filters.furnished,
      source: filters.sources.length > 0 ? filters.sources.join(",") : undefined,
      sort_by: filters.sortBy,
      sort_dir: filters.sortDir,
      page: filters.page,
      page_size: 24,
    };

    fetchListings(params)
      .then(res => {
        if (!ctrl.signal.aborted) {
          setData(res);
          setStatus("success");
        }
      })
      .catch(err => {
        if (!ctrl.signal.aborted) {
          setError(err?.message ?? "Unknown error");
          setStatus("error");
        }
      });

    return () => ctrl.abort();
  }, [
    filters.city,
    filters.neighborhood,
    filters.roomsMin,
    filters.roomsMax,
    filters.priceMin,
    filters.priceMax,
    filters.sizeMin,
    filters.sizeMax,
    filters.hasParking,
    filters.hasBalcony,
    filters.petsAllowed,
    filters.furnished,
    filters.sources.join(","),
    filters.sortBy,
    filters.sortDir,
    filters.page,
  ]);

  return { data, status, error };
}
