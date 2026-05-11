import { useNeighborhoods } from "../../hooks/useNeighborhoods";
import { useFilterStore } from "../../store/filterStore";

export default function NeighborhoodSelector() {
  const { city, neighborhood, setNeighborhood } = useFilterStore();
  const { neighborhoods, loading } = useNeighborhoods(city);

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
          marginBottom: "0.5rem",
        }}
      >
        שכונה
      </label>
      <select
        value={neighborhood ?? ""}
        onChange={e => setNeighborhood(e.target.value || null)}
        disabled={!city || loading}
        style={{
          width: "100%",
          background: "#0E1117",
          border: "1px solid #30363D",
          borderRadius: "0.4rem",
          padding: "0.45rem 0.65rem",
          fontSize: "0.83rem",
          color: neighborhood ? "#E6EDF3" : "#484F58",
          outline: "none",
          cursor: !city ? "not-allowed" : "pointer",
          opacity: !city ? 0.4 : 1,
          transition: "border-color 0.15s",
        }}
        onFocus={e => (e.currentTarget.style.borderColor = "#F59E0B")}
        onBlur={e => (e.currentTarget.style.borderColor = "#30363D")}
      >
        <option value="">
          {!city ? "בחר עיר קודם" : "כל השכונות"}
        </option>
        {neighborhoods.map(n => (
          <option key={n.neighborhood} value={n.neighborhood}>
            {n.neighborhood} ({n.count})
          </option>
        ))}
      </select>
    </div>
  );
}
