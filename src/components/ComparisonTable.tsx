import { useFilterStore } from '../store/useFilterStore';
import { citiesData } from '../data/rentals';
import type { NeighborhoodData } from '../data/rentals';

interface ColData {
  neighborhood: string;
  data: NeighborhoodData;
}

function minIdx(cols: ColData[], getValue: (d: NeighborhoodData) => number): number {
  if (cols.length === 0) return -1;
  return cols.reduce((mi, col, i) => getValue(col.data) < getValue(cols[mi].data) ? i : mi, 0);
}

function CellVal({ val, isMin }: { val: string; isMin: boolean }) {
  return (
    <td className={`py-3 px-4 text-center text-sm font-medium ${isMin ? 'text-green-600 font-bold bg-green-50' : 'text-gray-700'}`}>
      {val}
    </td>
  );
}

export default function ComparisonTable() {
  const { city, comparisonList, rooms, clearComparison } = useFilterStore();
  const cityData = citiesData[city];
  const roomKey = rooms ?? '2';

  const cols: ColData[] = comparisonList
    .map(n => {
      const d = cityData?.neighborhoods[n]?.[roomKey];
      return d ? { neighborhood: n, data: d } : null;
    })
    .filter((x): x is ColData => x !== null);

  if (cols.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
        <div className="text-5xl mb-4">📊</div>
        <h3 className="text-xl font-bold text-[#0D1B2A] mb-2">השוואת שכונות</h3>
        <p className="text-gray-500">בחר 2–4 שכונות מרשימת התוצאות כדי להשוות ביניהן</p>
      </div>
    );
  }

  const avgIdx = minIdx(cols, d => d.avgRent);
  const medIdx = minIdx(cols, d => d.medianRent);
  const psmIdx = minIdx(cols, d => d.pricePerSqm);
  const countIdx = cols.reduce((mi, col, i) => col.data.sampleCount > cols[mi].data.sampleCount ? i : mi, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="font-bold text-[#0D1B2A]">השוואת שכונות</h3>
        <button
          onClick={clearComparison}
          className="text-xs text-red-500 hover:text-red-600 font-medium"
        >
          נקה הכל
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]" dir="rtl">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                מדד
              </th>
              {cols.map(c => (
                <th key={c.neighborhood} className="py-3 px-4 text-center text-sm font-bold text-[#0D1B2A]">
                  {c.neighborhood}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr>
              <td className="py-3 px-4 text-sm text-gray-600 font-medium">שכר דירה ממוצע</td>
              {cols.map((c, i) => (
                <CellVal key={c.neighborhood} val={`₪${c.data.avgRent.toLocaleString()}`} isMin={i === avgIdx} />
              ))}
            </tr>
            <tr className="bg-gray-25">
              <td className="py-3 px-4 text-sm text-gray-600 font-medium">שכר דירה חציוני</td>
              {cols.map((c, i) => (
                <CellVal key={c.neighborhood} val={`₪${c.data.medianRent.toLocaleString()}`} isMin={i === medIdx} />
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 text-sm text-gray-600 font-medium">מחיר למ"ר</td>
              {cols.map((c, i) => (
                <CellVal key={c.neighborhood} val={`₪${c.data.pricePerSqm}`} isMin={i === psmIdx} />
              ))}
            </tr>
            <tr className="bg-gray-25">
              <td className="py-3 px-4 text-sm text-gray-600 font-medium">טווח מחירים</td>
              {cols.map(c => (
                <td key={c.neighborhood} className="py-3 px-4 text-center text-sm text-gray-600">
                  ₪{c.data.minRent.toLocaleString()} – ₪{c.data.maxRent.toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 text-sm text-gray-600 font-medium">שינוי שנתי</td>
              {cols.map(c => (
                <td key={c.neighborhood} className={`py-3 px-4 text-center text-sm font-medium ${
                  c.data.yoyChange > 0 ? 'text-red-500' : c.data.yoyChange < 0 ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {c.data.yoyChange > 0 ? '+' : ''}{c.data.yoyChange}%
                </td>
              ))}
            </tr>
            <tr className="bg-gray-25">
              <td className="py-3 px-4 text-sm text-gray-600 font-medium">מספר נכסים</td>
              {cols.map((c, i) => (
                <td key={c.neighborhood} className={`py-3 px-4 text-center text-sm font-medium ${
                  i === countIdx ? 'text-blue-600 font-bold' : 'text-gray-700'
                }`}>
                  {c.data.sampleCount}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 text-sm text-gray-600 font-medium">מגמה</td>
              {cols.map(c => (
                <td key={c.neighborhood} className="py-3 px-4 text-center text-sm">
                  <span className={`font-bold text-lg ${
                    c.data.trend === 'up' ? 'text-red-500' : c.data.trend === 'down' ? 'text-green-500' : 'text-gray-400'
                  }`}>
                    {c.data.trend === 'up' ? '↑' : c.data.trend === 'down' ? '↓' : '→'}
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-400">
          <span className="inline-block w-3 h-3 bg-green-100 border border-green-300 rounded ml-1" />
          ירוק = הנמוך ביותר בעמודה
        </p>
      </div>
    </div>
  );
}
