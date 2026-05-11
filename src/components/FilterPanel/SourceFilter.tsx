import { useFilterStore } from "../../store/filterStore";

const SOURCES = [
  { id: "yad2",                 label: "יד2",          color: "#EF4444" },
  { id: "madlan",               label: "מדלן",         color: "#A855F7" },
  { id: "homeless",             label: "Homeless",     color: "#3B82F6" },
  { id: "winwin",               label: "WinWin",       color: "#22C55E" },
  { id: "facebook_marketplace", label: "FB Marketplace", color: "#60A5FA" },
  { id: "facebook_groups",      label: "FB קבוצות",   color: "#60A5FA" },
];

export default function SourceFilter() {
  const { sources, toggleSource } = useFilterStore();

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
        מקור
      </label>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        {SOURCES.map(s => {
          const active = sources.includes(s.id);
          return (
            <button
              key={s.id}
              onClick={() => toggleSource(s.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.38rem 0.65rem",
                borderRadius: "0.4rem",
                fontSize: "0.8rem",
                fontWeight: active ? 700 : 400,
                cursor: "pointer",
                textAlign: "right",
                transition: "all 0.15s",
                background: active ? "rgba(245,158,11,0.08)" : "transparent",
                color: active ? "#E6EDF3" : "#484F58",
                border: active ? "1px solid rgba(245,158,11,0.25)" : "1px solid transparent",
                width: "100%",
              }}
            >
              {/* Source color dot */}
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: s.color,
                  opacity: active ? 1 : 0.4,
                  boxShadow: active ? `0 0 0 2px ${s.color}30` : "none",
                  transition: "opacity 0.15s, box-shadow 0.15s",
                }}
              />
              {s.label}

              {/* Checkmark when active */}
              {active && (
                <span style={{ marginRight: "auto", color: "#F59E0B" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
