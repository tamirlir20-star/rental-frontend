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
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="animate-pulse"
            style={{
              flex: 1,
              background: "#161B22",
              border: "1px solid #21262D",
              borderRadius: "0.5rem",
              padding: "0.75rem 1rem",
            }}
          >
            <div style={{ height: 10, background: "#21262D", borderRadius: 4, width: "40%", marginBottom: 8 }} />
            <div style={{ height: 20, background: "#21262D", borderRadius: 4, width: "65%" }} />
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
    <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
      <StatCard
        label="מודעות פעילות"
        value={data.total.toLocaleString("he-IL")}
        sub="תוצאות לסינון הנוכחי"
        primary
      />
      {avg && (
        <StatCard
          label="מחיר ממוצע"
          value={fmt(avg)}
          sub="לחודש"
        />
      )}
      {med && (
        <StatCard
          label="מחיר חציוני"
          value={fmt(med)}
          sub="לחודש"
        />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  primary,
}: {
  label: string;
  value: string;
  sub?: string;
  primary?: boolean;
}) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 120,
        background: primary ? "#1C2128" : "#161B22",
        border: primary ? "1px solid #30363D" : "1px solid #21262D",
        borderRadius: "0.5rem",
        padding: "0.7rem 1rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Amber accent line on top for primary card */}
      {primary && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
            height: 2,
            background: "linear-gradient(to left, #F59E0B, #D97706)",
          }}
        />
      )}
      <p
        style={{
          fontSize: "0.67rem",
          fontWeight: 600,
          color: "#484F58",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "0.3rem",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: "1.4rem",
          fontWeight: 900,
          color: primary ? "#F59E0B" : "#E6EDF3",
          lineHeight: 1,
          letterSpacing: "-0.02em",
          marginBottom: "0.25rem",
        }}
      >
        {value}
      </p>
      {sub && (
        <p style={{ fontSize: "0.67rem", color: "#30363D" }}>{sub}</p>
      )}
    </div>
  );
}
