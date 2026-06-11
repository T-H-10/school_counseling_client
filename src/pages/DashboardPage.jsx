import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getDashboard } from '../api/dashboard'
import { updateStudentEvent } from '../api/studentProfile'
import { getHebrewDateString, getTodayHoliday } from '../utils/hebrewDate'

const EVENT_TYPE_ICONS = {
  meeting: '📅',
  call: '📞',
  teacher_report: '📋',
  other: '📌',
}

const EVENT_TYPE_LABELS = {
  meeting: 'פגישה',
  call: 'שיחה',
  teacher_report: 'דיווח מורה',
  other: 'אחר',
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

function futureDateBadge(dateStr) {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const eventDay = new Date(dateStr); eventDay.setHours(0, 0, 0, 0)
  const dayDiff = Math.round((eventDay - today) / (1000 * 60 * 60 * 24))
  if (dayDiff === 1) return { label: 'מחר', cls: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300' }
  if (dayDiff <= 3) return { label: `בעוד ${dayDiff} ימים`, cls: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' }
  const d = new Date(dateStr)
  return { label: `${d.getDate()}/${d.getMonth() + 1}`, cls: 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400' }
}

function StatCard({ label, value, colorClass, icon, urgent }) {
  if (urgent) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-red-300 dark:border-red-700 p-5 flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{value}</p>
          <p className="text-sm text-red-500 dark:text-red-400 mt-0.5">{label}</p>
        </div>
        <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl bg-red-50 dark:bg-red-950 shrink-0">
          ⚠️
        </div>
      </div>
    )
  }
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
      </div>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl shrink-0 ${colorClass}`}>
        {icon}
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
  const [data, setData]                 = useState(null)
  const [todayMeetings, setTodayMeetings] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)

  useEffect(() => {
    getDashboard()
      .then(result => {
        setData(result)
        setTodayMeetings(result.alerts?.upcoming_today ?? [])
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  async function toggleStatus(item) {
    const next = item.status === 'completed' ? 'pending' : 'completed'
    setTodayMeetings(prev => prev.map(m => m.id === item.id ? { ...m, status: next } : m))
    try {
      await updateStudentEvent(item.id, { status: next })
    } catch {
      setTodayMeetings(prev => prev.map(m => m.id === item.id ? { ...m, status: item.status } : m))
      toast.error('שגיאה בעדכון הסטטוס')
    }
  }

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
  const { missing_summaries, at_risk_students, upcoming_future } = alerts ?? {}
  const hebrewDate = getHebrewDateString()
  const holiday    = getTodayHoliday()

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

      {/* KPI Row — DOM order reversed so urgent lands LEFT (inline-end) in RTL */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="תלמידות פעילות" value={stats.students_count}   icon="👥" colorClass="bg-green-50 dark:bg-green-950" />
        <StatCard label="פגישות היום"    value={todayMeetings.length}   icon="📅" colorClass="bg-blue-50 dark:bg-blue-950" />
        <StatCard label="פגישות השבוע"   value={stats.events_this_week} icon="📋" colorClass="bg-purple-50 dark:bg-purple-950" />
        <StatCard label="דורש טיפול עכשיו" value={urgentCount} urgent />
      </div>

      {/* Asymmetric main grid — Alerts DOM-first → col-1 RIGHT in RTL (3fr wide) */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4">

        {/* Alerts + feed — mobile: top; desktop: col 1 (RIGHT in RTL, 3fr wide) */}
        <div className="space-y-4">

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
                            <Link key={s.id} to={`/students/${s.id}`}
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
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
              <Link to="/calendar"
                className="text-xs text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
                {stats.events_this_week} פעולות השבוע
              </Link>
            </div>

            {recent_events.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">אין פעילות השבוע</p>
            ) : (
              <ul className="space-y-4">
                {recent_events.map(event => (
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
        </div>

        {/* Schedule — mobile: below; desktop: col 2 (LEFT in RTL, 2fr narrow) */}
        <div className="space-y-4">

          {/* Today's meetings with status toggle */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">פגישות היום</h2>
              <span className="text-gray-400 dark:text-gray-500">📅</span>
            </div>

            {todayMeetings.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500">אין פגישות מתוכננות להיום</p>
            ) : (
              <ul className="space-y-3">
                {todayMeetings.map(item => {
                  const completed = item.status === 'completed'
                  return (
                    <li key={item.id} className="flex items-start gap-3">
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
                        onClick={() => toggleStatus(item)}
                        aria-label={completed ? 'סמן כממתין' : 'סמן כהושלם'}
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

          {/* Follow-ups — real data */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">מעקבים קרובים</h2>
              <span className="text-gray-400 dark:text-gray-500">⏳</span>
            </div>

            {!upcoming_future?.length ? (
              <p className="text-sm text-gray-400 dark:text-gray-500">אין מעקבים מתוכננים בשבוע הקרוב</p>
            ) : (
              <ul className="space-y-3">
                {upcoming_future.map(item => {
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
        </div>
      </div>
    </div>
  )
}
