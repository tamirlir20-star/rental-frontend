import { ROOM_OPTIONS } from "../../utils/format";
import { useFilterStore } from "../../store/filterStore";

export default function RoomsFilter() {
  const { roomsMin, roomsMax, setRoomsMin, setRoomsMax } = useFilterStore();

  const toggle = (value: number) => {
    const isMax = value === 4; // 4+ means roomsMin=4, no max
    if (isMax) {
      if (roomsMin === 4) {
        setRoomsMin(null);
        setRoomsMax(null);
      } else {
        setRoomsMin(4);
        setRoomsMax(null);
      }
    } else {
      // Single room selection: set both min and max
      if (roomsMin === value && roomsMax === value) {
        setRoomsMin(null);
        setRoomsMax(null);
      } else {
        setRoomsMin(value);
        setRoomsMax(value);
      }
    }
  };

  const isActive = (value: number) => {
    if (value === 4) return roomsMin === 4 && roomsMax == null;
    return roomsMin === value && roomsMax === value;
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">חדרים</label>
      <div className="flex flex-wrap gap-1.5">
        {ROOM_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => toggle(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isActive(opt.value)
                ? "bg-[#0D1B2A] border-[#0D1B2A] text-white"
                : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-400"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
