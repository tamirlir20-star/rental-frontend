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
      <label
        style={{
          display: "block",
          fontSize: "0.7rem",
          fontWeight: 700,
          color: "#484F58",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: "0.55rem",
        }}
      >
        חדרים
      </label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
        {ROOM_OPTIONS.map(opt => {
          const active = isActive(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className={active ? "filter-active" : ""}
              style={{
                padding: "0.3rem 0.65rem",
                borderRadius: "0.35rem",
                fontSize: "0.78rem",
                fontWeight: active ? 700 : 500,
                cursor: "pointer",
                transition: "all 0.15s",
                background: active ? "#F59E0B" : "#21262D",
                color: active ? "#0E1117" : "#8B949E",
                border: active ? "1px solid #F59E0B" : "1px solid #30363D",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
