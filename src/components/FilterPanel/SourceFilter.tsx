import { useFilterStore } from "../../store/filterStore";

const SOURCES = [
  { id: "yad2", label: "יד2", dot: "#ef4444" },
  { id: "madlan", label: "מדלן", dot: "#a855f7" },
  { id: "homeless", label: "Homeless", dot: "#3b82f6" },
  { id: "winwin", label: "WinWin", dot: "#22c55e" },
  { id: "facebook_marketplace", label: "FB Market", dot: "#1d4ed8" },
  { id: "facebook_groups", label: "FB קבוצות", dot: "#1d4ed8" },
];

export default function SourceFilter() {
  const { sources, toggleSource } = useFilterStore();

  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: "#a8a29e" }}>מקור</label>
      <div className="flex flex-col gap-1.5">
        {SOURCES.map(s => {
          const active = sources.includes(s.id);
          return (
            <button
              key={s.id}
              onClick={() => toggleSource(s.id)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-right"
              style={
                active
                  ? { background: "#0f172a", color: "#fff", border: "1.5px solid #0f172a" }
                  : { background: "#f7f5f0", color: "#57534e", border: "1.5px solid #e8e4dc" }
              }
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: active ? "#fff" : s.dot }}
              />
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
