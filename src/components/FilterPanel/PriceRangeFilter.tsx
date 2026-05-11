import { useFilterStore } from "../../store/filterStore";

const MIN = 1500;
const MAX = 30000;
const STEP = 500;

function fmt(n: number) {
  return "₪" + n.toLocaleString("he-IL");
}

export default function PriceRangeFilter() {
  const { priceMin, priceMax, setPriceMin, setPriceMax } = useFilterStore();
  const min = priceMin ?? MIN;
  const max = priceMax ?? MAX;
  const hasFilter = priceMin != null || priceMax != null;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.55rem" }}>
        <label
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "#484F58",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          מחיר חודשי
        </label>
        {hasFilter && (
          <button
            onClick={() => { setPriceMin(null); setPriceMax(null); }}
            style={{
              fontSize: "0.68rem",
              fontWeight: 600,
              color: "#F59E0B",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            אפס
          </button>
        )}
      </div>

      {/* Range display */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#0E1117",
          border: "1px solid #30363D",
          borderRadius: "0.4rem",
          padding: "0.4rem 0.65rem",
          marginBottom: "0.75rem",
        }}
      >
        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#E6EDF3" }}>{fmt(min)}</span>
        <span style={{ fontSize: "0.75rem", color: "#30363D" }}>—</span>
        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#E6EDF3" }}>{fmt(max)}</span>
      </div>

      {/* Sliders */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        <div>
          <p style={{ fontSize: "0.68rem", color: "#484F58", marginBottom: "0.3rem" }}>מינימום</p>
          <input
            type="range"
            min={MIN}
            max={max - STEP}
            step={STEP}
            value={min}
            onChange={e => setPriceMin(Number(e.target.value))}
          />
        </div>
        <div>
          <p style={{ fontSize: "0.68rem", color: "#484F58", marginBottom: "0.3rem" }}>מקסימום</p>
          <input
            type="range"
            min={min + STEP}
            max={MAX}
            step={STEP}
            value={max}
            onChange={e => setPriceMax(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
