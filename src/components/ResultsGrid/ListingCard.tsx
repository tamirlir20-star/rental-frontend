import React from "react";
import type { Listing } from "../../types/listing";
import { formatRooms, formatSize, formatFloor, formatAge } from "../../utils/format";

interface Props {
  listing: Listing;
  onOpen: (listing: Listing) => void;
}

const SOURCE_CONFIG: Record<string, {
  label: string;
  color: string;
  logo: string;
}> = {
  yad2:                 { label: "יד2",          color: "#EF4444", logo: "https://www.google.com/s2/favicons?domain=yad2.co.il&sz=32" },
  madlan:               { label: "מדלן",         color: "#A855F7", logo: "https://www.google.com/s2/favicons?domain=madlan.co.il&sz=32" },
  homeless:             { label: "Homeless",     color: "#3B82F6", logo: "https://www.google.com/s2/favicons?domain=homeless.co.il&sz=32" },
  winwin:               { label: "WinWin",       color: "#22C55E", logo: "https://www.google.com/s2/favicons?domain=winwin.co.il&sz=32" },
  facebook_marketplace: { label: "FB Market",   color: "#60A5FA", logo: "https://www.google.com/s2/favicons?domain=facebook.com&sz=32" },
  facebook_groups:      { label: "FB קבוצה",    color: "#60A5FA", logo: "https://www.google.com/s2/favicons?domain=facebook.com&sz=32" },
};

/* Small inline amenity badge — no label, just icon + tooltip */
function AmenityDot({ show, icon, label }: { show: boolean | null; icon: string; label: string }) {
  if (!show) return null;
  return (
    <span
      title={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 24,
        height: 24,
        borderRadius: "0.3rem",
        background: "#21262D",
        border: "1px solid #30363D",
        fontSize: "0.7rem",
        cursor: "default",
      }}
    >
      {icon}
    </span>
  );
}

