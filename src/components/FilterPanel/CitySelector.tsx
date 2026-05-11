import { useCities } from "../../hooks/useCities";
import { useFilterStore } from "../../store/filterStore";

export default function CitySelector() {
  const { cities, loading } = useCities();
  const { city, setCity } = useFilterStore();

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
        עיר
      </label>
      <select
        value={city ?? ""}
        onChange={e => setCity(e.target.value || null)}
        disabled={loading}
        style={{
          width: "100%",
          background: "#0E1117",
          border: "1px solid #30363D",
          borderRadius: "0.4rem",
          padding: "0.45rem 0.65rem",
          fontSize: "0.83rem",
          color: city ? "#E6EDF3" : "#484F58",
          outline: "none",
          cursor: "pointer",
          transition: "border-color 0.15s",
        }}
        onFocus={e => (e.currentTarget.style.borderColor = "#F59E0B")}
        onBlur={e => (e.currentTarget.style.borderColor = "#30363D")}
      >
        <option value="">כל הערים</option>
        {cities.map(c => (
          <option key={c.city} value={c.city}>
            {c.city} ({c.count})
          </option>
        ))}
      </select>
    </div>
  );
}
