import { formatDatetime } from './utils'
import { getHebrewDateString } from '../../utils/hebrewDate'

export default function SessionsTable({
  sessions,
  classLevelMap,
  schoolYearMap,
  deletingId,
  deleteError,
  onEdit,
  onConfirmDelete,
  onStartDelete,
  onCancelDelete,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
        <span>נושא</span>
        <span className="w-12 text-center">כיתה</span>
        <span className="w-28 text-center">תאריך</span>
        <span className="w-24 text-center">שנת לימודים</span>
        <span className="w-24 text-center">פעולות</span>
      </div>

      <div className="divide-y divide-gray-100">
        {sessions.map(session => (
          <div key={session.id}>
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3.5 items-center hover:bg-gray-50 transition-colors">
              {/* Title + optional summary */}
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{session.title}</p>
                {session.summary && (
                  <p className="text-xs text-gray-400 truncate mt-0.5">{session.summary}</p>
                )}
              </div>

              {/* Class level */}
              <div className="w-12 text-center">
                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  {classLevelMap[session.class_level] ?? '—'}
                </span>
              </div>

              {/* Date */}
              <div className="w-28 text-center leading-tight">
                <div className="text-xs text-gray-500 font-mono">{formatDatetime(session.date)}</div>
                <div className="text-xs text-indigo-400 opacity-80">{getHebrewDateString(new Date(session.date), false)}</div>
              </div>

              {/* School year */}
              <div className="w-24 text-center">
                <span className="text-xs text-gray-500">{schoolYearMap[session.school_year] ?? '—'}</span>
              </div>

              {/* Actions */}
              <div className="w-24 flex items-center justify-center gap-1">
                {deletingId === session.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onConfirmDelete(session.id)}
                      className="text-xs text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded-md transition-colors"
                    >
                      מחק
                    </button>
                    <button
                      onClick={onCancelDelete}
                      className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md transition-colors"
                    >
                      ביטול
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => onEdit(session)}
                      className="text-xs text-gray-400 hover:text-indigo-600 transition-colors px-2 py-1 rounded hover:bg-indigo-50"
                    >
                      עריכה
                    </button>
                    <button
                      onClick={() => onStartDelete(session.id)}
                      className="text-xs text-gray-400 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50"
                    >
                      מחיקה
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Delete error for this row */}
            {deleteError === session.id && (
              <div className="px-5 pb-3 text-xs text-red-600">
                שגיאה במחיקה. אנא נסה שוב.
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer count */}
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
        <span className="text-xs text-gray-400">{sessions.length} שיעורים</span>
      </div>
    </div>
  )
}
