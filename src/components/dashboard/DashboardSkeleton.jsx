import SkeletonCard from './SkeletonCard'

export default function DashboardSkeleton() {
  return (
    <div>
      <div className="mb-6">
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse mb-2" />
        <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-56 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4">
        <SkeletonCard className="h-64" />
        <SkeletonCard className="h-64" />
      </div>
    </div>
  )
}
