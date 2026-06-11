import SkeletonRow from './SkeletonRow'

export default function StudentsTable({ loading, error, data, onRowClick, page, totalPages, onPrev, onNext }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="text-right px-4 py-3 font-semibold text-gray-600">שם מלא</th>
            <th className="text-right px-4 py-3 font-semibold text-gray-600">ת.ז.</th>
            <th className="text-right px-4 py-3 font-semibold text-gray-600">כיתה</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
          ) : error ? (
            <tr>
              <td colSpan={3} className="text-center py-12 text-red-500">
                שגיאה בטעינת התלמידים. אנא רענן את הדף.
              </td>
            </tr>
          ) : data?.results.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-12 text-gray-400">
                לא נמצאו תלמידים
              </td>
            </tr>
          ) : (
            data?.results.map(student => (
              <tr
                key={student.id}
                onClick={() => onRowClick(student.id)}
                className="border-b border-gray-50 last:border-0 hover:bg-indigo-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-medium text-gray-800">{student.full_name}</td>
                <td className="px-4 py-3 text-gray-500 font-mono tracking-wide">{student.id_number}</td>
                <td className="px-4 py-3">
                  {student.current_class_level ? (
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      כיתה {student.current_class_level}
                    </span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {!loading && !error && data && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <button
            onClick={onPrev}
            disabled={!data.previous}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            הקודם
          </button>
          <span className="text-sm text-gray-500">
            עמוד {page} מתוך {totalPages}
          </span>
          <button
            onClick={onNext}
            disabled={!data.next}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            הבא
          </button>
        </div>
      )}
    </div>
  )
}
