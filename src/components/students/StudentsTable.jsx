import StudentCard from './StudentCard'

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 animate-pulse">
      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-14 mr-auto mb-3" />
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

export default function StudentsTable({ loading, error, data, onEdit, onDelete, page, totalPages, onPrev, onNext }) {
  if (error) {
    return <div className="text-center py-16 text-red-500">שגיאה בטעינת התלמידים. אנא רענן את הדף.</div>
  }

  if (!loading && data?.results.length === 0) {
    return <div className="text-center py-16 text-gray-400">לא נמצאו תלמידים</div>
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          : data.results.map(student => (
              <StudentCard key={student.id} student={student} onEdit={onEdit} onDelete={onDelete} />
            ))
        }
      </div>

      {!loading && data && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <button
            onClick={onPrev}
            disabled={!data.previous}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            הקודם
          </button>
          <span className="text-sm text-gray-500">עמוד {page} מתוך {totalPages}</span>
          <button
            onClick={onNext}
            disabled={!data.next}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            הבא
          </button>
        </div>
      )}
    </div>
  )
}
