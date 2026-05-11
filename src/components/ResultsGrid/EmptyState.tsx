import { useFilterStore } from "../../store/filterStore";

interface Props {
  isError?: boolean;
}

export default function EmptyState({ isError }: Props) {
  const { reset } = useFilterStore();

  if (isError) {
    return (
      <div
        className="col-span-full"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "5rem 1rem",
          textAlign: "center",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "0.75rem",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.25rem",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round">
            <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
            <polyline points="13 2 13 9 20 9" />
            <line x1="9" y1="13" x2="15" y2="13" />
          </svg>
        </div>

        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#E6EDF3", marginBottom: "0.4rem" }}>
          לא ניתן להתחבר לשרת
        </h3>
        <p style={{ fontSize: "0.83rem", color: "#484F58", marginBottom: "0.9rem" }}>
          האם הפעלת את שרת Python?
        </p>
        <code
          style={{
            fontSize: "0.75rem",
            padding: "0.5rem 1rem",
            borderRadius: "0.4rem",
            background: "#161B22",
            color: "#8B949E",
            border: "1px solid #30363D",
            fontFamily: "monospace",
          }}
        >
          uvicorn api.main:app --reload --port 8000
        </code>
      </div>
    );
  }

  return (
    <div
      className="col-span-full"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "5rem 1rem",
        textAlign: "center",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "0.75rem",
          background: "#161B22",
          border: "1px solid #21262D",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.25rem",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#30363D" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </div>

      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#8B949E", marginBottom: "0.4rem" }}>
        לא נמצאו מודעות
      </h3>
      <p style={{ fontSize: "0.83rem", color: "#30363D", marginBottom: "1.25rem" }}>
        נסה להרחיב את טווח החיפוש
      </p>
      <button
        onClick={reset}
        style={{
          padding: "0.5rem 1.5rem",
          borderRadius: "0.4rem",
          fontSize: "0.82rem",
          fontWeight: 700,
          background: "#21262D",
          color: "#E6EDF3",
          border: "1px solid #30363D",
          cursor: "pointer",
          transition: "border-color 0.15s, background 0.15s",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.background = "#30363D";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = "#21262D";
        }}
      >
        נקה פילטרים
      </button>
    </div>
  );
}
