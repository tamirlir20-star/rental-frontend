import { useEffect } from "react";
import FilterPanel from "./FilterPanel";
import { useFilterStore } from "../../store/filterStore";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function FilterDrawer({ open, onClose }: Props) {
  // Lock body scroll while open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(3px)",
          zIndex: 40,
        }}
      />

      {/* Bottom sheet */}
      <div
        dir="rtl"
        style={{
          position: "fixed",
          bottom: 0, left: 0, right: 0,
          background: "#0E1117",
          borderTop: "1px solid #30363D",
          borderRadius: "1rem 1rem 0 0",
          zIndex: 50,
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Drag handle */}
        <div style={{ padding: "0.75rem 0 0", display: "flex", justifyContent: "center", flexShrink: 0 }}>
          <div style={{ width: 40, height: 4, background: "#30363D", borderRadius: 4 }} />
        </div>

        {/* Sheet header */}
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0.75rem 1.25rem 0.5rem",
            borderBottom: "1px solid #21262D",
            flexShrink: 0,
          }}
        >
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "#E6EDF3" }}>פילטרים</span>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "#21262D", border: "1px solid #30363D",
              color: "#8B949E", fontSize: "1rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        {/* Scrollable filter content */}
        <div style={{ overflowY: "auto", flex: 1, padding: "0.75rem 1rem" }}>
          <FilterPanel />
        </div>

        {/* Apply button */}
        <div style={{ padding: "0.75rem 1rem 1.5rem", flexShrink: 0, borderTop: "1px solid #21262D" }}>
          <button
            onClick={onClose}
            style={{
              width: "100%", padding: "0.8rem",
              background: "#F59E0B", color: "#000",
              fontWeight: 700, fontSize: "0.95rem",
              borderRadius: "0.6rem", border: "none",
              cursor: "pointer",
            }}
          >
            הצג תוצאות
          </button>
        </div>
      </div>
    </>
  );
}
