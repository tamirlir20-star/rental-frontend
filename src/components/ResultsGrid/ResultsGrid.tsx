import { useState, useEffect } from "react";
import { useListings } from "../../hooks/useListings";
import { useFilterStore } from "../../store/filterStore";
import ListingCard from "./ListingCard";
import SortBar from "./SortBar";
import Pagination from "./Pagination";
import LoadingSkeletons from "./LoadingSkeletons";
import EmptyState from "./EmptyState";
import ListingDetailModal from "../ListingDetail/ListingDetailModal";
import type { Listing } from "../../types/listing";

export default function ResultsGrid() {
  const filters = useFilterStore();
  const { data, status } = useListings(filters);
  const [selected, setSelected] = useState<Listing | null>(null);
  const [slowLoad, setSlowLoad] = useState(false);

  const isLoading = status === "loading";
  const isRefreshing = status === "refreshing";
  const isError = status === "error";

  useEffect(() => {
    if (!isLoading) { setSlowLoad(false); return; }
    const t = setTimeout(() => setSlowLoad(true), 8000);
    return () => clearTimeout(t);
  }, [isLoading]);

  return (
    <div>
      <SortBar
        total={data?.total ?? 0}
        isRefreshing={isRefreshing}
      />

      {slowLoad && (
        <div style={{
          display: "flex", alignItems: "center", gap: "0.6rem",
          background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
          borderRadius: "0.5rem", padding: "0.65rem 1rem", marginBottom: "1rem",
          fontSize: "0.82rem", color: "#F59E0B",
        }}>
          <span style={{ fontSize: "1rem" }}>⏳</span>
          השרת מתעורר — עד 50 שניות בפעם הראשונה
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading ? (
          <LoadingSkeletons count={12} />
        ) : isError ? (
          <EmptyState isError />
        ) : !data?.listings?.length ? (
          <EmptyState />
        ) : (
          data.listings.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onOpen={setSelected}
            />
          ))
        )}
      </div>

      {data && data.pages > 1 && (
        <Pagination page={data.page} pages={data.pages} />
      )}

      {selected && (
        <ListingDetailModal listing={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
