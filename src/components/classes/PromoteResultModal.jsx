const REASON_LABELS = {
  last_grade: 'בוגר (כיתה ח׳)',
  already_enrolled: 'כבר רשום לשנה זו',
}

export default function PromoteResultModal({ result, targetYearName, onClose }) {
  if (!result) return null

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        data-testid="promote-result-modal"
        className="bg-white dark:bg-gray-900 rounded-2xl p-8 w-full max-w-lg shadow-xl max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 text-right">
          תוצאות קידום תלמידים
        </h2>

        {/* Admin activation note */}
        {targetYearName && (
          <div
            data-testid="promote-activate-note"
            className="mt-2 mb-1 flex items-start gap-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl px-3 py-2.5 text-right"
          >
            <span className="text-blue-500 shrink-0 mt-0.5">ℹ️</span>
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              כדי לראות את הכיתות המעודכנות, יש לבקש ממנהל המערכת להפעיל את שנת הלימודים
              {' '}<strong>{targetYearName}</strong>.
            </p>
          </div>
        )}

        {/* Summary row */}
        <div className="flex gap-4 mt-3 mb-5">
          <div className="flex-1 bg-green-50 dark:bg-green-950/40 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-700 dark:text-green-400">{result.created}</p>
            <p className="text-sm text-green-600 dark:text-green-500 mt-1">הועברו</p>
          </div>
          <div className="flex-1 bg-amber-50 dark:bg-amber-950/40 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-amber-700 dark:text-amber-400">{result.skipped}</p>
            <p className="text-sm text-amber-600 dark:text-amber-500 mt-1">דולגו</p>
          </div>
        </div>

        {/* Skipped students table */}
        {result.skipped_students?.length > 0 && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
              תלמידים שדולגו:
            </p>
            <div className="overflow-y-auto flex-1 border border-gray-200 dark:border-gray-700 rounded-xl">
              <table
                data-testid="promote-skipped-table"
                className="w-full text-sm text-right"
              >
                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                  <tr>
                    <th className="px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400">שם תלמיד/ה</th>
                    <th className="px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400">כיתה</th>
                    <th className="px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400">סיבה</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {result.skipped_students.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-2.5 text-gray-900 dark:text-gray-100">{s.full_name}</td>
                      <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">
                        {s.grade ? `כיתה ${s.grade}` : '—'}
                      </td>
                      <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400">
                        {REASON_LABELS[s.reason] ?? s.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <button
          data-testid="promote-result-close"
          onClick={onClose}
          className="mt-6 w-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium py-2.5 rounded-xl transition-colors text-sm"
        >
          סגור
        </button>
      </div>
    </div>
  )
}
