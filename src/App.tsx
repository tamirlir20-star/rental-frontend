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
  { key: "charts", label: "גרפים" },
  { key: "map", label: "מפה" },
] as const;

type Tab = (typeof TABS)[number]["key"];

function readTabFromUrl(): Tab {
  const tab = new URLSearchParams(window.location.search).get("tab");
  return (tab === "charts" || tab === "map") ? tab : "listings";
}

function MapFallback() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm" style={{ height: 540 }}>
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-2">🗺️</div>
          <p>טוען מפה...</p>
        </div>
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === tab.key
                    ? "border-amber-400 text-amber-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "listings" && (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            <FilterPanel />
            <div>
              <StatsBar />
              <ResultsGrid />
            </div>
          </div>
        )}

        {activeTab === "charts" && (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
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

      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <p className="text-xs text-gray-400">נתונים ממקורות חיים | מתעדכן בזמן אמת</p>
          <p className="text-xs text-gray-400">מחירון שכירות ישראל &copy; 2025</p>
        </div>
      </footer>
    </div>
  );
}
