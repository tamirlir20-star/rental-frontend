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
      className="sticky h-fit"
      style={{
        background: "#161B22",
        borderRadius: "0.75rem",
        border: "1px solid #21262D",
        top: "3.5rem",
        overflow: "hidden",
      }}
    >
      {/* Panel header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid #21262D" }}
      >
        <div className="flex items-center gap-2">
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="#484F58" strokeWidth="2" strokeLinecap="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="11" y1="18" x2="13" y2="18" />
          </svg>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#8B949E", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            סינון
          </span>
        </div>
        <button
          onClick={reset}
          style={{
            fontSize: "0.72rem",
            fontWeight: 600,
            color: "#484F58",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "0.2rem 0.5rem",
            borderRadius: "0.25rem",
            transition: "color 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#F59E0B")}
          onMouseLeave={e => (e.currentTarget.style.color = "#484F58")}
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
      className="px-4 py-4"
      style={last ? {} : { borderBottom: "1px solid #21262D" }}
    >
      {children}
    </div>
  );
}
