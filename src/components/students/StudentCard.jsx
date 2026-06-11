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
      className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700 transition-all"
      onClick={() => navigate(`/students/${student.id}`)}
    >
      {/* Top row — RTL flex: badge on right (start), icons on left (end) on hover */}
      <div className="flex items-center justify-between mb-3">
        {isActive ? (
          <span className="text-xs font-medium bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">פעילה</span>
        ) : (
          <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">לא פעילה</span>
        )}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={e => { e.stopPropagation(); onEdit(student) }}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
            aria-label="עריכה"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H7v-3.414a2 2 0 01.586-1.414z" />
            </svg>
          </button>
          <button
            onClick={e => { e.stopPropagation(); onDelete(student.id) }}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            aria-label="מחיקה"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M3 7h18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Name */}
      <p className="text-base font-bold text-gray-800 dark:text-gray-100 text-center mb-1">{student.full_name}</p>

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
