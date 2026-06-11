export default function SkeletonProfile() {
  return (
    <div>
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4 animate-pulse">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0" />
          <div className="flex-1 pt-1">
            <div className="h-6 bg-gray-200 rounded w-44 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-28 mb-4" />
            <div className="h-9 bg-gray-200 rounded w-32" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
        <div className="h-4 bg-gray-100 rounded w-52 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-44 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-36" />
      </div>
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-5 bg-gray-200 rounded-full w-16" />
              <div className="h-4 bg-gray-100 rounded w-24" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-48 mb-1.5" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
          </div>
        ))}
      </div>
    </div>
  )
}
