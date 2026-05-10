import { useFilterStore } from '../store/useFilterStore';
import { citiesData, roomTypes, roomLabels } from '../data/rentals';
import type { RoomType } from '../data/rentals';

const AMENITIES: { key: 'parking' | 'balcony' | 'elevator' | 'pets' | 'furnished'; label: string }[] = [
  { key: 'parking', label: 'חניה' },
  { key: 'balcony', label: 'מרפסת' },
  { key: 'elevator', label: 'מעלית' },
  { key: 'pets', label: 'חיות מחמד' },
  { key: 'furnished', label: 'מרוהטת' },
];

export default function FilterPanel() {
  const {
    city, neighborhoods, rooms, priceMin, priceMax,
    parking, balcony, elevator, pets, furnished,
    setCity, toggleNeighborhood, setRooms,
    setPriceMin, setPriceMax,
    toggleFilter, reset,
  } = useFilterStore();

  const cityData = citiesData[city];
  const neighborhoodList = cityData ? Object.keys(cityData.neighborhoods) : [];

  return (
    <aside className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-5 sticky top-4 h-fit">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#0D1B2A]">סינון</h2>
        <button
          onClick={reset}
          className="text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
        >
          איפוס
        </button>
      </div>

      {/* City selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">עיר</label>
        <select
          value={city}
          onChange={e => setCity(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
        >
          {Object.keys(citiesData).map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Neighborhood selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">שכונה</label>
        <div className="flex flex-wrap gap-2">
          {neighborhoodList.map(n => (
            <button
              key={n}
              onClick={() => toggleNeighborhood(n)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                neighborhoods.includes(n)
                  ? 'bg-amber-400 border-amber-400 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-amber-300'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        {neighborhoods.length === 0 && (
          <p className="text-xs text-gray-400 mt-1">כל השכונות מוצגות</p>
        )}
      </div>

      {/* Rooms */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">מספר חדרים</label>
        <div className="grid grid-cols-3 gap-1.5">
          {roomTypes.map(r => (
            <button
              key={r}
              onClick={() => setRooms(rooms === r ? null : r as RoomType)}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                rooms === r
                  ? 'bg-[#0D1B2A] border-[#0D1B2A] text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              {roomLabels[r]}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          טווח מחיר: ₪{priceMin.toLocaleString()} – ₪{priceMax.toLocaleString()}
        </label>
        <div className="flex flex-col gap-2">
          <div>
            <span className="text-xs text-gray-500">מינימום</span>
            <input
              type="range"
              min={1500}
              max={priceMax - 500}
              step={500}
              value={priceMin}
              onChange={e => setPriceMin(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>
          <div>
            <span className="text-xs text-gray-500">מקסימום</span>
            <input
              type="range"
              min={priceMin + 500}
              max={30000}
              step={500}
              value={priceMax}
              onChange={e => setPriceMax(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">נוחיות</label>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map(({ key, label }) => {
            const active = { parking, balcony, elevator, pets, furnished }[key];
            return (
              <button
                key={key}
                onClick={() => toggleFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  active
                    ? 'bg-[#0D1B2A] border-[#0D1B2A] text-white'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
