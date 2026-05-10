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
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">נוחיות</label>
      <div className="flex flex-wrap gap-2">
        {AMENITIES.map(({ key, label, icon }) => {
          const active = store[key] === true;
          return (
            <button
              key={key}
              onClick={() => store.toggleBool(key)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                active
                  ? "bg-[#0D1B2A] border-[#0D1B2A] text-white"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
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
