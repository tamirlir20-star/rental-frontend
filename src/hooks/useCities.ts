import { useState, useEffect } from "react";
import { fetchCities } from "../utils/api";
import type { CityOption } from "../types/listing";

export function useCities() {
  const [cities, setCities] = useState<CityOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCities()
      .then(setCities)
      .catch(() => setCities([]))
      .finally(() => setLoading(false));
  }, []);

  return { cities, loading };
}
