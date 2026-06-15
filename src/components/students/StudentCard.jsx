import { useNavigate } from 'react-router-dom'

function formatDate(dateStr) {
  if (!dateStr) return null
  const date = new Date(dateStr)
  const today = new Date()
  if (date.toDateString() === today.toDateString()) return 'היום'
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return 'אתמול'
  return date.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function StudentCard({ student, onEdit, onDelete }) {
  const navigate = useNavigate()
  const isActive = !!student.current_class_level
  const classLabel = student.current_class_level
    ? `כיתה ${student.current_class_level}${student.current_class_number ? ` ${student.current_class_number}` : ''}`
    : null

  return (
    <div
      data-testid="student-card"
      data-student-id={student.id}
      className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700 transition-all"
      onClick={() => navigate(`/students/${student.id}`)}
    >
      {/* Top row — RTL flex: badge on right (start), icons on left (end) on hover */}
      <div className="flex items-center justify-between mb-3">
        {isActive ? (
          <span className="text-xs font-medium bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full" data-testid="student-card-status">פעילה</span>
        ) : (
          <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full" data-testid="student-card-status">לא פעילה</span>
        )}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Pencil / edit */}
          <button
            onClick={e => { e.stopPropagation(); onEdit(student) }}
            data-testid="student-card-edit"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
            aria-label="עריכה"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
          </button>
          {/* Trash / delete */}
          <button
            onClick={e => { e.stopPropagation(); onDelete(student.id) }}
            data-testid="student-card-delete"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            aria-label="מחיקה"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>

      {/* Name */}
      <p className="text-base font-bold text-gray-800 dark:text-gray-100 text-center mb-1" data-testid="student-card-name">{student.full_name}</p>

      {/* Class */}
      <p className="text-sm text-center mb-3 text-gray-500 dark:text-gray-400">
        {classLabel ?? <span className="text-gray-300 dark:text-gray-600">ללא כיתה</span>}
      </p>

      {/* Last event — omitted entirely when no events exist */}
      {student.last_event_date && (
        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3 text-xs">
          <span className="text-gray-500 dark:text-gray-400">פגישה אחרונה:</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {formatDate(student.last_event_date)}
          </span>
        </div>
      )}
    </div>
  )
}
