import { lazy, Suspense, useEffect, useState } from "react";
import { useFilterStore } from "./store/filterStore";
import Header from "./components/Layout/Header";
import FilterPanel from "./components/FilterPanel/FilterPanel";
import FilterDrawer from "./components/FilterPanel/FilterDrawer";
import ResultsGrid from "./components/ResultsGrid/ResultsGrid";
import StatsBar from "./components/StatsBar/StatsBar";
import RentChart from "./components/RentChart";
import WelcomeModal from "./components/WelcomeModal";

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

function hasUrlFilters(): boolean {
  const p = new URLSearchParams(window.location.search);
  return ["city", "neighborhood", "priceMin", "priceMax", "roomsMin", "roomsMax"].some(k => p.has(k));
}

export default function App() {
  const { loadFromUrl, setCity, setNeighborhood, setPriceMax,
          city, neighborhood, roomsMin, roomsMax, priceMin, priceMax,
          hasParking, hasBalcony, petsAllowed, furnished, sources } = useFilterStore();
  const [activeTab, setActiveTabState] = useState<Tab>(readTabFromUrl);
  const [filterOpen, setFilterOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => !hasUrlFilters());

  // Count active filters for the badge
  const activeFilterCount = [
    city, neighborhood, roomsMin, roomsMax, priceMin, priceMax,
    hasParking, hasBalcony, petsAllowed, furnished,
  ].filter(Boolean).length + (sources.length > 0 && sources.length < 7 ? 1 : 0);

  useEffect(() => {
    loadFromUrl();
  }, []);

  const handleWelcomeDone = (filters: { city: string | null; neighborhood: string | null; priceMax: number | null }) => {
    if (filters.city) setCity(filters.city);
    if (filters.neighborhood) setNeighborhood(filters.neighborhood);
    if (filters.priceMax) setPriceMax(filters.priceMax);
    setShowWelcome(false);
  };

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
      {showWelcome && <WelcomeModal onDone={handleWelcomeDone} />}
      <Header />

      {/* Tab navigation */}
      <div
        className="sticky top-0 z-10"
        style={{
          background: "#0E1117",
          borderBottom: "1px solid #21262D",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0">
              {TABS.map(tab => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      padding: "0.65rem 1rem",
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

            {/* Filter button — mobile only */}
            <button
              className="lg:hidden"
              onClick={() => setFilterOpen(true)}
              style={{
                display: "flex", alignItems: "center", gap: "0.35rem",
                padding: "0.4rem 0.75rem",
                borderRadius: "0.4rem",
                background: activeFilterCount > 0 ? "rgba(245,158,11,0.12)" : "#161B22",
                border: `1px solid ${activeFilterCount > 0 ? "rgba(245,158,11,0.4)" : "#30363D"}`,
                color: activeFilterCount > 0 ? "#F59E0B" : "#8B949E",
                fontSize: "0.8rem", fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="11" y1="18" x2="13" y2="18" />
              </svg>
              פילטר
              {activeFilterCount > 0 && (
                <span style={{
                  background: "#F59E0B", color: "#000",
                  borderRadius: "50%", width: 16, height: 16,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.65rem", fontWeight: 800,
                }}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <FilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {activeTab === "listings" && (
          <div className="grid grid-cols-1 lg:grid-cols-[272px_1fr] gap-5">
            <div className="hidden lg:block"><FilterPanel /></div>
            <div>
              <StatsBar />
              <ResultsGrid />
            </div>
          </div>
        )}

        {activeTab === "charts" && (
          <div className="grid grid-cols-1 lg:grid-cols-[272px_1fr] gap-5">
            <div className="hidden lg:block"><FilterPanel /></div>
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
