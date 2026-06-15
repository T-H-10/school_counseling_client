import { useNavigate } from 'react-router-dom'

function formatDate(dt) {
  if (!dt) return null
  return new Date(dt).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function getClassLabel(a) {
  const name = a.class_level_name ?? ''
  return a.class_number != null ? `${name}' ${a.class_number}` : `${name}'`
}

export default function LessonCard({ lesson, onEdit, onDelete }) {
  const navigate = useNavigate()
  const assignments = [...(lesson.assignments ?? [])].sort((a, b) => {
    const lvA = a.class_level_name ?? ''
    const lvB = b.class_level_name ?? ''
    if (lvA !== lvB) return lvA.localeCompare(lvB, 'he')
    return (a.class_number ?? Infinity) - (b.class_number ?? Infinity)
  })
  const shown = assignments.slice(0, 4)
  const extra = assignments.length - shown.length

  return (
    <div
      data-testid="lesson-card"
      data-lesson-id={lesson.id}
      className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer hover:shadow-md transition-all"
      onClick={() => navigate(`/lessons/${lesson.id}`)}
    >
      {/* Title row — in RTL: title on right, hover icons on left */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="text-base font-bold text-gray-800 dark:text-gray-100 leading-snug text-right flex-1" data-testid="lesson-card-title">
          {lesson.title}
        </p>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={e => { e.stopPropagation(); onEdit(lesson) }}
            data-testid="lesson-card-edit"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
            aria-label="עריכה"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
          </button>
          <button
            onClick={e => { e.stopPropagation(); onDelete(lesson.id) }}
            data-testid="lesson-card-delete"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            aria-label="מחיקה"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      {lesson.description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 text-right mb-1">
          {lesson.description}
        </p>
      )}

      {/* Presentation link */}
      {lesson.presentation_url && (
        <a
          href={lesson.presentation_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 mb-1 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
          </svg>
          פתח מצגת
        </a>
      )}

      {/* Assignments section */}
      <div className="border-t border-gray-100 dark:border-gray-800 pt-3 mt-3">
        {assignments.length === 0 ? (
          <p className="text-xs text-gray-400 dark:text-gray-600 text-right">טרם שויכו כיתות</p>
        ) : (
          <>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 text-right mb-2">כיתות משויכות:</p>
            <div className="space-y-2">
              {shown.map(a => {
                const label = getClassLabel(a)
                const isCompleted = a.status === 'completed'
                const date = formatDate(isCompleted ? a.completed_date : a.planned_date)
                return (
                  <div key={a.id} className="flex items-center justify-between">
                    {/* Class name first → renders on RIGHT in RTL */}
                    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                    {/* Status last → renders on LEFT in RTL */}
                    {isCompleted ? (
                      <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
                        {date ? `בוצע: ${date}` : 'בוצע'}
                      </span>
                    ) : (
                      <span className="text-xs text-red-500 dark:text-red-400">טרם בוצע</span>
                    )}
                  </div>
                )
              })}
              {extra > 0 && (
                <p className="text-xs text-indigo-500 dark:text-indigo-400 text-center">+{extra} נוספות</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
