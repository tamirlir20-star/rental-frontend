import React, { useEffect, useState } from "react";
import { fetchCities, fetchNeighborhoods } from "../utils/api";
import type { CityOption, NeighborhoodOption } from "../types/listing";

interface Props {
  onDone: (filters: { city: string | null; neighborhood: string | null; priceMax: number | null }) => void;
}

const PRICE_PRESETS = [5_000, 7_000, 10_000, 15_000];

export default function WelcomeModal({ onDone }: Props) {
  const [cities, setCities] = useState<CityOption[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodOption[]>([]);
  const [city, setCity] = useState<string>("");
  const [neighborhood, setNeighborhood] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingNeighborhoods, setLoadingNeighborhoods] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchCities()
      .then(setCities)
      .catch(() => {})
      .finally(() => {
        setLoadingCities(false);
        setTimeout(() => setVisible(true), 30);
      });
  }, []);

  useEffect(() => {
    if (!city) {
      setNeighborhoods([]);
      setNeighborhood("");
      return;
    }
    setLoadingNeighborhoods(true);
    setNeighborhood("");
    fetchNeighborhoods(city)
      .then(setNeighborhoods)
      .catch(() => setNeighborhoods([]))
      .finally(() => setLoadingNeighborhoods(false));
  }, [city]);

  const handleSubmit = () => {
    onDone({
      city: city || null,
      neighborhood: neighborhood || null,
      priceMax: priceMax ? parseInt(priceMax) : null,
    });
  };

  const handleSkip = () => onDone({ city: null, neighborhood: null, priceMax: null });

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.65rem 0.85rem",
    borderRadius: "0.45rem",
    background: "#0E1117",
    border: "1px solid #30363D",
    color: "#E6EDF3",
    fontSize: "0.9rem",
    outline: "none",
    appearance: "none",
    WebkitAppearance: "none",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(14,17,23,0.92)",
        backdropFilter: "blur(6px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.25s ease",
      }}
    >
      <div
        style={{
          background: "#161B22",
          border: "1px solid #21262D",
          borderRadius: "1rem",
          padding: "2rem 1.75rem",
          width: "100%",
          maxWidth: 440,
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "transform 0.3s ease, opacity 0.25s ease",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>🏠</div>
          <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800, color: "#E6EDF3" }}>
            מחפש דירה?
          </h1>
          <p style={{ margin: "0.4rem 0 0", fontSize: "0.85rem", color: "#8B949E" }}>
            בואו נצמצם את החיפוש
          </p>
        </div>

        {/* City */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#8B949E", marginBottom: "0.4rem" }}>
            עיר
          </label>
          {loadingCities ? (
            <div style={{ ...inputStyle, color: "#484F58" }}>טוען...</div>
          ) : (
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              style={inputStyle}
            >
              <option value="">כל הערים</option>
              {cities.map(c => (
                <option key={c.city} value={c.city}>{c.city} ({c.count})</option>
              ))}
            </select>
          )}
        </div>

        {/* Neighborhood — only when city selected and has neighborhoods */}
        {city && (
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#8B949E", marginBottom: "0.4rem" }}>
              שכונה
            </label>
            {loadingNeighborhoods ? (
              <div style={{ ...inputStyle, color: "#484F58" }}>טוען שכונות...</div>
            ) : neighborhoods.length > 0 ? (
              <select
                value={neighborhood}
                onChange={e => setNeighborhood(e.target.value)}
                style={inputStyle}
              >
                <option value="">כל השכונות</option>
                {neighborhoods.map(n => (
                  <option key={n.neighborhood} value={n.neighborhood}>
                    {n.neighborhood} ({n.count})
                  </option>
                ))}
              </select>
            ) : (
              <div style={{ ...inputStyle, color: "#484F58", fontSize: "0.8rem" }}>
                אין שכונות זמינות לעיר זו
              </div>
            )}
          </div>
        )}

        {/* Price max */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#8B949E", marginBottom: "0.4rem" }}>
            מחיר מקסימלי לחודש
          </label>
          {/* Preset buttons */}
          <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
            {PRICE_PRESETS.map(p => {
              const active = priceMax === String(p);
              return (
                <button
                  key={p}
                  onClick={() => setPriceMax(active ? "" : String(p))}
                  style={{
                    padding: "0.3rem 0.7rem",
                    borderRadius: "0.35rem",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    border: `1px solid ${active ? "#F59E0B" : "#30363D"}`,
                    background: active ? "rgba(245,158,11,0.12)" : "#0E1117",
                    color: active ? "#F59E0B" : "#8B949E",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  ₪{p.toLocaleString("he-IL")}
                </button>
              );
            })}
          </div>
          <input
            type="number"
            placeholder="או הכנס מחיר..."
            value={priceMax}
            onChange={e => setPriceMax(e.target.value)}
            style={{ ...inputStyle, direction: "rtl" }}
          />
        </div>

        {/* CTA */}
        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "0.5rem",
            background: "#F59E0B",
            color: "#000",
            fontSize: "0.95rem",
            fontWeight: 800,
            border: "none",
            cursor: "pointer",
            marginBottom: "0.65rem",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          חפש דירות →
        </button>

        <button
          onClick={handleSkip}
          style={{
            width: "100%",
            padding: "0.5rem",
            background: "transparent",
            border: "none",
            color: "#484F58",
            fontSize: "0.8rem",
            cursor: "pointer",
            textDecoration: "underline",
            textDecorationColor: "#30363D",
          }}
        >
          הצג את כל המודעות בלי סינון
        </button>
      </div>
    </div>
  );
}
