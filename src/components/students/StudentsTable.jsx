import { useEffect, useRef } from 'react'
import StudentCard from './StudentCard'

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-14" />
        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-10" />
      </div>
      <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded w-3/4 mx-auto mb-2" />
      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mx-auto mb-4" />
      <div className="h-px bg-gray-100 dark:bg-gray-800 mb-3" />
      <div className="flex justify-between">
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-20" />
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-12" />
      </div>
    </div>
  )
}

const GRID = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'

export default function StudentsTable({ loading, loadingMore, error, students, onEdit, onDelete, hasMore, onLoadMore }) {
  const sentinelRef = useRef(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasMore || loadingMore) return
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) onLoadMore() },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, loadingMore, onLoadMore])

  if (error) {
    return <div className="text-center py-16 text-red-500">שגיאה בטעינת התלמידים. אנא רענן את הדף.</div>
  }

  if (!loading && students.length === 0) {
    return <div className="text-center py-16 text-gray-400">לא נמצאו תלמידים</div>
  }

  return (
    <div>
      <div className={GRID}>
        {loading
          ? [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
          : students.map(student => (
              <StudentCard key={student.id} student={student} onEdit={onEdit} onDelete={onDelete} />
            ))
        }
      </div>

      {loadingMore && (
        <div className={`${GRID} mt-4`}>
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Sentinel — IntersectionObserver target */}
      <div ref={sentinelRef} className="h-4" />
    </div>
  )
}
