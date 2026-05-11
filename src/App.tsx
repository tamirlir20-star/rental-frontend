import { lazy, Suspense, useEffect, useState } from "react";
import { useFilterStore } from "./store/filterStore";
import Header from "./components/Layout/Header";
import FilterPanel from "./components/FilterPanel/FilterPanel";
import ResultsGrid from "./components/ResultsGrid/ResultsGrid";
import StatsBar from "./components/StatsBar/StatsBar";
import RentChart from "./components/RentChart";

const RentMap = lazy(() => import("./components/RentMap"));

const TABS = [
  { key: "listings", label: "מודעות" },
  { key: "charts",   label: "גרפים" },
  { key: "map",      label: "מפה" },
] as const;

type Tab = (typeof TABS)[number]["key"];

function readTabFromUrl(): Tab {
  const tab = new URLSearchParams(window.location.search).get("tab");
  return (tab === "charts" || tab === "map") ? tab : "listings";
}

function MapFallback() {
  return (
    <div
      className="rounded-xl flex items-center justify-center"
      style={{ height: 540, background: "#161B22", border: "1px solid #21262D" }}
    >
      <div className="text-center">
        <svg
          width="40" height="40" viewBox="0 0 24 24" fill="none"
          stroke="#30363D" strokeWidth="1.5" strokeLinecap="round"
          className="mx-auto mb-3"
        >
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
          <line x1="8" y1="2" x2="8" y2="18" />
          <line x1="16" y1="6" x2="16" y2="22" />
        </svg>
        <p style={{ color: "#484F58", fontSize: "0.85rem" }}>טוען מפה...</p>
      </div>
    </div>
  );
}

export default function App() {
  const { loadFromUrl } = useFilterStore();
  const [activeTab, setActiveTabState] = useState<Tab>(readTabFromUrl);

  useEffect(() => {
    loadFromUrl();
  }, []);

  const setActiveTab = (tab: Tab) => {
    setActiveTabState(tab);
    const p = new URLSearchParams(window.location.search);
    if (tab === "listings") {
      p.delete("tab");
    } else {
      p.set("tab", tab);
    }
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  };

  return (
    <div className="min-h-screen" style={{ background: "#0E1117" }}>
      <Header />

      {/* Tab navigation */}
      <div
        className="sticky top-0 z-10"
        style={{
          background: "#0E1117",
          borderBottom: "1px solid #21262D",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-0">
            {TABS.map(tab => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: "0.65rem 1.1rem",
                    fontSize: "0.82rem",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#F59E0B" : "#484F58",
                    background: "transparent",
                    border: "none",
                    borderBottom: isActive ? "2px solid #F59E0B" : "2px solid transparent",
                    cursor: "pointer",
                    transition: "color 0.15s, border-color 0.15s",
                    letterSpacing: "0.01em",
                    marginBottom: -1,
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "listings" && (
          <div className="grid grid-cols-1 lg:grid-cols-[272px_1fr] gap-5">
            <FilterPanel />
            <div>
              <StatsBar />
              <ResultsGrid />
            </div>
          </div>
        )}

        {activeTab === "charts" && (
          <div className="grid grid-cols-1 lg:grid-cols-[272px_1fr] gap-5">
            <FilterPanel />
            <RentChart />
          </div>
        )}

        {activeTab === "map" && (
          <Suspense fallback={<MapFallback />}>
            <RentMap />
          </Suspense>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #21262D", background: "#161B22", marginTop: "3rem" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <p style={{ fontSize: "0.7rem", color: "#30363D" }}>
            נתונים ממקורות חיים · מתעדכן בזמן אמת
          </p>
          <p style={{ fontSize: "0.7rem", color: "#30363D" }}>
            מחירון שכירות ישראל &copy; 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
