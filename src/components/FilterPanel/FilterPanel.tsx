import type { ReactNode } from "react";
import { useFilterStore } from "../../store/filterStore";
import CitySelector from "./CitySelector";
import NeighborhoodSelector from "./NeighborhoodSelector";
import RoomsFilter from "./RoomsFilter";
import PriceRangeFilter from "./PriceRangeFilter";
import AmenitiesFilter from "./AmenitiesFilter";
import SourceFilter from "./SourceFilter";

export default function FilterPanel() {
  const { reset } = useFilterStore();

  return (
    <aside
      className="flex flex-col gap-0 sticky h-fit"
      style={{
        background: "#fff",
        borderRadius: "1rem",
        border: "1px solid #e8e4dc",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        top: "4rem",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #f0ede7" }}>
        <div className="flex items-center gap-2">
          <span className="text-base">🔍</span>
          <h2 className="text-sm font-bold" style={{ color: "#1c1917" }}>סינון</h2>
        </div>
        <button
          onClick={reset}
          className="text-xs font-semibold px-3 py-1 rounded-lg transition-colors"
          style={{ color: "#78716c", background: "#f7f5f0" }}
          onMouseEnter={e => (e.currentTarget.style.background = "#f0ede7")}
          onMouseLeave={e => (e.currentTarget.style.background = "#f7f5f0")}
        >
          נקה הכל
        </button>
      </div>

      {/* Sections */}
      <div className="flex flex-col">
        <Section><CitySelector /></Section>
        <Section><NeighborhoodSelector /></Section>
        <Section><RoomsFilter /></Section>
        <Section><PriceRangeFilter /></Section>
        <Section><AmenitiesFilter /></Section>
        <Section last><SourceFilter /></Section>
      </div>
    </aside>
  );
}

function Section({ children, last }: { children: ReactNode; last?: boolean }) {
  return (
    <div
      className="px-5 py-4"
      style={last ? {} : { borderBottom: "1px solid #f0ede7" }}
    >
      {children}
    </div>
  );
}
