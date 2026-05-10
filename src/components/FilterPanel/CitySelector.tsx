import { useCities } from "../../hooks/useCities";
import { useFilterStore } from "../../store/filterStore";

export default function CitySelector() {
  const { cities, loading } = useCities();
  const { city, setCity } = useFilterStore();

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">עיר</label>
      <select
        value={city ?? ""}
        onChange={e => setCity(e.target.value || null)}
        disabled={loading}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent disabled:opacity-50"
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
