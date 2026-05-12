import { useState, useEffect } from "react";
import { fetchCities } from "../utils/api";
import type { CityOption } from "../types/listing";

// Module-level cache — cities don't change during a session.
let cachedCities: CityOption[] | null = null;
let inflightPromise: Promise<CityOption[]> | null = null;

export function getCities(): Promise<CityOption[]> {
  if (cachedCities) return Promise.resolve(cachedCities);
  if (!inflightPromise) {
    inflightPromise = fetchCities().then(cities => {
      cachedCities = cities;
      inflightPromise = null;
      return cities;
    });
  }
  return inflightPromise;
}

export function useCities() {
  const [cities, setCities] = useState<CityOption[]>(cachedCities ?? []);
  const [loading, setLoading] = useState(!cachedCities);

  useEffect(() => {
    if (cachedCities) return;
    getCities()
      .then(setCities)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { cities, loading };
}
