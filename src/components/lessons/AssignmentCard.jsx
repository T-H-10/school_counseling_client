function formatDate(dt) {
  if (!dt) return null
  return new Date(dt).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function getClassLabel(a) {
  const name = a.class_level_name ?? ''
  return a.class_number != null ? `כיתה ${name}' ${a.class_number}` : `כיתה ${name}'`
}

export default function AssignmentCard({ assignment: a, onComplete, onEditSummary, onDelete }) {
  const isCompleted = a.status === 'completed'
  const classLabel  = getClassLabel(a)
  const date        = formatDate(isCompleted ? a.completed_date : a.planned_date)

  if (isCompleted) {
    return (
      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 border-r-4 border-r-green-500 rounded-xl p-4 flex flex-col gap-2">
        {/* RTL: class label first → RIGHT, badge last → LEFT */}
        <div className="flex items-center justify-between">
          <p className="text-base font-bold text-gray-800 dark:text-gray-100">{classLabel}</p>
          <span className="text-xs font-semibold bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
            הושלם
          </span>
        </div>

        {date && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-right">
            תאריך ביצוע: {date}
          </p>
        )}

        {a.summary && (
          <p className="text-sm text-gray-600 dark:text-gray-300 italic text-right leading-relaxed">
            "{a.summary}"
          </p>
        )}

        {/* RTL: primary action first → RIGHT, delete last → LEFT */}
        <div className="flex items-center justify-between pt-1 border-t border-green-200 dark:border-green-900 mt-1">
          <button
            onClick={onEditSummary}
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 transition-colors font-medium"
          >
            ערוך סיכום
          </button>
          <button
            onClick={onDelete}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            מחק
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 border-r-4 border-r-orange-400 rounded-xl p-4 flex flex-col gap-2">
      {/* RTL: class label first → RIGHT, badge last → LEFT */}
      <div className="flex items-center justify-between">
        <p className="text-base font-bold text-gray-800 dark:text-gray-100">{classLabel}</p>
        <span className="text-xs font-semibold bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full">
          מתוכנן
        </span>
      </div>

      {date && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-right">
          מתוכנן ל: {date}
        </p>
      )}

      {/* RTL: primary action first → RIGHT, delete last → LEFT */}
      <div className="flex items-center justify-between pt-1 border-t border-orange-200 dark:border-orange-900 mt-1">
        <button
          onClick={onComplete}
          className="text-sm border border-orange-400 dark:border-orange-600 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 px-3 py-1.5 rounded-lg transition-colors font-medium"
        >
          סמן כהושלם + סיכום
        </button>
        <button
          onClick={onDelete}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          מחק
        </button>
      </div>
    </div>
  )
}
