import { useNeighborhoods } from "../../hooks/useNeighborhoods";
import { useFilterStore } from "../../store/filterStore";

export default function NeighborhoodSelector() {
  const { city, neighborhood, setNeighborhood } = useFilterStore();
  const { neighborhoods, loading } = useNeighborhoods(city);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">שכונה</label>
      <select
        value={neighborhood ?? ""}
        onChange={e => setNeighborhood(e.target.value || null)}
        disabled={!city || loading}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent disabled:opacity-50 disabled:bg-gray-50"
      >
        <option value="">
          {!city ? "(בחר עיר קודם)" : "כל השכונות"}
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
