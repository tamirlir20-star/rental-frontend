import { useListings } from "../../hooks/useListings";
import { useFilterStore } from "../../store/filterStore";

function median(listings: { price: number | null }[]): number | null {
  const prices = listings.map(l => l.price).filter((p): p is number => p != null).sort((a, b) => a - b);
  if (!prices.length) return null;
  const mid = Math.floor(prices.length / 2);
  return prices.length % 2 ? prices[mid] : Math.round((prices[mid - 1] + prices[mid]) / 2);
}

function fmt(n: number) {
  return "₪" + n.toLocaleString("he-IL");
}

export default function StatsBar() {
  const filters = useFilterStore();
  const { data, status } = useListings(filters);

  if (status === "loading" || !data) {
    return (
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-xl px-4 py-3 animate-pulse" style={{ background: "#fff", border: "1px solid #e8e4dc" }}>
            <div className="h-3 rounded mb-2" style={{ background: "#f0ede7", width: "50%" }} />
            <div className="h-5 rounded" style={{ background: "#f0ede7", width: "70%" }} />
          </div>
        ))}
      </div>
    );
  }

  const listings = data.listings;
  const prices = listings.map(l => l.price).filter((p): p is number => p != null);
  const avg = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : null;
  const med = median(listings);

  return (
    <div className="grid grid-cols-3 gap-3 mb-5">
      <StatCard label="מודעות" value={data.total.toLocaleString("he-IL")} />
      {avg && <StatCard label="ממוצע" value={fmt(avg)} accent />}
      {med && <StatCard label="חציון" value={fmt(med)} />}
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        background: accent ? "#0f172a" : "#fff",
        border: `1px solid ${accent ? "#0f172a" : "#e8e4dc"}`,
      }}
    >
      <p className="text-xs font-medium mb-0.5" style={{ color: accent ? "#94a3b8" : "#a8a29e" }}>{label}</p>
      <p className="text-lg font-bold leading-tight" style={{ color: accent ? "#f59e0b" : "#1c1917" }}>{value}</p>
    </div>
  );
}
