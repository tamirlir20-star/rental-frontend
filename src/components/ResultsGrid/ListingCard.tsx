import type { Listing } from "../../types/listing";
import { formatPrice, formatRooms, formatSize, formatFloor, formatAge } from "../../utils/format";

interface Props {
  listing: Listing;
  onOpen: (listing: Listing) => void;
}

const SOURCE_BADGES: Record<string, { label: string; className: string }> = {
  yad2: { label: "יד2", className: "bg-red-100 text-red-700" },
  madlan: { label: "מדלן", className: "bg-purple-100 text-purple-700" },
  homeless: { label: "Homeless", className: "bg-blue-100 text-blue-700" },
  winwin: { label: "WinWin", className: "bg-green-100 text-green-700" },
  facebook_marketplace: { label: "FB Market", className: "bg-blue-900 text-white" },
  facebook_groups: { label: "FB קבוצה", className: "bg-blue-900 text-white" },
};

function AmenityIcon({ show, icon, label }: { show: boolean | null; icon: string; label: string }) {
  if (!show) return null;
  return (
    <span className="text-sm" title={label}>{icon}</span>
  );
}

export default function ListingCard({ listing, onOpen }: Props) {
  const badge = SOURCE_BADGES[listing.source] ?? { label: listing.source, className: "bg-gray-100 text-gray-700" };
  const rooms = formatRooms(listing.rooms);
  const size = formatSize(listing.size_sqm);
  const floor = formatFloor(listing.floor, listing.total_floors);
  const age = formatAge(listing.first_seen);

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col"
      onClick={() => onOpen(listing)}
    >
      {/* Image */}
      {listing.image_url ? (
        <div className="h-40 overflow-hidden rounded-t-xl bg-gray-100 flex-shrink-0">
          <img
            src={listing.image_url}
            alt={listing.title ?? ""}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        </div>
      ) : (
        <div className="h-32 rounded-t-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center flex-shrink-0">
          <span className="text-3xl text-gray-300">🏠</span>
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        {/* Top row: source badge + age */}
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.className}`}>
            {badge.label}
          </span>
          <span className="text-xs text-gray-400">{age}</span>
        </div>

        {/* Price */}
        <div className="mb-1">
          <span className="text-2xl font-bold text-[#0D1B2A]">
            {formatPrice(listing.price)}
          </span>
          <span className="text-xs text-gray-400 mr-1">/חודש</span>
        </div>

        {/* Rooms + size */}
        {(rooms || size) && (
          <p className="text-sm text-gray-600 mb-1">
            {[rooms, size].filter(Boolean).join(" · ")}
          </p>
        )}

        {/* Location */}
        <p className="text-sm text-gray-500 mb-1">
          {[listing.neighborhood, listing.city].filter(Boolean).join(", ") || "מיקום לא ידוע"}
        </p>

        {/* Floor */}
        {floor && (
          <p className="text-xs text-gray-400 mb-2">{floor}</p>
        )}

        {/* Amenities */}
        <div className="flex items-center gap-2 mb-3">
          <AmenityIcon show={listing.has_parking} icon="🅿" label="חניה" />
          <AmenityIcon show={listing.has_balcony} icon="🌿" label="מרפסת" />
          <AmenityIcon show={listing.has_elevator} icon="🛗" label="מעלית" />
          <AmenityIcon show={listing.pets_allowed} icon="🐾" label="חיות מחמד" />
          {listing.furnished && (
            <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">מרוהטת</span>
          )}
        </div>

        {/* Price per sqm */}
        {listing.price_per_sqm && (
          <p className="text-xs text-gray-400 mb-3">₪{listing.price_per_sqm} למ"ר</p>
        )}

        {/* Action button */}
        <div className="mt-auto">
          {listing.url ? (
            <a
              href={listing.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="block w-full text-center bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
            >
              ראה מודעה ↗
            </a>
          ) : (
            <button
              className="w-full bg-gray-100 text-gray-500 text-sm py-2 rounded-lg cursor-default"
              disabled
            >
              אין קישור
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
