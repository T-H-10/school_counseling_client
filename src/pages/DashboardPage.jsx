import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboard } from '../api/dashboard'
import { getHebrewDateString, getTodayHoliday } from '../utils/hebrewDate'

const EVENT_TYPE_ICONS = {
  meeting: '📅',
  call: '📞',
  teacher_report: '📋',
  other: '📌',
}

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
}

function relativeDate(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const time = formatTime(dateStr)
  const dayDiff = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  if (dayDiff === 0) return `היום, ${time}`
  if (dayDiff === 1) return `אתמול, ${time}`
  return `לפני ${dayDiff} ימים, ${time}`
}

function StatCard({ label, value, colorClass, icon, urgent }) {
  if (urgent) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-red-300 dark:border-red-700 p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl bg-red-50 dark:bg-red-950 shrink-0">
          ⚠️
        </div>
        <div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{value}</p>
          <p className="text-sm text-red-500 dark:text-red-400 mt-0.5">{label}</p>
        </div>
      </div>
    )
  }
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl shrink-0 ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse ${className}`}>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3" />
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
      <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-2/3" />
    </div>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse mb-2" />
          <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-56 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4">
          <SkeletonCard className="h-64" />
          <SkeletonCard className="h-64" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 text-base">שגיאה בטעינת נתוני לוח הבקרה. אנא רענן את הדף.</p>
      </div>
    )
  }

  const { recent_events, stats, alerts } = data
  const { upcoming_today, missing_summaries, at_risk_students } = alerts ?? {}
  const hebrewDate = getHebrewDateString()
  const holiday = getTodayHoliday()

  const urgentCount = (missing_summaries?.length ?? 0) + (at_risk_students?.count ?? 0)

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">לוח בקרה</h1>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {new Date().toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <span className="text-gray-300 dark:text-gray-600 text-sm">·</span>
          <p className="text-sm text-indigo-500 dark:text-indigo-400 font-medium">{hebrewDate}</p>
          {holiday && (
            <span className="text-xs bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">
              ✡ {holiday}
            </span>
          )}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="דורש טיפול עכשיו"
          value={urgentCount}
          urgent
        />
        <StatCard
          label="פגישות השבוע"
          value={stats.events_this_week}
          icon="📋"
          colorClass="bg-purple-50 dark:bg-purple-950"
        />
        <StatCard
          label="פגישות היום"
          value={upcoming_today?.length ?? 0}
          icon="📅"
          colorClass="bg-blue-50 dark:bg-blue-950"
        />
        <StatCard
          label="תלמידות פעילות"
          value={stats.students_count}
          icon="👥"
          colorClass="bg-green-50 dark:bg-green-950"
        />
      </div>

      {/* Asymmetric main grid — 2fr (right) schedule | 3fr (left) alerts+feed */}
      {/* DOM order: alerts first (mobile top), schedule second (mobile bottom) */}
      {/* lg:order-* swaps them so schedule lands in the narrow right column on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4">

        {/* Alerts + feed — first in DOM → top on mobile; lg:order-2 → wide left column on desktop */}
        <div className="order-1 lg:order-2 space-y-4">

          {/* Urgent tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-red-100 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40">
              <span>🔥</span>
              <h2 className="text-sm font-bold text-red-700 dark:text-red-400">משימות דורשות טיפול</h2>
            </div>

            {urgentCount === 0 ? (
              <p className="px-5 py-6 text-sm text-center text-green-600 dark:text-green-400">✓ אין משימות פתוחות</p>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {missing_summaries?.map(item => (
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

                {at_risk_students?.count > 0 && (
                  <li className="px-5 py-3.5">
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 shrink-0">⚠️</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                          תלמידים ללא מגע (90+ יום): {at_risk_students.count}
                        </p>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                          {at_risk_students.students.slice(0, 3).map(s => (
                            <Link
                              key={s.id}
                              to={`/students/${s.id}`}
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {s.full_name}
                            </Link>
                          ))}
                          {at_risk_students.count > 3 && (
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              ועוד {at_risk_students.count - 3}
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

          {/* Activity feed */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">סיכום שבועי ופעולות אחרונות</h2>
              <Link
                to="/calendar"
                className="text-xs text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
              >
                {stats.events_this_week} פעולות השבוע
              </Link>
            </div>

            {recent_events.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">אין פעילות השבוע</p>
            ) : (
              <ul className="space-y-4">
                {recent_events.map(event => (
                  <li key={event.id} className="flex items-start gap-3">
                    <span className="text-lg mt-0.5 shrink-0">
                      {EVENT_TYPE_ICONS[event.event_type] ?? '📌'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">
                        {relativeDate(event.date)}
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        עם{' '}
                        <Link
                          to={`/students/${event.student_id}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {event.student_name}
                        </Link>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Schedule — second in DOM → bottom on mobile; lg:order-1 → narrow right column on desktop */}
        <div className="order-2 lg:order-1 space-y-4">

          {/* Today's meetings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">פגישות היום</h2>
              <span className="text-gray-400 dark:text-gray-500">📅</span>
            </div>

            {!upcoming_today?.length ? (
              <p className="text-sm text-gray-400 dark:text-gray-500">אין פגישות מתוכננות להיום</p>
            ) : (
              <ul className="space-y-3">
                {upcoming_today.map(item => (
                  <li key={item.id} className="flex items-start gap-3">
                    <span className="text-xs font-mono text-gray-400 dark:text-gray-500 w-12 shrink-0 mt-0.5">
                      {formatTime(item.date)}
                    </span>
                    <div className="w-1 self-stretch rounded-full bg-blue-400 dark:bg-blue-500 shrink-0" />
                    <div className="min-w-0">
                      <Link
                        to={`/students/${item.student_id}`}
                        className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 truncate block"
                      >
                        {item.student_name}
                      </Link>
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                        {item.title}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Follow-ups placeholder (Phase 2) */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-gray-400 dark:text-gray-500">מעקבים קרובים</h2>
              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 px-2 py-0.5 rounded-full">
                בקרוב
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500">תזכורות מעקב יוצגו כאן בגרסה הבאה</p>
          </div>
        </div>
      </div>
    </div>
  )
}
