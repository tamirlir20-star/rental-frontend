import { lazy, Suspense, useEffect, useState } from "react";
import { useFilterStore } from "./store/filterStore";
import Header from "./components/Layout/Header";
import FilterPanel from "./components/FilterPanel/FilterPanel";
import ResultsGrid from "./components/ResultsGrid/ResultsGrid";
import StatsBar from "./components/StatsBar/StatsBar";
import RentChart from "./components/RentChart";

const RentMap = lazy(() => import("./components/RentMap"));

const TABS = [
  { key: "listings", label: "מודעות", icon: "🏠" },
  { key: "charts", label: "גרפים", icon: "📊" },
  { key: "map", label: "מפה", icon: "🗺️" },
] as const;

type Tab = (typeof TABS)[number]["key"];

function readTabFromUrl(): Tab {
  const tab = new URLSearchParams(window.location.search).get("tab");
  return (tab === "charts" || tab === "map") ? tab : "listings";
}

function MapFallback() {
  return (
    <div className="rounded-2xl border flex items-center justify-center" style={{ height: 540, background: "#fff", borderColor: "#e8e4dc" }}>
      <div className="text-center">
        <div className="text-4xl mb-3">🗺️</div>
        <p style={{ color: "#a8a29e" }}>טוען מפה...</p>
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
    <div className="min-h-screen" style={{ background: "#f4f2ee" }}>
      <Header />

      {/* Tab bar */}
      <div className="sticky top-0 z-10" style={{ background: "#fff", borderBottom: "1px solid #e8e4dc", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1 py-2">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                style={
                  activeTab === tab.key
                    ? { background: "#0f172a", color: "#fff" }
                    : { color: "#78716c", background: "transparent" }
                }
              >
                <span className="text-base">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "listings" && (
          <div className="grid grid-cols-1 lg:grid-cols-[288px_1fr] gap-6">
            <FilterPanel />
            <div>
              <StatsBar />
              <ResultsGrid />
            </div>
          </div>
        )}

        {activeTab === "charts" && (
          <div className="grid grid-cols-1 lg:grid-cols-[288px_1fr] gap-6">
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

      <footer style={{ borderTop: "1px solid #e8e4dc", background: "#fff", marginTop: "2rem" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-xs" style={{ color: "#a8a29e" }}>נתונים ממקורות חיים | מתעדכן בזמן אמת</p>
          <p className="text-xs" style={{ color: "#a8a29e" }}>מחירון שכירות ישראל &copy; 2025</p>
        </div>
      </footer>
    </div>
  );
}
