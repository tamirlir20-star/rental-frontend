import { useFilterStore } from "../../store/filterStore";

interface Props {
  page: number;
  pages: number;
}

export default function Pagination({ page, pages }: Props) {
  const { setPage } = useFilterStore();

  if (pages <= 1) return null;

  const getPages = () => {
    const items: (number | "…")[] = [];
    if (pages <= 7) {
      for (let i = 1; i <= pages; i++) items.push(i);
    } else {
      items.push(1);
      if (page > 3) items.push("…");
      for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) items.push(i);
      if (page < pages - 2) items.push("…");
      items.push(pages);
    }
    return items;
  };

  const btnBase: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0.4rem",
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
    border: "1px solid #30363D",
    background: "#161B22",
    color: "#8B949E",
    transition: "all 0.15s",
    height: 34,
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.3rem",
        marginTop: "1.5rem",
      }}
    >
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        style={{
          ...btnBase,
          padding: "0 0.75rem",
          opacity: page === 1 ? 0.3 : 1,
          cursor: page === 1 ? "not-allowed" : "pointer",
        }}
      >
        הקודם
      </button>

      {getPages().map((p, i) =>
        p === "…" ? (
          <span
            key={`ellipsis-${i}`}
            style={{ padding: "0 0.3rem", color: "#30363D", fontSize: "0.8rem" }}
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => setPage(p as number)}
            style={{
              ...btnBase,
              width: 34,
              background: p === page ? "#F59E0B" : "#161B22",
              color: p === page ? "#0E1117" : "#8B949E",
              border: p === page ? "1px solid #F59E0B" : "1px solid #30363D",
              fontWeight: p === page ? 800 : 600,
            }}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => setPage(page + 1)}
        disabled={page === pages}
        style={{
          ...btnBase,
          padding: "0 0.75rem",
          opacity: page === pages ? 0.3 : 1,
          cursor: page === pages ? "not-allowed" : "pointer",
        }}
      >
        הבא
      </button>
    </div>
  );
}
