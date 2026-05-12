import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useCities } from '../hooks/useCities';
import { useFilterStore } from '../store/filterStore';

const CITY_COORDS: Record<string, [number, number]> = {
  'תל אביב': [32.0853, 34.7818],
  'ירושלים': [31.7683, 35.2137],
  'חיפה': [32.7940, 34.9896],
  'ראשון לציון': [31.9730, 34.7895],
  'נתניה': [32.3215, 34.8532],
  'באר שבע': [31.2518, 34.7913],
  'פתח תקווה': [32.0840, 34.8878],
  'אשדוד': [31.8040, 34.6550],
  'חולון': [32.0114, 34.7742],
  'רמת גן': [32.0680, 34.8240],
  'בת ים': [32.0230, 34.7510],
  'נצרת': [32.7021, 35.2978],
  'הרצליה': [32.1640, 34.8440],
  'כפר סבא': [32.1780, 34.9070],
  'רעננה': [32.1840, 34.8710],
  'מודיעין': [31.8980, 35.0100],
  'אשקלון': [31.6690, 34.5710],
  'רחובות': [31.8950, 34.8110],
  'גבעתיים': [32.0720, 34.8100],
  'קריית שמונה': [33.2074, 35.5695],
};

function getColor(count: number, max: number): string {
  const ratio = max > 0 ? count / max : 0;
  if (ratio > 0.6) return '#F59E0B';
  if (ratio > 0.3) return '#10B981';
  return '#3B82F6';
}

export default function RentMap() {
  const { cities } = useCities();
  const { setCity } = useFilterStore();

  const mapped = cities
    .map(c => ({ ...c, coords: CITY_COORDS[c.city] }))
    .filter(c => c.coords);

  const maxCount = Math.max(...mapped.map(c => c.count), 1);

  return (
    <div style={{
      background: '#161B22',
      border: '1px solid #21262D',
      borderRadius: '0.65rem',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #21262D' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#E6EDF3', margin: 0 }}>מפת ערים</p>
        <p style={{ fontSize: '0.72rem', color: '#484F58', margin: '0.2rem 0 0' }}>
          לחץ על עיר לסינון · גודל הנקודה לפי מספר מודעות
        </p>
      </div>

      <MapContainer
        center={[31.5, 34.85]}
        zoom={8}
        style={{ height: 480, width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mapped.map(c => (
          <CircleMarker
            key={c.city}
            center={c.coords!}
            radius={8 + Math.round((c.count / maxCount) * 14)}
            pathOptions={{
              fillColor: getColor(c.count, maxCount),
              fillOpacity: 0.85,
              color: 'rgba(255,255,255,0.3)',
              weight: 1.5,
            }}
            eventHandlers={{ click: () => setCity(c.city) }}
          >
            <Popup>
              <div dir="rtl" style={{ minWidth: 140, fontFamily: 'inherit' }}>
                <p style={{ fontWeight: 700, margin: '0 0 4px', fontSize: 14 }}>{c.city}</p>
                <p style={{ margin: 0, fontSize: 12, color: '#6B7280' }}>{c.count} מודעות</p>
                <button
                  onClick={() => setCity(c.city)}
                  style={{
                    marginTop: 8, width: '100%', background: '#F59E0B',
                    color: '#000', border: 'none', borderRadius: 6,
                    padding: '4px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  סנן לעיר זו
                </button>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <div style={{
        padding: '0.65rem 1.25rem', borderTop: '1px solid #21262D',
        display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '0.72rem', color: '#484F58' }}>מודעות:</span>
        {[
          { color: '#F59E0B', label: 'הרבה' },
          { color: '#10B981', label: 'בינוני' },
          { color: '#3B82F6', label: 'מעט' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
            <span style={{ fontSize: '0.72rem', color: '#484F58' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
