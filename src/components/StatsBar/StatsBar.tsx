import { useListings } from "../../hooks/useListings";
import { useFilterStore } from "../../store/filterStore";
import { formatPrice } from "../../utils/format";

function median(listings: { price: number | null }[]): number | null {
  const prices = listings.map(l => l.price).filter((p): p is number => p != null).sort((a, b) => a - b);
  if (!prices.length) return null;
  const mid = Math.floor(prices.length / 2);
  return prices.length % 2 ? prices[mid] : Math.round((prices[mid - 1] + prices[mid]) / 2);
}

export default function StatsBar() {
  const filters = useFilterStore();
  const { data, status } = useListings(filters);

  if (status === "loading" || !data) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3 mb-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-64" />
      </div>
    );
  }

  const listings = data.listings;
  const prices = listings.map(l => l.price).filter((p): p is number => p != null);
  const avg = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : null;
  const med = median(listings);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3 mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
      <span>
        נמצאו <strong className="text-[#0D1B2A]">{data.total.toLocaleString("he-IL")}</strong> מודעות
      </span>
      {avg && (
        <>
          <span className="text-gray-300">|</span>
          <span>ממוצע <strong className="text-[#0D1B2A]">{formatPrice(avg)}</strong></span>
        </>
      )}
      {med && (
        <>
          <span className="text-gray-300">|</span>
          <span>חציון <strong className="text-[#0D1B2A]">{formatPrice(med)}</strong></span>
        </>
      )}
      {data.pages > 1 && (
        <>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500 text-xs">עמוד {data.page} מתוך {data.pages}</span>
        </>
      )}
    </div>
  );
}
