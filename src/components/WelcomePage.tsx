import React, { useEffect, useState } from "react";
import { fetchNeighborhoods } from "../utils/api";
import { getCities } from "../hooks/useCities";
import type { CityOption, NeighborhoodOption } from "../types/listing";

interface Props {
  onDone: (filters: { city: string | null; neighborhood: string | null; priceMax: number | null }) => void;
}

const PRICE_PRESETS = [
  { label: "עד ₪5,000",  value: 5000 },
  { label: "עד ₪7,000",  value: 7000 },
  { label: "עד ₪10,000", value: 10000 },
  { label: "עד ₪15,000", value: 15000 },
];

export default function WelcomePage({ onDone }: Props) {
  const [cities, setCities] = useState<CityOption[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodOption[]>([]);
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [priceMax, setPriceMax] = useState<number | null>(null);
  const [customPrice, setCustomPrice] = useState("");
  const [mounted, setMounted] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
    getCities().then(setCities).catch(() => {});
  }, []);

  useEffect(() => {
    if (!city) { setNeighborhoods([]); setNeighborhood(""); return; }
    setNeighborhood("");
    fetchNeighborhoods(city).then(setNeighborhoods).catch(() => setNeighborhoods([]));
  }, [city]);

  const effectivePriceMax = customPrice ? parseInt(customPrice) : priceMax;

  const handleSubmit = () => {
    setExiting(true);
    setTimeout(() => {
      onDone({
        city: city || null,
        neighborhood: neighborhood || null,
        priceMax: effectivePriceMax ?? null,
      });
    }, 420);
  };

  const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.85rem 1rem",
    borderRadius: "0.55rem",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: city ? "#E6EDF3" : "#6B7280",
    fontSize: "0.95rem",
    outline: "none",
    appearance: "none",
    WebkitAppearance: "none",
    cursor: "pointer",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "#080C12",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.25rem",
        opacity: exiting ? 0 : mounted ? 1 : 0,
        transform: exiting ? "scale(1.015)" : "scale(1)",
        transition: exiting
          ? "opacity 0.42s ease, transform 0.42s ease"
          : "opacity 0.4s ease",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: "absolute",
        top: "-180px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "700px",
        height: "500px",
        background: "radial-gradient(ellipse at center, rgba(245,158,11,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        bottom: "-120px",
        right: "-100px",
        width: "400px",
        height: "400px",
        background: "radial-gradient(ellipse at center, rgba(59,130,246,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          display: "flex",
          flexDirection: "column",
          gap: 0,
          transform: mounted && !exiting ? "translateY(0)" : "translateY(20px)",
          transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Badge */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.3rem 0.85rem",
            borderRadius: "999px",
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.25)",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#F59E0B",
            letterSpacing: "0.04em",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#F59E0B", display: "inline-block" }} />
            {cities.reduce((s, c) => s + c.count, 0).toLocaleString("he-IL")}+ דירות זמינות עכשיו
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          margin: "0 0 0.6rem",
          textAlign: "center",
          fontSize: "clamp(2rem, 6vw, 3rem)",
          fontWeight: 900,
          color: "#F1F5F9",
          lineHeight: 1.15,
          letterSpacing: "-0.03em",
        }}>
          מצא את הדירה<br />
          <span style={{ color: "#F59E0B" }}>הבאה שלך</span>
        </h1>

        <p style={{
          margin: "0 0 2.5rem",
          textAlign: "center",
          fontSize: "1rem",
          color: "#6B7280",
          lineHeight: 1.5,
        }}>
          נתונים חיים מ-יד2, Homeless ו-OnMap —<br />
          ספר לנו מה אתה מחפש
        </p>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>

          {/* City */}
          <div style={{ position: "relative" }}>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#6B7280", marginBottom: "0.35rem", letterSpacing: "0.04em" }}>
              עיר
            </label>
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              style={selectStyle}
              onFocus={e => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.5)"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            >
              <option value="">בחר עיר...</option>
              {cities.map(c => (
                <option key={c.city} value={c.city}>{c.city} ({c.count})</option>
              ))}
            </select>
            {/* Arrow */}
            <svg style={{ position: "absolute", right: "0.85rem", top: "calc(50% + 12px)", transform: "translateY(-50%)", pointerEvents: "none" }}
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {/* Neighborhood */}
          {city && neighborhoods.length > 0 && (
            <div style={{ position: "relative", animation: "fadeSlideIn 0.2s ease" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#6B7280", marginBottom: "0.35rem", letterSpacing: "0.04em" }}>
                שכונה <span style={{ color: "#374151", fontWeight: 400 }}>(אופציונלי)</span>
              </label>
              <select
                value={neighborhood}
                onChange={e => setNeighborhood(e.target.value)}
                style={{ ...selectStyle, color: neighborhood ? "#E6EDF3" : "#6B7280" }}
                onFocus={e => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.5)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              >
                <option value="">כל השכונות</option>
                {neighborhoods.map(n => (
                  <option key={n.neighborhood} value={n.neighborhood}>{n.neighborhood} ({n.count})</option>
                ))}
              </select>
              <svg style={{ position: "absolute", right: "0.85rem", top: "calc(50% + 12px)", transform: "translateY(-50%)", pointerEvents: "none" }}
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          )}

          {/* Price */}
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#6B7280", marginBottom: "0.35rem", letterSpacing: "0.04em" }}>
              תקציב מקסימלי לחודש <span style={{ color: "#374151", fontWeight: 400 }}>(אופציונלי)</span>
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.45rem", marginBottom: "0.45rem" }}>
              {PRICE_PRESETS.map(p => {
                const active = priceMax === p.value && !customPrice;
                return (
                  <button
                    key={p.value}
                    onClick={() => { setPriceMax(active ? null : p.value); setCustomPrice(""); }}
                    style={{
                      padding: "0.65rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      border: `1px solid ${active ? "#F59E0B" : "rgba(255,255,255,0.08)"}`,
                      background: active ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.03)",
                      color: active ? "#F59E0B" : "#9CA3AF",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
            <input
              type="number"
              placeholder="מחיר מותאם אישית..."
              value={customPrice}
              onChange={e => { setCustomPrice(e.target.value); setPriceMax(null); }}
              style={{
                ...selectStyle,
                direction: "rtl",
                color: customPrice ? "#E6EDF3" : "#6B7280",
              }}
              onFocus={e => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.5)"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            />
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleSubmit}
          style={{
            marginTop: "1.5rem",
            width: "100%",
            padding: "1rem",
            borderRadius: "0.65rem",
            background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
            color: "#000",
            fontSize: "1rem",
            fontWeight: 800,
            border: "none",
            cursor: "pointer",
            letterSpacing: "0.01em",
            boxShadow: "0 0 32px rgba(245,158,11,0.25)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 0 40px rgba(245,158,11,0.4)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 0 32px rgba(245,158,11,0.25)";
          }}
        >
          {city ? `חפש דירות ב${city} →` : "חפש דירות →"}
        </button>

        {/* Source logos */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", marginTop: "1.75rem" }}>
          {["yad2.co.il", "homeless.co.il", "onmap.co.il"].map(domain => (
            <div key={domain} style={{ display: "flex", alignItems: "center", gap: "0.3rem", opacity: 0.4 }}>
              <img
                src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`}
                alt={domain}
                style={{ width: 14, height: 14, borderRadius: 3 }}
              />
              <span style={{ fontSize: "0.7rem", color: "#6B7280" }}>{domain.split(".")[0]}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
