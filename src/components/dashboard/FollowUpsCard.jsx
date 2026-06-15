import { Link } from 'react-router-dom'
import { futureDateBadge } from './utils'

export default function FollowUpsCard({ items }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5" data-testid="dashboard-followups">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">מעקבים קרובים</h2>
        <span className="text-gray-400 dark:text-gray-500">⏳</span>
      </div>

      {!items?.length ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">אין מעקבים מתוכננים בשבוע הקרוב</p>
      ) : (
        <ul className="space-y-3">
          {items.map(item => {
            const badge = futureDateBadge(item.date)
            return (
              <li key={item.id} className="flex items-start gap-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${badge.cls}`}>
                  {badge.label}
                </span>
                <div className="min-w-0">
                  <Link
                    to={`/students/${item.student_id}`}
                    className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 truncate block"
                  >
                    {item.student_name}
                  </Link>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{item.title}</p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
