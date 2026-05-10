import { useFilterStore } from "../../store/filterStore";
import { formatPrice } from "../../utils/format";

const MIN = 1500;
const MAX = 30000;
const STEP = 500;

export default function PriceRangeFilter() {
  const { priceMin, priceMax, setPriceMin, setPriceMax } = useFilterStore();
  const min = priceMin ?? MIN;
  const max = priceMax ?? MAX;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-semibold text-gray-700">מחיר</label>
        <span className="text-xs text-gray-500">
          {formatPrice(min)} – {formatPrice(max)}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-0.5">
            <span>מינימום</span>
          </div>
          <input
            type="range"
            min={MIN}
            max={max - STEP}
            step={STEP}
            value={min}
            onChange={e => setPriceMin(Number(e.target.value))}
            className="w-full accent-amber-400"
          />
        </div>
        <div>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-0.5">
            <span>מקסימום</span>
          </div>
          <input
            type="range"
            min={min + STEP}
            max={MAX}
            step={STEP}
            value={max}
            onChange={e => setPriceMax(Number(e.target.value))}
            className="w-full accent-amber-400"
          />
        </div>
      </div>
      {(priceMin || priceMax) && (
        <button
          onClick={() => { setPriceMin(null); setPriceMax(null); }}
          className="text-xs text-amber-600 hover:underline mt-1"
        >
          אפס מחיר
        </button>
      )}
    </div>
  );
}
