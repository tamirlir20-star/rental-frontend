import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts';
import { useFilterStore } from '../store/useFilterStore';
import { citiesData } from '../data/rentals';

const COLORS = ['#F59E0B', '#0D1B2A', '#10B981', '#6366F1', '#EF4444'];

function formatPrice(v: number) {
  return `₪${v.toLocaleString()}`;
}

export default function RentChart() {
  const { city, rooms, comparisonList } = useFilterStore();
  const cityData = citiesData[city];
  const roomKey = rooms ?? '2';

  // Line chart: history of comparison neighborhoods (or all if none selected)
  const displayNeighborhoods = comparisonList.length > 0
    ? comparisonList
    : Object.keys(cityData?.neighborhoods ?? {}).slice(0, 3);

  const historyData: Record<string, number>[] = [];
  if (cityData) {
    const firstN = displayNeighborhoods[0];
    const months = cityData.neighborhoods[firstN]?.[roomKey]?.history ?? [];
    months.forEach(({ month }) => {
      const row: Record<string, number | string> = { month };
      displayNeighborhoods.forEach(n => {
        const h = cityData.neighborhoods[n]?.[roomKey]?.history ?? [];
        const found = h.find(x => x.month === month);
        if (found) row[n] = found.avg;
      });
      historyData.push(row as Record<string, number>);
    });
  }

  // Bar chart: avg price per sqm by city for current room type
  const barData = Object.entries(citiesData)
    .map(([cityName, cd]) => {
      const avgPsm = Object.values(cd.neighborhoods)
        .map(n => n[roomKey]?.pricePerSqm ?? 0)
        .filter(v => v > 0);
      const mean = avgPsm.length > 0 ? Math.round(avgPsm.reduce((a, b) => a + b, 0) / avgPsm.length) : 0;
      return { city: cityName, pricePerSqm: mean };
    })
    .sort((a, b) => b.pricePerSqm - a.pricePerSqm);

  return (
    <div className="flex flex-col gap-6">
      {/* Line chart */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-[#0D1B2A] mb-1">שכר דירה ממוצע — 12 חודשים אחרונים</h3>
        <p className="text-xs text-gray-400 mb-4">
          {displayNeighborhoods.join(' | ')} · {city}
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={historyData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={v => `₪${(v / 1000).toFixed(0)}K`}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              width={55}
            />
            <Tooltip
              formatter={(val) => [formatPrice(Number(val)), '']}
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {displayNeighborhoods.map((n, i) => (
              <Line
                key={n}
                type="monotone"
                dataKey={n}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-[#0D1B2A] mb-1">מחיר למ"ר לפי עיר</h3>
        <p className="text-xs text-gray-400 mb-4">ממוצע לכל הסוגים · ממוין יורד</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="city"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={v => `₪${v}`}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              width={55}
            />
            <Tooltip
              formatter={(val) => [`₪${Number(val)} למ"ר`, 'מחיר ממוצע']}
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
            />
            <Bar dataKey="pricePerSqm" radius={[6, 6, 0, 0]}>
              {barData.map((entry, i) => (
                <Cell
                  key={entry.city}
                  fill={entry.city === city ? '#F59E0B' : i < 2 ? '#EF4444' : i >= barData.length - 2 ? '#10B981' : '#93C5FD'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-400 mt-2 text-center">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 ml-1" />עיר נבחרת
          <span className="inline-block w-2 h-2 rounded-full bg-red-400 ml-1 mr-2" />יקר ביותר
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 ml-1 mr-2" />זול ביותר
        </p>
      </div>
    </div>
  );
}
