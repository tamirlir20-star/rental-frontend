import { useEffect } from "react";
import type { Listing } from "../../types/listing";
import { formatPrice, formatRooms, formatSize, formatFloor, formatAge } from "../../utils/format";

interface Props {
  listing: Listing;
  onClose: () => void;
}

const SOURCE_LABELS: Record<string, string> = {
  yad2: "יד2",
  madlan: "מדלן",
  homeless: "Homeless",
  winwin: "WinWin",
  facebook_marketplace: "Facebook Marketplace",
  facebook_groups: "קבוצות Facebook",
};

export default function ListingDetailModal({ listing, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header image */}
        {listing.image_url && (
          <div className="h-52 overflow-hidden rounded-t-2xl bg-gray-100">
            <img src={listing.image_url} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-6">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow text-gray-600 text-lg"
          >
            ×
          </button>

          {/* Source + age */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {SOURCE_LABELS[listing.source] ?? listing.source}
            </span>
            <span className="text-xs text-gray-400">{formatAge(listing.first_seen)}</span>
          </div>

          {/* Price */}
          <div className="mb-4">
            <p className="text-3xl font-bold text-[#0D1B2A]">{formatPrice(listing.price)}</p>
            <p className="text-sm text-gray-500">לחודש</p>
          </div>

          {/* Key details grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {formatRooms(listing.rooms) && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-0.5">חדרים</p>
                <p className="font-semibold text-gray-800">{formatRooms(listing.rooms)}</p>
              </div>
            )}
            {formatSize(listing.size_sqm) && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-0.5">שטח</p>
                <p className="font-semibold text-gray-800">{formatSize(listing.size_sqm)}</p>
              </div>
            )}
            {formatFloor(listing.floor, listing.total_floors) && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-0.5">קומה</p>
                <p className="font-semibold text-gray-800">{formatFloor(listing.floor, listing.total_floors)}</p>
              </div>
            )}
            {listing.price_per_sqm && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-0.5">מחיר למ"ר</p>
                <p className="font-semibold text-gray-800">₪{listing.price_per_sqm}</p>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-0.5">מיקום</p>
            <p className="text-gray-600">
              {[listing.street, listing.neighborhood, listing.city].filter(Boolean).join(", ") || "לא צוין"}
            </p>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mb-4">
            {listing.has_parking && <span className="text-sm bg-gray-100 rounded-full px-3 py-1">🅿 חניה</span>}
            {listing.has_balcony && <span className="text-sm bg-gray-100 rounded-full px-3 py-1">🌿 מרפסת</span>}
            {listing.has_elevator && <span className="text-sm bg-gray-100 rounded-full px-3 py-1">🛗 מעלית</span>}
            {listing.pets_allowed && <span className="text-sm bg-gray-100 rounded-full px-3 py-1">🐾 חיות מחמד</span>}
            {listing.furnished && <span className="text-sm bg-amber-100 text-amber-700 rounded-full px-3 py-1">🛋 מרוהטת</span>}
          </div>

          {/* Description */}
          {listing.description && (
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-700 mb-1">תיאור</p>
              <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                {listing.description.slice(0, 600)}{listing.description.length > 600 ? "..." : ""}
              </p>
            </div>
          )}

          {/* Contact */}
          {listing.contact_name && (
            <p className="text-sm text-gray-500 mb-4">איש קשר: {listing.contact_name}</p>
          )}

          {/* CTA */}
          {listing.url && (
            <a
              href={listing.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-amber-400 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-colors"
            >
              ראה מודעה מקורית ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
