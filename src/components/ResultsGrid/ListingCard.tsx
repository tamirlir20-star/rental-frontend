import type { Listing } from "../../types/listing";
import { formatRooms, formatSize, formatFloor, formatAge } from "../../utils/format";

interface Props {
  listing: Listing;
  onOpen: (listing: Listing) => void;
}

const SOURCE_CONFIG: Record<string, { label: string; color: string; bg: string; logo: string }> = {
  yad2:                { label: "יד2",       color: "#dc2626", bg: "#fef2f2", logo: "https://www.google.com/s2/favicons?domain=yad2.co.il&sz=32" },
  madlan:              { label: "מדלן",      color: "#7c3aed", bg: "#f5f3ff", logo: "https://www.google.com/s2/favicons?domain=madlan.co.il&sz=32" },
  homeless:            { label: "Homeless",  color: "#2563eb", bg: "#eff6ff", logo: "https://www.google.com/s2/favicons?domain=homeless.co.il&sz=32" },
  winwin:              { label: "WinWin",    color: "#16a34a", bg: "#f0fdf4", logo: "https://www.google.com/s2/favicons?domain=winwin.co.il&sz=32" },
  facebook_marketplace:{ label: "FB Market", color: "#1d4ed8", bg: "#eff6ff", logo: "https://www.google.com/s2/favicons?domain=facebook.com&sz=32" },
  facebook_groups:     { label: "FB קבוצה", color: "#1d4ed8", bg: "#eff6ff", logo: "https://www.google.com/s2/favicons?domain=facebook.com&sz=32" },
};

function AmenityPill({ show, icon, label }: { show: boolean | null; icon: string; label: string }) {
  if (!show) return null;
  return (
    <span
      className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium"
      style={{ background: "#f7f5f0", color: "#57534e" }}
      title={label}
    >
      <span className="text-sm">{icon}</span>
      {label}
    </span>
  );
}

export default function ListingCard({ listing, onOpen }: Props) {
  const src = SOURCE_CONFIG[listing.source] ?? { label: listing.source, color: "#78716c", bg: "#f7f5f0", logo: "" };
  const rooms = formatRooms(listing.rooms);
  const size = formatSize(listing.size_sqm);
  const floor = formatFloor(listing.floor, listing.total_floors);
  const age = formatAge(listing.first_seen);

  const price = listing.price
    ? "₪" + listing.price.toLocaleString("he-IL")
    : "מחיר לא ידוע";

  return (
    <div
      className="card-lift flex flex-col cursor-pointer"
      style={{
        background: "#fff",
        borderRadius: "1rem",
        border: "1px solid #e8e4dc",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}
      onClick={() => onOpen(listing)}
    >
      {/* Image */}
      {listing.image_url ? (
        <div className="relative flex-shrink-0" style={{ height: 180, background: "#f4f2ee" }}>
          <img
            src={listing.image_url}
            alt={listing.title ?? ""}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)" }}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center flex-shrink-0" style={{ height: 120, background: "linear-gradient(135deg, #f7f5f0 0%, #ede9e2 100%)" }}>
          <span style={{ fontSize: 36, opacity: 0.4 }}>🏠</span>
        </div>
      )}

      <div className="flex flex-col flex-1 p-4">
        {/* Source badge + age */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold"
            style={{ background: src.bg, color: src.color }}
          >
            {src.logo && (
              <img
                src={src.logo}
                alt={src.label}
                className="rounded-sm"
                style={{ width: 14, height: 14 }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            )}
            {src.label}
          </span>
          <span className="text-xs" style={{ color: "#c8c3bb" }}>{age}</span>
        </div>

        {/* Price */}
        <div className="mb-2">
          <span className="text-2xl font-black leading-none" style={{ color: "#1c1917" }}>
            {price}
          </span>
          <span className="text-xs mr-1" style={{ color: "#a8a29e" }}>/חודש</span>
        </div>

        {/* Rooms + size */}
        {(rooms || size) && (
          <p className="text-sm font-semibold mb-1.5" style={{ color: "#44403c" }}>
            {[rooms, size].filter(Boolean).join(" · ")}
          </p>
        )}

        {/* Location */}
        <p className="text-sm mb-1" style={{ color: "#78716c" }}>
          📍 {[listing.neighborhood, listing.city].filter(Boolean).join(", ") || "מיקום לא ידוע"}
        </p>

        {/* Floor */}
        {floor && (
          <p className="text-xs mb-3" style={{ color: "#a8a29e" }}>{floor}</p>
        )}

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <AmenityPill show={listing.has_parking} icon="🅿" label="חניה" />
          <AmenityPill show={listing.has_balcony} icon="🌿" label="מרפסת" />
          <AmenityPill show={listing.has_elevator} icon="🛗" label="מעלית" />
          <AmenityPill show={listing.pets_allowed} icon="🐾" label="חיות מחמד" />
          {listing.furnished && (
            <span
              className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium"
              style={{ background: "#fef3c7", color: "#92400e" }}
            >
              🛋 מרוהטת
            </span>
          )}
        </div>

        {/* Price per sqm */}
        {listing.price_per_sqm && (
          <p className="text-xs mb-3" style={{ color: "#c8c3bb" }}>
            ₪{listing.price_per_sqm.toLocaleString("he-IL")} למ״ר
          </p>
        )}

        {/* CTA */}
        <div className="mt-auto">
          {listing.url ? (
            <a
              href={listing.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="block w-full text-center text-sm font-bold py-2.5 rounded-xl transition-all"
              style={{ background: "#0f172a", color: "#fff" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#1e293b")}
              onMouseLeave={e => (e.currentTarget.style.background = "#0f172a")}
            >
              צפה במודעה ↗
            </a>
          ) : (
            <button
              disabled
              className="w-full text-sm py-2.5 rounded-xl cursor-default"
              style={{ background: "#f7f5f0", color: "#c8c3bb", border: "1px solid #e8e4dc" }}
            >
              אין קישור
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
