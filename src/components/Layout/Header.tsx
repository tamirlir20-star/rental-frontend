import { useFilterStore } from "../../store/filterStore";

export default function Header() {
  const { city, reset } = useFilterStore();

  return (
    <header
      style={{
        background: "#161B22",
        borderBottom: "1px solid #21262D",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        {/* Wordmark */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Icon mark */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E1117" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.35rem" }}>
              <span
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 800,
                  color: "#E6EDF3",
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                }}
              >
                מחירון שכירות
              </span>
              <span
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 800,
                  color: "#F59E0B",
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                }}
              >
                ישראל
              </span>
            </div>
            <p style={{ fontSize: "0.68rem", color: "#484F58", marginTop: 2, fontWeight: 500 }}>
              נתונים חיים · יד2 · מדלן · Homeless
            </p>
          </div>
        </div>

        {/* Active filter pill + clear */}
        {city && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.2)",
              borderRadius: "2rem",
              padding: "0.3rem 0.75rem 0.3rem 0.5rem",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#F59E0B" }}>{city}</span>
            <button
              onClick={reset}
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "rgba(245,158,11,0.15)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#F59E0B",
                fontSize: 12,
                fontWeight: 700,
                marginRight: 2,
              }}
              title="נקה סינון"
            >
              ×
            </button>
          </div>
        )}

        {/* Live badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            marginRight: "auto",
          }}
          className="hidden sm:flex"
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#22C55E",
              display: "inline-block",
              boxShadow: "0 0 0 2px rgba(34,197,94,0.25)",
            }}
          />
          <span style={{ fontSize: "0.7rem", color: "#484F58", fontWeight: 500 }}>עדכון חי</span>
        </div>
      </div>
    </header>
  );
}
