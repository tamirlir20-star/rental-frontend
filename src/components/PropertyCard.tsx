import { useFilterStore } from '../store/useFilterStore';
import type { NeighborhoodData } from '../data/rentals';

interface Props {
  neighborhood: string;
  data: NeighborhoodData;
  isBestValue: boolean;
  rank: number;
}

export default function PropertyCard({ neighborhood, data, isBestValue }: Props) {
  const { comparisonList, toggleComparison } = useFilterStore();
  const inComparison = comparisonList.includes(neighborhood);

  const trendIcon = data.trend === 'up' ? '↑' : data.trend === 'down' ? '↓' : '→';
  const trendColor = data.trend === 'up' ? 'text-red-500' : data.trend === 'down' ? 'text-green-500' : 'text-gray-400';
  const yoyColor = data.yoyChange > 0 ? 'text-red-500' : data.yoyChange < 0 ? 'text-green-500' : 'text-gray-500';

  return (
    <div className={`bg-white rounded-xl border transition-all hover:shadow-md ${
      inComparison ? 'border-amber-400 shadow-md' : 'border-gray-100 shadow-sm'
    }`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-[#0D1B2A] text-base">{neighborhood}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{data.sampleCount} נכסים</p>
          </div>
          <div className="flex gap-1.5 flex-col items-end">
            {isBestValue && (
              <span className="bg-amber-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                ערך מעולה
              </span>
            )}
            <span className={`text-lg font-bold ${trendColor}`}>{trendIcon}</span>
          </div>
        </div>

        {/* Main price */}
        <div className="mb-3">
          <p className="text-2xl font-bold text-[#0D1B2A]">
            ₪{data.avgRent.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">ממוצע לחודש</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-xs font-semibold text-gray-700">₪{data.pricePerSqm.toLocaleString()}</p>
            <p className="text-xs text-gray-400">למ"ר</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-xs font-semibold text-gray-700">₪{data.medianRent.toLocaleString()}</p>
            <p className="text-xs text-gray-400">חציון</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className={`text-xs font-semibold ${yoyColor}`}>
              {data.yoyChange > 0 ? '+' : ''}{data.yoyChange}%
            </p>
            <p className="text-xs text-gray-400">שנתי</p>
          </div>
        </div>

        {/* Range */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>₪{data.minRent.toLocaleString()}</span>
          <div className="flex-1 mx-2 h-1 bg-gray-100 rounded-full relative">
            <div className="absolute inset-0 bg-amber-200 rounded-full" />
          </div>
          <span>₪{data.maxRent.toLocaleString()}</span>
        </div>

        {/* Compare button */}
        <button
          onClick={() => toggleComparison(neighborhood)}
          disabled={!inComparison && comparisonList.length >= 4}
          className={`w-full py-2 rounded-lg text-xs font-semibold transition-all ${
            inComparison
              ? 'bg-amber-400 text-white hover:bg-amber-500'
              : comparisonList.length >= 4
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          {inComparison ? 'הסר מהשוואה' : 'הוסף להשוואה'}
        </button>
      </div>
    </div>
  );
}
