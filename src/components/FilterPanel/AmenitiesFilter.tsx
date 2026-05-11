import type { ReactElement } from "react";
import { useFilterStore } from "../../store/filterStore";

const AMENITIES: {
  key: "hasParking" | "hasBalcony" | "petsAllowed" | "furnished";
  label: string;
  icon: string;
}[] = [
  { key: "hasParking",  label: "חניה",          icon: "P" },
  { key: "hasBalcony",  label: "מרפסת",         icon: "B" },
  { key: "petsAllowed", label: "חיות מחמד",     icon: "~" },
  { key: "furnished",   label: "מרוהטת",        icon: "F" },
];

/* SVG icons for each amenity */
const ICONS: Record<string, ReactElement> = {
  hasParking: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 17V7h4a3 3 0 010 6H9" />
    </svg>
  ),
  hasBalcony: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <rect x="3" y="14" width="18" height="2" rx="1" />
      <line x1="7" y1="14" x2="7" y2="21" />
      <line x1="17" y1="14" x2="17" y2="21" />
      <path d="M3 10h18M7 10V5h10v5" />
    </svg>
  ),
  petsAllowed: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="13" r="4" />
      <circle cx="5" cy="7" r="2" />
      <circle cx="19" cy="7" r="2" />
      <circle cx="8" cy="4" r="1.5" />
      <circle cx="16" cy="4" r="1.5" />
    </svg>
  ),
  furnished: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <rect x="2" y="7" width="20" height="10" rx="2" />
      <path d="M2 11h20M6 17v2M18 17v2" />
      <line x1="2" y1="11" x2="2" y2="7" />
      <line x1="22" y1="11" x2="22" y2="7" />
    </svg>
  ),
};

export default function AmenitiesFilter() {
  const store = useFilterStore();

  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "0.7rem",
          fontWeight: 700,
          color: "#484F58",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: "0.55rem",
        }}
      >
        נוחיות
      </label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
        {AMENITIES.map(({ key, label }) => {
          const active = store[key] === true;
          return (
            <button
              key={key}
              onClick={() => store.toggleBool(key)}
              className={active ? "filter-active" : ""}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.3rem 0.65rem",
                borderRadius: "0.35rem",
                fontSize: "0.78rem",
                fontWeight: active ? 700 : 500,
                cursor: "pointer",
                transition: "all 0.15s",
                background: active ? "#F59E0B" : "#21262D",
                color: active ? "#0E1117" : "#8B949E",
                border: active ? "1px solid #F59E0B" : "1px solid #30363D",
              }}
            >
              <span style={{ display: "flex", color: "currentColor" }}>{ICONS[key]}</span>
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
