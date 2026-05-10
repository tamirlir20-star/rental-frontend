import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useFilterStore } from '../store/useFilterStore';
import { citiesData, roomLabels } from '../data/rentals';
import type { RoomType } from '../data/rentals';

const ROOM_TYPES: RoomType[] = ['studio', '1', '2', '3', '4'];

function getColor(avg: number, min: number, max: number): string {
  if (max === min) return '#F59E0B';
  const ratio = (avg - min) / (max - min);
  if (ratio < 0.25) return '#10B981';
  if (ratio < 0.5) return '#84CC16';
  if (ratio < 0.75) return '#F59E0B';
  return '#EF4444';
}

export default function RentMap() {
  const { city: selectedCity, setCity, rooms } = useFilterStore();
  const roomKey = rooms ?? '2';

  // Calculate avg rent per city
  const cityAvgs = Object.entries(citiesData).map(([name, cd]) => {
    const vals = Object.values(cd.neighborhoods)
      .map(n => n[roomKey]?.avgRent)
      .filter((v): v is number => v !== undefined && v > 0);
    const avg = vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
    return { name, avg, lat: cd.lat, lng: cd.lng, nameHe: cd.nameHe };
  });

  const avgs = cityAvgs.map(c => c.avg).filter(v => v > 0);
  const minAvg = Math.min(...avgs);
  const maxAvg = Math.max(...avgs);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="font-bold text-[#0D1B2A]">מפת מחירים</h3>
        <p className="text-xs text-gray-400 mt-0.5">לחץ על עיר לפרטים ולמעבר</p>
      </div>

      <MapContainer
        center={[31.5, 34.85]}
        zoom={8}
        style={{ height: '480px', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {cityAvgs.map(({ name, avg, lat, lng, nameHe }) => {
          const color = getColor(avg, minAvg, maxAvg);
          const isSelected = name === selectedCity;
          const cityInfo = citiesData[name];

          return (
            <CircleMarker
              key={name}
              center={[lat, lng]}
              radius={isSelected ? 18 : 14}
              pathOptions={{
                fillColor: color,
                fillOpacity: 0.85,
                color: isSelected ? '#0D1B2A' : 'white',
                weight: isSelected ? 3 : 2,
              }}
              eventHandlers={{ click: () => setCity(name) }}
            >
              <Popup>
                <div className="text-right min-w-[180px]" dir="rtl">
                  <h4 className="font-bold text-base text-[#0D1B2A] mb-2">{nameHe}</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-right text-xs text-gray-500 pb-1">חדרים</th>
                        <th className="text-left text-xs text-gray-500 pb-1">ממוצע</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ROOM_TYPES.map(rt => {
                        const vals = Object.values(cityInfo.neighborhoods)
                          .map(n => n[rt]?.avgRent)
                          .filter((v): v is number => v !== undefined);
                        if (vals.length === 0) return null;
                        const mean = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
                        return (
                          <tr key={rt}>
                            <td className="text-gray-600 py-0.5">{roomLabels[rt]}</td>
                            <td className="font-medium text-[#0D1B2A] text-left">₪{mean.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <button
                    onClick={() => setCity(name)}
                    className="mt-2 w-full bg-amber-400 text-white text-xs font-bold py-1.5 rounded-lg"
                  >
                    עבור לעיר
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center gap-4 flex-wrap">
        <span className="text-xs text-gray-500 font-medium">מחיר יחסי:</span>
        {[
          { color: '#10B981', label: 'זול' },
          { color: '#84CC16', label: 'מתחת לממוצע' },
          { color: '#F59E0B', label: 'מעל הממוצע' },
          { color: '#EF4444', label: 'יקר' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
