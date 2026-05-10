import { useFilterStore } from "../../store/filterStore";

const AMENITIES: { key: "hasParking" | "hasBalcony" | "petsAllowed" | "furnished"; label: string; icon: string }[] = [
  { key: "hasParking", label: "חניה", icon: "🅿" },
  { key: "hasBalcony", label: "מרפסת", icon: "🌿" },
  { key: "petsAllowed", label: "חיות מחמד", icon: "🐾" },
  { key: "furnished", label: "מרוהטת", icon: "🛋" },
];

export default function AmenitiesFilter() {
  const store = useFilterStore();

  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: "#a8a29e" }}>נוחיות</label>
      <div className="flex flex-wrap gap-1.5">
        {AMENITIES.map(({ key, label, icon }) => {
          const active = store[key] === true;
          return (
            <button
              key={key}
              onClick={() => store.toggleBool(key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={
                active
                  ? { background: "#0f172a", color: "#fff", border: "1.5px solid #0f172a" }
                  : { background: "#f7f5f0", color: "#57534e", border: "1.5px solid #e8e4dc" }
              }
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
