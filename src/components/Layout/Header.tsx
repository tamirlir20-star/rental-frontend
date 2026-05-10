import { useFilterStore } from "../../store/filterStore";

export default function Header() {
  const { city } = useFilterStore();

  return (
    <header style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }} className="text-white">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}
          >
            🏠
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight tracking-tight">מחירון שכירות ישראל</h1>
            <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>נתונים חיים מיד2, מדלן ועוד</p>
          </div>
        </div>

        {city && (
          <div
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.25)", color: "#fbbf24" }}
          >
            <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: "0.75rem" }}>מסנן:</span>
            {city}
          </div>
        )}
      </div>
    </header>
  );
}
