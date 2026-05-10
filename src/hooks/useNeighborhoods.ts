import { useState, useEffect } from "react";
import { fetchNeighborhoods } from "../utils/api";
import type { NeighborhoodOption } from "../types/listing";

export function useNeighborhoods(city: string | null) {
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!city) {
      setNeighborhoods([]);
      return;
    }
    setLoading(true);
    fetchNeighborhoods(city)
      .then(setNeighborhoods)
      .catch(() => setNeighborhoods([]))
      .finally(() => setLoading(false));
  }, [city]);

  return { neighborhoods, loading };
}
