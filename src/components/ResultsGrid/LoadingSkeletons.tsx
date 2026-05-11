function SkeletonCard() {
  return (
    <div
      className="animate-pulse"
      style={{
        background: "#161B22",
        borderRadius: "0.65rem",
        border: "1px solid #21262D",
        overflow: "hidden",
      }}
    >
      {/* Image placeholder */}
      <div style={{ height: 168, background: "#0E1117" }} />

      <div style={{ padding: "0.75rem" }}>
        {/* Stats row */}
        <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.55rem" }}>
          <div style={{ height: 24, width: 72, borderRadius: 4, background: "#21262D" }} />
          <div style={{ height: 24, width: 56, borderRadius: 4, background: "#21262D" }} />
        </div>

        {/* Location */}
        <div style={{ height: 14, width: "65%", borderRadius: 4, background: "#21262D", marginBottom: "0.5rem" }} />

        {/* Amenities */}
        <div style={{ display: "flex", gap: "0.3rem", marginBottom: "0.65rem" }}>
          <div style={{ width: 24, height: 24, borderRadius: 4, background: "#21262D" }} />
          <div style={{ width: 24, height: 24, borderRadius: 4, background: "#21262D" }} />
        </div>

        {/* CTA */}
        <div style={{ height: 34, borderRadius: "0.4rem", background: "#21262D" }} />
      </div>
    </div>
  );
}

export default function LoadingSkeletons({ count = 12 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </>
  );
}
