import { useFilterStore } from "../../store/filterStore";
import type { FilterState } from "../../store/filterStore";

interface Props {
  total: number;
  isRefreshing: boolean;
}

const SORTS: { value: FilterState["sortBy"]; label: string }[] = [
  { value: "first_seen", label: "חדש ביותר" },
  { value: "price", label: "מחיר" },
  { value: "rooms", label: "חדרים" },
  { value: "size_sqm", label: "שטח" },
];

export default function SortBar({ total, isRefreshing }: Props) {
  const { sortBy, sortDir, setSortBy, setSortDir } = useFilterStore();

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <p className="text-sm text-gray-500">
          {isRefreshing ? (
            <span className="text-amber-600 font-medium">מתעדכן...</span>
          ) : (
            <span><strong className="text-gray-800">{total.toLocaleString("he-IL")}</strong> מודעות</span>
          )}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">מיון:</span>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as FilterState["sortBy"])}
          className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          {SORTS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <button
          onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
          className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white hover:bg-gray-50 transition-colors"
          title={sortDir === "asc" ? "עולה" : "יורד"}
        >
          {sortDir === "asc" ? "↑" : "↓"}
        </button>
      </div>
    </div>
  );
}
