import { useEffect, useMemo, useRef, useState } from "react";
import type { Listing } from "../../types/listing";
import { formatPrice, formatRooms, formatSize, formatFloor, formatAge } from "../../utils/format";

interface Props {
  listing: Listing;
  onClose: () => void;
}

const SOURCE_CONFIG: Record<string, { label: string; color: string }> = {
  yad2:                 { label: "יד2",                   color: "#EF4444" },
  madlan:               { label: "מדלן",                  color: "#A855F7" },
  homeless:             { label: "Homeless",              color: "#3B82F6" },
  onmap:                { label: "OnMap",                 color: "#10B981" },
  winwin:               { label: "WinWin",                color: "#22C55E" },
  facebook_marketplace: { label: "Facebook Marketplace",  color: "#60A5FA" },
  facebook_groups:      { label: "קבוצות Facebook",       color: "#60A5FA" },
};

export default function ListingDetailModal({ listing, onClose }: Props) {
  const src = SOURCE_CONFIG[listing.source] ?? { label: listing.source, color: "#8B949E" };

  const allImages = useMemo(() => {
    const imgs = (listing.images ?? []).filter(Boolean);
    if (imgs.length === 0 && listing.image_url) return [listing.image_url];
    return imgs;
  }, [listing.images, listing.image_url]);

  const [imgIdx, setImgIdx] = useState(0);
  const [failedSet, setFailedSet] = useState<Set<number>>(() => new Set());
  const pointerX = useRef(0);
  const didSwipe = useRef(false);

  const safeIdx = useMemo(() => {
    let idx = imgIdx;
    let tries = 0;
    while (failedSet.has(idx) && tries < allImages.length) {
      idx = (idx + 1) % allImages.length;
      tries++;
    }
    return tries >= allImages.length ? -1 : idx;
  }, [imgIdx, failedSet, allImages.length]);

  const multi = allImages.length > 1;
  const nav = (dir: 1 | -1) => setImgIdx(i => (i + dir + allImages.length) % allImages.length);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const DetailCell = ({ label, value }: { label: string; value: string }) => (
    <div
      style={{
        background: "#161B22",
        border: "1px solid #21262D",
        borderRadius: "0.5rem",
        padding: "0.65rem 0.85rem",
      }}
    >
      <p style={{ fontSize: "0.65rem", color: "#484F58", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem", fontWeight: 600 }}>
        {label}
      </p>
      <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#E6EDF3" }}>{value}</p>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
    >
      {/* Modal panel */}
      <div
        onClick={e => e.stopPropagation()}
        dir="rtl"
        style={{
          background: "#0E1117",
          borderRadius: "0.75rem 0.75rem 0 0",
          width: "100%",
          maxWidth: 560,
          maxHeight: "92vh",
          overflowY: "auto",
          border: "1px solid #21262D",
          borderBottom: "none",
          position: "relative",
        }}
        className="sm:rounded-xl sm:border-b"
      >
        {/* Hero image carousel */}
        {allImages.length > 0 && safeIdx !== -1 && (
          <div
            style={{ height: 220, background: "#161B22", overflow: "hidden", borderRadius: "0.75rem 0.75rem 0 0", position: "relative", touchAction: "pan-y" }}
            onPointerDown={multi ? (e) => { pointerX.current = e.clientX; didSwipe.current = false; (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId); } : undefined}
            onPointerUp={multi ? (e) => { const dx = e.clientX - pointerX.current; if (Math.abs(dx) > 40) { didSwipe.current = true; nav(dx < 0 ? 1 : -1); } } : undefined}
            onClick={(e) => { e.stopPropagation(); if (didSwipe.current) { didSwipe.current = false; } else if (multi) { nav(1); } }}
          >
            <img
              key={safeIdx}
              src={allImages[safeIdx]}
              alt=""
              onError={() => setFailedSet(p => new Set(p).add(safeIdx))}
              style={{ width: "100%", height: "100%", objectFit: "cover", userSelect: "none", pointerEvents: "none" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(14,17,23,0.8) 0%, transparent 60%)", pointerEvents: "none" }} />
            {multi && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); nav(-1); }}
                  aria-label="Previous image"
                  style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 32, height: 32, borderRadius: "50%", background: "rgba(14,17,23,0.75)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 3 }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nav(1); }}
                  aria-label="Next image"
                  style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 32, height: 32, borderRadius: "50%", background: "rgba(14,17,23,0.75)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 3 }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
                <div style={{ position: "absolute", bottom: 10, left: 12, background: "rgba(14,17,23,0.75)", borderRadius: "0.35rem", padding: "0.15rem 0.4rem", fontSize: "0.65rem", fontWeight: 600, color: "rgba(255,255,255,0.8)", zIndex: 3 }}>
                  {safeIdx + 1}/{allImages.length}
                </div>
              </>
            )}
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "0.75rem",
            left: "0.75rem",
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(14,17,23,0.8)",
            backdropFilter: "blur(4px)",
            border: "1px solid #30363D",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#8B949E",
            fontSize: "1rem",
            fontWeight: 400,
          }}
        >
          ×
        </button>

        {/* Content */}
        <div style={{ padding: "1.25rem 1.25rem 1.5rem" }}>
          {/* Source + age */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.85rem" }}>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: src.color,
                background: `${src.color}15`,
                border: `1px solid ${src.color}30`,
                borderRadius: "0.3rem",
                padding: "0.15rem 0.5rem",
              }}
            >
              {src.label}
            </span>
            <span style={{ fontSize: "0.72rem", color: "#30363D" }}>{formatAge(listing.first_seen)}</span>
          </div>

          {/* Price hero */}
          <div style={{ marginBottom: "1.1rem" }}>
            <p
              style={{
                fontSize: "2.2rem",
                fontWeight: 900,
                color: "#E6EDF3",
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              {formatPrice(listing.price)}
            </p>
            <p style={{ fontSize: "0.78rem", color: "#484F58", marginTop: "0.25rem" }}>לחודש</p>
          </div>

          {/* Key details grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            {formatRooms(listing.rooms) && (
              <DetailCell label="חדרים" value={formatRooms(listing.rooms)!} />
            )}
            {formatSize(listing.size_sqm) && (
              <DetailCell label="שטח" value={formatSize(listing.size_sqm)!} />
            )}
            {formatFloor(listing.floor, listing.total_floors) && (
              <DetailCell label="קומה" value={formatFloor(listing.floor, listing.total_floors)!} />
            )}
            {listing.price_per_sqm && (
              <DetailCell label='מחיר למ"ר' value={`₪${listing.price_per_sqm.toLocaleString("he-IL")}`} />
            )}
          </div>

          {/* Location */}
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ fontSize: "0.67rem", color: "#484F58", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, marginBottom: "0.35rem" }}>מיקום</p>
            <p style={{ fontSize: "0.9rem", color: "#8B949E" }}>
              {[listing.street, listing.neighborhood, listing.city].filter(Boolean).join(", ") || "לא צוין"}
            </p>
          </div>

          {/* Amenities */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }}>
            {listing.has_parking && <AmenityTag label="חניה" />}
            {listing.has_balcony && <AmenityTag label="מרפסת" />}
            {listing.has_elevator && <AmenityTag label="מעלית" />}
            {listing.pets_allowed && <AmenityTag label="חיות מחמד" />}
            {listing.furnished && <AmenityTag label="מרוהטת" accent />}
          </div>

          {/* Description */}
          {listing.description && (
            <div style={{ marginBottom: "1.1rem" }}>
              <p style={{ fontSize: "0.67rem", color: "#484F58", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, marginBottom: "0.5rem" }}>תיאור</p>
              <p
                style={{
                  fontSize: "0.83rem",
                  color: "#8B949E",
                  lineHeight: 1.65,
                  whiteSpace: "pre-line",
                }}
              >
                {listing.description.slice(0, 600)}{listing.description.length > 600 ? "..." : ""}
              </p>
            </div>
          )}

          {/* Contact */}
          {listing.contact_name && (
            <p style={{ fontSize: "0.8rem", color: "#484F58", marginBottom: "1rem" }}>
              איש קשר: <span style={{ color: "#8B949E" }}>{listing.contact_name}</span>
            </p>
          )}

          {/* CTA */}
          {listing.url && (
            <a
              href={listing.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                fontSize: "0.88rem",
                fontWeight: 700,
                background: src.color,
                color: "#fff",
                textDecoration: "none",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              ראה מודעה מקורית ב{src.label}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function AmenityTag({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <span
      style={{
        padding: "0.25rem 0.6rem",
        borderRadius: "0.3rem",
        fontSize: "0.75rem",
        fontWeight: 600,
        background: accent ? "rgba(245,158,11,0.1)" : "#21262D",
        color: accent ? "#F59E0B" : "#8B949E",
        border: accent ? "1px solid rgba(245,158,11,0.25)" : "1px solid #30363D",
      }}
    >
      {label}
    </span>
  );
}
