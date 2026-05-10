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
      <p className="text-sm font-medium" style={{ color: "#78716c" }}>
        {isRefreshing ? (
          <span style={{ color: "#f59e0b" }}>מתעדכן...</span>
        ) : (
          <><strong style={{ color: "#1c1917", fontWeight: 700 }}>{total.toLocaleString("he-IL")}</strong> תוצאות</>
        )}
      </p>

      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: "#a8a29e" }}>מיון:</span>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as FilterState["sortBy"])}
          className="text-sm font-medium px-3 py-1.5 rounded-lg outline-none cursor-pointer"
          style={{ background: "#fff", border: "1px solid #e8e4dc", color: "#1c1917" }}
        >
          {SORTS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <button
          onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
          className="px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
          style={{ background: "#fff", border: "1px solid #e8e4dc", color: "#57534e" }}
          title={sortDir === "asc" ? "עולה" : "יורד"}
        >
          {sortDir === "asc" ? "↑" : "↓"}
        </button>
      </div>
    </div>
  );
}
