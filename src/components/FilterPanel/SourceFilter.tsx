import { useFilterStore } from "../../store/filterStore";

const SOURCES = [
  { id: "yad2", label: "יד2", color: "bg-red-500" },
  { id: "madlan", label: "מדלן", color: "bg-purple-600" },
  { id: "homeless", label: "Homeless", color: "bg-blue-500" },
  { id: "winwin", label: "WinWin", color: "bg-green-600" },
  { id: "facebook_marketplace", label: "FB Market", color: "bg-blue-900" },
  { id: "facebook_groups", label: "FB קבוצות", color: "bg-blue-900" },
];

export default function SourceFilter() {
  const { sources, toggleSource } = useFilterStore();

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">מקור</label>
      <div className="flex flex-wrap gap-2">
        {SOURCES.map(s => {
          const active = sources.includes(s.id);
          return (
            <button
              key={s.id}
              onClick={() => toggleSource(s.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                active
                  ? `${s.color} text-white border-transparent`
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
