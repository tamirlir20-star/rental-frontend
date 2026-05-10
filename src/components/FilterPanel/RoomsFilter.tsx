import { ROOM_OPTIONS } from "../../utils/format";
import { useFilterStore } from "../../store/filterStore";

export default function RoomsFilter() {
  const { roomsMin, roomsMax, setRoomsMin, setRoomsMax } = useFilterStore();

  const toggle = (value: number) => {
    const isMax = value === 4;
    if (isMax) {
      if (roomsMin === 4) { setRoomsMin(null); setRoomsMax(null); }
      else { setRoomsMin(4); setRoomsMax(null); }
    } else {
      if (roomsMin === value && roomsMax === value) { setRoomsMin(null); setRoomsMax(null); }
      else { setRoomsMin(value); setRoomsMax(value); }
    }
  };

  const isActive = (value: number) => {
    if (value === 4) return roomsMin === 4 && roomsMax == null;
    return roomsMin === value && roomsMax === value;
  };

  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: "#a8a29e" }}>חדרים</label>
      <div className="flex flex-wrap gap-1.5">
        {ROOM_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => toggle(opt.value)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={
              isActive(opt.value)
                ? { background: "#0f172a", color: "#fff", border: "1.5px solid #0f172a" }
                : { background: "#f7f5f0", color: "#57534e", border: "1.5px solid #e8e4dc" }
            }
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
