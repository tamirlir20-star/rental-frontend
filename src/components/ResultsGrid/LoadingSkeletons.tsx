function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="h-5 bg-gray-200 rounded w-14" />
      </div>
      <div className="h-7 bg-gray-200 rounded w-32 mb-1" />
      <div className="h-3 bg-gray-100 rounded w-24 mb-3" />
      <div className="flex gap-2 mb-3">
        <div className="h-4 bg-gray-100 rounded w-20" />
        <div className="h-4 bg-gray-100 rounded w-16" />
      </div>
      <div className="h-3 bg-gray-100 rounded w-28 mb-4" />
      <div className="flex gap-2 mb-3">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="h-6 w-6 bg-gray-100 rounded-full" />
        ))}
      </div>
      <div className="h-8 bg-gray-100 rounded-lg" />
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
