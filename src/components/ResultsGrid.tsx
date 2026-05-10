import { useState, useEffect } from 'react';
import { useFilterStore } from '../store/useFilterStore';
import { citiesData } from '../data/rentals';
import type { NeighborhoodData } from '../data/rentals';
import PropertyCard from './PropertyCard';

type ResultItem = { neighborhood: string; data: NeighborhoodData };

const SORT_OPTIONS = [
  { value: 'price_asc', label: 'מחיר: מהזול ליקר' },
  { value: 'price_desc', label: 'מחיר: מהיקר לזול' },
  { value: 'value', label: 'ערך הכי טוב' },
] as const;

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 animate-pulse">
      <div className="flex justify-between mb-3">
        <div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-1" />
          <div className="h-3 bg-gray-100 rounded w-16" />
        </div>
        <div className="h-6 bg-gray-200 rounded w-20" />
      </div>
      <div className="h-8 bg-gray-200 rounded w-32 mb-1" />
      <div className="h-3 bg-gray-100 rounded w-20 mb-3" />
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[0, 1, 2].map(i => <div key={i} className="h-12 bg-gray-100 rounded-lg" />)}
      </div>
      <div className="h-8 bg-gray-100 rounded-lg" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">🏠</div>
      <h3 className="text-xl font-bold text-[#0D1B2A] mb-2">לא נמצאו תוצאות</h3>
      <p className="text-gray-500 mb-4">נסה להרחיב את טווח המחיר או לשנות את הפילטרים</p>
      <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
        <li>הגדל את טווח המחיר</li>
        <li>בטל סינון שכונה ספציפית</li>
        <li>בחר מספר חדרים שונה</li>
      </ul>
    </div>
  );
}

export default function ResultsGrid() {
  const { city, neighborhoods, rooms, priceMin, priceMax, sortBy, setSortBy } = useFilterStore();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResultItem[]>([]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const cityData = citiesData[city];
      if (!cityData) { setResults([]); setLoading(false); return; }

      const activeNeighborhoods = neighborhoods.length > 0
        ? neighborhoods
        : Object.keys(cityData.neighborhoods);

      const roomKey = rooms ?? '2';
      const items: ResultItem[] = [];

      for (const n of activeNeighborhoods) {
        const nData = cityData.neighborhoods[n];
        if (!nData) continue;
        const rd = nData[roomKey];
        if (!rd) continue;
        if (rd.avgRent < priceMin || rd.avgRent > priceMax) continue;
        items.push({ neighborhood: n, data: rd });
      }

      // Sort
      if (sortBy === 'price_asc') items.sort((a, b) => a.data.avgRent - b.data.avgRent);
      else if (sortBy === 'price_desc') items.sort((a, b) => b.data.avgRent - a.data.avgRent);
      else if (sortBy === 'value') items.sort((a, b) => a.data.pricePerSqm - b.data.pricePerSqm);

      setResults(items);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [city, neighborhoods, rooms, priceMin, priceMax, sortBy]);

  const bestValueIdx = results.length > 0
    ? results.reduce((bi, item, i) => item.data.pricePerSqm < results[bi].data.pricePerSqm ? i : bi, 0)
    : -1;

  return (
    <div>
      {/* Sort bar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {loading ? 'מחפש...' : `${results.length} שכונות נמצאו`}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">מיון:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : results.length === 0
          ? <EmptyState />
          : results.map((r, i) => (
            <PropertyCard
              key={r.neighborhood}
              neighborhood={r.neighborhood}
              data={r.data}
              isBestValue={i === bestValueIdx}
              rank={i + 1}
            />
          ))
        }
      </div>
    </div>
  );
}
