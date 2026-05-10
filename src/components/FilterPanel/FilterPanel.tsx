import { useFilterStore } from "../../store/filterStore";
import CitySelector from "./CitySelector";
import NeighborhoodSelector from "./NeighborhoodSelector";
import RoomsFilter from "./RoomsFilter";
import PriceRangeFilter from "./PriceRangeFilter";
import AmenitiesFilter from "./AmenitiesFilter";
import SourceFilter from "./SourceFilter";

export default function FilterPanel() {
  const { reset } = useFilterStore();

  return (
    <aside className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-5 sticky top-4 h-fit">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-[#0D1B2A]">סינון</h2>
        <button
          onClick={reset}
          className="text-xs text-amber-600 hover:text-amber-700 font-semibold transition-colors"
        >
          נקה הכל
        </button>
      </div>

      <CitySelector />
      <NeighborhoodSelector />
      <RoomsFilter />
      <PriceRangeFilter />
      <AmenitiesFilter />
      <SourceFilter />
    </aside>
  );
}