export default function ListingCard({ listing, onOpen }: Props) {
  const src = SOURCE_CONFIG[listing.source] ?? { label: listing.source, color: "#484F58", logo: "" };
  const rooms = formatRooms(listing.rooms);
  const size = formatSize(listing.size_sqm);
  const floor = formatFloor(listing.floor, listing.total_floors);
  const age = formatAge(listing.first_seen);
  const [imgFailed, setImgFailed] = React.useState(false);
  const hasImage = Boolean(listing.image_url) && !imgFailed;

  const price = listing.price
    ? "₪" + listing.price.toLocaleString("he-IL")
    : "—";

  const location = [listing.neighborhood, listing.city].filter(Boolean).join(", ") || "מיקום לא ידוע";

  return (
    <div
      className={`card-lift card-source-${listing.source}`}
      onClick={() => onOpen(listing)}
      style={{
        background: "#161B22",
        borderRadius: "0.65rem",
        border: "1px solid #21262D",
        overflow: "hidden",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image area */}
      {hasImage ? (
        <div style={{ position: "relative", height: 168, background: "#0E1117", flexShrink: 0 }}>
          <img
            src={listing.image_url!}
            alt={listing.title ?? ""}
            loading="lazy"
            onError={() => setImgFailed(true)}
            onLoad={e => { if ((e.currentTarget as HTMLImageElement).naturalWidth === 0) setImgFailed(true); }}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          {/* Gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(22,27,34,0.9) 0%, rgba(22,27,34,0.1) 55%, transparent 100%)",
            }}
          />
          {/* Source badge overlaid on image */}
          <div
            style={{
              position: "absolute",
              top: "0.6rem",
              right: "0.6rem",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              background: "rgba(14,17,23,0.75)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "0.35rem",
              padding: "0.2rem 0.45rem",
            }}
          >
            {src.logo && (
              <img
                src={src.logo}
                alt={src.label}
                style={{ width: 12, height: 12, borderRadius: 2 }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            )}
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: src.color }}>{src.label}</span>
          </div>
          {/* Price overlaid on image bottom */}
          <div style={{ position: "absolute", bottom: "0.65rem", right: "0.75rem" }}>
            <span style={{ fontSize: "1.45rem", fontWeight: 900, color: "#FFFFFF", lineHeight: 1, letterSpacing: "-0.02em" }}>
              {price}
            </span>
            {listing.price && (
              <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.55)", marginRight: "0.25rem" }}>/חודש</span>
            )}
          </div>
        </div>
      ) : (
        /* No-image placeholder */
        <div
          style={{
            height: 72,
            background: "#0E1117",
            borderBottom: `2px solid ${src.color}20`,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            padding: "0 0.75rem 0.6rem",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            {src.logo && (
              <img
                src={src.logo}
                alt={src.label}
                style={{ width: 13, height: 13, borderRadius: 2 }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            )}
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: src.color }}>{src.label}</span>
          </div>
          <div>
            <span style={{ fontSize: "1.35rem", fontWeight: 900, color: "#E6EDF3", lineHeight: 1, letterSpacing: "-0.02em" }}>
              {price}
            </span>
            {listing.price && (
              <span style={{ fontSize: "0.68rem", color: "#484F58", marginRight: "0.2rem" }}>/חודש</span>
            )}
          </div>
        </div>
      )}

      {/* Body */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "0.75rem" }}>

        {/* Stats row: rooms · size · floor */}
        {(rooms || size || floor) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.55rem",
              flexWrap: "wrap",
            }}
          >
            {rooms && (
              <StatChip icon={
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
              } label={rooms} />
            )}
            {size && (
              <StatChip icon={
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <rect x="3" y="3" width="18" height="18" rx="1" />
                </svg>
              } label={size} />
            )}
            {floor && (
              <StatChip icon={
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              } label={floor} />
            )}
          </div>
        )}

        {/* Location */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            marginBottom: "0.5rem",
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#484F58" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span style={{ fontSize: "0.8rem", color: "#8B949E", lineHeight: 1.3 }}>{location}</span>
        </div>

        {/* Amenity dots + age row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.65rem",
          }}
        >
          <div style={{ display: "flex", gap: "0.3rem" }}>
            <AmenityDot show={listing.has_parking}  icon="P" label="חניה" />
            <AmenityDot show={listing.has_balcony}  icon="B" label="מרפסת" />
            <AmenityDot show={listing.has_elevator} icon="E" label="מעלית" />
            <AmenityDot show={listing.pets_allowed} icon="~" label="חיות מחמד" />
            {listing.furnished && (
              <span
                title="מרוהטת"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0 0.4rem",
                  height: 24,
                  borderRadius: "0.3rem",
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.2)",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: "#F59E0B",
                }}
              >
                מרוהטת
              </span>
            )}
          </div>

          <span style={{ fontSize: "0.68rem", color: "#30363D" }}>{age}</span>
        </div>

        {/* Price per sqm (if available, subtle) */}
        {listing.price_per_sqm && (
          <p style={{ fontSize: "0.68rem", color: "#30363D", marginBottom: "0.65rem" }}>
            ₪{listing.price_per_sqm.toLocaleString("he-IL")} למ״ר
          </p>
        )}

        {/* CTA */}
        <div style={{ marginTop: "auto" }}>
          {listing.url ? (
            <a
              href={listing.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.35rem",
                width: "100%",
                padding: "0.5rem 0",
                borderRadius: "0.4rem",
                fontSize: "0.78rem",
                fontWeight: 700,
                background: "transparent",
                color: src.color,
                border: `1px solid ${src.color}30`,
                textDecoration: "none",
                transition: "background 0.15s, border-color 0.15s",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = `${src.color}12`;
                el.style.borderColor = `${src.color}60`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "transparent";
                el.style.borderColor = `${src.color}30`;
              }}
            >
              צפה במודעה
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          ) : (
            <div
              style={{
                width: "100%",
                padding: "0.5rem 0",
                borderRadius: "0.4rem",
                fontSize: "0.78rem",
                fontWeight: 500,
                background: "transparent",
                color: "#30363D",
                border: "1px solid #21262D",
                textAlign: "center",
              }}
            >
              אין קישור
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.28rem",
        padding: "0.2rem 0.45rem",
        borderRadius: "0.3rem",
        background: "#21262D",
        border: "1px solid #30363D",
        fontSize: "0.75rem",
        fontWeight: 600,
        color: "#8B949E",
      }}
    >
      <span style={{ display: "flex", color: "#484F58" }}>{icon}</span>
      {label}
    </span>
  );
}
