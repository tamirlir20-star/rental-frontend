import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { useFilterStore } from '../store/filterStore';
import { useListings } from '../hooks/useListings';

function fmt(v: number) { return `₪${v.toLocaleString('he-IL')}`; }

export default function RentChart() {
  const filters = useFilterStore();
  const { data, status } = useListings(filters);

  if (status === 'loading' || !data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[1, 2].map(i => (
          <div key={i} className="animate-pulse" style={{
            background: '#161B22', border: '1px solid #21262D',
            borderRadius: '0.65rem', height: 320,
          }} />
        ))}
      </div>
    );
  }

  const listings = data.listings.filter(l => l.price && l.price > 0);

  // Price by neighborhood
  const byNeighborhood: Record<string, number[]> = {};
  listings.forEach(l => {
    const key = l.neighborhood || l.city || 'אחר';
    if (!byNeighborhood[key]) byNeighborhood[key] = [];
    byNeighborhood[key].push(l.price!);
  });
  const neighborhoodBars = Object.entries(byNeighborhood)
    .map(([name, prices]) => ({
      name,
      avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      count: prices.length,
    }))
    .filter(d => d.count >= 2)
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 15);

  const maxAvg = Math.max(...neighborhoodBars.map(d => d.avg));
  const minAvg = Math.min(...neighborhoodBars.map(d => d.avg));

  // Price distribution buckets
  const buckets: Record<string, number> = {
    'עד 4,000': 0, '4-6K': 0, '6-8K': 0,
    '8-10K': 0, '10-15K': 0, 'מעל 15K': 0,
  };
  listings.forEach(l => {
    const p = l.price!;
    if (p < 4000) buckets['עד 4,000']++;
    else if (p < 6000) buckets['4-6K']++;
    else if (p < 8000) buckets['6-8K']++;
    else if (p < 10000) buckets['8-10K']++;
    else if (p < 15000) buckets['10-15K']++;
    else buckets['מעל 15K']++;
  });
  const distData = Object.entries(buckets).map(([range, count]) => ({ range, count }));

  const cardStyle: React.CSSProperties = {
    background: '#161B22',
    border: '1px solid #21262D',
    borderRadius: '0.65rem',
    padding: '1.25rem 1.5rem',
  };
  const titleStyle: React.CSSProperties = {
    fontSize: '0.85rem', fontWeight: 700, color: '#E6EDF3', marginBottom: '0.25rem',
  };
  const subStyle: React.CSSProperties = {
    fontSize: '0.72rem', color: '#484F58', marginBottom: '1rem',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Avg price by neighborhood */}
      {neighborhoodBars.length > 0 && (
        <div style={cardStyle}>
          <p style={titleStyle}>מחיר ממוצע לפי שכונה</p>
          <p style={subStyle}>{filters.city || 'כל הערים'} · {neighborhoodBars.length} שכונות</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={neighborhoodBars} layout="vertical"
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#21262D" horizontal={false} />
              <XAxis type="number" tickFormatter={v => `₪${(v / 1000).toFixed(0)}K`}
                tick={{ fontSize: 10, fill: '#484F58' }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" width={90}
                tick={{ fontSize: 10, fill: '#8B949E' }} tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(val) => [fmt(Number(val)), 'ממוצע']}
                contentStyle={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 6, fontSize: 12 }}
                labelStyle={{ color: '#E6EDF3' }}
              />
              <Bar dataKey="avg" radius={[0, 4, 4, 0]}>
                {neighborhoodBars.map((entry, i) => {
                  const ratio = maxAvg === minAvg ? 0.5 : (entry.avg - minAvg) / (maxAvg - minAvg);
                  const color = ratio > 0.75 ? '#EF4444' : ratio > 0.5 ? '#F59E0B' : ratio > 0.25 ? '#84CC16' : '#10B981';
                  return <Cell key={i} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Price distribution */}
      <div style={cardStyle}>
        <p style={titleStyle}>התפלגות מחירים</p>
        <p style={subStyle}>{listings.length} מודעות</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={distData} margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#21262D" vertical={false} />
            <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#8B949E' }}
              tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#484F58' }}
              tickLine={false} axisLine={false} width={30} />
            <Tooltip
              formatter={(val) => [val, 'מודעות']}
              contentStyle={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 6, fontSize: 12 }}
              labelStyle={{ color: '#E6EDF3' }}
            />
            <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} opacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
