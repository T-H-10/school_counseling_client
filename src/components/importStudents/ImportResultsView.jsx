export default function ImportResultsView({ result, onDone, onReset }) {
  return (
    <div data-testid="import-students-results">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-green-600 text-lg">✓</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">הייבוא הושלם</p>
          <p className="text-sm text-gray-500">
            נוצרו <span className="font-semibold text-green-700">{result.created}</span> תלמידים בהצלחה
            {result.errors.length > 0 && (
              <span className="text-red-600"> · {result.errors.length} שגיאות</span>
            )}
          </p>
        </div>
      </div>

      {result.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-h-52 overflow-y-auto">
          <p className="text-xs font-semibold text-red-700 mb-2">שורות שנכשלו:</p>
          <ul className="space-y-1">
            {result.errors.map((err, i) => (
              <li key={i} className="text-xs text-red-600">
                <span className="font-mono font-semibold">שורה {err.row}:</span> {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-3 mt-5">
        <button
          onClick={onDone}
          data-testid="import-students-done"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          סגור
        </button>
        {result.errors.length > 0 && (
          <button
            onClick={onReset}
            className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ייבוא קובץ נוסף
          </button>
        )}
      </div>
    </div>
  )
}
