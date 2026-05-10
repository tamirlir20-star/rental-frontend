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

  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: "#a8a29e" }}>מחיר חודשי</label>

      <div
        className="flex items-center justify-between px-3 py-2 rounded-lg mb-3 text-sm font-semibold"
        style={{ background: "#f7f5f0", color: "#1c1917" }}
      >
        <span>{fmt(min)}</span>
        <span style={{ color: "#c8c3bb" }}>—</span>
        <span>{fmt(max)}</span>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <p className="text-xs mb-1.5" style={{ color: "#a8a29e" }}>מינימום</p>
          <input type="range" min={MIN} max={max - STEP} step={STEP} value={min}
            onChange={e => setPriceMin(Number(e.target.value))} />
        </div>
        <div>
          <p className="text-xs mb-1.5" style={{ color: "#a8a29e" }}>מקסימום</p>
          <input type="range" min={min + STEP} max={MAX} step={STEP} value={max}
            onChange={e => setPriceMax(Number(e.target.value))} />
        </div>
      </div>

      {(priceMin || priceMax) && (
        <button
          onClick={() => { setPriceMin(null); setPriceMax(null); }}
          className="text-xs mt-2 font-semibold"
          style={{ color: "#f59e0b" }}
        >
          אפס טווח
        </button>
      )}
    </div>
  );
}
