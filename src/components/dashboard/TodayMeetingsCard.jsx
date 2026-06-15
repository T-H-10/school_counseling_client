import { Link } from 'react-router-dom'
import { formatTime, EVENT_TYPE_LABELS } from './utils'

export default function TodayMeetingsCard({ meetings, onToggleStatus }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5" data-testid="dashboard-today-meetings">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">פגישות היום</h2>
        <span className="text-gray-400 dark:text-gray-500">📅</span>
      </div>

      {meetings.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">אין פגישות מתוכננות להיום</p>
      ) : (
        <ul className="space-y-3">
          {meetings.map(item => {
            const completed = item.status === 'completed'
            return (
              <li key={item.id} className="flex items-start gap-3" data-testid="today-meeting-item" data-event-id={item.id}>
                <span className="text-xs font-mono text-gray-400 dark:text-gray-500 w-12 shrink-0 mt-1">
                  {formatTime(item.date)}
                </span>
                <div className={`w-1 self-stretch rounded-full shrink-0 ${completed ? 'bg-blue-400 dark:bg-blue-500' : 'bg-green-400 dark:bg-green-500'}`} />
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/students/${item.student_id}`}
                    className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 truncate block"
                  >
                    {item.student_name}
                  </Link>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                      {EVENT_TYPE_LABELS[item.event_type] ?? item.event_type}
                    </p>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0 ${
                      completed
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                    }`}>
                      {completed ? 'הושלם' : 'ממתין'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onToggleStatus(item)}
                  aria-label={completed ? 'סמן כממתין' : 'סמן כהושלם'}
                  data-testid="today-meeting-toggle"
                  className="shrink-0 mt-0.5 transition-colors"
                >
                  {completed ? (
                    <svg className="w-5 h-5 text-blue-500 dark:text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
