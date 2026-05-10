import { useFilterStore } from "../../store/filterStore";

export default function Header() {
  const { city } = useFilterStore();

  return (
    <header className="bg-[#0D1B2A] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏡</span>
          <div>
            <h1 className="text-xl font-bold leading-tight">מחירון שכירות ישראל</h1>
            <p className="text-xs text-blue-200">מודעות חיות מיד2, מדלן ועוד</p>
          </div>
        </div>
        {city && (
          <div className="hidden sm:block text-right">
            <p className="text-xs text-blue-200">מסנן לפי עיר</p>
            <p className="font-semibold text-amber-400">{city}</p>
          </div>
        )}
      </div>
    </header>
  );
}
