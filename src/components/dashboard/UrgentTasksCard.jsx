import { Link } from 'react-router-dom'
import { relativeDate } from './utils'

export default function UrgentTasksCard({ urgentCount, missingSummaries, atRiskStudents }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-red-100 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40">
        <span>🔥</span>
        <h2 className="text-sm font-bold text-red-700 dark:text-red-400">משימות דורשות טיפול</h2>
      </div>

      {urgentCount === 0 ? (
        <p className="px-5 py-6 text-sm text-center text-green-600 dark:text-green-400">✓ אין משימות פתוחות</p>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {missingSummaries?.map(item => (
            <li key={item.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
              <div className="flex items-start gap-2.5 min-w-0">
                <span className="mt-0.5 shrink-0">📌</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">פגישה ללא סיכום</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                    {item.student_name} · {relativeDate(item.date)}
                  </p>
                </div>
              </div>
              <Link
                to={`/students/${item.student_id}`}
                className="shrink-0 text-xs font-medium border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg px-3 py-1.5 transition-colors"
              >
                הוסף סיכום
              </Link>
            </li>
          ))}

          {atRiskStudents?.count > 0 && (
            <li className="px-5 py-3.5">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 shrink-0">⚠️</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    תלמידים ללא מגע (90+ יום): {atRiskStudents.count}
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                    {atRiskStudents.students.slice(0, 3).map(s => (
                      <Link key={s.id} to={`/students/${s.id}`}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                        {s.full_name}
                      </Link>
                    ))}
                    {atRiskStudents.count > 3 && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        ועוד {atRiskStudents.count - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
