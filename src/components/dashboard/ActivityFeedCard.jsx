import { Link } from 'react-router-dom'
import { relativeDate, EVENT_TYPE_ICONS } from './utils'

export default function ActivityFeedCard({ recentEvents, eventsThisWeek }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5" data-testid="dashboard-activity-feed">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">סיכום שבועי ופעולות אחרונות</h2>
        <Link to="/calendar"
          className="text-xs text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
          {eventsThisWeek} פעולות השבוע
        </Link>
      </div>

      {recentEvents.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">אין פעילות השבוע</p>
      ) : (
        <ul className="space-y-4">
          {recentEvents.map(event => (
            <li key={event.id} className="flex items-start gap-3">
              <span className="text-lg mt-0.5 shrink-0">{EVENT_TYPE_ICONS[event.event_type] ?? '📌'}</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{relativeDate(event.date)}</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{event.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  עם{' '}
                  <Link to={`/students/${event.student_id}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline">
                    {event.student_name}
                  </Link>
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
