export default function SkeletonTable() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-full mb-1" />
          <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-2/3 mb-4" />
          <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-12" />
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-20" />
            </div>
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-10" />
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
