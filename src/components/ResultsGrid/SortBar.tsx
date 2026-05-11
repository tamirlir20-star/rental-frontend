import { useFilterStore } from "../../store/filterStore";
import type { FilterState } from "../../store/filterStore";

interface Props {
  total: number;
  isRefreshing: boolean;
}

const SORTS: { value: FilterState["sortBy"]; label: string }[] = [
  { value: "first_seen", label: "חדש ביותר" },
  { value: "price",      label: "מחיר" },
  { value: "rooms",      label: "חדרים" },
  { value: "size_sqm",   label: "שטח" },
];

export default function SortBar({ total, isRefreshing }: Props) {
  const { sortBy, sortDir, setSortBy, setSortDir } = useFilterStore();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "0.85rem",
      }}
    >
      {/* Result count */}
      <p style={{ fontSize: "0.82rem", color: "#484F58" }}>
        {isRefreshing ? (
          <span className="glow-pulse" style={{ color: "#F59E0B", fontWeight: 600 }}>
            מתעדכן...
          </span>
        ) : (
          <>
            <strong style={{ color: "#E6EDF3", fontWeight: 800, fontSize: "0.9rem" }}>
              {total.toLocaleString("he-IL")}
            </strong>
            {" "}תוצאות
          </>
        )}
      </p>

      {/* Sort controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <span style={{ fontSize: "0.72rem", color: "#30363D" }}>מיון:</span>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as FilterState["sortBy"])}
          style={{
            background: "#161B22",
            border: "1px solid #30363D",
            borderRadius: "0.35rem",
            padding: "0.3rem 0.6rem",
            fontSize: "0.78rem",
            fontWeight: 600,
            color: "#8B949E",
            outline: "none",
            cursor: "pointer",
          }}
        >
          {SORTS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <button
          onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
          title={sortDir === "asc" ? "עולה" : "יורד"}
          style={{
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#161B22",
            border: "1px solid #30363D",
            borderRadius: "0.35rem",
            cursor: "pointer",
            color: "#8B949E",
            transition: "border-color 0.15s, color 0.15s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#484F58";
            (e.currentTarget as HTMLButtonElement).style.color = "#E6EDF3";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#30363D";
            (e.currentTarget as HTMLButtonElement).style.color = "#8B949E";
          }}
        >
          {sortDir === "asc" ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
